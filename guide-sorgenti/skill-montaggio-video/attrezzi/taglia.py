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

⛔ Video e audio si uniscono insieme pezzo per pezzo, e ogni taglio cade a metà fra due fotogrammi: così ogni pezzo di
video dura esattamente quanto il suo audio. (14/10: coi tagli dove capitava, a ogni taglio si aggiungeva una frazione di
fotogramma, e dopo 150 tagli scritte e sottotitoli arrivavano 0,75 s prima della voce.)
⛔ Oltre i 40 pezzi si monta a blocchi: con un grafo solo il lavoro cresce col quadrato dei pezzi (14/10: 400 pezzi, 24
minuti solo per il grafo).
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import wave
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comune import SENZA_AUDIO, fotogrammi_al_secondo, ha_audio, prepara  # noqa: E402

BLOCCO = 40     # pezzi per ogni passata di ffmpeg


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


def durata_audio(video):
    """Quanto dura la voce: spesso l'audio finisce qualche decimo prima del video, e oltre non c'è niente da tenere."""
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=duration", "-of",
                        "csv=p=0", str(video)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip().splitlines()[0].strip(","))
    except (ValueError, IndexError):
        return None


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


def allinea(tenere, fps):
    """Ogni taglio a metà fra due fotogrammi: un pezzo tiene un numero intero di fotogrammi e il suo audio dura uguale,
    così concat non aggiunge niente e i tempi del montato sono la somma dei pezzi. Mai prima del fotogramma 1: un pezzo
    che parte da 0 avrebbe mezzo fotogramma di video in più dell'audio."""
    a_meta = lambda b: (max(1, round(b * fps)) - 0.5) / fps
    out = []
    for s, e in tenere:
        s, e = round(a_meta(s), 6), round(a_meta(e), 6)
        if e - s < 1.5 / fps:
            continue
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out


def sdr_con_apple(video, cartella, alta, lato_corto):
    """Su Mac: la conversione HDR → SDR di Apple (la stessa di Foto), con gli stessi tempi del video. Senza Mac: None."""
    if sys.platform != "darwin" or not shutil.which("avconvert"):
        return None
    quattro_k = alta and lato_corto >= 2160
    preset = "Preset3840x2160" if quattro_k else "Preset1920x1080"
    out = Path(cartella) / f"sorgente_sdr_{'2160' if quattro_k else '1080'}.mp4"
    if not out.exists():
        print("il video è in HDR (iPhone): lo porto in colori normali con la conversione di Apple…", flush=True)
        # su un file a parte, rinominato solo alla fine: una conversione interrotta non si riusa la volta dopo
        parziale = out.with_name(out.stem + "_in_corso.mp4")
        r = subprocess.run(["avconvert", "-s", str(video), "-p", preset, "-o", str(parziale), "--replace"],
                           capture_output=True, text=True)
        if r.returncode != 0 or not parziale.exists():
            print(r.stdout + r.stderr)
            return None
        os.replace(parziale, out)
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


def grafo(pezzi, origine, dopo_video, dopo_audio):
    """Un trim e un atrim per pezzo (tempi meno `origine`, dove comincia la lettura), uniti insieme, poi i filtri dopo."""
    parti, ingressi = [], []
    for i, (s, e) in enumerate(pezzi):
        s, e = round(s - origine, 6), round(e - origine, 6)
        parti.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS[v{i}]")
        parti.append(f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:st=0:d=0.01,afade=t=out:st={max(0, e - s - 0.01):.4f}:d=0.01[a{i}]")
        ingressi.append(f"[v{i}][a{i}]")
    parti.append(f"{''.join(ingressi)}concat=n={len(pezzi)}:v=1:a=1[vc][ac]")
    parti.append(f"[vc]{dopo_video}[vout]")
    parti.append(f"[ac]{dopo_audio}[aout]")
    return ";".join(parti)


def ffmpeg(argomenti, avanzamento=False):
    # l'avanzamento ogni 15 s: con -stats e basta sono centinaia di righe nella conversazione
    attese = ["-stats", "-stats_period", "15"] if avanzamento else ["-nostats"]
    subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-v", "error", *attese, "-y", *argomenti], check=True)


def unisci_wav(pezzi, uscita):
    with wave.open(str(pezzi[0]), "rb") as f:
        parametri = f.getparams()
    with wave.open(str(uscita), "wb") as out:
        out.setparams(parametri)
        for p in pezzi:
            with wave.open(str(p), "rb") as f:
                out.writeframes(f.readframes(f.getnframes()))


def durata_wav(f):
    with wave.open(str(f), "rb") as w:
        return w.getnframes() / w.getframerate()


def main():
    prepara()
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

    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        sys.exit("Manca ffmpeg: esegui INSTALLA.md.")
    if not 0.5 <= x.velocita <= 2.0:
        sys.exit("La velocità va fra 0,5 e 2.")
    if not Path(x.video).expanduser().exists():
        sys.exit(f"Non trovo il video: {x.video}")
    if not ha_audio(Path(x.video).expanduser()):
        sys.exit(SENZA_AUDIO)
    cart = Path(x.cartella).expanduser()
    parole = json.loads((cart / "parole.json").read_text(encoding="utf-8"))
    togli = json.loads(Path(x.togli).read_text(encoding="utf-8")) if x.togli else []
    if not x.togli and (cart / "togli.json").exists():
        togli = json.loads((cart / "togli.json").read_text(encoding="utf-8"))
    video = str(Path(x.video).expanduser())
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
    durata = min(durata, durata_audio(video) or durata)
    muti = silenzi(video, x.soglia, x.pausa)
    tenere = allinea(pezzi_da_tenere(muti, durata, x.margine, togli), fotogrammi_al_secondo(video))
    if not tenere:
        sys.exit("Non resta niente da tenere: controlla parole.json e togli.json.")
    if not muti:
        print(f"⚠️ non ho trovato pause sotto {x.soglia:.0f} dB: se nella stanza c'è rumore di fondo, rifai con --soglia -32 "
              "(o -28), altrimenti si tolgono solo i pezzi di togli.json.", flush=True)

    vf_formato, (ow, oh) = filtro_formato(x.formato, w, h, x.centro_x, x.alta)
    v = x.velocita
    uscita_video = ["-c:v", "libx264", "-preset", "medium", "-crf", "16", "-g", "15", "-movflags", "+faststart"]
    blocchi = [tenere[i:i + BLOCCO] for i in range(0, len(tenere), BLOCCO)]
    print(f"monto {len(tenere)} {'pezzo' if len(tenere) == 1 else 'pezzi'} a {v}× in {ow}×{oh}…", flush=True)
    if len(blocchi) == 1:
        ffmpeg(["-t", f"{tenere[-1][1] + 1:.3f}", "-i", video, "-filter_complex",
                grafo(tenere, 0.0, f"setpts=PTS/{v},fps=30,{tono}{vf_formato},format=yuv420p", f"atempo={v},aresample=48000"),
                "-map", "[vout]", "-an", *uscita_video, str(cart / "montato_video.mp4"),
                "-map", "[aout]", "-c:a", "pcm_s16le", str(cart / "voce.wav")], avanzamento=True)
    else:
        # a blocchi: ogni blocco legge solo il suo pezzo di video e tiene i fotogrammi com'erano; velocità e 30 fps si
        # danno una volta sola, sull'insieme, così ai bordi dei blocchi non si perde e non si aggiunge niente
        lav = cart / "blocchi"
        shutil.rmtree(lav, ignore_errors=True)
        lav.mkdir(parents=True)
        voci, lista = [], ["ffconcat version 1.0"]
        for b, pezzi in enumerate(blocchi):
            print(f"  blocco {b + 1} di {len(blocchi)}…", flush=True)
            da, a = pezzi[0][0], pezzi[-1][1]
            fv, fa = lav / f"b{b:03d}.mp4", lav / f"b{b:03d}.wav"
            ffmpeg(["-ss", f"{da:.6f}", "-t", f"{a - da + 1:.3f}", "-i", video, "-filter_complex",
                    grafo(pezzi, da, f"{tono}{vf_formato},format=yuv420p", "anull"),
                    "-map", "[vout]", "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", str(fv),
                    "-map", "[aout]", "-c:a", "pcm_s16le", str(fa)])
            # il blocco dura quanto la sua voce: è da lì che parte il blocco dopo
            lista += [f"file '{fv.name}'", f"duration {durata_wav(fa):.6f}"]
            voci.append(fa)
        (lav / "video.txt").write_text("\n".join(lista) + "\n", encoding="utf-8")
        unisci_wav(voci, lav / "voce_intera.wav")
        print("  unisco i blocchi…", flush=True)
        ffmpeg(["-f", "concat", "-safe", "0", "-i", str(lav / "video.txt"), "-i", str(lav / "voce_intera.wav"),
                "-filter_complex", f"[0:v]setpts=PTS/{v},fps=30,format=yuv420p[vout];[1:a]atempo={v},aresample=48000[aout]",
                "-map", "[vout]", "-an", *uscita_video, str(cart / "montato_video.mp4"),
                "-map", "[aout]", "-c:a", "pcm_s16le", str(cart / "voce.wav")], avanzamento=True)
        shutil.rmtree(lav, ignore_errors=True)
    ffmpeg(["-i", str(cart / "montato_video.mp4"), "-i", str(cart / "voce.wav"), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart", str(cart / "montato.mp4")])

    # i tempi nel montato: ogni pezzo dura quanto il suo audio, diviso la velocità
    inizio_pezzo, t, parole_m, tagli_m = [], 0.0, [], []
    for s, e in tenere:
        inizio_pezzo.append(t)
        tagli_m.append(round(t / v, 3))
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
        parole_m.append([round((t0 + max(ws, s) - s) / v, 3), round((t0 + min(we, e) - s) / v, 3), testo])
    durata_m = round(t / v, 3)
    (cart / "tagli.json").write_text(json.dumps({"tenere": tenere, "velocita": x.velocita, "formato": x.formato,
                                                 "dimensioni": [ow, oh], "durata_montato": durata_m}, indent=1), encoding="utf-8")
    (cart / "parole_montato.json").write_text(json.dumps(parole_m, ensure_ascii=False), encoding="utf-8")
    (cart / "tagli_montato.json").write_text(json.dumps(tagli_m), encoding="utf-8")
    print(f"fatto: da {durata:.0f} s a {durata_m:.0f} s · {len(tenere) - 1} {'taglio' if len(tenere) == 2 else 'tagli'} · "
          f"{cart / 'montato.mp4'}"
          + (f" · {scartate} parole stanno nei pezzi tolti" if scartate else ""))
    scarto = durata_wav(cart / "voce.wav") - durata_m
    if abs(scarto) > 0.1:
        print(f"⚠️ la voce dura {scarto:+.2f} s rispetto ai tempi calcolati: guarda bene che scritte e sottotitoli cadano "
              "sulle parole, soprattutto verso la fine.")


if __name__ == "__main__":
    main()
