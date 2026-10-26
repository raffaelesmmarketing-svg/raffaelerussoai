'use client'

import { usePathname } from 'next/navigation'
import { senzaCornice } from '@/lib/cornice'
import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const percorso = usePathname() ?? ''
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (senzaCornice(percorso)) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-lime-500 shadow-glow-lime-sm transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}