# Button

Pill-shaped, uppercase action; primary is the brand red with a soft red glow, secondary is a neutral pill.

**Consumer provides:** `children` (the label), optional `variant` (`primary` | `secondary` | `ghost`), `size` (`sm` | `md` | `lg`), `icon` (an Icon name, leading), `fullWidth`, `href` (renders a link), and the usual button attributes.

- One `primary` per view (the hero's "Watch trailer", a form's submit). Pair it with a `secondary`.
- Labels are verbs, two words or fewer: WATCH TRAILER, ADD TO LIST, RATE.
- Height is `button-height` (44px), which meets `tap-target`. Use `sm` only in dense desktop toolbars.
- On phones, place a pair in a two-column grid with `fullWidth`; under 360px stack them.
- `ghost` is for low-priority actions on surface-0 or surface-100; never on artwork.
