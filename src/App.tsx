import { BottomNav, Footer, NavBar } from 'reelscore';
import { useLibrary } from './hooks/useLibrary';
import { HomePage } from './pages/HomePage';
import { TitlePage } from './pages/TitlePage';
import { usePath } from './router';

type Section = 'Home' | 'Movies';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '#' },
  { label: 'Series', href: '#' },
  { label: 'Charts', href: '#' },
  { label: 'My lists', href: '#' },
];

const BOTTOM_NAV = [
  { label: 'Home', icon: 'home', href: '/' },
  { label: 'Movies', icon: 'film', href: '#' },
  { label: 'Series', icon: 'tv', href: '#' },
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
  const path = usePath();

  const titleId = /^\/title\/([^/]+)\/?$/.exec(path)?.[1];
  // A title page sits under Movies (or Series, once there are series pages).
  const section: Section = titleId ? 'Movies' : 'Home';

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
        ) : (
          <HomePage library={library} />
        )}
      </main>

      <Footer links={FOOTER_LINKS} homeHref="/" copyright={`© ${new Date().getFullYear()} Reelscore`} />

      <BottomNav items={BOTTOM_NAV.map((i) => ({ ...i, active: i.label === section }))} />
    </div>
  );
}
