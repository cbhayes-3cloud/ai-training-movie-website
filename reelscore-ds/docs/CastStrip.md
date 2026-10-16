---
category: Content
---
# CastStrip

The cast as a strip of film: sprocketed frames with each actor's photo, and their name and character printed below the reel. A soft highlight sweeps the film every few seconds.

**Consumer provides:** `people` (`{name, role, photo, href, tone}`), optional `title` (adds a "Reel 1" leader frame), `reel`, `stock`, `label`, `shimmer` (default true).

- Use it for the Cast section of a title page, under a `heading-2` "Cast" and a "Full cast & crew" link. Billing order, 8 to 20 people; link the rest.
- Give every person a `photo` when you have one (portrait, 2:3). Without one the frame shows initials on a tone fill; tones cycle night, red, slate, gold.
- Pass `href` to make a frame open that person's page; the link is named "<name> as <role>".
- Sprocket holes show the page through the film: on a surface other than `surface-100`, set `--rs-strip-hole` to that surface.
- Frames are 176px wide and the strip scrolls sideways with snapping; it never wraps.
- The shimmer stops for `prefers-reduced-motion`. Don't add other motion to the strip.
