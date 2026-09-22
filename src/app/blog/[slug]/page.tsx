import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/data/store';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

export const revalidate = 0;

interface PostDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post || post.status !== 'published') {
    notFound();
    return null;
  }

  return (
    <article className="pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto min-h-screen select-none font-mono">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#E50914] hover:text-white uppercase tracking-wider mb-8 transition-colors"
      >
        <GrungeGlyph name="arrow-left" className="w-4 h-4" />
        <span>BACK TO JOURNAL ARCHIVE</span>
      </Link>

      {/* Header */}
      <header className="space-y-4 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#E50914] text-white text-[11px] font-black uppercase px-2.5 py-0.5 border border-black">
            {post.category}
          </span>
          <span className="text-neutral-500 text-xs">
            Published on {new Date(post.published_at || post.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between py-3 border-y border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <GrungeGlyph name="user" className="w-4 h-4 text-[#E50914]" />
            <span className="text-white font-bold">{post.author_name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
            <GrungeGlyph name="shield" className="w-3.5 h-3.5 text-emerald-400" />
            <span>VERIFIED PROJECT S.H.E. RELEASE</span>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      {post.cover_image_url && (
        <div className="relative w-full h-72 sm:h-96 mb-10 border-2 border-[#E50914] shadow-[6px_6px_0px_0px_#E50914] bg-black overflow-hidden stencil-cut">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>
      )}

      {/* Excerpt Lead Box */}
      {post.excerpt && (
        <div className="p-5 bg-[#121212] border-l-4 border-[#E50914] text-sm text-neutral-200 italic mb-8 leading-relaxed font-sans">
          &ldquo;{post.excerpt}&rdquo;
        </div>
      )}

      {/* Article Body */}
      <div className="prose prose-invert max-w-none text-neutral-300 font-sans text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
        {post.body}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-neutral-800 flex items-center gap-2 flex-wrap text-xs">
          <GrungeGlyph name="barbed-wire" className="w-4 h-3 text-[#E50914]" />
          <span className="text-neutral-500">TAGS:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-[#141414] border border-neutral-800 text-neutral-300 font-mono text-[10px]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="mt-12 p-6 bg-[#0E0E0E] border-2 border-[#E50914] shadow-[4px_4px_0px_0px_#E50914] flex flex-col sm:flex-row items-center justify-between gap-4 stencil-cut">
        <div className="space-y-1 text-center sm:text-left">
          <span className="font-heading font-black text-lg text-white uppercase block">
            STAND WITH SURVIVORS
          </span>
          <span className="text-xs text-neutral-400 font-sans">
            100% of gathered funds route directly to verified safehouses like Sayodhya Women’s Help Home.
          </span>
        </div>
        <Link
          href="/#donate"
          className="px-5 py-2.5 bg-[#E50914] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors shrink-0"
        >
          SUPPORT OUR WORK
        </Link>
      </div>
    </article>
  );
}
