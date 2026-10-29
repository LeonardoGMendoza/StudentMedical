"""Gera os modelos 3D de cada aula a partir do BodyParts3D 4.0 (CC BY 4.0), pacote do projeto human-atlas.

Uso: python ml/recortar_anatomia.py <pasta public/models do human-atlas> app/public/modelos
Saída por tema: <tema>.json (peças, nomes, centros) + <tema>.bin (geometria compacta).
Formato do .bin por peça: posições Int16 (quantizadas na caixa do tema), normais Int8, índices Uint16/Uint32.
"""
import gzip
import json
import re
import struct
import sys
from array import array
from pathlib import Path

ORIG, SAIDA = Path(sys.argv[1]), Path(sys.argv[2])
SAIDA.mkdir(parents=True, exist_ok=True)
atlas = json.loads((ORIG / "atlas.json").read_text())
chunks = [gzip.decompress((ORIG / Path(c["gzip"]).name).read_bytes()) for c in atlas["chunks"]]

def tem(nome, *pal):
    n = nome.lower()
    return any(p in n for p in pal)

NAO_OSSO = ("tibialis", "fibularis", "levator scapulae", "subscapularis", "iliotibial", "gingiva", "tooth", "cartilage")
CRANIO = ("frontal bone", "parietal bone", "temporal bone", "occipital bone", "sphenoid bone", "ethmoid", "maxilla",
          "mandible", "nasal bone", "zygomatic", "palatine bone", "lacrimal bone", "vomer", "hyoid", "inferior nasal concha")
MS_MUSC = ("deltoid", "biceps brachii", "triceps", "supraspinatus", "infraspinatus", "teres minor", "teres major", "subscapularis",
           "brachialis", "brachioradialis", "coracobrachialis", "pronator", "supinator", "flexor carpi", "extensor carpi",
           "palmaris longus", "flexor digitorum superficialis", "flexor digitorum profundus", "right extensor digitorum", "extensor pollicis", "abductor pollicis longus", "anconeus", "pectoralis major", "pectoralis minor")
MS_OSSO = ("clavicle", "scapula", "humerus", "radius", "ulna", "scaphoid", "lunate", "triquetrum", "pisiform", "trapezium",
           "trapezoid", "capitate", "hamate", "metacarpal", "finger", "thumb")
MI_OSSO = ("hip bone", "femur", "patella", "tibia", "fibula", "talus", "calcaneus", "navicular", "cuboid", "cuneiform bone",
           "metatarsal", "toe")
MI_MUSC = ("gluteus", "piriformis", "rectus femoris", "vastus", "biceps femoris", "semitendinosus", "semimembranosus",
           "sartorius", "gracilis", "adductor longus", "adductor brevis", "adductor magnus", "adductor minimus", "gastrocnemius", "soleus", "tibialis", "fibularis", "iliacus", "psoas", "tensor fasciae")

def osso(p):
    return p["system"] == "skeletal" and not tem(p["name"], *NAO_OSSO)

def direita(p):
    return p["name"].lower().startswith("right") or " of right " in p["name"].lower() or " right " in p["name"].lower()

TEMAS = {
    "osteologia": lambda p: osso(p),
    "cabeza": lambda p: (osso(p) and (tem(p["name"], *CRANIO) or re.search(r"cervical vertebra|^atlas$|^axis$", p["name"].lower())))
                        or tem(p["name"], "sternocleidomastoid"),
    "superior": lambda p: direita(p) and not tem(p["name"], "digitorum longus", "digitorum brevis", "hallucis") and ((osso(p) and tem(p["name"], *MS_OSSO)) or (p["system"] in ("muscular", "skeletal") and tem(p["name"], *MS_MUSC))),
    "torax": lambda p: (osso(p) and tem(p["name"], "rib", "sternum", "manubrium", "xiphoid", "thoracic vertebra"))
                       or tem(p["name"], "costal cartilage") or p["system"] == "cardiac" and tem(p["name"], "wall of", "leaflet", "cusp")
                       or (p["system"] == "respiratory" and tem(p["name"], "bronch", "trachea")) or tem(p["name"], "diaphragm")
                       or p["name"] in ("Ascending aorta", "Arch of aorta", "Descending thoracic aorta", "Pulmonary trunk"),
    "abdomen": lambda p: (p["system"] in ("digestive", "urinary") and not tem(p["name"], "tongue", "sublingual", "submandibular"))
                         or p["name"] in ("Spleen", "Abdominal aorta", "Diaphragm")
                         or (osso(p) and tem(p["name"], "lumbar vertebra", "hip bone", "sacrum")),
    "inferior": lambda p: direita(p) and ((osso(p) and tem(p["name"], *MI_OSSO)) or (p["system"] in ("muscular", "skeletal") and tem(p["name"], *MI_MUSC))),
    "pares": lambda p: p["system"] == "nervous" and p["bounds"][0][1] > 1.35,
}

def peca(p):
    b = chunks[p["chunk"]]
    pos = struct.unpack_from(f"<{p['vertexCount'] * 3}f", b, p["positions"])
    nor = struct.unpack_from(f"<{p['vertexCount'] * 3}h", b, p["normals"])
    idx = struct.unpack_from(f"<{p['indexCount']}I", b, p["indices"])
    return pos, nor, idx

resumo = {}
for tema, filtro in TEMAS.items():
    sel = [p for p in atlas["parts"] if filtro(p)]
    lo = [min(p["bounds"][0][k] for p in sel) for k in range(3)]
    hi = [max(p["bounds"][1][k] for p in sel) for k in range(3)]
    esc = [(hi[k] - lo[k]) or 1 for k in range(3)]
    corpo, meta, off = bytearray(), [], 0
    for p in sel:
        pos, nor, idx = peca(p)
        q = array("h", (int(round((pos[i] - lo[i % 3]) / esc[i % 3] * 65534 - 32767)) for i in range(len(pos))))
        n8 = array("b", (max(-127, min(127, round(v / 32767 * 127))) for v in nor))
        tipo = "H" if p["vertexCount"] < 65536 else "I"
        ix = array(tipo, idx)
        reg = {"n": p["name"], "s": p["system"], "id": p["id"], "v": p["vertexCount"], "i": p["indexCount"], "u32": tipo == "I"}
        for chave, arr in (("p", q), ("no", n8), ("ix", ix)):
            while len(corpo) % 4:
                corpo.append(0)
            reg[chave] = len(corpo)
            corpo += arr.tobytes()
        b0, b1 = p["bounds"]
        reg["c"] = [round((b0[k] + b1[k]) / 2, 4) for k in range(3)]
        meta.append(reg)
    (SAIDA / f"{tema}.bin").write_bytes(bytes(corpo))
    (SAIDA / f"{tema}.json").write_text(json.dumps({"tema": tema, "min": lo, "max": hi, "pecas": meta,
        "fonte": "BodyParts3D 4.0, © The Database Center for Life Science, CC BY 4.0"}, separators=(",", ":")))
    resumo[tema] = (len(sel), sum(p["indexCount"] for p in sel) // 3, len(corpo), len(gzip.compress(bytes(corpo))))
for t, (n, tri, b, gz) in resumo.items():
    print(f"{t:11s} {n:4d} peças {tri:7d} triâng. {b/1e6:5.1f} MB ({gz/1e6:4.1f} MB gzip)")
