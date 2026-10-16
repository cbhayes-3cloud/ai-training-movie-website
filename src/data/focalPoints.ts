/*
 * Hand-set focal points for hero artwork, for titles whose subject the default crop
 * ("50% 25%", set in the design system) cuts off. Keys are `Title.id`s; values are a
 * CSS object-position: "50% 0%" keeps the top edge, "70% 20%" favours the upper right.
 *
 * A point fits the backdrop TMDB served when it was set. If TMDB changes a title's
 * backdrop, check the point still fits.
 */
const FOCAL_POINTS: Record<string, string> = {
  'movie-1561726': '50% 0%', // Masterplan: heads at the very top of the frame
};

/** The hero focal point for a title, or undefined to use the default. */
export const focalPointFor = (id: string): string | undefined => FOCAL_POINTS[id];
