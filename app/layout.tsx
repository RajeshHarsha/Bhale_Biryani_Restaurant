import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import LoadingProvider from '@/components/loading-provider'
import PageTransition from '@/components/page-transition'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Bhale Biryani Seethammadhara | Authentic Biryani in Visakhapatnam',
  description: 'Experience the best Chicken Dum Biryani, Pulao & more at Bhale Biryani Seethammadhara. Affordable prices, great taste. Located near Alluri Seetharama Raju Statue, Visakhapatnam.',
  icons: {
    icon: [
      {
        url: '/images/bb_logo.png',
        type: 'image/png',
      },
    ],
    apple: '/images/bb_logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LoadingProvider>
          {children}
          <Analytics />
        </LoadingProvider>
      </body>
    </html>
  )
}
