'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { BlogPost } from '@/lib/types';

export default function BlogGlimpse() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTopPosts();
  }, []);

  const fetchTopPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        // Pinned posts first, then newest/most liked. Take top 3.
        const sorted = [...data.posts].sort((a, b) => {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          return (b.likes || 0) - (a.likes || 0);
        });
        setPosts(sorted.slice(0, 3));
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (likedPosts[id]) return;

    setLikedPosts((prev) => ({ ...prev, [id]: true }));
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );

    try {
      await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'like' }),
      });
    } catch (err) {
      console.warn('Like failed:', err);
    }
  };

  return (
    <section id="stories" className="scroll-mt-28 sm:scroll-mt-36 pt-24 sm:pt-32 pb-8 px-4 sm:px-6 max-w-7xl mx-auto select-none relative">
      
      {/* Background Ambience */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 opacity-10 pointer-events-none bg-contain bg-center bg-no-repeat [mask-image:radial-gradient(circle,black_40%,transparent_70%)]"
        style={{ backgroundImage: `url('/assets/punk-bg-abstract.jpg')` }}
      />

      {/* Header Bar */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 border-b border-neutral-900 pb-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
            <span className="text-xs text-[#E50914] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <GrungeGlyph name="star" className="w-3.5 h-3.5 text-[#E50914]" /> FIELD REPORTS &amp; MANIFESTOS
            </span>
            <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white leading-none">
            THE ADVOCACY JOURNAL
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
            A glimpse into grassroots investigations, survivor safehouse initiatives, and youth awareness essays.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center md:justify-end gap-3">
          <Link
            href="/blog"
            className="group px-4 py-2.5 bg-[#141414] hover:bg-[#E50914] text-neutral-200 hover:text-white border border-neutral-800 hover:border-[#E50914] transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider min-h-[42px] hover-lift stencil-cut"
          >
            <span>EXPLORE ALL STORIES</span>
            <GrungeGlyph name="arrow-right" className="w-3.5 h-3.5 text-[#E50914] group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>

      {/* Top 3 Story Cards */}
      <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-[#0E0E0E] border border-neutral-900 animate-pulse min-h-[300px] space-y-4 stencil-cut">
                <div className="h-44 bg-neutral-900 w-full rounded" />
                <div className="h-4 bg-neutral-800 w-1/3 rounded" />
                <div className="h-5 bg-neutral-800 w-4/5 rounded" />
                <div className="h-3 bg-neutral-800 w-full rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 bg-[#0E0E0E] border border-neutral-800 text-center space-y-3 max-w-lg mx-auto stencil-cut">
            <p className="text-white font-bold text-sm">NO ARTICLES PUBLISHED YET</p>
            <p className="text-xs text-neutral-400 font-sans">
              Stay tuned for grassroots reports and survivor stories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const hasLiked = likedPosts[post.id];

              return (
                <article
                  key={post.id}
                  className={`bg-[#0E0E0E] text-[#F4F1EA] border-2 transition-all flex flex-col justify-between group relative stencil-cut overflow-hidden ${
                    post.is_pinned
                      ? 'border-[#E50914] shadow-[4px_4px_0px_0px_#E50914]'
                      : 'border-neutral-800 hover:border-[#E50914] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#E50914]'
                  }`}
                >
                  {/* Push Pin on Pinned Posts */}
                  {post.is_pinned && (
                    <div className="absolute -top-1 -right-1 z-30 w-9 h-9 rotate-12 pointer-events-none drop-shadow-[0_2px_8px_rgba(229,9,20,0.8)]">
                      <Image
                        src="/assets/punk-red-pin.png"
                        alt="Pinned Article"
                        fill
                        sizes="36px"
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div className="relative">
                    {/* Cover Image */}
                    <div className="relative w-full h-44 bg-neutral-900 overflow-hidden border-b-2 border-neutral-800">
                      <Image
                        src={post.cover_image_url || '/assets/logo.png'}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-[#E50914] text-white text-[9px] font-black uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000000]">
                          {post.category}
                        </span>
                        {post.is_pinned && (
                          <span className="bg-black/90 text-[#E50914] border border-[#E50914] text-[8px] font-black uppercase px-1.5 py-0.5 tracking-wider">
                            ★ PINNED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                        <span className="flex items-center gap-1">
                          <GrungeGlyph name="calendar" className="w-3 h-3 text-[#E50914]" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="truncate">{post.author_name}</span>
                      </div>

                      <h3 className="font-heading font-black text-base uppercase tracking-tight text-white group-hover:text-[#E50914] transition-colors line-clamp-2 leading-tight">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed font-sans">
                        {post.excerpt || post.body.substring(0, 140) + '...'}
                      </p>
                    </div>
                  </div>

                  {/* Footer / CTA Bar */}
                  <div className="p-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs bg-[#090909]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E50914] group-hover:text-white uppercase tracking-wider transition-colors"
                    >
                      <span>READ DISPATCH</span>
                      <GrungeGlyph name="arrow-right" className="w-3 h-3" />
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleLike(post.id, e)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 border transition-all text-[11px] font-mono font-bold shrink-0 ${
                        hasLiked
                          ? 'border-[#E50914] bg-[#220707] text-[#E50914]'
                          : 'border-neutral-800 bg-[#121212] text-neutral-400 hover:border-[#E50914] hover:text-white'
                      }`}
                      title="Like this story"
                    >
                      <GrungeGlyph
                        name="heart"
                        className={`w-3 h-3 ${hasLiked ? 'text-[#E50914] fill-current' : 'text-neutral-500'}`}
                      />
                      <span>{post.likes || 0}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
