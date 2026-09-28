'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import PunkLoader from '@/components/ui/PunkLoader';
import { SiteUpdate, parseBulletinPayload, ParsedBulletin, BulletinComment, BulletinCardStyle } from '@/lib/types';
import { useAuth } from '@/lib/firebase/auth-context';

interface BulletinBoardProps {
  updates: SiteUpdate[];
}

export default function BulletinBoard({ updates: initialUpdates }: BulletinBoardProps) {
  const { user, profile, isAdmin } = useAuth();
  const [boardUpdates, setBoardUpdates] = useState<SiteUpdate[]>(initialUpdates);
  const [selectedUpdate, setSelectedUpdate] = useState<SiteUpdate | null>(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Comment composer state
  const [commentText, setCommentText] = useState('');
  const [commentAuthorName, setCommentAuthorName] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ id: string; authorName: string } | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);

  // New Topic Modal State
  const [newTopicModalOpen, setNewTopicModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('Discussion');
  const [newTopicCardStyle, setNewTopicCardStyle] = useState<BulletinCardStyle>('zine');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicImageUrl, setNewTopicImageUrl] = useState('');
  const [newTopicAuthorName, setNewTopicAuthorName] = useState('');
  const [newTopicLoading, setNewTopicLoading] = useState(false);

  // Default initial post if database is completely empty
  const displayUpdates = useMemo(() => {
    if (boardUpdates.length > 0) return boardUpdates;
    return [
      {
        id: 'welcome-bulletin',
        title: 'COMMUNITY BULLETIN & NOTICE BOARD',
        content: JSON.stringify({
          body: 'Welcome to the Project S.H.E. Community Bulletin. All urgent notices, upcoming workshops, survivor discussions, and announcements are pinned right here. Feel free to join the conversation and reply below.',
          card_style: 'zine',
          image_url: '/assets/headphones-sticker.png',
          is_banner: true,
          doodle_icon: 'star',
          author_name: 'Project S.H.E.',
          pinned: true,
          locked: false,
          likes: 4,
          liked_by: [],
          comments: [
            {
              id: 'cm-welcome',
              author_id: 'admin',
              author_name: 'Project S.H.E. Core',
              content: 'Leave your thoughts, questions, or solidarity notes below!',
              created_at: new Date().toISOString(),
              likes: 2,
              liked_by: [],
            },
          ],
        }),
        category: 'Announcement',
        status: 'published' as const,
        created_at: new Date().toISOString(),
      },
    ];
  }, [boardUpdates]);

  // Categories list
  const categories = ['All', 'Announcement', 'Discussion', 'Workshop', 'Event / Gig', 'Safehouse Aid', 'Volunteer Call', 'Creative & Art'];

  // Filtered and sorted updates
  const filteredUpdates = useMemo(() => {
    return displayUpdates.filter((u) => {
      const parsed = parseBulletinPayload(u);
      const matchesCategory = selectedCategory === 'All' || u.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (parsed.author_name && parsed.author_name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [displayUpdates, selectedCategory, searchQuery]);

  // Current active userId for like tracking
  const currentUserId = user?.uid || (typeof window !== 'undefined' ? (localStorage.getItem('she_guest_user_id') || (() => {
    const gid = 'gst-' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('she_guest_user_id', gid);
    return gid;
  })()) : 'guest');

  // Handle Like on Bulletin Post
  const handleLikeBulletin = async (updateId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic update
    setBoardUpdates((prev) =>
      prev.map((u) => {
        if (u.id === updateId) {
          const parsed = parseBulletinPayload(u);
          const likedBy = parsed.liked_by || [];
          const hasLiked = likedBy.includes(currentUserId);
          const nextLikedBy = hasLiked ? likedBy.filter((id) => id !== currentUserId) : [...likedBy, currentUserId];
          const updatedPayload = { ...parsed, liked_by: nextLikedBy, likes: nextLikedBy.length };
          return { ...u, content: JSON.stringify(updatedPayload) };
        }
        return u;
      })
    );

    if (selectedUpdate && selectedUpdate.id === updateId) {
      const parsed = parseBulletinPayload(selectedUpdate);
      const likedBy = parsed.liked_by || [];
      const hasLiked = likedBy.includes(currentUserId);
      const nextLikedBy = hasLiked ? likedBy.filter((id) => id !== currentUserId) : [...likedBy, currentUserId];
      setSelectedUpdate({
        ...selectedUpdate,
        content: JSON.stringify({ ...parsed, liked_by: nextLikedBy, likes: nextLikedBy.length }),
      });
    }

    try {
      await fetch('/api/bulletin/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateId, userId: currentUserId }),
      });
    } catch (err) {
      console.warn('Like request failed:', err);
    }
  };

  // Handle Like on Comment
  const handleLikeComment = async (updateId: string, commentId: string) => {
    if (!selectedUpdate) return;
    const parsed = parseBulletinPayload(selectedUpdate);
    const nextComments = (parsed.comments || []).map((c) => {
      if (c.id === commentId) {
        const curLiked = c.liked_by || [];
        const isAlready = curLiked.includes(currentUserId);
        const nextBy = isAlready ? curLiked.filter((id) => id !== currentUserId) : [...curLiked, currentUserId];
        return { ...c, liked_by: nextBy, likes: nextBy.length };
      }
      return c;
    });

    const updatedUpdate = {
      ...selectedUpdate,
      content: JSON.stringify({ ...parsed, comments: nextComments }),
    };

    setSelectedUpdate(updatedUpdate);
    setBoardUpdates((prev) => prev.map((u) => (u.id === updateId ? updatedUpdate : u)));

    try {
      await fetch('/api/bulletin/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateId, commentId, userId: currentUserId }),
      });
    } catch (err) {
      console.warn('Comment like request failed:', err);
    }
  };

  // Handle Submit Comment / Reply
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUpdate || !commentText.trim()) return;

    setCommentLoading(true);
    const authorName = profile?.display_name || user?.displayName || commentAuthorName.trim() || 'Community Member';
    const authorAvatar = user?.photoURL || profile?.avatar_url || null;

    try {
      const res = await fetch('/api/bulletin/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updateId: selectedUpdate.id,
          author_id: currentUserId,
          author_name: authorName,
          author_avatar: authorAvatar,
          content: commentText.trim(),
          parent_id: replyTarget?.id || null,
          reply_to_name: replyTarget?.authorName || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.comment) {
        const parsed = parseBulletinPayload(selectedUpdate);
        const nextComments = [...(parsed.comments || []), data.comment];
        const updated = {
          ...selectedUpdate,
          content: JSON.stringify({ ...parsed, comments: nextComments }),
        };
        setSelectedUpdate(updated);
        setBoardUpdates((prev) => prev.map((u) => (u.id === selectedUpdate.id ? updated : u)));
        setCommentText('');
        setReplyTarget(null);
      } else {
        alert(data.error || 'Failed to submit comment');
      }
    } catch (err) {
      alert('Error submitting comment');
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle Delete Comment
  const handleDeleteComment = async (commentId: string) => {
    if (!selectedUpdate) return;
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/api/bulletin/comment?updateId=${selectedUpdate.id}&commentId=${commentId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': typeof window !== 'undefined' ? localStorage.getItem('project_she_admin_key') || '' : '' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const parsed = parseBulletinPayload(selectedUpdate);
        const nextComments = (parsed.comments || []).filter((c) => c.id !== commentId && c.parent_id !== commentId);
        const updated = {
          ...selectedUpdate,
          content: JSON.stringify({ ...parsed, comments: nextComments }),
        };
        setSelectedUpdate(updated);
        setBoardUpdates((prev) => prev.map((u) => (u.id === selectedUpdate.id ? updated : u)));
      }
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  // Handle Admin Moderation (Pin, Lock, Banner, Delete)
  const handleModerate = async (action: 'pin' | 'lock' | 'toggle_banner' | 'delete') => {
    if (!selectedUpdate) return;

    if (action === 'delete') {
      if (!confirm('Are you sure you want to permanently delete this bulletin topic?')) return;
    }

    try {
      const res = await fetch('/api/bulletin/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': typeof window !== 'undefined' ? localStorage.getItem('project_she_admin_key') || '' : '',
        },
        body: JSON.stringify({ updateId: selectedUpdate.id, action }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (action === 'delete') {
          setBoardUpdates((prev) => prev.filter((u) => u.id !== selectedUpdate.id));
          setSelectedUpdate(null);
        } else if (data.updates) {
          setBoardUpdates(data.updates);
          const found = data.updates.find((u: SiteUpdate) => u.id === selectedUpdate.id);
          if (found) setSelectedUpdate(found);
        }
      }
    } catch (err) {
      alert('Moderation action failed');
    }
  };

  // Handle Create New Topic Modal Submit
  const handleCreateNewTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      alert('Please provide a title and content for your topic.');
      return;
    }

    setNewTopicLoading(true);
    const authorName = profile?.display_name || user?.displayName || newTopicAuthorName.trim() || 'Community Member';

    try {
      const res = await fetch('/api/bulletin/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTopicTitle.trim(),
          category: newTopicCategory,
          content: newTopicContent.trim(),
          image_url: newTopicImageUrl || null,
          card_style: newTopicCardStyle,
          author_name: authorName,
          author_id: currentUserId,
          is_banner: false,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.update) {
        setBoardUpdates((prev) => [data.update, ...prev]);
        setNewTopicModalOpen(false);
        setNewTopicTitle('');
        setNewTopicContent('');
        setNewTopicImageUrl('');
        setNewTopicAuthorName('');
        // Open the newly created topic immediately
        setSelectedUpdate(data.update);
      } else {
        alert(data.error || 'Failed to post new topic');
      }
    } catch (err) {
      alert('Error creating new topic');
    } finally {
      setNewTopicLoading(false);
    }
  };

  return (
    <section id="bulletin-board" className="scroll-mt-24 py-16 px-3.5 sm:px-6 max-w-7xl mx-auto select-none relative">
      
      {/* Header Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#E50914] text-sm leading-none font-black">★</span>
            <span className="font-mono text-xs text-[#E50914] uppercase tracking-widest font-black">
              COMMUNITY BULLETIN &amp; TOPICS
            </span>
            <span className="text-[#E50914] text-sm leading-none font-black">★</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-white mt-1">
            COMMUNITY BULLETIN BOARD
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-1 max-w-2xl">
            Interactive community discussions, announcements, workshops, and survivor support topics. Read, reply, and connect.
          </p>
        </div>

        {/* Action Button: Start New Topic */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNewTopicModalOpen(true)}
            className="px-4 py-2.5 bg-[#E50914] hover:bg-white text-white hover:text-black font-heading font-black text-xs uppercase tracking-wider transition-all border-2 border-white shadow-[3px_3px_0px_#000000] flex items-center gap-2"
          >
            <GrungeGlyph name="plus" className="w-4 h-4" />
            <span>START A TOPIC</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 transition-all border ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#E50914] text-white border-[#E50914] shadow-[2px_2px_0px_#000000]'
                    : 'bg-[#121212] text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] sm:w-64 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#121212] border border-neutral-800 focus:border-[#E50914] text-white font-mono text-xs outline-none"
            />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <GrungeGlyph name="search" className="w-3.5 h-3.5" />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The Rectangular Space with Star Grid Gridlines */}
      <div className="relative border-4 border-neutral-800 bg-[#070707] shadow-[8px_8px_0px_0px_#E50914] overflow-hidden min-h-[400px]">
        
        {/* Star Grid Canvas Pattern */}
        <div className="absolute inset-0 bg-star-gridlines opacity-90 pointer-events-none" />

        {/* Ambient Crimson Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_95%)] pointer-events-none" />

        {/* Framing Hazard Corner Accents */}
        <div className="absolute top-0 left-0 w-16 h-4 bg-hazard-stripes opacity-90 z-20" />
        <div className="absolute top-0 right-0 w-16 h-4 bg-hazard-stripes opacity-90 z-20" />
        <div className="absolute bottom-0 left-0 w-16 h-4 bg-hazard-stripes opacity-90 z-20" />
        <div className="absolute bottom-0 right-0 w-16 h-4 bg-hazard-stripes opacity-90 z-20" />

        {/* Floating Punk Stickers / Doodles on Canvas Perimeter */}
        <div className="hidden lg:block absolute top-4 right-10 w-28 h-28 opacity-30 pointer-events-none select-none z-10 rotate-12">
          <Image
            src="/assets/discoball-sticker.png"
            alt="Disco Ball Sticker"
            fill
            className="object-contain drop-shadow-[0_0_12px_rgba(229,9,20,0.5)]"
          />
        </div>
        <div className="hidden lg:block absolute bottom-6 left-8 w-24 h-24 opacity-25 pointer-events-none select-none z-10 -rotate-12">
          <Image
            src="/assets/headphones-sticker.png"
            alt="Headphones Sticker"
            fill
            className="object-contain drop-shadow-[0_0_12px_rgba(229,9,20,0.5)]"
          />
        </div>

        {/* If no topics match filter */}
        {filteredUpdates.length === 0 && (
          <div className="relative z-10 p-12 text-center text-neutral-400 font-mono text-xs space-y-3">
            <p className="text-sm text-neutral-300 font-bold">No bulletin topics match your current filter.</p>
            <p className="text-neutral-500">Be the first to start a discussion under this category!</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[11px] uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Inner Content Grid */}
        <div className="relative z-10 p-5 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {filteredUpdates.map((update, idx) => {
            const parsed: ParsedBulletin = parseBulletinPayload(update);
            const commentCount = parsed.comments?.length || 0;
            const likeCount = parsed.likes || 0;
            const isLikedByMe = (parsed.liked_by || []).includes(currentUserId);

            return (
              <div
                key={update.id || idx}
                onClick={() => setSelectedUpdate(update)}
                className="cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group select-text"
              >
                {/* 1. POLAROID STYLE */}
                {parsed.card_style === 'polaroid' && (
                  <div className="bg-[#EDEDED] text-black p-3.5 sm:p-4 shadow-[6px_6px_0px_#000000] rotate-[-1deg] group-hover:rotate-0 transition-transform relative">
                    <div className="zine-tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 opacity-90 z-20 pointer-events-none" />

                    {/* Image Area */}
                    <div className="relative w-full h-44 sm:h-48 bg-[#181818] overflow-hidden border border-neutral-300 mb-3 flex items-center justify-center">
                      {parsed.image_url ? (
                        <Image
                          src={parsed.image_url}
                          alt={update.title}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-neutral-400">
                          <GrungeGlyph name="star" className="w-8 h-8 text-[#E50914]" />
                          <span className="font-mono text-[10px] uppercase">PROJECT S.H.E.</span>
                        </div>
                      )}

                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] font-black uppercase">
                        {update.category}
                      </span>

                      {parsed.pinned && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black text-amber-300 font-mono text-[8px] font-bold uppercase tracking-wider border border-amber-400">
                          📌 PINNED
                        </span>
                      )}
                    </div>

                    {/* Caption */}
                    <div className="space-y-1.5 font-sans">
                      <h3 className="font-heading font-black text-sm uppercase tracking-tight text-black line-clamp-1">
                        {update.title}
                      </h3>
                      <p className="font-mono text-xs text-neutral-700 line-clamp-2 leading-relaxed">
                        {parsed.body}
                      </p>
                      
                      {/* Meta bar */}
                      <div className="pt-2 border-t border-neutral-300 flex items-center justify-between font-mono text-[10px] text-neutral-600">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => handleLikeBulletin(update.id, e)}
                            className={`flex items-center gap-1 hover:text-[#E50914] ${isLikedByMe ? 'text-[#E50914] font-bold' : ''}`}
                          >
                            <span>★</span>
                            <span>{likeCount}</span>
                          </button>
                          <span className="flex items-center gap-1">
                            <span>💬</span>
                            <span>{commentCount}</span>
                          </span>
                        </div>
                        <span className="text-[#E50914] font-bold group-hover:underline">VIEW &amp; DISCUSS →</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. BRUTALIST STAMP ANNOUNCEMENT STYLE */}
                {parsed.card_style === 'stamp' && (
                  <div className="bg-[#120606] border-2 border-[#E50914] p-5 shadow-[6px_6px_0px_#E50914] relative text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] font-bold uppercase">
                          {update.category}
                        </span>
                        {parsed.pinned && (
                          <span className="text-amber-400 font-mono text-[9px] font-bold">📌 PINNED</span>
                        )}
                      </div>
                      <span className="border border-[#E50914] text-[#E50914] px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider">
                        ★ OFFICIAL
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-base uppercase text-white tracking-tight leading-snug">
                      {update.title}
                    </h3>

                    {parsed.image_url && (
                      <div className="relative w-full h-32 bg-black border border-neutral-800 overflow-hidden">
                        <Image
                          src={parsed.image_url}
                          alt={update.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    )}

                    <p className="font-sans text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {parsed.body}
                    </p>

                    <div className="pt-2 border-t border-red-950 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-3 text-neutral-400 text-[10px]">
                        <button
                          type="button"
                          onClick={(e) => handleLikeBulletin(update.id, e)}
                          className={`flex items-center gap-1 hover:text-white ${isLikedByMe ? 'text-[#E50914] font-bold' : ''}`}
                        >
                          <span>★</span>
                          <span>{likeCount}</span>
                        </button>
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          <span>{commentCount}</span>
                        </span>
                      </div>
                      <span className="text-[#E50914] font-bold group-hover:underline text-[10px]">READ &amp; DISCUSS →</span>
                    </div>
                  </div>
                )}

                {/* 3. PUNK DOODLE STYLE */}
                {parsed.card_style === 'doodle' && (
                  <div className="bg-[#0D0D0D] border-2 border-dashed border-neutral-700 p-5 relative text-white space-y-3 rotate-[1deg] group-hover:rotate-0 transition-transform shadow-[4px_4px_0px_#222222]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-neutral-800 text-white font-mono text-[9px] uppercase">
                          {update.category}
                        </span>
                        {parsed.pinned && (
                          <span className="text-amber-400 font-mono text-[9px]">📌 PINNED</span>
                        )}
                      </div>
                      <span className="text-[#E50914] text-xs font-bold">★ DOODLE</span>
                    </div>

                    <h3 className="font-heading font-black text-base uppercase tracking-tight text-white leading-tight">
                      {update.title}
                    </h3>

                    {parsed.image_url && (
                      <div className="relative w-full h-32 bg-black border border-dashed border-neutral-700 overflow-hidden">
                        <Image
                          src={parsed.image_url}
                          alt={update.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    )}

                    <p className="font-mono text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {parsed.body}
                    </p>

                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between font-mono text-[10px]">
                      <div className="flex items-center gap-3 text-neutral-400">
                        <button
                          type="button"
                          onClick={(e) => handleLikeBulletin(update.id, e)}
                          className={`flex items-center gap-1 hover:text-white ${isLikedByMe ? 'text-[#E50914] font-bold' : ''}`}
                        >
                          <span>★</span>
                          <span>{likeCount}</span>
                        </button>
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          <span>{commentCount}</span>
                        </span>
                      </div>
                      <span className="text-[#E50914] font-bold group-hover:underline">VIEW &amp; REPLY →</span>
                    </div>
                  </div>
                )}

                {/* 4. ZINE NOTE STYLE (DEFAULT) */}
                {(!parsed.card_style || parsed.card_style === 'zine') && (
                  <div className="bg-[#121212] border-2 border-neutral-800 p-5 relative text-white space-y-3 shadow-[6px_6px_0px_#000000]">
                    <div className="zine-tape absolute -top-2 left-6 w-16 h-4 opacity-80 pointer-events-none" />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] font-bold uppercase">
                          {update.category}
                        </span>
                        {parsed.pinned && (
                          <span className="text-amber-400 font-mono text-[9px] font-bold">📌 PINNED</span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500">
                        {new Date(update.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-base uppercase tracking-tight text-white leading-tight">
                      {update.title}
                    </h3>

                    {parsed.image_url && (
                      <div className="relative w-full h-36 bg-black border border-neutral-800 overflow-hidden">
                        <Image
                          src={parsed.image_url}
                          alt={update.title}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <p className="font-sans text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {parsed.body}
                    </p>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-3 text-neutral-400 text-[10px]">
                        <button
                          type="button"
                          onClick={(e) => handleLikeBulletin(update.id, e)}
                          className={`flex items-center gap-1 hover:text-white ${isLikedByMe ? 'text-[#E50914] font-bold' : ''}`}
                        >
                          <span>★</span>
                          <span>{likeCount}</span>
                        </button>
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          <span>{commentCount}</span>
                        </span>
                      </div>
                      <span className="text-[#E50914] font-bold flex items-center gap-1 group-hover:underline text-[10px]">
                        <span>READ &amp; DISCUSS</span>
                        <GrungeGlyph name="arrow-right" className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* DETAIL MODAL POPUP: FULL READING (NO CUTTING OFF) + DISCUSSION / COMMENTS */}
      {/* ========================================================================= */}
      {selectedUpdate && (() => {
        const parsedModal = parseBulletinPayload(selectedUpdate);
        const comments = parsedModal.comments || [];
        const isLikedByMe = (parsedModal.liked_by || []).includes(currentUserId);

        return (
          <div
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedUpdate(null)}
          >
            <div
              className="w-full max-w-3xl my-auto bg-[#0E0E0E] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#000000] text-white flex flex-col max-h-[88vh] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Sticky Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-800 bg-[#121212] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-[#E50914] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                    {selectedUpdate.category}
                  </span>
                  {parsedModal.pinned && (
                    <span className="px-2 py-0.5 bg-black text-amber-300 border border-amber-400 font-mono text-[9px] font-bold uppercase">
                      📌 PINNED
                    </span>
                  )}
                  {parsedModal.locked && (
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-mono text-[9px] uppercase">
                      🔒 LOCKED
                    </span>
                  )}
                  <span className="text-neutral-400 font-mono text-xs">
                    {new Date(selectedUpdate.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Close Button - Always visible and highly prominent */}
                <button
                  type="button"
                  onClick={() => setSelectedUpdate(null)}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-[#E50914] text-white border border-neutral-700 hover:border-white transition-all flex items-center gap-1.5 font-mono text-xs font-bold shrink-0"
                  aria-label="Close Modal"
                >
                  <GrungeGlyph name="close" className="w-4 h-4" />
                  <span>CLOSE</span>
                </button>
              </div>

              {/* Scrollable Content Body - Guaranteed smooth scrolling for all content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 custom-scrollbar">
                
                {/* Author Info */}
                <div className="flex items-center gap-2.5 text-xs text-neutral-400 font-mono">
                  <div className="w-6 h-6 bg-[#E50914] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    {parsedModal.author_name?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <span>Posted by <strong className="text-white">{parsedModal.author_name || 'Community Member'}</strong></span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-black text-xl sm:text-3xl uppercase tracking-tight text-white leading-tight">
                  {selectedUpdate.title}
                </h3>

                {/* Attached Picture / Sticker */}
                {parsedModal.image_url && (
                  <div className="relative w-full h-64 sm:h-80 bg-black border border-neutral-800 overflow-hidden rounded-sm flex items-center justify-center">
                    <Image
                      src={parsedModal.image_url}
                      alt={selectedUpdate.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                )}

                {/* Full Bulletin Body Text - Clean typography, preserves line breaks */}
                <div className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed whitespace-pre-wrap select-text border-l-2 border-[#E50914]/40 pl-4 py-1">
                  {parsedModal.body}
                </div>

                {/* External Action Button if provided */}
                {parsedModal.link_url && (
                  <div className="pt-2">
                    <a
                      href={parsedModal.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#E50914] hover:bg-white text-white hover:text-black font-mono text-xs font-black uppercase tracking-wider transition-colors shadow-[4px_4px_0px_#000000]"
                    >
                      <span>{parsedModal.link_text || 'VISIT OFFICIAL LINK'}</span>
                      <GrungeGlyph name="external" className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Interaction & Admin Moderation Bar */}
                <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => handleLikeBulletin(selectedUpdate.id)}
                    className={`px-3.5 py-1.5 border font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                      isLikedByMe
                        ? 'border-[#E50914] bg-[#E50914] text-white shadow-[2px_2px_0px_#000000]'
                        : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-white hover:text-white'
                    }`}
                  >
                    <span>★</span>
                    <span>{isLikedByMe ? 'STARRED' : 'STAR TOPIC'}</span>
                    <span className="px-1.5 py-0.2 bg-black/40 text-[10px] rounded">
                      {parsedModal.likes || 0}
                    </span>
                  </button>

                  {/* Admin Moderation Controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleModerate('pin')}
                        className={`px-2 py-1 border transition-colors ${
                          parsedModal.pinned ? 'bg-amber-950 border-amber-600 text-amber-300' : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-white'
                        }`}
                      >
                        {parsedModal.pinned ? 'UNPIN' : 'PIN TO TOP'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerate('toggle_banner')}
                        className={`px-2 py-1 border transition-colors ${
                          parsedModal.is_banner ? 'bg-emerald-950 border-emerald-600 text-emerald-300' : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-white'
                        }`}
                      >
                        {parsedModal.is_banner ? 'REMOVE BANNER' : 'SET AS BANNER'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerate('lock')}
                        className={`px-2 py-1 border transition-colors ${
                          parsedModal.locked ? 'bg-neutral-800 border-neutral-500 text-white' : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-white'
                        }`}
                      >
                        {parsedModal.locked ? 'UNLOCK DISCUSSION' : 'LOCK DISCUSSION'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerate('delete')}
                        className="px-2 py-1 bg-red-950 border border-red-700 text-red-300 hover:bg-[#E50914] hover:text-white transition-colors"
                      >
                        DELETE TOPIC
                      </button>
                    </div>
                  )}
                </div>

                {/* ========================================================= */}
                {/* DISCUSSION SECTION: COMMENTS & REPLIES */}
                {/* ========================================================= */}
                <div className="pt-6 border-t-2 border-neutral-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-base uppercase text-white tracking-wide">
                        COMMUNITY DISCUSSION
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-mono text-[10px] font-bold">
                        {comments.length}
                      </span>
                    </div>
                    {parsedModal.locked && (
                      <span className="font-mono text-[10px] text-amber-400 flex items-center gap-1">
                        <span>🔒</span>
                        <span>Replies locked by admin</span>
                      </span>
                    )}
                  </div>

                  {/* List of Comments */}
                  <div className="space-y-3">
                    {comments.length === 0 ? (
                      <div className="p-4 bg-[#141414] border border-neutral-800 text-neutral-400 font-mono text-xs text-center space-y-1">
                        <p className="text-white font-bold">No replies yet.</p>
                        <p className="text-[11px] text-neutral-500">Be the first to share your thoughts, advice, or support!</p>
                      </div>
                    ) : (
                      comments.map((cm) => {
                        const isCommentLiked = (cm.liked_by || []).includes(currentUserId);
                        const isMyComment = cm.author_id === currentUserId;

                        return (
                          <div
                            key={cm.id}
                            className={`p-3.5 bg-[#141414] border ${
                              cm.parent_id ? 'border-l-4 border-l-[#E50914] ml-4 sm:ml-6 bg-[#161616]' : 'border-neutral-800'
                            } text-xs space-y-2 select-text`}
                          >
                            {/* Author & Timestamp */}
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-[#E50914] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                                  {cm.author_name?.[0]?.toUpperCase() || 'M'}
                                </div>
                                <span className="font-bold text-white">{cm.author_name}</span>
                                {cm.reply_to_name && (
                                  <span className="text-neutral-500 text-[10px]">
                                    replying to <strong className="text-neutral-300">@{cm.reply_to_name}</strong>
                                  </span>
                                )}
                              </div>
                              <span className="text-neutral-500 text-[10px]">
                                {new Date(cm.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Comment Text */}
                            <p className="font-sans text-neutral-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap pl-7">
                              {cm.content}
                            </p>

                            {/* Actions on Comment */}
                            <div className="pl-7 flex items-center gap-3 pt-1 text-[10px] font-mono text-neutral-400">
                              <button
                                type="button"
                                onClick={() => handleLikeComment(selectedUpdate.id, cm.id)}
                                className={`flex items-center gap-1 hover:text-white ${isCommentLiked ? 'text-[#E50914] font-bold' : ''}`}
                              >
                                <span>★</span>
                                <span>{cm.likes || 0}</span>
                              </button>

                              {!parsedModal.locked && (
                                <button
                                  type="button"
                                  onClick={() => setReplyTarget({ id: cm.id, authorName: cm.author_name })}
                                  className="text-[#E50914] hover:underline font-bold"
                                >
                                  Reply
                                </button>
                              )}

                              {(isMyComment || isAdmin) && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(cm.id)}
                                  className="text-neutral-500 hover:text-red-400 transition-colors ml-auto"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Comment Form */}
                  {!parsedModal.locked ? (
                    <form onSubmit={handlePostComment} className="pt-2 space-y-3">
                      {replyTarget && (
                        <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 border border-[#E50914] text-[11px] font-mono text-neutral-300">
                          <span>Replying to <strong className="text-[#E50914]">@{replyTarget.authorName}</strong></span>
                          <button
                            type="button"
                            onClick={() => setReplyTarget(null)}
                            className="text-neutral-500 hover:text-white"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      )}

                      {!user && (
                        <div>
                          <label className="block uppercase text-[10px] text-neutral-400 font-mono mb-1 font-bold">
                            Your Display Name / Alias
                          </label>
                          <input
                            type="text"
                            required
                            value={commentAuthorName}
                            onChange={(e) => setCommentAuthorName(e.target.value)}
                            placeholder="e.g. Survivor Ally / Priya S."
                            className="w-full p-2 bg-[#141414] border border-neutral-700 text-white font-mono text-xs outline-none focus:border-[#E50914]"
                          />
                        </div>
                      )}

                      <div>
                        <textarea
                          required
                          rows={3}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder={
                            replyTarget
                              ? `Write your reply to @${replyTarget.authorName}...`
                              : 'Share your thoughts, ask questions, or add valuable info to this topic...'
                          }
                          className="w-full p-3 bg-[#141414] border border-neutral-700 text-white font-sans text-xs sm:text-sm outline-none resize-none focus:border-[#E50914]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Respectful community guidelines apply.
                        </span>
                        <button
                          type="submit"
                          disabled={commentLoading || !commentText.trim()}
                          className="px-4 py-2 bg-[#E50914] hover:bg-white text-white hover:text-black font-heading font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[2px_2px_0px_#000000]"
                        >
                          {commentLoading ? (
                            <>
                              <PunkLoader size="xs" color="#FFFFFF" />
                              <span>POSTING...</span>
                            </>
                          ) : (
                            <>
                              <GrungeGlyph name="send" className="w-3.5 h-3.5" />
                              <span>{replyTarget ? 'POST REPLY' : 'POST COMMENT'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-3 bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400 font-mono">
                      🔒 Replies on this bulletin have been closed by community moderators.
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* START A NEW TOPIC MODAL */}
      {/* ========================================================================= */}
      {newTopicModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setNewTopicModalOpen(false)}
        >
          <div
            className="w-full max-w-xl my-auto bg-[#0E0E0E] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#000000] text-white flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 bg-[#121212] flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] text-[#E50914] uppercase font-mono font-bold tracking-wider block">
                  COMMUNITY DISCUSSION FORUM
                </span>
                <h3 className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-white">
                  START A TOPIC / BULLETIN
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNewTopicModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <GrungeGlyph name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleCreateNewTopic} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar text-xs font-mono">
              
              <div>
                <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Survivor Art Gathering this Saturday"
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                    Category *
                  </label>
                  <select
                    value={newTopicCategory}
                    onChange={(e) => setNewTopicCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none focus:border-[#E50914]"
                  >
                    <option value="Discussion">Discussion</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Event / Gig">Event / Gig</option>
                    <option value="Safehouse Aid">Safehouse Aid</option>
                    <option value="Volunteer Call">Volunteer Call</option>
                    <option value="Creative & Art">Creative &amp; Art</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                    Card Style
                  </label>
                  <select
                    value={newTopicCardStyle}
                    onChange={(e) => setNewTopicCardStyle(e.target.value as BulletinCardStyle)}
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none focus:border-[#E50914]"
                  >
                    <option value="zine">Zine Note (Taped Paper)</option>
                    <option value="polaroid">Polaroid (Framed Picture)</option>
                    <option value="stamp">Brutalist Stamp</option>
                    <option value="doodle">Punk Doodle</option>
                  </select>
                </div>
              </div>

              {!user && (
                <div>
                  <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                    Your Name or Alias
                  </label>
                  <input
                    type="text"
                    value={newTopicAuthorName}
                    onChange={(e) => setNewTopicAuthorName(e.target.value)}
                    placeholder="e.g. Volunteer Priya"
                    className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white outline-none focus:border-[#E50914]"
                  />
                </div>
              )}

              <div>
                <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  placeholder="Share details, discussion questions, dates, location, or resources..."
                  className="w-full p-2.5 bg-[#141414] border border-neutral-700 text-white font-sans text-xs sm:text-sm outline-none resize-none focus:border-[#E50914]"
                />
              </div>

              {/* Attach Sticker or Picture */}
              <div>
                <label className="block uppercase text-[11px] text-neutral-400 mb-1 font-bold">
                  Attach Sticker or Image URL (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { label: 'None', val: '' },
                    { label: '🎧 Headphones', val: '/assets/headphones-sticker.png' },
                    { label: '🪩 Disco Ball', val: '/assets/discoball-sticker.png' },
                    { label: '✦ Spiral Star', val: '/assets/punk-red-spiral-star-clean.png' },
                  ].map((stk) => (
                    <button
                      key={stk.val}
                      type="button"
                      onClick={() => setNewTopicImageUrl(stk.val)}
                      className={`px-2.5 py-1 text-[11px] font-mono border transition-colors ${
                        newTopicImageUrl === stk.val
                          ? 'border-[#E50914] bg-[#E50914] text-white font-bold'
                          : 'border-neutral-800 bg-[#161616] text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      {stk.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newTopicImageUrl}
                  onChange={(e) => setNewTopicImageUrl(e.target.value)}
                  placeholder="Or paste external image URL (https://...)"
                  className="w-full p-2 bg-[#141414] border border-neutral-700 text-white text-[11px] outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={newTopicLoading}
                  className="w-full py-3 bg-[#E50914] hover:bg-white text-white hover:text-black font-heading font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000000] disabled:opacity-50"
                >
                  {newTopicLoading ? (
                    <>
                      <PunkLoader size="xs" color="#FFFFFF" />
                      <span>POSTING TOPIC...</span>
                    </>
                  ) : (
                    <>
                      <GrungeGlyph name="megaphone" className="w-4 h-4" />
                      <span>PIN TOPIC TO COMMUNITY BOARD</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}
