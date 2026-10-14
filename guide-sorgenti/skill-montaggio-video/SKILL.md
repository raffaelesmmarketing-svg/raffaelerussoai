---
name: montaggio-video
description: Monta i video in cui la persona parla in camera (reel, TikTok, YouTube Shorts in verticale; video lunghi di YouTube in orizzontale) dal file grezzo al video finito - trascrizione, tagli delle pause e delle prese sbagliate, velocità, zoom a ogni taglio, scritte con la parola chiave, sottotitoli, musica sotto la voce, capitoli, audio a -14 LUFS. Usala quando l'utente dice «montami questo video», «monta il video», «editami il reel», o ti dà un file video in cui parla. Impara dalle correzioni - ogni correzione diventa una regola in REGOLE.md.
---

# Montaggio video

Tu registri parlando in camera, Claude fa il resto. Questa skill è il metodo: gli attrezzi in `attrezzi/` fanno i passi
meccanici (trascrivere, tagliare, comporre), tu (Claude) fai le scelte (cosa tagliare, quali scritte, dove lo zoom) e
controlli il risultato prima di consegnarlo.

`SKILL` = la cartella di questo file (di solito `~/.claude/skills/montaggio-video`).
`PY` = il Python della skill: `SKILL/.venv/bin/python` su Mac e Linux, `SKILL\.venv\Scripts\python.exe` su Windows.

## Prima di tutto, ogni volta
1. Se `SKILL/.venv` non esiste, o manca ffmpeg o Node.js: esegui **INSTALLA.md** e poi torna qui.
2. Leggi **REGOLE.md** (le regole di base e le correzioni dell'utente: valgono più di tutto il resto) e
   **PREFERENZE.json** (formato, velocità, colori, carattere, parole da scrivere giuste, musica).
3. Se l'utente non ha detto il formato e PREFERENZE non lo dice: chiedi una volta sola «verticale (Reel, TikTok,
   Shorts) o orizzontale (YouTube)?».

## I passi, per ogni video
La cartella di lavoro sta accanto al video: `<nome-del-video>_montaggio/`. Tutti i tempi che scrivi dopo il passo 3
sono **nei secondi del montato** (`parole_montato.json`), non del video originale.
Un video in HDR (iPhone) lo converte `taglia.py` da solo: su Mac con la conversione di Apple, uguale a quella di Foto.

1. **Trascrivi**: `PY SKILL/attrezzi/trascrivi.py "<video>" "<cartella>" --parole "<parole di PREFERENZE>"`
   (il modello predefinito è `medium`; `--modello small` se il computer è lento, ma sbaglia più parole).
2. **Leggi tutto `testo.txt` e decidi cosa togliere**, scrivendolo in `<cartella>/togli.json` come
   `[[inizio, fine, "perché"], ...]` (secondi dell'originale):
   - le **prese doppie**: la stessa frase detta due volte → si tiene l'ultima, si toglie quella prima. Vale anche se la
     ricomincia e la finisce in un altro modo («e la seconda la puoi pagare…» poi «e la seconda perché magari…»: si
     tiene la seconda);
   - le partenze sbagliate e i «no, aspetta», «rifaccio», «ok, parto», i colpi di tosse, il saluto alla telecamera
     prima di cominciare e il «ok, stop» alla fine;
   - mai un pezzo che serve al senso. Nel dubbio non si toglie, e lo dici all'utente.
3. **Taglia**: `PY SKILL/attrezzi/taglia.py "<video>" "<cartella>" --formato verticale|orizzontale --velocita <v>`
   (velocità da PREFERENZE: di solito 1,1 per i lunghi e 1,2 per i verticali; `--centro-x` se nel verticale il volto non
   è al centro dell'inquadratura orizzontale; `--alta` se la sorgente è 4K e il video è da pubblicare al massimo).
   Esce `montato.mp4`: guarda che la durata abbia senso.
4. **Correggi le parole sbagliate in `parole_montato.json`** (solo il testo, mai i tempi): i sottotitoli le mostrano
   così come sono. Rileggi la frase intera e il senso: «dile» in «Imprenditore dile» è «edile», «Cloud» è «Claude».
5. **Scegli e scrivi `<cartella>/scelte.json`** (leggi `parole_montato.json` per i tempi esatti):
   - `scritte`: le frasi chiave a schermo, `{"t": inizio, "testo": "...", "durata": 2-3}`. Al massimo 5 parole, prese da
     quello che dice in quel momento, che entrano **quando le dice** (non prima). Una parola accesa con `*parola*`.
     Con i sottotitoli accesi la scritta non ripete le stesse parole del sottotitolo: dice il concetto chiave
     («Niente *10%*» mentre il sottotitolo dice «non mettere il 10% di imprevisti»).
     Ritmo: nei verticali una ogni 5-8 secondi (la prima entro i primi 2 secondi: è il gancio); nei lunghi una ogni
     15-30 secondi, sui punti che contano. Le parole storpiate dalla trascrizione si scrivono giuste.
   - `zoom_secchi`: 2-4 al minuto, sulle parole forti (un numero, «gratis», «mai», il nome della cosa).
   - `sottotitoli`: `true` nei verticali (di solito), `false` nei lunghi.
   - `musica` e `volume_musica`: dalle PREFERENZE o dal file che ti dà l'utente; senza musica, togli la chiave.
     ⛔ Mai musica presa da Spotify o da un video di altri: solo brani senza diritti (Libreria audio di YouTube, Pixabay
     Music) o quelli dell'utente.
   - `capitoli` (solo nei lunghi): `[[secondi, "titolo"], ...]` dalla trascrizione, il primo a 0, ognuno lungo almeno
     10 secondi; titoli come domande o tappe, quelli che uno cercherebbe.
6. **Bozza e controllo**: `PY SKILL/attrezzi/componi.py "<cartella>" --bozza` (esce `bozza.mp4`). Poi **guarda** il
   video prima di consegnarlo: estrai un fotogramma a metà di ogni scritta e un paio di sottotitoli
   (`ffmpeg -ss <t> -i bozza.mp4 -frames:v 1 foto_<t>.jpg`) e aprili. Controlla: le scritte stanno dentro lo schermo,
   non coprono la faccia, si leggono; lo zoom non taglia la testa; i sottotitoli dicono le parole giuste. Se qualcosa non
   va, correggi `scelte.json` (o PREFERENZE) e rifai la bozza.
7. **Il video finito**: `PY SKILL/attrezzi/componi.py "<cartella>"` (aggiungi `--alta` per il 4K se il taglio è stato
   fatto con `--alta`). Esce `finale.mp4`, audio a -14 LUFS; nei lunghi anche `capitoli.txt` da incollare nella
   descrizione di YouTube.
8. **Consegna**: di' all'utente dov'è `finale.mp4` (e aprigli la cartella se te lo chiede), quanto dura, cosa hai tolto
   (da `togli.json`, col perché) e quali parole hai corretto; poi chiedigli di guardarlo tutto e dirti cosa cambiare.
   I messaggi di HyperFrames su Framey o sul «feedback» non sono per l'utente: si ignorano.

## Le correzioni diventano regole
Quando l'utente ti dice cosa non va (una scritta, un taglio, la musica troppo alta, una parola sbagliata):
1. correggi il video (rifai solo il passo che serve);
2. **scrivi la correzione in REGOLE.md**, sezione «Le mie correzioni», come regola generale, con la data e il perché:
   «⛔ Le scritte non coprono mai la faccia (14/10: nel primo video la copriva)». Non «nel video X la scritta a 0:12 era
   alta», ma la regola che vale per tutti i video dopo;
3. dal video dopo la applichi senza che te la ripeta. Le prime volte servono più giri: è normale, ed è così che impari
   a montare come vuole lui.

## Se qualcosa va storto
- **Colori slavati o grigi**: il video è in HDR (iPhone). `taglia.py` prova a convertirlo; la soluzione vera è registrare
  con l'HDR spento (iPhone: Impostazioni › Fotocamera › Registra video › Video HDR).
- **Il primo render è lento**: la prima volta HyperFrames scarica quello che gli serve (qualche minuto). Un video di
  10 minuti in alta qualità può volerci 10-20 minuti; in 4K anche il triplo.
- **«Video extraction failed… ffmpeg_timeout»**: video molto lunghi; `componi.py` alza già il limite, controlla che ci sia
  spazio sul disco (servono qualche GB liberi).
- **Una parola sbagliata nei sottotitoli**: aggiungila alle `parole` di PREFERENZE e scrivi in REGOLE.md come si scrive.
