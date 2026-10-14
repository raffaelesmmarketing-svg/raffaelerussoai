# montaggio-video · la skill gratuita di Raffaele Russo

Una skill per Claude Code che monta i video in cui parli in camera: tu registri, Claude fa il resto. Toglie le pause e
le prese sbagliate, accelera, cambia lo zoom a ogni taglio, mette le scritte con la parola chiave, i sottotitoli, la
musica sotto la voce, i capitoli per YouTube, e porta l'audio al livello delle piattaforme. Video verticali (Reel,
TikTok, Shorts) e orizzontali (YouTube). Impara dalle tue correzioni: ognuna diventa una regola in `REGOLE.md`.

**Come si installa:** in Claude Code, sul tuo computer, scrivi «Installa la skill che trovi in questa cartella e segui
INSTALLA.md». La guida passo passo, con i consigli per registrare, si scarica da raffaelerussoai.com.

**Come si aggiorna:** scompatta lo zip nuovo sopra la cartella di prima, senza cancellarla. Le tue regole (`REGOLE.md`),
le tue preferenze (`PREFERENZE.json`) e la tua musica (`musica/`) non stanno nello zip: restano come sono.

**Cosa c'è dentro**
- `SKILL.md` · il metodo che Claude segue a ogni video, con le regole di base
- `INSTALLA.md` · i passi della prima volta (strumenti gratuiti e le tue preferenze)
- `PREFERENZE.esempio.json` · il modello delle preferenze: formato, velocità, colori, carattere, i nomi da scrivere
  giusti, la musica
- `attrezzi/` · `trascrivi.py` (trascrizione sul tuo computer), `taglia.py` (tagli, velocità, formato), `componi.py` e
  `modello.html` (zoom, scritte, sottotitoli, musica e il video finito), `comune.py` (quello che serve a tutti e tre)

Con l'installazione nascono `PREFERENZE.json` (le tue scelte) e `REGOLE.md` (le tue correzioni, che valgono più delle
regole di base).

**Gli strumenti che usa**, tutti gratuiti: ffmpeg, Python, faster-whisper (trascrizione), Node.js 22 o più nuovo e
HyperFrames (composizione del video). Serve l'abbonamento a Claude con Claude Code.

Versione 1.1 · 14/10/2026 · provata su un Mac con un reel girato con l'iPhone (HDR), un video orizzontale in 4K e un
video di prova di 12 minuti con 300 tagli. Su Windows le istruzioni ci sono, ma non è ancora stata provata.
Novità della 1.1: i tempi di scritte e sottotitoli non scivolano più nei video con tanti tagli; i video lunghi si
tagliano molto più in fretta; Node.js almeno la 22; su Windows niente più errori sui caratteri speciali e trascrizione
sul processore; i comandi lunghi in background; le tue regole e preferenze restano anche quando aggiorni.

Gratis, da usare per i tuoi video. — Raffaele Russo · raffaelerussoai.com · Instagram @raffaelerusso.ai
