import { Hero, Tabs } from 'reelscore';

const props = {
  title: 'The Long Orbit',
  ageRating: '13+',
  rating: 7.5,
  year: '2024',
  length: '2 seasons',
  synopsis: 'Stranded on a frozen moon, a salvage crew has one week to signal home before the station’s reactor fails.',
};
const tabs = [
  { id: 'trending', label: 'Trending now' }, { id: 'top', label: 'Top rated' },
  { id: 'originals', label: 'Critics’ picks' }, { id: 'premieres', label: 'Premieres' }, { id: 'recent', label: 'Recently added' },
];

export const Desktop = () => (
  <div style={{ width: '100%' }}>
    <Hero {...props}>
      <Tabs items={tabs} overlay label="Browse" />
    </Hero>
  </div>
);

export const Phone = () => (
  <div style={{ width: 375 }}>
    <Hero {...props} />
  </div>
);
