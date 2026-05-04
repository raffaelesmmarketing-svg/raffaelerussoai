'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent')
    if (!accepted) setTimeout(() => setVisible(true), 1500)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-sm z-50"
        >
          <div className="p-5 rounded-2xl bg-navy-800 border border-white/[0.12] shadow-pop flex flex-col gap-4">
            <p className="font-body text-[13px] text-fog-300 leading-relaxed">
              Usiamo cookie tecnici per il funzionamento del sito.{' '}
              <Link href="/cookie" className="text-lime-500 hover:underline">
                Cookie Policy
              </Link>
            </p>
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="flex-1 cta-shimmer font-display font-bold text-xs tracking-[0.08em] uppercase bg-lime-500 text-navy-950 px-4 py-2.5 rounded-full cursor-pointer border-0"
              >
                <span className="relative z-10">Accetto</span>
              </button>
              <button
                onClick={accept}
                className="font-display font-bold text-xs tracking-[0.08em] uppercase border border-white/20 text-fog-300 hover:text-white px-4 py-2.5 rounded-full cursor-pointer bg-transparent transition-colors"
              >
                Solo tecnici
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}