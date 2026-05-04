import type { Metadata } from 'next'
import { Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: {
    default: "Raffaele Russo — L'AI per imprenditori",
    template: '%s | Raffaele Russo',
  },
  description: "L'AI non è complicata. È solo spiegata male. Strumenti concreti per gli imprenditori italiani.",
  metadataBase: new URL('https://raffaelerussoai.com'),
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://raffaelerussoai.com',
    siteName: 'Raffaele Russo',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${manrope.variable} ${jetbrains.variable}`}>
      <body className="bg-navy-950 text-white font-body antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}