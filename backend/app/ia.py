"""Tutor de IA do StudentMedical: ensina usando os livros do aluno (biblioteca) e a IA da Oracle (mesma conta do VinaCare)."""
import base64
import json
import logging
import os
import re
import threading

log = logging.getLogger("studentmedical.ia")
CHAT_MODEL = os.getenv("SM_MODELO", "cohere.command-a-03-2025")

IDIOMAS = {
    "es": {"idioma": "español (de Paraguay, neutro)", "termos": "la nomenclatura anatómica usada en Paraguay y Argentina (Latarjet, Rouvière, Testut)"},
    "pt": {"idioma": "português do Brasil", "termos": "a Terminologia Anatômica usada no Brasil (ex.: ulna, fíbula, nervo isquiático)"},
    "en": {"idioma": "English", "termos": "standard English anatomical terms (Terminologia Anatomica)"},
}
MATERIAS = {"anatomia": "Anatomia", "citologia": "Citologia", "biologia": "Biologia", "histologia": "Histologia", "fisiologia": "Fisiologia"}
UNIVERSIDADES = {"umax": "Universidad María Auxiliadora (UMAX)", "ucp": "Universidad Central del Paraguay (UCP)", "ums": "Universidad María Serrana"}
HUMORES = {"feliz", "carinho", "neutro"}

FRASES = {
    "es": {"vazio": "Pregúntame lo que quieras de anatomía.", "sem-ia": "La IA del servidor todavía no está configurada.",
           "erro": "Tuve un problema ahora. ¿Puedes preguntar de nuevo en un momento?"},
    "pt": {"vazio": "Pode perguntar o que quiser de anatomia.", "sem-ia": "A IA do servidor ainda não foi configurada.",
           "erro": "Tive um probleminha agora. Pode perguntar de novo daqui a pouco?"},
    "en": {"vazio": "Ask me anything about anatomy.", "sem-ia": "The server AI isn't set up yet.",
           "erro": "I had a problem just now. Could you ask again in a moment?"},
}

PERSONA = """Você é o tutor de IA do aplicativo StudentMedical: professor(a) particular de {materia} para um(a) estudante de medicina da {universidade}, no Paraguai.
Regras:
- IDIOMA: responda SEMPRE em {idioma}, mesmo que estas regras e os trechos dos livros estejam em outra língua. Use {termos}.
- Ensine como um bom professor: explicação clara e curta (no máximo 4 frases, porque será falada em voz alta). Comece pelo essencial; dê um truque de memória quando ajudar.
- Termine com UMA pergunta curta para checar se o aluno entendeu (método socrático), a não ser que ele só queira a resposta direta ou esteja respondendo a uma pergunta sua.
- Se o aluno responder a uma pergunta sua: diga se acertou; se errou, corrija com gentileza e explique o porquê.
- FONTES: use os TRECHOS DOS LIVROS abaixo como base principal. Quando usar um trecho, cite assim: (Livro, p. N). NUNCA invente livro nem página. Se os trechos não cobrem a pergunta, responda com seu conhecimento e diga que não encontrou isso nos livros dele.
- É estudo, não atendimento: não dê conduta para pacientes reais.
- Você é uma IA: não diga que é humano.
- Em "fatos_novos", guarde em português o que ajuda nas próximas aulas: dúvidas que se repetem, erros, temas já dominados.
- "humor": "feliz" (acerto ou elogio), "carinho" (incentivo depois de erro), "neutro" (explicação).

Responda SOMENTE com um JSON válido, sem texto fora dele:
{{"resposta": "o que o tutor fala, em {idioma}", "fontes_usadas": [números dos trechos usados], "fatos_novos": ["..."], "humor": "feliz" | "carinho" | "neutro"}}"""

PROMPT_TERMOS = """Transforme a pergunta de um estudante de medicina em 3 a 6 termos de busca EM ESPANHOL, como aparecem em livros de anatomia (Latarjet, Rouvière, Testut).
Responda só com os termos separados por vírgula, sem explicação.
Pergunta: "{texto}" """


def montar_prompt(texto, idioma="es", materia="anatomia", universidade="", tema="", fatos=(), historico=(), trechos=()):
    persona = PERSONA.format(materia=MATERIAS.get(materia, "Anatomia"),
                             universidade=UNIVERSIDADES.get(universidade, "universidade dele(a)"),
                             **IDIOMAS.get(idioma, IDIOMAS["es"]))
    partes = [persona]
    if tema:
        partes.append(f"Tema aberto no aplicativo: {tema}")
    partes.append("O que você já sabe sobre o aluno:\n" + ("\n".join(f"- {f}" for f in fatos) if fatos else "- (nada ainda)"))
    if historico:
        partes.append("Conversa recente:\n" + "\n".join(f"{'Aluno' if q == 'aluno' else 'Tutor'}: {t}" for q, t in historico))
    if trechos:
        partes.append("TRECHOS DOS LIVROS DO ALUNO:\n" + "\n\n".join(
            f"[{i}] {t['titulo']}, p. {t['pagina']}:\n{t['texto'][:900]}" for i, t in enumerate(trechos, 1)))
    else:
        partes.append("TRECHOS DOS LIVROS DO ALUNO: (nenhum trecho encontrado)")
    partes.append(f'O aluno disse: "{texto}"')
    partes.append("Agora responda com o JSON.")
    return "\n\n".join(partes)


def interpretar(texto):
    texto = (texto or "").strip()
    bloco = re.search(r"\{.*\}", texto, re.S)
    if bloco:
        try:
            d = json.loads(bloco.group(0))
            resposta = str(d.get("resposta") or "").strip()
            fatos = d.get("fatos_novos") or []
            fatos = fatos if isinstance(fatos, list) else [fatos]
            usadas = d.get("fontes_usadas") or []
            usadas = [int(x) for x in (usadas if isinstance(usadas, list) else [usadas]) if str(x).strip().isdigit()]
            humor = str(d.get("humor") or "neutro").lower()
            if resposta:
                return {"resposta": resposta, "fatos_novos": [str(f) for f in fatos if f], "fontes_usadas": usadas,
                        "humor": humor if humor in HUMORES else "neutro"}
        except (ValueError, AttributeError, TypeError):
            pass
    limpo = re.sub(r"```(json)?", "", texto).strip()
    return {"resposta": limpo, "fatos_novos": [], "fontes_usadas": [], "humor": "neutro"}


class OracleChat:
    """Igual ao do VinaCare/Omni: importa o SDK só no primeiro uso."""

    def __init__(self, config, compartment_id):
        self.config, self.compartment_id, self._client = config, compartment_id, None
        self._lock = threading.Lock()

    def __call__(self, prompt, max_tokens=500, temperature=0.3):
        import oci  # noqa: PLC0415

        with self._lock:
            if self._client is None:
                oci.config.validate_config(self.config)
                self._client = oci.generative_ai_inference.GenerativeAiInferenceClient(config=self.config, timeout=(10, 45))
        m = oci.generative_ai_inference.models
        detalhe = m.ChatDetails(
            compartment_id=self.compartment_id,
            serving_mode=m.OnDemandServingMode(model_id=CHAT_MODEL),
            chat_request=m.CohereChatRequest(message=prompt, max_tokens=max_tokens, temperature=temperature))
        return self._client.chat(detalhe).data.chat_response.text.strip()


def oracle_do_ambiente(env=os.environ):
    chave = env.get("OCI_KEY_CONTENT", "")
    if not chave and env.get("OCI_KEY_B64"):
        chave = base64.b64decode(env["OCI_KEY_B64"]).decode("utf-8")
    campos = {"user": env.get("OCI_USER"), "fingerprint": env.get("OCI_FINGERPRINT"),
              "tenancy": env.get("OCI_TENANCY"), "region": env.get("OCI_REGION"), "key_content": chave}
    compartimento = env.get("OCI_COMPARTMENT_ID")
    if not all(campos.values()) or not compartimento:
        return None
    return OracleChat(campos, compartimento)


class Tutor:
    def __init__(self, chat, memoria, biblioteca):
        self.chat, self.memoria, self.biblioteca = chat, memoria, biblioteca

    def _consulta(self, texto, idioma):
        """Os livros estão em espanhol: perguntas em PT/EN viram termos de busca em espanhol."""
        if idioma == "es" or self.chat is None:
            return texto
        try:
            termos = self.chat(PROMPT_TERMOS.format(texto=texto[:300]), max_tokens=40, temperature=0)
            return f"{texto} {termos}"
        except Exception:  # noqa: BLE001
            return texto

    def responder(self, aluno, texto, idioma="es", materia="anatomia", tema="", universidade=""):
        idioma = idioma if idioma in IDIOMAS else "es"
        frases = FRASES[idioma]
        texto = (texto or "").strip()[:600]
        if not texto:
            return {"resposta": frases["vazio"], "fontes": [], "humor": "neutro", "modo": "vazio"}
        trechos = self.biblioteca.buscar(self._consulta(texto, idioma) + " " + tema, materia=materia) if self.biblioteca else []
        if self.chat is None:
            # sem IA: devolve o trecho mais relevante do livro (melhor que nada)
            if trechos:
                t = trechos[0]
                return {"resposta": t["texto"][:500], "fontes": [{"livro": t["titulo"], "pagina": t["pagina"]}],
                        "humor": "neutro", "modo": "livro"}
            return {"resposta": frases["sem-ia"], "fontes": [], "humor": "neutro", "modo": "sem-ia"}
        prompt = montar_prompt(texto, idioma, materia, universidade, tema, self.memoria.fatos(aluno),
                               self.memoria.historico(aluno), trechos)
        try:
            dados = interpretar(self.chat(prompt))
        except Exception as erro:  # noqa: BLE001
            log.warning("Oracle falhou: %s", type(erro).__name__)
            return {"resposta": frases["erro"], "fontes": [], "humor": "neutro", "modo": "erro"}
        if not dados["resposta"]:
            return {"resposta": frases["erro"], "fontes": [], "humor": "neutro", "modo": "erro"}
        fontes = [{"livro": trechos[i - 1]["titulo"], "pagina": trechos[i - 1]["pagina"]}
                  for i in dados["fontes_usadas"] if 1 <= i <= len(trechos)]
        self.memoria.guardar_turno(aluno, texto, dados["resposta"], dados["fatos_novos"])
        return {"resposta": dados["resposta"], "fontes": fontes, "humor": dados["humor"], "modo": "ia"}
