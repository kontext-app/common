import * as ratingsApi from '../src/apis/ratings';
import { definitions } from '../src/constants';

describe('ratings api', () => {
  describe('RatingsIndex schema', () => {
    describe('#getRatingsIndexDocID()', () => {
      it('should return null if idx empty', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          getIDXContent: () => Promise.resolve(null),
        }));

        const ratingsIndexDocID = await ratingsApi.getRatingsIndexDocID(
          mockIDX()
        );
        expect(ratingsIndexDocID).toBe(null);
      });

      it('should return null if RatingsIndex not set', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          getIDXContent: () => Promise.resolve({}),
        }));

        const ratingsIndexDocID = await ratingsApi.getRatingsIndexDocID(
          mockIDX()
        );
        expect(ratingsIndexDocID).toBe(null);
      });

      it('should return doc id of RatingsIndex', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          getIDXContent: () =>
            Promise.resolve({ [definitions.RatingsIndex]: 'ceramic://' }),
        }));

        const ratingsIndexDocID = await ratingsApi.getRatingsIndexDocID(
          mockIDX()
        );
        expect(ratingsIndexDocID).toBe('ceramic://');
      });
    });

    describe('#hasRatingsIndex()', () => {
      it('should return true', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          has: () => Promise.resolve(true),
        }));

        const response = await ratingsApi.hasRatingsIndex(mockIDX());
        expect(response).toBeTruthy();
      });

      it('should return false', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          has: () => Promise.resolve(false),
        }));

        const response = await ratingsApi.hasRatingsIndex(mockIDX());
        expect(response).not.toBeTruthy();
      });
    });

    describe('#getRatingsIndexDocContent()', () => {
      it('should return RatingsIndex doc content', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () => Promise.resolve({ bookmarks: [] }),
        }));

        const docContent = await ratingsApi.getRatingsIndexDocContent(
          mockIDX()
        );
        expect(docContent).toEqual({ bookmarks: [] });
      });
    });
  });
});
