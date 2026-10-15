/** A film or series as the app uses it, independent of which API supplied it. */
export interface Title {
  /** Prefixed with the media type ("movie-550") so movie and TV ids can't collide. */
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
  /** ISO date of the US theatrical release, else the first release. */
  releaseDate?: string;
  /** Spoken languages, in English ("English", "Irish"). */
  languages: string[];
  directors: Person[];
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

/** The curated lists the homepage shows. */
export type ListId = 'trending' | 'top-rated' | 'premieres' | 'new-this-week';

/**
 * Everything the UI needs from a movie data source. Implement this once per
 * provider and switch the export in `src/api/index.ts`.
 */
export interface CatalogApi {
  getFeatured(signal?: AbortSignal): Promise<Title>;
  getList(list: ListId, signal?: AbortSignal): Promise<Title[]>;
  /** One title by its `Title.id`, for the title page. */
  getTitle(id: string, signal?: AbortSignal): Promise<TitleDetails>;
  /** Genre labels to offer as filters, in display order. */
  getGenres(signal?: AbortSignal): Promise<string[]>;
}
