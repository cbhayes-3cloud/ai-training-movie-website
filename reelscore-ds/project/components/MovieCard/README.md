# MovieCard

A 2:3 poster with the title, year and the viewer's like, watched and score beneath — the unit of every poster row.

**Consumer provides:** `title`, optional `poster` (image URL), `href`, `year`, `kind` ("Film", "2 seasons"), `rating` (0–10), `liked` + `onLike`, `watched` + `onWatched`, `tone` (`night` | `red` | `gold` | `slate`, the placeholder fill while there is no poster).

- Width is `poster-width-sm` (128px) under 768px and `poster-width-lg` (184px) above; set it on a wrapper if a grid needs another size.
- Titles truncate to one line; the full title is in the tooltip and the accessible name.
- The like and watched toggles appear only when you pass their state; omit them for signed-out viewers.
- Posters are square-cornered at `radius-sm` and lift with `shadow-poster` on hover and focus.
