export const LoadingStatus: {
  IDLE: 'idle';
  PENDING: 'pending';
  FULFILLED: 'fulfilled';
  REJECTED: 'rejected';
} = {
  IDLE: 'idle',
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};

export const IDXAliases = {
  BOOKMARKS_INDEX: 'bookmarksIndex',
  LISTS_INDEX: 'listsIndex',
  RATINGS_INDEX: 'ratingsIndex',
  COMMENTS_INDEX: 'commentsIndex',
  AGGREGATED_RATINGS_INDEX: 'aggregatedRatingsIndex',
  CURATED_DOCS_INDEX: 'curatedDocsIndex',
};

export const DefaultBookmarksIndexKeys = {
  UNSORTED: 'unsorted',
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const DefaultListsIndexKeys = {
  UNSORTED: 'unsorted',
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const DefaultRatingsIndexKeys = {
  BOOKMARKS: 'bookmarks',
};

export const DefaultCommentsIndexKeys = {
  BOOKMARKS: 'bookmarks',
};

export const DefaultAggregatedRatingsIndexKeys = {
  BOOKMARKS: 'bookmarks',
};

export const DefaultCuratedDocsIndexKeys = {
  BOOKMARKS: 'bookmarks',
};

export const DefaultCuratedDocsKeys = {
  RECENT: 'recent',
  POPULAR: 'popular',
  featured: 'featured',
};

export const AuthenticationMethods: {
  SEED: 'seed';
  ETHEREUM: 'ethereum';
} = {
  SEED: 'seed',
  ETHEREUM: 'ethereum',
};
