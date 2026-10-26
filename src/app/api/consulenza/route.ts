import { NextRequest, NextResponse } from 'next/server'
import { avvisaPrenotazione } from '@/lib/avvisi'
import { righeRiepilogo, validaPrenotazione } from '@/lib/consulenza'

// La prenotazione dalla candidatura alla consulenza gratuita (/consulenza, 26/10/2026). La pagina la manda quando il
// calendario di Calendly le dice che la prenotazione è fatta: arrivano la porta, le risposte e i due indirizzi della
// prenotazione, mai nome e mail (stanno su Calendly, che manda già la sua mail a Raffaele).
// 1 · il controllo, lo stesso delle prove (lib/consulenza.ts, `validaPrenotazione`);
// 2 · l'avviso a Raffaele (Telegram e mail) con le risposte e il conto, che a chi prenota non si mostra.
// Niente database: la prenotazione vive su Calendly.
//
// ⛔ Fuori dalla produzione (anteprime di Vercel e `next dev`) la rotta non manda niente: risponde `anteprima: true` e la
// pagina lo dice. La prenotazione fatta su Calendly da un'anteprima, invece, è vera.

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const v = validaPrenotazione(body)
    if (!v.ok) return NextResponse.json({ ok: false, error: v.errore }, { status: 400 })

    if (process.env.VERCEL_ENV !== 'production') return NextResponse.json({ ok: true, anteprima: true })

    const esito = await avvisaPrenotazione({ righe: righeRiepilogo(v.p.porta, v.p.risposte), origine: v.p.origine })
    if (!esito.telegram && !esito.email) console.error('[consulenza] avviso della prenotazione non partito', v.p.invitato)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[consulenza] eccezione', err)
    return NextResponse.json({ ok: false, error: 'Si è verificato un errore inatteso.' }, { status: 500 })
  }
}
