import { IDX } from '@ceramicstudio/idx';

import { definitions, enums, schemas } from '../constants';

import type { CeramicApi } from '@ceramicnetwork/common';
import type {
  BasicProfileDocContent,
  BookmarksIndexDocContent,
  BookmarkDocContent,
  BookmarksDoc,
} from '../types';

export function createIDX(ceramic: CeramicApi) {
  const idx = new IDX({
    ceramic,
    aliases: { ...definitions },
  });
  return idx;
}
