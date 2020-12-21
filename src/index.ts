import { definitions, schemas } from '@ceramicstudio/idx-constants';

import * as ceramic from './apis/ceramic';
import * as idx from './apis/idx';
import * as web3 from './apis/web3';
import * as threeId from './apis/threeId';

import * as dotenv from './utils/dotenv';

import { PUBLISHED_DEFINITIONS } from './constants/definitions';
import { PUBLISHED_SCHEMAS } from './constants/schemas';
import * as enums from './constants/enums';

export const apis = {
  ceramic,
  web3,
  idx,
  threeId,
};

export const utils = {
  dotenv,
};

export const constants = {
  definitions: {
    ...PUBLISHED_DEFINITIONS,
    ...definitions,
  },
  schemas: {
    ...schemas,
    ...PUBLISHED_SCHEMAS,
  },
  enums,
};

export default {
  apis,
  utils,
  constants,
};
