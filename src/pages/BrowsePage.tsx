import { useState } from 'react';
import { GenreChips, Tabs } from 'reelscore';
import { catalog, type ListId, type Media } from '../api';
import { CatalogRow } from '../components/CatalogRow';
import { FeaturedHero } from '../components/FeaturedHero';
import { useAsync } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';

/** The hero tabs choose which list fills the first poster row. */
const BROWSE_TABS: { id: ListId; label: string }[] = [
  { id: 'trending', label: 'Trending now' },
  { id: 'top-rated', label: 'Top rated' },
  { id: 'new-this-week', label: 'New this week' },
  { id: 'premieres', label: 'Premieres' },
];

interface BrowsePageProps {
  /** Films only, series only, or both mixed for the homepage. */
  media: Media;
  library: LibraryApi;
}

/**
 * The homepage, Movies and Series: a featured hero, browse tabs, genre filters and poster rows.
 * On the mixed homepage, every list but trending shows as a films row and a series row.
 */
export function BrowsePage({ media, library }: BrowsePageProps) {
  const [tab, setTab] = useState<ListId>('trending');
  const [genres, setGenres] = useState<string[]>([]);

  const [featured] = useAsync((signal) => catalog.getFeatured(media, signal), [media]);
  const [genreList] = useAsync((signal) => catalog.getGenres(media, signal), [media]);

  const tabLabel = BROWSE_TABS.find((t) => t.id === tab)!.label;

  return (
    <>
      <FeaturedHero state={featured}>
        <Tabs
          label="Browse"
          overlay
          items={BROWSE_TABS.map((t) => ({ ...t, panelId: 'browse-panel' }))}
          value={tab}
          onChange={(id) => setTab(id as ListId)}
        />
      </FeaturedHero>

      {genreList.status === 'ready' && (
        <GenreChips genres={genreList.data} selected={genres} onChange={setGenres} label="Filter by genre" />
      )}

      <div id="browse-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <CatalogRow media={media} list={tab} title={tabLabel} genres={genres} library={library} />
      </div>
      {/* Fixed rows are skipped while the browse row above already shows the same list. */}
      {tab !== 'top-rated' && (
        <CatalogRow media={media} list="top-rated" title="Top rated by the community" genres={genres} library={library} />
      )}
      {tab !== 'new-this-week' && (
        <CatalogRow media={media} list="new-this-week" title="New this week" genres={genres} library={library} />
      )}
      {tab !== 'premieres' && <CatalogRow media={media} list="premieres" title="Premieres" genres={genres} library={library} />}
    </>
  );
}
