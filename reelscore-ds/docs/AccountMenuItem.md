---
category: Navigation
---
# AccountMenuItem

One row of the account menu: a 24px icon and a label, 44px tall.

**Consumer provides:** `icon`, `label`, and optionally `href` (makes it a link; otherwise it's a button), `onClick`.

- It's built for `AccountMenu` (`role="menuitem"`); use it directly only to compose your own menu inside an `AccountMenu`-style container.
- The icon inherits `ink`; on hover the row fills with `brand` and its label turns `on-brand` (Figma's State=Hover).
