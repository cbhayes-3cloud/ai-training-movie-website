import { Button } from 'reelscore';

export const Variants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 16, background: 'var(--surface-0)' }}>
    <Button icon="play">Watch trailer</Button>
    <Button variant="secondary" icon="plus">Add to list</Button>
    <Button variant="ghost">Write a review</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: 16, background: 'var(--surface-100)' }}>
    <Button size="sm" icon="star">Rate</Button>
    <Button size="md" icon="play">Watch trailer</Button>
    <Button size="lg" icon="play">Watch now</Button>
  </div>
);

export const Disabled = () => (
  <div style={{ display: 'flex', gap: 12, padding: 16, background: 'var(--surface-100)' }}>
    <Button disabled>Rated</Button>
    <Button variant="secondary" disabled>In your list</Button>
  </div>
);

export const PhonePair = () => (
  <div style={{ width: 343, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 16, background: 'var(--surface-100)' }}>
    <Button icon="play" fullWidth>Watch</Button>
    <Button variant="secondary" icon="plus" fullWidth>My list</Button>
  </div>
);
