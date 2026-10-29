"""Biblioteca do aluno: busca em texto completo (SQLite FTS5) nos livros indexados por ml/indexar_livros.py.

O arquivo biblioteca.db fica só no seu PC / servidor (nunca no GitHub), porque contém trechos de livros.
"""
import re
import sqlite3
import threading
from pathlib import Path

ESQUEMA = """
CREATE TABLE IF NOT EXISTS livros (arquivo TEXT PRIMARY KEY, titulo TEXT, materia TEXT, paginas INTEGER,
    paginas_sem_texto INTEGER, mtime REAL);
CREATE VIRTUAL TABLE IF NOT EXISTS trechos USING fts5(texto, titulo UNINDEXED, materia UNINDEXED,
    arquivo UNINDEXED, pagina UNINDEXED, tokenize = 'unicode61 remove_diacritics 2');
"""

PARADAS = set("""el la los las de del que y en un una es por con para se al lo o a e do da dos das um uma no na os as em
com como cual cuál qué que quê qual quais what does the of an is are to in and on which how sobre entre su sus seu sua
me te nos explica explicar explique dime diga tell about""".split())


def termos(texto, maximo=8):
    palavras = re.findall(r"[\wáéíóúâêôãõçñü]+", (texto or "").lower())
    vistos = []
    for p in palavras:
        if len(p) > 2 and p not in PARADAS and p not in vistos:
            vistos.append(p)
    return vistos[:maximo]


class Biblioteca:
    def __init__(self, caminho):
        self.caminho = Path(caminho)
        self.lock = threading.Lock()
        self.db = None
        if self.caminho.exists():
            self.db = sqlite3.connect(str(self.caminho), check_same_thread=False)

    @staticmethod
    def criar(caminho):
        Path(caminho).parent.mkdir(parents=True, exist_ok=True)
        db = sqlite3.connect(str(caminho))
        db.executescript(ESQUEMA)
        db.commit()
        return db

    def disponivel(self):
        return self.db is not None

    def resumo(self):
        if not self.db:
            return {"livros": 0, "trechos": 0}
        with self.lock:
            livros = self.db.execute("SELECT titulo, materia, paginas, paginas_sem_texto FROM livros ORDER BY titulo").fetchall()
            n = self.db.execute("SELECT count(*) FROM trechos").fetchone()[0]
        return {"livros": len(livros), "trechos": n,
                "lista": [{"titulo": t, "materia": m, "paginas": p, "sem_texto": s} for t, m, p, s in livros]}

    def buscar(self, consulta, materia=None, limite=5):
        """Devolve os trechos mais relevantes: [{titulo, pagina, texto}]."""
        if not self.db:
            return []
        lista = termos(consulta)
        if not lista:
            return []
        # prefixo (*) para pegar variações: "nervio" acha "nervios", "nerviosa"...
        expr = " OR ".join(f'"{t}"*' for t in lista)
        sql = "SELECT titulo, pagina, texto, bm25(trechos) AS nota FROM trechos WHERE trechos MATCH ?"
        args = [expr]
        if materia:
            sql += " AND materia = ?"
            args.append(materia)
        sql += " ORDER BY nota LIMIT ?"
        args.append(limite)
        with self.lock:
            try:
                rows = self.db.execute(sql, args).fetchall()
            except sqlite3.OperationalError:
                return []
        return [{"titulo": t, "pagina": p, "texto": x} for t, p, x, _ in rows]
