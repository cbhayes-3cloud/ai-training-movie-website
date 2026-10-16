# Tabs

Underlined text tabs that switch between catalogue lists (Trending now, Top rated, Premieres).

**Consumer provides:** `items` (`{id, label, panelId}`), optional `value` + `onChange` (controlled) or `defaultValue`, `label` (the tablist's name), `overlay` (glass band for use over hero artwork).

- Arrow keys, Home and End move between tabs (roving focus).
- Tabs sit left-aligned on the page gutter. On phones the list scrolls sideways and snaps; from 768px the gap widens to `space-6`.
- Active tab: `ink` with a 2px `brand` underline. Inactive: `ink-muted`.
- Use `overlay` only as the hero's last child; elsewhere the band is surface-100.
