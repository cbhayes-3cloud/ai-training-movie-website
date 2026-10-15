# RatingInput

Five stars the viewer taps to rate a title, in half-star steps that map to a score out of 10.

**Consumer provides:** optional `value` + `onChange` (controlled; whole points 1–10, so 7 = three and a half stars) or `defaultValue`, `label` (name the title: "Your rating for Harbor Lights"), `placeholder` (shown before a rating, default "Tap to rate").

- Each half star is a radio in one radiogroup; arrow keys step by one point, Home/End jump to 1 and 10.
- Stars are 28px, and 40px on touch screens so each half is a comfortable target.
- Filled stars are `gold`; empty stars are `surface-400` with an `outline` edge.
- The readout ("7 / 10") updates live; save on change, there is no submit button.
