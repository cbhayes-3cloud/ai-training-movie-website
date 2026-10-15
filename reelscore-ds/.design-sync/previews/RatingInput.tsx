import { RatingInput } from 'reelscore';

export const Rated = () => (
  <div style={{ padding: 16, background: 'var(--surface-100)' }}>
    <RatingInput defaultValue={7} label="Your rating for Harbor Lights" />
  </div>
);

export const Unrated = () => (
  <div style={{ padding: 16, background: 'var(--surface-100)' }}>
    <RatingInput label="Your rating for Ironbark" />
  </div>
);
