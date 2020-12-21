import { writeFileSync } from 'fs';

export function createJSONFile(path: string, fileContent: unknown) {
  writeFileSync(path, JSON.stringify(fileContent, null, 2));
}

export default {
  createJSONFile,
};
