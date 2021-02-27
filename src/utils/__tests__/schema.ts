import { getSchemaNameByDocID, getDefaultIndexDocContent } from '../schema';
import { PUBLISHED_SCHEMAS } from '../../constants/schemas';

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
