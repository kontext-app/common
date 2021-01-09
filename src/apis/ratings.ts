import { IDX } from '@ceramicstudio/idx';

import { definitions, schemas } from '../constants';

import type { RatingsIndexDocContent, RatingDocContent } from '../types';

//#region schema `RatingsIndex`

export async function getRatingsIndexDocID(
  idx: IDX,
  did?: string
): Promise<string | null> {
  const idxDocContent = await idx.getIDXContent(did);

  if (!idxDocContent) {
    return null;
  }

  const ratingsIndexDocID = idxDocContent[definitions.RatingsIndex];
  return ratingsIndexDocID ? ratingsIndexDocID : null;
}

export async function hasRatingsIndex(
  idx: IDX,
  did?: string
): Promise<boolean> {
  return idx.has('RatingsIndex', did);
}

export async function getRatingsIndexDocContent(
  idx: IDX,
  did?: string
): Promise<RatingsIndexDocContent | null> {
  return idx.get<RatingsIndexDocContent>('RatingsIndex', did);
}

export async function setDefaultRatingsIndex(idx: IDX): Promise<string> {
  await idx.remove('RatingsIndex');
  const ratingsIndexDocID = await idx.set('RatingsIndex', {
    bookmarks: [],
  });
  return ratingsIndexDocID.toUrl();
}

export async function addRatingDocToRatingsIndex(
  idx: IDX,
  params: {
    ratingDocID: string;
    ratingsIndexKey?: string;
  }
): Promise<RatingsIndexDocContent> {
  const { ratingDocID, ratingsIndexKey = 'bookmarks' } = params;

  const ratingsIndexDocContent = await getRatingsIndexDocContent(idx);

  if (!ratingsIndexDocContent) {
    throw new Error('Default RatingsIndex doc content is not set');
  }

  const existingRatingDocIDs = ratingsIndexDocContent[ratingsIndexKey];
  const updatedRatingDocIDs = [ratingDocID, ...existingRatingDocIDs];
  const newRatingsIndexDocContent = {
    ...ratingsIndexDocContent,
    [ratingsIndexKey]: updatedRatingDocIDs,
  };
  await idx.set('RatingsIndex', newRatingsIndexDocContent);

  return newRatingsIndexDocContent;
}

//#endregion

//#region schema `Rating`

export async function createRatingDoc(
  idx: IDX,
  rating: RatingDocContent
): Promise<string> {
  const did = idx.id;
  const { id } = await idx.ceramic.createDocument('tile', {
    content: rating,
    metadata: {
      schema: schemas.Rating,
      controllers: [did],
      tags: ['ratings'],
    },
  });
  return id.toUrl();
}

export async function getRatingDocContent(
  idx: IDX,
  docID: string
): Promise<RatingDocContent> {
  const ratingDoc = await idx.ceramic.loadDocument(docID);
  return ratingDoc.content;
}

//#endregion
