import { connection } from 'next/server';
import HeroEditor from '../../../../components/admin/HeroEditor';
import { getSiteSettings } from '../../../../lib/site-settings';

export const metadata = { title: 'Homepage hero | CraftLanee Admin' };

export default async function AdminSitePage() {
  await connection();
  const { hero } = await getSiteSettings();
  return <HeroEditor initial={hero} />;
}
