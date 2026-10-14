"""Genera un video di prova: lampi bianchi + bip a tempi noti (con pause variabili), e parole_vere.json esatto.
uso: genera.py <cartella_out> <nome_video> <n_bip> [w h fps] [--senza-audio]"""
import sys, json, random, math, wave, array, subprocess, pathlib
args = [x for x in sys.argv[1:] if not x.startswith("--")]
out = pathlib.Path(args[0]); out.mkdir(parents=True, exist_ok=True)
nome = args[1]; n = int(args[2])
w = int(args[3]) if len(args) > 3 else 1280
h = int(args[4]) if len(args) > 4 else 720
fps_s = args[5] if len(args) > 5 else "30"
fps = eval(fps_s) if "/" in fps_s else float(fps_s)
senza_audio = "--senza-audio" in sys.argv
random.seed(7)
t = 1.0
bip = []
for i in range(n):
    d = round(random.uniform(0.7, 2.3), 3)
    bip.append([round(t, 3), round(t + d, 3)])
    t += d + round(random.uniform(0.55, 1.4), 3)
durata = round(t + 1.0, 3)
sr = 48000
campioni = array.array("h", bytes(2 * int(durata * sr)))
for s, e in bip:
    for k in range(int(s * sr), int(e * sr)):
        campioni[k] = int(12000 * math.sin(2 * math.pi * 440 * k / sr))
wav = out / "audio_prova.wav"
with wave.open(str(wav), "wb") as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes(campioni.tobytes())
sw, sh = 32, 18
nfr = int(durata * fps)
nero, bianco = bytes(sw * sh), bytes([255]) * (sw * sh)
j = 0
video = out / nome
cmd = ["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{sw}x{sh}", "-r", fps_s, "-i", "-"]
if not senza_audio:
    cmd += ["-i", str(wav)]
cmd += ["-map", "0:v"]
if not senza_audio:
    cmd += ["-map", "1:a", "-c:a", "aac", "-b:a", "128k"]
cmd += ["-vf", f"scale={w}:{h}:flags=neighbor,format=yuv420p", "-c:v", "libx264", "-preset", "ultrafast", "-t", str(durata), str(video)]
p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
for k in range(nfr):
    tk = k / fps
    while j < len(bip) and bip[j][1] <= tk:
        j += 1
    acceso = j < len(bip) and bip[j][0] <= tk < bip[j][1]
    p.stdin.write(bianco if acceso else nero)
p.stdin.close(); p.wait()
if p.returncode:
    sys.exit(p.returncode)
(out / "parole_vere.json").write_text(json.dumps([[s, e, f"p{i}"] for i, (s, e) in enumerate(bip)]), encoding="utf-8")
print(f"{video}: {durata:.1f} s, {n} bip, {nfr} fotogrammi a {fps:.3f}")
