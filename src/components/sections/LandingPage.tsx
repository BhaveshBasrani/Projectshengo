'use client';

import React from 'react';
import FlowArt, { FlowSection } from '@/components/ui/FlowArt';

import HeroSection from '@/components/sections/HeroSection';
import MissionPillars from '@/components/sections/MissionPillars';
import GoogleFormsHub from '@/components/sections/GoogleFormsHub';
import DonationSection from '@/components/sections/DonationSection';
import BlogGlimpse from '@/components/sections/BlogGlimpse';
import CommunityReviews from '@/components/sections/CommunityReviews';
import { SiteConfig } from '@/lib/types';

interface LandingPageProps {
  config: SiteConfig;
}

export default function LandingPage({ config }: LandingPageProps) {
  return (
    <div className="page-fluid-enter">
      <FlowArt aria-label="Project S.H.E. Story">

        {/* Chapter 1: WHO WE ARE — Hero + Identity */}
        <FlowSection aria-label="Hero" className="bg-[#090909]">
          <HeroSection teamFormUrl={config.google_form_team_app} />
        </FlowSection>

      {/* Chapter 2: WHAT WE DO — Founder's Story + Three Pillars */}
      <FlowSection aria-label="Our Mission" className="relative bg-[#070707] overflow-hidden">
        {/* Layered Punk Grid Texture */}
        <div className="absolute inset-0 bg-punk-grid opacity-20 pointer-events-none" />
        
        {/* Ambient Top Crimson Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[32rem] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(229,9,20,0.18),transparent)] pointer-events-none" />
        
        {/* Atmospheric Halftone Stars Vignette */}
        <div 
          className="absolute inset-0 opacity-[0.025] mix-blend-screen pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/punk-bg-stars.jpg')` }}
        />

        {/* Industrial Section Accent Marker */}
        <div className="relative z-10">
          <MissionPillars />
        </div>
      </FlowSection>

      {/* Chapter 3: HOW YOU CAN HELP — Get Involved + Donate + Stories + Community Voices */}
      <FlowSection aria-label="Get Involved" className="relative bg-[#060606] overflow-hidden border-t-2 border-neutral-900">
        {/* Layered Punk Dots Texture */}
        <div className="absolute inset-0 bg-punk-dots opacity-25 pointer-events-none" />

        {/* Ambient Crimson Vignettes in Corners */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[radial-gradient(circle,rgba(229,9,20,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_right,rgba(229,9,20,0.14),transparent_70%)] pointer-events-none" />

        <div className="relative z-10">
          <GoogleFormsHub config={config} />
          <DonationSection config={config} />
          <BlogGlimpse />
          <CommunityReviews />
        </div>
      </FlowSection>

    </FlowArt>
    </div>
  );
}
