import { IDX } from '@ceramicstudio/idx';

import { definitions } from '../constants';

import type { CeramicApi } from '@ceramicnetwork/common';

export function createIDX(ceramic: CeramicApi) {
  const idx = new IDX({
    ceramic,
    aliases: { ...definitions },
  });
  return idx;
}
