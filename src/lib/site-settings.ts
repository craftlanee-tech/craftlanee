import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export type HeroFit = 'cover' | 'contain';

export type HeroPhoto = {
  file: string;
  alt: string;
  uploadedAt: string;
};

export type HeroSettings = {
  mode: 'illustration' | 'photo';
  fit: HeroFit;
  photo: HeroPhoto | null;
};

export type SiteSettings = { hero: HeroSettings };

const defaults: SiteSettings = { hero: { mode: 'illustration', fit: 'cover', photo: null } };

const dataDir = process.env.SUBMISSIONS_DIR || path.join(process.cwd(), 'data');
const settingsFile = path.join(dataDir, 'settings.json');
export const uploadsDir = path.join(dataDir, 'uploads');

export const imageTypes: Record<string, { ext: string; magic: (bytes: Uint8Array) => boolean }> = {
  'image/jpeg': { ext: 'jpg', magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: 'png', magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  'image/webp': {
    ext: 'webp',
    magic: (b) => String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP',
  },
  'image/avif': { ext: 'avif', magic: (b) => String.fromCharCode(...b.slice(4, 12)).startsWith('ftypavi') },
};

export const contentTypeByExt: Record<string, string> = Object.fromEntries(
  Object.entries(imageTypes).map(([type, { ext }]) => [ext, type]),
);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readSettings(): Promise<SiteSettings> {
  try {
    const parsed = JSON.parse(await fs.readFile(settingsFile, 'utf8')) as Partial<SiteSettings>;
    return { hero: { ...defaults.hero, ...parsed.hero } };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return structuredClone(defaults);
    throw error;
  }
}

async function writeSettings(settings: SiteSettings) {
  await fs.mkdir(dataDir, { recursive: true });
  const tempFile = `${settingsFile}.${process.pid}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(settings, null, 2), 'utf8');
  await fs.rename(tempFile, settingsFile);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await readSettings();
  } catch (error) {
    console.error('Failed to read site settings, using defaults:', error);
    return structuredClone(defaults);
  }
}

export function updateHeroSettings(patch: Partial<HeroSettings>) {
  return withLock(async () => {
    const settings = await readSettings();
    const previousFile = settings.hero.photo?.file;
    settings.hero = { ...settings.hero, ...patch };
    if (settings.hero.mode === 'photo' && !settings.hero.photo) settings.hero.mode = 'illustration';
    await writeSettings(settings);

    // Clean up the old upload once it's no longer referenced.
    if (previousFile && previousFile !== settings.hero.photo?.file) {
      await fs.rm(path.join(uploadsDir, previousFile), { force: true });
    }
    return settings.hero;
  });
}

export async function storeUpload(bytes: Uint8Array, ext: string) {
  await fs.mkdir(uploadsDir, { recursive: true });
  const file = `hero-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  await fs.writeFile(path.join(uploadsDir, file), bytes);
  return file;
}

export function isSafeUploadName(file: string) {
  return /^hero-\d+-[a-f0-9]{8}\.(jpg|png|webp|avif)$/.test(file);
}
