import * as idxConstants from '@ceramicstudio/idx-constants';

import * as ceramic from './apis/ceramic';
import * as idx from './apis/idx';
import * as threeId from './apis/threeId';

import * as dotenv from './utils/dotenv';

import { PUBLISHED_DEFINITIONS } from './constants/definitions';
import { PUBLISHED_SCHEMAS } from './constants/schemas';
import * as enums from './constants/enums';

export * from './types';

export const apis = {
  ceramic,
  idx,
  threeId,
};

export const utils = {
  dotenv,
};

export const definitions = {
  ...PUBLISHED_DEFINITIONS,
  ...idxConstants.definitions,
};

export const schemas = {
  ...idxConstants.schemas,
  ...PUBLISHED_SCHEMAS,
};

export const constants = {
  ...enums,
};

export default {
  apis,
  utils,
  definitions,
  schemas,
  constants,
};
