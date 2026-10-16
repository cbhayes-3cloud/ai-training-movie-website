import { useEffect } from 'react';
import { catalog, type ListId, type Media, type Title } from '../api';
import { isSplit } from '../components/CatalogRow';
import { TitleCard } from '../components/TitleRow';
import { useAsync } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';

/** How many titles a list page shows, all at once. */
const LIST_SIZE = 100;

const NOUN: Record<Media, string> = { movie: 'films', series: 'series', all: 'films and series' };

/** The page title and the line under it, for each list. */
const COPY: Record<ListId, { title: string; intro: (noun: string) => string }> = {
  trending: { title: 'Trending now', intro: (noun) => `The ${LIST_SIZE} most popular ${noun} on TMDB this week.` },
  'top-rated': { title: 'Top rated', intro: (noun) => `The ${LIST_SIZE} highest-rated ${noun}, by community score.` },
  'new-this-week': { title: 'New this week', intro: (noun) => `${capitalize(noun)} released in the last 7 days, most popular first.` },
  premieres: { title: 'Premieres', intro: (noun) => `${capitalize(noun)} coming soon, most anticipated first.` },
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const LIST_IDS = Object.keys(COPY) as ListId[];

/** A run of the page's titles; mixed pages list films and series in separate sections. */
interface Section {
  heading?: string;
  titles: Title[];
}

async function load(media: Media, list: ListId, signal: AbortSignal): Promise<Section[]> {
  if (!isSplit(media, list)) return [{ titles: await catalog.getList(media, list, signal, LIST_SIZE) }];
  const byKind = await catalog.getListByKind(list, signal, LIST_SIZE);
  return [
    { heading: 'Films', titles: byKind.movie },
    { heading: 'Series', titles: byKind.series },
  ];
}

interface ListPageProps {
  list: ListId;
  media: Media;
  library: LibraryApi;
}

/**
 * A full list as a grid of posters: trending, top rated, new this week or premieres, for films, series or both.
 * TMDB mixes films and series only for trending, so a mixed page shows the other lists as a films
 * section and a series section, each in TMDB's order.
 */
export function ListPage({ list, media, library }: ListPageProps) {
  const [state, retry] = useAsync((signal) => load(media, list, signal), [media, list]);
  const split = isSplit(media, list);
  const copy = COPY[list];
  const heading = media === 'all' ? copy.title : `${copy.title}: ${NOUN[media]}`;

  useEffect(() => {
    document.title = `${heading} — Reelscore`;
    return () => {
      document.title = 'Reelscore';
    };
  }, [heading]);

  return (
    <section className="list-page" aria-labelledby="list-title" aria-busy={state.status === 'loading'}>
      <header className="list-page__head">
        <h1 id="list-title" className="list-page__title">
          {heading}
        </h1>
        <p className="list-page__intro">
          {copy.intro(NOUN[media])}
          {split && ` Films and series are listed separately, up to ${LIST_SIZE} of each.`}
        </p>
      </header>

      {state.status === 'loading' && (
        <ol className="list-grid" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <li key={i}>
              <div className="card-skeleton" />
            </li>
          ))}
        </ol>
      )}

      {state.status === 'error' && (
        <div className="row-status list-page__status">
          <p>These titles didn&rsquo;t load. Check your connection and try again.</p>
          <button type="button" className="row-status__retry" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {state.status === 'ready' &&
        state.data.map((section) => (
          <div key={section.heading ?? 'all'} className="list-page__section">
            {section.heading && <h2 className="list-page__section-title">{section.heading}</h2>}
            {section.titles.length === 0 ? (
              <div className="row-status list-page__status">
                <p>Nothing here yet. Check back soon.</p>
              </div>
            ) : (
              // An ordered list, so the ranking is announced as well as shown in order.
              <ol className="list-grid" aria-label={section.heading}>
                {section.titles.map((t) => (
                  <li key={t.id}>
                    <TitleCard title={t} library={library} />
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
    </section>
  );
}
