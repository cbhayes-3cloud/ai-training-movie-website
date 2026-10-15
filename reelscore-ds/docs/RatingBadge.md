---
category: Ratings
---
# RatingBadge

A star and a one-decimal score out of 10, the read-only rating shown on cards and in the hero.

**Consumer provides:** `value` (0–10), optional `max` (default 10), `votes` (pre-formatted, e.g. "12.4k"), `tone` (`gold` | `brand`), `size` (`sm` | `md`).

- `gold` on cards and lists; `brand` only in the hero meta row.
- Always one decimal (7.0, not 7). Screen readers hear "Rated 7.5 out of 10".
- Show `votes` on detail pages, not on cards.
