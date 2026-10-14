"""Misura nel montato: dove partono davvero i bip (voce.wav) e i lampi (montato_video.mp4), contro parole_montato.json.
uso: misura.py <cartella_montaggio>"""
import sys, json, wave, array, subprocess, pathlib
c = pathlib.Path(sys.argv[1])
pm = json.loads((c / "parole_montato.json").read_text())
tg = json.loads((c / "tagli.json").read_text())
with wave.open(str(c / "voce.wav"), "rb") as f:
    sr = f.getframerate(); ch = f.getnchannels()
    a = array.array("h", f.readframes(f.getnframes()))
if ch > 1:
    a = a[::ch]
# onset audio: primo campione sopra soglia dopo almeno 0.15 s di quiete (finestra 1 ms)
win = sr // 1000
onset_a, quiete = [], 9999
for i in range(0, len(a) - win, win):
    m = max(abs(x) for x in a[i:i + win])
    if m > 3000:
        if quiete >= 150:
            onset_a.append(i / sr)
        quiete = 0
    else:
        quiete += 1
# onset video: luminanza media per fotogramma
r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", str(c / "montato_video.mp4")], capture_output=True, text=True)
num, den = map(int, r.stdout.strip().split("/")); fps = num / den
raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", str(c / "montato_video.mp4"), "-vf", "scale=8:8,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
lum = [sum(raw[i:i + 64]) / 64 for i in range(0, len(raw), 64)]
onset_v = [k / fps for k in range(1, len(lum)) if lum[k] > 128 and lum[k - 1] <= 128]
if lum and lum[0] > 128:
    onset_v.insert(0, 0.0)
print(f"parole: {len(pm)} · bip sentiti nel montato: {len(onset_a)} · lampi visti: {len(onset_v)} · fps {fps:.3f}")
dur_voce = len(a) / sr
print(f"durata calcolata (tagli.json) {tg['durata_montato']:.3f} s · voce.wav {dur_voce:.3f} s · video {len(lum)/fps:.3f} s")
n = min(len(pm), len(onset_a))
errs = [onset_a[k] - pm[k][0] for k in range(n)]
for k in [0, 1, 2, n // 4, n // 2, 3 * n // 4, n - 2, n - 1]:
    if 0 <= k < n:
        print(f"  parola {k:4d}: json {pm[k][0]:8.3f} · voce {onset_a[k]:8.3f} · scarto {errs[k]*1000:+7.1f} ms")
m = min(len(onset_v), len(onset_a))
av = [onset_v[k] - onset_a[k] for k in range(m)]
if av:
    print(f"A/V (lampo - bip): primo {av[0]*1000:+.1f} ms · ultimo {av[-1]*1000:+.1f} ms · max |{max(abs(x) for x in av)*1000:.1f}| ms")
if errs:
    print(f"scarto parole→voce: primo {errs[0]*1000:+.1f} ms · ultimo {errs[-1]*1000:+.1f} ms")
