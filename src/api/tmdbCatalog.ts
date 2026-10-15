import type { CatalogApi, ListId, Review, Title, TitleDetails } from './types';

/*
 * TMDB adapter (movies only). Requests go through our proxy at /api/tmdb, which
 * adds the credentials server-side; see server/tmdb-proxy.mjs.
 */

const API = '/api/tmdb';
const IMAGES = 'https://image.tmdb.org/t/p/';
const POSTER_SIZE = 'w500'; // cards are 184px wide, so w500 stays sharp on 2x screens
const PROFILE_SIZE = 'w185'; // cast photos are 88px circles
const BACKDROP_SIZE = 'original'; // the hero wants 1600px+, and the largest resized backdrop is w1280
const REGION = 'US';

/**
 * Genre chips, in the design's order. Labels follow the design voice ("Sci-fi");
 * the keys are TMDB's names. A design genre TMDB doesn't have (Biography) is left out.
 */
const GENRE_CHIPS: Record<string, string> = {
  Action: 'Action',
  Adventure: 'Adventure',
  Animation: 'Animation',
  Crime: 'Crime',
  Comedy: 'Comedy',
  Documentary: 'Documentary',
  Drama: 'Drama',
  Horror: 'Horror',
  'Science Fiction': 'Sci-fi',
};

interface TmdbMovie {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
}

interface TmdbMovieDetails extends Omit<TmdbMovie, 'genre_ids'> {
  runtime?: number | null;
  genres?: { id: number; name: string }[];
  spoken_languages?: { english_name: string; iso_639_1: string }[];
  release_dates?: {
    results: { iso_3166_1: string; release_dates: { certification: string; type: number; release_date: string }[] }[];
  };
  videos?: { results: { site: string; key: string; type: string; official?: boolean }[] };
  // The rest come from append_to_response on the title page.
  credits?: {
    cast: { id: number; name: string; character?: string; profile_path?: string | null }[];
    crew: { id: number; name: string; job: string; department: string; profile_path?: string | null }[];
  };
  reviews?: Page<TmdbReview> & { total_results: number };
  recommendations?: Page<TmdbMovie>;
  similar?: Page<TmdbMovie>;
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
 * Genre ids → display labels, fetched once and shared. The shared request takes no
 * caller's AbortSignal: one caller cancelling must not fail everyone waiting on it.
 */
let genreMap: Promise<Map<number, string>> | undefined;
function genres() {
  genreMap ??= get<{ genres: { id: number; name: string }[] }>('/genre/movie/list')
    .then(({ genres: list }) => new Map(list.map((g) => [g.id, GENRE_CHIPS[g.name] ?? g.name])))
    .catch((err) => {
      genreMap = undefined; // let the next caller retry
      throw err;
    });
  return genreMap;
}

const image = (size: string, path?: string | null) => (path ? `${IMAGES}${size}${path}` : undefined);
const yearOf = (date?: string) => (date ? Number(date.slice(0, 4)) || undefined : undefined);
/* Below this many votes a score is noise (unreleased films often show 10.0 from one vote), so treat it as unrated. */
const MIN_VOTES_FOR_SCORE = 10;
const scoreOf = (m: TmdbMovie) =>
  (m.vote_count ?? 0) >= MIN_VOTES_FOR_SCORE && m.vote_average ? Math.round(m.vote_average * 10) / 10 : undefined;

function formatRuntime(minutes?: number | null) {
  if (!minutes) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}

function toTitle(m: TmdbMovie, genreNames: string[]): Title {
  return {
    id: `movie-${m.id}`,
    title: m.title,
    kind: 'movie',
    year: yearOf(m.release_date),
    rating: scoreOf(m),
    voteCount: m.vote_count,
    genres: genreNames,
    synopsis: m.overview || undefined,
    posterUrl: image(POSTER_SIZE, m.poster_path),
    backdropUrl: image(BACKDROP_SIZE, m.backdrop_path),
  };
}

async function list(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<Title[]> {
  const [page, names] = await Promise.all([get<Page<TmdbMovie>>(path, params, signal), genres()]);
  return page.results.map((m) =>
    toTitle(m, (m.genre_ids ?? []).map((id) => names.get(id)).filter((n): n is string => Boolean(n))),
  );
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const LISTS: Record<ListId, (signal?: AbortSignal) => Promise<Title[]>> = {
  trending: (signal) => list('/trending/movie/week', {}, signal),
  'top-rated': (signal) => list('/movie/top_rated', { region: REGION }, signal),
  premieres: (signal) => list('/movie/upcoming', { region: REGION }, signal),
  'new-this-week': (signal) => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return list(
      '/discover/movie',
      {
        region: REGION,
        'primary_release_date.gte': isoDate(weekAgo),
        'primary_release_date.lte': isoDate(today),
        sort_by: 'popularity.desc',
        include_adult: 'false',
      },
      signal,
    );
  },
};

/** US certification, preferring the theatrical release (type 3), exactly as TMDB gives it. */
function certificationOf(details: TmdbMovieDetails) {
  const us = details.release_dates?.results.find((r) => r.iso_3166_1 === REGION)?.release_dates ?? [];
  const rated = us.filter((r) => r.certification);
  return (rated.find((r) => r.type === 3) ?? rated[0])?.certification;
}

function trailerOf(details: TmdbMovieDetails) {
  const trailers = (details.videos?.results ?? []).filter((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const best = trailers.find((v) => v.official) ?? trailers[0];
  return best ? `https://www.youtube.com/watch?v=${best.key}` : undefined;
}

/** US theatrical release date (type 3), else the first release TMDB lists. */
function releaseDateOf(details: TmdbMovieDetails) {
  const us = details.release_dates?.results.find((r) => r.iso_3166_1 === REGION)?.release_dates ?? [];
  const theatrical = us.find((r) => r.type === 3)?.release_date;
  return (theatrical ?? details.release_date)?.slice(0, 10) || undefined;
}

const CAST_SHOWN = 15;
const REVIEWS_SHOWN = 3;

/** Writing jobs in billing order; anything else (such as "Characters" for comic creators) comes last. */
const WRITING_JOBS = ['Screenplay', 'Writer', 'Story', 'Novel', 'Book', 'Author'];
const writingRank = (job: string) => {
  const i = WRITING_JOBS.indexOf(job);
  return i < 0 ? WRITING_JOBS.length : i;
};

/** Writing credits, one per person, under their highest-billed job. */
function writersOf(crew: NonNullable<TmdbMovieDetails['credits']>['crew']) {
  const seen = new Set<number>();
  return crew
    .filter((c) => c.department === 'Writing')
    .sort((a, b) => writingRank(a.job) - writingRank(b.job))
    .filter((c) => !seen.has(c.id) && seen.add(c.id))
    .map((c) => ({ id: `person-${c.id}`, name: c.name, role: c.job }));
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

function watchOf(details: TmdbMovieDetails): TitleDetails['watch'] {
  const us = details['watch/providers']?.results[REGION];
  if (!us) return undefined;
  const stream = [...(us.flatrate ?? [])].sort((a, b) => a.display_priority - b.display_priority).map((p) => p.provider_name);
  return { stream, rentOrBuy: Boolean(us.rent?.length || us.buy?.length), link: us.link };
}

export const tmdbCatalog: CatalogApi = {
  async getFeatured(signal) {
    // Today's top trending film that has artwork and a synopsis to show.
    const { results } = await get<Page<TmdbMovie>>('/trending/movie/day', {}, signal);
    const pick = results.find((m) => m.backdrop_path && m.overview) ?? results[0];
    if (!pick) throw new Error('TMDB returned no trending films.');

    const d = await get<TmdbMovieDetails>(`/movie/${pick.id}`, { append_to_response: 'release_dates,videos' }, signal);
    return {
      ...toTitle(d, (d.genres ?? []).map((g) => GENRE_CHIPS[g.name] ?? g.name)),
      length: formatRuntime(d.runtime),
      ageRating: certificationOf(d),
      trailerUrl: trailerOf(d),
    };
  },

  getList: (id, signal) => LISTS[id](signal),

  async getTitle(id, signal) {
    const tmdbId = /^movie-(\d+)$/.exec(id)?.[1];
    if (!tmdbId) throw new Error(`There's no film with the id "${id}".`);

    // One request for the whole page; append_to_response folds the sub-resources in.
    const [d, names] = await Promise.all([
      get<TmdbMovieDetails>(
        `/movie/${tmdbId}`,
        { append_to_response: 'release_dates,videos,credits,reviews,recommendations,similar,watch/providers' },
        signal,
      ),
      genres(),
    ]);
    const credits = d.credits ?? { cast: [], crew: [] };
    const related = d.recommendations?.results.length ? d.recommendations.results : (d.similar?.results ?? []);

    return {
      ...toTitle(d, (d.genres ?? []).map((g) => GENRE_CHIPS[g.name] ?? g.name)),
      length: formatRuntime(d.runtime),
      ageRating: certificationOf(d),
      trailerUrl: trailerOf(d),
      releaseDate: releaseDateOf(d),
      languages: (d.spoken_languages ?? []).map((l) => l.english_name).filter(Boolean),
      directors: credits.crew
        .filter((c) => c.job === 'Director')
        .map((c) => ({ id: `person-${c.id}`, name: c.name, role: c.job })),
      writers: writersOf(credits.crew),
      cast: credits.cast.slice(0, CAST_SHOWN).map((c) => ({
        id: `person-${c.id}`,
        name: c.name,
        role: c.character || undefined,
        photoUrl: image(PROFILE_SIZE, c.profile_path),
      })),
      reviews: {
        total: d.reviews?.total_results ?? 0,
        items: (d.reviews?.results ?? []).slice(0, REVIEWS_SHOWN).map(toReview),
      },
      watch: watchOf(d),
      similar: related.map((m) =>
        toTitle(m, (m.genre_ids ?? []).map((gid) => names.get(gid)).filter((n): n is string => Boolean(n))),
      ),
    };
  },

  async getGenres() {
    const available = new Set((await genres()).values());
    return Object.values(GENRE_CHIPS).filter((label) => available.has(label));
  },
};
