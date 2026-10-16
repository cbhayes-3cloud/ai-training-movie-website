import type { CatalogApi, ListId, Media, Person, Review, Title, TitleDetails } from './types';

/*
 * TMDB adapter for films and series. Requests go through our proxy at /api/tmdb,
 * which adds the credentials server-side; see server/tmdb-proxy.mjs.
 */

const API = '/api/tmdb';
const IMAGES = 'https://image.tmdb.org/t/p/';
const POSTER_SIZE = 'w500'; // cards are 184px wide, so w500 stays sharp on 2x screens
const PROFILE_SIZE = 'h632'; // CastStrip frames are 152×208, so h632 stays sharp on 2x screens
const BACKDROP_SIZE = 'original'; // the hero wants 1600px+, and the largest resized backdrop is w1280
const REGION = 'US';

/** A film or a series; `Media` adds 'all' for the mixed homepage. */
type Kind = Title['kind'];

/** TMDB's path segment for each kind; also the prefix of our title ids ("tv-1399"). */
const PATH: Record<Kind, 'movie' | 'tv'> = { movie: 'movie', series: 'tv' };
const KIND_OF: Record<string, Kind | undefined> = { movie: 'movie', tv: 'series' };

/**
 * Genre chips, in the design's order. Labels follow the design voice ("Sci-fi");
 * the keys are TMDB's names. A design genre TMDB doesn't have (Biography) is left out.
 * TMDB's TV genres differ from its film genres (it pairs Action & Adventure, for one),
 * so the mixed homepage folds the film genres into the broader TV ones, and a chip
 * there matches both kinds.
 */
const GENRE_CHIPS: Record<Media, Record<string, string>> = {
  movie: {
    Action: 'Action',
    Adventure: 'Adventure',
    Animation: 'Animation',
    Crime: 'Crime',
    Comedy: 'Comedy',
    Documentary: 'Documentary',
    Drama: 'Drama',
    Horror: 'Horror',
    'Science Fiction': 'Sci-fi',
  },
  series: {
    'Action & Adventure': 'Action & adventure',
    Animation: 'Animation',
    Crime: 'Crime',
    Comedy: 'Comedy',
    Documentary: 'Documentary',
    Drama: 'Drama',
    Mystery: 'Mystery',
    'Sci-Fi & Fantasy': 'Sci-fi & fantasy',
  },
  all: {
    Action: 'Action & adventure',
    Adventure: 'Action & adventure',
    'Action & Adventure': 'Action & adventure',
    Animation: 'Animation',
    Crime: 'Crime',
    Comedy: 'Comedy',
    Documentary: 'Documentary',
    Drama: 'Drama',
    Horror: 'Horror',
    Mystery: 'Mystery',
    'Science Fiction': 'Sci-fi & fantasy',
    Fantasy: 'Sci-fi & fantasy',
    'Sci-Fi & Fantasy': 'Sci-fi & fantasy',
  },
};

/** A TMDB genre name as a chip label for this page; one label may cover several TMDB genres. */
const genreLabel = (media: Media, name: string) => GENRE_CHIPS[media][name] ?? name;
const unique = (labels: string[]) => [...new Set(labels)];

/** TV genre ids for news and talk shows, which flood the "new" lists with daily episodes. */
const TV_NEWS_AND_TALK = '10763|10767';

/** A film or series in a list. Films have `title`/`release_date`; series have `name`/`first_air_date`. */
interface TmdbItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
  /** Only on the mixed `/trending/all` lists: "movie", "tv" or "person". */
  media_type?: string;
}

interface TmdbDetails extends Omit<TmdbItem, 'genre_ids'> {
  runtime?: number | null;
  number_of_seasons?: number;
  created_by?: { id: number; name: string; profile_path?: string | null }[];
  genres?: { id: number; name: string }[];
  spoken_languages?: { english_name: string; iso_639_1: string }[];
  release_dates?: {
    results: { iso_3166_1: string; release_dates: { certification: string; type: number; release_date: string }[] }[];
  };
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
  videos?: { results: { site: string; key: string; type: string; official?: boolean }[] };
  // The rest come from append_to_response on the title page.
  credits?: {
    cast: { id: number; name: string; character?: string; profile_path?: string | null }[];
    crew: { id: number; name: string; job: string; department: string; profile_path?: string | null }[];
  };
  /** Series: cast across every season, not just the latest. */
  aggregate_credits?: {
    cast: { id: number; name: string; profile_path?: string | null; roles?: { character?: string }[] }[];
  };
  reviews?: Page<TmdbReview> & { total_results: number };
  recommendations?: Page<TmdbItem>;
  similar?: Page<TmdbItem>;
  'watch/providers'?: {
    results: Record<string, { link?: string; flatrate?: TmdbProvider[]; rent?: TmdbProvider[]; buy?: TmdbProvider[] }>;
  };
}

interface TmdbReview {
  id: string;
  author: string;
  author_details?: { name?: string; username?: string; rating?: number | null };
  content: string;
  created_at: string;
  url?: string;
}

interface TmdbProvider {
  provider_name: string;
  display_priority: number;
}

interface Page<T> {
  results: T[];
}

async function get<T>(path: string, params: Record<string, string> = {}, signal?: AbortSignal): Promise<T> {
  const query = new URLSearchParams({ language: 'en-US', ...params });
  const res = await fetch(`${API}${path}?${query}`, { signal });
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json()).error ?? '';
    } catch {
      // body wasn't JSON
    }
    throw new Error(`TMDB request for ${path} failed (${res.status})${detail ? `: ${detail}` : ''}`);
  }
  return res.json() as Promise<T>;
}

/*
 * Genre ids → TMDB genre names, fetched once per kind and shared. The shared request
 * takes no caller's AbortSignal: one caller cancelling must not fail everyone waiting on it.
 */
const genreMaps: Partial<Record<Kind, Promise<Map<number, string>>>> = {};
function genres(kind: Kind) {
  return (genreMaps[kind] ??= get<{ genres: { id: number; name: string }[] }>(`/genre/${PATH[kind]}/list`)
    .then(({ genres: list }) => new Map(list.map((g) => [g.id, g.name])))
    .catch((err) => {
      delete genreMaps[kind]; // let the next caller retry
      throw err;
    }));
}

const image = (size: string, path?: string | null) => (path ? `${IMAGES}${size}${path}` : undefined);
const yearOf = (date?: string) => (date ? Number(date.slice(0, 4)) || undefined : undefined);
/* Below this many votes a score is noise (unreleased films often show 10.0 from one vote), so treat it as unrated. */
const MIN_VOTES_FOR_SCORE = 10;
const scoreOf = (m: TmdbItem) =>
  (m.vote_count ?? 0) >= MIN_VOTES_FOR_SCORE && m.vote_average ? Math.round(m.vote_average * 10) / 10 : undefined;

function formatRuntime(minutes?: number | null) {
  if (!minutes) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}

const formatSeasons = (n?: number) => (n ? `${n} season${n === 1 ? '' : 's'}` : undefined);

function toTitle(m: TmdbItem, genreNames: string[], kind: Kind): Title {
  return {
    id: `${PATH[kind]}-${m.id}`,
    title: m.title ?? m.name ?? '',
    kind,
    year: yearOf(m.release_date ?? m.first_air_date),
    rating: scoreOf(m),
    voteCount: m.vote_count,
    genres: genreNames,
    synopsis: m.overview || undefined,
    posterUrl: image(POSTER_SIZE, m.poster_path),
    backdropUrl: image(BACKDROP_SIZE, m.backdrop_path),
  };
}

/** Genre chip labels for a list item, labelled for the page that shows it. */
const namesFor = (ids: number[] | undefined, names: Map<number, string>, media: Media) =>
  unique((ids ?? []).map((id) => names.get(id)).filter((n): n is string => Boolean(n)).map((n) => genreLabel(media, n)));

/** TMDB serves lists 20 to a page. */
const PAGE_SIZE = 20;

/**
 * The first `limit` items of a TMDB list, fetching as many pages as that takes, in parallel.
 * Pages past the end come back empty, and an item that shifts between pages while they load is kept once.
 * Multi-page lists fetch one spare page so those duplicates don't leave the list short.
 */
async function pages(path: string, params: Record<string, string>, limit: number, signal?: AbortSignal): Promise<TmdbItem[]> {
  const count = Math.ceil(limit / PAGE_SIZE) + (limit > PAGE_SIZE ? 1 : 0);
  const results = await Promise.all(
    Array.from({ length: count }, (_, i) => get<Page<TmdbItem>>(path, { ...params, page: String(i + 1) }, signal)),
  );
  const seen = new Set<string>();
  return results
    .flatMap((r) => r.results)
    .filter((m) => {
      const key = `${m.media_type ?? ''}-${m.id}`;
      return !seen.has(key) && seen.add(key);
    })
    .slice(0, limit);
}

/** One TMDB list of a single kind. `media` is the page's, which decides the genre labels. */
async function list(
  kind: Kind,
  media: Media,
  path: string,
  params: Record<string, string>,
  limit: number,
  signal?: AbortSignal,
): Promise<Title[]> {
  const [items, names] = await Promise.all([pages(path, params, limit, signal), genres(kind)]);
  return items.map((m) => toTitle(m, namesFor(m.genre_ids, names, media), kind));
}

/** A `/trending/all` list: films and series together, each tagged with `media_type`. People are dropped. */
async function mixedList(path: string, limit: number, signal?: AbortSignal): Promise<Title[]> {
  // One extra page makes up for the people that get dropped.
  const [items, movieNames, tvNames] = await Promise.all([
    pages(path, {}, limit + PAGE_SIZE, signal),
    genres('movie'),
    genres('series'),
  ]);
  return items.flatMap((m) => {
    const kind = KIND_OF[m.media_type ?? ''];
    if (!kind) return [];
    return [toTitle(m, namesFor(m.genre_ids, kind === 'movie' ? movieNames : tvNames, 'all'), kind)];
  }).slice(0, limit);
}

const DAY = 24 * 60 * 60 * 1000;
const isoDate = (d: Date) => d.toISOString().slice(0, 10);
const daysFromToday = (days: number) => isoDate(new Date(Date.now() + days * DAY));

/** Each kind's lists. `media` is the page showing them: the homepage labels genres its own way. */
const LISTS: Record<Kind, Record<ListId, (media: Media, limit: number, signal?: AbortSignal) => Promise<Title[]>>> = {
  movie: {
    trending: (media, limit, signal) => list('movie', media, '/trending/movie/week', {}, limit, signal),
    'top-rated': (media, limit, signal) => list('movie', media, '/movie/top_rated', { region: REGION }, limit, signal),
    // Films whose first-ever release is in the next month. /movie/upcoming would also list re-releases
    // (it counts any US theatrical date in its window), so a 1976 film could show as a premiere.
    premieres: (media, limit, signal) =>
      list(
        'movie',
        media,
        '/discover/movie',
        {
          'primary_release_date.gte': daysFromToday(1),
          'primary_release_date.lte': daysFromToday(30),
          sort_by: 'popularity.desc',
          include_adult: 'false',
        },
        limit,
        signal,
      ),
    'new-this-week': (media, limit, signal) =>
      list(
        'movie',
        media,
        '/discover/movie',
        {
          region: REGION,
          'primary_release_date.gte': daysFromToday(-7),
          'primary_release_date.lte': daysFromToday(0),
          sort_by: 'popularity.desc',
          include_adult: 'false',
        },
        limit,
        signal,
      ),
  },
  series: {
    trending: (media, limit, signal) => list('series', media, '/trending/tv/week', {}, limit, signal),
    'top-rated': (media, limit, signal) => list('series', media, '/tv/top_rated', {}, limit, signal),
    // Shows whose first episode airs in the next month.
    premieres: (media, limit, signal) =>
      list(
        'series',
        media,
        '/discover/tv',
        {
          'first_air_date.gte': daysFromToday(1),
          'first_air_date.lte': daysFromToday(30),
          sort_by: 'popularity.desc',
          without_genres: TV_NEWS_AND_TALK,
          include_adult: 'false',
        },
        limit,
        signal,
      ),
    'new-this-week': (media, limit, signal) =>
      list(
        'series',
        media,
        '/discover/tv',
        {
          'first_air_date.gte': daysFromToday(-7),
          'first_air_date.lte': daysFromToday(0),
          sort_by: 'popularity.desc',
          without_genres: TV_NEWS_AND_TALK,
          include_adult: 'false',
        },
        limit,
        signal,
      ),
  },
};

/** Films: US certification, preferring the theatrical release (type 3). Series: the US TV rating. Exactly as TMDB gives it. */
function ageRatingOf(d: TmdbDetails, kind: Kind) {
  if (kind === 'series') return d.content_ratings?.results.find((r) => r.iso_3166_1 === REGION)?.rating || undefined;
  const us = d.release_dates?.results.find((r) => r.iso_3166_1 === REGION)?.release_dates ?? [];
  const rated = us.filter((r) => r.certification);
  return (rated.find((r) => r.type === 3) ?? rated[0])?.certification;
}

function trailerOf(d: TmdbDetails) {
  const trailers = (d.videos?.results ?? []).filter((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const best = trailers.find((v) => v.official) ?? trailers[0];
  return best ? `https://www.youtube.com/watch?v=${best.key}` : undefined;
}

/** Films: the US theatrical release date (type 3), else the first release. Series: the first air date. */
function releaseDateOf(d: TmdbDetails, kind: Kind) {
  if (kind === 'series') return d.first_air_date || undefined;
  const us = d.release_dates?.results.find((r) => r.iso_3166_1 === REGION)?.release_dates ?? [];
  const theatrical = us.find((r) => r.type === 3)?.release_date;
  return (theatrical ?? d.release_date)?.slice(0, 10) || undefined;
}

/** What the hero shows for every title: runtime or seasons, age rating and trailer. */
function heroFields(d: TmdbDetails, kind: Kind) {
  return {
    length: kind === 'movie' ? formatRuntime(d.runtime) : formatSeasons(d.number_of_seasons),
    ageRating: ageRatingOf(d, kind),
    trailerUrl: trailerOf(d),
  };
}

/** The sub-resources each media type needs: films have release dates and credits; series have TV ratings and whole-run credits. */
const HERO_APPEND: Record<Kind, string> = { movie: 'release_dates,videos', series: 'content_ratings,videos' };
const PAGE_APPEND: Record<Kind, string> = {
  movie: 'release_dates,videos,credits,reviews,recommendations,similar,watch/providers',
  series: 'content_ratings,videos,aggregate_credits,reviews,recommendations,similar,watch/providers',
};

const CAST_SHOWN = 15;
const REVIEWS_SHOWN = 3;

/** Writing jobs in billing order; anything else (such as "Characters" for comic creators) comes last. */
const WRITING_JOBS = ['Screenplay', 'Writer', 'Story', 'Novel', 'Book', 'Author'];
const writingRank = (job: string) => {
  const i = WRITING_JOBS.indexOf(job);
  return i < 0 ? WRITING_JOBS.length : i;
};

/** Writing credits, one per person, under their highest-billed job. */
function writersOf(crew: NonNullable<TmdbDetails['credits']>['crew']) {
  const seen = new Set<number>();
  return crew
    .filter((c) => c.department === 'Writing')
    .sort((a, b) => writingRank(a.job) - writingRank(b.job))
    .filter((c) => !seen.has(c.id) && seen.add(c.id))
    .map((c) => ({ id: `person-${c.id}`, name: c.name, role: c.job }));
}

function castOf(d: TmdbDetails, kind: Kind): Person[] {
  const cast =
    kind === 'series'
      ? (d.aggregate_credits?.cast ?? []).map((c) => ({ ...c, character: c.roles?.[0]?.character }))
      : (d.credits?.cast ?? []);
  return cast.slice(0, CAST_SHOWN).map((c) => ({
    id: `person-${c.id}`,
    name: c.name,
    role: c.character || undefined,
    photoUrl: image(PROFILE_SIZE, c.profile_path),
  }));
}

/** TMDB review bodies are user-written markdown with stray HTML; keep plain text. */
function plainText(markup: string) {
  return markup
    .replace(/<[^>]+>/g, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function toReview(r: TmdbReview): Review {
  const rating = r.author_details?.rating;
  return {
    id: r.id,
    author: r.author_details?.name || r.author,
    date: r.created_at,
    rating: rating ? rating : undefined,
    text: plainText(r.content),
    url: r.url,
  };
}

function watchOf(d: TmdbDetails): TitleDetails['watch'] {
  const us = d['watch/providers']?.results[REGION];
  if (!us) return undefined;
  const stream = [...(us.flatrate ?? [])].sort((a, b) => a.display_priority - b.display_priority).map((p) => p.provider_name);
  return { stream, rentOrBuy: Boolean(us.rent?.length || us.buy?.length), link: us.link };
}

const detailGenres = (d: TmdbDetails, media: Media) => unique((d.genres ?? []).map((g) => genreLabel(media, g.name)));

const NO_TRENDING: Record<Media, string> = { movie: 'films', series: 'series', all: 'films or series' };

export const tmdbCatalog: CatalogApi = {
  async getFeatured(media, signal) {
    // Today's top trending title that has artwork and a synopsis to show. On the homepage that's a film or a series.
    const path = media === 'all' ? '/trending/all/day' : `/trending/${PATH[media]}/day`;
    const { results } = await get<Page<TmdbItem>>(path, {}, signal);
    const kindOf = (m: TmdbItem) => (media === 'all' ? KIND_OF[m.media_type ?? ''] : media);
    const shows = results.filter((m) => kindOf(m));
    const pick = shows.find((m) => m.backdrop_path && m.overview) ?? shows[0];
    if (!pick) throw new Error(`TMDB returned no trending ${NO_TRENDING[media]}.`);
    const kind = kindOf(pick)!;

    const d = await get<TmdbDetails>(`/${PATH[kind]}/${pick.id}`, { append_to_response: HERO_APPEND[kind] }, signal);
    return { ...toTitle(d, detailGenres(d, media), kind), ...heroFields(d, kind) };
  },

  async getList(media, id, signal, limit = PAGE_SIZE) {
    if (media !== 'all') return LISTS[media][id](media, limit, signal);
    // TMDB mixes films and series only for trending, in its own order.
    if (id === 'trending') return mixedList('/trending/all/week', limit, signal);
    throw new Error(`TMDB has no mixed "${id}" list; use getListByKind for films and series separately.`);
  },

  async getListByKind(id, signal, limit = PAGE_SIZE) {
    // Labelled 'all', so genre chips on the mixed homepage match both lists.
    const [movie, series] = await Promise.all([LISTS.movie[id]('all', limit, signal), LISTS.series[id]('all', limit, signal)]);
    return { movie, series };
  },

  async getTitle(id, signal) {
    const match = /^(movie|tv)-(\d+)$/.exec(id);
    if (!match) throw new Error(`There's no title with the id "${id}".`);
    const kind: Kind = match[1] === 'tv' ? 'series' : 'movie';

    // One request for the whole page; append_to_response folds the sub-resources in.
    const [d, names] = await Promise.all([
      get<TmdbDetails>(`/${PATH[kind]}/${match[2]}`, { append_to_response: PAGE_APPEND[kind] }, signal),
      genres(kind),
    ]);
    const crew = d.credits?.crew ?? [];
    const related = d.recommendations?.results.length ? d.recommendations.results : (d.similar?.results ?? []);

    return {
      ...toTitle(d, detailGenres(d, kind), kind),
      ...heroFields(d, kind),
      releaseDate: releaseDateOf(d, kind),
      languages: (d.spoken_languages ?? []).map((l) => l.english_name).filter(Boolean),
      // Series credit their creators; per-episode directors and writers would be noise.
      directors: crew.filter((c) => c.job === 'Director').map((c) => ({ id: `person-${c.id}`, name: c.name, role: c.job })),
      creators: (d.created_by ?? []).map((c) => ({ id: `person-${c.id}`, name: c.name, role: 'Creator' })),
      writers: writersOf(crew),
      cast: castOf(d, kind),
      reviews: {
        total: d.reviews?.total_results ?? 0,
        items: (d.reviews?.results ?? []).slice(0, REVIEWS_SHOWN).map(toReview),
      },
      watch: watchOf(d),
      similar: related.map((m) => toTitle(m, namesFor(m.genre_ids, names, kind), kind)),
    };
  },

  async getGenres(media) {
    // Offer only the chips TMDB actually has genres for, so every chip can match something.
    const kinds: Kind[] = media === 'all' ? ['movie', 'series'] : [media];
    const maps = await Promise.all(kinds.map(genres));
    const available = new Set(maps.flatMap((m) => [...m.values()]).map((name) => genreLabel(media, name)));
    return unique(Object.values(GENRE_CHIPS[media])).filter((label) => available.has(label));
  },
};
