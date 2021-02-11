import {
  getSchemaNameByDocID,
  getDefaultIndexDocContent,
} from '../../src/utils/schema';
import { PUBLISHED_SCHEMAS } from '../../src/constants/schemas';

describe('schema utils', () => {
  describe('#getSchemaNameByDocID()', () => {
    it('should return schema name', () => {
      const schemaName = getSchemaNameByDocID(PUBLISHED_SCHEMAS.Bookmark);
      expect(schemaName).toBe('Bookmark');
    });
  });

  describe('#getDefaultIndexDocContent()', () => {
    it('should return object with empty arrays', () => {
      const defaultIndexDocContent = getDefaultIndexDocContent([
        'indexKey1',
        'indexKey2',
      ]);
      expect(defaultIndexDocContent).toEqual({
        indexKey1: [],
        indexKey2: [],
      });
    });
  });
});
