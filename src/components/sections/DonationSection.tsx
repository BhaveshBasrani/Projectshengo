'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { SiteConfig } from '@/lib/types';

interface DonationSectionProps {
  config: SiteConfig;
}

export default function DonationSection({ config }: DonationSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(config.donation_upi_id || 'projectshe.ngo@upi');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="donate" className="scroll-mt-48 lg:scroll-mt-56 py-20 px-4 sm:px-6 max-w-7xl mx-auto select-none font-mono">
      
      {/* Header */}
      <div className="mb-14 space-y-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
          <span className="font-mono text-xs text-[#E50914] uppercase tracking-widest font-black flex items-center gap-1.5">
            <GrungeGlyph name="heart" className="w-3.5 h-3.5 text-[#E50914]" /> 100% DIRECT SURVIVOR RELIEF
          </span>
          <GrungeGlyph name="barbed-wire" className="w-6 h-3 text-[#E50914]" />
        </div>
        <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#EDEDED] leading-none">
          DONATE VIA UPI
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#888888] max-w-2xl leading-relaxed">
          We don't use expensive payment gateways. 100% of your donation goes directly to emergency shelter, food, and trauma support for women in crisis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left QR Card - Styled as a Classified Punk Zine Document with Masking Tape */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md p-6 sm:p-8 bg-[#0E0E0E] text-[#EDEDED] border-4 border-dashed border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] flex flex-col items-center text-center relative group overflow-hidden stencil-cut">
            
            {/* Authentic Zine Masking Tape on Corners */}
            <div className="zine-tape absolute -top-3 -left-3 w-24 -rotate-12 z-20" />
            <div className="zine-tape absolute -bottom-3 -right-3 w-24 rotate-12 z-20" />

            {/* Extracted Punk Tribal Lily Vine Watermark */}
            <div className="absolute -right-2 -bottom-4 w-48 h-72 opacity-20 pointer-events-none select-none">
              <Image
                src="/assets/punk-lily-clean.png"
                alt="Punk Tribal Lily"
                fill
                className="object-contain"
              / sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">
            </div>

            {/* Extracted Red Spiral Seal in Corner */}
            <div className="absolute top-3 right-3 w-16 h-16 opacity-30 animate-spin [animation-duration:20s] pointer-events-none select-none">
              <Image
                src="/assets/punk-red-spiral-star-clean.png"
                alt="Red Spiral Seal"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>

            <div className="flex items-center gap-2 mb-4 mt-1 relative z-10">
              <GrungeGlyph name="lock" className="w-5 h-5 text-[#E50914]" />
              <span className="font-heading font-black text-lg tracking-tight uppercase text-white">
                OFFICIAL DONATION QR
              </span>
            </div>

            {/* QR Sticker Container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-[#F4F1EA] p-3 shadow-[4px_4px_0px_0px_rgba(229,9,20,0.6)] transform -rotate-2 hover:rotate-0 transition-transform duration-300 z-10 rounded-sm">
              <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
              <Image
                src="/assets/qr-code.svg"
                alt="Project S.H.E. Official Donation QR Code"
                fill
                className="object-contain p-2 relative z-10"
                priority
              / sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">
            </div>

            <div className="mt-5 w-full pt-4 border-t-2 border-[#222222] space-y-3 font-mono relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#141414] p-3 border-2 border-[#222222]">
                <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
                  <span className="text-[#888888] text-[11px] shrink-0">UPI ID:</span>
                  <span className="font-bold text-white text-[11px] sm:text-xs select-all truncate">{config.donation_upi_id}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="group px-3 py-2 bg-[#E50914] text-white hover:bg-white hover:text-black font-bold text-xs uppercase flex items-center gap-1.5 transition-all border border-black shadow-[2px_2px_0px_0px_#000000] min-h-[40px] hover-lift"
                >
                  {copied ? (
                    <GrungeGlyph name="check" className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors" />
                  ) : (
                    <GrungeGlyph name="copy" className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors" />
                  )}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <span className="text-[11px] text-[#888888] block font-sans">
                Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI banking app.
              </span>
            </div>

          </div>
        </div>

        {/* Right Transparency Information - Monospace Raw Data Readout */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 sm:p-8 bg-[#0E0E0E] border-2 border-[#222222] shadow-[6px_6px_0px_0px_#E50914] fluid-card glow-on-hover space-y-5 stencil-cut relative overflow-hidden">
            {/* Permitted Cyber Lily Watermark */}
            <div className="absolute -right-4 -bottom-8 w-64 h-80 opacity-15 pointer-events-none select-none rotate-12">
              <Image
                src="/assets/punk-lily-clean.png"
                alt="Punk Cyber Lily"
                fill
                className="object-contain"
              / sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">
            </div>

            <div className="flex items-center justify-between border-b-2 border-[#222222] pb-3 relative z-10">
              <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-[#E50914]">
                WHERE YOUR MONEY GOES
              </h3>
              <span className="font-mono text-[10px] bg-[#1a1a1a] text-[#888888] px-2 py-0.5 border border-[#333333] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> AUDIT-READY
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans relative z-10">
              Funds gathered go directly to supporting survivors via partner organizations like Sayodhya Women’s Help Home, with reserves stored for future large-scale fundraisers.
            </p>

            {/* Monospace Raw Data Readouts */}
            <div className="space-y-3 pt-1 relative z-10">
              <div className="p-3 bg-[#121212] border-l-4 border-[#E50914] border-y border-r border-[#222222]">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#EDEDED] font-bold">
                  <span>[01] DIRECT SAFEHOUSE RELIEF</span>
                  <span className="text-[#E50914]">100% ROUTED</span>
                </div>
                <p className="text-xs text-[#888888] font-sans mt-1">
                  100% of gathered relief funds are transferred to established safehouses, including Sayodhya Women’s Help Home, providing immediate shelter, medicine, and food.
                </p>
              </div>

              <div className="p-3 bg-[#121212] border-l-4 border-[#E50914] border-y border-r border-[#222222]">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#EDEDED] font-bold">
                  <span>[02] FUTURE EVENT RESERVES</span>
                  <span className="text-[#E50914]">TRANSPARENT</span>
                </div>
                <p className="text-xs text-[#888888] font-sans mt-1">
                  A small operational reserve is stored transparently to finance future large-scale community fundraisers (like Battle of the Bands) to generate exponentially more aid.
                </p>
              </div>

              <div className="p-3 bg-[#121212] border-l-4 border-[#E50914] border-y border-r border-[#222222]">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#EDEDED] font-bold">
                  <span>[03] ZERO PLATFORM CUT</span>
                  <span className="text-[#E50914]">DIRECT UPI</span>
                </div>
                <p className="text-xs text-[#888888] font-sans mt-1">
                  Direct peer-to-peer UPI transfers incur zero payment gateway commissions, maximizing the real-world impact of your donation.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#111111] border-2 border-[#222222] text-xs text-[#888888] flex items-center gap-2 font-mono">
            <GrungeGlyph name="shield" className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Registered Non-Profit Organisation • Hyderabad, India.</span>
          </div>

        </div>

      </div>

    </section>
  );
}

