# Installare la skill (una volta sola)

Claude: segui questi passi in ordine, uno alla volta, e di' all'utente cosa stai facendo con parole semplici. Se un
comando chiede la password del computer o un clic dell'utente, fermati e spiegagli esattamente cosa fare.

`SKILL` = la cartella di questa skill (di solito `~/.claude/skills/montaggio-video`).

## 1. Gli strumenti
Servono tre programmi gratuiti: **ffmpeg** (lavora i video), **Python 3** (fa girare gli attrezzi), **Node.js** (fa
girare HyperFrames, che compone il video). Controlla quali ci sono già:
`ffmpeg -version` · `python3 --version` (su Windows `python --version`) · `node --version`

Quelli che mancano:
- **Mac**: serve Homebrew. Se `brew --version` non risponde, l'utente lo installa da solo nel Terminale (chiede la sua
  password): dagli il comando di https://brew.sh e aspetta che ti dica «fatto». Poi: `brew install ffmpeg node python`.
- **Windows**: `winget install --id Gyan.FFmpeg -e` · `winget install --id OpenJS.NodeJS.LTS -e` ·
  `winget install --id Python.Python.3.12 -e`. Poi l'utente chiude e riapre Claude, così i programmi si vedono.
- Node.js deve essere almeno la versione 18; Python almeno la 3.9.

## 2. L'ambiente della skill
Crea un ambiente Python solo per la skill (non tocca niente del resto del computer) e installa il trascrittore:
- Mac: `python3 -m venv SKILL/.venv` poi `SKILL/.venv/bin/python -m pip install --upgrade pip "faster-whisper==1.2.1"`
- Windows: `python -m venv SKILL\.venv` poi `SKILL\.venv\Scripts\python.exe -m pip install --upgrade pip "faster-whisper==1.2.1"`
  (la versione provata con questa skill: una più nuova potrebbe cambiare)

Prova: `SKILL/.venv/bin/python -c "import faster_whisper; print('ok')"` (su Windows con `Scripts\python.exe`).

## 3. HyperFrames
`npx --yes hyperframes@0.8.157 --version`. La prima volta scarica i suoi pezzi: può volerci qualche minuto.

## 4. Le preferenze
Fai all'utente queste domande, **una alla volta**, e scrivi le risposte in `SKILL/PREFERENZE.json`. Se a una domanda
risponde «scegli tu» o «non so», lascia il valore che c'è (per il colore puoi chiedergli il link del suo sito o una foto
del logo e prenderlo da lì). La musica: chiedigli di trascinare il file nella chat, poi copialo in `SKILL/musica/`.
1. Che video fai di più: **verticali** (Reel, TikTok, Shorts) o **orizzontali** (YouTube)? → `formato`
2. Velocità: di solito 1,1 per i lunghi e 1,2 per i verticali (si parla un po' più svelti, si guarda fino in fondo). Va
   bene così? → `velocita_verticale`, `velocita_orizzontale`
3. Il colore della parola accesa nelle scritte (quello del tuo marchio, per esempio #FFD400)? → `colore_accento`
4. Il carattere fra Inter, Montserrat, Poppins, Roboto, Open Sans, Lato, Outfit, Space Grotesk? → `carattere`
5. I nomi che dici spesso e vanno scritti giusti (il tuo nome, la tua azienda, i prodotti, gli strumenti)? → `parole`,
   separati da virgole
6. Una musica di sottofondo senza diritti che ti piace (un file sul computer), o niente? → `musica`

## 5. Pronto
Di' all'utente: «Pronto. Mandami il primo video: trascinalo qui, oppure dimmi dove si trova, e dimmi se è verticale o
orizzontale.» Da qui in poi si segue **SKILL.md**.
