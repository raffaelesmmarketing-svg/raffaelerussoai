'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

// Post di Instagram con il loro embed ufficiale: il blockquote è il segnaposto (con il link,
// così senza script resta comunque cliccabile), lo script lo trasforma nel riquadro col video.
export default function InstagramPost({ url, etichetta }: { url: string; etichetta: string }) {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process()
      return
    }
    const s = document.createElement('script')
    s.src = 'https://www.instagram.com/embed.js'
    s.async = true
    document.body.appendChild(s)
  }, [])

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ background: '#0d1c47', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, margin: 0, maxWidth: 540, minWidth: 280, minHeight: 520, width: '100%', padding: 0 }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="block p-5 font-body text-[15px] text-fog-300 no-underline hover:text-white">
        {etichetta} → apri su Instagram
      </a>
    </blockquote>
  )
}
