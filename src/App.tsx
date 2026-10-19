import { useEffect, useState } from 'react';
import { BottomNav, Footer, NavBar } from 'reelscore';
import type { ListId, Media } from './api';
import { SearchPanel } from './components/SearchPanel';
import { useLibrary } from './hooks/useLibrary';
import { useSearch } from './hooks/useSearch';
import { BrowsePage } from './pages/BrowsePage';
import { LIST_IDS, ListPage } from './pages/ListPage';
import { PersonPage } from './pages/PersonPage';
import { SearchPage } from './pages/SearchPage';
import { TitlePage } from './pages/TitlePage';
import { navigate, SEARCH_TYPES, searchHref, useLocation, type SearchType } from './router';

type Section = 'Home' | 'Movies' | 'Series';

const MEDIA: Record<Section, Media> = { Home: 'all', Movies: 'movie', Series: 'series' };
const SECTION_OF: Record<Media, Section> = { all: 'Home', movie: 'Movies', series: 'Series' };
const isMedia = (m: string | null): m is Media => m === 'all' || m === 'movie' || m === 'series';
const isList = (l: string | undefined): l is ListId => LIST_IDS.includes(l as ListId);
const isSearchType = (t: string | null): t is SearchType => SEARCH_TYPES.includes(t as SearchType);

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
  { label: 'Series', href: '/series' },
];

const BOTTOM_NAV = [
  { label: 'Home', icon: 'home', href: '/' },
  { label: 'Movies', icon: 'film', href: '/movies' },
  { label: 'Series', icon: 'tv', href: '/series' },
  { label: 'Search', icon: 'search', href: '/search' },
  { label: 'My lists', icon: 'list', href: '#' },
] as const;

const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Help', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

export default function App() {
  const library = useLibrary();
  const { path, query } = useLocation();
  const route = path.replace(/\/+$/, '') || '/';
  // /search?q=dune&type=series; the type defaults to all.
  const isSearch = route === '/search';
  const searchQuery = isSearch ? (query.get('q') ?? '').trim() : '';
  const typeParam = query.get('type');
  const searchType: SearchType = isSearchType(typeParam) ? typeParam : 'all';

  // The field starts with the page's search, and follows it on back and forward.
  const [searchText, setSearchText] = useState(searchQuery);
  useEffect(() => {
    if (isSearch) setSearchText(searchQuery);
  }, [isSearch, searchQuery]);
  const search = useSearch(searchText);
  // On the results page, the dropdown would only repeat what's below it.
  const showPanel = search.active && !(isSearch && searchText.trim() === searchQuery);

  const titleId = /^\/title\/([^/]+)$/.exec(route)?.[1];
  const personId = /^\/person\/(\d+)$/.exec(route)?.[1];
  // /lists/top-rated?media=series; the media defaults to both.
  const listId = /^\/lists\/([^/]+)$/.exec(route)?.[1];
  const list = isList(listId) ? listId : undefined;
  const mediaParam = query.get('media');
  const listMedia: Media = isMedia(mediaParam) ? mediaParam : 'all';
  // A title page sits under Movies or Series, a list page under its media; unknown paths show the homepage.
  const section: Section = titleId
    ? titleId.startsWith('tv-')
      ? 'Series'
      : 'Movies'
    : list
      ? SECTION_OF[listMedia]
      : route === '/movies'
        ? 'Movies'
        : route === '/series'
          ? 'Series'
          : 'Home';
  // Person and search pages sit under no section; search has its own BottomNav tab.
  const active = personId || isSearch ? undefined : section;

  return (
    <div className="app">
      <NavBar
        links={NAV_LINKS.map((l) => ({ ...l, active: l.label === active }))}
        homeHref="/"
        notifications={2}
        initials="CH"
        sticky
        searchValue={searchText}
        onSearchChange={setSearchText}
        defaultSearchOpen={isSearch}
        onSearchSubmit={(q) => navigate(searchHref(q))}
        searchResults={showPanel ? <SearchPanel state={search} /> : null}
      />

      <main>
        {isSearch ? (
          <SearchPage query={searchQuery} type={searchType} library={library} />
        ) : personId ? (
          <PersonPage key={personId} id={`person-${personId}`} library={library} />
        ) : titleId ? (
          <TitlePage key={titleId} id={decodeURIComponent(titleId)} library={library} />
        ) : list ? (
          <ListPage list={list} media={listMedia} library={library} />
        ) : (
          // The homepage mixes films and series. Keyed so tabs and genre filters reset between pages.
          <BrowsePage key={section} media={MEDIA[section]} library={library} />
        )}
      </main>

      <Footer links={FOOTER_LINKS} homeHref="/" copyright={`© ${new Date().getFullYear()} Reelscore`} />

      <BottomNav items={BOTTOM_NAV.map((i) => ({ ...i, active: i.label === (isSearch ? 'Search' : active) }))} />
    </div>
  );
}
