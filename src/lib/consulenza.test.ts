// Prove della candidatura alla consulenza gratuita del personal brand (/consulenza, 26/10/2026). Si lanciano con:
//   node --test src/lib/consulenza.test.ts
// Verificano quello che decide cosa vede chi risponde e cosa arriva a Raffaele: le domande che compaiono, le righe dopo
// le risposte (mai i numeri del conto), le uscite gentili, le risposte che passano il controllo del server, il testo e
// l'indirizzo del calendario di Calendly.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  PORTE,
  SETTIMANE,
  conto,
  domandeVisibili,
  ecoDopo,
  linkCalendly,
  righeRiepilogo,
  testiDi,
  testoCalendly,
  uscitaDopo,
  validaPrenotazione,
  type Porta,
  type Risposte,
} from './consulenza.ts'

const ids = (porta: Porta, r: Risposte = {}) => domandeVisibili(porta, r).map((d) => d.id)

test('attività: le domande in ordine; «Altro» chiede il lavoro in due parole, chi lavora da solo salta il ruolo', () => {
  assert.deepEqual(ids('attivita'), ['lavoro', 'persone', 'ruolo', 'tempo', 'ore', 'valoreOra', 'ai', 'come', 'dolore', 'quando'])
  assert.deepEqual(ids('attivita', { lavoro: 'Altro' }).slice(0, 3), ['lavoro', 'lavoroAltro', 'persone'])
  assert.equal(ids('attivita', { persone: 'Lavoro da solo' }).includes('ruolo'), false)
})

test('imparare: le domande in ordine', () => {
  assert.deepEqual(ids('imparare'), ['oggi', 'imparare', 'livello', 'blocco', 'oreImparare', 'modo', 'investimento', 'dolore'])
})

test('chi lavora da solo si sente dare del tu, la squadra del voi', () => {
  const ore = PORTE.attivita.domande.find((d) => d.id === 'ore')!
  assert.match(testiDi(ore, 'attivita', { persone: 'Lavoro da solo' }).titolo, /ti /)
  assert.match(testiDi(ore, 'attivita', { persone: 'Da 2 a 5' }).titolo, /vi /)
})

const attivita = (extra: Risposte = {}): Risposte => ({
  lavoro: 'Salute e benessere',
  persone: 'Da 2 a 5',
  ruolo: 'Titolare o socio',
  tempo: ['Rispondere a messaggi e mail dei clienti', 'Contenuti per i social e video'],
  ore: 'Da 6 a 10',
  valoreOra: '35 €',
  ai: 'Uso ChatGPT o Claude ogni tanto',
  come: 'Lo costruiamo insieme, e intanto imparo',
  dolore: '  rispondere   a tutti su\nWhatsApp la sera  ',
  quando: 'Entro un mese',
  ...extra,
})

test(`il conto per Raffaele: ore a settimana per ${SETTIMANE} settimane, arrotondate a 10; gli euro a 100`, () => {
  assert.equal(SETTIMANE, 46)
  // 8 ore × 46 = 368 → 370; 370 × 35 € = 12.950 → 13.000
  assert.deepEqual(conto('attivita', attivita()), { ore: 370, euro: 13000 })
  // «Più di 10» conta 12, per stare bassi: 12 × 46 = 552 → 550
  assert.deepEqual(conto('attivita', attivita({ ore: 'Più di 10', valoreOra: '20 €' })), { ore: 550, euro: 11000 })
  assert.deepEqual(conto('attivita', attivita({ valoreOra: 'Non saprei' })), { ore: 370, euro: null })
  assert.equal(conto('attivita', { lavoro: 'Salute e benessere' }), null)
  assert.equal(conto('imparare', { oreImparare: 'Da 3 a 5' }), null)
})

test('chi risponde non vede mai i numeri del conto, e nessuna domanda lo promette (Raffaele, 26/10)', () => {
  assert.equal(ecoDopo('attivita', 'valoreOra', attivita()), '')
  assert.equal(ecoDopo('attivita', 'valoreOra', attivita({ persone: 'Lavoro da solo', valoreOra: 'Non saprei' })), '')
  for (const porta of ['attivita', 'imparare'] as const) {
    for (const d of PORTE[porta].domande) {
      const testi = JSON.stringify(d).toLowerCase()
      assert.equal(/\bconto\b/.test(testi), false, `${d.id}: niente conto promesso`)
      assert.equal(/risparmi|risparmier|azzer|garantit/.test(testi), false, `${d.id}: niente risparmi promessi`)
    }
  }
})

test('le uscite gentili: edilizia, «per ora mi informo», «per ora solo gratis»', () => {
  assert.equal(uscitaDopo('attivita', 'lavoro', { lavoro: 'Edilizia: impresa o studio tecnico' }), 'edilizia')
  assert.equal(uscitaDopo('attivita', 'quando', { quando: 'Per ora mi informo' }), 'informo')
  assert.equal(uscitaDopo('imparare', 'investimento', { investimento: 'Per ora solo gratis' }), 'gratis')
  assert.equal(uscitaDopo('attivita', 'quando', { quando: 'Subito' }), null)
  assert.equal(uscitaDopo('attivita', 'lavoro', { lavoro: 'Salute e benessere' }), null)
})

test('ogni riga di risposta parla di una risposta vera, e ogni domanda ha la sua etichetta breve', () => {
  for (const porta of ['attivita', 'imparare'] as const) {
    const visti = new Set<string>()
    for (const d of PORTE[porta].domande) {
      assert.ok(d.breve, `${porta}/${d.id}: manca «breve»`)
      assert.equal(visti.has(d.id), false, `${porta}/${d.id}: id doppio`)
      visti.add(d.id)
      if (d.tipo !== 'testo') for (const e of d.eco ?? []) assert.ok(d.opzioni.includes(e.se), `${porta}/${d.id}: «${e.se}» non è un'opzione`)
    }
  }
})

test('niente di Cantieri Hub nelle domande e nelle porte (il link dell\'edilizia è un indirizzo, non un testo)', () => {
  const tutto = JSON.stringify(PORTE).toLowerCase()
  for (const parola of ['cantieri', 'preventivatore', 'computatore', 'salesflow']) assert.equal(tutto.includes(parola), false, parola)
})

// Gli indirizzi che il calendario manda alla pagina quando la prenotazione è fatta (API di Calendly).
const EVENTO = 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2'
const INVITATO = `${EVENTO}/invitees/AAAAAAAAAAAAAAAA`

const corpo = (extra: Record<string, unknown> = {}) => ({
  porta: 'attivita',
  risposte: attivita(),
  evento: EVENTO,
  invitato: INVITATO,
  origine: '?da=bio',
  ...extra,
})

test('una prenotazione completa passa, pulita', () => {
  const v = validaPrenotazione(corpo())
  assert.equal(v.ok, true)
  if (!v.ok) return
  assert.equal(v.p.porta, 'attivita')
  assert.equal(v.p.risposte.dolore, 'rispondere a tutti su WhatsApp la sera')
  assert.equal(v.p.evento, EVENTO)
  assert.equal(v.p.invitato, INVITATO)
  assert.equal(v.p.origine, '?da=bio')
})

test('una risposta che non è fra le opzioni, o che manca, non passa; la frase libera si può saltare', () => {
  assert.deepEqual(validaPrenotazione(corpo({ risposte: attivita({ ore: 'Mille' }) })), { ok: false, errore: 'Rispondi a tutte le domande.' })
  const { quando: _quando, ...senzaQuando } = attivita()
  assert.deepEqual(validaPrenotazione(corpo({ risposte: senzaQuando })), { ok: false, errore: 'Rispondi a tutte le domande.' })
  const { dolore: _dolore, ...senzaFrase } = attivita()
  const v = validaPrenotazione(corpo({ risposte: senzaFrase }))
  assert.equal(v.ok, true)
  if (v.ok) assert.equal('dolore' in v.p.risposte, false)
})

test('nelle scelte multiple restano le opzioni vere, senza doppioni, fino a due', () => {
  const v = validaPrenotazione(
    corpo({
      risposte: attivita({
        tempo: ['Fatture e amministrazione', 'Fatture e amministrazione', 'Inventata', 'Altro', 'Preventivi, documenti e pratiche'],
      }),
    }),
  )
  assert.equal(v.ok, true)
  if (v.ok) assert.deepEqual(v.p.risposte.tempo, ['Fatture e amministrazione', 'Altro'])
})

test('le risposte che la strada non chiede si buttano: da solo niente ruolo, niente chiavi inventate', () => {
  const v = validaPrenotazione(corpo({ risposte: { ...attivita({ persone: 'Lavoro da solo' }), pippo: 'ciao' } }))
  assert.equal(v.ok, true)
  if (!v.ok) return
  assert.equal('ruolo' in v.p.risposte, false)
  assert.equal('pippo' in v.p.risposte, false)
})

test('la strada imparare passa, e l\'edilizia non arriva mai al server', () => {
  const v = validaPrenotazione(
    corpo({
      porta: 'imparare',
      risposte: {
        oggi: 'Sono dipendente',
        imparare: ['Creare contenuti e video'],
        livello: 'La uso ogni tanto',
        blocco: 'Non so da dove cominciare',
        oreImparare: 'Da 3 a 5',
        modo: 'Uno a uno, con me accanto',
        investimento: 'Da 500 a 1.500 €',
      },
    }),
  )
  assert.equal(v.ok, true)
  assert.deepEqual(validaPrenotazione(corpo({ risposte: attivita({ lavoro: 'Edilizia: impresa o studio tecnico' }) })), {
    ok: false,
    errore: "Per l'edilizia c'è una consulenza dedicata.",
  })
})

test('porta sbagliata o prenotazione che non viene da Calendly non passano', () => {
  assert.deepEqual(validaPrenotazione(corpo({ porta: 'privato' })), { ok: false, errore: 'Scegli da dove parti.' })
  assert.deepEqual(validaPrenotazione('niente'), { ok: false, errore: 'Scegli da dove parti.' })
  const manca = { ok: false, errore: 'Manca la prenotazione.' }
  assert.deepEqual(validaPrenotazione(corpo({ invitato: undefined })), manca)
  assert.deepEqual(validaPrenotazione(corpo({ evento: 'https://example.com/scheduled_events/X' })), manca)
  assert.deepEqual(validaPrenotazione(corpo({ invitato: 'https://api.calendly.com/scheduled_events/ALTRO/invitees/AAAA' })), manca)
})

test('il riepilogo per Raffaele: la porta in cima, una riga per risposta e il conto dopo il valore dell\'ora', () => {
  const v = validaPrenotazione(corpo())
  assert.ok(v.ok)
  const righe = righeRiepilogo(v.p.porta, v.p.risposte)
  assert.deepEqual(righe[0], ['Da dove parte', "Ha un'attività o lavora in proprio"])
  const etichette = righe.map(([k]) => k)
  assert.equal(etichette.indexOf('Il conto'), etichette.indexOf("Valore di un'ora") + 1)
  assert.ok(righe.some(([k, val]) => k === 'Il conto' && val === "circa 370 ore l'anno, circa 13.000 €"))
  assert.ok(righe.some(([k, val]) => k === 'Da togliere per primo' && val === '«rispondere a tutti su WhatsApp la sera»'))
  assert.equal(JSON.stringify(righe).includes('undefined'), false)
})

test('il testo che arriva nel calendario lo vede anche chi prenota: le sue risposte, senza il conto', () => {
  const testo = testoCalendly('attivita', attivita())
  assert.match(testo, /^Da dove parte: Ha un'attività o lavora in proprio\n/)
  assert.ok(testo.includes('Da togliere per primo: «rispondere a tutti su WhatsApp la sera»'))
  assert.equal(testo.includes('Il conto'), false)
  assert.equal(/ore l'anno/.test(testo), false)
  assert.ok(testoCalendly('attivita', attivita({ dolore: 'x'.repeat(400), lavoro: 'Altro', lavoroAltro: 'y'.repeat(80) })).length <= 1000)
})

test('il calendario nella pagina: parla con la pagina, nasconde i dettagli già detti, porta le risposte; vuoto senza evento', () => {
  const link = linkCalendly('https://calendly.com/esempio/consulenza', 'attivita', attivita(), 'raffaelerussoai.com')
  const u = new URL(link)
  assert.equal(u.origin + u.pathname, 'https://calendly.com/esempio/consulenza')
  assert.equal(u.searchParams.get('embed_domain'), 'raffaelerussoai.com')
  assert.equal(u.searchParams.get('embed_type'), 'Inline')
  assert.equal(u.searchParams.get('hide_event_type_details'), '1')
  assert.equal(u.searchParams.get('a1'), testoCalendly('attivita', attivita()))
  assert.equal(u.searchParams.has('name'), false)
  assert.equal(linkCalendly('', 'attivita', attivita(), 'raffaelerussoai.com'), '')
})
