"""Indexa os livros (PDF e DOCX) de uma pasta para o tutor de IA buscar trechos.

Uso no Windows (PowerShell), dentro da pasta StudentMedical:
    pip install pypdf            (ou: pip install pymupdf, que é bem mais rápido)
    python ml/indexar_livros.py "D:\\documents\\Downloads\\Items01\\Anatomía" --materia anatomia

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


def abrir_pdf(caminho):
    """Gera (numero_pagina, texto). Usa PyMuPDF se tiver; senão pypdf."""
    try:
        import fitz  # PyMuPDF
        with fitz.open(caminho) as doc:
            for i, pag in enumerate(doc, 1):
                yield i, pag.get_text()
        return
    except ImportError:
        pass
    from pypdf import PdfReader
    leitor = PdfReader(str(caminho))
    for i, pag in enumerate(leitor.pages, 1):
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


def indexar(pasta, saida, materia):
    pasta = Path(pasta)
    db = Biblioteca.criar(saida)
    arquivos = sorted(p for p in pasta.rglob("*") if p.suffix.lower() in (".pdf", ".docx")
                      and ".sdr" not in str(p.parent) and p.stat().st_size > 1000)
    print(f"{len(arquivos)} arquivos em {pasta}")
    escaneados = []
    for n, arq in enumerate(arquivos, 1):
        chave = str(arq.relative_to(pasta))
        mtime = arq.stat().st_mtime
        ja = db.execute("SELECT mtime FROM livros WHERE arquivo=?", (chave,)).fetchone()
        if ja and abs(ja[0] - mtime) < 1:
            print(f"[{n}/{len(arquivos)}] já indexado: {chave}")
            continue
        db.execute("DELETE FROM trechos WHERE arquivo=?", (chave,))
        titulo = arq.stem
        inicio, paginas, vazias, total = time.time(), 0, 0, 0
        leitor = abrir_docx(arq) if arq.suffix.lower() == ".docx" else abrir_pdf(arq)
        try:
            for pagina, bruto in leitor:
                paginas += 1
                texto = limpar(bruto)
                if len(texto) < 40:
                    vazias += 1
                    continue
                for parte in fatiar(texto):
                    db.execute("INSERT INTO trechos (texto, titulo, materia, arquivo, pagina) VALUES (?,?,?,?,?)",
                               (parte, titulo, materia, chave, pagina))
                    total += 1
                if paginas % 50 == 0:
                    db.commit()
                    print(f"    ... página {paginas}", end="\r")
        except Exception as erro:  # noqa: BLE001
            print(f"[{n}/{len(arquivos)}] ERRO em {chave}: {type(erro).__name__}: {erro}")
            continue
        db.execute("INSERT OR REPLACE INTO livros VALUES (?,?,?,?,?,?)", (chave, titulo, materia, paginas, vazias, mtime))
        db.commit()
        print(f"[{n}/{len(arquivos)}] {titulo}: {paginas} páginas, {total} trechos, {vazias} sem texto ({time.time() - inicio:.0f}s)")
        if paginas and vazias / paginas > 0.5:
            escaneados.append(chave)
    db.execute("INSERT INTO trechos(trechos) VALUES('optimize')")
    db.commit()
    if escaneados:
        print("\nEstes livros parecem ESCANEADOS (imagem, sem texto). Para a IA ler, passe OCR antes, por exemplo:")
        print("    pip install ocrmypdf   (precisa do Tesseract com o idioma 'spa')")
        for e in escaneados:
            print(f'    ocrmypdf -l spa --skip-text "{pasta / e}" "{pasta / e}.ocr.pdf"')
    print(f"\nPronto: {saida}")


if __name__ == "__main__":
    raiz = Path(__file__).resolve().parent.parent
    ap = argparse.ArgumentParser(description="Indexa livros para o tutor do StudentMedical")
    ap.add_argument("pasta", help="pasta com os PDFs (ex.: D:\\documents\\Downloads\\Items01\\Anatomía)")
    ap.add_argument("--materia", default="anatomia", choices=["anatomia", "citologia", "biologia", "histologia", "fisiologia"])
    ap.add_argument("--saida", default=str(raiz / "backend" / "data" / "biblioteca.db"))
    a = ap.parse_args()
    try:
        indexar(a.pasta, a.saida, a.materia)
    except sqlite3.OperationalError as e:
        sys.exit(f"Erro no SQLite ({e}). Seu Python precisa de SQLite com FTS5 (o Python oficial do python.org tem).")
