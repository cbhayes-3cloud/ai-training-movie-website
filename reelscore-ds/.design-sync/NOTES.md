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
- Footer embeds TMDB's official "alt short" logo as a data URI in `bundle.js` (downloaded 2026-10-14 from themoviedb.org/about/logos-attribution with the user's OK), so it renders in Claude Design, the artifact and the app without loading anything from TMDB.
- `Cover` is a brand cover page in the artifact, not a component, so it's not synced.
- `tokens.css` comes from the Reelscore *Design* artifact (https://claude.ai/artifact/C8CXfJ3Tpbsnr7xi77fX3t, `project/ds/reelscore/tokens.css`); it's generated from `tokens.json`.
- **Previews must paint their own dark surface.** The preview card harness sets `body{background:#fff}`, so white-ink components (MovieCard titles, nav labels) disappear without one. Every preview wraps in `var(--surface-0|100)`.
- `scrim` IconButton is invisible on surface-0 (the scrim is near-black), so its preview places it on a gold-to-red gradient that stands in for artwork.
- `dtsPropsFor` Button/IconButton: the extractor drops inherited `ButtonHTMLAttributes`, so `onClick`/`disabled`/`type` were hand-added.
- Render check needs Playwright **1.61.1**, which matches the cached chromium-1228 in `~/Library/Caches/ms-playwright`. It's installed in `.ds-sync/`.

## Known render warns
- (none outstanding after authoring)
- Tabs/GenreChips phone cells start slightly scrolled, because the component scrolls the selected item into view. That's real behavior, not a bug.

## Re-sync risks
- The Footer was added here and in the artifact by hand, not by a re-download. If the artifact is edited elsewhere, re-download `project/**` and rebuild `dist/` before the next sync.
- `dist/` is hand-assembled from artifact files, so if the artifact's `bundle.js`, `bundle.css`, `index.d.ts` or `tokens.css` change, rebuild `dist/` first or the sync ships stale code.
- `dtsPropsFor` for Button/IconButton duplicates the prop lists from `index.d.ts`. Update both if those APIs change.
- Fonts load from Google Fonts at runtime (`[FONT_REMOTE]`); nothing ships in `fonts/`.
