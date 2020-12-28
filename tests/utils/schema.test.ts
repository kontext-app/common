import { getSchemaNameByDocID } from '../../src/utils/schema';
import { PUBLISHED_SCHEMAS } from '../../src/constants/schemas';

describe('schema utils', () => {
  describe('#getSchemaNameByDocID()', () => {
    it('should return schema name', () => {
      const schemaName = getSchemaNameByDocID(PUBLISHED_SCHEMAS.Bookmark);
      expect(schemaName).toBe('Bookmark');
    });
  });
});
