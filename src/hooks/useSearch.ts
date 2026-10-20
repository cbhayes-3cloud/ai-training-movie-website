import { useEffect, useState } from 'react';
import { catalog, type SearchResults } from '../api';

/** Search starts once this many characters are typed. */
export const MIN_SEARCH_LENGTH = 3;
/** How long typing has to pause before a search is sent. */
const DEBOUNCE_MS = 250;

export interface SearchState {
  /** The text is long enough to search. */
  active: boolean;
  /** A search for the current text is waiting on the pause or on TMDB. */
  pending: boolean;
  /** The latest results, kept on screen while the next search runs. */
  results?: SearchResults;
  /** What `results` or `error` are for. */
  query?: string;
  error?: Error;
}

/** Searches as you type: after a short pause, once there are enough characters, cancelling the previous search. */
export function useSearch(text: string): SearchState {
  const query = text.trim();
  const active = query.length >= MIN_SEARCH_LENGTH;
  const [done, setDone] = useState<Pick<SearchState, 'results' | 'query' | 'error'>>({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!active) {
      setPending(false);
      return;
    }
    setPending(true);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      catalog.search(query, controller.signal).then(
        (results) => {
          setDone({ results, query });
          setPending(false);
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;
          setDone({ error: error instanceof Error ? error : new Error(String(error)), query });
          setPending(false);
        },
      );
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, active]);

  return { active, pending, ...done };
}
