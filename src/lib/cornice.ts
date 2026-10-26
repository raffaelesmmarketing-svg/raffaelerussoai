// Le pagine senza la cornice del sito (intestazione, piè di pagina, banner dei cookie, tasti in basso): chi arriva deve
// trovare una cosa sola da fare. /consulenza (26/10/2026): la candidatura del link in bio, una pagina sola; non carica
// niente di terzi (Calendly si apre fuori, con un tocco), quindi il banner dei cookie lì non serve.
export const senzaCornice = (percorso: string) => percorso === '/consulenza' || percorso.startsWith('/consulenza/')
