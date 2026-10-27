import { AccountMenuDivider, AccountMenuItem } from 'reelscore';

export const BetweenGroups = () => (
  <div role="menu" style={{ width: 248, padding: 7, background: 'var(--surface-200)', border: '1px solid var(--surface-400)', borderRadius: 'var(--radius-md)' }}>
    <AccountMenuItem icon="heart" label="My favorites" />
    <AccountMenuDivider />
    <AccountMenuItem icon="settings" label="Settings" />
  </div>
);
