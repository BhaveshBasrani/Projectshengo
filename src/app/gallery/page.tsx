import { getGalleryItemsList } from '@/lib/data/store';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GalleryPage() {
  const items = await getGalleryItemsList();
  return <GalleryClient initialItems={items} />;
}
