import { BottomNav } from 'reelscore';

export const Phone = () => (
  <div style={{ width: 375 }}>
    <BottomNav fixed={false} hideOnDesktop={false} items={[
      { label: 'Home', icon: 'home', active: true },
      { label: 'Movies', icon: 'film' },
      { label: 'Series', icon: 'tv' },
      { label: 'Search', icon: 'search' },
      { label: 'My lists', icon: 'list' },
    ]} />
  </div>
);
