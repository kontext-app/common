import { PUBLISHED_DEFINITIONS } from './definitions';
import { IDXAliases } from './enums';

export const ALIASES = {
  [IDXAliases.BOOKMARKS_INDEX]: PUBLISHED_DEFINITIONS.BookmarksIndex,
  [IDXAliases.LISTS_INDEX]: PUBLISHED_DEFINITIONS.ListsIndex,
  [IDXAliases.RATINGS_INDEX]: PUBLISHED_DEFINITIONS.RatingsIndex,
  [IDXAliases.AGGREGATED_RATINGS_INDEX]:
    PUBLISHED_DEFINITIONS.AggregatedRatingsIndex,
  [IDXAliases.COMMENTS_INDEX]: PUBLISHED_DEFINITIONS.CommentsIndex,
};
