import { AccountMenuItem } from 'reelscore';

export const Rows = () => (
  <div role="menu" style={{ width: 248, padding: 7, background: 'var(--surface-200)', border: '1px solid var(--surface-400)', borderRadius: 'var(--radius-md)' }}>
    <AccountMenuItem icon="star" label="My ratings" />
    <AccountMenuItem icon="home" label="Home" href="#" active />
    <AccountMenuItem icon="bell" label="Notifications" badge={2} />
  </div>
);
