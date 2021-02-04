import { IDX } from '@ceramicstudio/idx';

import { aliases } from '../constants';

import type { CeramicApi } from '@ceramicnetwork/common';

export function createIDX(ceramic: CeramicApi) {
  const idx = new IDX({
    ceramic,
    aliases: { ...aliases },
  });
  return idx;
}
