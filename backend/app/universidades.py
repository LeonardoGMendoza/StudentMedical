"""Fichas das universidades e panorama da Medicina no Paraguai (fontes públicas; ANEAES dez/2025; verificado em out/2026).
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
- Medicina em Pedro Juan Caballero ACREDITADA pela ANEAES (modelo nacional), segundo o relatório de dez/2025. A filial de Ciudad del Este não aparece nessa lista de avaliadas.
- Uniforme: scrub azul royal com jaleco branco.""",
    "ums": """UNIVERSIDAD PRIVADA MARÍA SERRANA (UMS / UPMS)
- Criada pela Lei nº 3.694 de 2009. Sede central em Asunción (bairro Loma Pytã, Ruta Transchaco) e filiais em Ciudad del Este e Vallemí.
- Medicina em Asunción e em Ciudad del Este (cerca de 10 semestres).
- Histórico: em março de 2022 o CONES clausurou as duas carreiras de Medicina por irregularidades em documentos de alunos; a universidade recorreu à Justiça, e em outubro de 2023 o CONES levantou a clausura.
- No relatório da ANEAES de dez/2025 a acreditação das duas carreiras de Medicina aparece como "Postergada" (adiada), ou seja, ainda não acreditadas.
- Mantém convênios com universidades do México, Chile, Espanha, Brasil e Argentina.
- Uniforme: scrub verde com escudo dourado.
- Se o aluno perguntar se vale a pena estudar lá: apresente os fatos com equilíbrio (situação legal atual habilitada, acreditação ainda pendente) e sugira confirmar a situação mais recente no CONES e na ANEAES antes de se matricular. Não dê veredito.""",
}

GERAL = """MEDICINA NO PARAGUAI (panorama geral)
- Órgãos: o CONES (Conselho Nacional de Educação Superior) habilita as carreiras; a ANEAES (Agência Nacional de Avaliação e Acreditação) avalia e acredita a qualidade; o MEC registra os títulos. Um curso pode estar habilitado e ainda não acreditado. "Fines diagnósticos" = avaliação só de diagnóstico, sem acreditação.
- ARCU-SUR: acreditação regional do Mercosul, o selo de qualidade mais alto. Têm Medicina com ARCU-SUR: UNA (San Lorenzo), Universidad Católica (Asunción), UMAX (Asunción), Universidad Nacional de Itapúa (Encarnación) e Universidad Sudamericana (Pedro Juan Caballero).
- Pública e mais antiga: Universidad Nacional de Asunción (UNA), fundada em 1889; a Faculdade de Ciências Médicas fica em San Lorenzo. Outras públicas com Medicina acreditada: Nacional de Caaguazú (Coronel Oviedo), Nacional de Concepción, Nacional de Itapúa (Encarnación) e Nacional del Este (Minga Guazú). As públicas costumam ter ingresso por exame e são muito concorridas.
- Duração: em geral 6 anos (cerca de 12 semestres, mais de 7.000 horas), com internato no final. Primeiros semestres: Anatomia, Biologia/Citologia, Histologia, Bioquímica, Fisiologia.
- Fronteira com o Brasil: muitas faculdades privadas ficam em Ciudad del Este, Pedro Juan Caballero e Salto del Guairá, com grande número de alunos brasileiros. Em 2023, cerca de 76% dos títulos de médico registrados no MEC eram de estrangeiros (ABC Color). Em 2023 havia 8 faculdades de Medicina só em Ciudad del Este (ABC Color).
- Brasileiros que querem trabalhar no Brasil precisam revalidar o diploma (Revalida, do INEP).

SITUAÇÃO NA ANEAES — CARREIRAS DE MEDICINA AVALIADAS (relatório de 29/12/2025):
ACREDITADAS: Universidad Católica (Asunción, também ARCU-SUR; e Guairá); Universidad Central del Paraguay (Pedro Juan Caballero); UNIDA - Universidad de la Integración de las Américas (Ciudad del Este e Asunción); Universidad del Norte (Asunción e Pedro Juan Caballero); Universidad del Pacífico (Pedro Juan Caballero e Asunción); Universidad Internacional Tres Fronteras (Pedro Juan Caballero e Ciudad del Este); Universidad María Auxiliadora (Asunción, também ARCU-SUR; o nacional está em reavaliação); UNA (San Lorenzo, também ARCU-SUR; e Santa Rosa del Aguaray); Nacional de Caaguazú (Coronel Oviedo); Nacional de Concepción; Nacional de Itapúa (Encarnación, também ARCU-SUR); Nacional del Este (Minga Guazú); UPAP - Politécnica y Artística (Pedro Juan Caballero e San Lorenzo); Universidad Privada del Este (Ciudad del Este, Asunción e Presidente Franco); Santa Clara de Asís (Caaguazú); Universidad Sudamericana (Pedro Juan Caballero, também ARCU-SUR).
SÓ DIAGNÓSTICO (sem acreditação): Autónoma San Sebastián (San Lorenzo); Centro Médico Bautista (Asunción); Universidad del Sol (Ciudad del Este); Sudamericana (Salto del Guairá).
NÃO ACREDITADA: Autónoma San Sebastián (Pedro Juan Caballero).
POSTERGADA: María Serrana (Asunción e Ciudad del Este).
INSCRITAS NA CONVOCATÓRIA 2025 (em avaliação): Católica Campus Alto Paraná; Leonardo Da Vinci (Salto del Guairá); Nordeste del Paraguay (Santa Rita, diagnóstica); UPAP (Encarnación, Concepción e Ciudad del Este); Santa Clara de Asís (Caaguazú).
Faculdades que não aparecem na lista não foram avaliadas até essa data.

- Como orientar: para escolher faculdade, sugira olhar a acreditação na ANEAES, a habilitação no CONES, os hospitais onde se fazem as práticas, o custo de vida da cidade e a distância da família. Preços, datas de matrícula e requisitos mudam: diga que não tem esse dado atualizado e mande confirmar na secretaria ou no site oficial. Nunca diga qual é "a melhor"; compare com fatos."""


def ficha(universidade):
    partes = [FICHAS[universidade]] if universidade in FICHAS else []
    partes += [v for k, v in FICHAS.items() if k != universidade]
    return "\n\n".join(partes + [GERAL])
