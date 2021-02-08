import { IDX } from '@ceramicstudio/idx';

import { aliases } from '../constants';
import { setDefaultBookmarksIndex } from './bookmarks';
import { setDefaultListsIndex } from './lists';
import { setDefaultRatingsIndex } from './ratings';

import type { CeramicApi } from '@ceramicnetwork/common';

export function createIDX(ceramic: CeramicApi) {
  const idx = new IDX({
    ceramic,
    aliases: { ...aliases },
  });
  return idx;
}

export async function setDefaultKontextIndices() {
  const [
    bookmarksIndexDocID,
    listsIndexDocID,
    ratingsIndexDocID,
  ] = await Promise.all([
    setDefaultBookmarksIndex,
    setDefaultListsIndex,
    setDefaultRatingsIndex,
  ]);

  return {
    bookmarksIndexDocID,
    listsIndexDocID,
    ratingsIndexDocID,
  };
}
