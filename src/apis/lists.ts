import { IDX } from '@ceramicstudio/idx';

import { schemas, definitions } from '../constants';
import { IDXAliases, DefaultListsIndexKeys } from '../constants/enums';
import { getDefaultIndexDocContent } from '../utils/schema';

import type { ListDocContent, ListsIndexDocContent } from '../types';

//#region schema `ListsIndex`

export async function getListsIndexDocID(
  idx: IDX,
  did?: string
): Promise<string | null> {
  const idxDocContent = await idx.getIndex(did);

  if (!idxDocContent) {
    return null;
  }

  const listsIndexDocID = idxDocContent[definitions.ListsIndex];
  return listsIndexDocID;
}

export async function hasListsIndex(idx: IDX, did?: string): Promise<boolean> {
  return idx.has(IDXAliases.LISTS_INDEX, did);
}

export async function getListsIndexDocContent(
  idx: IDX,
  did?: string
): Promise<ListsIndexDocContent | null> {
  return idx.get<ListsIndexDocContent>(IDXAliases.LISTS_INDEX, did);
}

export async function setDefaultListsIndex(idx: IDX): Promise<string> {
  await idx.remove(IDXAliases.BOOKMARKS_INDEX);
  const listsIndexDocID = await idx.set(
    IDXAliases.LISTS_INDEX,
    getDefaultIndexDocContent(Object.values(DefaultListsIndexKeys))
  );

  return listsIndexDocID.toUrl();
}

export async function addEmptyListsIndexKey(
  idx: IDX,
  params: {
    indexKey: string;
    did: string;
  }
) {
  const listsIndexDocContent = await getListsIndexDocContent(idx, params.did);

  if (!listsIndexDocContent) {
    throw new Error('ListsIndex is not set');
  }

  const listDocIDsForIndexKey = listsIndexDocContent[params.indexKey];

  if (Array.isArray(listDocIDsForIndexKey)) {
    throw new Error(`Index key ${params.indexKey} already exists`);
  }

  const listsIndexDocID = await idx.set(IDXAliases.LISTS_INDEX, {
    ...listsIndexDocContent,
    [params.indexKey]: [],
  });
  return listsIndexDocID.toUrl();
}

export async function addListDocToListsIndex(
  idx: IDX,
  params: {
    listDocID: string;
    listsIndexKey?: string;
  }
): Promise<ListsIndexDocContent> {
  const { listDocID, listsIndexKey = DefaultListsIndexKeys.UNSORTED } = params;

  const listsIndexDocContent = await getListsIndexDocContent(idx);

  if (!listsIndexDocContent) {
    throw new Error('Default ListsIndex doc content is not set');
  }

  const existingListDocIDs = listsIndexDocContent[listsIndexKey];
  const updatedListDocIDs = [listDocID, ...existingListDocIDs];
  const newListsIndexDocContent = {
    ...listsIndexDocContent,
    [listsIndexKey]: updatedListDocIDs,
  };
  await idx.set(IDXAliases.LISTS_INDEX, newListsIndexDocContent);

  return newListsIndexDocContent;
}

//#region schema `List`

export async function createListDoc(
  idx: IDX,
  listToAdd: ListDocContent
): Promise<string> {
  const did = idx.id;
  const { id } = await idx.ceramic.createDocument('tile', {
    content: listToAdd,
    metadata: {
      schema: schemas.List,
      controllers: [did],
      tags: ['lists'],
    },
  });
  return id.toUrl();
}

export async function getListDocContent(
  idx: IDX,
  docID: string
): Promise<ListDocContent> {
  const listDoc = await idx.ceramic.loadDocument(docID);
  return listDoc.content;
}

//#endregion
