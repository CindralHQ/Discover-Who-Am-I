import './globals.css'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { BackgroundAudio } from '@/components/ui/BackgroundAudio'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/ui/Header'
import { PageFade } from '@/components/ui/PageFade'
import { ImageLightboxProvider } from '@/components/ui/ImageLightbox'
import { ContentProtectionLayer } from '@/components/ui/ContentProtectionLayer'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LEARNPRESS_USER_COOKIE, parseLearnPressUserCookie } from '@/lib/learnpress'
import { CookieBanner } from '@/components/ui/CookieBanner'

const deploymentHost =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://discoverwhoami.com')

const siteDescription =
  "Discover Who Am I — a Thongdrol experience that gently guides you to see, feel, and awaken the liberation within."

const ogImage = `${deploymentHost}/og-logo.png`

export const metadata: Metadata = {
  metadataBase: new URL(deploymentHost),
  title: {
    default: 'Discover Who Am I',
    template: '%s | Discover Who Am I'
  },
  description: siteDescription,
  openGraph: {
    title: 'Discover Who Am I',
    description: siteDescription,
    url: deploymentHost,
    siteName: 'Discover Who Am I',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Discover Who Am I logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Who Am I',
    description: siteDescription,
    images: [ogImage]
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png'
  },
  keywords: [
    'Who Am I series',
    'Santosh Ma',
    'kundalini course',
    'chakra teachings',
    'yogic wisdom'
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const learnPressUser = parseLearnPressUserCookie(cookieStore.get(LEARNPRESS_USER_COOKIE)?.value)

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0"
        />
      </head>
      <body>
        <BackgroundAudio />
        <ContentProtectionLayer />
        <Header user={learnPressUser} />
        <main className="px-4 pb-10 sm:px-6 lg:px-8">
          <ImageLightboxProvider>
            <PageFade>{children}</PageFade>
          </ImageLightboxProvider>
        </main>
        <Footer />
        <SpeedInsights />
        <CookieBanner />
      </body>
    </html>
  )
}
