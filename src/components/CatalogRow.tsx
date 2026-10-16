import { catalog, type ListId, type Media, type Title } from '../api';
import { useAsync, type AsyncState } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';
import { listHref } from '../router';
import { TitleRow } from './TitleRow';

/** Row titles when a mixed page shows a list as two rows, films then series. */
const SPLIT_TITLES: Record<Exclude<ListId, 'trending'>, Record<Title['kind'], string>> = {
  'top-rated': { movie: 'Top rated films', series: 'Top rated series' },
  'new-this-week': { movie: 'New films this week', series: 'New series this week' },
  premieres: { movie: 'Film premieres', series: 'Series premieres' },
};

/** Whether a list shows as one row on this page, or as films and series separately. */
export const isSplit = (media: Media, list: ListId): list is Exclude<ListId, 'trending'> =>
  media === 'all' && list !== 'trending';

interface CatalogRowProps {
  media: Media;
  list: ListId;
  /** The row title when it's a single row. */
  title: string;
  genres: string[];
  library: LibraryApi;
}

/**
 * One list as poster rows. TMDB mixes films and series only for trending, so on the mixed
 * homepage the other lists show as two rows, each in TMDB's own order.
 */
export function CatalogRow({ media, list, ...rest }: CatalogRowProps) {
  return isSplit(media, list) ? <SplitRows list={list} {...rest} /> : <SingleRow media={media} list={list} {...rest} />;
}

function SingleRow({ media, list, title, genres, library }: CatalogRowProps) {
  const [state, retry] = useAsync((signal) => catalog.getList(media, list, signal), [media, list]);
  return <TitleRow title={title} state={state} onRetry={retry} genres={genres} library={library} seeAllHref={listHref(list, media)} />;
}

function SplitRows({ list, genres, library }: Omit<CatalogRowProps, 'media' | 'list'> & { list: Exclude<ListId, 'trending'> }) {
  const [state, retry] = useAsync((signal) => catalog.getListByKind(list, signal), [list]);
  const of = (kind: Title['kind']): AsyncState<Title[]> => (state.status === 'ready' ? { status: 'ready', data: state.data[kind] } : state);

  return (
    <>
      {(['movie', 'series'] as const).map((kind) => (
        <TitleRow
          key={kind}
          title={SPLIT_TITLES[list][kind]}
          state={of(kind)}
          onRetry={retry}
          genres={genres}
          library={library}
          seeAllHref={listHref(list, kind)}
        />
      ))}
    </>
  );
}
