import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Script from 'next/script';
import GoogleAnalytics from './GoogleAnalytics';
import JsonLd from '@/components/JsonLd'

// 导入样式
import '@/app/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gold Calculator - Calculate Gold Value Instantly',
  description: 'Calculate the value of your gold with our easy-to-use gold calculator. Get real-time gold prices and accurate estimations.',
  metadataBase: new URL('https://www.goldcalculator.click')
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon.svg" />
        {/* manifest removed to avoid 404 in dev */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleAnalytics />
        <JsonLd type="organization" />
        <Navigation />
        <main>{children}</main>
        <Script id="sw-kill" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(rs){
                rs.forEach(function(r){ r.unregister(); });
              }).catch(function(){});
            }
          `}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3389504348016979"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
