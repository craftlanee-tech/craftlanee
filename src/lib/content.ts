import { rawContent } from './content-source';
import { convertContent } from './content-utils';
import type { Content } from './content-utils';

export type { Content };

const content = convertContent(rawContent);

export function getContent(): Content {
  return content;
}

export function getContentSection<K extends keyof Content>(key: K): Content[K] {
  return content[key];
}
