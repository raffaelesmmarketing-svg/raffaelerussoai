# Le prove dei tempi di taglia.py (non vanno nello zip)

Un video di prova con bip e lampi a tempi noti, e la misura di dove cadono davvero nel montato.

    python3 genera.py <cartella> lungo.mp4 300 640 360 30       # 300 bip, ~12 minuti; fps anche 30000/1001
    cp <cartella>/parole_vere.json <cartella>/lavoro/parole.json
    python3 ../skill-montaggio-video/attrezzi/taglia.py <cartella>/lungo.mp4 <cartella>/lavoro --formato originale --velocita 1.2
    python3 misura.py <cartella>/lavoro

Deve dire: lo scarto parole→voce fermo dal primo all'ultimo bip (14/10, v1.1: −18 ms → −15 ms con 300 tagli; i 15-18 ms
costanti vengono da atempo), la durata calcolata uguale a quella di voce.wav (±20 ms), A/V entro un fotogramma.
Prima della 1.1 lo scarto cresceva di ~5 ms a taglio (+754 ms dopo 150). Scritti dal controllo dei fatti del 14/10.
