// Tutor: usa o back-end (IA da Oracle + livros) quando existe; senão responde com as aulas da demo.
import { TEMAS } from './conteudo/anatomia.js';

function apiUrl() {
  const q = new URLSearchParams(location.search).get('api');
  if (q) { try { localStorage.setItem('sm.api', q); } catch (e) {} return q; }
  try { return localStorage.getItem('sm.api') || window.STUDENTMEDICAL_API || ''; } catch (e) { return window.STUDENTMEDICAL_API || ''; }
}

const PARADAS = new Set('el la los las de del que y en un una es por con para se al lo o a e do da dos das um uma no na o os as em com por para what does the of a an is are to in and on which how qué cual cuál como cómo quê qual quais'.split(' '));
const limpar = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ');
const palavras = (s) => limpar(s).split(/\s+/).filter(w => w.length > 2 && !PARADAS.has(w));

function respostaLocal(texto, idioma) {
  const busca = palavras(texto);
  let melhor = null, nota = 0;
  // procura nos 3 idiomas (o aluno pode perguntar em espanhol com a tela em inglês) e responde no idioma escolhido
  for (const tema of TEMAS) {
    for (const lingua of ['es', 'pt', 'en']) {
      tema.pontos[lingua].forEach((ponto, i) => {
        const alvo = new Set(palavras(ponto + ' ' + tema.titulo[lingua]));
        const n = busca.reduce((acc, w) => acc + (alvo.has(w) ? 1 : [...alvo].some(a => a.startsWith(w.slice(0, 5))) ? 0.5 : 0), 0);
        if (n > nota) { nota = n; melhor = { ponto: tema.pontos[idioma][i], tema }; }
      });
    }
  }
  if (!melhor || nota < 1.5) return null;
  return { resposta: melhor.ponto, fontes: melhor.tema.livros.slice(0, 2).map(l => ({ livro: l })), modo: 'demo' };
}

export async function perguntar({ texto, idioma, tema, perfil }) {
  const url = apiUrl();
  if (url) {
    try {
      const r = await fetch(url.replace(/\/$/, '') + '/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aluno: perfil.id, nome: perfil.nome || '', texto, idioma, materia: 'anatomia', tema: tema || '', universidade: perfil.univ })
      });
      if (r.ok) return await r.json();
    } catch (e) { /* cai no modo demo */ }
  }
  return respostaLocal(texto, idioma) || { resposta: null, fontes: [], modo: 'demo' };
}

export const temServidor = () => !!apiUrl();
