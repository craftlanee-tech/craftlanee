import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminSession } from '../../../../lib/admin-session';
import {
  MAX_UPLOAD_BYTES,
  getSiteSettings,
  imageTypes,
  storeUpload,
  updateHeroSettings,
  type HeroSettings,
} from '../../../../lib/site-settings';

// Multipart form fields (all optional): `photo` file, `mode` ('illustration' | 'photo'),
// `fit` ('cover' | 'contain'), `alt` text, `remove` ('1' deletes the uploaded photo).
export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 });
  }

  const mode = form.get('mode');
  const fit = form.get('fit');
  const alt = form.get('alt');
  const photo = form.get('photo');
  const current = (await getSiteSettings()).hero;

  const patch: Partial<HeroSettings> = {};
  if (mode === 'illustration' || mode === 'photo') patch.mode = mode;
  if (fit === 'cover' || fit === 'contain') patch.fit = fit;
  const altText = typeof alt === 'string' ? alt.trim().slice(0, 200) : '';

  if (form.get('remove') === '1') {
    patch.photo = null;
    patch.mode = 'illustration';
  } else if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Image must be 5 MB or smaller.' }, { status: 413 });
    }
    const type = imageTypes[photo.type];
    const bytes = new Uint8Array(await photo.arrayBuffer());
    if (!type || !type.magic(bytes)) {
      return NextResponse.json({ error: 'Use a JPG, PNG, WebP or AVIF image.' }, { status: 415 });
    }
    patch.photo = { file: await storeUpload(bytes, type.ext), alt: altText || 'CraftLanee', uploadedAt: new Date().toISOString() };
  } else if (current.photo && typeof alt === 'string') {
    patch.photo = { ...current.photo, alt: altText || 'CraftLanee' };
  }

  if (patch.mode === 'photo' && !(patch.photo ?? current.photo)) {
    return NextResponse.json({ error: 'Upload a photo first.' }, { status: 422 });
  }

  const hero = await updateHeroSettings(patch);
  revalidatePath('/');
  return NextResponse.json({ hero });
}
