# Icon

Eighteen glyphs on a 24px grid that inherit `currentColor` (all filled except the outlined `settings` gear), used inside every other component.

**Consumer provides:** `name` (one of `Icon.names`), optional `size` (default 20) and `title`.

- Without `title` the icon is hidden from assistive tech; give a `title` only when the icon stands alone and carries meaning (an icon *button* gets its name from `IconButton`'s `label` instead).
- Color comes from the parent: `ink` in chrome, `ink-muted` when inactive, `brand` for a liked heart, `gold` for stars.
- Sizes: 13–16px beside text, 20px in buttons, 22–24px in navigation.
- Don't stroke, outline or recolor parts of a glyph; don't mix in another icon set.
