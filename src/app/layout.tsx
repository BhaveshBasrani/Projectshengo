import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/firebase/auth-context';
import FloatingNavbar from '@/components/ui/FloatingNavbar';
import BulletinBanner from '@/components/ui/BulletinBanner';
import BrutalFooter from '@/components/ui/BrutalFooter';
import PaperOverlay from '@/components/ui/PaperOverlay';
import TextureBackground from '@/components/ui/TextureBackground';
import NewsletterModal from '@/components/ui/NewsletterModal';
import ClientSecurityShield from '@/components/security/ClientSecurityShield';
import CookieConsentBanner from '@/components/ui/CookieConsentBanner';

export const metadata: Metadata = {
  title: {
    default: 'Project S.H.E. | Hyderabad’s Leading Student NGO',
    template: '%s | Project S.H.E. NGO',
  },
  description:
    'Project S.H.E., Hyderabad’s leading student NGO, works to dismantle systemic gender-based violence, reshape societal mindsets, and extend support to survivor safe houses.',
  keywords: [
    'best student led ngo',
    'youth ngo hyderabad',
    'student ngo india',
    'project she',
    'project she ngo',
    'women ngo india',
    'gender based violence ngo',
    'survivor support',
    'sahodaya womens help home',
    'sarva nirbhaya foundation',
    'fundraising for women',
    'youth volunteering hyderabad',
    'student activist group',
  ],
  authors: [{ name: 'Project S.H.E. Core Team' }],
  creator: 'Sanskriti Mohan',
  publisher: 'Project S.H.E. NGO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://projectshe.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Project S.H.E. | Hyderabad’s Leading Student NGO',
    description:
      'Raise your voice where theirs was silenced. Stand with those who survived. Hyderabad’s leading student NGO dismantling systemic gender-based violence.',
    url: 'https://projectshe.in',
    siteName: 'Project S.H.E. NGO',
    images: [
      {
        url: '/assets/logo.png',
        width: 800,
        height: 800,
        alt: 'Project S.H.E. Official Seal - Best Student Led NGO',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project S.H.E. | Hyderabad’s Leading Student NGO',
    description: 'Raise your voice where theirs was silenced. Stand with those who survived. Hyderabad’s leading student NGO dismantling systemic gender-based violence.',
    images: ['/assets/logo.png'],
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import CinematicEasterEgg from '@/components/ui/CinematicEasterEgg';
import { getPublishedUpdates, getSiteSettings } from '@/lib/data/store';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [updates, settings] = await Promise.all([
    getPublishedUpdates(),
    getSiteSettings(),
  ]);
  const defaultTheme = settings?.default_theme || 'dark';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NGO',
        '@id': 'https://projectshe.in/#organization',
        name: 'Project S.H.E.',
        alternateName: 'Project SHE',
        url: 'https://projectshe.in',
        logo: 'https://projectshe.in/assets/logo.png',
        description:
          'Hyderabad’s leading student NGO dismantling systemic gender-based violence, reshaping societal mindsets, and supporting survivor safe houses.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          addressCountry: 'IN',
        },
        sameAs: ['https://instagram.com/projectshe.ngo'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://projectshe.in/#website',
        url: 'https://projectshe.in',
        name: 'Project S.H.E.',
        publisher: {
          '@id': 'https://projectshe.in/#organization',
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={defaultTheme === 'light' ? 'light' : 'dark'}
      data-theme={defaultTheme}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&family=Space+Grotesk:wght@500;700;800&family=Syncopate:wght@700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var serverDefault = ${JSON.stringify(defaultTheme)};
                  var prevServer = localStorage.getItem('project-she-server-default');
                  var activeTheme;
                  if (prevServer !== serverDefault) {
                    localStorage.setItem('project-she-server-default', serverDefault);
                    localStorage.setItem('project-she-theme', serverDefault);
                    activeTheme = serverDefault;
                  } else {
                    var saved = localStorage.getItem('project-she-theme');
                    activeTheme = saved ? saved : (serverDefault || 'dark');
                  }
                  if (activeTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col relative bg-[#080808] text-[#EDEDED] overflow-x-hidden">
        {/* Procedural WebGL Paper Grain Shader */}
        <TextureBackground mode="dark" opacity={0.85} />

        {/* Paper Fiber Noise & CRT Scanline Overlay */}
        <PaperOverlay />

        <AuthProvider>
          <ClientSecurityShield />
          <BulletinBanner updates={updates} />
          <FloatingNavbar />
          <main className="flex-1 relative z-10">{children}</main>
          <BrutalFooter />
          <NewsletterModal />
          <CinematicEasterEgg />
          <CookieConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}


