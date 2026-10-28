"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import LiquidGlassCarousel from "@/components/ui/LiquidGlassCarousel";
import { GalleryItem } from "@/lib/types";
import { HiArrowRight, HiArrowLeft, HiXMark } from "react-icons/hi2";

const BATCH_SIZE = 36;

interface GalleryClientProps {
  initialItems: GalleryItem[];
}

export default function GalleryClient({ initialItems }: GalleryClientProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeCategory, setActiveCategory] = useState<string>("BOTB 2.0");
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(initialItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live real-time sync with admin updates (bypasses cache)
  useEffect(() => {
    fetch('/api/admin/gallery', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          setGalleryList(data.items);
        }
      })
      .catch(() => {});
  }, []);

  // Body scroll lock when Lightbox modal is open
  useEffect(() => {
    if (lightboxItem) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [lightboxItem]);

  // Sync with theme changes immediately (Light/Dark mode)
  useEffect(() => {
    const syncTheme = () => {
      const isLight =
        document.documentElement.classList.contains("light") ||
        document.documentElement.getAttribute("data-theme") === "light";
      setTheme(isLight ? "light" : "dark");
    };

    syncTheme();
    window.addEventListener("theme-changed", syncTheme);
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      window.removeEventListener("theme-changed", syncTheme);
      observer.disconnect();
    };
  }, []);

  // Strict deduplication using Set and unique IDs
  const filteredItems = useMemo(() => {
    const rawList =
      activeCategory === "ALL"
        ? galleryList
        : galleryList.filter((item) => (item.category || "BOTB 2.0") === activeCategory);

    const seen = new Set<string>();
    const uniqueList: GalleryItem[] = [];

    for (const item of rawList) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        uniqueList.push(item);
      }
    }
    return uniqueList;
  }, [activeCategory, galleryList]);

  // Reset pagination when category changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [activeCategory]);

  // Currently displayed batch
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  // Auto-load on scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredItems.length));
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, filteredItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxItem) return;
      if (e.key === "Escape") {
        setLightboxItem(null);
      } else if (e.key === "ArrowRight") {
        const curIdx = filteredItems.findIndex((it) => it.id === lightboxItem.id);
        if (curIdx < filteredItems.length - 1) {
          setLightboxItem(filteredItems[curIdx + 1]);
        }
      } else if (e.key === "ArrowLeft") {
        const curIdx = filteredItems.findIndex((it) => it.id === lightboxItem.id);
        if (curIdx > 0) {
          setLightboxItem(filteredItems[curIdx - 1]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem, filteredItems]);

  const carouselBg = theme === "light" ? "#EBE7DF" : "#090909";

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-white transition-colors duration-200">
      {/* --- HERO SECTION --- */}
      <section className="w-full pt-28 sm:pt-36 pb-6 px-4 text-center max-w-4xl mx-auto">
        <h1 className="font-space text-5xl sm:text-7xl font-black uppercase tracking-tight text-foreground m-0">
          GALLERY
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground font-sans max-w-lg mx-auto leading-relaxed">
          An unvarnished photographic record of Project S.H.E. events and community advocacy.
        </p>
      </section>

      {/* --- TOP SHOWCASE: LIQUID GLASS LENS WITH ALL PHOTOS --- */}
      <section
        className="w-full relative my-4 border-y border-border/40 overflow-hidden select-none transition-colors duration-200"
        style={{ backgroundColor: carouselBg }}
      >
        <div
          className="w-full h-[400px] sm:h-[480px] relative transition-colors duration-200"
          style={{ backgroundColor: carouselBg }}
        >
          <LiquidGlassCarousel
            items={galleryList}
            background={carouselBg}
            panelHeight={440}
            gap={14}
            entry={false}
            onItemClick={(item) => {
              const fullItem = galleryList.find((it) => it.src === item.src);
              if (fullItem) setLightboxItem(fullItem);
            }}
          />
        </div>
      </section>

      {/* --- COMPLETE COLLECTION: DENSE GAPLESS MASONRY WITH AUTO-LOAD --- */}
      <section className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 mt-10 pb-20">
        {/* Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 pb-4 mb-6">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={() => setActiveCategory("BOTB 2.0")}
              className="font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border border-primary bg-primary text-white font-bold transition-all"
            >
              BOTB 2.0 [{galleryList.length}]
            </button>
          </div>

          <div className="font-mono text-xs text-muted-foreground tracking-widest uppercase mx-auto sm:mx-0">
            {displayedItems.length} OF {filteredItems.length}
          </div>
        </div>

        {/* Minimalist Dense Masonry Grid */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-1.5 [column-fill:_balance]">
          {displayedItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="break-inside-avoid mb-1.5 relative overflow-hidden bg-muted/30 cursor-pointer group transition-all duration-300"
            >
              <Image
                src={item.src}
                alt=""
                width={item.width || 800}
                height={item.height || 600}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                className="w-full h-auto object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.025] transition-all duration-500 ease-out"
                loading={idx < 18 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Auto-Load Sentinel */}
        <div ref={sentinelRef} className="w-full py-8 flex items-center justify-center">
          {!hasMore && (
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              // ARCHIVE FULLY RENDERED ({filteredItems.length} CAPTURES) //
            </p>
          )}
        </div>
      </section>

      {/* --- HIGH-RES LIGHTBOX MODAL --- */}
      {mounted &&
        lightboxItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999999] bg-[#000000] flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
            style={{ position: "fixed", zIndex: 9999999 }}
            onClick={() => setLightboxItem(null)}
          >
            <div
              className="w-full max-w-7xl mx-auto flex items-center justify-between pb-3 border-b border-neutral-800 font-mono text-xs text-neutral-400"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-primary font-bold">[{lightboxItem.category}]</span>
              <button
                onClick={() => setLightboxItem(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-200 hover:text-white hover:border-primary transition-all font-mono text-xs uppercase"
              >
                <span>CLOSE</span>
                <HiXMark className="w-4 h-4" />
              </button>
            </div>

            <div
              className="relative w-full max-w-6xl mx-auto flex-1 my-3 flex items-center justify-center min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxItem.src}
                alt=""
                fill
                className="object-contain"
                priority
              />
            </div>

            <div
              className="w-full max-w-7xl mx-auto flex items-center justify-between font-mono text-xs text-neutral-400 pt-3 border-t border-neutral-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  const cur = filteredItems.findIndex((it) => it.id === lightboxItem.id);
                  if (cur > 0) setLightboxItem(filteredItems[cur - 1]);
                }}
                disabled={filteredItems.findIndex((it) => it.id === lightboxItem.id) === 0}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-neutral-800 bg-neutral-900 hover:border-neutral-600 disabled:opacity-25 disabled:pointer-events-none transition-all text-neutral-200 hover:text-white"
              >
                <HiArrowLeft className="w-3.5 h-3.5" />
                <span>PREVIOUS</span>
              </button>

              <span className="hidden sm:inline text-neutral-500 font-mono text-xs">
                USE [← / →] TO NAVIGATE • [ESC] TO EXIT
              </span>

              <button
                onClick={() => {
                  const cur = filteredItems.findIndex((it) => it.id === lightboxItem.id);
                  if (cur < filteredItems.length - 1) setLightboxItem(filteredItems[cur + 1]);
                }}
                disabled={
                  filteredItems.findIndex((it) => it.id === lightboxItem.id) ===
                  filteredItems.length - 1
                }
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-neutral-800 bg-neutral-900 hover:border-neutral-600 disabled:opacity-25 disabled:pointer-events-none transition-all text-neutral-200 hover:text-white"
              >
                <span>NEXT</span>
                <HiArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
