import { IDX } from '@ceramicstudio/idx';

import { definitions, schemas } from '../constants';
import {
  DefaultAggregatedRatingsIndexKeys,
  IDXAliases,
} from '../constants/enums';
import { getDefaultIndexDocContent } from '../utils/schema';

import type {
  AggregatedRatingDoc,
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
  const aggregatedRatingsIndexDocID = await idx.set(
    IDXAliases.AGGREGATED_RATINGS_INDEX,
    getDefaultIndexDocContent(Object.values(DefaultAggregatedRatingsIndexKeys))
  );

  return aggregatedRatingsIndexDocID.toUrl();
}

export async function addEmptyAggregatedRatingsIndexKey(
  idx: IDX,
  params: {
    did: string;
    indexKey: string;
  }
) {
  const aggregatedRatingsIndexDocContent = await getAggregatedRatingsIndexDocContent(
    idx,
    params.did
  );

  if (!aggregatedRatingsIndexDocContent) {
    throw new Error('AggregatedRatingsIndex is not set');
  }

  const aggregatedRatingsDocIDsForIndexKey =
    aggregatedRatingsIndexDocContent[params.indexKey];

  if (Array.isArray(aggregatedRatingsDocIDsForIndexKey)) {
    throw new Error(`Index key ${params.indexKey} already exists`);
  }

  const aggregatedRatingsIndexDocID = await idx.set(
    IDXAliases.AGGREGATED_RATINGS_INDEX,
    {
      ...aggregatedRatingsIndexDocContent,
      [params.indexKey]: [],
    }
  );
  return aggregatedRatingsIndexDocID.toUrl();
}

export async function addAggregatedRatingsDocToAggregatedRatingsIndex(
  idx: IDX,
  params: {
    aggregatedRatingsDocID: string;
    aggregatedRatingsIndexKey?: string;
  }
): Promise<AggregatedRatingsIndexDocContent> {
  const {
    aggregatedRatingsDocID,
    aggregatedRatingsIndexKey = DefaultAggregatedRatingsIndexKeys.BOOKMARKS,
  } = params;

  const aggregatedRatingsIndexDocContent = await getAggregatedRatingsIndexDocContent(
    idx
  );

  if (!aggregatedRatingsIndexDocContent) {
    throw new Error('Default RatingsIndex doc content is not set');
  }

  const existingAggregatedRatingsDocIDs =
    aggregatedRatingsIndexDocContent[aggregatedRatingsIndexKey];
  const updatedAggregatedRatingsDocIDs = [
    aggregatedRatingsDocID,
    ...existingAggregatedRatingsDocIDs,
  ];
  const newAggregatedRatingsIndexDocContent = {
    ...aggregatedRatingsIndexDocContent,
    [aggregatedRatingsIndexKey]: updatedAggregatedRatingsDocIDs,
  };
  await idx.set(
    IDXAliases.AGGREGATED_RATINGS_INDEX,
    newAggregatedRatingsIndexDocContent
  );

  return newAggregatedRatingsIndexDocContent;
}

export async function addManyAggregatedRatingsDocsToAggregatedRatingsIndex(
  idx: IDX,
  params: {
    aggregatedRatingsDocIDs: string[];
    aggregatedRatingsIndexKey?: string;
  }
): Promise<AggregatedRatingsIndexDocContent> {
  const {
    aggregatedRatingsDocIDs = [],
    aggregatedRatingsIndexKey = DefaultAggregatedRatingsIndexKeys.BOOKMARKS,
  } = params;

  const aggregatedRatingsIndexDocContent = await getAggregatedRatingsIndexDocContent(
    idx
  );

  if (!aggregatedRatingsIndexDocContent) {
    throw new Error('Default AggregatedRatingsIndex doc content is not set');
  }

  const existingAggregatedRatingsDocIDs =
    aggregatedRatingsIndexDocContent[aggregatedRatingsIndexKey];
  const updatedAggregatedRatingDocIDs = [
    ...aggregatedRatingsDocIDs,
    ...existingAggregatedRatingsDocIDs,
  ];
  const newAggregatedRatingsIndexDocContent = {
    ...aggregatedRatingsIndexDocContent,
    [aggregatedRatingsIndexKey]: updatedAggregatedRatingDocIDs,
  };
  await idx.set(
    IDXAliases.AGGREGATED_RATINGS_INDEX,
    newAggregatedRatingsIndexDocContent
  );

  return newAggregatedRatingsIndexDocContent;
}

//#endregion

//#region schema `AggregatedRatings`

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

export async function getAggregatedRatingsDocContent(
  idx: IDX,
  docID: string
): Promise<AggregatedRatingsDocContent> {
  const aggregatedRatingsDoc = await idx.ceramic.loadDocument(docID);
  return aggregatedRatingsDoc.content;
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
