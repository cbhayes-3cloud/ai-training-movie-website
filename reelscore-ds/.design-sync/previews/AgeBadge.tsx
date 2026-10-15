import { AgeBadge } from 'reelscore';

export const Ratings = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16, background: 'var(--surface-0)' }}>
    <AgeBadge rating="7+" />
    <AgeBadge rating="13+" />
    <AgeBadge rating="16+" />
    <AgeBadge rating="18+" />
  </div>
);
