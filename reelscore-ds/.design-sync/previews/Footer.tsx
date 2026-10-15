import { Footer } from 'reelscore';

const links = [{ label: 'About' }, { label: 'Help' }, { label: 'Privacy' }, { label: 'Terms' }];

export const Desktop = () => (
  <div style={{ width: '100%' }}>
    <Footer links={links} copyright={'© 2026 Reelscore'} />
  </div>
);

export const Phone = () => (
  <div style={{ width: 375 }}>
    <Footer links={links} copyright={'© 2026 Reelscore'} />
  </div>
);

export const AttributionOnly = () => (
  <div style={{ width: '100%' }}>
    <Footer />
  </div>
);
