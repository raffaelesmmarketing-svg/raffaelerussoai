import { ImageResponse } from 'next/og'

export const alt = 'Intelligenza artificiale per architetti — cosa puoi fare davvero nel tuo studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(160deg, #000000 0%, #050d1f 45%, #0d1c47 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: '#b8ff3d', textTransform: 'uppercase' }}>
          Per architetti
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
            Intelligenza artificiale per architetti.
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#aab6cc', lineHeight: 1.3, maxWidth: 980 }}>
            Non ti serve un corso. Ti serve qualcuno che ti mostri come montarla nel tuo lavoro.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 22, color: '#b8ff3d' }}>
          <div style={{ display: 'flex', width: 220, height: 2, background: 'rgba(184,255,61,0.6)' }} />
          <div style={{ display: 'flex', letterSpacing: 3, textTransform: 'uppercase' }}>raffaelerussoai.com</div>
          <div style={{ display: 'flex', flex: 1, height: 2, background: 'rgba(184,255,61,0.6)' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
