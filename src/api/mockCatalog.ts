import type { CatalogApi, ListId, Title, TitleDetails } from './types';

/*
 * Sample data for building the UI before a real API is connected.
 * Every title here is invented (they come from the Reelscore design concepts).
 */

const GENRES = ['Action', 'Adventure', 'Animation', 'Crime', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Sci-fi'];

// Ratings here are sample values; TMDB ratings come from vote_average.
const TITLES: Title[] = [
  { id: 'the-long-orbit', title: 'The Long Orbit', kind: 'series', year: 2024, length: '2 seasons', rating: 7.5, voteCount: 18400, ageRating: '13+', genres: ['Sci-fi', 'Drama'], synopsis: 'Stranded on a frozen moon, a salvage crew has one week to signal home before the station’s reactor fails.' },
  { id: 'harbor-lights', title: 'Harbor Lights', kind: 'movie', year: 2024, length: '1h 54m', rating: 8.1, voteCount: 12400, ageRating: '13+', genres: ['Drama', 'Crime'], synopsis: 'A ferry captain covers for her brother after a night crossing goes wrong.' },
  { id: 'ironbark', title: 'Ironbark', kind: 'movie', year: 2023, length: '2h 08m', rating: 7.3, voteCount: 9100, ageRating: '16+', genres: ['Action', 'Adventure'], synopsis: 'Two rival rangers track a wildfire arsonist across a drought-stricken forest.' },
  { id: 'salt-and-static', title: 'Salt & Static', kind: 'movie', year: 2025, length: '1h 41m', rating: 6.4, voteCount: 3200, ageRating: '13+', genres: ['Horror', 'Sci-fi'], synopsis: 'A coastal radio station starts receiving calls from listeners who drowned decades ago.' },
  { id: 'quiet-hours', title: 'Quiet Hours', kind: 'movie', year: 2024, length: '1h 36m', rating: 5.8, voteCount: 2100, ageRating: '7+', genres: ['Comedy', 'Drama'], synopsis: 'A night-shift librarian and an insomniac regular plan the perfect silent heist.' },
  { id: 'paper-lanterns', title: 'Paper Lanterns', kind: 'movie', year: 2021, length: '1h 49m', rating: 7.9, voteCount: 15800, ageRating: '7+', genres: ['Animation', 'Adventure'], synopsis: 'A girl follows a runaway lantern through the spirit market on the last night of summer.' },
  { id: 'northline', title: 'Northline', kind: 'movie', year: 2025, length: '2h 21m', rating: 9.4, voteCount: 41200, ageRating: '13+', genres: ['Drama', 'Adventure'], synopsis: 'Three generations of railway workers keep the last northern line running through one brutal winter.' },
  { id: 'glass-orchard', title: 'Glass Orchard', kind: 'movie', year: 2023, length: '1h 58m', rating: 6.9, voteCount: 4700, ageRating: '16+', genres: ['Crime', 'Drama'], synopsis: 'An insurance investigator unpicks a vineyard fire that made one family very rich.' },
  { id: 'field-of-small-hours', title: 'Field of Small Hours', kind: 'movie', year: 2019, length: '2h 02m', rating: 9.2, voteCount: 38900, ageRating: '13+', genres: ['Drama', 'History'], synopsis: 'The true story of a farmer who turned her failing land into the region’s first night market.' },
  { id: 'undertow', title: 'Undertow', kind: 'series', year: 2022, length: '3 seasons', rating: 9.1, voteCount: 52000, ageRating: '18+', genres: ['Crime', 'Drama'], synopsis: 'A harbour detective investigates the smuggling ring her own father built.' },
  { id: 'brass-hymnal', title: 'Brass Hymnal', kind: 'movie', year: 2018, length: '1h 47m', rating: 9.0, voteCount: 27300, ageRating: '7+', genres: ['Documentary', 'History'], synopsis: 'A colliery brass band fights to play one final concert after the pit closes.' },
  { id: 'the-cartographer', title: 'The Cartographer', kind: 'movie', year: 2020, length: '2h 15m', rating: 8.9, voteCount: 31000, ageRating: '13+', genres: ['Adventure', 'History'], synopsis: 'An exiled mapmaker charts a coastline no navy believes exists.' },
  { id: 'low-tide-radio', title: 'Low Tide Radio', kind: 'series', year: 2024, length: '1 season', rating: 8.8, voteCount: 8800, ageRating: '13+', genres: ['Comedy', 'Drama'], synopsis: 'A washed-up DJ takes over a seaside town’s failing community station.' },
  { id: 'kestrel', title: 'Kestrel', kind: 'movie', year: 2023, length: '1h 52m', rating: 8.7, voteCount: 19600, ageRating: '16+', genres: ['Action', 'Crime'], synopsis: 'A retired getaway driver is pulled back in for one job to save her son.' },
  { id: 'winter-ledger', title: 'Winter Ledger', kind: 'movie', year: 2021, length: '2h 04m', rating: 8.6, voteCount: 14200, ageRating: '13+', genres: ['Crime', 'Drama'], synopsis: 'A bank clerk finds a ledger that proves the town’s founders were frauds.' },
  { id: 'signal-fire', title: 'Signal Fire', kind: 'movie', year: 2026, length: '1h 59m', rating: 7.2, voteCount: 1400, ageRating: '13+', genres: ['Action', 'Sci-fi'], synopsis: 'When the satellites go dark, a lighthouse keeper becomes the coast’s only warning system.' },
  { id: 'copperhead-lane', title: 'Copperhead Lane', kind: 'series', year: 2026, length: '1 season', rating: 6.8, voteCount: 900, ageRating: '16+', genres: ['Crime', 'Horror'], synopsis: 'New neighbours on a quiet cul-de-sac discover why the houses are so cheap.' },
  { id: 'afterimage', title: 'Afterimage', kind: 'movie', year: 2026, length: '1h 44m', rating: 7.7, voteCount: 2600, ageRating: '13+', genres: ['Drama', 'Sci-fi'], synopsis: 'A photographer’s old negatives begin to show events that haven’t happened yet.' },
  { id: 'moth-season', title: 'Moth Season', kind: 'movie', year: 2026, length: '1h 31m', rating: 6.1, voteCount: 700, ageRating: '16+', genres: ['Horror'], synopsis: 'A summer camp reopens on the anniversary of the night everyone left.' },
  { id: 'open-water', title: 'Open Water', kind: 'movie', year: 2026, length: '1h 50m', rating: 7.9, voteCount: 2200, ageRating: '7+', genres: ['Documentary', 'Adventure'], synopsis: 'Four swimmers attempt the first relay crossing of the North Channel in winter.' },
  { id: 'little-thunder', title: 'Little Thunder', kind: 'series', year: 2026, length: '1 season', rating: 8.0, voteCount: 1800, ageRating: '7+', genres: ['Animation', 'Comedy'], synopsis: 'A small storm cloud tries to prove it can rain on its own.' },
  { id: 'saltgrass', title: 'Saltgrass', kind: 'movie', year: 2026, length: '1h 38m', rating: 6.6, voteCount: 500, ageRating: '13+', genres: ['Drama'], synopsis: 'A marsh warden and a developer’s daughter fall out, then fall in love.' },
];

const byId = new Map(TITLES.map((t) => [t.id, t]));
const pick = (ids: string[]) => ids.map((id) => byId.get(id)!).filter(Boolean);

const LISTS: Record<ListId, Title[]> = {
  trending: pick(['harbor-lights', 'ironbark', 'salt-and-static', 'the-long-orbit', 'quiet-hours', 'paper-lanterns', 'northline', 'glass-orchard']),
  'top-rated': [...TITLES].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 8),
  premieres: pick(['signal-fire', 'little-thunder', 'open-water', 'copperhead-lane', 'afterimage']),
  'new-this-week': pick(['signal-fire', 'copperhead-lane', 'afterimage', 'moth-season', 'open-water', 'little-thunder', 'saltgrass']),
};

/** Resolves after a short delay so loading states are exercised during development. */
function respond<T>(value: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(structuredClone(value)), 350);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/** The mock has no credits, reviews or providers, so those sections stay empty. */
function details(id: string): TitleDetails {
  const t = byId.get(id);
  if (!t) throw new Error(`There's no title with the id "${id}".`);
  return {
    ...t,
    languages: ['English'],
    directors: [],
    writers: [],
    cast: [],
    reviews: { total: 0, items: [] },
    similar: TITLES.filter((o) => o.id !== id && o.genres.some((g) => t.genres.includes(g))).slice(0, 10),
  };
}

export const mockCatalog: CatalogApi = {
  getFeatured: (signal) => respond(byId.get('the-long-orbit')!, signal),
  getList: (list, signal) => respond(LISTS[list], signal),
  getTitle: async (id, signal) => respond(details(id), signal),
  getGenres: (signal) => respond(GENRES, signal),
};
