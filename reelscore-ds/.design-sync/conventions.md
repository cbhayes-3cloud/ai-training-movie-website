# Reelscore: how to build with it

Reelscore is a **dark-only**, poster-first movie and series rating UI. It's React 18; every component is on `window.Reelscore` (`const { NavBar, Hero, PosterRow, MovieCard } = window.Reelscore;`).

## Setup
- There is no provider or theme wrapper. Tokens are plain CSS custom properties on `:root`, and component styles are `rs-*` classes. Both arrive through `styles.css`, along with DM Sans and Bebas Neue from Google Fonts.
- **Always put content on a Reelscore surface.** `styles.css` sets `body { background: var(--surface-100); color: var(--ink) }`. Any container you add with a light or white background makes the white text (card titles, nav labels) invisible. Give your own wrappers `background: var(--surface-0 | --surface-100 | --surface-200)`.
- Components size to their **own container** (container queries), not the viewport. A NavBar, Tabs, PosterRow or Hero inside a 375px column shows its phone layout; at 768px or wider it shows desktop. Give full-width bands `width: 100%`.
- On phones use `BottomNav` (fixed by default) and pad the page bottom by `var(--bottom-nav-height)`.

## Styling idiom: tokens via `var(--*)`, components via props
Style components with their props: `variant`, `size`, `tone`, `icon`, `pressed`, `fullWidth`. Don't add `rs-*` classes by hand. For your own layout glue, use inline styles with these tokens:
- Surfaces: `--surface-0` (chrome/hero), `--surface-100` (page), `--surface-200` (bands/panels), `--surface-300`, `--surface-400`, `--backdrop`, `--scrim`, `--line`, `--outline`
- Text: `--ink`, `--ink-muted` (metadata), `--ink-faint` (disabled only), `--brand-text` (small red text/links)
- Accent: `--brand` (action/selection only), `--gold` (ratings), `--gold-deep` and `--on-gold` (age badge)
- Space: `--space-1`…`--space-8` (4, 8, 12, 16, 24, 32, 48, 64px); gutters `--gutter-sm` (16), `--gutter-md` (32), `--gutter-lg` (64)
- Shape and depth: `--radius-xs`/`-sm`/`-md`/`-pill`, `--shadow-glow`, `--shadow-poster`
- Type: `font-family: var(--font-sans)` everywhere (`--font-display` is for the wordmark only). Headings are 600 weight: page titles 28px, row titles 20px. Body is 15px, metadata 12px in `--ink-muted`.

## Content rules
- Sentence case everywhere except Button labels, which render uppercase automatically.
- Scores always show one decimal and are out of 10 (`rating={7.0}` displays "7.0").
- No emoji; use `Icon` (`star`, `heart`, `eye`, `play`, `plus`, `search`, `bell`, `chevronLeft`, `chevronRight`, `home`, `film`, `tv`, `list`, `check`, `user`, `close`, `settings`, `menu`).
- `brand` red is never a large background.

## Where the truth lives
- `styles.css` → `_ds_bundle.css`: every `rs-*` rule and all token definitions.
- `components/<group>/<Name>/<Name>.prompt.md`: per-component do's and don'ts.
- `guidelines/guides/reelscore-brand-guide.md`: voice, color, type, layout, states.

## Example
```jsx
const { NavBar, Hero, GenreChips, PosterRow, MovieCard, BottomNav } = window.Reelscore;
<div style={{ background: 'var(--surface-100)', minHeight: '100vh', paddingBottom: 'var(--bottom-nav-height)' }}>
  <NavBar links={[{ label: 'Home', active: true }, { label: 'Movies' }, { label: 'Series' }]} initials="CH" />
  <Hero title="The Long Orbit" ageRating="13+" rating={7.5} year="2024" length="2 seasons"
    synopsis="Stranded on a frozen moon, a salvage crew has one week to signal home." />
  <GenreChips genres={['Action', 'Drama', 'Sci-fi']} defaultSelected={['Drama']} />
  <PosterRow title="Trending now" seeAllHref="#">
    <MovieCard title="Harbor Lights" year="2024" rating={8.1} tone="night" />
    <MovieCard title="Ironbark" year="2023" rating={7.3} tone="red" />
  </PosterRow>
  <BottomNav items={[{ label: 'Home', icon: 'home', active: true }, { label: 'Search', icon: 'search' }]} />
</div>
```
