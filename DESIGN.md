# Design

Sistema visivo estratto dal codice (`src/app/globals.css`, componenti in `src/components`).

## Theme
Scuro. Sfondo a gradiente fisso nero → navy (`linear-gradient(160deg, #000 0%, #050d1f 45%, #0d1c47 100%)`). Un solo accento: lime `#b8ff3d`, usato per enfasi (`.em-lime` = corsivo lime extrabold), bottoni pieni e dettagli. Strategia colore: committed su singole sezioni (una sezione può essere interamente lime con testo navy), restrained altrove.

## Colors
- navy-950 `#050d1f` · navy-900 `#08132e` · navy-800 `#0d1c47` (superfici) · navy-700 `#142a63` · navy-600 `#1f3a82` · navy-500 `#2a4ea3`
- lime-500 `#b8ff3d` · lime-400 `#c8ff5e` · lime-600 `#9fe61f`
- fog-100 `#e6ecf5` (testo principale chiaro) · fog-300 `#aab6cc` (corpo) · fog-500 `#6b7a96` (solo etichette/decorazioni)
- Bordi: `white/[0.08]`. Superfici: `bg-navy-800` con bordo.

## Typography
- Display e body: Manrope (400–800), `--font-display` / `--font-body`. Titoli extrabold, tracking −0.02em, `clamp()` fluido (hero fino a 96px). Corpo 15–19px, line-height 1.6–1.7.
- Mono: JetBrains Mono (400, 700) per etichette tecniche (eyebrow, cartigli, meta). Non per il corpo.
- Corsivo lime = enfasi di marca nei titoli.

## Components
- Bottone primario: pillola lime, testo navy uppercase extrabold 13–14px tracking 0.06em, `shadow-glow-lime`, `.cta-shimmer` al hover, freccia `→` che scorre.
- Bottone secondario: pillola con bordo `white/20`, hover bordo lime.
- FAQ: accordion con `+` che ruota, bordo inferiore `white/[0.08]`.
- Reveal: fade + 28px dal basso, ease `[0.22,1,0.36,1]`, 0.7s, once.
- Header fisso con blur allo scroll.

## Layout
Contenitore 1200px, padding 32px. Sezioni `py-32` separate da `border-t border-white/[0.08]`. Griglie 2 colonne asimmetriche (2fr/3fr) per titolo + contenuto.

## Motion
Ease-out morbida `cubic-bezier(0.22,1,0.36,1)`; durate 120/220/420ms; stagger 0.1–0.12s nelle liste. Rispettare `prefers-reduced-motion`.
