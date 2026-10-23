'use client';

import React, { useState, useEffect } from 'react';
import FlowArt, { FlowSection } from '@/components/ui/FlowArt';

import HeroSection from '@/components/sections/HeroSection';
import MissionPillars from '@/components/sections/MissionPillars';
import GoogleFormsHub from '@/components/sections/GoogleFormsHub';
import DonationSection from '@/components/sections/DonationSection';
import BlogGlimpse from '@/components/sections/BlogGlimpse';
import CommunityReviews from '@/components/sections/CommunityReviews';
import { SiteConfig, SiteSettings } from '@/lib/types';

interface LandingPageProps {
  config: SiteConfig;
  settings?: SiteSettings;
}

export default function LandingPage({ config, settings: initialSettings }: LandingPageProps) {
  const [settings, setSettings] = useState<SiteSettings | undefined>(initialSettings);

  // Sync settings when initial prop updates
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  // Keep homepage live-synced when switching back from admin tab
  useEffect(() => {
    const syncFresh = () => {
      fetch('/api/admin/settings', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) {
            setSettings(data.settings);
          }
        })
        .catch(() => {});
    };

    window.addEventListener('focus', syncFresh);
    return () => window.removeEventListener('focus', syncFresh);
  }, []);
  return (
    <div className="page-fluid-enter">
      <FlowArt aria-label="Project S.H.E. Story">

        {/* Chapter 1: WHO WE ARE — Hero + Identity */}
        <FlowSection aria-label="Hero" className="bg-[#090909]">
          <HeroSection
            teamFormUrl={settings?.google_form_team_app || config.google_form_team_app}
            marqueeText={settings?.marquee_text}
            headlineText={settings?.hero_headline}
            heroBadge={settings?.hero_badge}
            heroSubbadge={settings?.hero_subbadge}
            heroDescription={settings?.hero_description}
          />
        </FlowSection>

        {/* Chapter 2: WHAT WE DO — Founder's Story + Three Pillars */}
        <FlowSection aria-label="Our Mission" className="relative bg-[#090909] select-none">
          {/* Flat, solid negative space with zero background noise */}

          {/* Industrial Section Accent Marker */}
          <div className="relative z-10">
            <MissionPillars settings={settings} />
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
            <DonationSection config={config} settings={settings} />
            <BlogGlimpse />
            <CommunityReviews />
          </div>
        </FlowSection>

      </FlowArt>
    </div>
  );
}
