# design-sync notes: Reelscore

- **Source:** the Reelscore design lives in the claude.ai *Design System* artifact https://claude.ai/artifact/BLb9xkKXHpcwS8q7buSxrS (files under `project/`). It was downloaded to `project/` here. There's no npm build; `dist/` is assembled by hand from the artifact files:
  - `dist/reelscore.iife.js` = `project/components/bundle.js` (IIFE that reads `window.React` and assigns `window.Reelscore`)
  - `dist/index.js` imports `react-global.js` (sets `window.React`) and then the IIFE, and re-exports each component as an ES export
  - `dist/index.d.ts` = `project/components/index.d.ts`
  - `dist/reelscore.css` = the Google Fonts `@import` line first, then `project/tokens.css`, then `bundle.css` minus its `@import` (an `@import` must come first or it's dropped)
  - `docs/<Name>.md` = the component README with `category:` frontmatter taken from the artifact preview's `@dsCard group`
  - `guides/reelscore-brand-guide.md` = `project/README.md`
- **To re-sync after the artifact changes:** re-download `project/**`, redo the `dist/` assembly above, then run the resync driver.
- **Footer (added 2026-10-14)** is in both this folder and the source Design System artifact (published there as version 7). `dist/index.js` exports it with `export const Footer = R.Footer;`.
- **CastStrip (added 2026-10-16)**, from the film-strip cast concept on the homepage canvas (Jake's idea), was added the same way as Footer: in `project/components/` here and published to the source artifact. Its shimmer is a `background-attachment: fixed` gradient on each frame, so it sweeps the reel as one pass. iOS Safari ignores `fixed` there, so on iPhones each frame shimmers on its own. That's an accepted fallback.
- Footer embeds TMDB's official "alt short" logo as a data URI in `bundle.js` (downloaded 2026-10-14 from themoviedb.org/about/logos-attribution with the user's OK), so it renders in Claude Design, the artifact and the app without loading anything from TMDB.
- `Cover` is a brand cover page in the artifact, not a component, so it's not synced.
- `tokens.css` comes from the Reelscore *Design* artifact (https://claude.ai/artifact/C8CXfJ3Tpbsnr7xi77fX3t, `project/ds/reelscore/tokens.css`); it's generated from `tokens.json`.
- **Previews must paint their own dark surface.** The preview card harness sets `body{background:#fff}`, so white-ink components (MovieCard titles, nav labels) disappear without one. Every preview wraps in `var(--surface-0|100)`.
- `scrim` IconButton is invisible on surface-0 (the scrim is near-black), so its preview places it on a gold-to-red gradient that stands in for artwork.
- `dtsPropsFor` Button/IconButton: the extractor drops inherited `ButtonHTMLAttributes`, so `onClick`/`disabled`/`type` were hand-added.
- Render check needs Playwright **1.61.1**, which matches the cached chromium-1228 in `~/Library/Caches/ms-playwright`. It's installed in `.ds-sync/`.

- **Hero `showAddToList` (added 2026-10-16):** Add to list is off by default; Hero shows it only when `showAddToList` is true. When Watch is alone, `.rs-hero__actions > :only-child` spans the row. Published to the source Design System artifact (version 11, 2026-10-16).
- **Hero `focalPoint` (added 2026-10-16):** optional prop, applied as the image's inline `object-position`; the CSS default is `50% 25%` (was centred) so wide crops keep faces. Published to the source artifact (version 11, 2026-10-16).
- **Footer design credit (added 2026-10-16):** Footer always ends with "Movie reel design by Jake." (the movie reel / film-strip cast design; see CastStrip). `designCredit` rewords it. Published to the source artifact (version 11, 2026-10-16).
- **Tabs left-aligned (2026-10-16):** from 768px the tab list was `justify-content: space-between`; it's now `flex-start`, so tabs sit left on the gutter at every width. Published to the source artifact (version 11, 2026-10-16).
- **NavBar search (added 2026-10-19):** the search icon grows leftwards into a pill field, its width driven by a critically damped spring (SmoothDamp) in `bundle.js`, with `--rs-search-p` (0 closed, 1 open) fading the text and clear button. It measures the bar and covers the links, then the wordmark, when it can't fit 220px beside them. New props: `searchPlaceholder`, `searchValue`/`defaultSearchValue`, `defaultSearchOpen`, `onSearchChange`, `onSearchSubmit`, `onSearchClose`, and a `searchResults` slot shown in a panel joined under the field (`.rs-search__panel`, as wide as the field, arrow-key navigation). `onSearch` now fires when the field opens. Adds the `close` glyph (16 icons now). The NavBar preview gains a search-open row (card height 330). Published to the source Design System artifact (version 14, 2026-10-19), after confirming the artifact's copies still matched this repo's pre-search files.
- **Sync status (2026-10-19):** the source Design System artifact matches `project/` here, including `design-system.json` (its `lastChange` records the NavBar search sync). Not yet re-synced: the Claude Design project (`/design-sync`; its `_ds_bundle.js` and NavBar/Icon previews predate the search) and the mockup canvas's `project/ds/reelscore/` copy of the bundle and stylesheet.
- **Sync status (2026-10-16):** the source Design System artifact matches `project/` here: `bundle.js`, `bundle.css`, `index.d.ts`, the Hero/Tabs/Footer READMEs and `Footer/preview.html`. Its index `lastChange` was set by the re-sync.
- **One source of truth:** the Design System artifact (`BLb9xkKXHpcwS8q7buSxrS`) is the only place components are edited. Everything else is a copy of it:
  - this repo's `project/` and `dist/`, which are synced from it by hand (see above);
  - the Claude Design project **Reelscore** (`5d8d51f1-6acc-48e6-8905-255cfaf52391`, `config.json` `projectId`), which `/design-sync` writes to. Its `_ds_bundle.js` is a build of the components and was out of date with the Hero, Tabs and Footer changes until it was re-synced;
  - the mockup canvas **Reelscore homepage concepts** (`C8CXfJ3Tpbsnr7xi77fX3t`), whose `project/ds/reelscore/` holds a copy of the bundle and stylesheet. Its `tokens.css` comes from this canvas.
- Removed: the **Reelscore Components** artifact (`X6zcdDTtEy2xN4iJaDdgxT`), an older single-page copy of the components.
- **Last `/design-sync` run (2026-10-16):** atomic path into the pinned project `5d8d51f1-…`. Build, validate and render check passed with 15/15 previews. Hero, Tabs and Footer were re-captured and graded `good`; the rest carried forward. Uploaded 83 content files, the sentinel, and `_ds_sync.json` last; the remote list confirms all 85 of ours. No deletes were needed.
- **Setup for `/design-sync` on this machine:** the render check needs Playwright **1.61.1** in `.ds-sync/` (git-ignored) to match the cached Chromium-1228. Install it with `npm i playwright@1.61.1` inside `.ds-sync/`.
- **Planned rename:** the Claude Design project **Reelscore** (`5d8d51f1-…`) is to be renamed **Reelscore - Design Agent Library**, so it's not confused with the source artifact. Renaming it doesn't change the project ID.

## Known render warns
- (none outstanding after authoring)
- Tabs/GenreChips phone cells start slightly scrolled, because the component scrolls the selected item into view. That's real behavior, not a bug.

## Re-sync risks
- The Footer was added here and in the artifact by hand, not by a re-download. If the artifact is edited elsewhere, re-download `project/**` and rebuild `dist/` before the next sync.
- `dist/` is hand-assembled from artifact files, so if the artifact's `bundle.js`, `bundle.css`, `index.d.ts` or `tokens.css` change, rebuild `dist/` first or the sync ships stale code.
- `dtsPropsFor` for Button/IconButton duplicates the prop lists from `index.d.ts`. Update both if those APIs change.
- Fonts load from Google Fonts at runtime (`[FONT_REMOTE]`); nothing ships in `fonts/`.
