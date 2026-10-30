import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.biblioteca import Biblioteca  # noqa: E402
from app.ia import Tutor, interpretar, montar_prompt  # noqa: E402
from app.memoria import Memoria  # noqa: E402


def biblioteca_de_teste(pasta):
    caminho = Path(pasta) / "biblioteca.db"
    db = Biblioteca.criar(caminho)
    db.execute("INSERT INTO trechos (texto, titulo, materia, arquivo, pagina) VALUES (?,?,?,?,?)",
               ("El nervio patético o troclear inerva el músculo oblicuo mayor del ojo.", "Latarjet Tomo 1", "anatomia", "a.pdf", 210))
    db.execute("INSERT INTO trechos (texto, titulo, materia, arquivo, pagina) VALUES (?,?,?,?,?)",
               ("El nervio mediano atraviesa el conducto carpiano.", "Rouvière Tomo 3", "anatomia", "b.pdf", 88))
    db.commit()
    db.close()
    return Biblioteca(caminho)


class IAFalsa:
    def __init__(self, resposta):
        self.resposta, self.prompts = resposta, []

    def __call__(self, prompt, **_):
        self.prompts.append(prompt)
        if prompt.startswith("Transforme"):
            return "nervio troclear, oblicuo mayor"
        return self.resposta


class TestTutor(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.bib = biblioteca_de_teste(self.tmp)
        self.mem = Memoria(self.tmp)

    def test_busca_acha_trecho_sem_acento(self):
        r = self.bib.buscar("nervio pateti troclear")
        self.assertEqual(r[0]["pagina"], 210)

    def test_responde_no_idioma_e_cita_fonte_real(self):
        ia = IAFalsa(json.dumps({"resposta": "The trochlear nerve supplies the superior oblique (Latarjet Tomo 1, p. 210). Which way does it move the eye?",
                                 "fontes_usadas": [1, 7], "fatos_novos": ["confunde IV e VI"], "humor": "neutro"}))
        r = Tutor(ia, self.mem, self.bib).responder("a1", "What does the trochlear nerve supply?", idioma="en")
        self.assertEqual(r["modo"], "ia")
        self.assertEqual(r["fontes"], [{"livro": "Latarjet Tomo 1", "pagina": 210}])  # índice 7 inventado é descartado
        self.assertIn("English", ia.prompts[-1])
        self.assertIn("Latarjet Tomo 1, p. 210", ia.prompts[-1])
        self.assertEqual(self.mem.fatos("a1"), ["confunde IV e VI"])

    def test_sem_ia_devolve_trecho_do_livro(self):
        r = Tutor(None, self.mem, self.bib).responder("a2", "conducto carpiano nervio", idioma="es")
        self.assertEqual(r["modo"], "livro")
        self.assertEqual(r["fontes"][0]["pagina"], 88)

    def test_erro_da_oracle_nao_derruba(self):
        def quebra(*a, **k):
            raise RuntimeError("caiu")
        r = Tutor(quebra, self.mem, self.bib).responder("a3", "hola", idioma="pt")
        self.assertEqual(r["modo"], "erro")

    def test_interpretar_texto_solto(self):
        self.assertEqual(interpretar("só texto")["resposta"], "só texto")

    def test_prompt_tem_universidade_e_idioma(self):
        p = montar_prompt("x", idioma="es", universidade="umax", nome="Leonardo", genero="homem")
        self.assertIn("María Auxiliadora", p)
        self.assertIn("español", p)
        self.assertIn("Leonardo", p)
        self.assertIn("Rafael", p)
        self.assertIn("SIGA O ASSUNTO DO ALUNO", p)
        self.assertIn("ARCU-SUR", p)
        self.assertLess(p.index("MARÍA AUXILIADORA (UMAX)"), p.index("CENTRAL DEL PARAGUAY"))


if __name__ == "__main__":
    unittest.main()
