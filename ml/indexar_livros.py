"""Indexa os livros (PDF e DOCX) de uma pasta para o tutor de IA buscar trechos.

Uso (Git Bash ou PowerShell), dentro da pasta StudentMedical:
    pip install pymupdf
    python -u ml/indexar_livros.py "D:/documents/Downloads/Items01/Anatomía"

Livros escaneados (só imagem): instale o Tesseract com espanhol e use --ocr
    python -u ml/indexar_livros.py "D:/documents/Downloads/Items01/Anatomía" --ocr
    python -u ml/indexar_livros.py "D:/documents/Downloads/Items01/Anatomía" --ocr --somente Latarjet
O OCR lê página por página e grava só o texto (não cria cópia do PDF). Se parar no meio, rode de novo:
ele continua da página onde parou.

Gera backend/data/biblioteca.db (fica FORA do GitHub: está no .gitignore).
Pode rodar de novo quando colocar livros novos: só os arquivos novos ou alterados são lidos.
Depois, para Citologia, Biologia etc.: rode com outra pasta e --materia citologia, biologia...
"""
import argparse
import re
import sqlite3
import sys
import time
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
from app.biblioteca import Biblioteca  # noqa: E402

TAMANHO = 1100     # caracteres por trecho
SOBRA = 150        # sobreposição entre trechos


def achar_tessdata():
    import os
    for c in [os.environ.get("TESSDATA_PREFIX", ""), r"C:\Program Files\Tesseract-OCR\tessdata",
              r"C:\Program Files (x86)\Tesseract-OCR\tessdata", "/usr/share/tesseract-ocr/5/tessdata", "/usr/share/tessdata"]:
        if c and Path(c, "spa.traineddata").exists():
            return c
    return None


def abrir_pdf(caminho, ocr=None, desde=0):
    """Gera (numero_pagina, texto). Usa PyMuPDF se tiver; senão pypdf. Com ocr=tessdata, lê páginas sem texto por OCR."""
    try:
        try:
            import pymupdf as fitz
        except ImportError:
            import fitz  # PyMuPDF antigo
        with fitz.open(caminho) as doc:
            for i, pag in enumerate(doc, 1):
                if i <= desde:
                    continue
                texto = pag.get_text()
                if ocr and len(texto.strip()) < 40:
                    try:
                        texto = pag.get_textpage_ocr(language="spa", dpi=200, full=True, tessdata=ocr).extractText()
                    except Exception as erro:  # noqa: BLE001
                        print(f"    OCR falhou na página {i}: {erro}")
                yield i, texto
        return
    except ImportError:
        if ocr:
            sys.exit("Para OCR instale o PyMuPDF: pip install pymupdf")
    from pypdf import PdfReader
    leitor = PdfReader(str(caminho))
    for i, pag in enumerate(leitor.pages, 1):
        if i <= desde:
            continue
        try:
            yield i, pag.extract_text() or ""
        except Exception:  # noqa: BLE001  (página corrompida não para tudo)
            yield i, ""


def abrir_docx(caminho):
    with zipfile.ZipFile(caminho) as z:
        xml = z.read("word/document.xml").decode("utf-8", "ignore")
    texto = re.sub(r"</w:p>", "\n", xml)
    texto = re.sub(r"<[^>]+>", "", texto)
    yield 1, texto


def limpar(texto):
    texto = texto.replace("\u00ad", "")
    texto = re.sub(r"-\n(\w)", r"\1", texto)          # junta palavras hifenizadas no fim da linha
    texto = re.sub(r"[ \t]+", " ", texto)
    texto = re.sub(r"\n{2,}", "\n\n", texto)
    return texto.strip()


def fatiar(texto):
    if len(texto) <= TAMANHO:
        return [texto]
    partes, i = [], 0
    while i < len(texto):
        fim = min(len(texto), i + TAMANHO)
        corte = texto.rfind(". ", i + TAMANHO // 2, fim)
        fim = corte + 1 if corte > 0 and fim < len(texto) else fim
        partes.append(texto[i:fim].strip())
        if fim >= len(texto):
            break
        i = max(fim - SOBRA, i + 1)
    return [p for p in partes if p]


def indexar(pasta, saida, materia, ocr=None, somente=None):
    pasta = Path(pasta)
    db = Biblioteca.criar(saida)
    db.execute("CREATE TABLE IF NOT EXISTS progresso (arquivo TEXT PRIMARY KEY, pagina INTEGER, vazias INTEGER, mtime REAL)")
    arquivos = sorted(p for p in pasta.rglob("*") if p.suffix.lower() in (".pdf", ".docx")
                      and ".sdr" not in str(p.parent) and p.stat().st_size > 1000)
    if somente:
        arquivos = [a for a in arquivos if somente.lower() in str(a).lower()]
    print(f"{len(arquivos)} arquivos em {pasta}" + ("  (com OCR)" if ocr else ""))
    escaneados = []
    for n, arq in enumerate(arquivos, 1):
        chave = str(arq.relative_to(pasta))
        mtime = arq.stat().st_mtime
        ja = db.execute("SELECT mtime, paginas, paginas_sem_texto FROM livros WHERE arquivo=?", (chave,)).fetchone()
        precisa_ocr = ja and ja[1] and ja[2] / ja[1] > 0.5
        if ja and abs(ja[0] - mtime) < 1 and not (ocr and precisa_ocr):
            print(f"[{n}/{len(arquivos)}] já indexado: {chave}")
            if precisa_ocr:
                escaneados.append(chave)
            continue
        # retomada: se parou no meio (OCR demorado), continua da última página gravada
        prog = db.execute("SELECT pagina, vazias, mtime FROM progresso WHERE arquivo=?", (chave,)).fetchone()
        desde, vazias = (prog[0], prog[1]) if prog and abs(prog[2] - mtime) < 1 else (0, 0)
        if desde == 0:
            db.execute("DELETE FROM trechos WHERE arquivo=?", (chave,))
        else:
            print(f"[{n}/{len(arquivos)}] continuando {chave} da página {desde + 1}")
        titulo = arq.stem
        inicio, paginas, total = time.time(), desde, 0
        leitor = abrir_docx(arq) if arq.suffix.lower() == ".docx" else abrir_pdf(arq, ocr, desde)
        try:
            for pagina, bruto in leitor:
                paginas = pagina
                texto = limpar(bruto)
                if len(texto) < 40:
                    vazias += 1
                else:
                    for parte in fatiar(texto):
                        db.execute("INSERT INTO trechos (texto, titulo, materia, arquivo, pagina) VALUES (?,?,?,?,?)",
                                   (parte, titulo, materia, chave, pagina))
                        total += 1
                passo = 10 if ocr else 50
                if pagina % passo == 0:
                    db.execute("INSERT OR REPLACE INTO progresso VALUES (?,?,?,?)", (chave, pagina, vazias, mtime))
                    db.commit()
                    feitas = pagina - desde
                    seg = (time.time() - inicio) / max(feitas, 1)
                    print(f"    ... página {pagina}  ({seg:.1f}s/página)", flush=True)
        except Exception as erro:  # noqa: BLE001
            db.commit()
            print(f"[{n}/{len(arquivos)}] ERRO em {chave}: {type(erro).__name__}: {erro}")
            continue
        db.execute("INSERT OR REPLACE INTO livros VALUES (?,?,?,?,?,?)", (chave, titulo, materia, paginas, vazias, mtime))
        db.execute("DELETE FROM progresso WHERE arquivo=?", (chave,))
        db.commit()
        print(f"[{n}/{len(arquivos)}] {titulo}: {paginas} páginas, {total} trechos novos, {vazias} sem texto ({time.time() - inicio:.0f}s)")
        if paginas and vazias / paginas > 0.5:
            escaneados.append(chave)
    db.execute("INSERT INTO trechos(trechos) VALUES('optimize')")
    db.commit()
    if escaneados and not ocr:
        print("\nEstes livros são ESCANEADOS (imagem, sem texto). Para a IA ler, rode de novo com --ocr")
        print("(precisa do Tesseract com espanhol; veja o README):")
        for e in escaneados:
            print(f"    {e}")
    print(f"\nPronto: {saida}")


if __name__ == "__main__":
    raiz = Path(__file__).resolve().parent.parent
    ap = argparse.ArgumentParser(description="Indexa livros para o tutor do StudentMedical")
    ap.add_argument("pasta", help="pasta com os PDFs (ex.: D:\\documents\\Downloads\\Items01\\Anatomía)")
    ap.add_argument("--materia", default="anatomia", choices=["anatomia", "citologia", "biologia", "histologia", "fisiologia"])
    ap.add_argument("--saida", default=str(raiz / "backend" / "data" / "biblioteca.db"))
    ap.add_argument("--ocr", action="store_true", help="ler páginas escaneadas com Tesseract (espanhol)")
    ap.add_argument("--somente", help="só arquivos cujo caminho contém este texto (ex.: Latarjet)")
    a = ap.parse_args()
    tess = None
    if a.ocr:
        tess = achar_tessdata()
        if not tess:
            sys.exit("Não achei o Tesseract com espanhol (spa.traineddata). Instale o Tesseract-OCR para Windows "
                     "marcando o idioma Spanish, ou defina TESSDATA_PREFIX com a pasta tessdata.")
    try:
        indexar(a.pasta, a.saida, a.materia, tess, a.somente)
    except sqlite3.OperationalError as e:
        sys.exit(f"Erro no SQLite ({e}). Seu Python precisa de SQLite com FTS5 (o Python oficial do python.org tem).")
