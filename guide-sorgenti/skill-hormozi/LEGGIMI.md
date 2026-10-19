# Le 8 skill di Hormozi per Claude (e ChatGPT)

Pacchetto gratuito di Raffaele Russo AI · raffaelerussoai.com · versione 1.0 (ottobre 2026)

Otto skill costruite leggendo 13 manuali di Alex Hormozi (463 pagine). Ogni cartella è una skill: dentro c'è `SKILL.md`,
le istruzioni, e `riferimenti/`, le 16 pagine di regole che la skill legge **prima** di rispondere. Le pagine sono
riscritte con parole nostre: i libri di Hormozi non sono qui dentro, sono suoi. Le skill non sono di Hormozi e non sono
approvate da lui.

| Skill | Cosa fa |
|---|---|
| `hormozi-offerta` | costruisce l'offerta irresistibile: valore, bonus, garanzia, scarsità vera, nome, prezzo |
| `hormozi-prezzo` | analizza il prezzo e dice come alzare il profitto, coi conti |
| `hormozi-obiezioni` | allena chi vende sulle obiezioni: risposte parola per parola e simulazioni |
| `hormozi-hook` | scrive 30-50 ganci per pubblicità, reel, post e mail |
| `hormozi-controllo` | controlla un'offerta, una pagina o uno script e dà le 3 correzioni che contano |
| `hormozi-anti-no-show` | fa presentare più persone agli appuntamenti fissati |
| `hormozi-cassa` | la campagna di 7 giorni per fare cassa in fretta coi clienti più caldi |
| `hormozi-prova` | trasforma i risultati dei clienti in testimonianze che vendono |

## Claude Code
Copia le 8 cartelle `hormozi-…` in `~/.claude/skills/` (su Windows `%USERPROFILE%\.claude\skills\`), poi chiudi e
riapri Claude Code. Si chiamano con la barra: `/hormozi-offerta`, `/hormozi-prezzo` e così via.
Oppure scrivi a Claude Code: «Installa le skill di questa cartella in ~/.claude/skills e dimmi come si chiamano».

## L'app di Claude (Claude.ai o Claude Desktop)
Nella cartella `per-app-claude/` c'è uno zip per ogni skill. Su Claude: Customize › Skills › + Create skill ›
Upload a skill, e carichi gli zip uno alla volta.

## ChatGPT (va bene anche il piano gratuito)
Nella cartella `per-chatgpt/` c'è un file per ogni skill, con le istruzioni e le pagine di regole tutte dentro.
Su ChatGPT crea un Progetto (uno per skill), carica nei file del Progetto il file della skill che ti serve, e nelle
istruzioni del Progetto scrivi: «Segui le istruzioni del file hormozi-… che ti ho caricato, e leggi le sue pagine di
regole prima di rispondere». Poi scrivi la tua richiesta in una chat dentro il Progetto.
