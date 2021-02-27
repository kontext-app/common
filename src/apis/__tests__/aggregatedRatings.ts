import * as aggregatedRatingsApi from '../aggregatedRatings';
import { definitions, schemas } from '../../constants';

const MOCK_AGGREGATED_RATING_1 = {
  ratedDocId: 'ceramic://ratedDocId1',
  aggregatedRating: 10,
  aggregatedRatingDocIds: ['ceramic://ratingDocId1'],
};

const MOCK_AGGREGATED_RATING_2 = {
  ratedDocId: 'ceramic://ratedDocId2',
  aggregatedRating: 9,
  aggregatedRatingDocIds: ['ceramic://ratingDocId2'],
};

describe('aggregatedRatings api', () => {
  describe('AggregatedRatingsIndex schema', () => {
    describe('#getAggregatedRatingsIndexDocID()', () => {
      it('should return null if idx empty', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          getIndex: () => Promise.resolve(null),
        }));

        const aggregatedRatingsIndexDocID = await aggregatedRatingsApi.getAggregatedRatingsIndexDocID(
          mockIDX()
        );
        expect(aggregatedRatingsIndexDocID).toBe(null);
      });

      it('should return null if AggregatedRatingsIndex not set', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          getIndex: () => Promise.resolve({}),
        }));

        const aggregatedRatingsIndexDocID = await aggregatedRatingsApi.getAggregatedRatingsIndexDocID(
          mockIDX()
        );
        expect(aggregatedRatingsIndexDocID).toBe(undefined);
      });

      it('should return doc id of AggregatedRatingsIndex', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          getIndex: () =>
            Promise.resolve({
              [definitions.AggregatedRatingsIndex]: 'ceramic://',
            }),
        }));

        const aggregatedRatingsIndexDocID = await aggregatedRatingsApi.getAggregatedRatingsIndexDocID(
          mockIDX()
        );
        expect(aggregatedRatingsIndexDocID).toBe('ceramic://');
      });
    });

    describe('#hasAggregatedRatingsIndex()', () => {
      it('should return true', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          has: () => Promise.resolve(true),
        }));

        const response = await aggregatedRatingsApi.hasAggregatedRatingsIndex(
          mockIDX()
        );
        expect(response).toBeTruthy();
      });

      it('should return false', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          has: () => Promise.resolve(false),
        }));

        const response = await aggregatedRatingsApi.hasAggregatedRatingsIndex(
          mockIDX()
        );
        expect(response).not.toBeTruthy();
      });
    });

    describe('#getAggregatedRatingsIndexDocContent()', () => {
      it('should return RatingsIndex doc content', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () => Promise.resolve({ bookmarks: 'ceramic://' }),
        }));

        const docContent = await aggregatedRatingsApi.getAggregatedRatingsIndexDocContent(
          mockIDX()
        );
        expect(docContent).toEqual({ bookmarks: 'ceramic://' });
      });
    });

    describe('#setDefaultAggregatedRatingsIndex()', () => {
      it('should set default AggregatedRatingsIndex doc', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          did: 'did',
          ceramic: {
            createDocument: () => ({
              id: {
                toUrl: () => 'ceramic://aggregatedRatingsDocId',
              },
            }),
          },
          remove: () => Promise.resolve(),
          set: () =>
            Promise.resolve({
              toUrl: () => 'ceramic://defaultAggregatedRatingsIndexDocId',
            }),
        }));

        const docId = await aggregatedRatingsApi.setDefaultAggregatedRatingsIndex(
          mockIDX()
        );
        expect(docId).toEqual('ceramic://defaultAggregatedRatingsIndexDocId');
      });
    });

    describe('#setAggregatedRatingsDocInAggregatedRatingsIndex()', () => {
      it('should throw if AggregatedRatingsIndex not set', () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () => null,
        }));

        expect(
          aggregatedRatingsApi.setAggregatedRatingsDocInAggregatedRatingsIndex(
            mockIDX(),
            {
              aggregatedRatingsDocID: 'ceramic://',
              aggregatedRatingsIndexKey: 'indexKey',
            }
          )
        ).rejects.toThrow();
      });

      it('should set AggregatedRatings doc id in index', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          set: () => ({
            indexKey: 'ceramic://aggregatedRatingsDocID',
          }),
          get: () => ({}),
        }));

        const newIndexContent = await aggregatedRatingsApi.setAggregatedRatingsDocInAggregatedRatingsIndex(
          mockIDX(),
          {
            aggregatedRatingsDocID: 'ceramic://',
            aggregatedRatingsIndexKey: 'indexKey',
          }
        );

        expect(newIndexContent).toMatchObject({
          indexKey: 'ceramic://',
        });
      });
    });

    describe('#addAggregatedRatingToIndex()', () => {
      it('should add AggregatedRatings doc to index', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          set: () => ({
            indexKey: 'ceramic://aggregatedRatingsDocID',
          }),
          get: () => ({
            indexKey: 'ceramic://aggregatedRatingsDocID',
          }),
          ceramic: {
            loadDocument: () => ({
              content: {
                [MOCK_AGGREGATED_RATING_1.ratedDocId]: MOCK_AGGREGATED_RATING_1,
              },
              change: () => {},
            }),
          },
        }));

        const updatedAggregatedRatingsDocContent = await aggregatedRatingsApi.addAggregatedRatingToIndex(
          mockIDX(),
          {
            indexKey: 'indexKey',
            aggregatedRatingToAdd: MOCK_AGGREGATED_RATING_2,
          }
        );

        expect(updatedAggregatedRatingsDocContent).toMatchObject({
          [MOCK_AGGREGATED_RATING_1.ratedDocId]: MOCK_AGGREGATED_RATING_1,
          [MOCK_AGGREGATED_RATING_2.ratedDocId]: MOCK_AGGREGATED_RATING_2,
        });
      });
    });
  });

  describe('AggregatedRatings schema', () => {
    describe('#getAggregatedRatingsDocContentByDocID()', () => {
      it('should throw if provided doc id is not AggregatedRatings', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          ceramic: {
            loadDocument: () => ({
              metadata: {
                schema: 'ceramic://wrong',
              },
            }),
          },
        }));

        expect(
          aggregatedRatingsApi.getAggregatedRatingsDocContentByDocID(
            mockIDX(),
            'docID'
          )
        ).rejects.toThrow();
      });

      it('should return AggregatedRatings doc content', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          ceramic: {
            loadDocument: () => ({
              metadata: {
                schema: schemas.AggregatedRatings,
              },
              content: {
                [MOCK_AGGREGATED_RATING_1.ratedDocId]: MOCK_AGGREGATED_RATING_1,
              },
            }),
          },
        }));

        const docContent = await aggregatedRatingsApi.getAggregatedRatingsDocContentByDocID(
          mockIDX(),
          'docID'
        );

        expect(docContent).toMatchObject({
          [MOCK_AGGREGATED_RATING_1.ratedDocId]: MOCK_AGGREGATED_RATING_1,
        });
      });
    });

    describe('#getAggregatedRatingsDocIDByIndexKey()', () => {
      it('should throw if AggregatedRatingsIndex not set', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () => null,
        }));

        expect(
          aggregatedRatingsApi.getAggregatedRatingsDocIDByIndexKey(
            mockIDX(),
            'indexKey'
          )
        ).rejects.toThrow();
      });

      it('should throw if index key not set', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () => ({}),
        }));

        expect(
          aggregatedRatingsApi.getAggregatedRatingsDocIDByIndexKey(
            mockIDX(),
            'indexKey'
          )
        ).rejects.toThrow();
      });

      it('should return doc id of index key', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () => ({ indexKey: 'ceramic://' }),
        }));

        const docIDOfIndexKey = await aggregatedRatingsApi.getAggregatedRatingsDocIDByIndexKey(
          mockIDX(),
          'indexKey'
        );
        expect(docIDOfIndexKey).toEqual('ceramic://');
      });
    });

    describe('#getAggregatedRatingsDocContentByIndexKey()', () => {
      it('should return doc content of index key', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          get: () => ({ indexKey: 'ceramic://' }),
          ceramic: {
            loadDocument: () => ({
              content: {
                [MOCK_AGGREGATED_RATING_1.ratedDocId]: MOCK_AGGREGATED_RATING_1,
              },
            }),
          },
        }));

        const docContentOfIndexKey = await aggregatedRatingsApi.getAggregatedRatingsDocContentByIndexKey(
          mockIDX(),
          'indexKey'
        );
        expect(docContentOfIndexKey).toMatchObject({
          [MOCK_AGGREGATED_RATING_1.ratedDocId]: MOCK_AGGREGATED_RATING_1,
        });
      });
    });

    describe('#createAggregatedRatingsDoc()', () => {
      it('should create AggregatedRatings doc', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          id: 'did',
          ceramic: {
            createDocument: () => ({
              id: {
                toUrl: () => 'ceramic://docID',
              },
            }),
          },
        }));

        const docID = await aggregatedRatingsApi.createAggregatedRatingsDoc(
          mockIDX(),
          {}
        );

        expect(docID).toEqual('ceramic://docID');
      });
    });

    describe('#updateAggregatedRatingsDoc()', () => {
      it('should update existing content of AggregatedRatings doc', async () => {
        const mockIDX = jest.fn().mockImplementation(() => ({
          id: 'did',
          ceramic: {
            loadDocument: () => ({
              content: {
                [MOCK_AGGREGATED_RATING_1.ratedDocId]: MOCK_AGGREGATED_RATING_1,
              },
              change: () => {},
            }),
          },
        }));

        const updatedContent = await aggregatedRatingsApi.updateAggregatedRatingsDoc(
          mockIDX(),
          {
            aggregatedRatingsDocID: 'ceramic://docID',
            change: {
              [MOCK_AGGREGATED_RATING_2.ratedDocId]: MOCK_AGGREGATED_RATING_2,
            },
          }
        );

        expect(updatedContent).toMatchObject({
          [MOCK_AGGREGATED_RATING_1.ratedDocId]: MOCK_AGGREGATED_RATING_1,
          [MOCK_AGGREGATED_RATING_2.ratedDocId]: MOCK_AGGREGATED_RATING_2,
        });
      });
    });
  });

  // describe('Rating schema', () => {
  //   describe('#createRatingDoc()', () => {
  //     it('should return doc id of created rating doc', async () => {
  //       const mockIDX = jest.fn().mockImplementation(() => ({
  //         id: 'did',
  //         ceramic: {
  //           createDocument: () =>
  //             Promise.resolve({ id: { toUrl: () => 'ceramic://ratingDoc' } }),
  //         },
  //       }));

  //       const docId = await ratingsApi.createRatingDoc(mockIDX(), {
  //         ratedDocId: 'ceramic://ratedDoc',
  //         bestRating: 1,
  //         worstRating: -1,
  //         rating: 1,
  //         author: 'did',
  //         creationDate: new Date().toISOString(),
  //       });
  //       expect(docId).toEqual('ceramic://ratingDoc');
  //     });
  //   });
  // });
});
