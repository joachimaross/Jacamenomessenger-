
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainLayout from '@/components/layout/MainLayout';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jacameno Messenger - Powered by Zeeky AI',
  description: 'Unified messaging platform with Zeeky AI - a hyper-personalized social concierge blending iMessage, TikTok, and Instagram experiences. Created by Joa\'Chima Ross Jr.',
  manifest: '/manifest.json',
  themeColor: '#6366f1',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AURA',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
