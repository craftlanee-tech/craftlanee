import type { MetadataRoute } from 'next';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { siteUrl } from '../lib/seo';

const appDirectory = path.join(process.cwd(), 'src', 'app');
const pageFileNames = new Set(['page.tsx', 'page.ts', 'page.jsx', 'page.js']);
const routeSeo: Record<string, Pick<MetadataRoute.Sitemap[number], 'changeFrequency' | 'priority'>> = {
  '/': { changeFrequency: 'weekly', priority: 1 },
  '/services': { changeFrequency: 'monthly', priority: 0.9 },
  '/contact': { changeFrequency: 'monthly', priority: 0.85 },
  '/portfolio': { changeFrequency: 'monthly', priority: 0.8 },
  '/about': { changeFrequency: 'monthly', priority: 0.75 },
};

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
        url: new URL(route, siteUrl).toString(),
        lastModified: fileStat.mtime,
        changeFrequency: routeSeo[route]?.changeFrequency ?? 'monthly',
        priority: routeSeo[route]?.priority ?? 0.7,
      } as MetadataRoute.Sitemap[number];
    }),
  );

  return (routes.filter((route) => route !== null) as MetadataRoute.Sitemap)
    .sort((currentRoute, nextRoute) => currentRoute.url.localeCompare(nextRoute.url));
}
