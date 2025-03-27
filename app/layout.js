import './globals.css';
import { Montserrat, Open_Sans } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Load the fonts
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Living Lavender | Find Your Perfect Match',
  description: 'A beautiful dating site to help you find meaningful connections based on shared values and interests.',
  keywords: 'dating, relationships, online dating, matchmaking, compatibility',
  openGraph: {
    title: 'Living Lavender | Find Your Perfect Match',
    description: 'A beautiful dating site to help you find meaningful connections based on shared values and interests.',
    url: 'https://livinglavender.com',
    siteName: 'Living Lavender',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Living Lavender Dating Site',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${montserrat.variable} ${openSans.variable}`}
    >
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}