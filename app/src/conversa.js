// Conversa do professor: cumprimentos, perguntas pessoais e memória do aluno (guardada no aparelho).
// Perguntas de anatomia vão para o tutor (IA com os livros, ou as aulas da demo).
import { TEMAS } from './conteudo/anatomia.js';

const ler = (k, p) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : p; } catch (e) { return p; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

export const NOME_PROF = { mulher: 'Clara', homem: 'Rafael' };

export function memoria() {
  return ler('sm.memoria', { visitas: 0, ultimaVisita: 0, ultimoTema: '', temas: [], fatos: [], historico: [] });
}
export function lembrar(m) {
  m.historico = (m.historico || []).slice(-20);
  m.fatos = (m.fatos || []).slice(-30);
  gravar('sm.memoria', m);
}
export function registrarVisita() {
  const m = memoria();
  const nova = Date.now() - (m.ultimaVisita || 0) > 30 * 60 * 1000;   // mais de 30 min = nova visita
  if (nova) m.visitas = (m.visitas || 0) + 1;
  m.ultimaVisita = Date.now();
  lembrar(m);
  return m;
}
export function registrarTema(id) {
  const m = memoria();
  m.ultimoTema = id;
  if (!m.temas.includes(id)) m.temas.push(id);
  lembrar(m);
}
export function registrarFala(quem, texto) {
  const m = memoria();
  m.historico.push([quem, texto.slice(0, 300)]);
  lembrar(m);
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿¡!?.,;:]/g, ' ').replace(/\s+/g, ' ').trim();
const nomeTema = (id, l) => { const t = TEMAS.find(x => x.id === id); return t ? t.titulo[l] : ''; };

function periodo(texto) {
  const n = norm(texto);
  if (/(bom dia|buenos dias|buen dia|good morning)/.test(n)) return 'dia';
  if (/(boa tarde|buenas tardes|good afternoon)/.test(n)) return 'tarde';
  if (/(boa noite|buenas noches|good evening|good night)/.test(n)) return 'noite';
  return '';
}
const P = {
  es: { dia: 'Buenos días', tarde: 'Buenas tardes', noite: 'Buenas noches', '': 'Hola' },
  pt: { dia: 'Bom dia', tarde: 'Boa tarde', noite: 'Boa noite', '': 'Oi' },
  en: { dia: 'Good morning', tarde: 'Good afternoon', noite: 'Good evening', '': 'Hi' }
};

// Frase de boas-vindas que usa a memória ("da última vez estudamos tórax")
export function boasVindas(idioma, perfil, saudacao = '') {
  const m = memoria(), nome = perfil.nome ? ', ' + perfil.nome : '', eu = NOME_PROF[perfil.genero];
  const oi = P[idioma][saudacao] || P[idioma][''];
  const tema = m.ultimoTema && nomeTema(m.ultimoTema, idioma);
  if (m.visitas > 1 && tema) {
    return {
      es: `¡${oi}${nome}! Qué bueno verte de nuevo. La última vez estudiamos ${tema}. ¿Seguimos con eso o prefieres otro tema?`,
      pt: `${oi}${nome}! Que bom te ver de novo. Da última vez estudamos ${tema}. Vamos continuar ou prefere outro tema?`,
      en: `${oi}${nome}! Good to see you again. Last time we studied ${tema}. Shall we continue or pick another topic?`
    }[idioma];
  }
  return {
    es: `¡${oi}${nome}! ¿Cómo estás? Soy ${perfil.genero === 'mulher' ? 'la profesora' : 'el profesor'} ${eu}, tu ${perfil.genero === 'mulher' ? 'profesora' : 'profesor'} de anatomía. Elige un tema o habla conmigo.`,
    pt: `${oi}${nome}! Tudo bem? Sou ${perfil.genero === 'mulher' ? 'a professora' : 'o professor'} ${eu}, ${perfil.genero === 'mulher' ? 'sua professora' : 'seu professor'} de anatomia. Escolha um tema ou fale comigo.`,
    en: `${oi}${nome}! How are you? I'm ${eu}, your anatomy teacher. Pick a topic or talk to me.`
  }[idioma];
}

// Responde conversa do dia a dia; devolve null quando é pergunta de anatomia (vai para o tutor)
export function conversar(texto, idioma, perfil, aoMudarNome) {
  const n = norm(texto), m = memoria(), eu = NOME_PROF[perfil.genero], nome = perfil.nome;
  const R = (es, pt, en) => ({ es, pt, en }[idioma]);

  // "me chamo X" / "mi nombre es X" / "my name is X"
  const mn = n.match(/(?:me chamo|meu nome e|me llamo|mi nombre es|my name is|i am|soy|sou o|sou a)\s+([a-z]+)/);
  if (mn && mn[1].length > 1 && !/(estudante|estudiante|student|medico|doctor)/.test(mn[1])) {
    const novo = mn[1].charAt(0).toUpperCase() + mn[1].slice(1);
    aoMudarNome && aoMudarNome(novo);
    return R(`¡Mucho gusto, ${novo}! Ya me acordaré de tu nombre.`, `Prazer, ${novo}! Vou lembrar do seu nome.`, `Nice to meet you, ${novo}! I'll remember your name.`);
  }
  // você lembra de mim? / ¿te acuerdas? / do you remember?
  if (/(lembra|se lembra|te acuerdas|recuerdas|remember)/.test(n)) {
    const temas = m.temas.map(id => nomeTema(id, idioma)).filter(Boolean);
    if (!temas.length) return R(`Claro${nome ? ', ' + nome : ''}. Todavía no estudiamos ningún tema juntos. ¿Empezamos?`, `Claro${nome ? ', ' + nome : ''}. Ainda não estudamos nenhum tema juntos. Vamos começar?`, `Of course${nome ? ', ' + nome : ''}. We haven't studied a topic together yet. Shall we start?`);
    return R(`¡Claro${nome ? ', ' + nome : ''}! Ya estudiamos ${temas.join(', ')}. La última vez fue ${nomeTema(m.ultimoTema, 'es')}.`,
             `Claro${nome ? ', ' + nome : ''}! Já estudamos ${temas.join(', ')}. A última vez foi ${nomeTema(m.ultimoTema, 'pt')}.`,
             `Of course${nome ? ', ' + nome : ''}! We've studied ${temas.join(', ')}. Last time it was ${nomeTema(m.ultimoTema, 'en')}.`);
  }
  // como vai?
  if (/(como vai|como voce esta|tudo bem|como estas|como esta usted|que tal|how are you)/.test(n)) {
    return R(`Muy bien, ¡gracias por preguntar! ¿Y tú${nome ? ', ' + nome : ''}? ¿Listo para estudiar un poco de anatomía?`,
             `Estou bem, obrigado por perguntar! E você${nome ? ', ' + nome : ''}? Pronto para estudar um pouco de anatomia?`,
             `I'm well, thanks for asking! And you${nome ? ', ' + nome : ''}? Ready to study some anatomy?`);
  }
  // bem / bien / fine (resposta ao "e você?")
  if (/^(bem|tudo bem|tudo otimo|estou bem|bien|muy bien|estoy bien|fine|good|great|i m fine|im fine)( e voce| y tu| and you)?$/.test(n)) {
    return R('¡Qué bueno! Elige un tema o pregúntame lo que quieras.', 'Que bom! Escolha um tema ou me pergunte o que quiser.', 'Great! Pick a topic or ask me anything.');
  }
  // qual é o seu nome?
  if (/(seu nome|como te chamas|como se chama|tu nombre|como te llamas|your name|quem e voce|quien eres|who are you)/.test(n)) {
    return R(`Me llamo ${eu}. Soy una inteligencia artificial que te ayuda a estudiar medicina.`, `Meu nome é ${eu}. Sou uma inteligência artificial que te ajuda a estudar medicina.`, `My name is ${eu}. I'm an AI that helps you study medicine.`);
  }
  // obrigado
  if (/(obrigad|valeu|gracias|thank)/.test(n)) {
    return R('¡De nada! Estoy aquí para ayudarte.', 'De nada! Estou aqui para te ajudar.', "You're welcome! I'm here to help.");
  }
  // tchau
  if (/(tchau|ate logo|ate amanha|adios|chau|hasta luego|hasta manana|bye|see you)/.test(n)) {
    return R(`¡Hasta luego${nome ? ', ' + nome : ''}! Buen estudio.`, `Até logo${nome ? ', ' + nome : ''}! Bons estudos.`, `See you${nome ? ', ' + nome : ''}! Happy studying.`);
  }
  // cumprimento (oi, hola, boa noite...)
  if (/^(oi|ola|hola|hello|hi|hey|e ai|buenas|bom dia|boa tarde|boa noite|buenos dias|buen dia|buenas tardes|buenas noches|good morning|good afternoon|good evening|good night)\b/.test(n) && n.split(' ').length <= 6) {
    return boasVindas(idioma, perfil, periodo(texto)).replace('Elige un tema o habla conmigo.', '¿Qué estudiamos hoy?').replace('Escolha um tema ou fale comigo.', 'O que vamos estudar hoje?').replace('Pick a topic or talk to me.', 'What shall we study today?');
  }
  return null;
}
