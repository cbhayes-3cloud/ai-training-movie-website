# Reelscore

Reelscore is a movie rating website: browse what's trending, top rated and coming soon, open any film for its cast, reviews, trailer and where to watch it, and keep your own ratings, likes and watch list. It's dark, cinematic and poster-first, designed for a phone and widening to desktop.

It's built as part of an AI Training series of classes, and it's a worked example of going from design to running code with Claude: the look and the components were designed in Claude, kept in sync as a design system with **design-sync**, and then used to build a React app on live data from **The Movie Database (TMDB)**.

**Stack:** React 18, TypeScript, Vite 5, a small Node server, the Reelscore design system (`reelscore-ds/`) and the TMDB API. No CSS framework: styling comes from the design system's tokens and components.

## Run it

1. Copy `.env.example` to `.env` and add your TMDB credentials (from https://www.themoviedb.org/settings/api). The read access token is preferred; the API key is a fallback. `.env` is git-ignored.
2. Start the dev server:

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

Set `VITE_USE_MOCK_DATA=true` in `.env` to use the built-in sample data instead of TMDB. You don't need credentials for that, so it's handy offline.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port 5173, with the TMDB proxy at `/api/tmdb` |
| `npm run build` | Type-checks, then builds the app into `dist/` |
| `npm start` | Serves the built app and the TMDB proxy on port 8787 (or `PORT`) |
| `npm run preview` | Vite's preview of the production build, also with the proxy |
| `npm run typecheck` | TypeScript only |

## How it was designed

The design came first and the app was built from it, so the app has very little styling of its own.

1. **Design in Claude.** The Reelscore look (the color, type, spacing and the homepage and title page concepts) was designed in Claude Design artifacts on claude.ai. That's where the "Spotlight" homepage and "Detail" title page designs come from.
2. **A design system from the design.** The tokens and 14 React components (NavBar, Hero, Tabs, GenreChips, PosterRow, MovieCard, RatingBadge, RatingInput, AgeBadge, Button, IconButton, Icon, BottomNav, Footer) live in a *Design System* artifact. They were downloaded into `reelscore-ds/project/`.
3. **A local package.** `reelscore-ds/` packages those files as `reelscore`, which the app depends on with `"reelscore": "file:./reelscore-ds"`. Its `dist/` is assembled from the artifact files (see `reelscore-ds/.design-sync/NOTES.md` for exactly how).
4. **design-sync.** The package is synced back to a Claude Design project with design-sync, so designers and Claude can mock up new screens with the same real components the app uses. The sync setup is in `reelscore-ds/.design-sync/`:
   - `config.json`: the target project, package name, CSS entry and per-component settings
   - `previews/`: a preview card for each component, shown in Claude Design
   - `conventions.md`: how to build with Reelscore, shown at the top of the synced README
   - `NOTES.md`: where everything came from, how to re-sync after the design changes, and the known risks
   - `reelscore-ds/docs/`: one doc per component; `reelscore-ds/guides/reelscore-brand-guide.md`: voice, color, type, layout and states
5. **Build the app.** The pages compose design system components and lay them out with its tokens.

`reelscore-components.html` is a standalone page that shows every component, handy for a quick look without running anything.

### Working with the design system

- Import components from `reelscore` and the styles once from `reelscore/dist/reelscore.css`.
- Style components with their props (`variant`, `size`, `tone`, `icon` and so on). Don't add or restyle `rs-*` classes.
- For page layout, use the tokens: `var(--surface-100)`, `var(--space-4)`, `var(--gutter-md)` and so on.
- Components size to their own container, not the viewport, so they show their phone layout in a narrow column.
- If the design changes, update the source artifact first, then follow the re-sync steps in `reelscore-ds/.design-sync/NOTES.md`, so the app, the artifact and Claude Design stay in step.

## How the app is put together

```
src/
  App.tsx          shell (NavBar, Footer, BottomNav) and routes
  router.ts        a minimal client-side router for plain <a href="/..."> links
  pages/
    HomePage.tsx   /            featured Hero, browse Tabs, GenreChips, poster rows
    TitlePage.tsx  /title/:id   the "Detail" design, e.g. /title/movie-550
  components/      app-level pieces built from design system components
  api/             the data layer: CatalogApi interface, TMDB and sample implementations
  hooks/
    useAsync.ts    loading and error state for API calls
    useLibrary.ts  your liked, watched and "my list" titles, and your ratings
server/
  tmdb-proxy.mjs   the TMDB proxy, used by both the dev and production servers
  index.mjs        production server: static files plus the proxy
reelscore-ds/      the Reelscore design system package and its design-sync setup
```

- **Home (`/`)** follows the "Spotlight" design: a featured Hero with browse Tabs, GenreChips and three poster rows. Every poster links to its title page.
- **Title page (`/title/:id`)** follows the "Detail" design: Hero with section Tabs, overview and credits, cast, reviews, your rating, community score, details and "More like this".
- **Data:** every screen reads from `catalog` in `src/api/index.ts`, which implements the `CatalogApi` interface in `types.ts`. It's the TMDB implementation, or the sample data when `VITE_USE_MOCK_DATA=true`, so the screens don't know or care which.
- **Your library** (likes, watched, my list and ratings) is saved in the browser for now. There are no accounts yet.

## Movie data (TMDB)

### Keeping the credentials secret

The browser never sees the TMDB credentials. It calls `/api/tmdb/*` on our own server, and `server/tmdb-proxy.mjs` adds the token server-side. The proxy:

- allows only the read endpoints the app uses
- caches responses for 10 minutes
- runs inside the Vite dev server (see `vite.config.ts`) and the production server (`server/index.mjs`), so dev and production behave the same

Only `VITE_*` variables reach the browser. The `TMDB_*` ones stay on the server.

### What comes from where

`src/api/tmdbCatalog.ts` maps TMDB responses to our `Title` type. Movies only for now.

| On screen | TMDB endpoint |
| --- | --- |
| Trending now | `/trending/movie/week` |
| Top rated | `/movie/top_rated` |
| Premieres | `/movie/upcoming` |
| New this week | `/discover/movie` for the last 7 days |
| Home hero | today's top trending film, plus one details call for runtime, US certification and trailer |
| Title page | one `/movie/{id}` call with `append_to_response=release_dates,videos,credits,reviews,recommendations,similar,watch/providers` |

Scores from fewer than 10 votes are hidden as noise.

### Gaps between the design and the API

- Rating distribution bars: TMDB only gives the average and count, so they're left out.
- "Helpful" counts on reviews: not in the API, so they're left out.
- Your rating is saved in the browser (`useLibrary`), not to an account. "Write a review" is disabled.
- Person pages, "Full cast & crew" and "See all reviews" have the data (`/person/{id}`, `/movie/{id}/credits`, `/movie/{id}/reviews`) but no pages yet, so names are plain text and those links are left out.

### Attribution

- TMDB's terms require attribution on every page that shows its data. The design system's `Footer` provides it with TMDB's official logo; keep it on every page.
- Watch-provider data comes from JustWatch, which TMDB requires us to credit wherever it appears.

This product uses the TMDB API but is not endorsed or certified by TMDB.
