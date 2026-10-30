"""Fichas das universidades (fatos verificados em fontes públicas, out/2026).
A IA usa isto para responder perguntas sobre a faculdade do aluno sem inventar.
Atualize quando souber de novidades (preços, datas e regras mudam: a IA deve mandar confirmar na secretaria)."""

FICHAS = {
    "umax": """UNIVERSIDAD MARÍA AUXILIADORA (UMAX)
- Carreira de Medicina habilitada desde 2008; cerca de mil médicos formados em seis promoções (dado de 2020).
- Medicina em Asunción ACREDITADA pela ANEAES (modelo nacional) e também pelo sistema ARCU-SUR do Mercosul (relatório ANEAES de dez/2025). A acreditação ARCU-SUR é um reconhecimento regional de qualidade.
- Diz ter o centro de simulação médica mais avançado do país.
- Oferece Medicina, Licenciatura em Enfermagem e Administração de Empresas.
- Tradição: Cerimônia da Bata Branca para os alunos do 1º semestre (ex.: convocatória de agosto de 2026).
- Uniforme: jaleco branco com scrub vinho/bordô.""",
    "ucp": """UNIVERSIDAD CENTRAL DEL PARAGUAY (UCP)
- Sede em Asunción e filiais em Ciudad del Este e Pedro Juan Caballero.
- A carreira de Medicina é só presencial, nas filiais de Ciudad del Este e Pedro Juan Caballero (cidades de fronteira com o Brasil; muitos alunos são brasileiros).
- A filial de Pedro Juan Caballero fica na Calle Naciones Unidas (Faculdade de Ciências da Saúde) e publica a revista científica MEDUCP desde 2024.
- Uniforme: scrub azul royal com jaleco branco.
- Sobre a acreditação ANEAES da Medicina da UCP: não tenho a informação confirmada; oriente consultar o site da ANEAES.""",
    "ums": """UNIVERSIDAD PRIVADA MARÍA SERRANA (UMS / UPMS)
- Criada pela Lei nº 3.694 de 2009. Sede central em Asunción (bairro Loma Pytã, Ruta Transchaco) e filiais em Ciudad del Este e Vallemí.
- Medicina em Asunción e em Ciudad del Este (cerca de 10 semestres).
- Histórico: em março de 2022 o CONES clausurou as duas carreiras de Medicina por irregularidades em documentos de alunos; a universidade recorreu à Justiça, e em outubro de 2023 o CONES levantou a clausura.
- No relatório da ANEAES de dez/2025 a acreditação das duas carreiras de Medicina aparece como "Postergada" (adiada), ou seja, ainda não acreditadas.
- Mantém convênios com universidades do México, Chile, Espanha, Brasil e Argentina.
- Uniforme: scrub verde com escudo dourado.
- Se o aluno perguntar se vale a pena estudar lá: apresente os fatos com equilíbrio (situação legal atual habilitada, acreditação ainda pendente) e sugira confirmar a situação mais recente no CONES e na ANEAES antes de se matricular. Não dê veredito.""",
}

GERAL = """MEDICINA NO PARAGUAI (geral)
- O CONES (Conselho Nacional de Educação Superior) habilita as carreiras; a ANEAES avalia e acredita a qualidade. Um curso pode estar habilitado e ainda não acreditado.
- O curso de Medicina dura em geral 6 anos (cerca de 12 semestres, mais de 7.000 horas), com internato no final. Os primeiros semestres costumam ter Anatomia, Biologia/Citologia, Histologia, Bioquímica e Fisiologia.
- Muitas faculdades ficam na fronteira com o Brasil (Ciudad del Este, Pedro Juan Caballero, Salto del Guairá), com grande número de alunos brasileiros.
- Preços, datas de matrícula e requisitos mudam: diga que não tem esse dado atualizado e mande confirmar na secretaria ou no site oficial."""


def ficha(universidade):
    partes = [FICHAS[universidade]] if universidade in FICHAS else []
    partes += [v for k, v in FICHAS.items() if k != universidade]
    return "\n\n".join(partes + [GERAL])
