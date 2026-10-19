import { Redis } from '@upstash/redis';

// Vercel's Upstash integration exposes KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

/** Redis client when configured (production on Vercel), otherwise null and callers fall back to local JSON files. */
export const redis = url && token ? new Redis({ url, token }) : null;

/** True on serverless hosts where the local filesystem can't be written to. */
export const isReadOnlyHost = Boolean(process.env.VERCEL);

export function storageMissingMessage() {
  return 'Storage is not connected. In Vercel, open Storage and connect an Upstash Redis database to this project, then redeploy.';
}
