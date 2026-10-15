import { GenreChips } from 'reelscore';

const genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Crime', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Sci-fi'];

export const Desktop = () => (
  <div style={{ width: '100%' }}>
    <GenreChips genres={genres} defaultSelected={['Action', 'Animation', 'Comedy']} label="Filter by genre" />
  </div>
);

export const Phone = () => (
  <div style={{ width: 375 }}>
    <GenreChips genres={genres} defaultSelected={['Adventure']} label="Filter by genre" />
  </div>
);
