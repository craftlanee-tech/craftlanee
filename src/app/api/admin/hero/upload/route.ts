import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { isAdminSession } from '../../../../../lib/admin-session';
import { MAX_UPLOAD_BYTES, blobEnabled, imageTypes } from '../../../../../lib/site-settings';

// Issues short-lived tokens so the browser uploads straight to Vercel Blob,
// bypassing the 4.5 MB request-body limit on Vercel functions.
export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!blobEnabled) {
    return NextResponse.json({ error: 'No Vercel Blob store is connected to this project.' }, { status: 503 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('hero/')) throw new Error('Invalid upload path.');
        return {
          allowedContentTypes: Object.keys(imageTypes),
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Blob upload token failed:', error);
    return NextResponse.json({ error: (error as Error).message || 'Upload failed.' }, { status: 400 });
  }
}
