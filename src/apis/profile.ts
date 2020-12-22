import { IDX } from '@ceramicstudio/idx';

import type { BasicProfileDocContent } from '../types';

export async function getBasicProfileDocContent(
  idx: IDX,
  did?: string
): Promise<BasicProfileDocContent | null> {
  return idx.get<BasicProfileDocContent>('basicProfile', did);
}

export async function setBasicProfileDocContent(
  idx: IDX,
  basicProfileDocContent: BasicProfileDocContent
): Promise<string> {
  const docID = await idx.set('basicProfile', basicProfileDocContent);
  return docID.toUrl();
}
