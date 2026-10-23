import { getSiteConfig, getSiteSettings } from '@/lib/data/store';
import DonationSection from '@/components/sections/DonationSection';
import Link from 'next/link';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export const revalidate = 0;

export default async function DonatePage() {
  const [config, settings] = await Promise.all([
    getSiteConfig(),
    getSiteSettings(),
  ]);

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto min-h-screen select-none font-mono">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-[#E50914] hover:text-white uppercase font-bold mb-6"
      >
        <GrungeGlyph name="arrow-left" className="w-4 h-4" />
        <span>BACK TO HOMEPAGE</span>
      </Link>
      
      <DonationSection config={config} settings={settings} />
    </div>
  );
}
