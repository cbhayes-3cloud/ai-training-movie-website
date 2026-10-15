Reelscore is a movie and series rating app: dark, cinematic, poster-first, with one signature red. Every screen is designed for a 375px phone first and widens to desktop. Components adapt to the width of their own container, so they work in a sidebar or a full page alike.

## Content fundamentals

- **Voice:** a well-read friend at the cinema, not a critic. Short, plain, confident. Talk to the viewer as "you"; the app never says "I" or "we".
- **Casing:** sentence case for headings, tabs, chips and links ("Trending now", "Because you rated Ironbark"). Buttons are the one exception: uppercase, set in `button-label` (WATCH TRAILER, ADD TO LIST).
- **Numbers:** scores always carry one decimal ("7.5", "7.0") and are out of 10. Counts abbreviate ("12.4k ratings"). Years are four digits; runtimes read "1h 54m"; series read "2 seasons".
- **Synopses:** one or two sentences, under 160 characters, present tense, no spoilers.
- **No emoji** in the interface. Stars and hearts are icons, never characters.
- **Empty states** say what to do next, in one line: "Rate three films to get recommendations."

## Visual foundations

### Color

The system has one theme, Dark. Artwork carries the color; the interface stays near-black so posters glow.

- Layer surfaces from dark to light: `surface-0` for chrome (top nav, hero, bottom nav), `surface-100` for the page, `surface-200` for the filter band and panels, `surface-300` for neutral controls, `surface-400` for their hover.
- `brand` red is for action and selection only: the primary button, selected chips, the active tab and nav underline, a liked heart, the wordmark. Never use it as a background for large areas or for small text; red text uses `brand-text`.
- `gold` belongs to ratings: stars and scores on cards, and the filled stars in RatingInput. `gold-deep` with `on-gold` is reserved for the age badge.
- Text is `ink` (white) or `ink-muted`. `ink-faint` is for disabled states and dividers only; it fails 4.5:1.
- Over artwork, protect text with a `scrim` gradient into `surface-0`; never place text on raw imagery.
- `backdrop` fills hero and poster frames while images load.

### Type

- **DM Sans** (Google Fonts, variable 300–700) for everything; **Bebas Neue** only for the wordmark. Load both with the `@import` at the top of `components/bundle.css`.
- The featured title is the system's signature: `title-spaced`, light weight, uppercase, tracked 0.5em (`title-spaced-sm` at 0.32em on phones).
- Headings: `heading-1` for page titles, `heading-2` for row titles. Running text: `body`; hero synopsis: `body-lg`. Small print: `meta` in `ink-muted`. Scores: `score`, tabular figures.
- Under 768px swap in the Mobile styles: `title-spaced-sm`, `heading-1-sm`, `body-lg-sm`. Body text never goes below 15px, and inputs never below 16px (iOS zooms on smaller).

### Layout and responsiveness

- Breakpoints: `bp-sm` 480px, `bp-md` 768px, `bp-lg` 1024px, `bp-xl` 1280px. Design at 375px first.
- Side gutters: `gutter-sm` (16px) on phones, `gutter-md` (32px) from 768px, `gutter-lg` (64px) from 1280px. Content max width 1440px.
- Under 768px: NavBar shows only the wordmark, search and avatar; sections move to BottomNav. Pad the page bottom by `bottom-nav-height` plus the safe-area inset.
- Rows scroll horizontally with scroll snap (PosterRow, Tabs, GenreChips) rather than wrapping into tall grids. Arrows appear only from 1024px on hover-capable pointers.
- Every tappable thing has a hit area of at least `tap-target` (44px). Small icon buttons keep an invisible extended hit area.
- Section rhythm: `space-6` between sections on phones, `space-7` on desktop; `space-5` between blocks inside the hero.

### Shape, depth and motion

- Controls are pills or circles (`radius-pill`). Posters are nearly square-cornered (`radius-sm`); the age badge uses `radius-xs`; panels and menus `radius-md`.
- Depth comes from surface steps, not borders. Two shadows only: `shadow-glow` under red controls and `shadow-poster` when a poster lifts on hover or focus.
- Motion is quick and quiet: 150ms color fades, a 4px poster lift, smooth row scrolling. Honour `prefers-reduced-motion`: no lifts, no transitions.

### States

- Hover: neutral controls step from `surface-300` to `surface-400`; red controls darken to `brand-hover`, pressed `brand-press`.
- Focus: a 2px solid `focus` (white) outline with a 2px offset on every interactive element. It holds 14:1 or better on every surface.
- Selected: red fill plus a check mark (chips), red underline plus white label (tabs, nav). Selection never relies on color alone.
- Disabled: `surface-300` fill, `ink-faint` label, no glow.

## Iconography

- A small set of filled glyphs on a 24px grid, drawn for this system and exported by the `Icon` component (star, heart, eye, play, plus, search, bell, chevrons, home, film, tv, list, check, user). They fill with `currentColor`.
- The reference screenshot used a generic filled icon style; these glyphs approximate it and are not copied from any icon library. Replace them with a licensed set (for example Material Symbols, filled) if you need more than these 15, and keep the filled style.
- Sizes: 13–16px inline with text, 20px in buttons and the top nav, 22px in the bottom nav, 24px for carousel arrows.
- No logo file exists yet: the wordmark is the name set in Bebas Neue in `brand`, rendered by NavBar. Replace it when a real logo is drawn.

## Components

Icon, Button, IconButton, NavBar, BottomNav, Tabs, GenreChips, AgeBadge, RatingBadge, RatingInput, MovieCard, PosterRow and Hero, exported on `window.Reelscore` by `components/bundle.js` (React 18). Read each component's README for what you provide and its do's and don'ts. Placeholder titles in the previews (Harbor Lights, Ironbark, The Long Orbit) are invented.
