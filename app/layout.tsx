import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import { SmoothScroll } from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Pact | From Handshake to Commercial Contract',
  description: 'Transform WhatsApp chats and voice notes into legally valid, tamper-evident commercial agreements under Indian Contract Act 1872 & BSA 2023 for Indian MSMEs.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/pact-badge.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/pact-badge.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/pact-badge.png',
  },
  applicationName: 'Pact',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pact MSME Contract',
  },
  keywords: [
    'Indian MSME contracts',
    'WhatsApp commercial agreements',
    'Bharatiya Sakshya Adhiniyam 2023 Section 63',
    'Indian Contract Act 1872 Section 10',
    'Electronic Evidence Certificate',
    'SHA-256 tamper verification',
    'MSMED Act 2006 interest protection',
  ],
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/pact-badge.png" type="image/png" />
        <link rel="shortcut icon" href="/pact-badge.png" type="image/png" />
        <link rel="apple-touch-icon" href="/pact-badge.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
        <SmoothScroll>
          {children}
          <PwaInstallPrompt />
        </SmoothScroll>
      </body>
    </html>
  );
}
