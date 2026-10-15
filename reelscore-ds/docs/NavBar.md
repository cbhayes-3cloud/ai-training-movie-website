---
category: Navigation
---
# NavBar

The top bar: red wordmark, centred section links with a red underline on the active one, and search, notifications and account on the right.

**Consumer provides:** `links` (`{label, href, active}`), optional `brand`, `homeHref`, `avatarSrc` or `initials`, `avatarLabel`, `notifications` (count), `onSearch`, `onNotifications`, `onAccount`, `sticky`.

- Responds to its own width: under 768px only the wordmark, search and avatar remain (`nav-height-sm`, 56px); pair it with `BottomNav` there so sections stay one tap away.
- Mark exactly one link `active`; it gets `aria-current="page"`.
- Keep links to five or fewer, one or two words each.
- Set `sticky` on long pages; it sits on `z-nav`.
