import { useEffect, useState } from 'react';

/*
 * A minimal client-side router: plain <a href="/..."> links are intercepted and
 * pushed onto history, so design-system components that render links (MovieCard,
 * NavBar) work without knowing about routing. Both servers fall back to
 * index.html for unknown paths, so deep links load the app.
 */

/** The title page for a `Title.id`. */
export const titleHref = (id: string) => `/title/${encodeURIComponent(id)}`;

/** The person page for a `Person.id` ("person-287" → "/person/287"). */
export const personHref = (id: string) => `/person/${encodeURIComponent(id.replace(/^person-/, ''))}`;

/** The tabs of the search results page. */
export const SEARCH_TYPES = ['all', 'films', 'series', 'people'] as const;
export type SearchType = (typeof SEARCH_TYPES)[number];

/** The search results page, such as `/search?q=dune` or `/search?q=dune&type=series`. */
export const searchHref = (q: string, type: SearchType = 'all') =>
  `/search?q=${encodeURIComponent(q)}${type === 'all' ? '' : `&type=${type}`}`;

/** A full list page, such as `/lists/top-rated?media=series`. */
export const listHref = (list: string, media: string) => `/lists/${list}?media=${encodeURIComponent(media)}`;

export function navigate(href: string) {
  history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

function isAppLink(e: MouseEvent): HTMLAnchorElement | undefined {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.('a');
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#')) return; // in-page anchors and placeholder links
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  return a;
}

const current = () => location.pathname + location.search;

/** The current path and query string, updated on link clicks and back/forward. */
export function useLocation() {
  const [url, setUrl] = useState(current);

  useEffect(() => {
    const onPop = () => setUrl(current());
    const onClick = (e: MouseEvent) => {
      const a = isAppLink(e);
      if (!a) return;
      e.preventDefault();
      const url = new URL(a.href);
      if (url.pathname + url.search !== location.pathname + location.search) navigate(url.pathname + url.search);
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const at = url.indexOf('?');
  return {
    path: at < 0 ? url : url.slice(0, at),
    query: new URLSearchParams(at < 0 ? '' : url.slice(at)),
  };
}
