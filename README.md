# Reelscore

A movie and series rating site built with React 18, TypeScript and Vite, using the Reelscore design system.

## Run it

1. Copy `.env.example` to `.env` and add your TMDB credentials (from https://www.themoviedb.org/settings/api). `.env` is git-ignored.
2. Start the dev server:

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

For production, `npm run build` then `npm start` serves the built app and the TMDB proxy on port 8787 (or `PORT`).

Set `VITE_USE_MOCK_DATA=true` in `.env` to use the built-in sample data instead of TMDB.

## How it's put together

- `src/App.tsx`: the shell (NavBar, Footer, BottomNav) and routes. `src/router.ts` is a minimal router: plain `<a href="/...">` links are handled client-side.
- `src/pages/HomePage.tsx` (`/`): a featured Hero with browse Tabs, GenreChips and three poster rows, following the "Spotlight" concept in the Reelscore homepage designs. Every poster links to its title page.
- `src/pages/TitlePage.tsx` (`/title/:id`, e.g. `/title/movie-550`): the "Detail" design. Hero with section Tabs, overview and credits, cast, reviews, your rating, community score, details and "More like this".
- `src/api/`: the data layer. All screens read from `catalog`, which implements the `CatalogApi` interface in `types.ts`.
- `src/hooks/useLibrary.ts`: the viewer's liked, watched and "my list" titles, saved in the browser for now.
- `reelscore-ds/`: the Reelscore design system as a local package (`"reelscore": "file:./reelscore-ds"`). Import components from `reelscore` and its styles from `reelscore/dist/reelscore.css`. Don't restyle `rs-*` classes; use the design tokens (`var(--surface-100)`, `var(--space-4)` and so on) for page layout.

## Movie data (TMDB)

- `src/api/tmdbCatalog.ts` maps TMDB responses to our `Title` type. Movies only for now.
  - Trending now: `/trending/movie/week`
  - Top rated: `/movie/top_rated`
  - Premieres: `/movie/upcoming`
  - New this week: `/discover/movie` for the last 7 days
  - Hero: today's top trending film, plus one details call for runtime, US certification and trailer
  - Title page: one `/movie/{id}` call with `append_to_response=release_dates,videos,credits,reviews,recommendations,similar,watch/providers`
- Title page parts of the design with no API yet:
  - Rating distribution bars (TMDB only gives the average and count), so they're left out.
  - "Helpful" counts on reviews, so they're left out.
  - Your rating is saved in the browser (`useLibrary`), not to an account. "Write a review" is disabled.
  - Person pages, "Full cast & crew" and "See all reviews" have the data (`/person/{id}`, `/movie/{id}/credits`, `/movie/{id}/reviews`) but no pages yet, so names are plain text and those links are left out.
- Watch-provider data comes from JustWatch, which TMDB requires us to credit wherever it appears.
- The browser never sees the credentials. It calls `/api/tmdb/*`, and `server/tmdb-proxy.mjs` adds the token server-side. The proxy allows only the read endpoints we use and caches responses for 10 minutes. The same handler runs inside the Vite dev server and the production server.
- Scores from fewer than 10 votes are hidden as noise.
- TMDB's terms require attribution on every page that shows its data. The `Footer` component from the design system provides it; keep it on every page.
