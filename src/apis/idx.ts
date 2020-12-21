import { IDX } from '@ceramicstudio/idx';
import { definitions } from '@ceramicstudio/idx-constants';

import { PUBLISHED_DEFINITIONS } from '../constants/definitions';

import type { CeramicApi } from '@ceramicnetwork/common';

export function createIDX(ceramic: CeramicApi) {
  const idx = new IDX({
    ceramic,
    aliases: {
      ...definitions,
      ...PUBLISHED_DEFINITIONS,
    },
  });
  return idx;
}
