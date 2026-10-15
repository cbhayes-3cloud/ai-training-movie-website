import { useCallback, useEffect, useState } from 'react';

/**
 * The viewer's own state: liked, watched and saved titles and their ratings, kept in this
 * browser until there is a user account API to store it.
 */
interface Library {
  liked: string[];
  watched: string[];
  myList: string[];
  /** Title id → score out of 10. */
  ratings: Record<string, number>;
}

const KEY = 'reelscore.library.v1';
const EMPTY: Library = { liked: [], watched: [], myList: [], ratings: {} };

function read(): Library {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function useLibrary() {
  const [library, setLibrary] = useState<Library>(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(library));
    } catch {
      // Storage can be unavailable (private mode); the state still works for this session.
    }
  }, [library]);

  const toggle = useCallback((list: 'liked' | 'watched' | 'myList', id: string) => {
    setLibrary((lib) => ({
      ...lib,
      [list]: lib[list].includes(id) ? lib[list].filter((x) => x !== id) : [...lib[list], id],
    }));
  }, []);

  const rate = useCallback((id: string, score: number) => {
    setLibrary((lib) => ({ ...lib, ratings: { ...lib.ratings, [id]: score } }));
  }, []);

  return {
    isLiked: (id: string) => library.liked.includes(id),
    isWatched: (id: string) => library.watched.includes(id),
    inMyList: (id: string) => library.myList.includes(id),
    toggleLiked: (id: string) => toggle('liked', id),
    toggleWatched: (id: string) => toggle('watched', id),
    toggleMyList: (id: string) => toggle('myList', id),
    ratingOf: (id: string): number | undefined => library.ratings[id],
    rate,
  };
}

export type LibraryApi = ReturnType<typeof useLibrary>;
