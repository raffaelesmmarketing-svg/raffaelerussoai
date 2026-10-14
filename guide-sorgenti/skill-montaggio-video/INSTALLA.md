# Installare la skill (una volta sola)

Claude: segui questi passi in ordine, uno alla volta, e di' all'utente cosa stai facendo con parole semplici. Se un
comando chiede la password del computer o un clic dell'utente, fermati e spiegagli esattamente cosa fare. La password
si scrive solo nel Terminale, mai nella chat.

`SKILL` = la cartella di questa skill (di solito `~/.claude/skills/montaggio-video`).
**Se la skill c'era già** (è un aggiornamento): `REGOLE.md`, `PREFERENZE.json`, `musica/` e `.venv` sono dell'utente e
non stanno nello zip. Non cancellarli, e salta le domande del passo 4.

## 1. Gli strumenti
Servono tre programmi gratuiti: **ffmpeg** (lavora i video), **Python 3** (fa girare gli attrezzi), **Node.js** (fa
girare HyperFrames, che compone il video). Controlla quali ci sono già:
`ffmpeg -version` · `python3 --version` (su Windows `python --version`) · `node --version`
⛔ Node.js deve essere **almeno la 22**: HyperFrames sotto non parte. Python almeno la 3.9.

Quelli che mancano, o Node.js più vecchio della 22:
- **Mac**: serve Homebrew. Se né `brew --version` né `/opt/homebrew/bin/brew --version` rispondono, l'utente lo installa
  da solo nel Terminale, perché chiede la sua password. Dagli il comando di https://brew.sh e spiegagli: il Terminale si
  apre con Cmd + barra spaziatrice, «Terminale», Invio; si incolla con Cmd + V e si preme Invio; mentre scrive la
  password non compare niente, nemmeno i puntini, ed è normale; se chiede di premere Invio per continuare, lo preme.
  Aspetta che ti dica «fatto». Poi fai tu i «Next steps» che Homebrew stampa alla fine (sui Mac con chip Apple):
  `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile`. Finché Claude non viene riaperto, metti davanti ai
  tuoi comandi `export PATH="/opt/homebrew/bin:$PATH";`
  Poi: `brew install ffmpeg node python` (se Node.js c'è ma è vecchio: `brew upgrade node`).
- **Windows**: `winget install --id Gyan.FFmpeg -e` · `winget install --id OpenJS.NodeJS.LTS -e` ·
  `winget install --id Python.Python.3.12 -e` (Node.js vecchio: `winget upgrade --id OpenJS.NodeJS.LTS -e`). Alle
  finestre «Vuoi consentire a questa app di apportare modifiche?» l'utente risponde Sì. I programmi nuovi si vedono
  solo riaprendo Claude: chiedi all'utente di chiudere e riaprire l'app e di scrivere «continua a installare la skill
  di montaggio video»; poi riparti da qui, controllando cosa c'è già.

Gli attrezzi della skill cercano ffmpeg e Node.js anche nelle cartelle di Homebrew e di winget, quindi funzionano anche
prima che Claude venga riaperto.

## 2. L'ambiente della skill
Crea un ambiente Python solo per la skill (non tocca niente del resto del computer) e installa il trascrittore:
- Mac: `python3 -m venv SKILL/.venv` poi `SKILL/.venv/bin/python -m pip install --upgrade pip "faster-whisper==1.2.1"`
- Windows: `python -m venv SKILL\.venv` poi `SKILL\.venv\Scripts\python.exe -m pip install --upgrade pip "faster-whisper==1.2.1"`
  (la versione provata con questa skill: una più nuova potrebbe cambiare)

Prova: `SKILL/.venv/bin/python -c "import faster_whisper; print('ok')"` (su Windows con `Scripts\python.exe`).
Poi scarica una volta il modello che trascrive (circa 1,5 GB: lancialo in background e intanto vai avanti):
`SKILL/.venv/bin/python -c "from faster_whisper import WhisperModel; WhisperModel('medium', device='cpu', compute_type='int8')"`

## 3. HyperFrames
`npx --yes hyperframes@0.8.157 doctor`: la prima volta scarica i suoi pezzi (qualche minuto), poi controlla il
computer. Per questa skill contano solo **Node.js, FFmpeg, FFprobe e Chrome**: devono avere la spunta. Gli altri
(whisper-cpp, TTS, BGM, Docker) sono facoltativi e qui non servono: non installarli. Se Chrome non ha la spunta:
`npx --yes hyperframes@0.8.157 browser ensure` (lo scarica, qualche minuto).

## 4. Le preferenze
Se `SKILL/PREFERENZE.json` c'è già, salta questo passo. Altrimenti copia `SKILL/PREFERENZE.esempio.json` in
`SKILL/PREFERENZE.json`, poi fai all'utente queste domande, **una alla volta**, e scrivi le risposte lì. Se a una domanda
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

## 5. Le regole dell'utente
Se `SKILL/REGOLE.md` non c'è, crealo con queste righe (qui Claude scriverà ogni correzione dell'utente):

```
# Le mie regole di montaggio

Ogni correzione che do a Claude diventa una regola qui, con la data e il perché. Valgono più delle regole di base.
```

## 6. Pronto
Di' all'utente: «Pronto. Mandami il primo video: trascinalo qui, oppure dimmi dove si trova, e dimmi se è verticale o
orizzontale.» Da qui in poi si segue **SKILL.md**.
