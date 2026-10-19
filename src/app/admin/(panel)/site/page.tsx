import { connection } from 'next/server';
import HeroEditor from '../../../../components/admin/HeroEditor';
import { isReadOnlyHost, redis } from '../../../../lib/kv';
import { blobEnabled, getSiteSettings } from '../../../../lib/site-settings';

export const metadata = { title: 'Homepage hero | CraftLanee Admin' };

export default async function AdminSitePage() {
  await connection();
  const { hero } = await getSiteSettings();
  // On Vercel the filesystem is read-only, so both a Redis database and a Blob store are required.
  const missing = isReadOnlyHost ? [!redis && 'Upstash Redis', !blobEnabled && 'Vercel Blob'].filter(Boolean) as string[] : [];
  return <HeroEditor initial={hero} useBlob={blobEnabled} missingStorage={missing} />;
}
