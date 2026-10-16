---
category: Navigation
---
# Footer

The site footer: the wordmark, a few utility links, and the attribution TMDB's API terms require on every page that shows TMDB data. It also credits Jake for the movie reel design.

**Consumer provides:** optional `links` (`{label, href}`), `brand`, `homeHref`, `productType` (completes the notice, default "website"), `copyright`, `designCredit` (rewords the built-in "Movie reel design by Jake." credit), `tmdbLogoSrc` (a self-hosted copy of the TMDB logo).

- Put it at the bottom of every page that shows TMDB data. Don't remove or reword the notice; it's the required text.
- The TMDB logo stays smaller than the Reelscore wordmark (14px tall); don't enlarge or recolor it.
- Keep links to utility pages (About, Help, Privacy, Terms), five or fewer.
- On phones, pad the page bottom for `BottomNav` as usual; the footer sits above it.
- The design credit always shows under the copyright; `designCredit` can reword it but not remove it.
