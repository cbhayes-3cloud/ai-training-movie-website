# BottomNav

The phone navigation bar: up to five icon-and-label destinations pinned to the bottom of the screen.

**Consumer provides:** `items` (`{label, icon, href, active}`), optional `label`, `fixed` (default true), `hideOnDesktop` (default true — hides it from 768px, where NavBar shows the links).

- Use the same destinations as NavBar's links, in the same order, plus Search.
- Add bottom padding equal to `bottom-nav-height` to the page so content is never hidden behind it; the bar adds the safe-area inset itself.
- Labels are one word where possible; never icons alone.
