import { Tabs } from 'reelscore';

const tabs = [
  { id: 'trending', label: 'Trending now' }, { id: 'top', label: 'Top rated' },
  { id: 'originals', label: 'Critics’ picks' }, { id: 'premieres', label: 'Premieres' }, { id: 'recent', label: 'Recently added' },
];

export const Desktop = () => (
  <div style={{ width: '100%' }}>
    <Tabs items={tabs} label="Browse" />
  </div>
);

export const Phone = () => (
  <div style={{ width: 375 }}>
    <Tabs items={tabs} label="Browse" defaultValue="top" />
  </div>
);
