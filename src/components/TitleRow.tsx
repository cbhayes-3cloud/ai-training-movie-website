import { MovieCard, PosterRow } from 'reelscore';
import type { Title } from '../api';
import type { AsyncState } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';
import { titleHref } from '../router';

const TONES = ['night', 'red', 'slate', 'gold'] as const;

/** Placeholder fill for titles without a poster, stable per title. */
function toneFor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return TONES[Math.abs(hash) % TONES.length];
}

/** A poster card that links to the title page. */
export function TitleCard({ title: t, library }: { title: Title; library: LibraryApi }) {
  return (
    <MovieCard
      title={t.title}
      href={titleHref(t.id)}
      year={t.year}
      kind={t.kind === 'series' ? t.length : undefined}
      rating={t.rating}
      poster={t.posterUrl}
      tone={toneFor(t.id)}
      liked={library.isLiked(t.id)}
      onLike={() => library.toggleLiked(t.id)}
      watched={library.isWatched(t.id)}
      onWatched={() => library.toggleWatched(t.id)}
    />
  );
}

interface TitleRowProps {
  title: string;
  state: AsyncState<Title[]>;
  onRetry: () => void;
  /** Only show titles in at least one of these genres. Empty shows everything. */
  genres: string[];
  library: LibraryApi;
  seeAllHref?: string;
}

export function TitleRow({ title, state, onRetry, genres, library, seeAllHref = '#' }: TitleRowProps) {
  if (state.status === 'loading') {
    return (
      <PosterRow title={title} label={title}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card-skeleton" aria-hidden="true" />
        ))}
      </PosterRow>
    );
  }

  if (state.status === 'error') {
    return (
      <section className="row-status" aria-label={title}>
        <h2 className="row-status__title">{title}</h2>
        <p>These titles didn&rsquo;t load. Check your connection and try again.</p>
        <button type="button" className="row-status__retry" onClick={onRetry}>
          Try again
        </button>
      </section>
    );
  }

  const titles = genres.length ? state.data.filter((t) => t.genres.some((g) => genres.includes(g))) : state.data;

  if (titles.length === 0) {
    return (
      <section className="row-status" aria-label={title}>
        <h2 className="row-status__title">{title}</h2>
        <p>Nothing here matches {genres.join(', ')}. Clear a genre to see more.</p>
      </section>
    );
  }

  return (
    <PosterRow title={title} seeAllHref={seeAllHref}>
      {titles.map((t) => (
        <TitleCard key={t.id} title={t} library={library} />
      ))}
    </PosterRow>
  );
}
