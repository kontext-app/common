import { createDefinition, publishIDXConfig } from '@ceramicstudio/idx-tools';

import { parseSeedFromDotenv, parseDotenv } from '../src/utils/dotenv';
import { createCeramic } from '../src/apis/ceramic';
import { createThreeIdFromSeed } from '../src/apis/threeId';
import { createJSONFile } from './utils';
import schemas from '../schemas';

import type { CeramicApi } from '@ceramicnetwork/common';

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

  for (const schemaName of Object.keys(schemas.publishedSchemas)) {
    const schemaDocID = schemas.publishedSchemas[schemaName];

    try {
      const definitionDoc = await createDefinition(ceramic, {
        description: schemaName,
        name: schemaName,
        schema: schemaDocID,
      });
      const definitionDocID = definitionDoc.id.toUrl();
      definitionNameToDocId[schemaName] = definitionDocID;
      console.log(
        `✅ Definition ${schemaName} published. DocId: ${definitionDocID}`
      );
    } catch (error) {
      console.log(`❌ Definition ${schemaName} failed.`, error);
    }
  }

  return definitionNameToDocId;
}

main();
