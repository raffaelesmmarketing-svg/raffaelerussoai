// La guida per mail (Raffaele, 18/10): dopo la mail il sito non dà più il PDF, lo manda all'indirizzo lasciato.
// La persona apre la mail per scaricarla: le prime mail del dominio vengono aperte e cliccate, e info@ si scalda.
// Si manda con Resend (chiave solo d'invio, solo raffaelerussoai.com, in RESEND_GUIDE_KEY). Il piano gratuito ne
// manda 100 al giorno: oltre, Resend rifiuta e lo sblocco torna a dare il PDF dal sito (src/app/guida/[slug]/actions.ts).

const SITO = 'https://raffaelerussoai.com'
const MITTENTE = 'Raffaele Russo <info@raffaelerussoai.com>'
const RISPOSTE = 'info@raffaelerussoai.com'

export type EsitoMail = { ok: true; id: string } | { ok: false; errore: string }

const html = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

// Il testo l'ha approvato Raffaele il 18/10: corto, e invita a rispondere.
export function mailGuida(titolo: string, pdf: string) {
  const link = new URL(pdf, SITO).toString()
  const oggetto = `La tua guida: ${titolo}`
  const testo = [
    'Ciao,',
    'eccola, come promesso 👇',
    '',
    `Scarica la guida: ${link}`,
    '',
    'Se hai un dubbio o ti blocchi su un passaggio, rispondi a questa mail: la leggo io.',
    '',
    'Raffaele',
  ].join('\n')
  const corpo = `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${html(oggetto)}</title></head>
<body style="margin:0;padding:0;background:#f4f5f7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;padding:32px 28px;font-family:Helvetica,Arial,sans-serif;color:#0C1A3A;">
<tr><td style="font-size:16px;line-height:1.6;">
<p style="margin:0 0 4px;">Ciao,</p>
<p style="margin:0 0 24px;">eccola, come promesso 👇</p>
<p style="margin:0 0 24px;"><a href="${html(link)}" style="display:inline-block;background:#b8ff3d;color:#0C1A3A;font-weight:700;text-decoration:none;padding:14px 26px;border-radius:999px;font-size:15px;">Scarica la guida</a></p>
<p style="margin:0 0 24px;color:#5b6475;font-size:13px;">Se il tasto non funziona: <a href="${html(link)}" style="color:#0C1A3A;">${html(link)}</a></p>
<p style="margin:0 0 24px;">Se hai un dubbio o ti blocchi su un passaggio, rispondi a questa mail: la leggo io.</p>
<p style="margin:0;">Raffaele</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
  return { oggetto, testo, html: corpo, link }
}

// Manda la mail. Non lancia mai: torna l'esito, e chi chiama decide (se non parte, il PDF si dà dal sito).
export async function mandaGuida(a: { email: string; titolo: string; pdf: string }): Promise<EsitoMail> {
  const chiave = process.env.RESEND_GUIDE_KEY
  if (!chiave) return { ok: false, errore: 'manca RESEND_GUIDE_KEY' }
  const m = mailGuida(a.titolo, a.pdf)
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chiave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: MITTENTE, to: [a.email], reply_to: RISPOSTE, subject: m.oggetto, html: m.html, text: m.testo }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    const j = (await r.json().catch(() => ({}))) as { id?: string; message?: string; name?: string }
    if (r.ok && j.id) return { ok: true, id: j.id }
    return { ok: false, errore: `${r.status} ${j.message || j.name || ''}`.trim() }
  } catch (e) {
    return { ok: false, errore: `rete: ${e instanceof Error ? e.message : String(e)}` }
  }
}
