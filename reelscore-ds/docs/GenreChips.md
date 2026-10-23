---
category: Filters
---
# GenreChips

A row of toggleable genre pills for filtering a list; selected genres turn red and show a check mark.

**Consumer provides:** `genres` (strings), optional `selected` + `onChange` (controlled, receives the new array) or `defaultSelected`, `label`.

- Multi-select. Each chip is a toggle button with `aria-pressed`; the check mark means selection never relies on color alone.
- Under 1024px: one line that scrolls sideways and snaps; chips are 40px tall on touch screens. With a mouse, a chevron button on a fade appears at whichever end has more chips and scrolls the row. From 1024px the row wraps, so every chip shows.
- Sentence case, one word where possible ("Sci-fi", not "Science Fiction").
- Sits on `surface-200`; keep it directly under the tabs it filters.
