---
category: Content
---
# PosterRow

A titled, horizontally scrolling row of MovieCards that swipes on phones and gets arrow buttons on desktop.

**Consumer provides:** `children` (MovieCards), optional `title`, `seeAllHref`, `label` (when there is no visible title).

- Phones: swipe; each poster snaps to the gutter. Arrows never show on touch-only devices.
- From 1024px of row width, scrim arrow buttons appear on hover or keyboard focus and scroll by most of a screen.
- Gutters follow the page: `gutter-sm`, `gutter-md`, `gutter-lg`.
- Up to about 20 cards per row; link the rest with "See all".
