# La skill gratuita montaggio-video: come si aggiorna

La sorgente della skill che regala la guida «I tuoi video montati da Claude, come i miei» (14/10/2026). Questa cartella
NON si serve (sta fuori da public/): online va lo zip `public/guide/skill-montaggio-video-6f6e8594cc27.zip`, che la guida
cita per nome.

1. Si cambia qui (SKILL.md, INSTALLA.md, LEGGIMI.md, PREFERENZE.esempio.json, attrezzi/).
   ⛔ Nello zip NON vanno `REGOLE.md` e `PREFERENZE.json`: sono dell'utente (li crea INSTALLA), e chi aggiorna scompatta
   sopra la cartella di prima. Le regole di base stanno in SKILL.md. (Dalla 1.1: nella 1.0 c'erano, e un aggiornamento
   le avrebbe cancellate.)
2. Si prova su un video vero, verticale e orizzontale (trascrivi → taglia → componi --bozza → componi), guardando i
   fotogrammi. Se si tocca taglia.py: anche un video di prova lungo con tanti tagli, per vedere che i tempi non
   scivolano (`../prove-skill-montaggio/`: bip e lampi a tempi noti, 300 pezzi; lo scarto deve restare fermo dal primo
   all'ultimo taglio).
3. Si rifà lo zip con lo STESSO nome, da una cartella che contiene `montaggio-video/` (questa cartella copiata con quel
   nome, senza COME-SI-AGGIORNA.md):
   `zip -r -X skill-montaggio-video-6f6e8594cc27.zip montaggio-video -x "*/.venv/*" "*/__pycache__/*" "*.pyc" "*/.DS_Store"`
4. Si aggiorna «Versione» in LEGGIMI.md, si ristampa la guida se è cambiata
   (`PLAYWRIGHT_DIR=~/Desktop/SVILUPPO/citta-ch node scripts/stampa-guide.mjs montaggio-video-con-claude`), si fa il
   commit e `vercel deploy --prod --yes`.

Storia: 1.0 (14/10, provata da un Claude Code nuovo che ha seguito solo la guida, e letta da un imprenditore finto).
1.1 (14/10 sera, dal controllo dei fatti): tagli a metà fra due fotogrammi (prima i tempi scivolavano di 0,75 s ogni
150 tagli), oltre i 40 pezzi il taglio va a blocchi (prima cresceva col quadrato: 400 pezzi = 24 minuti), Node.js 22,
Windows (caratteri e trascrizione sul processore), zoom secchi che non si moltiplicano, capitoli oltre l'ora, video
senza audio, regole e preferenze fuori dallo zip. Provata su un Mac (M4): reel iPhone HDR, orizzontale 4K, video di
prova di 12 minuti con 300 tagli. Windows: istruzioni scritte, mai provata.
