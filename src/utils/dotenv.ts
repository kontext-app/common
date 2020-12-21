import dotenv from 'dotenv';
import { ethers } from 'ethers';

export function parseDotenv<T>(dotenvPath: string = '.env.local'): T {
  const result = dotenv.config({
    path: `${process.cwd()}/${dotenvPath}`,
  });

  if (result.error) {
    throw result.error;
  }

  if (!result.parsed) {
    throw new Error('Please provide a valid .env.local file');
  }

  return (result.parsed as any) as T;
}

export async function parseSeedFromDotenv() {
  const { PUBLISHER_IDW_SEED } = parseDotenv();
  const seed = ethers.utils.arrayify(PUBLISHER_IDW_SEED);
  return seed;
}
