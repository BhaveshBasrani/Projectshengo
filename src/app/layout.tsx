import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/firebase/auth-context';
import FloatingNavbar from '@/components/ui/FloatingNavbar';
import BrutalFooter from '@/components/ui/BrutalFooter';
import PaperOverlay from '@/components/ui/PaperOverlay';
import TextureBackground from '@/components/ui/TextureBackground';
import NewsletterModal from '@/components/ui/NewsletterModal';

export const metadata: Metadata = {
  title: {
    default: 'Project S.H.E. | Best Student-Led NGO in Hyderabad',
    template: '%s | Project S.H.E. NGO',
  },
  description:
    'Project S.H.E. is the best student-led youth NGO in Hyderabad. We fight gender-based violence, shift society\'s mindset, and give 100% of funds directly to survivor safehouses.',
  keywords: [
    'best student led ngo',
    'youth ngo hyderabad',
    'student ngo india',
    'project she',
    'project she ngo',
    'women ngo india',
    'gender based violence ngo',
    'survivor support',
    'sayodhya women help home',
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
    title: 'Project S.H.E. | Best Student-Led NGO in Hyderabad',
    description:
      'Fighting gender-based violence and shifting society\'s mindset. Join the best youth-led NGO in Hyderabad routing 100% of funds to verified survivor safehouses.',
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
    title: 'Project S.H.E. | Best Student-Led NGO',
    description: 'Youth-led NGO fighting gender-based violence in Hyderabad. We give 100% of funds to survivor safehouses.',
    images: ['/assets/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col relative bg-[#080808] text-[#EDEDED] overflow-x-hidden">
        {/* Procedural WebGL Paper Grain Shader */}
        <TextureBackground mode="dark" opacity={0.85} />

        {/* Paper Fiber Noise & CRT Scanline Overlay */}
        <PaperOverlay />

        <AuthProvider>
          <FloatingNavbar />
          <main className="flex-1 relative z-10">{children}</main>
          <BrutalFooter />
          <NewsletterModal />
        </AuthProvider>
      </body>
    </html>
  );
}


