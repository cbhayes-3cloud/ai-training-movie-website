import { useState } from 'react';
import { GenreChips, Tabs } from 'reelscore';
import { catalog, type ListId } from '../api';
import { FeaturedHero } from '../components/FeaturedHero';
import { TitleRow } from '../components/TitleRow';
import { useAsync } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';

/** The hero tabs choose which list fills the first poster row. */
const BROWSE_TABS: { id: ListId; label: string }[] = [
  { id: 'trending', label: 'Trending now' },
  { id: 'top-rated', label: 'Top rated' },
  { id: 'premieres', label: 'Premieres' },
];

export function HomePage({ library }: { library: LibraryApi }) {
  const [tab, setTab] = useState<ListId>('trending');
  const [genres, setGenres] = useState<string[]>([]);

  const [featured] = useAsync((signal) => catalog.getFeatured(signal), []);
  const [genreList] = useAsync((signal) => catalog.getGenres(signal), []);
  const [browse, retryBrowse] = useAsync((signal) => catalog.getList(tab, signal), [tab]);
  const [topRated, retryTopRated] = useAsync((signal) => catalog.getList('top-rated', signal), []);
  const [newThisWeek, retryNew] = useAsync((signal) => catalog.getList('new-this-week', signal), []);

  const tabLabel = BROWSE_TABS.find((t) => t.id === tab)!.label;

  return (
    <>
      <FeaturedHero state={featured} library={library}>
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
        <TitleRow title={tabLabel} state={browse} onRetry={retryBrowse} genres={genres} library={library} />
      </div>
      {tab !== 'top-rated' && (
        <TitleRow title="Top rated by the community" state={topRated} onRetry={retryTopRated} genres={genres} library={library} />
      )}
      <TitleRow title="New this week" state={newThisWeek} onRetry={retryNew} genres={genres} library={library} />
    </>
  );
}
