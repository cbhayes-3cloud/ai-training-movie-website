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
2. **A design system from the design.** The tokens and 15 React components (NavBar, Hero, Tabs, GenreChips, PosterRow, MovieCard, CastStrip, RatingBadge, RatingInput, AgeBadge, Button, IconButton, Icon, BottomNav, Footer) live in a *Design System* artifact. They were downloaded into `reelscore-ds/project/`.
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
    BrowsePage.tsx /, /movies, /series   featured Hero, browse Tabs, GenreChips, poster rows
    TitlePage.tsx  /title/:id            the "Detail" design, e.g. /title/movie-550 or /title/tv-1396
    SearchPage.tsx /search?q=&type=      results by tab: All, Films, Series, People
    ListPage.tsx   /lists/:list?media=   a page title and up to 100 titles in a grid (trending, top-rated, new-this-week, premieres)
    PersonPage.tsx /person/:id           an actor's or crew member's page, e.g. /person/287
  components/      app-level pieces built from design system components
  api/             the data layer: CatalogApi interface, TMDB and sample implementations
  hooks/
    useAsync.ts    loading and error state for API calls
    useLibrary.ts  your liked, watched and "my list" titles, and your ratings
    useSearch.ts   search-as-you-type: debounced, cancelled when the text changes
server/
  tmdb-proxy.mjs   the TMDB proxy, used by both the dev and production servers
  index.mjs        production server: static files plus the proxy
reelscore-ds/      the Reelscore design system package and its design-sync setup
```

- **Home (`/`), Movies (`/movies`) and Series (`/series`)** follow the "Spotlight" design: a featured Hero with browse Tabs (Trending now, Top rated, New this week, Premieres), GenreChips and poster rows: the tab's list, then Top rated, New this week and Premieres (a fixed row is skipped while the tab shows the same list). Movies shows only films, Series only TV series, and Home mixes the two. TMDB only mixes films and series for trending, so on Home the other lists show as a films row and a series row, each in TMDB's order, and a mixed list page (`?media=all`) splits them into Films and Series sections. Every poster links to its title page (`/title/movie-…` or `/title/tv-…`), and series cards show their season count when it's known.
- **List pages (`/lists/:list?media=all|movie|series`)**, such as `/lists/top-rated?media=series`: the page title and the whole list, up to 100 titles, in a grid with no hero and no scrolling rows. The list comes from the path and the media from the query (both films and series if it's left out). The "See all" links on Home, Movies and Series open them. TMDB serves 20 titles a page, so a list page fetches six pages of each kind in parallel (one spare, in case the ranking shifts while they load).
- **Title page (`/title/:id`)** works for films and series and follows the "Detail" design: Hero with section Tabs, overview and credits, cast, reviews, your rating, community score, details and "More like this". Every name in the credits and every cast frame links to that person's page.
- **Person page (`/person/:id`)** follows the "Person page" design: a profile header (portrait, name, birth and death, credit counts) over the backdrop of their best-known title, section Tabs, a Known for grid of their 12 most-voted titles, the biography (folded when it's long), a filmography with a tab per department (their main one first, 20 credits shown, then "Show all"), and details, highest rated and links to IMDb, Instagram and their site. Known for leaves out talk shows and appearances as themselves, and puts cameos (billed below 15th, or under 3 episodes of a series) after bigger roles. "First film" counts films only, because TMDB dates a series credit by the show's first episode. Every title links to its title page.
- **Search** lives in the NavBar on every page. After 3 characters and a 250 ms pause it searches TMDB's films, series and people in parallel (`/search/movie`, `/search/tv`, `/search/person`), and each further keystroke searches again, cancelling the one before. Results show in a panel joined under the field (`src/components/SearchPanel.tsx`, `src/hooks/useSearch.ts`): films and series interleaved by popularity, then people. A person links to their person page.
- **Search results page (`/search?q=…&type=all|films|series|people`)** opens when you press Enter in the search field. It says how many films, series and people match, then tabs: All shows six films, six series and a strip of people, ordered by their best match (people first when a name is exactly what you searched for); Films, Series and People list every match, 20 at a time with "Show more". With no matches it suggests what's trending. The design mockup is `design/search-results.html` (open it from the dev server).
- **Data:** every screen reads from `catalog` in `src/api/index.ts`, which implements the `CatalogApi` interface in `types.ts`. It's the TMDB implementation, or the sample data when `VITE_USE_MOCK_DATA=true`, so the screens don't know or care which.
- **Your library** (likes, watched, my list and ratings) is saved in the browser for now. There are no accounts yet.
- **Hero crops:** hero art crops from `50% 25%` by default, which keeps faces on wide screens. If a backdrop still cuts someone off, add its title id and a CSS `object-position` to `src/data/focalPoints.ts`, for example `'movie-1561726': '50% 0%'` keeps Masterplan's top edge.

## Movie data (TMDB)

### Keeping the credentials secret

The browser never sees the TMDB credentials. It calls `/api/tmdb/*` on our own server, and `server/tmdb-proxy.mjs` adds the token server-side. The proxy:

- allows only the read endpoints the app uses
- caches responses for 10 minutes
- runs inside the Vite dev server (see `vite.config.ts`) and the production server (`server/index.mjs`), so dev and production behave the same

Only `VITE_*` variables reach the browser. The `TMDB_*` ones stay on the server.

### What comes from where

`src/api/tmdbCatalog.ts` maps TMDB's film and TV responses to our `Title` type. Ids carry the type, so `movie-550` is a film and `tv-1396` a series.

| On screen | Films (Movies) | Series | Home (both) |
| --- | --- | --- | --- |
| Trending now | `/trending/movie/week` | `/trending/tv/week` | `/trending/all/week` (people are dropped) |
| Top rated | `/movie/top_rated` | `/tv/top_rated` | separate films and series rows, each in TMDB's order |
| Premieres | `/discover/movie`, first-ever release in the next 30 days (so re-releases don't count) | `/discover/tv`, first airing in the next 30 days | separate films and series rows, each in TMDB's order |
| New this week | `/discover/movie` for the last 7 days | `/discover/tv`, first aired in the last 7 days | separate films and series rows, each in TMDB's order |
| Hero | today's top trending film, plus one details call for runtime, US certification and trailer | today's top trending series, plus one details call for seasons, US TV rating and trailer | today's top trending film or series from `/trending/all/day`, plus the matching details call |
| Genre chips | `/genre/movie/list` | `/genre/tv/list` (TMDB's TV genres differ, such as "Action & adventure") | both, merged (see below) |
| Title page | one `/movie/{id}` call with `append_to_response=release_dates,videos,credits,reviews,recommendations,similar,watch/providers` | one `/tv/{id}` call with `append_to_response=content_ratings,videos,aggregate_credits,reviews,recommendations,similar,watch/providers` | |
| Person page | `/person/{id}` with `append_to_response=combined_credits,external_ids`, one call for films and series together | | |

Home's genre chips use TMDB's broader TV genres so one chip matches both kinds: "Action & adventure" covers the film genres Action and Adventure, and "Sci-fi & fantasy" covers Science Fiction and Fantasy. Horror and Mystery come from the film list (Mystery is also a TV genre). The TMDB adapter labels each title's genres for the page showing it, so a film is "Sci-fi" on Movies and "Sci-fi & fantasy" on Home.

The series "new" lists leave out news and talk shows, which would otherwise fill them with daily episodes. A series title page shows "Created by" instead of a director and writers, and its cast covers every season.

Scores from fewer than 10 votes are hidden as noise.

### Gaps between the design and the API

- Rating distribution bars: TMDB only gives the average and count, so they're left out.
- "Helpful" counts on reviews: not in the API, so they're left out.
- Your rating is saved in the browser (`useLibrary`), not to an account. The title page has no "Write a review" button, and no hero shows "Add to list" (Hero's `showAddToList` is off by default).
- "Full cast & crew" and "See all reviews" have the data (`/movie/{id}/credits`, `/movie/{id}/reviews`) but no pages yet, so those links are left out.
- The sample data (`VITE_USE_MOCK_DATA=true`) has no people, so person pages only work on TMDB data.

### Attribution

- TMDB's terms require attribution on every page that shows its data. The design system's `Footer` provides it with TMDB's official logo; keep it on every page.
- Watch-provider data comes from JustWatch, which TMDB requires us to credit wherever it appears.

This product uses the TMDB API but is not endorsed or certified by TMDB.
