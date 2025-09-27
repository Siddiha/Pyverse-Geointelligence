import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GeoIntel AI - Global Intelligence Agent',
  description: 'Real-time global news and intelligence with AI-powered insights',
  keywords: ['AI', 'news', 'geointelligence', 'global', 'real-time'],
  authors: [{ name: 'GeoIntel Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased overflow-hidden`}>
        <div className="gradient-bg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}