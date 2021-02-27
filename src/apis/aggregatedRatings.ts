import { IDX } from '@ceramicstudio/idx';

import { definitions, schemas } from '../constants';
import {
  DefaultAggregatedRatingsIndexKeys,
  IDXAliases,
} from '../constants/enums';

import type {
  AggregatedRating,
  AggregatedRatingsDocContent,
  AggregatedRatingsIndexDocContent,
} from '../types';

//#region schema `AggregatedRatingsIndex`

export async function getAggregatedRatingsIndexDocID(
  idx: IDX,
  did?: string
): Promise<string | null> {
  const idxDocContent = await idx.getIndex(did);

  if (!idxDocContent) {
    return null;
  }

  const aggregatedRatingsIndexDocID =
    idxDocContent[definitions.AggregatedRatingsIndex];
  return aggregatedRatingsIndexDocID;
}

export async function hasAggregatedRatingsIndex(
  idx: IDX,
  did?: string
): Promise<boolean> {
  return idx.has(IDXAliases.AGGREGATED_RATINGS_INDEX, did);
}

export async function getAggregatedRatingsIndexDocContent(
  idx: IDX,
  did?: string
): Promise<AggregatedRatingsIndexDocContent | null> {
  return idx.get<AggregatedRatingsIndexDocContent>(
    IDXAliases.AGGREGATED_RATINGS_INDEX,
    did
  );
}

export async function setDefaultAggregatedRatingsIndex(
  idx: IDX
): Promise<string> {
  await idx.remove(IDXAliases.AGGREGATED_RATINGS_INDEX);

  const aggregatedRatingsDocID = await createAggregatedRatingsDoc(idx, {});

  const aggregatedRatingsIndexDocID = await idx.set(
    IDXAliases.AGGREGATED_RATINGS_INDEX,
    {
      [DefaultAggregatedRatingsIndexKeys.BOOKMARKS]: aggregatedRatingsDocID,
    }
  );

  return aggregatedRatingsIndexDocID.toUrl();
}

export async function setAggregatedRatingsDocInAggregatedRatingsIndex(
  idx: IDX,
  params: {
    aggregatedRatingsDocID: string;
    aggregatedRatingsIndexKey: string;
  }
): Promise<AggregatedRatingsIndexDocContent> {
  const aggregatedRatingsIndexDocContent = await getAggregatedRatingsIndexDocContent(
    idx
  );

  if (!aggregatedRatingsIndexDocContent) {
    throw new Error('Default AggregatedRatingsIndex doc content is not set');
  }

  const newAggregatedRatingsIndexDocContent = {
    ...aggregatedRatingsIndexDocContent,
    [params.aggregatedRatingsIndexKey]: params.aggregatedRatingsDocID,
  };
  await idx.set(
    IDXAliases.AGGREGATED_RATINGS_INDEX,
    newAggregatedRatingsIndexDocContent
  );

  return newAggregatedRatingsIndexDocContent;
}

export async function addAggregatedRatingToIndex(
  idx: IDX,
  params: {
    aggregatedRatingToAdd: AggregatedRating;
    indexKey: string;
  }
): Promise<AggregatedRating> {
  const aggregatedRatingsDocID = await getAggregatedRatingsDocIDByIndexKey(
    idx,
    params.indexKey
  );

  const aggregatedRatingsDoc = await idx.ceramic.loadDocument(
    aggregatedRatingsDocID
  );
  const { ratedDocId } = params.aggregatedRatingToAdd;
  const updatedAggregatedRatingsDocContent = {
    ...aggregatedRatingsDoc.content,
    [ratedDocId]: params.aggregatedRatingToAdd,
  };
  await aggregatedRatingsDoc.change(updatedAggregatedRatingsDocContent);

  return updatedAggregatedRatingsDocContent;
}

//#endregion

//#region schema `AggregatedRatings`

export async function getAggregatedRatingsDocContentByDocID(
  idx: IDX,
  docID: string
): Promise<AggregatedRatingsDocContent> {
  const doc = await idx.ceramic.loadDocument(docID);

  if (doc.metadata.schema !== schemas.AggregatedRatings) {
    throw new Error("Schema of loaded doc is not 'AggregatedRatings'");
  }

  return doc.content;
}

export async function getAggregatedRatingsDocIDByIndexKey(
  idx: IDX,
  indexKey: string
): Promise<string> {
  const aggregatedRatingsIndexDocContent = await getAggregatedRatingsIndexDocContent(
    idx
  );

  if (!aggregatedRatingsIndexDocContent) {
    throw new Error('No AggregatedRatingsIndex set');
  }

  const aggregatedRatingsDocID = aggregatedRatingsIndexDocContent[indexKey];

  if (!aggregatedRatingsDocID) {
    throw new Error(
      `AggregatedRatings doc not created for index key: '${indexKey}'`
    );
  }

  return aggregatedRatingsDocID;
}

export async function getAggregatedRatingsDocContentByIndexKey(
  idx: IDX,
  indexKey: string
): Promise<AggregatedRatingsDocContent> {
  const aggregatedRatingsDocID = await getAggregatedRatingsDocIDByIndexKey(
    idx,
    indexKey
  );
  const aggregatedRatingDoc = await idx.ceramic.loadDocument(
    aggregatedRatingsDocID
  );
  return aggregatedRatingDoc.content;
}

export async function createAggregatedRatingsDoc(
  idx: IDX,
  rating: AggregatedRatingsDocContent
): Promise<string> {
  const did = idx.id;
  const { id } = await idx.ceramic.createDocument('tile', {
    content: rating,
    metadata: {
      schema: schemas.AggregatedRatings,
      controllers: [did],
      tags: ['ratings'],
    },
  });
  return id.toUrl();
}

export async function updateAggregatedRatingsDoc(
  idx: IDX,
  params: {
    aggregatedRatingsDocID: string;
    change: Partial<AggregatedRatingsDocContent>;
  }
): Promise<AggregatedRatingsDocContent> {
  const aggregatedRatingsDoc = await idx.ceramic.loadDocument(
    params.aggregatedRatingsDocID
  );
  const updatedContent = {
    ...aggregatedRatingsDoc.content,
    ...params.change,
  };
  await aggregatedRatingsDoc.change({
    content: updatedContent,
  });
  return updatedContent;
}

//#endregion
