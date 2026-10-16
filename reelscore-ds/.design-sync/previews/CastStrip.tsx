import { CastStrip } from 'reelscore';

const people = [
  ['Hollis Brandt', 'Mara Quill'], ['Juno Okafor', 'Teddy Quill'], ['Pell Marston', 'Arran Doyle'],
  ['Sabine Roux', 'Nell Fairley'], ['Cal Whitlock', 'Young Mara'], ['Odette Lin', 'Harbourmaster'],
  ['Rafe Delacroix', 'Father Corran'], ['Ama Boateng', 'Ferry pilot'],
].map(([name, role]) => ({ name, role, href: '#' }));

export const WithLeader = () => (
  <div style={{ width: '100%', padding: '24px 16px', background: 'var(--surface-100)', boxSizing: 'border-box' }}>
    <CastStrip title="Harbor Lights" people={people} />
  </div>
);

export const CastOnly = () => (
  <div style={{ width: '100%', padding: '24px 16px', background: 'var(--surface-100)', boxSizing: 'border-box' }}>
    <CastStrip people={people.slice(0, 4)} shimmer={false} />
  </div>
);

export const Phone = () => (
  <div style={{ width: 375, padding: '24px 16px', background: 'var(--surface-100)', boxSizing: 'border-box' }}>
    <CastStrip title="Harbor Lights" people={people} />
  </div>
);
