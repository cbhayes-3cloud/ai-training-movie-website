import { NavBar } from 'reelscore';

const links = [{ label: 'Home', active: true }, { label: 'Movies' }, { label: 'Series' }, { label: 'New ratings' }, { label: 'My lists' }];

export const Desktop = () => (
  <div style={{ width: '100%' }}>
    <NavBar links={links} notifications={2} initials="CH" />
  </div>
);

export const SearchOpen = () => (
  <div style={{ width: '100%' }}>
    <NavBar links={links} notifications={2} initials="CH" defaultSearchOpen defaultSearchValue="Dune" />
  </div>
);

export const Phone = () => (
  <div style={{ width: 375 }}>
    <NavBar links={links} initials="CH" />
  </div>
);
