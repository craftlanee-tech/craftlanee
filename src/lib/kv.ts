import { Redis as UpstashRedis } from '@upstash/redis';
import { createClient } from 'redis';

/** The few JSON-valued Redis operations the app needs, independent of which Redis client backs them. */
type JsonStore = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<unknown>;
  hgetall<T>(key: string): Promise<Record<string, T> | null>;
  hget<T>(key: string, field: string): Promise<T | null>;
  hset(key: string, values: Record<string, unknown>): Promise<unknown>;
  hdel(key: string, field: string): Promise<number>;
};

// Upstash REST (Vercel's "Upstash" integration): KV_REST_API_* or UPSTASH_REDIS_REST_*.
const restUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
// Plain Redis connection string (Vercel's "Redis" integration): KV_REDIS_URL or REDIS_URL.
const redisUrl = process.env.KV_REDIS_URL || process.env.REDIS_URL || process.env.KV_URL;

function upstashStore(): JsonStore {
  const client = new UpstashRedis({ url: restUrl!, token: restToken! });
  return {
    get: (key) => client.get(key),
    set: (key, value) => client.set(key, value),
    hgetall: (key) => client.hgetall(key),
    hget: (key, field) => client.hget(key, field),
    hset: (key, values) => client.hset(key, values),
    hdel: (key, field) => client.hdel(key, field),
  };
}

const makeClient = () => createClient({ url: redisUrl });
type TcpClient = ReturnType<typeof makeClient>;

function tcpStore(): JsonStore {
  // One connection per server instance, reused across requests (and across hot reloads in dev).
  const globalForRedis = globalThis as unknown as { craftlaneeRedis?: Promise<TcpClient> };
  const connect = (): Promise<TcpClient> => {
    if (!globalForRedis.craftlaneeRedis) {
      const client = makeClient();
      client.on('error', (error) => console.error('Redis error:', error));
      globalForRedis.craftlaneeRedis = client.connect().catch((error) => {
        globalForRedis.craftlaneeRedis = undefined;
        throw error;
      });
    }
    return globalForRedis.craftlaneeRedis;
  };
  const parse = <T>(raw: string | null | undefined): T | null => (raw == null ? null : (JSON.parse(raw) as T));

  return {
    get: async (key) => parse(await (await connect()).get(key)),
    set: async (key, value) => (await connect()).set(key, JSON.stringify(value)),
    hgetall: async <T>(key: string) => {
      const raw: unknown = await (await connect()).hGetAll(key);
      // Depending on protocol version the reply is an object or a flat [field, value, ...] list.
      const pairs: [string, string][] = Array.isArray(raw)
        ? Array.from({ length: raw.length / 2 }, (_, index) => [String(raw[index * 2]), String(raw[index * 2 + 1])])
        : Object.entries(raw as Record<string, string>);
      return Object.fromEntries(pairs.map(([field, value]) => [field, JSON.parse(value) as T]));
    },
    hget: async (key, field) => parse(await (await connect()).hGet(key, field)),
    hset: async (key, values) =>
      (await connect()).hSet(key, Object.fromEntries(Object.entries(values).map(([field, value]) => [field, JSON.stringify(value)]))),
    hdel: async (key, field) => Number(await (await connect()).hDel(key, field)),
  };
}

/** Redis-backed store when configured (production on Vercel), otherwise null and callers fall back to local JSON files. */
export const redis: JsonStore | null = restUrl && restToken ? upstashStore() : redisUrl ? tcpStore() : null;

/** True on serverless hosts where the local filesystem can't be written to. */
export const isReadOnlyHost = Boolean(process.env.VERCEL);

export function storageMissingMessage() {
  return 'Storage is not connected. In Vercel, open Storage and connect a Redis database to this project, then redeploy.';
}
