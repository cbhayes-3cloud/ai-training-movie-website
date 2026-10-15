# IconButton

A circular, icon-only control for search, notifications, carousel arrows and the like/watched toggles on cards.

**Consumer provides:** `icon`, `label` (required — becomes the accessible name and tooltip), optional `variant` (`ghost` | `filled` | `outline` | `scrim`), `size` (`sm` | `md` | `lg`), `pressed` (makes it a toggle), `badge` (a red dot for unread items), `onClick`.

- Always pass `label`; there is no visible text.
- Pass `pressed` for on/off state (liked, watched) so screen readers announce it; a pressed heart turns `brand`.
- `sm` (28px) is only for card meta rows; it keeps a 44px invisible hit area, and grows to 32px on touch screens.
- Use `scrim` over artwork and posters, `filled` on plain surfaces.
