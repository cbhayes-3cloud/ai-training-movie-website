/** A film or series as the app uses it, independent of which API supplied it. */
export interface Title {
  /** Prefixed with the media type ("movie-550", "tv-1399") so movie and TV ids can't collide. */
  id: string;
  title: string;
  kind: 'movie' | 'series';
  year?: number;
  /** Runtime for films ("1h 54m"), season count for series ("2 seasons"). */
  length?: string;
  /** Average audience score out of 10. Missing when nobody has rated it yet. */
  rating?: number;
  voteCount?: number;
  genres: string[];
  synopsis?: string;
  /** Age rating exactly as the source gives it, such as "PG-13" or "13+". */
  ageRating?: string;
  posterUrl?: string;
  /** Wide artwork for the hero, at least 1600px. */
  backdropUrl?: string;
  trailerUrl?: string;
}

/** Someone in the cast or crew. */
export interface Person {
  id: string;
  name: string;
  /** The character for cast ("Mara Quill"), the job for crew ("Screenplay"). */
  role?: string;
  photoUrl?: string;
}

/** An audience review. */
export interface Review {
  id: string;
  author: string;
  /** ISO date the review was posted. */
  date: string;
  /** The reviewer's score out of 10, when they gave one. */
  rating?: number;
  /** Plain text. */
  text: string;
  /** The full review at its source. */
  url?: string;
}

/** Everything the title page shows. */
export interface TitleDetails extends Title {
  /** Films: ISO date of the US theatrical release, else the first release. Series: the first air date. */
  releaseDate?: string;
  /** Spoken languages, in English ("English", "Irish"). */
  languages: string[];
  directors: Person[];
  /** Series only: who created the show. */
  creators: Person[];
  writers: Person[];
  /** Billing order. */
  cast: Person[];
  /** The first few reviews, plus how many there are in all. */
  reviews: { total: number; items: Review[] };
  /** Where to watch in the US: subscription services by name, whether it can be rented or bought, and a page listing every option. */
  watch?: { stream: string[]; rentOrBuy: boolean; link?: string };
  /** "More like this". */
  similar: Title[];
}

/** Someone found by search, with what they're best known for. */
export interface PersonMatch extends Person {
  /** Their main line of work, such as "Acting" or "Directing". */
  department?: string;
  /** Their best-known films and series, most famous first. */
  knownFor: Title[];
}

/** One title on a person's page, with what they did on it. */
export interface Credit {
  /** Its poster is a small thumbnail. */
  title: Title;
  /** Cast: the character ("Maggie Dunne", or "Self"). Crew: the jobs ("Director, Screenplay"). */
  role?: string;
  /** Series: how many episodes they're credited in. */
  episodes?: number;
  /** ISO release or first air date. Missing for titles without one yet. */
  date?: string;
}

/** A person's credits in one line of work: "Acting", "Directing", "Writing" and so on. */
export interface CreditGroup {
  department: string;
  /** One per title, newest first, undated titles at the top. */
  credits: Credit[];
}

/** Everything the person page shows. */
export interface PersonDetails extends Person {
  /** Their main line of work, such as "Acting". */
  department?: string;
  /** Plain text; paragraphs are separated by newlines. */
  biography?: string;
  /** ISO dates. */
  birthday?: string;
  deathday?: string;
  birthplace?: string;
  /** Other names they're credited under, in Latin script. */
  aliases: string[];
  /** Their main department first, then the rest by size. */
  credits: CreditGroup[];
  /** Their best-known titles, most voted first, with full-size posters and backdrops. */
  knownFor: Title[];
  /** Pages about them elsewhere. */
  links: { imdb?: string; instagram?: string; homepage?: string };
}

/** What a search finds: films and series together, most popular first, and people. */
export interface SearchResults {
  titles: Title[];
  people: PersonMatch[];
}

/** One page of a search of a single kind, for the search results page. */
export interface SearchPage<T> {
  items: T[];
  /** Every match, across all pages. */
  total: number;
  page: number;
  totalPages: number;
  /** TMDB's popularity score for the first match, to put the stronger kind first. */
  topPopularity?: number;
}

/** Which side of the catalogue a browse page shows: films, series, or both mixed (the homepage). */
export type Media = Title['kind'] | 'all';

/** The curated lists a browse page shows. */
export type ListId = 'trending' | 'top-rated' | 'premieres' | 'new-this-week';

/**
 * Everything the UI needs from a movie data source. Implement this once per
 * provider and switch the export in `src/api/index.ts`.
 */
export interface CatalogApi {
  getFeatured(media: Media, signal?: AbortSignal): Promise<Title>;
  /**
   * The first `limit` titles of a list (default 20, a row's worth); the list pages ask for 100.
   * With media 'all', only trending exists as one list (TMDB's own mix); use `getListByKind` for the others.
   */
  getList(media: Media, list: ListId, signal?: AbortSignal, limit?: number): Promise<Title[]>;
  /** A list as TMDB gives it, films and series separately, each in TMDB's order. For the mixed homepage. */
  getListByKind(list: ListId, signal?: AbortSignal, limit?: number): Promise<Record<Title['kind'], Title[]>>;
  /** One title by its `Title.id`, for the title page. */
  getTitle(id: string, signal?: AbortSignal): Promise<TitleDetails>;
  /** One person by their `Person.id`, for the person page. */
  getPerson(id: string, signal?: AbortSignal): Promise<PersonDetails>;
  /** Genre labels to offer as filters, in display order. */
  getGenres(media: Media, signal?: AbortSignal): Promise<string[]>;
  /** Films, series and people whose names match `query`. */
  search(query: string, signal?: AbortSignal): Promise<SearchResults>;
  /** One page (from 1) of the films or series matching `query`, in TMDB's relevance order. */
  searchTitles(kind: Title['kind'], query: string, page: number, signal?: AbortSignal): Promise<SearchPage<Title>>;
  /** One page (from 1) of the people matching `query`, in TMDB's relevance order. */
  searchPeople(query: string, page: number, signal?: AbortSignal): Promise<SearchPage<PersonMatch>>;
}
