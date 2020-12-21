import * as ceramic from './apis/ceramic';
import * as web3 from './apis/web3';

import * as dotenv from './utils/dotenv';

import { PUBLISHED_DEFINITIONS } from './constants/definitions';
import { PUBLISHED_SCHEMAS } from './constants/schemas';

export const apis = {
  ceramic,
  web3,
};

export const utils = {
  dotenv,
};

export const constants = {
  PUBLISHED_DEFINITIONS,
  PUBLISHED_SCHEMAS,
};

export default {
  apis,
  utils,
  constants,
};
