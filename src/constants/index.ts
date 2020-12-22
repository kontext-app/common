import * as idxConstants from '@ceramicstudio/idx-constants';
import { PUBLISHED_DEFINITIONS } from './definitions';
import { PUBLISHED_SCHEMAS } from './schemas';

export const definitions = {
  ...idxConstants.definitions,
  ...PUBLISHED_DEFINITIONS,
};

export const schemas = {
  ...idxConstants.schemas,
  ...PUBLISHED_SCHEMAS,
};

export * as enums from './enums';
