import BookmarksIndex from './BookmarksIndex.json';
import Bookmark from './Bookmark.json';
import Bookmarks from './Bookmarks.json';
import BookmarksList from './BookmarksList.json';
import BookmarksLists from './BookmarksLists.json';
import RatingsIndex from './RatingsIndex.json';
import Rating from './Rating.json';
import Comment from './Comment.json';
import CommentsIndex from './CommentsIndex.json';
import publishedSchemas from './publishedSchemas.json';
import publishedDefinitions from './publishedDefinitions.json';

export const schemas: {
  [key: string]: any;
} = {
  Bookmark,
  Bookmarks,
  BookmarksIndex,
  BookmarksList,
  BookmarksLists,
  RatingsIndex,
  Rating,
  CommentsIndex,
  Comment,
  publishedSchemas,
  publishedDefinitions,
};

export default schemas;
