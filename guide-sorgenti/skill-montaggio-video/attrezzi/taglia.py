#!/usr/bin/env python3
"""Il primo montaggio: toglie le pause e le prese sbagliate, accelera, porta il video nel formato giusto.

  python taglia.py <video> <cartella_di_lavoro> [--formato orizzontale|verticale|originale] [--velocita 1.1]
                   [--pausa 0.4] [--margine 0.12] [--soglia -38] [--togli togli.json] [--centro-x 0.5] [--alta]

I silenzi li misura sull'audio (non sulla trascrizione: una frase che il trascrittore non ha sentito resta). Legge
parole.json (da trascrivi.py) per i tempi delle parole e, se c'è, togli.json: i pezzi da togliere che Claude ha deciso leggendo testo.txt
(prese doppie, frasi sbagliate, «ok, parto»), come [[inizio, fine, "perché"], ...] in secondi del video ORIGINALE.

Scrive nella cartella:
  montato.mp4          video e voce insieme, per riguardare il taglio
  montato_video.mp4    solo il video (va nella composizione) · voce.wav  solo la voce
  parole_montato.json  [[inizio, fine, "parola"], ...] nei secondi del MONTATO: tutte le scritte si mettono su questi tempi
  tagli_montato.json   i punti in cui c'è un taglio, nei secondi del montato (lì cambia lo zoom)
  tagli.json           cosa si è tenuto, nei secondi dell'originale

⛔ Video e audio si uniscono insieme pezzo per pezzo: unendo solo il video, a ogni taglio si perde una frazione di
fotogramma e dopo qualche minuto le labbra non vanno più con la voce.
"""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


def sonda(video):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height,color_transfer:stream_side_data=rotation:format=duration", "-of", "json", video],
                       capture_output=True, text=True, check=True)
    d = json.loads(r.stdout)
    s = d["streams"][0]
    w, h = int(s["width"]), int(s["height"])
    rot = 0
    for sd in s.get("side_data_list", []) or []:
        if "rotation" in sd:
            rot = abs(int(sd["rotation"]))
    if rot in (90, 270):
        w, h = h, w
    return w, h, s.get("color_transfer", ""), float(d["format"]["duration"])


def ha_filtro(nome):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True)
    return f" {nome} " in r.stdout


def silenzi(video, soglia_db, pausa):
    """I silenzi veri, misurati sull'audio con silencedetect: [[inizio, fine], ...]."""
    r = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-i", str(video), "-vn", "-af",
                        f"silencedetect=noise={soglia_db}dB:d={pausa}", "-f", "null", "-"], capture_output=True, text=True)
    out, ini = [], None
    for riga in r.stderr.splitlines():
        if "silence_start:" in riga:
            ini = float(riga.split("silence_start:")[1].split()[0])
        elif "silence_end:" in riga and ini is not None:
            out.append([max(0.0, ini), float(riga.split("silence_end:")[1].split()[0])])
            ini = None
    if ini is not None:
        out.append([ini, float("inf")])
    return out


def pezzi_da_tenere(muti, durata, margine, togli):
    """Si tiene tutto quello che NON è silenzio (con un margine prima e dopo ogni frase), poi si tolgono le prese
    sbagliate. ⛔ 14/10: prima si tenevano solo i pezzi coperti dalle parole trascritte, e una frase che il modello non
    aveva sentito spariva dal video."""
    tenere, t = [], 0.0
    for s, e in muti:
        if s > t:
            tenere.append([t, s])
        t = max(t, e)
    if t < durata:
        tenere.append([t, durata])
    tenere = [[max(0.0, s - margine), min(durata, e + margine)] for s, e in tenere]
    # i pezzi vicini dopo il margine si fondono
    fusi = []
    for s, e in tenere:
        if fusi and s <= fusi[-1][1] + 0.02:
            fusi[-1][1] = max(fusi[-1][1], e)
        else:
            fusi.append([s, e])
    # si tolgono le prese sbagliate
    for ts, te, *_ in togli:
        nuovi = []
        for s, e in fusi:
            if te <= s or ts >= e:
                nuovi.append([s, e])
                continue
            if ts > s:
                nuovi.append([s, ts])
            if te < e:
                nuovi.append([te, e])
        fusi = nuovi
    return [[round(s, 3), round(e, 3)] for s, e in fusi if e - s >= 0.25]


def sdr_con_apple(video, cartella, alta, lato_corto):
    """Su Mac: la conversione HDR → SDR di Apple (la stessa di Foto), con gli stessi tempi del video. Senza Mac: None."""
    if sys.platform != "darwin" or not shutil.which("avconvert"):
        return None
    quattro_k = alta and lato_corto >= 2160
    preset = "Preset3840x2160" if quattro_k else "Preset1920x1080"
    out = Path(cartella) / f"sorgente_sdr_{'2160' if quattro_k else '1080'}.mp4"
    if not out.exists():
        print("il video è in HDR (iPhone): lo porto in colori normali con la conversione di Apple…", flush=True)
        r = subprocess.run(["avconvert", "-s", str(video), "-p", preset, "-o", str(out), "--replace"],
                           capture_output=True, text=True)
        if r.returncode != 0 or not out.exists():
            print(r.stdout + r.stderr)
            return None
    return out


def filtro_formato(formato, w, h, centro_x, alta):
    if formato == "verticale":
        if w * 16 >= h * 9:     # sorgente più larga di 9:16: si ritaglia una striscia verticale attorno al volto
            cw = int(h * 9 / 16) // 2 * 2
            x = int(min(max(centro_x * w - cw / 2, 0), w - cw))
            crop = f"crop={cw}:{h}:{x}:0"
        else:
            crop = f"crop={w}:{int(w * 16 / 9) // 2 * 2}"
        out = (2160, 3840) if (alta and h >= 3840) else (1080, 1920)
        return f"{crop},scale={out[0]}:{out[1]}:flags=lanczos", out
    if formato == "orizzontale":
        out = (3840, 2160) if (alta and h >= 2160) else (1920, 1080)
        return (f"scale={out[0]}:{out[1]}:force_original_aspect_ratio=increase:flags=lanczos,crop={out[0]}:{out[1]}", out)
    ow, oh = (w, h) if alta else (int(w * min(1, 1920 / max(w, h))) // 2 * 2, int(h * min(1, 1920 / max(w, h))) // 2 * 2)
    return f"scale={ow}:{oh}:flags=lanczos", (ow, oh)


def main():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("video")
    a.add_argument("cartella")
    a.add_argument("--formato", default="orizzontale", choices=["orizzontale", "verticale", "originale"])
    a.add_argument("--velocita", type=float, default=1.1)
    a.add_argument("--pausa", type=float, default=0.4, help="un silenzio più lungo di così si taglia (secondi)")
    a.add_argument("--margine", type=float, default=0.12, help="quanto si tiene prima e dopo ogni frase (secondi)")
    a.add_argument("--soglia", type=float, default=-38, help="sotto questo livello (dB) è silenzio; -32 in una stanza rumorosa")
    a.add_argument("--togli", default=None)
    a.add_argument("--centro-x", type=float, default=0.5, help="dov'è il volto in orizzontale (0 = sinistra, 1 = destra)")
    a.add_argument("--alta", action="store_true", help="tiene la risoluzione della sorgente (fino al 4K)")
    x = a.parse_args()

    if not shutil.which("ffmpeg"):
        sys.exit("Manca ffmpeg: esegui INSTALLA.md.")
    if not 0.5 <= x.velocita <= 2.0:
        sys.exit("La velocità va fra 0,5 e 2.")
    cart = Path(x.cartella).expanduser()
    parole = json.loads((cart / "parole.json").read_text(encoding="utf-8"))
    togli = json.loads(Path(x.togli).read_text(encoding="utf-8")) if x.togli else []
    if not x.togli and (cart / "togli.json").exists():
        togli = json.loads((cart / "togli.json").read_text(encoding="utf-8"))
    video = x.video
    w, h, transfer, durata = sonda(video)
    tono = ""
    if transfer in ("arib-std-b67", "smpte2084"):
        # ⛔ l'HDR letto da ffmpeg senza conversione esce sbiadito: prima la conversione di Apple (Mac), poi zscale
        sdr = sdr_con_apple(video, cart, x.alta, min(w, h))
        if sdr:
            video = str(sdr)
            w, h, _, _ = sonda(video)
        elif ha_filtro("zscale"):
            tono = ("zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,"
                    "zscale=t=bt709:m=bt709:r=tv,format=yuv420p,")
            print("il video è in HDR (iPhone): lo porto in colori normali con zscale.")
        else:
            print("⚠️ il video è in HDR e su questo computer non c'è una conversione affidabile: i colori potrebbero uscire "
                  "sbiaditi. La prossima volta registra con l'HDR spento (iPhone: Impostazioni › Fotocamera › Registra video "
                  "› Video HDR).")
    muti = silenzi(video, x.soglia, x.pausa)
    tenere = pezzi_da_tenere(muti, durata, x.margine, togli)
    if not tenere:
        sys.exit("Non resta niente da tenere: controlla parole.json e togli.json.")

    vf_formato, (ow, oh) = filtro_formato(x.formato, w, h, x.centro_x, x.alta)

    parti, ingressi = [], []
    for i, (s, e) in enumerate(tenere):
        d = e - s
        parti.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS[v{i}]")
        parti.append(f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:st=0:d=0.01,afade=t=out:st={max(0, d - 0.01):.3f}:d=0.01[a{i}]")
        ingressi.append(f"[v{i}][a{i}]")
    parti.append(f"{''.join(ingressi)}concat=n={len(tenere)}:v=1:a=1[vc][ac]")
    parti.append(f"[vc]setpts=PTS/{x.velocita},fps=30,{tono}{vf_formato},format=yuv420p[vout]")
    parti.append(f"[ac]atempo={x.velocita},aresample=48000[aout]")
    grafo = cart / "taglio_filtro.txt"
    grafo.write_text(";\n".join(parti), encoding="utf-8")

    print(f"monto {len(tenere)} pezzi a {x.velocita}× in {ow}×{oh}…", flush=True)
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-stats", "-y", "-i", video, "-filter_complex_script", str(grafo),
                    "-map", "[vout]", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-g", "15",
                    "-movflags", "+faststart", str(cart / "montato_video.mp4"),
                    "-map", "[aout]", "-c:a", "pcm_s16le", str(cart / "voce.wav")], check=True)
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", str(cart / "montato_video.mp4"), "-i", str(cart / "voce.wav"),
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                    str(cart / "montato.mp4")], check=True)

    # i tempi nel montato: ogni pezzo dura quanto il suo audio, diviso la velocità
    inizio_pezzo, t, parole_m, tagli_m = [], 0.0, [], []
    for s, e in tenere:
        inizio_pezzo.append(t)
        tagli_m.append(round(t / x.velocita, 3))
        t += e - s
    # una parola va nel pezzo che contiene la sua metà, tagliata ai bordi del pezzo; se la metà cade in un taglio ma la
    # parola tocca un pezzo tenuto (si sente ancora), va nel pezzo più vicino. ⛔ 14/10: le parole a cavallo di un taglio
    # sparivano dai sottotitoli
    scartate = 0
    for ws, we, testo in parole:
        meta = (ws + we) / 2
        scelto = next((k for k, (s, e) in enumerate(tenere) if s <= meta <= e), None)
        if scelto is None:
            vicini = [(min(abs(meta - s), abs(meta - e)), k) for k, (s, e) in enumerate(tenere) if we > s and ws < e]
            scelto = min(vicini)[1] if vicini else None
        if scelto is None:
            scartate += 1
            continue
        (s, e), t0 = tenere[scelto], inizio_pezzo[scelto]
        parole_m.append([round((t0 + max(ws, s) - s) / x.velocita, 3), round((t0 + min(we, e) - s) / x.velocita, 3), testo])
    durata_m = round(t / x.velocita, 3)
    (cart / "tagli.json").write_text(json.dumps({"tenere": tenere, "velocita": x.velocita, "formato": x.formato,
                                                 "dimensioni": [ow, oh], "durata_montato": durata_m}, indent=1), encoding="utf-8")
    (cart / "parole_montato.json").write_text(json.dumps(parole_m, ensure_ascii=False), encoding="utf-8")
    (cart / "tagli_montato.json").write_text(json.dumps(tagli_m), encoding="utf-8")
    grafo.unlink(missing_ok=True)
    print(f"fatto: da {durata:.0f} s a {durata_m:.0f} s · {len(tenere) - 1} tagli · {cart / 'montato.mp4'}"
          + (f" · {scartate} parole stanno nei pezzi tolti" if scartate else ""))


if __name__ == "__main__":
    main()
