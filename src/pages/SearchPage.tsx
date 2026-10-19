import { useEffect, useState } from 'react';
import { CastStrip, PosterRow, Tabs } from 'reelscore';
import { catalog, type PersonMatch, type SearchPage as Page, type Title } from '../api';
import { TitleCard } from '../components/TitleRow';
import { useAsync } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';
import { navigate, personHref, searchHref, type SearchType } from '../router';
import { initials } from '../text';

/** How many films or series each section of the All tab shows, and how many people. */
const ALL_TITLES = 6;
const ALL_PEOPLE = 12;

const HEADING: Record<Exclude<SearchType, 'all'>, string> = { films: 'Films', series: 'Series', people: 'People' };

/** The first page of each kind: the All tab's sections, and the counts on the tabs. */
interface Overview {
  films: Page<Title>;
  series: Page<Title>;
  people: Page<PersonMatch>;
}

const loadOverview = (q: string, signal: AbortSignal) =>
  Promise.all([
    catalog.searchTitles('movie', q, 1, signal),
    catalog.searchTitles('series', q, 1, signal),
    catalog.searchPeople(q, 1, signal),
  ]).then(([films, series, people]) => ({ films, series, people }));

const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString()} ${n === 1 ? one : many}`;

/** "a, b and c". */
function listOf(parts: string[]) {
  return parts.length < 2 ? (parts[0] ?? '') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

const knownFor = (p: PersonMatch) => p.knownFor.slice(0, 2).map((t) => t.title).join(', ');

/**
 * The All tab's sections. Films and series go in order of their best match's popularity;
 * people lead when someone's name is exactly what was searched for.
 */
function sectionOrder(q: string, o: Overview): Exclude<SearchType, 'all'>[] {
  const nameMatch = o.people.items.some((p) => p.name.toLowerCase() === q.toLowerCase());
  const rank = { films: o.films.topPopularity ?? 0, series: o.series.topPopularity ?? 0, people: nameMatch ? Infinity : -1 };
  return (['films', 'series', 'people'] as const).filter((k) => o[k].total).sort((a, b) => rank[b] - rank[a]);
}

function TitleGrid({ titles, library, label }: { titles: Title[]; library: LibraryApi; label?: string }) {
  return (
    <ol className="list-grid" aria-label={label}>
      {titles.map((t) => (
        <li key={t.id}>
          <TitleCard title={t} library={library} />
        </li>
      ))}
    </ol>
  );
}

function PeopleGrid({ people }: { people: PersonMatch[] }) {
  return (
    <ol className="person-grid" aria-label="People">
      {people.map((p) => {
        const meta = [p.department, knownFor(p)].filter(Boolean).join(' · ');
        return (
          <li key={p.id}>
            <a className="person-tile" href={personHref(p.id)}>
              {p.photoUrl ? (
                <img className="person-tile__photo" src={p.photoUrl} alt="" loading="lazy" />
              ) : (
                <span className="person-tile__photo" aria-hidden="true">
                  {initials(p.name)}
                </span>
              )}
              <span className="person-tile__name">{p.name}</span>
              {meta && <span className="person-tile__meta">{meta}</span>}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function SectionHead({ type, total, q }: { type: Exclude<SearchType, 'all'>; total: number; q: string }) {
  return (
    <div className="search-page__section-head">
      <h2 className="list-page__section-title">
        {HEADING[type]} <span className="search-page__count">{total.toLocaleString()}</span>
      </h2>
      <a className="search-page__see-all" href={searchHref(q, type)}>
        See all
      </a>
    </div>
  );
}

function AllResults({ q, overview: o, library }: { q: string; overview: Overview; library: LibraryApi }) {
  return (
    <>
      {sectionOrder(q, o).map((type) => (
        <section key={type} className="list-page__section" aria-label={HEADING[type]}>
          <SectionHead type={type} total={o[type].total} q={q} />
          {type === 'people' ? (
            <CastStrip
              people={o.people.items.slice(0, ALL_PEOPLE).map((p) => ({
                id: p.id,
                name: p.name,
                role: knownFor(p) ? `Known for ${knownFor(p)}` : p.department,
                photo: p.photoUrl,
                href: personHref(p.id),
              }))}
              label={`People matching ${q}`}
              shimmer={false}
            />
          ) : (
            <TitleGrid titles={o[type].items.slice(0, ALL_TITLES)} library={library} />
          )}
        </section>
      ))}
    </>
  );
}

/** Pages of one kind, loaded 20 at a time with "Show more". */
function usePages<T extends { id: string }>(load: (page: number, signal: AbortSignal) => Promise<Page<T>>) {
  const [pages, setPages] = useState<Page<T>[]>([]);
  const [wanted, setWanted] = useState(1);
  const [error, setError] = useState<Error>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (pages.length >= wanted) return;
    const controller = new AbortController();
    setError(undefined);
    load(pages.length + 1, controller.signal).then(
      (page) => setPages((ps) => [...ps, page]),
      (err: unknown) => {
        if (!controller.signal.aborted) setError(err instanceof Error ? err : new Error(String(err)));
      },
    );
    return () => controller.abort();
  }, [pages.length, wanted, attempt]);

  // A match that moves between pages while they load is shown once.
  const seen = new Set<string>();
  const items = pages.flatMap((p) => p.items).filter((it) => !seen.has(it.id) && seen.add(it.id));
  const last = pages[pages.length - 1];
  return {
    items,
    total: last?.total ?? 0,
    loading: !error && pages.length < wanted,
    error,
    hasMore: !!last && last.page < last.totalPages,
    more: () => setWanted(pages.length + 1),
    retry: () => setAttempt((n) => n + 1),
  };
}

function KindResults({ q, type, library }: { q: string; type: Exclude<SearchType, 'all'>; library: LibraryApi }) {
  const results = usePages<Title | PersonMatch>((page, signal) =>
    type === 'people' ? catalog.searchPeople(q, page, signal) : catalog.searchTitles(type === 'films' ? 'movie' : 'series', q, page, signal),
  );
  const first = results.loading && !results.items.length;

  return (
    <section className="list-page__section" aria-label={HEADING[type]} aria-busy={results.loading}>
      {first ? (
        <Skeleton />
      ) : type === 'people' ? (
        <PeopleGrid people={results.items as PersonMatch[]} />
      ) : (
        <TitleGrid titles={results.items as Title[]} library={library} label={HEADING[type]} />
      )}
      {results.error ? (
        <div className="row-status list-page__status">
          <p>More results didn&rsquo;t load. Check your connection and try again.</p>
          <button type="button" className="row-status__retry" onClick={results.retry}>
            Try again
          </button>
        </div>
      ) : (
        !first &&
        results.items.length > 0 && (
          <div className="search-page__more">
            {results.hasMore && (
              <button type="button" className="row-status__retry" onClick={results.more} disabled={results.loading}>
                {results.loading ? 'Loading…' : 'Show more'}
              </button>
            )}
            <span>
              Showing {results.items.length.toLocaleString()} of {results.total.toLocaleString()}
            </span>
          </div>
        )
      )}
    </section>
  );
}

function Skeleton() {
  return (
    <ol className="list-grid" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <li key={i}>
          <div className="card-skeleton" />
        </li>
      ))}
    </ol>
  );
}

/** What to show when nothing matches: the week's trending titles. */
function NoMatches({ library }: { library: LibraryApi }) {
  const [state] = useAsync((signal) => catalog.getList('all', 'trending', signal), []);
  if (state.status !== 'ready' || !state.data.length) return null;
  return (
    <div className="search-page__bleed">
      <PosterRow title="Trending now instead">
        {state.data.map((t) => (
          <TitleCard key={t.id} title={t} library={library} />
        ))}
      </PosterRow>
    </div>
  );
}

interface SearchPageProps {
  query: string;
  type: SearchType;
  library: LibraryApi;
}

/** /search?q=…&type=…: everything matching a search, as All, Films, Series and People tabs. */
export function SearchPage({ query, type, library }: SearchPageProps) {
  const q = query.trim();
  const [state, retry] = useAsync((signal) => (q ? loadOverview(q, signal) : Promise.resolve(undefined)), [q]);

  useEffect(() => {
    document.title = q ? `“${q}” — Search — Reelscore` : 'Search — Reelscore';
    return () => {
      document.title = 'Reelscore';
    };
  }, [q]);

  if (!q) {
    return (
      <section className="list-page" aria-labelledby="search-title">
        <header className="list-page__head">
          <h1 id="search-title" className="list-page__title">
            Search
          </h1>
          <p className="list-page__intro">Find a film, a series or someone&rsquo;s name with the search at the top of the page.</p>
        </header>
      </section>
    );
  }

  const overview = state.status === 'ready' ? state.data : undefined;
  const none = overview && !overview.films.total && !overview.series.total && !overview.people.total;
  const counts = overview && {
    films: overview.films.total,
    series: overview.series.total,
    people: overview.people.total,
  };
  // An empty kind gets no tab; a link straight to one still shows it, so it can say there's nothing.
  const tabs = counts && [
    { id: 'all', label: 'All' },
    ...(['films', 'series', 'people'] as const)
      .filter((k) => counts[k] || k === type)
      .map((k) => ({ id: k, label: `${HEADING[k]} · ${counts[k].toLocaleString()}` })),
  ];

  return (
    <section className="list-page search-page" aria-labelledby="search-title" aria-busy={state.status === 'loading'}>
      <header className="list-page__head">
        <h1 id="search-title" className="list-page__title">
          {none ? `No matches for “${q}”` : `Results for “${q}”`}
        </h1>
        <p className="list-page__intro">
          {state.status === 'loading' && 'Searching…'}
          {none && 'Check the spelling, or try fewer words: a title, or someone’s name.'}
          {counts &&
            !none &&
            `${listOf(
              [
                counts.films && plural(counts.films, 'film'),
                counts.series && plural(counts.series, 'series', 'series'),
                counts.people && plural(counts.people, 'person', 'people'),
              ].filter((p): p is string => Boolean(p)),
            )} on TMDB.`}
        </p>
      </header>

      {state.status === 'loading' && <Skeleton />}

      {state.status === 'error' && (
        <div className="row-status list-page__status">
          <p>Search isn&rsquo;t working right now. Check your connection and try again.</p>
          <button type="button" className="row-status__retry" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {none && <NoMatches library={library} />}

      {overview && tabs && !none && (
        <>
          <Tabs
            items={tabs}
            value={type}
            onChange={(id) => navigate(searchHref(q, id as SearchType))}
            label="Result types"
            className="search-page__tabs"
          />
          {type === 'all' ? (
            <AllResults q={q} overview={overview} library={library} />
          ) : (
            // Keyed so switching tabs or searches starts again from page 1.
            <KindResults key={`${type}:${q}`} q={q} type={type} library={library} />
          )}
        </>
      )}
    </section>
  );
}
