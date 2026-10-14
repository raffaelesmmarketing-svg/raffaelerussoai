#!/usr/bin/env python3
"""Trascrive un video parola per parola, sul tuo computer e gratis (faster-whisper).

  python trascrivi.py <video> <cartella_di_lavoro> [--modello medium|small|large-v3] [--lingua it]
                      [--parole "il mio nome, la mia azienda"] [--gpu]

Scrive nella cartella:
  parole.json   [[inizio, fine, "parola"], ...] in secondi del video originale
  testo.txt     le frasi coi tempi, da leggere per decidere cosa tagliare

--parole: i nomi che usi spesso (il tuo nome, la tua azienda, i prodotti). Li suggerisce al modello, che così li scrive
giusti più spesso; quelli che sbaglia lo stesso si correggono in REGOLE.md («si scrive Instagram, non Insta gram»).
--gpu: solo con una scheda NVIDIA e CUDA installato. ⛔ Di base si lavora sul processore: con «auto», su un PC con
scheda NVIDIA senza CUDA la trascrizione si fermava («cublas64_12.dll is not found»).
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comune import SENZA_AUDIO, ha_audio, prepara  # noqa: E402


def main():
    prepara()
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("video")
    a.add_argument("cartella")
    a.add_argument("--modello", default="medium", help="medium (preciso, il predefinito) · small (più veloce) · large-v3 (il più preciso, lento)")
    a.add_argument("--lingua", default="it")
    a.add_argument("--parole", default="", help="nomi da scrivere giusti, separati da virgole")
    a.add_argument("--gpu", action="store_true", help="usa la scheda NVIDIA (serve CUDA installato)")
    x = a.parse_args()

    video = Path(x.video).expanduser()
    if not video.exists():
        sys.exit(f"Non trovo il video: {video}")
    if not ha_audio(video):
        sys.exit(SENZA_AUDIO)
    out = Path(x.cartella).expanduser()
    out.mkdir(parents=True, exist_ok=True)

    # l'audio a 16 kHz mono: è quello che legge il modello
    wav = out / "audio_16k.wav"
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(wav)],
                   check=True)

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("Manca faster-whisper: esegui INSTALLA.md (python -m pip install faster-whisper nell'ambiente della skill).")

    print(f"trascrivo con il modello «{x.modello}» (la prima volta lo scarica: qualche minuto)…", flush=True)
    modello = WhisperModel(x.modello, device="cuda" if x.gpu else "cpu", compute_type="int8")
    prompt = f"{x.parole}." if x.parole.strip() else None
    # l'audio lo leggiamo noi dal WAV di ffmpeg e lo passiamo già pronto: così non conta la versione di PyAV
    # (⛔ 14/10: con PyAV recente faster-whisper si fermava su «open() got an unexpected keyword argument»)
    import wave
    import numpy as np
    with wave.open(str(wav), "rb") as f:
        audio = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    # vad_filter: il modello ascolta solo dove si parla. ⛔ 14/10: senza, dopo una pausa di 15 s saltava una frase intera
    segmenti, info = modello.transcribe(audio, language=x.lingua, word_timestamps=True, beam_size=5,
                                        initial_prompt=prompt, condition_on_previous_text=False,
                                        vad_filter=True, vad_parameters={"min_silence_duration_ms": 500, "speech_pad_ms": 200})
    parole, righe = [], []
    for s in segmenti:
        for w in (s.words or []):
            testo = w.word.strip()
            if testo:
                parole.append([round(w.start, 3), round(w.end, 3), testo])
        righe.append(f"[{s.start:7.2f} – {s.end:7.2f}]  {s.text.strip()}")
    (out / "parole.json").write_text(json.dumps(parole, ensure_ascii=False), encoding="utf-8")
    (out / "testo.txt").write_text("\n".join(righe) + "\n", encoding="utf-8")
    wav.unlink(missing_ok=True)
    if not parole:
        sys.exit("Non ho sentito nessuna parola: controlla che nel video si senta la voce (microfono acceso e vicino).")
    print(f"fatto: {len(parole)} parole in {info.duration:.0f} s di video → {out / 'testo.txt'}")


if __name__ == "__main__":
    main()
