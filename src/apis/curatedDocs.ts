import { IDX } from '@ceramicstudio/idx';

import { definitions, schemas } from '../constants';
import {
  DefaultCuratedDocsIndexKeys,
  DefaultCuratedDocsKeys,
  IDXAliases,
} from '../constants/enums';
import { getDefaultIndexDocContent } from '../utils/schema';

import type {
  CuratedDocsDoc,
  CuratedDocsDocContent,
  CuratedDocsIndexDoc,
  CuratedDocsIndexDocContent,
} from '../types';

//#region schema `CuratedDocsIndex`

export async function getCuratedDocsIndexDocID(
  idx: IDX,
  did?: string
): Promise<string | null> {
  const idxDocContent = await idx.getIndex(did);

  if (!idxDocContent) {
    return null;
  }

  const curatedDocsIndexDocID = idxDocContent[definitions.CuratedDocsIndex];
  return curatedDocsIndexDocID;
}

export async function hasCuratedDocsIndex(
  idx: IDX,
  did?: string
): Promise<boolean> {
  return idx.has(IDXAliases.CURATED_DOCS_INDEX, did);
}

export async function getCuratedDocsIndexDocContent(
  idx: IDX,
  did?: string
): Promise<CuratedDocsIndexDocContent | null> {
  return idx.get<CuratedDocsIndexDocContent>(
    IDXAliases.CURATED_DOCS_INDEX,
    did
  );
}

export async function setDefaultCuratedDocsIndex(idx: IDX): Promise<string> {
  await idx.remove(IDXAliases.CURATED_DOCS_INDEX);

  const curatedDocsDocID = await createCuratedDocsDoc(
    idx,
    getDefaultIndexDocContent(Object.values(DefaultCuratedDocsKeys)) as any
  );

  const curatedDocsIndexDocID = await idx.set(IDXAliases.CURATED_DOCS_INDEX, {
    [DefaultCuratedDocsIndexKeys.BOOKMARKS]: curatedDocsDocID,
  });

  return curatedDocsIndexDocID.toUrl();
}

export async function setCuratedDocsDocInCuratedDocsIndex(
  idx: IDX,
  params: {
    curatedDocsDocID: string;
    curatedDocsIndexKey?: string;
  }
): Promise<CuratedDocsIndexDocContent> {
  const {
    curatedDocsDocID,
    curatedDocsIndexKey = DefaultCuratedDocsIndexKeys.BOOKMARKS,
  } = params;

  const curatedDocsIndexDocContent = await getCuratedDocsIndexDocContent(idx);

  if (!curatedDocsIndexDocContent) {
    throw new Error('Default CuratedDocsIndex doc content is not set');
  }

  const newCuratedDocsIndexDocContent = {
    ...curatedDocsIndexDocContent,
    [curatedDocsIndexKey]: curatedDocsDocID,
  };
  await idx.set(IDXAliases.CURATED_DOCS_INDEX, newCuratedDocsIndexDocContent);

  return newCuratedDocsIndexDocContent;
}

//#endregion

//#region schema `CuratedDocs`

export async function createCuratedDocsDoc(
  idx: IDX,
  curatedDocs: CuratedDocsDocContent
): Promise<string> {
  const did = idx.id;
  const { id } = await idx.ceramic.createDocument('tile', {
    content: curatedDocs,
    metadata: {
      schema: schemas.DocIdArrayIndex,
      controllers: [did],
      tags: ['curated'],
    },
  });
  return id.toUrl();
}

export async function getCuratedDocsDocContent(
  idx: IDX,
  docID: string
): Promise<CuratedDocsDocContent> {
  const curatedDocsDoc = await idx.ceramic.loadDocument(docID);
  return curatedDocsDoc.content;
}

export async function updateCuratedDocsDoc(
  idx: IDX,
  params: {
    curatedDocsDocID: string;
    change: Partial<CuratedDocsDocContent>;
  }
): Promise<CuratedDocsDocContent> {
  const curatedDocsDoc = await idx.ceramic.loadDocument(
    params.curatedDocsDocID
  );
  const updatedContent = {
    ...curatedDocsDoc.content,
    ...params.change,
  };
  await curatedDocsDoc.change({
    content: updatedContent,
  });
  return updatedContent;
}

export async function addDocToCuratedDocsKey(
  idx: IDX,
  params: {
    docID: string;
    curatedDocsDocID: string;
    indexKey: string;
  }
): Promise<CuratedDocsDocContent> {
  const curatedDocsDoc = await idx.ceramic.loadDocument(
    params.curatedDocsDocID
  );

  const existingDocIDsOfIndexKey =
    curatedDocsDoc.content[params.indexKey] || [];
  const updatedDocIDsOfIndexKey = [params.docID, ...existingDocIDsOfIndexKey];

  return updateCuratedDocsDoc(idx, {
    curatedDocsDocID: params.curatedDocsDocID,
    change: {
      [params.indexKey]: updatedDocIDsOfIndexKey,
    },
  });
}

//#endregion
