import type { Doctype } from '@ceramicnetwork/common';

export interface CeramicDoc<T> extends Doctype {
  content: T;
}

export type CuratedDocsIndexDocContent = {
  bookmarks: string;
  [key: string]: string;
};

export type CuratedDocsIndexDoc = CeramicDoc<CuratedDocsIndexDocContent>;

export type CuratedDocsDocContent = {
  recent: string[];
  popular: string[];
  featured: string[];
  [key: string]: string[];
};

export type CuratedDocsDoc = CeramicDoc<CuratedDocsDocContent>;

export type AggregatedRatingsIndexDocContent = {
  bookmarks: string;
  [key: string]: string;
};

export type AggregatedRatingsIndexDoc = CeramicDoc<AggregatedRatingsIndexDocContent>;

export type AggregatedRatingsDocContent = {
  [ratedDocId: string]: AggregatedRating;
};

export type AggregatedRatingDoc = CeramicDoc<AggregatedRatingsDocContent>;

export type AggregatedRating = {
  ratedDocId: string;
  aggregatedRating: number;
  aggregatedRatingDocIds: string[];
};

export type RatingsIndexDocContent = {
  bookmarks: string[];
  [key: string]: string[];
};

export type RatingsIndexDoc = CeramicDoc<RatingsIndexDocContent>;

export type RatingDocContent = {
  ratedDocId: string;
  bestRating: number;
  worstRating: number;
  rating: number;
  creationDate: string;
  author: string;
};

export type RatingDoc = CeramicDoc<RatingDocContent>;

export type BookmarksIndexDocContent = {
  unsorted: string[];
  public: string[];
  private: string[];
  [key: string]: string[];
};

export type BookmarksIndexDoc = CeramicDoc<BookmarksIndexDocContent>;

export type BookmarkDocContent = {
  url: string;
  title: string;
  author: string;
  description: string;
  highlightedText: string;
  creationDate: string;
};

export type BookmarkDoc = CeramicDoc<BookmarkDocContent>;

export type ListDocContent = {
  title: string;
  author: string;
  description: string;
  creationDate: string;
  items: Array<string>;
};

export type ListDoc = CeramicDoc<ListDocContent>;

export type ListsIndexDocContent = {
  unsorted: string[];
  public: string[];
  private: string[];
  [key: string]: string[];
};

export type ListsIndexDoc = CeramicDoc<ListsIndexDocContent>;

export type BasicProfileDocContent = {
  name: string;
  description: string;
  image: string;
};

export type BasicProfileDoc = CeramicDoc<BasicProfileDocContent>;

export type AuthenticationMethod = 'seed' | 'ethereum';

export type DefaultBookmarksIndexKey = 'unsorted' | 'public' | 'private';

export type LoadingStatus = 'idle' | 'pending' | 'rejected' | 'fulfilled';
