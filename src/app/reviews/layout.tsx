import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Reviews & Solidarity Testimonials | Project S.H.E. NGO',
  description:
    'Verified reviews and solidarity testimonials from volunteers, event attendees, partners, and community members supporting Project S.H.E. across Hyderabad.',
  alternates: {
    canonical: '/reviews',
  },
  openGraph: {
    title: 'Community Reviews & Solidarity Testimonials | Project S.H.E.',
    description:
      'Verified reviews and grassroots solidarity testimonials from volunteers, event attendees, and partners.',
    url: 'https://projectshe.in/reviews',
    siteName: 'Project S.H.E. NGO',
    images: [
      {
        url: '/assets/logo.png',
        width: 800,
        height: 800,
        alt: 'Project S.H.E. Community Reviews',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Reviews & Testimonials | Project S.H.E. NGO',
    description:
      'Verified reviews and solidarity testimonials from volunteers and community members supporting Project S.H.E.',
    images: ['/assets/logo.png'],
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
