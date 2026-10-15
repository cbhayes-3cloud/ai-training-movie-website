import type { ReactNode } from 'react';
import { Hero } from 'reelscore';
import type { Title } from '../api';
import type { AsyncState } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';
import { shorten } from '../text';

interface FeaturedHeroProps {
  state: AsyncState<Title>;
  library: LibraryApi;
  /** The band along the hero's bottom edge, usually the browse Tabs. */
  children?: ReactNode;
}

export function FeaturedHero({ state, library, children }: FeaturedHeroProps) {
  if (state.status !== 'ready') {
    // Keep the hero's footprint while loading (or if the feature fails) so the page doesn't jump.
    return (
      <div className="hero-placeholder" aria-busy={state.status === 'loading'}>
        <div className="hero-placeholder__body" />
        {children}
      </div>
    );
  }

  const t = state.data;
  const saved = library.inMyList(t.id);

  return (
    <Hero
      title={t.title}
      image={t.backdropUrl}
      ageRating={t.ageRating}
      rating={t.rating}
      year={t.year}
      length={t.length}
      synopsis={shorten(t.synopsis, 160) /* the design keeps hero copy under 160 characters */}
      watchLabel="Watch trailer"
      onWatch={t.trailerUrl ? () => window.open(t.trailerUrl, '_blank', 'noopener') : undefined}
      addLabel={saved ? 'In my list' : 'Add to list'}
      onAddToList={() => library.toggleMyList(t.id)}
    >
      {children}
    </Hero>
  );
}
