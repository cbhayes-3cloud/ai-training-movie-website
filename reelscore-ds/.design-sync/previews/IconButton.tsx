import { useState } from 'react';
import { IconButton } from 'reelscore';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16, background: 'var(--surface-0)' }}>
    <IconButton icon="search" label="Search" />
    <IconButton icon="bell" label="Notifications, 2 new" badge />
    <IconButton icon="plus" label="Add to list" variant="filled" />
    <IconButton icon="list" label="Lists" variant="outline" />
    <span style={{ display: 'inline-grid', placeItems: 'center', width: 88, height: 64, borderRadius: 4, background: 'linear-gradient(135deg, var(--gold-deep), var(--brand-press))' }}>
      <IconButton icon="chevronRight" label="Scroll forward" variant="scrim" size="lg" />
    </span>
  </div>
);

export const Toggles = () => {
  const [liked, setLiked] = useState(true);
  const [watched, setWatched] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16, background: 'var(--surface-100)' }}>
      <IconButton icon="heart" label="Like" size="sm" pressed={liked} onClick={() => setLiked(!liked)} />
      <IconButton icon="eye" label="Mark as watched" size="sm" pressed={watched} onClick={() => setWatched(!watched)} />
    </div>
  );
};
