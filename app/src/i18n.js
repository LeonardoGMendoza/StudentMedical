// Textos da interface nos 3 idiomas.
export const IDIOMAS = ['es', 'pt', 'en'];
export const VOZ_LANG = { es: 'es-PY', pt: 'pt-BR', en: 'en-US' };

export const T = {
  es: {
    ola: (g, n) => `¡Hola${n ? ', ' + n : ''}! ¿Cómo estás? Soy tu ${g === 'mulher' ? 'profesora' : 'profesor'} de anatomía. Elige un tema o habla conmigo.`,
    falar: 'Toca y habla', ouvindo: 'Te escucho…', pensando: 'Pensando…', naoEntendi: 'No entendí. Toca y habla otra vez.', semMic: 'Este navegador no escucha la voz. Usa Chrome o Safari.', micBloqueado: 'Permite el micrófono en el candado de la barra de direcciones.',
    abrindo: 'Mira, voy a separar las piezas.', fechando: 'Listo, las junto otra vez.', girando: 'Lo giro para que lo veas mejor.',
    explodir: 'Separar piezas', resetar: 'Centrar', tocarPeca: 'Toca una pieza para ver su nombre', carregando: 'Cargando…',
    comecar: 'Toca para empezar', esteE: (n) => `Esto es: ${n}.`, credito: 'Modelos 3D: BodyParts3D © DBCLS (CC BY 4.0)',
    lema: 'Aprende medicina con tu tutor de IA',
    meuEstudante: 'Mi estudiante', homem: 'Hombre', mulher: 'Mujer', universidade: 'Universidad',
    nome: 'Tu nombre', salvar: 'Empezar a estudiar',
    materias: 'Materias', emBreve: 'Pronto', temas: 'Temas de Anatomía',
    aula: 'Clase', quiz: 'Quiz', perguntar: 'Pregúntale a la IA',
    ouvir: 'Escuchar la clase', parar: 'Parar', comecarQuiz: 'Hacer el quiz', proxima: 'Siguiente',
    certo: '¡Correcto!', errado: 'Casi.', resultado: (a, n) => `Acertaste ${a} de ${n}.`,
    refazer: 'Repetir', voltar: 'Volver', paraAprofundar: 'Para profundizar en tus libros',
    placeholder: 'Ej.: ¿qué inerva el nervio radial?', enviar: 'Enviar',
    saudacao: (n) => `¡Hola${n ? ', ' + n : ''}! Soy tu tutor de anatomía. Elige un tema y estudiamos juntos.`,
    abrirTema: (t) => `Vamos con ${t}. Escucha la clase y después hacemos un quiz.`,
    semIA: 'Modo demo: respondo con el contenido de las clases. Con el servidor conectado, respondo con la IA y tus libros.',
    naoSei: 'Eso todavía no está en mis clases de demo. Con el servidor conectado, lo busco en tus libros.',
    pontos: 'puntos', girar: 'Arrastra para girar · pellizca para acercar', trocar: 'Cambiar estudiante', fontes: 'Fuentes'
  },
  pt: {
    ola: (g, n) => `Oi${n ? ', ' + n : ''}! Tudo bem? Sou ${g === 'mulher' ? 'sua professora' : 'seu professor'} de anatomia. Escolha um tema ou fale comigo.`,
    falar: 'Toque e fale', ouvindo: 'Estou ouvindo…', pensando: 'Pensando…', naoEntendi: 'Não entendi. Toque e fale de novo.', semMic: 'Este navegador não ouve a voz. Use o Chrome ou o Safari.', micBloqueado: 'Libere o microfone no cadeado da barra de endereço.',
    abrindo: 'Olha, vou separar as peças.', fechando: 'Pronto, juntei de novo.', girando: 'Vou girar para você ver melhor.',
    explodir: 'Separar peças', resetar: 'Centralizar', tocarPeca: 'Toque numa peça para ver o nome', carregando: 'Carregando…',
    comecar: 'Toque para começar', esteE: (n) => `Isto é: ${n}.`, credito: 'Modelos 3D: BodyParts3D © DBCLS (CC BY 4.0)',
    lema: 'Aprenda medicina com seu tutor de IA',
    meuEstudante: 'Meu estudante', homem: 'Homem', mulher: 'Mulher', universidade: 'Universidade',
    nome: 'Seu nome', salvar: 'Começar a estudar',
    materias: 'Matérias', emBreve: 'Em breve', temas: 'Temas de Anatomia',
    aula: 'Aula', quiz: 'Quiz', perguntar: 'Pergunte à IA',
    ouvir: 'Ouvir a aula', parar: 'Parar', comecarQuiz: 'Fazer o quiz', proxima: 'Próxima',
    certo: 'Certo!', errado: 'Quase.', resultado: (a, n) => `Você acertou ${a} de ${n}.`,
    refazer: 'Refazer', voltar: 'Voltar', paraAprofundar: 'Para aprofundar nos seus livros',
    placeholder: 'Ex.: o que o nervo radial inerva?', enviar: 'Enviar',
    saudacao: (n) => `Oi${n ? ', ' + n : ''}! Sou seu tutor de anatomia. Escolha um tema e vamos estudar juntos.`,
    abrirTema: (t) => `Vamos de ${t}. Ouça a aula e depois fazemos um quiz.`,
    semIA: 'Modo demo: respondo com o conteúdo das aulas. Com o servidor ligado, respondo com a IA e os seus livros.',
    naoSei: 'Isso ainda não está nas aulas da demo. Com o servidor ligado, eu procuro nos seus livros.',
    pontos: 'pontos', girar: 'Arraste para girar · pinça para aproximar', trocar: 'Trocar estudante', fontes: 'Fontes'
  },
  en: {
    ola: (g, n) => `Hi${n ? ', ' + n : ''}! How are you? I'm your anatomy ${g === 'mulher' ? 'teacher' : 'teacher'}. Pick a topic or talk to me.`,
    falar: 'Tap and speak', ouvindo: "I'm listening…", pensando: 'Thinking…', naoEntendi: "I didn't catch that. Tap and speak again.", semMic: "This browser can't hear voice. Use Chrome or Safari.", micBloqueado: 'Allow the microphone in the lock icon of the address bar.',
    abrindo: "Look, I'll separate the parts.", fechando: 'Done, I put them back together.', girando: "I'll turn it so you can see better.",
    explodir: 'Separate parts', resetar: 'Recenter', tocarPeca: 'Tap a part to see its name', carregando: 'Loading…',
    comecar: 'Tap to start', esteE: (n) => `This is the ${n}.`, credito: '3D models: BodyParts3D © DBCLS (CC BY 4.0)',
    lema: 'Learn medicine with your AI tutor',
    meuEstudante: 'My student', homem: 'Man', mulher: 'Woman', universidade: 'University',
    nome: 'Your name', salvar: 'Start studying',
    materias: 'Subjects', emBreve: 'Soon', temas: 'Anatomy topics',
    aula: 'Lesson', quiz: 'Quiz', perguntar: 'Ask the AI',
    ouvir: 'Listen to the lesson', parar: 'Stop', comecarQuiz: 'Take the quiz', proxima: 'Next',
    certo: 'Correct!', errado: 'Not quite.', resultado: (a, n) => `You got ${a} of ${n} right.`,
    refazer: 'Try again', voltar: 'Back', paraAprofundar: 'Go deeper in your books',
    placeholder: 'E.g.: what does the radial nerve supply?', enviar: 'Send',
    saudacao: (n) => `Hi${n ? ', ' + n : ''}! I'm your anatomy tutor. Pick a topic and let's study together.`,
    abrirTema: (t) => `Let's do ${t}. Listen to the lesson, then we'll take a quiz.`,
    semIA: 'Demo mode: I answer from the lessons. With the server connected, I answer with the AI and your books.',
    naoSei: "That isn't in the demo lessons yet. With the server connected, I'll look it up in your books.",
    pontos: 'points', girar: 'Drag to rotate · pinch to zoom', trocar: 'Change student', fontes: 'Sources'
  }
};
