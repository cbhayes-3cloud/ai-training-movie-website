---
category: Navigation
---
# NavBar

The top bar: red wordmark, centred section links with a red underline on the active one, and search, notifications and account on the right.

**Consumer provides:** `links` (`{label, href, active}`), optional `brand`, `homeHref`, `avatarSrc` or `initials`, `avatarLabel`, `notifications` (count), `onSearch` (the field opened), `searchPlaceholder`, `searchValue` or `defaultSearchValue`, `defaultSearchOpen`, `onSearchChange`, `onSearchSubmit` (trimmed query), `onSearchClose`, `searchResults` (rendered in the results panel), `searchResultsLabel`, `onNotifications`, `onAccount`, `sticky`.

- Responds to its own width: under 768px only the wordmark, search and avatar remain (`nav-height-sm`, 56px); pair it with `BottomNav` there so sections stay one tap away.
- Mark exactly one link `active`; it gets `aria-current="page"`.
- Keep links to five or fewer, one or two words each.
- Set `sticky` on long pages; it sits on `z-nav`.
- Search: the icon grows leftwards into a pill field on a critically damped spring, so it settles without overshoot and stays smooth if it's reversed mid-way. It takes up to 360px. Where that won't clear the links (at least 220px), the links fade and the field covers them; on a phone it covers the wordmark too. Enter submits; Escape closes and keeps the text; ✕ clears and closes; an empty field closes when focus leaves it. With reduced motion it snaps open.
- Search results: pass `searchResults` and a panel opens joined under the field, as wide as it and sharing its outline; `null` hides it. Down arrow moves from the field into the panel's links, Up and Down step through them, and following a link closes the search.
