'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SiteConfig, SiteSettings } from '@/lib/types';
import { HiCheck, HiSquare2Stack } from 'react-icons/hi2';

interface DonationSectionProps {
  config: SiteConfig;
  settings?: SiteSettings;
}

export default function DonationSection({ config, settings }: DonationSectionProps) {
  const [copied, setCopied] = useState(false);
  const upiId = settings?.donation_upi_id || config.donation_upi_id || 'shailajalakshmisarao1974-2@okicici';
  const qrUrl = settings?.donation_qr_url || config.donation_qr_url || '/assets/qr-code.svg';
  const headline = settings?.donation_headline || 'DONATE THROUGH UPI';
  const subtext = settings?.donation_subtext || 'Convenient, safe, and designed to ensure your contribution reaches those who need it most.';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="donate" className="scroll-mt-28 sm:scroll-mt-36 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none">

      {/* Header */}
      <div className="mb-14 space-y-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="font-mono text-xs text-[#E6192B] uppercase tracking-widest font-bold">
            // DIRECT SURVIVOR AID
          </span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-none">
          {headline}
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
          {subtext}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Left QR Terminal - Pristine Solid White Square framed by 1px #333333 Border */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md p-6 sm:p-8 bg-[#0E0E0E] text-[#EDEDED] border border-[#333333] rounded-sm flex flex-col items-center text-center relative group">

            <div className="flex items-center justify-between w-full mb-6">
              <span className="font-mono text-[10px] text-[#E6192B] uppercase tracking-widest font-bold">
                OFFICIAL UPI TERMINAL
              </span>
            </div>

            {/* Pristine Solid White Perfect Square framed by Minimalist 1px #333333 Border */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-white border border-[#333333] p-4 flex items-center justify-center rounded-sm">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="Project S.H.E. Official Donation QR Code"
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            <div className="mt-6 w-full pt-4 border-t border-[#333333] space-y-3 font-mono">
              <div className="bg-[#141414] p-3.5 sm:p-4 border border-[#333333] rounded-sm space-y-2.5 text-left">
                <div className="flex items-center justify-between text-[10px] text-[#888888] font-mono uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#E6192B] rounded-full inline-block"></span>
                    <span>UPI ID</span>
                  </span>
                  {copied && (
                    <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-semibold flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                      <HiCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>COPIED</span>
                    </span>
                  )}
                </div>

                <div
                  onClick={handleCopyUpi}
                  className="bg-[#121212] border border-[#262626] hover:border-[#E6192B]/50 p-2.5 sm:p-3 rounded-sm cursor-pointer transition-colors group/box flex items-center justify-between gap-2"
                  title="Click to copy UPI ID"
                >
                  <span className="font-mono text-xs sm:text-[13px] text-white font-bold select-all tracking-tight break-all block text-left">
                    {upiId}
                  </span>
                  <HiSquare2Stack className="w-3.5 h-3.5 text-neutral-500 group-hover/box:text-[#E6192B] shrink-0 transition-colors hidden sm:block" />
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className={`relative overflow-hidden group/btn w-full py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all duration-200 ease-out active:scale-[0.98] active:translate-y-0.5 ${
                    copied
                      ? 'bg-white text-black border border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'bg-[#E6192B] hover:bg-white text-white hover:text-black border border-[#E6192B] hover:border-white shadow-[0_2px_12px_rgba(230,25,43,0.3)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)]'
                  }`}
                >
                  {/* Subtle glass sheen sweep on hover */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

                  {copied ? (
                    <span className="relative z-10 inline-flex items-center gap-1.5 transform transition-all duration-200 scale-100 animate-in zoom-in-95 font-bold">
                      <HiCheck className="w-4 h-4 text-black" />
                      <span className="tracking-widest">COPIED TO CLIPBOARD!</span>
                    </span>
                  ) : (
                    <span className="relative z-10 inline-flex items-center gap-1.5 font-bold">
                      <HiSquare2Stack className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/btn:scale-110" />
                      <span>COPY UPI ID</span>
                    </span>
                  )}
                </button>
              </div>

              <span className="text-[11px] text-[#A3A3A3] block font-mono text-center">
                Works with Google Pay, PhonePe, Paytm, BHIM, or any UPI banking app.
              </span>
            </div>

          </div>
        </div>

        {/* Right Transparency & Trust Information - Editorial Readout */}
        <div className="lg:col-span-7 space-y-10 sm:space-y-12">

          {/* Section 1: Where does your money go? */}
          <div className="p-6 sm:p-8 bg-[#0E0E0E] border border-[#333333] rounded-sm space-y-4 relative">
            <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight text-white">
              WHERE DOES YOUR MONEY GO?
            </h3>

            <div className="space-y-4 pt-1">
              <p className="font-sans text-sm sm:text-[15px] text-[#A3A3A3] leading-[1.75] font-normal">
                Our partnerships with organisations like Sayodhya help ensure that every contribution goes towards making someone’s life safer.
              </p>
              <p className="font-sans text-sm sm:text-[15px] text-[#A3A3A3] leading-[1.75] font-normal">
                A small portion of your contribution is set aside to support future events and outreach campaigns. We then donate the funds raised through these initiatives to organisations working within Project S.H.E.’s areas of focus.
              </p>
            </div>
          </div>

          {/* Section 2: Our registration Status */}
          <div className="p-6 sm:p-8 bg-[#0E0E0E] border border-[#333333] rounded-sm space-y-4 relative">
            <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight text-white">
              OUR REGISTRATION STATUS.
            </h3>

            <div className="pt-1">
              <p className="font-sans text-sm sm:text-[15px] text-[#A3A3A3] leading-[1.75] font-normal">
                We are formally registered as Sarva Nirbhaya Foundation, a Section 8 company under the Companies Act, 2013. We were incorporated on 19 May 2026 under the Ministry of Corporate Affairs, Government of India.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
