"""Quello che serve a tutti e tre gli attrezzi: i messaggi leggibili su ogni computer, i programmi appena installati,
e due domande al video (ha l'audio? quanti fotogrammi al secondo?)."""
import json
import os
import subprocess
import sys


def prepara():
    """⛔ Su Windows l'uscita in pipe è cp1252, che non ha «→» né «⚠️»: senza questo i messaggi fanno crollare lo script.
    ⛔ Dopo Homebrew (Mac) o winget (Windows) i programmi nuovi entrano nel PATH di Claude solo quando lo si riapre:
    intanto si cercano nelle loro cartelle."""
    for flusso in (sys.stdout, sys.stderr):
        try:
            flusso.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    if os.name == "nt":
        cartelle = [os.path.join(os.environ.get("LOCALAPPDATA", ""), "Microsoft", "WinGet", "Links"),
                    os.path.join(os.environ.get("ProgramFiles", r"C:\Program Files"), "nodejs")]
    else:
        cartelle = ["/opt/homebrew/bin", "/usr/local/bin"]
    percorso = os.environ.get("PATH", "").split(os.pathsep)
    nuove = [c for c in cartelle if os.path.isdir(c) and c not in percorso]
    if nuove:
        os.environ["PATH"] = os.pathsep.join(percorso + nuove)


def ha_audio(video):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0",
                        str(video)], capture_output=True, text=True)
    return bool(r.stdout.strip())


SENZA_AUDIO = ("Questo video non ha l'audio: la skill monta i video in cui parli. Controlla che il microfono fosse acceso "
               "e che il file sia quello giusto.")


def fotogrammi_al_secondo(video):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=r_frame_rate,avg_frame_rate", "-of", "json", str(video)],
                       capture_output=True, text=True, check=True)
    flusso = json.loads(r.stdout)["streams"][0]
    for chiave in ("r_frame_rate", "avg_frame_rate"):
        num, _, den = flusso.get(chiave, "0/0").partition("/")
        try:
            fps = float(num) / float(den or 1)
        except (ValueError, ZeroDivisionError):
            continue
        if 10 <= fps <= 120:
            return fps
    return 30.0
