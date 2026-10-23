'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import { HiArrowRight, HiHeart } from 'react-icons/hi2';

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

      {/* Subtle Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-[radial-gradient(ellipse,rgba(230,25,43,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      </div>

      {/* Header Bar */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 border-b border-[#222222] pb-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
              // ADVOCACY &amp; DIALOGUE
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl uppercase tracking-tight text-white leading-none">
            STORIES &amp; ARTICLES
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#D1D5DB] max-w-xl leading-relaxed">
            Articles and case posts from our team of writers and designers turning community support into tangible change.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center md:justify-end gap-3">
          <Link
            href="/blog"
            className="group px-5 py-2.5 bg-[#141414] hover:bg-[#E6192B] text-[#D1D5DB] hover:text-white border border-neutral-800 hover:border-[#E6192B] transition-all flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider min-h-[42px] rounded-md hover-lift"
          >
            <span>READ MORE STORIES</span>
            <HiArrowRight className="w-4 h-4 text-[#E6192B] group-hover:text-white transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Top 3 Story Cards */}
      <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-[#0E0E0E] border border-neutral-800/80 animate-pulse min-h-[300px] space-y-4 rounded-md">
                <div className="h-44 bg-neutral-900 w-full rounded-sm" />
                <div className="h-4 bg-neutral-800 w-1/3 rounded-sm" />
                <div className="h-5 bg-neutral-800 w-4/5 rounded-sm" />
                <div className="h-3 bg-neutral-800 w-full rounded-sm" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 bg-[#0E0E0E] border border-neutral-800/80 text-center space-y-3 max-w-lg mx-auto rounded-md">
            <p className="text-white font-mono font-bold text-sm uppercase">NO ARTICLES YET</p>
            <p className="text-xs text-[#D1D5DB] font-sans">
              No articles have been published yet. Our team will post updates and stories soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const hasLiked = likedPosts[post.id];

              return (
                <article
                  key={post.id}
                  className={`bg-[#0E0E0E] text-[#EDEDED] border transition-all flex flex-col justify-between group relative overflow-hidden rounded-md ${
                    post.is_pinned
                      ? 'border-[#E6192B]/60'
                      : 'border-neutral-800/80 hover:border-[#E6192B]/50'
                  }`}
                >
                  <div className="relative">
                    {/* Cover Image */}
                    <div className="relative w-full h-44 bg-neutral-900 overflow-hidden border-b border-neutral-800/80">
                      <Image
                        src={post.cover_image_url || '/assets/logo.png'}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-[#E6192B] text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm">
                          {post.category}
                        </span>
                        {post.is_pinned && (
                          <span className="bg-black/90 text-[#E6192B] border border-[#E6192B] text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 tracking-wider rounded-sm">
                            PINNED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="truncate">{post.author_name}</span>
                      </div>

                      <h3 className="font-heading font-bold text-base uppercase tracking-tight text-white group-hover:text-[#E6192B] transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-[#D1D5DB] line-clamp-3 leading-relaxed font-sans">
                        {post.excerpt || post.body.substring(0, 140) + '...'}
                      </p>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="p-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs bg-[#090909]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#E6192B] group-hover:text-white uppercase tracking-wider transition-colors group/read"
                    >
                      <span>READ ARTICLE</span>
                      <HiArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/read:translate-x-0.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleLike(post.id, e)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border transition-all text-[11px] font-mono font-bold shrink-0 rounded-md ${
                        hasLiked
                          ? 'border-[#E6192B] bg-[#220707] text-[#E6192B]'
                          : 'border-neutral-800 bg-[#121212] text-[#D1D5DB] hover:border-[#E6192B] hover:text-white'
                      }`}
                      title="Like this story"
                    >
                      <HiHeart className="w-3.5 h-3.5 text-[#E6192B]" />
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
