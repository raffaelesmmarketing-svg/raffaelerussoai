# montaggio-video · la skill gratuita di Raffaele Russo

Una skill per Claude Code che monta i video in cui parli in camera: tu registri, Claude fa il resto. Toglie le pause e
le prese sbagliate, accelera, cambia lo zoom a ogni taglio, mette le scritte con la parola chiave, i sottotitoli, la
musica sotto la voce, i capitoli per YouTube, e porta l'audio al livello delle piattaforme. Video verticali (Reel,
TikTok, Shorts) e orizzontali (YouTube). Impara dalle tue correzioni: ognuna diventa una regola in `REGOLE.md`.

**Come si installa:** in Claude Code, sul tuo computer, scrivi «Installa la skill che trovi in questa cartella e segui
INSTALLA.md». La guida passo passo, con i consigli per registrare, si scarica da raffaelerussoai.com.

**Cosa c'è dentro**
- `SKILL.md` · il metodo che Claude segue a ogni video
- `INSTALLA.md` · i passi della prima volta (strumenti gratuiti e le tue preferenze)
- `REGOLE.md` · le regole di base e le tue correzioni
- `PREFERENZE.json` · formato, velocità, colori, carattere, i nomi da scrivere giusti, la musica
- `attrezzi/` · `trascrivi.py` (trascrizione sul tuo computer), `taglia.py` (tagli, velocità, formato), `componi.py` e
  `modello.html` (zoom, scritte, sottotitoli, musica e il video finito)

**Gli strumenti che usa**, tutti gratuiti: ffmpeg, Python, faster-whisper (trascrizione), Node.js e HyperFrames
(composizione del video). Serve l'abbonamento a Claude con Claude Code.

Versione 1.0 · 14/10/2026 · provata su un reel registrato con l'iPhone (HDR) e su un video lungo in 4K.
Gratis, da usare per i tuoi video. — Raffaele Russo · raffaelerussoai.com · Instagram @raffaelerusso.ai
