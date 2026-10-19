import { mockCatalog } from './mockCatalog';
import { tmdbCatalog } from './tmdbCatalog';
import type { CatalogApi } from './types';

export type { CatalogApi, Credit, CreditGroup, ListId, Media, Person, PersonDetails, Review, Title, TitleDetails } from './types';

/**
 * The data source the whole app reads from: TMDB through our proxy, or the
 * built-in sample data when VITE_USE_MOCK_DATA=true (handy offline).
 */
export const catalog: CatalogApi = import.meta.env.VITE_USE_MOCK_DATA === 'true' ? mockCatalog : tmdbCatalog;
