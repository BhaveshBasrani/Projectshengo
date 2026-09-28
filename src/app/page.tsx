import { getSiteConfig, getPublishedUpdates } from '@/lib/data/store';
import LandingPage from '../components/sections/LandingPage';

// Real-time dynamic homepage rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const config = await getSiteConfig();

  return <LandingPage config={config} />;
}
