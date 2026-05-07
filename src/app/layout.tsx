import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PymeTrack Repartidor",
    template: "%s | PymeTrack Repartidor",
  },
  description: "App para repartidores de PymeTrack - Gestiona entregas de forma eficiente",
  keywords: ["repartidor", "delivery", "pymetrack", "pedidos", "entregas"],
  authors: [{ name: "PymeTrack Team" }],
  creator: "PymeTrack",
  publisher: "PymeTrack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PymeTrack Repartidor",
    description: "App para repartidores de PymeTrack - Gestiona entregas de forma eficiente",
    url: '/',
    siteName: 'PymeTrack Repartidor',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'PymeTrack Repartidor',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PymeTrack Repartidor',
    description: 'App para repartidores de PymeTrack - Gestiona entregas de forma eficiente',
    images: ['/icons/icon-512x512.png'],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#2563eb',
  colorScheme: 'light',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'PymeTrack',
    'application-name': 'PymeTrack Repartidor',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PymeTrack" />
        <meta name="application-name" content="PymeTrack Repartidor" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/icons/icon-192x192.svg" type="image/svg+xml" />
        <link rel="icon" href="/icons/icon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icons/icon-512x512.png" sizes="512x512" type="image/png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Viewport for PWA */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
