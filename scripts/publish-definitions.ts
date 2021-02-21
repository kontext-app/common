import { createDefinition, publishIDXConfig } from '@ceramicstudio/idx-tools';

import { parseSeedFromDotenv, parseDotenv } from '../src/utils/dotenv';
import { createCeramic } from '../src/apis/ceramic';
import { createThreeIdFromSeed } from '../src/apis/threeId';
import { createJSONFile } from './utils';
import publishedSchemas from '../schemas/publishedSchemas.json';

import type { CeramicApi } from '@ceramicnetwork/common';

const DEFINITION_TO_SCHEMA_DOC_ID_MAP = {
  BookmarksIndex: publishedSchemas.DocIdArrayIndex,
  ListsIndex: publishedSchemas.DocIdArrayIndex,
  RatingsIndex: publishedSchemas.DocIdArrayIndex,
  CommentsIndex: publishedSchemas.DocIdArrayIndex,
  AggregatedRatingsIndex: publishedSchemas.DocIdArrayIndex,
};

async function main() {
  try {
    const { CERAMIC_API_HOST } = await parseDotenv();
    const ceramic = createCeramic(CERAMIC_API_HOST);
    await publishIDXConfig(ceramic);

    const seed = await parseSeedFromDotenv();
    await createThreeIdFromSeed({ ceramic, seed });

    const docIDs = await publishDefinitions(ceramic);
    createJSONFile(
      `${process.cwd()}/schemas/publishedDefinitions.json`,
      docIDs
    );

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
}

async function publishDefinitions(ceramic: CeramicApi) {
  const { CERAMIC_API_HOST } = await parseDotenv();
  console.log(`Publishing definitions to ceramic node at: ${CERAMIC_API_HOST}`);

  const definitionNameToDocId: {
    [definitionName: string]: string;
  } = {};

  for (const [definitionName, schemaDocID] of Object.entries(
    DEFINITION_TO_SCHEMA_DOC_ID_MAP
  )) {
    try {
      const definitionDoc = await createDefinition(ceramic, {
        description: definitionName,
        name: definitionName,
        schema: schemaDocID,
      });
      const definitionDocID = definitionDoc.id.toUrl();
      definitionNameToDocId[definitionName] = definitionDocID;
      console.log(
        `✅ Definition ${definitionName} published. DocId: ${definitionDocID}`
      );
    } catch (error) {
      console.log(`❌ Definition ${definitionName} failed.`, error);
    }
  }

  return definitionNameToDocId;
}

main();
