import { writeFileSync } from 'fs';
import prettier from 'prettier';

import schemas from '../schemas';

const constantsFolderPath = `${process.cwd()}/src/constants`;

function main() {
  const publishedDefinitionsString = `
  export const PUBLISHED_DEFINITIONS = ${JSON.stringify(
    schemas.publishedDefinitions,
    null,
    2
  )};
  `;
  const publishedSchemasString = `
  export const PUBLISHED_SCHEMAS = ${JSON.stringify(
    schemas.publishedSchemas,
    null,
    2
  )};\n
  `;
  writeFileSync(
    `${constantsFolderPath}/definitions.ts`,
    prettier.format(publishedDefinitionsString, {
      parser: 'babel',
      singleQuote: true,
    })
  );
  writeFileSync(
    `${constantsFolderPath}/schemas.ts`,
    prettier.format(publishedSchemasString, {
      parser: 'babel',
      singleQuote: true,
    })
  );
}

main();
