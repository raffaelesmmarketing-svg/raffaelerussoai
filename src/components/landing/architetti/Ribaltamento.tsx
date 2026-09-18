import Rise from './Rise'
import { Quota } from './Tavola'

export default function Ribaltamento() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid md:grid-cols-[5fr_7fr] gap-10 md:gap-16 items-start">
        <Rise>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            «Impara l’AI» è il consiglio che ti ha <em className="em-lime">bloccato</em>.
          </h2>
        </Rise>

        <Rise delay={0.1} className="font-body text-[17px] leading-[1.7] text-fog-300 max-w-[62ch]">
          <p>Te l’hanno detto tutti. Studia i prompt. Impara gli strumenti. Aggiornati.</p>
          <p className="mt-4 text-fog-100 font-semibold">
            È il consiglio peggiore che potessero darti, perché mette lo strumento al centro invece del tuo lavoro.
          </p>
          <p className="mt-4">
            L’intelligenza artificiale non si studia: <strong className="text-white font-semibold">si monta</strong>. Dentro le
            cose che rifai identiche. Si prende una cosa che fai ogni settimana, si conta quanto ci metti, si costruisce
            il pezzo che la fa in un decimo, si prova sul tuo caso vero.
          </p>
          <p className="mt-4">
            È noioso, è metodico, e nessuno te lo insegna — perché «una cosa alla volta» vende molto meno di «diventa
            esperto di AI in 30 giorni».
          </p>

          <p className="mt-8">
            Poi c’è la seconda parte del blocco: anche sapendo cosa montare, pensi di non saperlo fare.
          </p>
          <p className="mt-4 text-fog-100 font-semibold">E qui è dove il mondo è cambiato davvero.</p>
          <p className="mt-4">
            Fino a due anni fa servivano competenze tecniche vere, o soldi per pagarle. Oggi gli strumenti si usano dal
            browser, come una chat. E l’intelligenza artificiale nel lavoro del professionista è ammessa e regolata come
            strumento di supporto: la responsabilità resta tua, l’uso è legittimo.
          </p>
          <p className="mt-4">
            La barriera tecnica è crollata. È rimasta quella della direzione. Ed è esattamente il pezzo che ti manca.
          </p>
        </Rise>
      </div>

      <Rise delay={0.05} className="max-w-[1200px] mx-auto px-6 sm:px-8 mt-20 sm:mt-28">
        <Quota etichetta="da qui in poi" className="max-w-[320px]" />
        <p
          className="font-display font-extrabold tracking-[-0.025em] leading-[1.05] text-white mt-8 max-w-[18ch] text-balance"
          style={{ fontSize: 'clamp(34px, 5vw, 64px)' }}
        >
          Partiamo da quello che rifai. <span className="text-fog-500">Non da quello che dovresti imparare.</span>
        </p>
      </Rise>
    </section>
  )
}
