import { PosterRow, MovieCard } from 'reelscore';

const films: [string, string, number, 'night' | 'red' | 'gold' | 'slate'][] = [
  ['Harbor Lights', '2024', 8.1, 'night'], ['Ironbark', '2023', 7.3, 'red'], ['Salt & Static', '2025', 6.4, 'slate'],
  ['The Long Orbit', '2022', 9.2, 'gold'], ['Quiet Hours', '2024', 5.8, 'night'], ['Paper Lanterns', '2021', 7.9, 'slate'],
  ['Northline', '2025', 8.6, 'red'], ['Glass Orchard', '2023', 6.9, 'night'],
];
const cards = (n: number) => films.slice(0, n).map(([title, year, rating, tone], i) => (
  <MovieCard key={title} title={title} year={year} rating={rating} tone={tone}
    liked={i % 3 === 0} watched={i % 2 === 0} onLike={() => {}} onWatched={() => {}} />
));

export const Desktop = () => (
  <div style={{ width: '100%', background: 'var(--surface-100)' }}>
    <PosterRow title="Trending now" seeAllHref="#">{cards(8)}</PosterRow>
  </div>
);

export const Phone = () => (
  <div style={{ width: 375, background: 'var(--surface-100)' }}>
    <PosterRow title="Because you rated Ironbark" seeAllHref="#">{cards(6)}</PosterRow>
  </div>
);
