import { publishSchema, publishIDXConfig } from '@ceramicstudio/idx-tools';
import DocID from '@ceramicnetwork/docid';

import { parseSeedFromDotenv, parseDotenv } from '../src/utils/dotenv';
import { createCeramic } from '../src/apis/ceramic';
import { createThreeIdFromSeed } from '../src/apis/threeId';
import { createJSONFile } from './utils';
import schemas from '../schemas';

import type { CeramicApi } from '@ceramicnetwork/common';

const {
  Bookmark,
  Bookmarks,
  BookmarksIndex,
  BookmarksList,
  BookmarksLists,
} = schemas;

const schemasToPublish: {
  [schemaName: string]: any;
} = {
  Bookmark,
  Bookmarks,
  BookmarksIndex,
  BookmarksList,
  BookmarksLists,
};

async function main() {
  try {
    const { CERAMIC_API_HOST } = await parseDotenv();
    const ceramic = createCeramic(CERAMIC_API_HOST);
    await publishIDXConfig(ceramic);

    const seed = await parseSeedFromDotenv();
    await createThreeIdFromSeed({ ceramic, seed });

    const docIDs = await publishSchemas(ceramic);
    createJSONFile(`${process.cwd()}/schemas/publishedSchemas.json`, docIDs);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
}

async function publishSchemas(ceramic: CeramicApi) {
  const { CERAMIC_API_HOST } = await parseDotenv();
  console.log(`Publishing schemas to ceramic node at: ${CERAMIC_API_HOST}`);

  const schemaNameToDocId: {
    [schemaName: string]: string;
  } = {};

  for (const schemaName of Object.keys(schemasToPublish)) {
    const schema = schemasToPublish[schemaName];

    try {
      const schemaDoc = await publishSchema(ceramic, {
        name: schema.title,
        content: schema,
      });
      const schemaDocID = schemaDoc.id.toUrl();
      const withVersion = DocID.fromString(schemaDocID, '0').toUrl();
      schemaNameToDocId[schemaName] = withVersion;
      console.log(`✅ Schema ${schema.title} published. DocId: ${withVersion}`);
    } catch (error) {
      console.log(`❌ Schema ${schema.title} failed.`, error);
    }
  }

  return schemaNameToDocId;
}

main();
