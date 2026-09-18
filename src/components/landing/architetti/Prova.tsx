import Cta from './Cta'
import Rise from './Rise'

// Tre bozze vere, generate con i dati di un caso di prova. Sono fogli, non schermate finte:
// quello che si legge è l'output, e sotto ogni foglio c'è scritto cosa resta del professionista.
const fogli = [
  {
    tipo: 'Messaggio al cliente',
    prima:
      'Stato pratica: CILA protocollata il 12 settembre. Il Comune chiede un’integrazione: manca l’attestato di prestazione energetica dello stato di fatto. Sopralluogo del termotecnico giovedì alle 10. Cliente: sig.ra Bianchi.',
    dopo: [
      'Gentile signora Bianchi,',
      'le scrivo per aggiornarla sulla pratica. La comunicazione di inizio lavori è stata protocollata il 12 settembre: è la conferma che il Comune l’ha ricevuta.',
      'Ci hanno chiesto un documento in più, l’attestato energetico dell’appartamento com’è oggi. Non è un problema e non ferma nulla: il tecnico che lo redige passa giovedì alle 10, servono circa quaranta minuti e lei non deve preparare niente.',
      'Appena lo consegniamo, la pratica riprende il suo corso. La aggiorno io a quel punto.',
      'Un saluto cordiale,',
    ],
    tuo: 'Il tono, la firma, e il clic su «invia».',
  },
  {
    tipo: 'Relazione tecnica — stralcio',
    prima:
      'Modello dello studio + dati: appartamento al 2° piano, 84 mq. Manutenzione straordinaria interna: demolizione tramezzo cucina–soggiorno, rifacimento bagno, nuovo impianto elettrico. Nessuna modifica a prospetti, strutture, sagoma.',
    dopo: [
      'Oggetto: intervento di manutenzione straordinaria in unità immobiliare a uso residenziale posta al secondo piano, superficie utile 84 mq.',
      'Descrizione delle opere: demolizione del tramezzo non portante fra cucina e soggiorno, con formazione di un unico ambiente; rifacimento del bagno con sostituzione di sanitari, rivestimenti e impianto idrico-sanitario; rifacimento integrale dell’impianto elettrico.',
      'Le opere non interessano le parti strutturali dell’edificio, non modificano i prospetti né la sagoma, non comportano aumento di superficie o di volume né cambio di destinazione d’uso.',
      '[Conformità urbanistica, riferimenti normativi e asseverazione: da compilare e verificare dal tecnico.]',
    ],
    tuo: 'La verifica, l’asseverazione, la firma.',
  },
  {
    tipo: 'Disciplinare — le prestazioni',
    prima:
      'Incarico: ristrutturazione appartamento 84 mq. Progetto, pratica edilizia, direzione lavori. Preset dello studio.',
    dopo: [
      '1. Rilievo dello stato di fatto e restituzione grafica.',
      '2. Progetto di massima con due ipotesi distributive e una revisione.',
      '3. Progetto esecutivo: piante, sezioni, abaco, schemi impianti.',
      '4. Predisposizione e presentazione della pratica edilizia al Comune, incluse le integrazioni richieste.',
      '5. Direzione lavori con sopralluoghi settimanali e verbale.',
      '6. Assistenza alla scelta di materiali e finiture, fino a tre incontri con i fornitori.',
      'Escluso: pratiche catastali di fine lavori, certificazioni impiantistiche, collaudi.',
      'Compenso: [        ] — lo decide il professionista.',
    ],
    tuo: 'Il compenso, le esclusioni, la firma.',
  },
]

export default function Prova() {
  return (
    <section className="py-24 sm:py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <Rise className="max-w-[760px]">
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            Non credermi sulla parola. <em className="em-lime">Leggi.</em>
          </h2>
          <p className="font-body text-[17px] leading-[1.7] text-fog-300 mt-5 max-w-[62ch]">
            Tre bozze vere, generate su un caso di prova. Sopra c’è quello che gli ho dato; sotto, quello che è uscito.
            In fondo, cosa resta tuo.
          </p>
        </Rise>

        <div className="mt-12 grid lg:grid-cols-3 gap-6">
          {fogli.map((f, i) => (
            <Rise key={f.tipo} delay={0.08 * i} className="flex">
              <article className="flex flex-col w-full">
                <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-fog-300">
                  <span className="text-lime-500">Prima</span> · cosa gli ho dato
                </div>
                <p className="font-body text-[14px] leading-[1.6] text-fog-300 mt-2 text-pretty">{f.prima}</p>

                <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-fog-300 mt-6">
                  <span className="text-lime-500">Dopo</span> · cosa è uscito
                </div>
                {/* Il foglio: chiaro su scuro, come un documento appoggiato sulla tavola. */}
                <div className="mt-2 flex-1 rounded-md bg-fog-100 text-navy-900 px-5 py-5 shadow-pop">
                  <div className="flex items-baseline justify-between gap-3 border-b border-navy-900/15 pb-2.5">
                    <span className="font-display font-extrabold text-[13px] tracking-[-0.01em]">{f.tipo}</span>
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-navy-900/60">Bozza</span>
                  </div>
                  <div className="mt-3 space-y-2.5 font-body text-[13.5px] leading-[1.6] text-navy-900/90">
                    {f.dopo.map((r, j) => (
                      <p key={j} className="text-pretty">
                        {r}
                      </p>
                    ))}
                  </div>
                </div>

                <p className="font-body text-[14px] leading-[1.6] text-fog-300 mt-4">
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-lime-500 mr-2">Resta tuo</span>
                  {f.tuo}
                </p>
              </article>
            </Rise>
          ))}
        </div>

        <Rise className="mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <p className="font-body text-[15px] leading-[1.6] text-fog-300 max-w-[52ch]">
            Le testimonianze arriveranno dai primi cinque percorsi. Finché non ci sono, qui non le leggi.
          </p>
          <Cta />
        </Rise>
      </div>
    </section>
  )
}
