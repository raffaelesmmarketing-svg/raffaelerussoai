// Stampa le guide di public/guide/ in PDF (A4) e ne ricava la copertina.
//
//   PLAYWRIGHT_DIR=/cartella/con/node_modules node scripts/stampa-guide.mjs [slug…]
//
// Playwright non è una dipendenza del sito: si prende da una cartella che ce l'ha.
// ⛔ Le sezioni `.fade-in` nascono a opacità 0 e si accendono allo scroll: senza forzarle visibili
//    il PDF è vuoto dalla seconda pagina.
// ⛔ Chrome non colora i margini di @page: margine 0 e il respiro in testa e in coda a ogni pagina
//    lo danno thead/tfoot di una tabella, che in stampa si ripetono.
// ⛔ Il titolo col gradiente (`background-clip: text`) in PDF esce dentro un riquadro: in stampa è pieno.
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const require = createRequire(process.env.PLAYWRIGHT_DIR ? path.join(process.env.PLAYWRIGHT_DIR, 'x.js') : import.meta.url)
const { chromium } = require('playwright')

const radice = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'guide')

// html di partenza → nome del PDF e della copertina
export const GUIDE = [
  { html: '2026-05-13-prov-smettila-di-usare-chatgpt-come-un-motore.html', slug: 'chatgpt-non-e-google-usalo-davvero' },
  { html: '2026-05-06-prov-chatgpt-ti-dice-sempre-che-hai-ragione-e.html', slug: 'stop-al-chatgpt-che-ti-da-sempre-ragione' },
  { html: '2026-09-19-dieci-cose-da-automatizzare-senza-installare-niente.html', slug: 'dieci-cose-da-automatizzare-senza-installare-niente' },
]

const CSS_STAMPA = `
  @page { size: A4; margin: 0; }
  html, body { background: #0A0F1E !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .progress-bar { display: none !important; }
  /* «Hai ricevuto questa guida commentando GUIDA»: vero su Instagram, falso per chi la scarica dal sito */
  .footer-keyword { display: none !important; }
  .fade-in { opacity: 1 !important; transform: none !important; transition: none !important; }
  .hero-badge span { animation: none !important; }
  .hero { padding: 56px 24px 40px !important; }
  .section-wrap { padding: 48px 24px !important; }
  /* la chiamata finale resta intera: titolo, testo e bottone sulla stessa pagina */
  .cta-section { padding: 48px 24px !important; break-inside: avoid; }
  .footer { padding: 32px 24px !important; break-inside: avoid; }
  h1 { background: none !important; -webkit-text-fill-color: #ffffff !important; color: #ffffff !important; }
  .output-grid { grid-template-columns: 1fr 1fr !important; }
  .output-card, .err-item, .ext-item, .callout, .action-item, .step-header, .section-intro, .step-body > p, .cosa, .avviso { break-inside: avoid; }
  .section-label, .section-title, .section-intro, .step-header, .part-header { break-after: avoid; }
  p { orphans: 3; widows: 3; }
  table.pagina { width: 100%; border-collapse: collapse; }
  table.pagina td { padding: 0; }
  table.pagina .respiro { height: 12mm; }
`

const scelte = process.argv.slice(2)
const daFare = scelte.length ? GUIDE.filter((g) => scelte.includes(g.slug)) : GUIDE

const browser = await chromium.launch()
for (const g of daFare) {
  const url = pathToFileURL(path.join(radice, g.html)).href

  // copertina: la testata della guida com'è a schermo
  const schermo = await browser.newPage({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 1 })
  await schermo.goto(url, { waitUntil: 'networkidle' })
  await schermo.evaluate(() => document.fonts.ready)
  await schermo.addStyleTag({ content: '.progress-bar{display:none!important}.hero-badge span{animation:none!important}.hero{min-height:675px;display:flex;align-items:center;justify-content:center}' })
  await schermo.screenshot({ path: path.join(radice, 'copertine', `${g.slug}.jpg`), type: 'jpeg', quality: 86, animations: 'disabled' })
  await schermo.close()

  const pagina = await browser.newPage({ viewport: { width: 900, height: 1200 } })
  await pagina.goto(url, { waitUntil: 'networkidle' })
  await pagina.evaluate(() => document.fonts.ready)
  await pagina.addStyleTag({ content: CSS_STAMPA })
  await pagina.evaluate(() => {
    const tabella = document.createElement('table')
    tabella.className = 'pagina'
    tabella.innerHTML = '<thead><tr><td class="respiro"></td></tr></thead><tfoot><tr><td class="respiro"></td></tr></tfoot><tbody><tr><td></td></tr></tbody>'
    const cella = tabella.querySelector('tbody td')
    for (const nodo of [...document.body.children]) if (nodo.tagName !== 'SCRIPT') cella.appendChild(nodo)
    document.body.prepend(tabella)
  })
  const invisibili = await pagina.evaluate(() => [...document.querySelectorAll('.fade-in')].filter((e) => getComputedStyle(e).opacity !== '1').length)
  if (invisibili) throw new Error(`${g.slug}: ${invisibili} blocchi ancora invisibili`)
  await pagina.pdf({ path: path.join(radice, `${g.slug}.pdf`), printBackground: true, preferCSSPageSize: true })
  await pagina.close()
  console.log('✓', g.slug)
}
await browser.close()
