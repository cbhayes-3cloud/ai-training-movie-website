import { RatingBadge } from 'reelscore';

export const Small = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 16, background: 'var(--surface-100)' }}>
    <RatingBadge value={8.1} />
    <RatingBadge value={6.4} votes="12.4k" />
    <RatingBadge value={7} tone="brand" />
  </div>
);

export const Medium = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 16, background: 'var(--surface-0)' }}>
    <RatingBadge value={9.2} size="md" />
    <RatingBadge value={7.5} tone="brand" size="md" />
    <RatingBadge value={8.6} size="md" votes="3.1k" />
  </div>
);
