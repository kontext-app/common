import { publishSchema, publishIDXConfig } from '@ceramicstudio/idx-tools';

import { parseSeedFromDotenv, parseDotenv } from '../src/utils/dotenv';
import { createCeramic } from '../src/apis/ceramic';
import { createThreeIdFromSeed } from '../src/apis/threeId';
import { createJSONFile } from './utils';
import schemas from '../schemas';

import type { CeramicApi } from '@ceramicnetwork/common';

const {
  DocIdArrayIndex,
  DocIdIndex,
  Bookmark,
  List,
  Rating,
  Comment,
  AggregatedRatings,
} = schemas;

const schemasToPublish: {
  [schemaName: string]: any;
} = {
  DocIdArrayIndex,
  DocIdIndex,
  Bookmark,
  List,
  Rating,
  Comment,
  AggregatedRatings,
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
      const schemaDocID = schemaDoc.commitId.toUrl();
      schemaNameToDocId[schemaName] = schemaDocID;
      console.log(`✅ Schema ${schema.title} published. DocId: ${schemaDocID}`);
    } catch (error) {
      console.log(`❌ Schema ${schema.title} failed.`, error);
    }
  }

  return schemaNameToDocId;
}

main();
