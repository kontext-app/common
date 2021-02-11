import { IDX } from '@ceramicstudio/idx';

import { schemas, definitions } from '../constants';
import { IDXAliases, DefaultBookmarksIndexKeys } from '../constants/enums';
import { getDefaultIndexDocContent } from '../utils/schema';

import type { BookmarksIndexDocContent, BookmarkDocContent } from '../types';

//#region schema `BookmarksIndex`

export async function getBookmarksIndexDocID(
  idx: IDX,
  did?: string
): Promise<string | null> {
  const idxDocContent = await idx.getIndex(did);

  if (!idxDocContent) {
    return null;
  }

  const bookmarksIndexDocID = idxDocContent[definitions.BookmarksIndex];
  return bookmarksIndexDocID;
}

export async function hasBookmarksIndex(
  idx: IDX,
  did?: string
): Promise<boolean> {
  return idx.has(IDXAliases.BOOKMARKS_INDEX, did);
}

export async function getBookmarksIndexDocContent(
  idx: IDX,
  did?: string
): Promise<BookmarksIndexDocContent | null> {
  return idx.get<BookmarksIndexDocContent>(IDXAliases.BOOKMARKS_INDEX, did);
}

export async function setDefaultBookmarksIndex(idx: IDX): Promise<string> {
  await idx.remove(IDXAliases.BOOKMARKS_INDEX);
  const bookmarksIndexDocID = await idx.set(
    IDXAliases.BOOKMARKS_INDEX,
    getDefaultIndexDocContent(Object.values(DefaultBookmarksIndexKeys))
  );

  return bookmarksIndexDocID.toUrl();
}

export async function addEmptyBookmarksIndexKey(
  idx: IDX,
  params: {
    indexKey: string;
    did: string;
  }
) {
  const bookmarksIndexDocContent = await getBookmarksIndexDocContent(
    idx,
    params.did
  );

  if (!bookmarksIndexDocContent) {
    throw new Error('BookmarksIndex is not set');
  }

  const bookmarkDocIDsForIndexKey = bookmarksIndexDocContent[params.indexKey];

  if (Array.isArray(bookmarkDocIDsForIndexKey)) {
    throw new Error(`Index key ${params.indexKey} already exists`);
  }

  const bookmarksIndexDocID = await idx.set('BookmarksIndex', {
    ...bookmarksIndexDocContent,
    [params.indexKey]: [],
  });
  return bookmarksIndexDocID.toUrl();
}

export async function addBookmarkDocToBookmarksIndex(
  idx: IDX,
  params: {
    bookmarkDocID: string;
    bookmarksIndexKey?: string;
  }
): Promise<BookmarksIndexDocContent> {
  const {
    bookmarkDocID,
    bookmarksIndexKey = DefaultBookmarksIndexKeys.UNSORTED,
  } = params;

  const bookmarksIndexDocContent = await getBookmarksIndexDocContent(idx);

  if (!bookmarksIndexDocContent) {
    throw new Error('Default BookmarksIndex doc content is not set');
  }

  const existingBookmarkDocIDs = bookmarksIndexDocContent[bookmarksIndexKey];
  const updatedBookmarkDocIDs = [bookmarkDocID, ...existingBookmarkDocIDs];
  const newBookmarksIndexDocContent = {
    ...bookmarksIndexDocContent,
    [bookmarksIndexKey]: updatedBookmarkDocIDs,
  };
  await idx.set(IDXAliases.BOOKMARKS_INDEX, newBookmarksIndexDocContent);

  return newBookmarksIndexDocContent;
}

export async function addManyBookmarkDocsToBookmarksIndex(
  idx: IDX,
  params: {
    bookmarkDocIDs: string[];
    bookmarksIndexKey?: string;
  }
): Promise<BookmarksIndexDocContent> {
  const {
    bookmarkDocIDs = [],
    bookmarksIndexKey = DefaultBookmarksIndexKeys.UNSORTED,
  } = params;

  const bookmarksIndexDocContent = await getBookmarksIndexDocContent(idx);

  if (!bookmarksIndexDocContent) {
    throw new Error('Default BookmarksIndex doc content is not set');
  }

  const existingBookmarkDocIDs = bookmarksIndexDocContent[bookmarksIndexKey];
  const updatedBookmarkDocIDs = [...bookmarkDocIDs, ...existingBookmarkDocIDs];
  const newBookmarksIndexDocContent = {
    ...bookmarksIndexDocContent,
    [bookmarksIndexKey]: updatedBookmarkDocIDs,
  };
  await idx.set(IDXAliases.BOOKMARKS_INDEX, newBookmarksIndexDocContent);

  return newBookmarksIndexDocContent;
}

//#region schema `Bookmark`

export async function createBookmarkDoc(
  idx: IDX,
  bookmarkToAdd: BookmarkDocContent
): Promise<string> {
  const did = idx.id;
  const { id } = await idx.ceramic.createDocument('tile', {
    content: bookmarkToAdd,
    metadata: {
      schema: schemas.Bookmark,
      controllers: [did],
      tags: ['bookmarks'],
    },
  });
  return id.toUrl();
}

export async function getBookmarkDocContent(
  idx: IDX,
  docID: string
): Promise<BookmarkDocContent> {
  const bookmarkDoc = await idx.ceramic.loadDocument(docID);
  return bookmarkDoc.content;
}

//#endregion
