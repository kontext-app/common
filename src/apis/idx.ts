import { IDX } from '@ceramicstudio/idx';

import { aliases } from '../constants';
import { setDefaultBookmarksIndex, hasBookmarksIndex } from './bookmarks';
import { setDefaultListsIndex, hasListsIndex } from './lists';
import { setDefaultRatingsIndex, hasRatingsIndex } from './ratings';

import type { CeramicApi } from '@ceramicnetwork/common';

export function createIDX(ceramic: CeramicApi) {
  const idx = new IDX({
    ceramic,
    aliases: { ...aliases },
  });
  return idx;
}

export async function setDefaultKontextIDX(idx: IDX) {
  const [
    bookmarksIndexDocID,
    listsIndexDocID,
    ratingsIndexDocID,
  ] = await Promise.all([
    setDefaultBookmarksIndex(idx),
    setDefaultListsIndex(idx),
    setDefaultRatingsIndex(idx),
  ]);

  return {
    bookmarksIndexDocID,
    listsIndexDocID,
    ratingsIndexDocID,
  };
}

export async function hasDefaultKontextIDX(idx: IDX) {
  const [
    isBookmarksIndexSet,
    isListsIndexSet,
    isRatingsIndexSet,
  ] = await Promise.all([
    hasBookmarksIndex(idx),
    hasListsIndex(idx),
    hasRatingsIndex(idx),
  ]);

  return isBookmarksIndexSet && isListsIndexSet && isRatingsIndexSet;
}
