window.__smStarted = true;
import { Professor, ehIOS, modoSom } from './professor.js';
import { conversar, boasVindas, registrarVisita, registrarTema, registrarFala, NOME_PROF } from './conversa.js';
import { Atlas } from './atlas.js';
import { UNIVERSIDADES } from './universidades.js';
import { MATERIAS, TEMAS } from './conteudo/anatomia.js';
import { nomePeca } from './conteudo/glossario.js';
import { T, IDIOMAS, VOZ_LANG } from './i18n.js';
import { perguntar, temServidor } from './tutor.js';

// ---------- estado (guardado no navegador) ----------
const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

const idiomaNavegador = (navigator.language || 'es').slice(0, 2);
let idioma = ler('sm.idioma', IDIOMAS.includes(idiomaNavegador) ? idiomaNavegador : 'es');
let perfil = ler('sm.perfil', null);
const novoPerfil = !perfil;
perfil = perfil || { id: 'a' + Math.random().toString(36).slice(2, 10), genero: 'mulher', univ: 'umax', nome: '' };
let progresso = ler('sm.progresso', { pontos: 0, feitos: {} });
let tela = novoPerfil ? 'config' : 'temas';
let temaAtual = null, aba = 'aula', quizIdx = 0, quizAcertos = 0, respondida = false, audioLiberado = false;
const chat = [];

const t = () => T[idioma];
const univ = () => UNIVERSIDADES.find(u => u.id === perfil.univ) || UNIVERSIDADES[0];
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- professor (avatar realista) ----------
const statusProf = (txt) => { $('#profStatus').textContent = txt || ''; };
let professor = null;
try { professor = new Professor($('#prof')); } catch (e) { console.error(e); statusProf('3D indisponível neste navegador.'); }

async function vestirProfessor() {
  if (!professor) return;
  document.documentElement.style.setProperty('--univ', univ().scrub);
  statusProf(t().carregando);
  try {
    await professor.vestirE(perfil, univ(), (ev) => { if (ev.lengthComputable) statusProf(`${t().carregando} ${Math.round(ev.loaded / ev.total * 100)}%`); });
    statusProf('');
  } catch (e) { console.error(e); statusProf('⚠️'); }
}

// ---------- atlas 3D ----------
const atlas = new Atlas($('#atlas'), (peca) => {
  if (!peca) { $('#peca').textContent = ''; return; }
  const nome = nomePeca(peca.nome, idioma);
  $('#peca').textContent = nome;
  if (ultimoToque && professor) professor.apontar(ultimoToque.x, ultimoToque.y, 2.2);
  falar(t().esteE(nome));
});
atlas.desvioEsquerda = () => { const pf = $('#prof'); return $('#palco').dataset.modo === 'atlas' && pf ? pf.offsetWidth + 14 : 0; };
$('#explodir').oninput = (e) => atlas.aplicarExplosao(e.target.value / 100);
let ultimoToque = null;
$('#atlas').addEventListener('pointerup', (e) => { ultimoToque = { x: e.clientX, y: e.clientY }; }, true);
$('#btnCentro').onclick = () => { atlas.resetar(); atlas.destacar(null); };

function modoPalco(m) { $('#palco').dataset.modo = m; setTimeout(() => atlas.redimensionar(), 400); }

// ---------- voz ----------
function escolherVoz() {
  if (!('speechSynthesis' in window)) return null;
  const vozes = speechSynthesis.getVoices(), alvo = VOZ_LANG[idioma];
  const fem = /female|mujer|mulher|paulina|luciana|francisca|helena|sabina|monica|samantha|zira|jenny|aria|tania|camila|maria|google español|google português/i;
  const masc = /male|hombre|homem|jorge|diego|daniel|antonio|david|guy|pablo|mario|alex/i;
  const gen = perfil.genero === 'mulher' ? fem : masc;
  const doIdioma = vozes.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(alvo.slice(0, 2)));
  const nota = (v) => (v.lang.replace('_', '-') === alvo ? 100 : 0) + (gen.test(v.name) ? 50 : 0) + (/natural|neural|online|premium|enhanced/i.test(v.name) ? 30 : 0);
  return doIdioma.sort((a, b) => nota(b) - nota(a))[0] || null;
}
if ('speechSynthesis' in window) speechSynthesis.getVoices();

// Voz neural da nuvem (Azure): primeiro o servidor do StudentMedical; se falhar, o do VinaCare.
// No iPhone é ela que toca alto depois do microfone (pelo <audio>, canal de mídia).
const SERVIDOR = ((import.meta.env && import.meta.env.VITE_API_URL) || 'https://studentmedical.sandlj.com.br').replace(/\/$/, '');
const VOZES_NUVEM = [
  { url: SERVIDOR + '/api/voz', corpo: (texto) => ({ texto, idioma, genero: perfil.genero }) },
  { url: 'https://vinacare.sandlj.com.br/api/voz', corpo: (texto) => ({ texto, assistente: NOME_PROF[perfil.genero], idioma }) }
];
let nuvemFalhou = false, avisouFalha = false;
function precisaNuvem() {
  if (ehIOS || !('speechSynthesis' in window)) return true;
  const v = escolherVoz();
  return !v || !v.lang.replace('_', '-').startsWith(VOZ_LANG[idioma].slice(0, 2));
}
async function falarPelaNuvem(texto) {
  let ultimoErro = null;
  for (const v of VOZES_NUVEM) {
    try { await professor.falarNuvem(texto, v.url, v.corpo(texto.slice(0, 600))); return true; }
    catch (e) { ultimoErro = e; console.warn('Voz da nuvem falhou em', v.url, e); }
  }
  if (!avisouFalha) {   // mostra o motivo uma vez (no iPhone não há console)
    avisouFalha = true;
    const b = $('#balao'); b.hidden = false;
    b.textContent = '⚠️ voz da nuvem: ' + String((ultimoErro && ultimoErro.message) || ultimoErro);
  }
  return false;
}

let filaFala = 0;
async function falar(texto) {
  const id = ++filaFala;
  const balao = $('#balao');
  balao.hidden = false;
  balao.textContent = texto;
  if (!professor || !audioLiberado) return;
  professor.parar();
  modoSom('playback');
  if (!nuvemFalhou && precisaNuvem()) {
    if (await falarPelaNuvem(texto)) return id === filaFala;
    nuvemFalhou = true; setTimeout(() => { nuvemFalhou = false; }, 30000);
  }
  await professor.falarComVoz(texto, { lang: VOZ_LANG[idioma], voz: escolherVoz() });
  return id === filaFala;
}
function calar() { filaFala++; professor && professor.parar(); }

// O navegador só libera o som depois de um toque: no primeiro toque o professor cumprimenta (igual ao VinaCare)
let cumprimentou = false;
// Igual ao VinaCare: destrava o player de áudio DENTRO de um clique/toque (o iPhone só aceita assim).
// Chamado em todo clique; o próprio player ignora se já estiver destravado.
function liberarAudio() {
  audioLiberado = true;
  professor && professor.liberarAudio();
}
document.addEventListener('click', liberarAudio, true);
document.addEventListener('touchend', liberarAudio, true);
function cumprimentar() {
  if (cumprimentou) return;
  cumprimentou = true;
  liberarAudio();
  professor && professor.acenar();
  professor && professor.humor('feliz');
  falar(boasVindas(idioma, perfil));
}
document.addEventListener('click', (e) => {
  // toque no palco (fora dos controles) ou no microfone = começar a conversa
  if (!cumprimentou && tela !== 'config' && e.target.closest('#palco') && !e.target.closest('.barra-atlas') && !e.target.closest('#mic')) {
    setTimeout(cumprimentar, 50);
  }
}, true);

// ---------- telas ----------
function cabecalho() {
  document.documentElement.lang = idioma;
  $('#lema').textContent = t().lema;
  document.querySelectorAll('.idiomas button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === idioma)));
  $('#xp').textContent = `⭐ ${progresso.pontos} ${t().pontos}`;
  $('#btnTrocar').textContent = t().trocar;
  $('#btnTrocar').hidden = tela === 'config';
  $('#dicaGirar').textContent = t().girar;
  $('#rotExplodir').textContent = t().explodir;
  $('#btnCentro').textContent = t().resetar;
  $('#credito').textContent = t().credito;
  $('#mic').setAttribute('aria-label', t().falar);
  if ($('#mic').dataset.estado === 'pronto') $('#dicaVoz').textContent = cumprimentou ? t().falar : t().comecar;
  if (!$('#peca').textContent && tela === 'tema') $('#peca').textContent = '';
}

function telaConfig() {
  const x = t();
  const opt = (campo, valor, rotulo) => `<button type="button" class="opt" data-campo="${campo}" data-valor="${valor}" aria-pressed="${perfil[campo] === valor}">${rotulo}</button>`;
  return `
    <h2>${x.meuEstudante}</h2>
    <div class="campo"><span>${x.universidade}</span><div class="seg">
      ${UNIVERSIDADES.map(u => `<button type="button" class="univ" data-campo="univ" data-valor="${u.id}" aria-pressed="${perfil.univ === u.id}">
        <span class="cor" style="background:${u.scrub}"></span><span><b>${u.sigla}</b><small>${u.nome}</small></span></button>`).join('')}
    </div></div>
    <div class="campo"><span>&nbsp;</span><div class="seg">${opt('genero', 'mulher', '👩‍⚕️ ' + x.mulher)}${opt('genero', 'homem', '👨‍⚕️ ' + x.homem)}</div></div>
    <div class="campo"><label><span>${x.nome}</span><input type="text" id="nome" maxlength="18" value="${esc(perfil.nome)}" autocomplete="given-name"></label></div>
    <button type="button" class="btn prim" id="salvar">${x.salvar} →</button>`;
}

function telaTemas() {
  const x = t();
  return `
    <h3>${x.materias}</h3>
    <div class="materias">${MATERIAS.map(m => `<button type="button" class="chip" ${m.ativo ? 'aria-pressed="true"' : 'disabled'}>${m.icone} ${m.nome[idioma]}${m.ativo ? '' : ` <span class="breve">${x.emBreve}</span>`}</button>`).join('')}</div>
    <h3>${x.temas}</h3>
    <div class="temas">${TEMAS.map(tm => `<button type="button" class="tema" data-tema="${tm.id}">
      <span class="ic" aria-hidden="true">${tm.icone}</span><b>${tm.titulo[idioma]}</b>
      ${progresso.feitos[tm.id] ? `<span class="feito">✓ ${progresso.feitos[tm.id]}/${tm.quiz.length}</span>` : ''}</button>`).join('')}</div>`;
}

function telaTema() {
  const x = t(), tm = temaAtual;
  const abas = ['aula', 'quiz', 'perguntar'].map(a => `<button type="button" role="tab" data-aba="${a}" aria-selected="${aba === a}">${x[a]}</button>`).join('');
  let corpo = '';
  if (aba === 'aula') {
    corpo = `<p class="aviso">👆 ${x.tocarPeca}</p>
      <ol class="pontos">${tm.pontos[idioma].map((p, i) => `<li data-i="${i}" tabindex="0">${esc(p)}</li>`).join('')}</ol>
      <div class="linha-botoes"><button type="button" class="btn prim" id="ouvir">🔊 ${x.ouvir}</button>
      <button type="button" class="btn" id="irQuiz">${x.comecarQuiz} →</button></div>
      <div class="livros"><b>📚 ${x.paraAprofundar}</b><ul>${tm.livros.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>`;
  } else if (aba === 'quiz') {
    if (quizIdx >= tm.quiz.length) {
      corpo = `<p class="pergunta">${x.resultado(quizAcertos, tm.quiz.length)}</p>
        <div class="linha-botoes"><button type="button" class="btn prim" id="refazer">${x.refazer}</button><button type="button" class="btn" id="voltar">${x.voltar}</button></div>`;
    } else {
      const q = tm.quiz[quizIdx];
      corpo = `<div class="progresso">${quizIdx + 1} / ${tm.quiz.length}</div>
        <p class="pergunta">${esc(q.p[idioma])}</p>
        <div class="opcoes">${q.o[idioma].map((op, i) => `<button type="button" class="opcao" data-i="${i}">${esc(op)}</button>`).join('')}</div>
        <div id="explica"></div>`;
    }
  } else {
    corpo = `${temServidor() ? '' : `<div class="aviso">${x.semIA}</div>`}
      <div class="chat" id="chat">${chat.map(m => `<div class="msg ${m.quem}">${esc(m.texto)}${m.fontes && m.fontes.length ? `<div class="fontes">📚 ${x.fontes}: ${m.fontes.map(f => esc(f.livro + (f.pagina ? ', p. ' + f.pagina : ''))).join(' · ')}</div>` : ''}</div>`).join('')}</div>
      <form class="perg" id="formPerg"><input id="txtPerg" type="text" placeholder="${esc(x.placeholder)}" autocomplete="off" required><button class="btn prim" type="submit">${x.enviar}</button></form>`;
  }
  return `<button type="button" class="btn" id="voltarTemas">← ${x.temas}</button>
    <h2>${tm.icone} ${tm.titulo[idioma]}</h2><div class="abas" role="tablist">${abas}</div>${corpo}`;
}

function render() {
  cabecalho();
  $('#painel').innerHTML = tela === 'config' ? telaConfig() : tela === 'tema' ? telaTema() : telaTemas();
  modoPalco(tela === 'tema' ? 'atlas' : 'avatar');
  ligar();
}

// ---------- aula: o professor explica e o atlas destaca ----------
// A mão "abre" o modelo com dois dedos no ponto indicado e as peças se separam junto
function abrirComDedos(alvo = 0.4) {
  const p = atlas.pontoDestaque();
  if (!p) return;
  const mao = $('#mao');
  mao.style.transform = '';
  mao.style.left = p.x + 'px';
  mao.style.top = p.y + 'px';
  mao.classList.remove('abrindo'); void mao.offsetWidth; mao.classList.add('abrindo');
  setTimeout(() => { atlas.aplicarExplosao(alvo); $('#explodir').value = Math.round(alvo * 100); }, 600);
  professor && professor.apontar(p.x, p.y);
}
function fecharModelo() { atlas.aplicarExplosao(0); $('#explodir').value = 0; }

async function explicarPonto(i) {
  const itens = document.querySelectorAll('.pontos li');
  itens.forEach(li => li.classList.toggle('atual', +li.dataset.i === i));
  if (itens[i]) itens[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  fecharModelo();
  atlas.destacar([temaAtual.destaques[i]]);
  setTimeout(() => abrirComDedos(0.35), 450);   // o professor aponta e "abre" o que vai explicar
  return falar(temaAtual.pontos[idioma][i]);
}

async function abrirTema(id) {
  temaAtual = TEMAS.find(x => x.id === id);
  registrarTema(id);
  tela = 'tema'; aba = 'aula'; quizIdx = 0; quizAcertos = 0; chat.length = 0;
  $('#explodir').value = 0; atlas.explosao = 0; $('#peca').textContent = '';
  render();
  falar(t().abrirTema(temaAtual.titulo[idioma]));
  try { await atlas.carregar(temaAtual.id); } catch (e) { console.error(e); return; }
  const p = atlas.pontoDestaque();
  if (p && professor) professor.apontar(p.x, p.y, 2.5);
}

// ---------- eventos ----------
function ligar() {
  document.querySelectorAll('[data-campo]').forEach(b => b.onclick = async () => {
    perfil[b.dataset.campo] = b.dataset.valor;
    render();
    await vestirProfessor();
  });
  const nome = $('#nome');
  if (nome) nome.oninput = () => { perfil.nome = nome.value.trim(); };
  const salvar = $('#salvar');
  if (salvar) salvar.onclick = async () => {
    liberarAudio();
    gravar('sm.perfil', perfil);
    tela = 'temas'; render();
    await vestirProfessor();   // recarrega com o nome bordado
    cumprimentou = false;
    cumprimentar();
  };

  document.querySelectorAll('[data-tema]').forEach(b => b.onclick = () => { liberarAudio(); abrirTema(b.dataset.tema); });
  const vt = $('#voltarTemas'); if (vt) vt.onclick = () => { calar(); tela = 'temas'; render(); };
  document.querySelectorAll('[data-aba]').forEach(b => b.onclick = () => {
    calar(); aba = b.dataset.aba; atlas.destacar(null);
    if (aba === 'quiz') { quizIdx = 0; quizAcertos = 0; respondida = false; }
    render(); if (aba === 'quiz') lerPergunta();
  });
  document.querySelectorAll('.pontos li').forEach(li => {
    li.onclick = () => { calar(); explicarPonto(+li.dataset.i); };
    li.onkeydown = (e) => { if (e.key === 'Enter') li.click(); };
  });

  const ouvir = $('#ouvir');
  if (ouvir) ouvir.onclick = async () => {
    if (ouvir.dataset.tocando) { calar(); delete ouvir.dataset.tocando; ouvir.textContent = '🔊 ' + t().ouvir; return; }
    ouvir.dataset.tocando = '1'; ouvir.textContent = '⏹ ' + t().parar;
    for (let i = 0; i < temaAtual.pontos[idioma].length; i++) {
      const continua = await explicarPonto(i);
      if (continua === false || !ouvir.dataset.tocando) break;
    }
    document.querySelectorAll('.pontos li').forEach(li => li.classList.remove('atual'));
    fecharModelo();
    if (professor) professor.gesto('thumbup', 2);
    delete ouvir.dataset.tocando; ouvir.textContent = '🔊 ' + t().ouvir;
  };
  const irQuiz = $('#irQuiz'); if (irQuiz) irQuiz.onclick = () => { calar(); aba = 'quiz'; quizIdx = 0; quizAcertos = 0; respondida = false; atlas.destacar(null); render(); lerPergunta(); };
  const refazer = $('#refazer'); if (refazer) refazer.onclick = () => { quizIdx = 0; quizAcertos = 0; respondida = false; render(); lerPergunta(); };
  const voltar = $('#voltar'); if (voltar) voltar.onclick = () => { tela = 'temas'; render(); };

  document.querySelectorAll('.opcao').forEach(b => b.onclick = () => {
    if (respondida) return;
    respondida = true;
    const q = temaAtual.quiz[quizIdx], i = +b.dataset.i, ok = i === q.c;
    document.querySelectorAll('.opcao').forEach(o => { o.disabled = true; if (+o.dataset.i === q.c) o.classList.add('certa'); });
    if (!ok) b.classList.add('errada');
    if (ok) { quizAcertos++; progresso.pontos += 10; professor && professor.humor('feliz'); professor && professor.gesto('thumbup', 2); } else { professor && professor.humor('carinho'); professor && professor.gesto('shrug', 1.5); }
    const frase = `${ok ? t().certo : t().errado} ${q.e[idioma]}`;
    $('#explica').innerHTML = `<div class="explica">${esc(frase)}</div><div class="linha-botoes"><button type="button" class="btn prim" id="proxima">${t().proxima} →</button></div>`;
    $('#proxima').onclick = () => {
      quizIdx++; respondida = false; professor && professor.humor('neutro');
      if (quizIdx >= temaAtual.quiz.length) {
        progresso.feitos[temaAtual.id] = Math.max(progresso.feitos[temaAtual.id] || 0, quizAcertos);
        gravar('sm.progresso', progresso);
        render(); falar(t().resultado(quizAcertos, temaAtual.quiz.length));
      } else { render(); lerPergunta(); }
    };
    cabecalho();
    gravar('sm.progresso', progresso);
    falar(frase);
  });

  const form = $('#formPerg');
  if (form) form.onsubmit = async (e) => {
    e.preventDefault();
    const texto = $('#txtPerg').value.trim();
    if (!texto) return;
    chat.push({ quem: 'eu', texto });
    render();
    const social = conversar(texto, idioma, perfil, mudarNome);
    if (social) { chat.push({ quem: 'ia', texto: social }); render(); falar(social); return; }
    const r = await perguntar({ texto, idioma, tema: temaAtual && temaAtual.id, perfil });
    const resposta = r.resposta || t().naoSei;
    chat.push({ quem: 'ia', texto: resposta, fontes: r.fontes || [] });
    if (r.tema === temaAtual.id && r.ponto >= 0) atlas.destacar([temaAtual.destaques[r.ponto]]);
    render();
    const c = $('#chat'); c && c.lastElementChild && c.lastElementChild.scrollIntoView({ block: 'nearest' });
    $('#txtPerg') && $('#txtPerg').focus();
    falar(resposta);
  };
}

function lerPergunta() {
  if (temaAtual && quizIdx < temaAtual.quiz.length) falar(temaAtual.quiz[quizIdx].p[idioma]);
}

document.querySelectorAll('.idiomas button').forEach(b => b.onclick = () => {
  liberarAudio(); calar();
  idioma = b.dataset.lang;
  gravar('sm.idioma', idioma);
  render();
  if (atlas.selecionada) $('#peca').textContent = nomePeca(atlas.selecionada.userData.nome, idioma);
  if (tela === 'tema' && temaAtual) falar(t().abrirTema(temaAtual.titulo[idioma]));
  else if (tela !== 'config') falar(boasVindas(idioma, perfil));
});
$('#btnTrocar').onclick = () => { calar(); tela = 'config'; render(); };


// ---------- conversa por voz ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, ouvindo = false, ouvido = '';
function estadoMic(e) {
  $('#mic').dataset.estado = e;
  $('#dicaVoz').textContent = e === 'ouvindo' ? t().ouvindo : e === 'pensando' ? t().pensando : (cumprimentou ? t().falar : t().comecar);
}
async function mudarNome(novo) {
  perfil.nome = novo;
  gravar('sm.perfil', perfil);
  vestirProfessor();   // borda o nome novo no jaleco
}
const tem = (txt, re) => re.test(txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

async function voceDisse(texto) {
  texto = (texto || '').trim();
  if (!texto) { estadoMic('pronto'); return; }
  // comandos do atlas
  if (tela === 'tema') {
    if (tem(texto, /\b(separa|abre|abri|abrir|open|separate|explod)/)) { abrirComDedos(0.6); estadoMic('pronto'); return falar(t().abrindo); }
    if (tem(texto, /\b(junta|juntar|cierra|cerrar|fecha|fechar|close|monta|une)\b/)) { fecharModelo(); estadoMic('pronto'); return falar(t().fechando); }
    if (tem(texto, /\b(gira|girar|rota|rotar|rotate|turn|vira)\b/)) { atlas.girar(70); estadoMic('pronto'); return falar(t().girando); }
  }
  // abrir um tema pelo nome ("vamos estudar torax")
  const alvo = TEMAS.find(tm => ['es', 'pt', 'en'].some(l => tem(texto, new RegExp(tm.titulo[l].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')))));
  if (alvo && (!temaAtual || alvo.id !== temaAtual.id) && texto.split(/\s+/).length <= 6) { estadoMic('pronto'); return abrirTema(alvo.id); }
  // conversa do dia a dia (boa noite, como vai, você lembra de mim...) com memória
  registrarFala('aluno', texto);
  const social = conversar(texto, idioma, perfil, mudarNome);
  if (social) {
    registrarFala('professor', social);
    if (tela === 'tema') { chat.push({ quem: 'eu', texto }, { quem: 'ia', texto: social }); if (aba === 'perguntar') render(); }
    estadoMic('pronto');
    professor && professor.humor('feliz');
    return falar(social);
  }
  // pergunta para o tutor
  estadoMic('pensando');
  const r = await perguntar({ texto, idioma, tema: temaAtual && temaAtual.id, perfil });
  const resposta = r.resposta || t().naoSei;
  if (tela === 'tema') {
    chat.push({ quem: 'eu', texto }, { quem: 'ia', texto: resposta, fontes: r.fontes || [] });
    if (r.tema === temaAtual.id && r.ponto >= 0) { atlas.destacar([temaAtual.destaques[r.ponto]]); setTimeout(() => abrirComDedos(0.35), 300); }
    if (aba === 'perguntar') render();
  }
  registrarFala('professor', resposta);
  estadoMic('pronto');
  professor && professor.humor(r.humor || 'neutro');
  await falar(resposta);
}

if (SR) {
  rec = new SR(); rec.interimResults = true; rec.continuous = false;
  rec.onresult = (e) => {
    let txt = '', final = false;
    for (const r of e.results) { txt += r[0].transcript; if (r.isFinal) final = true; }
    ouvido = txt;
    $('#balao').hidden = false; $('#balao').textContent = '🎤 ' + txt;
    if (final) { ouvindo = false; try { rec.abort(); } catch (er) {} modoSom('playback'); const fala = ouvido; ouvido = ''; voceDisse(fala); }
  };
  rec.onerror = (e) => { modoSom('playback'); ouvindo = false; ouvido = ''; estadoMic('pronto'); if (e.error === 'not-allowed') $('#dicaVoz').textContent = t().micBloqueado; };
  rec.onend = () => { modoSom('playback'); if (!ouvindo) return; ouvindo = false; if (ouvido) { const f = ouvido; ouvido = ''; voceDisse(f); } else estadoMic('pronto'); };
}
$('#mic').onclick = (e) => {
  e.stopPropagation();
  liberarAudio();
  if (!cumprimentou) { cumprimentar(); estadoMic('pronto'); return; }
  if (!rec) { $('#balao').hidden = false; $('#balao').textContent = t().semMic; return; }
  if ($('#mic').dataset.estado === 'pensando') return;
  if (ouvindo) { try { rec.stop(); } catch (er) {} return; }
  calar();
  try { modoSom('play-and-record'); rec.lang = VOZ_LANG[idioma]; ouvido = ''; rec.start(); ouvindo = true; estadoMic('ouvindo'); }
  catch (er) { $('#dicaVoz').textContent = t().naoEntendi; }
};

render();
estadoMic('pronto');
vestirProfessor();
registrarVisita();
if (!novoPerfil) { $('#balao').hidden = false; $('#balao').textContent = boasVindas(idioma, perfil); }
