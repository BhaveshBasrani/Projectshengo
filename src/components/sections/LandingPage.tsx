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
    <FlowArt aria-label="Project S.H.E. Story">

      {/* Chapter 1: WHO WE ARE — Hero + Identity */}
      <FlowSection aria-label="Hero" className="bg-[#090909]">
        <HeroSection teamFormUrl={config.google_form_team_app} />
      </FlowSection>

      {/* Chapter 2: WHAT WE DO — Founder's Story + Three Pillars */}
      <FlowSection aria-label="Our Mission" className="bg-[#080808]">
        <MissionPillars />
      </FlowSection>

      {/* Chapter 3: HOW YOU CAN HELP — Get Involved + Donate + Stories + Community Voices */}
      <FlowSection aria-label="Get Involved" className="bg-[#080808]">
        <GoogleFormsHub config={config} />
        <DonationSection config={config} />
        <BlogGlimpse />
        <CommunityReviews />
      </FlowSection>

    </FlowArt>
  );
}
