import { IDX } from '@ceramicstudio/idx';

import { definitions, enums, schemas } from '../constants';

import type {
  BookmarksIndexDocContent,
  BookmarkDocContent,
  BookmarksDoc,
  DefaultBookmarksIndexKey,
  BookmarksListDocContent,
  BookmarksListsDoc,
} from '../types';

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
  return idx.has('BookmarksIndex', did);
}

export async function getBookmarksIndexDocContent(
  idx: IDX,
  did?: string
): Promise<BookmarksIndexDocContent | null> {
  return idx.get<BookmarksIndexDocContent>('BookmarksIndex', did);
}

export async function setDefaultBookmarksIndex(idx: IDX): Promise<string> {
  const defaultBookmarksIndexKeyToDocID: {
    [indexKey: string]: string;
  } = {};

  for (const defaultBookmarksIndexKey of Object.values(
    enums.DefaultBookmarksIndexKeys
  )) {
    const docID =
      defaultBookmarksIndexKey === enums.DefaultBookmarksIndexKeys.LISTS
        ? await createEmptyBookmarksListsDoc(idx)
        : await createEmptyBookmarksDoc(idx);
    defaultBookmarksIndexKeyToDocID[defaultBookmarksIndexKey] = docID;
  }

  await idx.remove('BookmarksIndex');
  const bookmarksIndexDocID = await idx.set(
    'BookmarksIndex',
    defaultBookmarksIndexKeyToDocID
  );

  return bookmarksIndexDocID.toUrl();
}

export async function getBookmarksDocIDByIndexKey(
  idx: IDX,
  params: {
    indexKey: DefaultBookmarksIndexKey | string;
    did: string;
  }
): Promise<string | null> {
  const bookmarksIndexDocContent = await getBookmarksIndexDocContent(
    idx,
    params.did
  );

  if (!bookmarksIndexDocContent) {
    return null;
  }

  return bookmarksIndexDocContent[params.indexKey];
}

export async function addEmptyBookmarksDocToIndexDoc(
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

  const bookmarksDocIDForIndexKey = bookmarksIndexDocContent[params.indexKey];

  if (bookmarksDocIDForIndexKey) {
    throw new Error(
      `BookmarksDoc already exists for index key ${params.indexKey}`
    );
  }

  const emptyBookmarksDocID = await createEmptyBookmarksDoc(idx);
  const bookmarksIndexDocID = await idx.set('BookmarksIndex', {
    ...bookmarksIndexDocContent,
    [params.indexKey]: emptyBookmarksDocID,
  });

  return bookmarksIndexDocID.toUrl();
}

//#region schema `Bookmarks`

export async function createEmptyBookmarksDoc(idx: IDX): Promise<string> {
  const did = idx.id;
  const { id } = await idx.ceramic.createDocument('tile', {
    content: [],
    metadata: {
      schema: schemas.Bookmarks,
      controllers: [did],
      tags: ['bookmarks'],
      isUnique: true,
    },
  });
  return id.toUrl();
}

export async function addBookmarkDocToBookmarksDoc(
  idx: IDX,
  params: {
    bookmarkDocID: string;
    bookmarksDocID: string;
  }
): Promise<BookmarksDoc> {
  const { bookmarkDocID, bookmarksDocID } = params;
  const bookmarksDoc = await idx.ceramic.loadDocument(bookmarksDocID);
  const existingBookmarkDocIDs = bookmarksDoc.content;
  const updatedBookmarkDocIDs = [bookmarkDocID, ...existingBookmarkDocIDs];

  await bookmarksDoc.change({
    content: updatedBookmarkDocIDs,
  });

  const updatedBookmarksDoc = await idx.ceramic.loadDocument(bookmarksDocID);
  return updatedBookmarksDoc;
}

export async function addManyBookmarkDocsToBookmarksDoc(
  idx: IDX,
  params: {
    bookmarkDocIDs: string[];
    bookmarksDocID: string;
  }
): Promise<BookmarksDoc> {
  const { bookmarkDocIDs = [], bookmarksDocID } = params;
  const bookmarksDoc = await idx.ceramic.loadDocument(bookmarksDocID);
  const existingBookmarkDocIDs = bookmarksDoc.content;
  const updatedBookmarkDocIDs = [...bookmarkDocIDs, ...existingBookmarkDocIDs];

  await bookmarksDoc.change({
    content: updatedBookmarkDocIDs,
  });

  const updatedBookmarksDoc = await idx.ceramic.loadDocument(bookmarksDocID);
  return updatedBookmarksDoc;
}

export async function getBookmarksDocContent(
  idx: IDX,
  docID: string
): Promise<Array<string>> {
  const bookmarksCollectionDoc = await idx.ceramic.loadDocument(docID);
  return bookmarksCollectionDoc.content;
}

export async function getBookmarksOfCollectionByIndexKey(
  idx: IDX,
  params: {
    did: string;
    indexKey: DefaultBookmarksIndexKey;
  }
): Promise<{
  userDID: string;
  indexKey: string;
  bookmarkDocIDs: string[];
  docID: string;
} | null> {
  const bookmarksCollectionDocID = await getBookmarksDocIDByIndexKey(
    idx,
    params
  );

  if (!bookmarksCollectionDocID) {
    return null;
  }

  const bookmarkDocIDs = await getBookmarksDocContent(
    idx,
    bookmarksCollectionDocID
  );

  return {
    userDID: params.did,
    indexKey: params.indexKey,
    bookmarkDocIDs,
    docID: bookmarksCollectionDocID,
  };
}

//#endregion

//#region schema `BookmarksLists`

export async function createEmptyBookmarksListsDoc(idx: IDX): Promise<string> {
  const did = idx.id;
  const { id } = await idx.ceramic.createDocument('tile', {
    content: [],
    metadata: {
      schema: schemas.BookmarksLists,
      controllers: [did],
      tags: ['bookmarks'],
      isUnique: true,
    },
  });
  return id.toUrl();
}

export async function addBookmarksListDocToBookmarksListsDoc(
  idx: IDX,
  params: {
    bookmarksListDocID: string;
    bookmarksListsDocID: string;
  }
): Promise<BookmarksListsDoc> {
  const { bookmarksListDocID, bookmarksListsDocID } = params;
  const bookmarksListsDoc = await idx.ceramic.loadDocument(bookmarksListsDocID);
  const existingBookmarksListDocIDs = bookmarksListsDoc.content;
  const updatedBookmarksListDocIDs = [
    bookmarksListDocID,
    ...existingBookmarksListDocIDs,
  ];

  await bookmarksListsDoc.change({
    content: updatedBookmarksListDocIDs,
  });

  const updatedBookmarksListsDoc = await idx.ceramic.loadDocument(
    bookmarksListsDocID
  );
  return updatedBookmarksListsDoc;
}

export async function getBookmarksListsDocContent(
  idx: IDX,
  docID: string
): Promise<Array<string>> {
  const bookmarksListsCollectionDoc = await idx.ceramic.loadDocument(docID);
  return bookmarksListsCollectionDoc.content;
}

//#endregion

//#region `BookmarksList`

export async function createBookmarksListDoc(
  idx: IDX,
  bookmarksList: BookmarksListDocContent
): Promise<string> {
  const did = idx.id;
  const { id } = await idx.ceramic.createDocument('tile', {
    content: bookmarksList,
    metadata: {
      schema: schemas.Bookmark,
      controllers: [did],
      tags: ['bookmarks'],
    },
  });
  return id.toUrl();
}

export async function getBookmarksListDocContent(
  idx: IDX,
  docID: string
): Promise<BookmarksListDocContent> {
  const bookmarksListDoc = await idx.ceramic.loadDocument(docID);
  return bookmarksListDoc.content;
}

//#endregion

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
