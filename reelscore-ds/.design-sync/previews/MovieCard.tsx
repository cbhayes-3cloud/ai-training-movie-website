import { useState } from 'react';
import { MovieCard } from 'reelscore';

export const Default = () => {
  const [liked, setLiked] = useState(true);
  const [watched, setWatched] = useState(false);
  return (
    <div style={{ padding: 16, background: 'var(--surface-100)' }}>
      <MovieCard title="Harbor Lights" year="2024" kind="Film" rating={8.1} tone="night"
        liked={liked} onLike={() => setLiked(!liked)} watched={watched} onWatched={() => setWatched(!watched)} />
    </div>
  );
};

export const Tones = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 16, background: 'var(--surface-100)' }}>
    <MovieCard title="Ironbark" year="2023" rating={7.3} tone="red" liked onLike={() => {}} onWatched={() => {}} />
    <MovieCard title="The Long Orbit" year="2022" kind="2 seasons" rating={9.2} tone="gold" />
    <MovieCard title="Salt & Static" year="2025" rating={6.4} tone="slate" watched onLike={() => {}} onWatched={() => {}} />
  </div>
);

export const LongTitle = () => (
  <div style={{ padding: 16, background: 'var(--surface-100)' }}>
    <MovieCard title="The Long Orbit: Second Contact" year="2022" kind="2 seasons" rating={9.2} tone="night" />
  </div>
);
