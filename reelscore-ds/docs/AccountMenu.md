---
category: Navigation
---
# AccountMenu

The menu that opens from the NavBar's avatar: icon and label rows, with a divider between groups.

**Consumer provides:** optional `groups` (rows in groups, each `{ label, icon, href?, onClick? }`; a divider goes between groups), `onSelect` (called with the row picked), `onClose` (Escape), `label` (accessible name, "Account" by default).

- By default it shows My ratings and My favorites, then Settings and Profile.
- A row with `href` is a link; any other row is a button. Arrow keys, Home and End move between rows.
- It is 248px wide and has no positioning of its own: place it under the avatar and open and close it yourself (`NavBar`'s `onAccount` is the hook).
- Icons are 24px and inherit `ink`. `settings` is the one outlined glyph in the set.
- It's composed of `AccountMenuItem` (a row) and `AccountMenuDivider` (the hairline between groups).
