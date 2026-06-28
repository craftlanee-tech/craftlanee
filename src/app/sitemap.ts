import type { MetadataRoute } from 'next';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const appDirectory = path.join(process.cwd(), 'src', 'app');
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://craftlanee.com';
const pageFileNames = new Set(['page.tsx', 'page.ts', 'page.jsx', 'page.js']);

async function findPageFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const pages = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findPageFiles(entryPath);
      }

      return pageFileNames.has(entry.name) ? [entryPath] : [];
    }),
  );

  return pages.flat();
}

function pageFileToRoute(filePath: string) {
  const routePath = path.relative(appDirectory, path.dirname(filePath));
  const routeSegments = routePath.split(path.sep).filter(Boolean);

  if (routeSegments.some((segment) => segment.startsWith('['))) {
    return null;
  }

  const segments = routeSegments.filter((segment) => !segment.startsWith('(') && !segment.startsWith('_'));

  return segments.length === 0 ? '/' : `/${segments.join('/')}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageFiles = await findPageFiles(appDirectory);
  const routes = await Promise.all(
    pageFiles.map(async (filePath) => {
      const fileStat = await stat(filePath);
      const route = pageFileToRoute(filePath);

      if (!route) {
        return null;
      }

      return {
        url: new URL(route, baseUrl).toString(),
        lastModified: fileStat.mtime,
        changeFrequency: 'monthly' as const,
        priority: route === '/' ? 1 : 0.8,
      };
    }),
  );

  return routes
    .filter((route): route is MetadataRoute.Sitemap[number] => route !== null)
    .sort((currentRoute, nextRoute) => currentRoute.url.localeCompare(nextRoute.url));
}
