import Link from 'next/link';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export default function NotFound() {
  return (
    <div className="pt-36 pb-20 px-4 max-w-lg mx-auto min-h-[70vh] flex flex-col justify-center items-center text-center font-mono select-none">
      <div className="p-8 bg-[#0E0E0E] text-[#F4F1EA] border-4 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] space-y-4 w-full stencil-cut">
        <GrungeGlyph name="shield" className="w-16 h-16 text-[#E50914] mx-auto" />
        <span className="punk-stamp text-xs bg-[#E50914] text-white border-black">
          ERROR 404
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-white">
          PAGE NOT FOUND
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4 border-t border-neutral-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E50914] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            <GrungeGlyph name="arrow-left" className="w-4 h-4" />
            <span>RETURN TO HOMEPAGE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
