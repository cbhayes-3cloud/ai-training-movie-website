import { BottomNav, Footer, NavBar } from 'reelscore';
import type { ListId, Media } from './api';
import { useLibrary } from './hooks/useLibrary';
import { BrowsePage } from './pages/BrowsePage';
import { LIST_IDS, ListPage } from './pages/ListPage';
import { TitlePage } from './pages/TitlePage';
import { useLocation } from './router';

type Section = 'Home' | 'Movies' | 'Series';

const MEDIA: Record<Section, Media> = { Home: 'all', Movies: 'movie', Series: 'series' };
const SECTION_OF: Record<Media, Section> = { all: 'Home', movie: 'Movies', series: 'Series' };
const isMedia = (m: string | null): m is Media => m === 'all' || m === 'movie' || m === 'series';
const isList = (l: string | undefined): l is ListId => LIST_IDS.includes(l as ListId);

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
  { label: 'Series', href: '/series' },
];

const BOTTOM_NAV = [
  { label: 'Home', icon: 'home', href: '/' },
  { label: 'Movies', icon: 'film', href: '/movies' },
  { label: 'Series', icon: 'tv', href: '/series' },
  { label: 'Search', icon: 'search', href: '#' },
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
  const titleId = /^\/title\/([^/]+)$/.exec(route)?.[1];
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

  return (
    <div className="app">
      <NavBar
        links={NAV_LINKS.map((l) => ({ ...l, active: l.label === section }))}
        homeHref="/"
        notifications={2}
        initials="CH"
        sticky
      />

      <main>
        {titleId ? (
          <TitlePage key={titleId} id={decodeURIComponent(titleId)} library={library} />
        ) : list ? (
          <ListPage list={list} media={listMedia} library={library} />
        ) : (
          // The homepage mixes films and series. Keyed so tabs and genre filters reset between pages.
          <BrowsePage key={section} media={MEDIA[section]} library={library} />
        )}
      </main>

      <Footer links={FOOTER_LINKS} homeHref="/" copyright={`© ${new Date().getFullYear()} Reelscore`} />

      <BottomNav items={BOTTOM_NAV.map((i) => ({ ...i, active: i.label === section }))} />
    </div>
  );
}
