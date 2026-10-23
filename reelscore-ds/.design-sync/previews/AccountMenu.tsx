import { AccountMenu } from 'reelscore';

export const Default = () => <AccountMenu />;

export const CustomRows = () => (
  <AccountMenu
    groups={[
      [{ label: 'Home', icon: 'home', href: '#', active: true }, { label: 'Movies', icon: 'film', href: '#' }],
      [{ label: 'Notifications', icon: 'bell', badge: 2 }],
    ]}
    label="Menu"
  />
);
