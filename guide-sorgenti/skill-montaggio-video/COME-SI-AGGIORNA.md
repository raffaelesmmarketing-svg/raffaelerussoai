# La skill gratuita montaggio-video: come si aggiorna

La sorgente della skill che regala la guida «I tuoi video montati da Claude, come i miei» (14/10/2026). Questa cartella
NON si serve (sta fuori da public/): online va lo zip `public/guide/skill-montaggio-video-6f6e8594cc27.zip`, che la guida
cita per nome.

1. Si cambia qui (SKILL.md, INSTALLA.md, REGOLE.md, PREFERENZE.json, attrezzi/).
2. Si prova su un video vero, verticale e orizzontale (trascrivi → taglia → componi --bozza → componi), guardando i fotogrammi.
3. Si rifà lo zip con lo STESSO nome, dalla cartella che contiene `montaggio-video/`:
   `zip -r -X skill-montaggio-video-6f6e8594cc27.zip montaggio-video -x "montaggio-video/.venv/*" "*.pyc"`
   (la cartella dentro lo zip si chiama `montaggio-video`: copiare questa cartella con quel nome prima di zippare).
4. Si aggiorna «Versione» in LEGGIMI.md, si fa il commit e `vercel deploy --prod --yes`.

Provata il 14/10 su un Mac (M4): un reel iPhone HDR (avconvert), un long 4K, e da un Claude Code nuovo che ha seguito solo la
guida (le sue correzioni sono già dentro). Windows: istruzioni scritte, mai provata.
