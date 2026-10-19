import { promises as fs } from 'node:fs';
import path from 'node:path';
import { contentTypeByExt, isSafeUploadName, uploadsDir } from '../../../lib/site-settings';

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!isSafeUploadName(file)) return new Response('Not found', { status: 404 });

  try {
    const bytes = await fs.readFile(path.join(uploadsDir, file));
    return new Response(bytes, {
      headers: {
        'Content-Type': contentTypeByExt[file.split('.').pop() ?? ''] ?? 'application/octet-stream',
        // File names are unique per upload, so they can be cached forever.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
