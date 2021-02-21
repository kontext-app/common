import DocIdArrayIndex from './DocIdArrayIndex.json';
import Bookmark from './Bookmark.json';
import List from './List.json';
import Rating from './Rating.json';
import Comment from './Comment.json';
import AggregatedRatings from './AggregatedRatings.json';
import publishedSchemas from './publishedSchemas.json';
import publishedDefinitions from './publishedDefinitions.json';

export const schemas: {
  [key: string]: any;
} = {
  DocIdArrayIndex,
  Bookmark,
  List,
  Rating,
  AggregatedRatings,
  Comment,
  publishedSchemas,
  publishedDefinitions,
};

export default schemas;
