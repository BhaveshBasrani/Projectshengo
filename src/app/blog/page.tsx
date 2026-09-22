import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPosts } from '@/lib/data/store';
import GrungeGlyph from '@/components/ui/GrungeGlyph';

// Cache blog archive for 120 seconds (ISR) to minimize database egress
export const revalidate = 120;

export default async function BlogArchivePage() {
  const posts = await getPublishedPosts();

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen select-none font-mono">
      {/* Header */}
      <div className="mb-14 space-y-3">
        <div className="flex items-center gap-2">
          <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          <span className="text-xs text-[#E50914] uppercase tracking-widest font-black">
            ARCHIVE &amp; CASE STUDIES
          </span>
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-6xl uppercase tracking-tight text-white">
          THE S.H.E. ADVOCACY JOURNAL
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
          Educational articles, mindset awareness essays, event recaps, and survivor rehabilitation reports published by the Project S.H.E. team.
        </p>
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-neutral-800 text-xs text-neutral-500">
          No published articles available at this time. Check back soon for field updates.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[#0E0E0E] text-[#F4F1EA] border-2 border-[#333333] hover:border-[#E50914] shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between hover:-translate-y-1 transition-all group"
            >
              <div>
                <div className="relative w-full h-52 bg-neutral-900 overflow-hidden border-b-2 border-current">
                  <Image
                    src={post.cover_image_url || '/assets/logo.png'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#E50914] text-white text-[10px] font-black uppercase px-2 py-0.5 border border-black">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <GrungeGlyph name="calendar" className="w-3 h-3 text-[#E50914]" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <GrungeGlyph name="user" className="w-3 h-3 text-[#E50914]" />
                      {post.author_name}
                    </span>
                  </div>

                  <h2 className="font-heading font-black text-xl uppercase tracking-tight group-hover:text-[#E50914] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed font-sans">
                    {post.excerpt || post.body.substring(0, 150) + '...'}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[#181818] border border-neutral-800 text-[9px] text-neutral-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-neutral-900 mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="w-full py-2.5 bg-[#141414] hover:bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-800 hover:border-[#E50914] transition-all"
                >
                  <span>READ FULL REPORT</span>
                  <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
