import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminSession } from '../../../../lib/admin-session';
import {
  MAX_UPLOAD_BYTES,
  cleanLink,
  getSiteSettings,
  imageTypes,
  isBlobUrl,
  storeUpload,
  updateHeroSettings,
  type HeroSettings,
} from '../../../../lib/site-settings';

// Multipart form fields (all optional): `photo` file (local dev) or `photoUrl` (a Vercel Blob URL
// already uploaded by the browser), `mode` ('illustration' | 'photo'), `fit` ('cover' | 'contain'),
// `alt` text, `remove` ('1' deletes the uploaded photo).
export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const mode = form.get('mode');
    const fit = form.get('fit');
    const alt = form.get('alt');
    const photo = form.get('photo');
    const photoUrl = form.get('photoUrl');
    const current = (await getSiteSettings()).hero;

    const patch: Partial<HeroSettings> = {};
    if (mode === 'illustration' || mode === 'photo') patch.mode = mode;
    if (fit === 'cover' || fit === 'contain') patch.fit = fit;
    const altText = (typeof alt === 'string' ? alt.trim().slice(0, 200) : '') || 'CraftLanee';

    if (form.get('remove') === '1') {
      patch.photo = null;
      patch.mode = 'illustration';
    } else if (typeof photoUrl === 'string' && photoUrl) {
      if (!isBlobUrl(photoUrl)) {
        return NextResponse.json({ error: 'Invalid photo URL.' }, { status: 400 });
      }
      patch.photo = { src: photoUrl, alt: altText, uploadedAt: new Date().toISOString() };
    } else if (photo instanceof File && photo.size > 0) {
      if (photo.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json({ error: 'Image must be 5 MB or smaller.' }, { status: 413 });
      }
      const type = imageTypes[photo.type];
      const bytes = new Uint8Array(await photo.arrayBuffer());
      if (!type || !type.magic(bytes)) {
        return NextResponse.json({ error: 'Use a JPG, PNG, WebP or AVIF image.' }, { status: 415 });
      }
      patch.photo = { src: await storeUpload(bytes, type.ext), alt: altText, uploadedAt: new Date().toISOString() };
    } else if (current.photo && typeof alt === 'string') {
      patch.photo = { ...current.photo, alt: altText };
    }

    if (form.has('primaryLabel')) {
      const primaryLabel = String(form.get('primaryLabel') ?? '').trim().slice(0, 40);
      const secondaryLabel = String(form.get('secondaryLabel') ?? '').trim().slice(0, 40);
      const primaryHref = cleanLink(form.get('primaryHref'));
      const secondaryHref = cleanLink(form.get('secondaryHref'));
      const secondaryVisible = form.get('secondaryVisible') === '1';

      if (!primaryLabel || !primaryHref) {
        return NextResponse.json({ error: 'The main button needs text and a link starting with /, https://, mailto: or tel:.' }, { status: 422 });
      }
      if (secondaryVisible && (!secondaryLabel || !secondaryHref)) {
        return NextResponse.json({ error: 'The second button needs text and a link starting with /, https://, mailto: or tel:.' }, { status: 422 });
      }
      patch.buttons = {
        primary: { label: primaryLabel, href: primaryHref },
        secondary: {
          label: secondaryLabel || current.buttons.secondary.label,
          href: secondaryHref ?? current.buttons.secondary.href,
          visible: secondaryVisible,
        },
      };
    }

    if (patch.mode === 'photo' && !(patch.photo ?? current.photo)) {
      return NextResponse.json({ error: 'Upload a photo first.' }, { status: 422 });
    }

    const hero = await updateHeroSettings(patch);
    revalidatePath('/');
    return NextResponse.json({ hero });
  } catch (error) {
    console.error('Failed to update hero settings:', error);
    return NextResponse.json({ error: (error as Error).message || 'Could not save. Please try again.' }, { status: 500 });
  }
}
