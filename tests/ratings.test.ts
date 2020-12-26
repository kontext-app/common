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

    describe('#setDefaultRatingsIndex()', () => {
      it('should set default RatingsIndex doc', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          remove: () => Promise.resolve(),
          set: () =>
            Promise.resolve({
              toUrl: () => 'ceramic://defaultRatingsIndexDocId',
            }),
        }));

        const docId = await ratingsApi.setDefaultRatingsIndex(mockIDX());
        expect(docId).toEqual('ceramic://defaultRatingsIndexDocId');
      });
    });

    describe('#addRatingDocToRatingsIndex()', () => {
      it('should throw if RatingsIndex doc content empty', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () => Promise.resolve(),
        }));

        await expect(
          ratingsApi.addRatingDocToRatingsIndex(mockIDX(), {
            ratingDocID: 'ceramic://',
          })
        ).rejects.toThrow();
      });

      it('should return RatingsIndex doc with appended rating doc id', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () =>
            Promise.resolve({ bookmarks: ['ceramic://existingRatingDocId'] }),
          set: () => Promise.resolve(),
        }));

        const updatedRatingsIndexDocContent = await ratingsApi.addRatingDocToRatingsIndex(
          mockIDX(),
          {
            ratingDocID: 'ceramic://newRatingDocId',
            ratingsIndexKey: 'bookmarks',
          }
        );
        expect(updatedRatingsIndexDocContent).toEqual({
          bookmarks: [
            'ceramic://newRatingDocId',
            'ceramic://existingRatingDocId',
          ],
        });
      });
    });
  });

  describe('Rating schema', () => {
    describe('#createRatingDoc()', () => {
      it('should return doc id of created rating doc', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          id: 'did',
          ceramic: {
            createDocument: () =>
              Promise.resolve({ id: { toUrl: () => 'ceramic://ratingDoc' } }),
          },
        }));

        const docId = await ratingsApi.createRatingDoc(mockIDX(), {
          ratedDocId: 'ceramic://ratedDoc',
          body: 'good stuff',
          title: 'very good',
          bestRating: 1,
          worstRating: -1,
          rating: 1,
        });
        expect(docId).toEqual('ceramic://ratingDoc');
      });
    });
  });
});
