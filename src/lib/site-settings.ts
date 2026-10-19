import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { del } from '@vercel/blob';
import { isReadOnlyHost, redis, storageMissingMessage } from './kv';

export type HeroFit = 'cover' | 'contain';

export type HeroPhoto = {
  /** Public URL of the image: a Vercel Blob URL in production, `/media/<file>` locally. */
  src: string;
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

const REDIS_KEY = 'craftlanee:settings';
const dataDir = process.env.SUBMISSIONS_DIR || path.join(process.cwd(), 'data');
const settingsFile = path.join(dataDir, 'settings.json');
export const uploadsDir = path.join(dataDir, 'uploads');

/** Blob uploads are used whenever a Vercel Blob store is connected. */
export const blobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

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

type StoredHero = Partial<HeroSettings> & { photo?: (HeroPhoto & { file?: string }) | null };

function normalise(hero: StoredHero | undefined): HeroSettings {
  const merged = { ...defaults.hero, ...hero };
  // Settings saved before photos had `src` stored only the local file name.
  const photo = hero?.photo ? { ...hero.photo, src: hero.photo.src ?? `/media/${hero.photo.file}` } : null;
  return { mode: merged.mode, fit: merged.fit, photo: photo ? { src: photo.src, alt: photo.alt, uploadedAt: photo.uploadedAt } : null };
}

async function readSettings(): Promise<SiteSettings> {
  if (redis) {
    const stored = await redis.get<{ hero?: StoredHero }>(REDIS_KEY);
    return { hero: normalise(stored?.hero) };
  }
  try {
    const parsed = JSON.parse(await fs.readFile(settingsFile, 'utf8')) as { hero?: StoredHero };
    return { hero: normalise(parsed.hero) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return structuredClone(defaults);
    throw error;
  }
}

async function writeSettings(settings: SiteSettings) {
  if (redis) {
    await redis.set(REDIS_KEY, settings);
    return;
  }
  if (isReadOnlyHost) throw new Error(storageMissingMessage());
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

async function removeStoredPhoto(src: string) {
  try {
    if (src.startsWith('/media/')) {
      const file = src.slice('/media/'.length);
      if (isSafeUploadName(file)) await fs.rm(path.join(uploadsDir, file), { force: true });
    } else if (blobEnabled && isBlobUrl(src)) {
      await del(src);
    }
  } catch (error) {
    console.error('Failed to delete old hero photo:', error);
  }
}

export function updateHeroSettings(patch: Partial<HeroSettings>) {
  return withLock(async () => {
    const settings = await readSettings();
    const previousSrc = settings.hero.photo?.src;
    settings.hero = { ...settings.hero, ...patch };
    if (settings.hero.mode === 'photo' && !settings.hero.photo) settings.hero.mode = 'illustration';
    await writeSettings(settings);

    // Clean up the old upload once it's no longer referenced.
    if (previousSrc && previousSrc !== settings.hero.photo?.src) await removeStoredPhoto(previousSrc);
    return settings.hero;
  });
}

export async function storeUpload(bytes: Uint8Array, ext: string) {
  if (isReadOnlyHost) throw new Error('Connect a Vercel Blob store to upload photos on Vercel.');
  await fs.mkdir(uploadsDir, { recursive: true });
  const file = `hero-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  await fs.writeFile(path.join(uploadsDir, file), bytes);
  return `/media/${file}`;
}

export function isSafeUploadName(file: string) {
  return /^hero-\d+-[a-f0-9]{8}\.(jpg|png|webp|avif)$/.test(file);
}

export function isBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}
