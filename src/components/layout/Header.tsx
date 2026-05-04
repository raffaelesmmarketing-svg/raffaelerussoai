'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const links = [
  { label: 'Chi Sono', href: '/chi-sono' },
  { label: 'Blog', href: '/blog' },
  { label: 'Risorse Gratis', href: '/risorse' },
  { label: 'Lavoriamo Insieme', href: '/lavoriamo-insieme' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-950/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08]'
          : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-mark.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-display font-extrabold text-base tracking-[-0.01em] text-white">
            Raffaele Russo <em className="em-lime">AI</em>
          </span>
        </Link>

        <nav className="hidden md:flex gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative font-body text-sm font-medium text-fog-300 hover:text-white transition-colors py-1.5 group"
            >
              {l.label}
              <span className="absolute left-0 right-0 bottom-0 h-px bg-lime-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </nav>

        <Link
          href="/risorse"
          className="cta-shimmer hidden md:inline-flex group items-center gap-2 font-display font-extrabold text-[13px] tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-4 py-2.5 rounded-full no-underline shadow-glow-lime-sm"
        >
          <span className="relative z-10">Guida Gratuita</span>
          <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.08] bg-navy-950 px-8 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-fog-300 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/risorse"
            className="text-sm font-bold text-lime-500"
            onClick={() => setOpen(false)}
          >
            Guida Gratuita →
          </Link>
        </div>
      )}
    </motion.header>
  )
}
