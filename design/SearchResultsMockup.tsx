/*
 * Design mockup of the search results page (/search?q=…), not wired into the app.
 * Real Reelscore components and live TMDB data; the bar at the bottom switches states.
 * Open http://localhost:5173/design/search-results.html
 */
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CastStrip, Footer, MovieCard, NavBar, PosterRow, Tabs } from 'reelscore';
import 'reelscore/dist/reelscore.css';
import '../src/app.css';
import { personHref, titleHref } from '../src/router';
import './mockup.css';

const IMG = 'https://image.tmdb.org/t/p/';
type Item = { id: number; media_type?: string; title?: string; name?: string; release_date?: string; first_air_date?: string; vote_average?: number; vote_count?: number; poster_path?: string | null; popularity?: number };
type Person = { id: number; name: string; known_for_department?: string; profile_path?: string | null; known_for?: Item[] };
type Page<T> = { results: T[]; total_results: number };

const get = <T,>(path: string, q: string) =>
  fetch(`/api/tmdb${path}?query=${encodeURIComponent(q)}&include_adult=false&language=en-US`).then((r) => r.json() as Promise<T>);

interface Data { films: Page<Item>; series: Page<Item>; people: Page<Person>; trending: Item[] }

const year = (m: Item) => (m.release_date ?? m.first_air_date ?? '').slice(0, 4) || undefined;
const score = (m: Item) => ((m.vote_count ?? 0) >= 10 && m.vote_average ? Math.round(m.vote_average * 10) / 10 : undefined);
const TONES = ['night', 'red', 'slate', 'gold'] as const;

/** The app's title page: /title/movie-550 or /title/tv-1396. */
const hrefFor = (m: Item, kind: 'movie' | 'tv') => titleHref(`${kind}-${m.id}`);

/** The app's person page: /person/287. */
const personPage = (p: Person) => personHref(`person-${p.id}`);

function Card({ m, kind }: { m: Item; kind: 'movie' | 'tv' }) {
  return (
    <MovieCard
      title={m.title ?? m.name ?? ''}
      href={hrefFor(m, kind)}
      year={year(m)}
      kind={kind === 'tv' ? 'Series' : undefined}
      rating={score(m)}
      poster={m.poster_path ? `${IMG}w500${m.poster_path}` : undefined}
      tone={TONES[m.id % 4]}
    />
  );
}

const EMPTY_QUERY = 'xqzvbreak';
const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString()} ${n === 1 ? one : many}`;

/** "a, b and c", skipping empty parts. */
const listOf = (parts: (string | 0)[]) => {
  const p = parts.filter(Boolean) as string[];
  return p.length < 2 ? (p[0] ?? '') : `${p.slice(0, -1).join(', ')} and ${p[p.length - 1]}`;
};

type Tab = 'all' | 'films' | 'series' | 'people';
type State = 'results' | 'empty' | 'loading';

function Grid({ items, kind, limit }: { items: Item[]; kind: 'movie' | 'tv'; limit?: number }) {
  return (
    <ol className="list-grid">
      {items.slice(0, limit).map((m) => (
        <li key={m.id}>
          <Card m={m} kind={kind} />
        </li>
      ))}
    </ol>
  );
}

function SectionHead({ title, count, onAll }: { title: string; count: number; onAll?: () => void }) {
  return (
    <div className="sr-section__head">
      <h2 className="list-page__section-title">
        {title} <span className="sr-count">{count.toLocaleString()}</span>
      </h2>
      {onAll && (
        <button type="button" className="sr-seeall" onClick={onAll}>
          See all
        </button>
      )}
    </div>
  );
}

function knownFor(p: Person) {
  return (p.known_for ?? []).map((m) => m.title ?? m.name).filter(Boolean).slice(0, 2).join(', ');
}

function PeopleGrid({ people }: { people: Person[] }) {
  return (
    <ol className="sr-people">
      {people.map((p) => (
        <li key={p.id}>
          <a className="sr-person" href={personPage(p)}>
            {p.profile_path ? <img src={`${IMG}w185${p.profile_path}`} alt="" /> : <span className="sr-person__ph">{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>}
            <span className="sr-person__name">{p.name}</span>
            <span className="sr-person__meta">{[p.known_for_department, knownFor(p)].filter(Boolean).join(' · ')}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function Results({ q, data, tab, setTab }: { q: string; data: Data; tab: Tab; setTab: (t: Tab) => void }) {
  const { films, series, people } = data;
  const counts = { films: films.total_results, series: series.total_results, people: people.total_results };
  // Films and series in order of their best match's popularity; people lead when someone's name is the search.
  const nameMatch = people.results.some((p) => p.name.toLowerCase() === q.trim().toLowerCase());
  const sections = (
    [
      { id: 'films' as const, best: films.results[0]?.popularity ?? 0 },
      { id: 'series' as const, best: series.results[0]?.popularity ?? 0 },
      { id: 'people' as const, best: nameMatch ? Infinity : -1 },
    ] as const
  )
    .filter((s) => counts[s.id])
    .sort((a, b) => b.best - a.best);
  const tabs = [
    { id: 'all', label: 'All' },
    ...(['films', 'series', 'people'] as const)
      .filter((id) => counts[id])
      .map((id) => ({ id, label: `${id === 'films' ? 'Films' : id === 'series' ? 'Series' : 'People'} · ${counts[id].toLocaleString()}` })),
  ];

  return (
    <>
      <header className="list-page__head">
        <h1 className="list-page__title">Results for “{q}”</h1>
        <p className="list-page__intro">
          {listOf([
            counts.films && plural(counts.films, 'film'),
            counts.series && plural(counts.series, 'series', 'series'),
            counts.people && plural(counts.people, 'person', 'people'),
          ])}{' '}
          on TMDB.
        </p>
      </header>
      <Tabs items={tabs} value={tab} onChange={(id) => setTab(id as Tab)} label="Result types" className="sr-tabs" />

      {tab === 'all' && (
        <>
          {sections.map((s) =>
            s.id !== 'people' ? (
            <section key={s.id} className="list-page__section">
              <SectionHead title={s.id === 'films' ? 'Films' : 'Series'} count={counts[s.id]} onAll={() => setTab(s.id)} />
              <Grid items={(s.id === 'films' ? films : series).results} kind={s.id === 'films' ? 'movie' : 'tv'} limit={6} />
            </section>
            ) : (
            <section key="people" className="list-page__section">
              <SectionHead title="People" count={counts.people} onAll={() => setTab('people')} />
              <CastStrip
                people={people.results.slice(0, 12).map((p) => ({ id: String(p.id), name: p.name, role: knownFor(p) ? `Known for ${knownFor(p)}` : p.known_for_department, photo: p.profile_path ? `${IMG}h632${p.profile_path}` : undefined, href: personPage(p) }))}
                label={`People matching ${q}`}
                shimmer={false}
              />
            </section>
            ),
          )}
        </>
      )}
      {(tab === 'films' || tab === 'series') && (
        <section className="list-page__section">
          <Grid items={(tab === 'films' ? films : series).results} kind={tab === 'films' ? 'movie' : 'tv'} />
          {counts[tab] > 20 && (
            <div className="sr-more">
              <button type="button" className="row-status__retry">Show more</button>
              <span>Showing 20 of {counts[tab].toLocaleString()}</span>
            </div>
          )}
        </section>
      )}
      {tab === 'people' && (
        <section className="list-page__section">
          <PeopleGrid people={people.results} />
        </section>
      )}
    </>
  );
}

function Empty({ q, trending }: { q: string; trending: Item[] }) {
  return (
    <>
      <header className="list-page__head">
        <h1 className="list-page__title">No matches for “{q}”</h1>
        <p className="list-page__intro">Check the spelling, or try fewer words: a title, or someone’s name.</p>
      </header>
      <div className="sr-bleed">
        <PosterRow title="Trending now instead">
          {trending.map((m) => <Card key={m.id} m={m} kind="movie" />)}
        </PosterRow>
      </div>
    </>
  );
}

function Loading({ q }: { q: string }) {
  return (
    <>
      <header className="list-page__head">
        <h1 className="list-page__title">Results for “{q}”</h1>
        <p className="list-page__intro">Searching…</p>
      </header>
      <ol className="list-grid" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => <li key={i}><div className="card-skeleton" /></li>)}
      </ol>
    </>
  );
}

function Mockup() {
  const [q, setQ] = useState('breaking');
  const [state, setState] = useState<State>('results');
  const [tab, setTab] = useState<Tab>('all');
  const [data, setData] = useState<Data>();

  useEffect(() => {
    setData(undefined);
    Promise.all([
      get<Page<Item>>('/search/movie', q),
      get<Page<Item>>('/search/tv', q),
      get<Page<Person>>('/search/person', q),
      fetch('/api/tmdb/trending/movie/week').then((r) => r.json() as Promise<Page<Item>>),
    ]).then(([films, series, people, t]) => setData({ films, series, people, trending: t.results }));
  }, [q]);

  return (
    <div className="app">
      <NavBar
        links={[{ label: 'Home', href: '#' }, { label: 'Movies', href: '#' }, { label: 'Series', href: '#' }]}
        notifications={2}
        initials="CH"
        sticky
        defaultSearchOpen
        searchValue={state === 'empty' ? EMPTY_QUERY : q}
        onSearchChange={() => {}}
      />
      <main className="list-page">
        {state === 'loading' || !data ? <Loading q={q} /> : state === 'empty' ? <Empty q={EMPTY_QUERY} trending={data.trending} /> : <Results q={q} data={data} tab={tab} setTab={setTab} />}
      </main>
      <Footer links={[{ label: 'About', href: '#' }]} copyright="© 2026 Reelscore" />

      <div className="mock-bar" role="group" aria-label="Mockup controls">
        <strong>Mockup</strong>
        {(['results', 'empty', 'loading'] as State[]).map((s) => (
          <button key={s} type="button" aria-pressed={state === s} onClick={() => setState(s)}>{s}</button>
        ))}
        <span className="mock-sep" />
        {['breaking', 'brad pitt', 'dune'].map((term) => (
          <button key={term} type="button" aria-pressed={q === term} onClick={() => { setQ(term); setTab('all'); setState('results'); }}>{term}</button>
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Mockup />
  </StrictMode>,
);
