import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { criarBoneco } from './boneco.js';
import { UNIVERSIDADES, TONS_PELE, CORES_CABELO } from './universidades.js';
import { MATERIAS, TEMAS } from './conteudo/anatomia.js';
import { T, IDIOMAS, VOZ_LANG } from './i18n.js';
import { perguntar, temServidor } from './tutor.js';

// ---------- estado (guardado no navegador) ----------
const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

const idiomaNavegador = (navigator.language || 'es').slice(0, 2);
let idioma = ler('sm.idioma', IDIOMAS.includes(idiomaNavegador) ? idiomaNavegador : 'es');
let perfil = ler('sm.perfil', null);
const novoPerfil = !perfil;
perfil = perfil || { id: 'a' + Math.random().toString(36).slice(2, 10), genero: 'mulher', univ: 'umax', nome: '', pele: TONS_PELE[1], cabelo: CORES_CABELO[0], touca: true };
let progresso = ler('sm.progresso', { pontos: 0, feitos: {} });
let tela = novoPerfil ? 'config' : 'temas';
let temaAtual = null, aba = 'aula', quizIdx = 0, quizAcertos = 0, respondida = false;
const chat = [];

const t = () => T[idioma];
const univ = () => UNIVERSIDADES.find(u => u.id === perfil.univ) || UNIVERSIDADES[0];
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- cena 3D ----------
const caixa = $('#cena');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
caixa.appendChild(renderer.domElement);
const cena = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
camera.position.set(0.35, 1.25, 3.6);
const controles = new OrbitControls(camera, renderer.domElement);
controles.target.set(0, 0.88, 0);
controles.enablePan = false;
controles.minDistance = 1.6;
controles.maxDistance = 5;
controles.minPolarAngle = 0.6;
controles.maxPolarAngle = 1.75;
controles.enableDamping = true;

cena.add(new THREE.HemisphereLight('#ffffff', '#8a9bb0', 1.6));
const sol = new THREE.DirectionalLight('#ffffff', 2.2);
sol.position.set(2, 4, 3);
sol.castShadow = true;
sol.shadow.mapSize.set(1024, 1024);
sol.shadow.camera.left = -1.5; sol.shadow.camera.right = 1.5; sol.shadow.camera.top = 2.2; sol.shadow.camera.bottom = -0.5;
cena.add(sol);
const luzFundo = new THREE.DirectionalLight('#cfe0ff', 0.8);
luzFundo.position.set(-3, 2, -2);
cena.add(luzFundo);
const chao = new THREE.Mesh(new THREE.CircleGeometry(0.9, 48), new THREE.ShadowMaterial({ opacity: 0.18 }));
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
cena.add(chao);

let boneco = null;
function montarBoneco() {
  if (boneco) {
    cena.remove(boneco.grupo);
    boneco.grupo.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
  }
  boneco = criarBoneco({ ...perfil, univ: univ() });
  cena.add(boneco.grupo);
  document.documentElement.style.setProperty('--univ', univ().scrub);
}

function redimensionar() {
  const w = caixa.clientWidth, h = caixa.clientHeight;
  renderer.setSize(w, h, false);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // enquadra o boneco inteiro (altura ~2 m) em tela larga ou estreita
  const tg = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const d = Math.max(1.12 / tg, 0.62 / (tg * camera.aspect));
  const dir = camera.position.clone().sub(controles.target).normalize();
  camera.position.copy(controles.target).addScaledVector(dir, d);
  controles.maxDistance = Math.max(5, d * 1.4);
}
new ResizeObserver(redimensionar).observe(caixa);

let anterior = performance.now();
renderer.setAnimationLoop((agora) => {
  const dt = Math.min(0.05, (agora - anterior) / 1000);
  anterior = agora;
  controles.update();
  if (boneco) boneco.tick(dt, agora / 1000);
  renderer.render(cena, camera);
});

// ---------- voz ----------
let filaFala = 0;
function escolherVoz() {
  const vozes = speechSynthesis.getVoices();
  const alvo = VOZ_LANG[idioma];
  const genero = perfil.genero === 'mulher' ? /female|mujer|mulher|paulina|luciana|francisca|helena|sabina|monica|samantha|zira|jenny|aria|google español|google português/i : /male|hombre|homem|jorge|diego|daniel|antonio|david|guy|pablo/i;
  const doIdioma = vozes.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(alvo.slice(0, 2)));
  return doIdioma.find(v => v.lang.replace('_', '-') === alvo && genero.test(v.name)) || doIdioma.find(v => genero.test(v.name)) ||
    doIdioma.find(v => v.lang.replace('_', '-') === alvo) || doIdioma[0] || null;
}
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};

function falar(texto) {
  const id = ++filaFala;
  const balao = $('#balao');
  balao.hidden = false;
  balao.textContent = texto;
  boneco && boneco.falar(true);
  return new Promise((resolve) => {
    const fim = () => { if (id === filaFala) boneco && boneco.falar(false); resolve(); };
    if (!('speechSynthesis' in window)) { setTimeout(fim, Math.min(9000, 600 + texto.length * 55)); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = VOZ_LANG[idioma];
    const v = escolherVoz();
    if (v) u.voice = v;
    u.rate = 1;
    u.onend = fim; u.onerror = fim;
    speechSynthesis.speak(u);
    // segurança: alguns navegadores não disparam onend
    setTimeout(() => { if (id === filaFala && !speechSynthesis.speaking) fim(); }, 1500 + texto.length * 90);
  });
}
function calar() { filaFala++; if ('speechSynthesis' in window) speechSynthesis.cancel(); boneco && boneco.falar(false); }

// ---------- telas ----------
function cabecalho() {
  document.documentElement.lang = idioma;
  $('#lema').textContent = t().lema;
  document.querySelectorAll('.idiomas button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === idioma)));
  $('#xp').textContent = `⭐ ${progresso.pontos} ${t().pontos}`;
  $('#btnTrocar').textContent = t().trocar;
  $('#btnTrocar').hidden = tela === 'config';
  $('#dicaGirar').textContent = t().girar;
}

function telaConfig() {
  const x = t();
  const opt = (campo, valor, rotulo) => `<button type="button" class="opt" data-campo="${campo}" data-valor="${valor}" aria-pressed="${perfil[campo] === valor}">${rotulo}</button>`;
  const cores = (campo, lista) => lista.map(c => `<button type="button" class="cor-btn" style="background:${c}" data-campo="${campo}" data-valor="${c}" aria-pressed="${perfil[campo] === c}" aria-label="${c}"></button>`).join('');
  return `
    <h2>${x.meuEstudante}</h2>
    <div class="campo"><span>${x.universidade}</span><div class="seg">
      ${UNIVERSIDADES.map(u => `<button type="button" class="univ" data-campo="univ" data-valor="${u.id}" aria-pressed="${perfil.univ === u.id}">
        <span class="cor" style="background:${u.scrub}"></span><span><b>${u.sigla}</b><small>${u.nome}</small></span></button>`).join('')}
    </div></div>
    <div class="campo"><span>&nbsp;</span><div class="seg">${opt('genero', 'mulher', '👩‍⚕️ ' + x.mulher)}${opt('genero', 'homem', '👨‍⚕️ ' + x.homem)}${`<button type="button" class="opt" data-campo="touca" data-valor="toggle" aria-pressed="${perfil.touca}">🧢 ${x.touca}</button>`}</div></div>
    <div class="campo"><label><span>${x.nome}</span><input type="text" id="nome" maxlength="18" value="${esc(perfil.nome)}" autocomplete="given-name"></label></div>
    <div class="campo"><span>${x.pele}</span><div class="seg">${cores('pele', TONS_PELE)}</div></div>
    <div class="campo"><span>${x.cabelo}</span><div class="seg">${cores('cabelo', CORES_CABELO)}</div></div>
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
    corpo = `<ol class="pontos">${tm.pontos[idioma].map((p, i) => `<li data-i="${i}">${esc(p)}</li>`).join('')}</ol>
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
  const painel = $('#painel');
  painel.innerHTML = tela === 'config' ? telaConfig() : tela === 'tema' ? telaTema() : telaTemas();
  ligar();
}

// ---------- eventos ----------
function ligar() {
  document.querySelectorAll('[data-campo]').forEach(b => b.onclick = () => {
    const c = b.dataset.campo;
    perfil[c] = c === 'touca' ? !perfil.touca : b.dataset.valor;
    montarBoneco();
    if (c === 'univ' || c === 'genero') boneco.acenar();
    render();
  });
  const nome = $('#nome');
  if (nome) nome.oninput = () => { perfil.nome = nome.value.trim(); clearTimeout(nome._t); nome._t = setTimeout(montarBoneco, 300); };
  const salvar = $('#salvar');
  if (salvar) salvar.onclick = () => { gravar('sm.perfil', perfil); montarBoneco(); tela = 'temas'; render(); boneco.acenar(); falar(t().saudacao(perfil.nome)); };

  document.querySelectorAll('[data-tema]').forEach(b => b.onclick = () => {
    temaAtual = TEMAS.find(x => x.id === b.dataset.tema);
    tela = 'tema'; aba = 'aula'; quizIdx = 0; quizAcertos = 0; chat.length = 0;
    render();
    falar(t().abrirTema(temaAtual.titulo[idioma]));
  });
  const vt = $('#voltarTemas'); if (vt) vt.onclick = () => { calar(); tela = 'temas'; render(); };
  document.querySelectorAll('[data-aba]').forEach(b => b.onclick = () => { calar(); aba = b.dataset.aba; if (aba === 'quiz') { quizIdx = 0; quizAcertos = 0; respondida = false; } render(); if (aba === 'quiz') lerPergunta(); });

  const ouvir = $('#ouvir');
  if (ouvir) ouvir.onclick = async () => {
    if (ouvir.dataset.tocando) { calar(); delete ouvir.dataset.tocando; ouvir.textContent = '🔊 ' + t().ouvir; return; }
    ouvir.dataset.tocando = '1'; ouvir.textContent = '⏹ ' + t().parar;
    const minha = filaFala + 1;
    const itens = document.querySelectorAll('.pontos li');
    for (let i = 0; i < itens.length; i++) {
      itens.forEach(li => li.classList.remove('atual'));
      itens[i].classList.add('atual');
      itens[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      await falar(temaAtual.pontos[idioma][i]);
      if (filaFala !== minha + i) break;
    }
    itens.forEach(li => li.classList.remove('atual'));
    delete ouvir.dataset.tocando; ouvir.textContent = '🔊 ' + t().ouvir;
  };
  const irQuiz = $('#irQuiz'); if (irQuiz) irQuiz.onclick = () => { calar(); aba = 'quiz'; quizIdx = 0; quizAcertos = 0; respondida = false; render(); lerPergunta(); };
  const refazer = $('#refazer'); if (refazer) refazer.onclick = () => { quizIdx = 0; quizAcertos = 0; respondida = false; render(); lerPergunta(); };
  const voltar = $('#voltar'); if (voltar) voltar.onclick = () => { tela = 'temas'; render(); };

  document.querySelectorAll('.opcao').forEach(b => b.onclick = () => {
    if (respondida) return;
    respondida = true;
    const q = temaAtual.quiz[quizIdx];
    const i = +b.dataset.i;
    const ok = i === q.c;
    document.querySelectorAll('.opcao').forEach(o => { o.disabled = true; if (+o.dataset.i === q.c) o.classList.add('certa'); });
    if (!ok) b.classList.add('errada');
    if (ok) { quizAcertos++; progresso.pontos += 10; boneco.acenar(); }
    const frase = `${ok ? t().certo : t().errado} ${q.e[idioma]}`;
    $('#explica').innerHTML = `<div class="explica">${esc(frase)}</div><div class="linha-botoes"><button type="button" class="btn prim" id="proxima">${t().proxima} →</button></div>`;
    $('#proxima').onclick = () => {
      quizIdx++; respondida = false;
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
    const inp = $('#txtPerg');
    const texto = inp.value.trim();
    if (!texto) return;
    chat.push({ quem: 'eu', texto });
    render();
    const r = await perguntar({ texto, idioma, tema: temaAtual && temaAtual.id, perfil });
    const resposta = r.resposta || t().naoSei;
    chat.push({ quem: 'ia', texto: resposta, fontes: r.fontes || [] });
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
  calar();
  idioma = b.dataset.lang;
  gravar('sm.idioma', idioma);
  render();
  if (tela === 'tema' && temaAtual) falar(t().abrirTema(temaAtual.titulo[idioma]));
  else if (tela !== 'config') falar(t().saudacao(perfil.nome));
});
$('#btnTrocar').onclick = () => { calar(); tela = 'config'; render(); };

montarBoneco();
redimensionar();
render();
if (!novoPerfil) { $('#balao').hidden = false; $('#balao').textContent = t().saudacao(perfil.nome); }
