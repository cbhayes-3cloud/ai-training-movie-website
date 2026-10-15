import { Icon } from 'reelscore';

const names = ['star', 'heart', 'eye', 'play', 'plus', 'search', 'bell', 'chevronLeft', 'chevronRight', 'home', 'film', 'tv', 'list', 'check', 'user'] as const;

export const Glyphs = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 16, background: 'var(--surface-100)', color: 'var(--ink)', maxWidth: 560 }}>
    {names.map((n) => (
      <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 72 }}>
        <Icon name={n} size={24} />
        <span style={{ font: '400 12px/16px var(--font-sans)', color: 'var(--ink-muted)' }}>{n}</span>
      </div>
    ))}
  </div>
);

export const Colors = () => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 16, background: 'var(--surface-100)' }}>
    <span style={{ color: 'var(--gold)' }}><Icon name="star" size={20} title="Rating" /></span>
    <span style={{ color: 'var(--brand)' }}><Icon name="heart" size={20} title="Liked" /></span>
    <span style={{ color: 'var(--ink-muted)' }}><Icon name="eye" size={20} title="Watched" /></span>
    <span style={{ color: 'var(--ink)' }}><Icon name="bell" size={20} title="Notifications" /></span>
  </div>
);
