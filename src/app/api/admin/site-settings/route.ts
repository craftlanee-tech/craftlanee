import { NextResponse } from 'next/server';
import { isAdminSession } from '../../../../lib/admin-session';
import { isReadOnlyHost, redis } from '../../../../lib/kv';
import { blobEnabled, getSiteSettings } from '../../../../lib/site-settings';

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { hero } = await getSiteSettings();
  const missing = isReadOnlyHost ? [!redis && 'Upstash Redis', !blobEnabled && 'Vercel Blob'].filter(Boolean) as string[] : [];
  const diagnostics = isReadOnlyHost
    ? `Build ${(process.env.VERCEL_GIT_COMMIT_SHA ?? 'unknown').slice(0, 7)} · Redis ${redis ? 'connected' : 'not found'} · Blob ${blobEnabled ? 'connected' : 'not found'}`
    : 'Local environment / filesystem storage active';

  return NextResponse.json({
    hero,
    useBlob: blobEnabled,
    missingStorage: missing,
    diagnostics,
  });
}
