#!/usr/bin/env python3
"""Il montaggio finito: zoom a ogni taglio, scritte, sottotitoli, musica, e il render con HyperFrames.

  python componi.py <cartella_di_lavoro> [--bozza] [--alta]

Legge dalla cartella i file di taglia.py e scelte.json, che scrive Claude dopo aver letto la trascrizione:
  {
    "scritte":     [{"t": 3.2, "testo": "Tre *errori* da evitare", "durata": 2.5}],   tempi del MONTATO; *parola* = colore
    "zoom_secchi": [12.4, 33.0],          facoltativo: uno zoom di colpo sulle parole forti
    "sottotitoli": true,                  di solito sì per i video verticali, no per i lunghi
    "musica":      "/percorso/brano.mp3", facoltativo: senza, niente musica
    "volume_musica": 0.12,
    "capitoli":    [[0, "Introduzione"], [65.5, "Il primo errore"]]   facoltativo: solo per i video lunghi
  }
Le preferenze fisse (carattere, colori, dov'è il volto) stanno in PREFERENZE.json, accanto a SKILL.md.

--bozza  un render veloce per riguardare (qualità più bassa) → bozza.mp4 · --alta  il master in 4K (serve un taglio
fatto con `taglia.py --alta` da una sorgente 4K).
Scrive: finale.mp4 (audio a -14 LUFS, pronto da pubblicare), capitoli.txt (se ci sono i capitoli), progetto/ (la
composizione HyperFrames: si può aprire e correggere a mano).
"""
import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comune import prepara  # noqa: E402

HYPERFRAMES = "hyperframes@0.8.157"      # la versione provata con questa skill (vuole Node.js 22 o più nuovo)
SKILL = Path(__file__).resolve().parent.parent
PREDEFINITE = {"carattere": "Inter", "colore_testo": "#FFFFFF", "colore_accento": "#FFD400",
               "colore_fondo_scritte": "rgba(0, 0, 0, 0.55)", "volto": "50% 40%", "volume_musica": 0.12,
               "posizione_scritte": "alto"}
CARATTERI = {"Inter", "Montserrat", "Poppins", "Roboto", "Open Sans", "Lato", "Outfit", "Space Grotesk"}


def larghezza_em(t):
    w = 0.0
    for c in t:
        if c == " ":
            w += 0.28
        elif c.isupper():
            w += 0.68
        elif c.isdigit():
            w += 0.6
        elif c.isalpha():
            w += 0.56
        else:
            w += 0.32
    return w * 1.08


def corpo_che_sta(testo, largo, righe, massimo, minimo):
    parole = testo.replace("*", "").split()
    for px in range(massimo, minimo - 1, -2):
        n, riga = 1, 0.0
        for p in parole:
            w = larghezza_em(p) * px
            sp = 0.28 * px if riga else 0
            if riga + sp + w > largo:
                n, riga = n + 1, w
            else:
                riga += sp + w
            if w > largo:
                n = 99
        if n <= righe:
            return px
    return minimo


def html_scritta(testo):
    """*parola* → colore d'accento; ogni parola in uno span che entra da sola; la punteggiatura resta attaccata."""
    out, acc = [], False
    for pezzo in re.split(r"(\*[^*]+\*)", testo):
        if not pezzo:
            continue
        acc = pezzo.startswith("*") and pezzo.endswith("*")
        for w in pezzo.strip("*").split():
            classe = "w acc" if acc else "w"
            span = f'<span class="{classe}">{html.escape(w)}</span>'
            if out and re.fullmatch(r"[,.;:!?…»)]+", w):
                out[-1] = out[-1] + span
            else:
                out.append(span)
    return " ".join(out)


def pezzi_zoom(tagli, punti_forti, durata, verticale=False):
    """[inizio, fine, scala_iniziale, scala_finale]: un livello diverso a ogni taglio (mai due uguali di fila), al massimo
    un cambio ogni 0,6 s, e uno zoom secco dove Claude l'ha chiesto. Nei verticali più morbido: la faccia è già vicina e
    uno zoom forte spinge la testa sotto le scritte. Lo zoom secco parte dal livello del pezzo, mai da quello di prima:
    due nello stesso pezzo vanno dentro e poi tornano fuori. ⛔ 14/10: si moltiplicavano, 1,16 → 1,33 → 1,53."""
    livelli = [1.0, 1.08, 1.16] if verticale else [1.0, 1.12, 1.24]
    tetto = 1.27 if verticale else 1.45
    cambi, ultimo = [], -9.0
    for t in sorted(set([0.0] + [float(x) for x in tagli])):
        if t - ultimo >= 0.6 and t < durata - 0.3:
            cambi.append(t)
            ultimo = t
    forti = sorted(float(p) for p in punti_forti if 0 < float(p) < durata - 0.5)
    eventi = sorted([(t, "taglio") for t in cambi] + [(p, "forte") for p in forti])
    pezzi, i_liv, base, scala = [], 0, 1.0, 1.0
    for k, (t, tipo) in enumerate(eventi):
        fine = eventi[k + 1][0] if k + 1 < len(eventi) else durata
        if fine - t < 0.05:
            continue
        if tipo == "taglio":
            base = scala = livelli[i_liv % len(livelli)]
            i_liv += 1
        else:
            scala = base if scala > base else round(min(base * 1.15, tetto), 3)
        pezzi.append([round(t, 3), round(fine, 3), scala, round(scala * 1.03, 3)])
    return pezzi


def attacca_pezzi(parole):
    """Il trascrittore spezza «all'interno» in «all» + «'interno» e «10%» in «10» + «%»: si riattaccano."""
    out = []
    for p in parole:
        if out and (p[2][:1] in "'’" or re.fullmatch(r"[%,.;:!?…»)]+", p[2])):
            out[-1] = [out[-1][0], p[1], out[-1][2] + p[2]]
        else:
            out.append(list(p))
    return out


# le parole corte su cui un sottotitolo non si chiude («perché magari il | cliente» → «il cliente» stanno insieme)
CORTE = {"il", "lo", "la", "i", "gli", "le", "un", "uno", "una", "di", "a", "da", "in", "con", "su", "per", "tra", "fra",
         "e", "o", "che", "non", "del", "della", "dei", "delle", "al", "alla", "ai", "alle", "nel", "nella", "nei",
         "nelle", "sul", "sulla", "col", "mi", "ti", "si", "ci", "vi", "ma", "se"}


def gruppi_sottotitoli(parole, durata):
    parole = attacca_pezzi(parole)
    gruppi, cur = [], []
    for i, p in enumerate(parole):
        cur.append(p)
        prossima = parole[i + 1] if i + 1 < len(parole) else None
        testo = " ".join(x[2] for x in cur)
        pausa = prossima is None or prossima[0] - p[1] > 0.25
        fine_frase = re.search(r"[.!?,;:]$", p[2])
        corta = p[2].lower().strip(".,;:!?«»") in CORTE
        if pausa or fine_frase or ((len(cur) >= 3 or len(testo) >= 18) and not corta) or len(cur) >= 5:
            gruppi.append(cur)
            cur = []
    # ⛔ 14/10: un gruppo allungato al minimo di 0,25 s finiva dopo l'inizio del gruppo dopo (due righe sovrapposte):
    # un sottotitolo resta fino al prossimo, mai oltre
    out = []
    for k, g in enumerate(gruppi):
        da = g[0][0]
        prossimo = gruppi[k + 1][0][0] if k + 1 < len(gruppi) else durata
        a = min(prossimo, max(g[-1][1] + 0.3, da + 0.25))
        out.append({"da": round(da, 3), "a": round(max(a, da + 0.04), 3), "parole": g})
    return out


def durata_di(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def npx():
    return shutil.which("npx") or shutil.which("npx.cmd") or sys.exit("Manca Node.js (npx): esegui INSTALLA.md.")


def controlla_node():
    """HyperFrames 0.8.157 non parte sotto Node.js 22: meglio dirlo subito che a metà render."""
    node = shutil.which("node") or shutil.which("node.exe")
    if not node:
        sys.exit("Manca Node.js: esegui INSTALLA.md.")
    r = subprocess.run([node, "--version"], capture_output=True, text=True)
    m = re.match(r"v(\d+)", r.stdout.strip())
    if m and int(m.group(1)) < 22:
        sys.exit(f"HyperFrames vuole Node.js 22 o più nuovo, qui c'è la {r.stdout.strip()}: aggiornalo (INSTALLA.md, passo 1).")


def tempo_youtube(s):
    s = int(s)
    return f"{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}" if s >= 3600 else f"{s // 60}:{s % 60:02d}"


def righe_capitoli(capitoli, durata):
    """YouTube mostra i capitoli solo se il primo è a 0:00, sono almeno 3 e ognuno dura almeno 10 secondi."""
    tenuti = []
    for tc, titolo in sorted(capitoli, key=lambda c: float(c[0])):
        tc = 0 if not tenuti else int(float(tc))
        if tenuti and (tc - tenuti[-1][0] < 10 or tc > durata - 10):
            print(f"⚠️ tolgo il capitolo «{titolo}»: troppo vicino al capitolo prima o alla fine del video")
            continue
        tenuti.append((tc, titolo))
    if len(tenuti) < 3:
        print("⚠️ YouTube mostra i capitoli solo se sono almeno 3: aggiungine in scelte.json")
    return [f"{tempo_youtube(tc)} {titolo}" for tc, titolo in tenuti]


def main():
    prepara()
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("cartella")
    a.add_argument("--bozza", action="store_true")
    a.add_argument("--alta", action="store_true")
    x = a.parse_args()
    cart = Path(x.cartella).expanduser().resolve()

    pref = dict(PREDEFINITE)
    fp = SKILL / "PREFERENZE.json"
    if fp.exists():
        pref.update({k: v for k, v in json.loads(fp.read_text(encoding="utf-8")).items() if v not in ("", None)})
    if pref["carattere"] not in CARATTERI:
        print(f"⚠️ il carattere «{pref['carattere']}» non è fra quelli pronti: uso Inter.")
        pref["carattere"] = "Inter"
    scelte = json.loads((cart / "scelte.json").read_text(encoding="utf-8")) if (cart / "scelte.json").exists() else {}
    tagli = json.loads((cart / "tagli.json").read_text(encoding="utf-8"))
    tagli_m = json.loads((cart / "tagli_montato.json").read_text(encoding="utf-8"))
    parole_m = json.loads((cart / "parole_montato.json").read_text(encoding="utf-8"))
    W, H = 1920, 1080
    verticale = tagli["dimensioni"][1] > tagli["dimensioni"][0]
    if verticale:
        W, H = 1080, 1920
    durata = round(min(durata_di(cart / "montato_video.mp4"), durata_di(cart / "voce.wav")), 3)

    # le scritte: nei verticali in alto, sopra la testa e sotto la barra dell'app (il basso è dei sottotitoli e della
    # didascalia); negli orizzontali in basso al centro, oppure in alto se ci sono anche i sottotitoli
    largo = 900 if verticale else 1400
    con_sotto = bool(scelte.get("sottotitoli", verticale))
    scritte = []
    for s in scelte.get("scritte", []):
        t, d = float(s["t"]), float(s.get("durata", 2.4))
        if t >= durata - 0.3:
            continue
        d = min(d, durata - t)
        corpo = corpo_che_sta(s["testo"], largo - 60, 2, 72, 40)
        righe = 2 if larghezza_em(s["testo"].replace("*", "")) * corpo > largo - 60 else 1
        if verticale:
            y = int(H * 0.52) if pref.get("posizione_scritte") == "centro" else int(H * 0.11)
        else:
            y = 110 if con_sotto else H - 150 - righe * int(corpo * 1.15)
        scritte.append({"t": round(t, 3), "durata": round(d, 3), "corpo": corpo, "y": y, "html": html_scritta(s["testo"])})
    # i sottotitoli: verticali sì di solito, sopra la zona dei pulsanti dell'app
    sotto = []
    if con_sotto:
        corpo_s = 66 if verticale else 52
        y_s = int(H * 0.64) if verticale else H - 150
        for g in gruppi_sottotitoli(parole_m, durata):
            g.update({"corpo": corpo_s, "y": y_s, "parole": [[p[0], p[1], html.escape(p[2])] for p in g["parole"]]})
            sotto.append(g)
    copione = {"zoom": pezzi_zoom(tagli_m, scelte.get("zoom_secchi", []), durata, verticale), "scritte": scritte, "sottotitoli": sotto,
               "colori": {"testo": pref["colore_testo"], "accento": pref["colore_accento"]}}

    prog = cart / "progetto"
    (prog / "media").mkdir(parents=True, exist_ok=True)
    for src, dst in ((cart / "montato_video.mp4", prog / "media" / "video.mp4"), (cart / "voce.wav", prog / "media" / "voce.wav")):
        if dst.exists():
            dst.unlink()
        try:
            os.link(src, dst)
        except OSError:
            shutil.copy2(src, dst)
    musica_tag = ""
    musica = scelte.get("musica") or pref.get("musica")
    if musica:
        musica = Path(str(musica)).expanduser()
        if musica.exists():
            subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-stream_loop", "-1", "-i", str(musica), "-t", str(durata),
                            "-af", f"afade=t=out:st={max(0, durata - 2.5):.2f}:d=2.5", "-ac", "2", "-ar", "48000",
                            str(prog / "media" / "musica.wav")], check=True)
            vol = float(scelte.get("volume_musica", pref["volume_musica"]))
            musica_tag = (f'<audio id="musica" src="media/musica.wav" data-start="0" data-duration="{durata}" '
                          f'data-track-index="2" data-volume="{vol}"></audio>')
        else:
            print(f"⚠️ non trovo la musica: {musica} · continuo senza")

    t = (SKILL / "attrezzi" / "modello.html").read_text(encoding="utf-8")
    for k, v in {"__LARGHEZZA_SCRITTE__": str(largo), "__LARGHEZZA__": str(W), "__ALTEZZA__": str(H), "__DURATA__": str(durata),
                 "__CARATTERE__": pref["carattere"], "__COLORE_TESTO__": pref["colore_testo"],
                 "__COLORE_ACCENTO__": pref["colore_accento"], "__COLORE_FONDO__": pref["colore_fondo_scritte"],
                 "__ORIGINE__": pref["volto"]}.items():
        t = t.replace(k, v)
    t = t.replace("/*COPIONE*/", json.dumps(copione, ensure_ascii=False)).replace("<!--MUSICA-->", musica_tag)
    (prog / "index.html").write_text(t, encoding="utf-8")

    if scelte.get("capitoli"):
        (cart / "capitoli.txt").write_text("\n".join(righe_capitoli(scelte["capitoli"], durata)) + "\n", encoding="utf-8")

    if x.alta and min(tagli["dimensioni"]) < 2160:
        print("⚠️ --alta non ha effetto: il montato è sotto il 4K. Per un master in 4K da una sorgente 4K rifai il taglio "
              "con `taglia.py … --alta`.")
    controlla_node()
    env = dict(os.environ, HF_CAPTURE_PARALLEL_STREAM="true", FFMPEG_PROCESS_TIMEOUT_MS="3600000")
    subprocess.run([npx(), "--yes", HYPERFRAMES, "lint"], cwd=prog, env=env)
    cmd = [npx(), "--yes", HYPERFRAMES, "render", "--sdr", "--workers", "2", "--output", str(cart / "finale_grezzo.mp4"),
           "--quality", "draft" if x.bozza else "high"]
    if x.alta and not x.bozza and min(tagli["dimensioni"]) >= 2160:
        cmd += ["--resolution", "portrait-4k" if verticale else "4k"]
    print("render:", " ".join(cmd[2:]), flush=True)
    subprocess.run(cmd, cwd=prog, env=env, check=True)

    ren = str(cart / "finale_grezzo.mp4")
    if x.bozza:
        # la bozza ha il suo nome: non si confonde col video finito
        os.replace(ren, cart / "bozza.mp4")
        print(f"bozza: {cart / 'bozza.mp4'} · {durata:.0f} s · {len(scritte)} scritte · {len(sotto)} sottotitoli")
        return
    # l'audio a -14 LUFS (il livello delle piattaforme), due passaggi; il video si copia così com'è
    misura = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-nostats", "-i", ren, "-af",
                             "loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json", "-f", "null", "-"],
                            capture_output=True, text=True).stderr
    m = json.loads(misura[misura.rfind("{"):misura.rfind("}") + 1])
    af = (f"loudnorm=I=-14:TP=-1.5:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
          f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", ren, "-map", "0:v:0", "-map", "0:a:0", "-c:v", "copy",
                    "-af", af, "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", str(cart / "finale.mp4")], check=True)
    os.remove(ren)
    print(f"fatto: {cart / 'finale.mp4'} · {durata:.0f} s · {len(scritte)} scritte · {len(sotto)} sottotitoli · "
          f"{len(copione['zoom'])} inquadrature")


if __name__ == "__main__":
    main()
