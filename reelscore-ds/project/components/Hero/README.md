# Hero

The featured title at the top of a page: artwork, age badge, score, year, a spaced uppercase title, a synopsis, a Watch button and an optional Add to list button.

**Consumer provides:** `title`, optional `image` (wide artwork, at least 1600px), `focalPoint` (the part of the art to keep in frame), `ageRating`, `rating`, `year`, `length` ("2 seasons", "1h 54m"), `synopsis` (one or two sentences), `onWatch`, `watchLabel`, `showAddToList` (default false) with `onAddToList` and `addLabel`, and `children` (usually `Tabs` with `overlay`) for the band along its bottom.

- Phones: artwork on top at 4:3, fading into `surface-0`; copy below; buttons side by side at full width (stacked under 360px). The title uses `title-spaced-sm`.
- From 768px: copy sits over the artwork on the left, protected by a `scrim` gradient; the title uses `title-spaced`.
- Add to list is off by default. Set `showAddToList` (with `onAddToList`) to show it; without it, Watch spans the row on phones.
- Keep the synopsis under 160 characters so it stays within four lines on a phone.
- Choose art with the subject on the right half so the scrim never covers a face.
- The art crops to fill the frame: the top and bottom on wide screens, the sides on phones. Cropping keeps `focalPoint` in view, a CSS `object-position` such as "50% 20%". The default, "50% 25%", favours the top, where faces usually are.
