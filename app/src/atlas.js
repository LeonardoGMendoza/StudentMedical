// Atlas 3D de anatomia: carrega o recorte do tema (BodyParts3D), separa as peças ("explodir"),
// destaca o que o professor está explicando e mostra o nome da peça tocada.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const CORES = {
  skeletal: '#e9dfc9', muscular: '#b9473d', arterial: '#c8302c', venous: '#3462b4', nervous: '#f0c94a',
  cardiac: '#b23a3a', respiratory: '#e6a0a0', digestive: '#d98f78', urinary: '#cfa63a', lymphatic: '#8f6bb8',
  sensory: '#7fb3d5', connective: '#c9b79c', endocrine: '#9bc36b', reproductive: '#d7a1c5', integumentary: '#e8c4a8'
};
const DESTAQUE = new THREE.Color('#ffb020');

export class Atlas {
  constructor(caixa, aoSelecionar) {
    this.caixa = caixa;
    this.aoSelecionar = aoSelecionar;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    caixa.appendChild(this.renderer.domElement);
    this.cena = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.01, 50);
    this.controles = new OrbitControls(this.camera, this.renderer.domElement);
    this.controles.enableDamping = true;
    this.controles.addEventListener('change', () => this.pedirQuadro());
    this.cena.add(new THREE.HemisphereLight('#ffffff', '#5b6b80', 1.5));
    const luz = new THREE.DirectionalLight('#ffffff', 1.8);
    luz.position.set(1, 2, 3);
    this.camera.add(luz);
    this.cena.add(this.camera);
    this.grupo = new THREE.Group();
    this.cena.add(this.grupo);
    this.pecas = [];
    this.explosao = 0;
    this.selecionada = null;
    this.ativos = null;
    this._quadro = false;
    this._animando = 0;
    new ResizeObserver(() => this.redimensionar()).observe(caixa);
    this.redimensionar();
    this._ligarToque();
  }

  redimensionar() {
    const w = this.caixa.clientWidth || 1, h = this.caixa.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    // o quadro do professor cobre o canto esquerdo: desloca a imagem para centralizar o modelo na área livre
    const desvio = this.desvioEsquerda ? this.desvioEsquerda() : 0;
    if (desvio) this.camera.setViewOffset(w, h, -desvio / 2, 0, w, h); else this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();
    this.pedirQuadro();
  }

  pedirQuadro() {
    if (this._quadro) return;
    this._quadro = true;
    requestAnimationFrame(() => {
      this._quadro = false;
      const mexeu = this.controles.update();
      this._passoAnimacao();
      this.renderer.render(this.cena, this.camera);
      if (mexeu || this._animando > 0) this.pedirQuadro();
    });
  }

  async carregar(tema, base = './modelos/') {
    this.temaPedido = tema;
    this.limpar();
    const meta = await (await fetch(base + tema + '.json')).json();
    const buf = await (await fetch(base + tema + '.bin')).arrayBuffer();
    if (this.temaPedido && this.temaPedido !== tema) return;
    const lo = meta.min, esc = meta.max.map((v, k) => (v - lo[k]) || 1);
    const centro = new THREE.Vector3(...meta.min.map((v, k) => (v + meta.max[k]) / 2));
    this.centro = centro;
    const materiais = {};
    for (const p of meta.pecas) {
      const q = new Int16Array(buf, p.p, p.v * 3);
      const pos = new Float32Array(p.v * 3);
      for (let i = 0; i < pos.length; i++) pos[i] = lo[i % 3] + (q[i] + 32767) / 65534 * esc[i % 3] - centro.getComponent(i % 3);
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(new Int8Array(buf, p.no, p.v * 3), 3, true));
      g.setIndex(new THREE.BufferAttribute(p.u32 ? new Uint32Array(buf, p.ix, p.i) : new Uint16Array(buf, p.ix, p.i), 1));
      g.computeBoundingSphere();
      const cor = CORES[p.s] || '#cccccc';
      const m = new THREE.MeshStandardMaterial({ color: cor, roughness: p.s === 'skeletal' ? 0.7 : 0.55, metalness: 0, transparent: true, opacity: 1 });
      materiais[cor] = true;
      const malha = new THREE.Mesh(g, m);
      malha.userData = { nome: p.n, sistema: p.s, dir: new THREE.Vector3(...p.c).sub(centro), alvo: new THREE.Vector3(), cor: new THREE.Color(cor) };
      this.grupo.add(malha);
      this.pecas.push(malha);
    }
    this.fonte = meta.fonte;
    this.enquadrar(meta);
    this.aplicarExplosao(this.explosao, true);
    this.pedirQuadro();
  }

  limpar() {
    for (const m of this.pecas) { m.geometry.dispose(); m.material.dispose(); this.grupo.remove(m); }
    this.pecas = [];
    this.selecionada = null;
    this.ativos = null;
  }

  enquadrar(meta) {
    const tam = new THREE.Vector3(...meta.max.map((v, k) => v - meta.min[k]));
    // enquadra pela altura e pela largura (o que for mais apertado), deixando margem
    const livre = 1 - (this.desvioEsquerda ? this.desvioEsquerda() / (this.caixa.clientWidth || 1) : 0);
    const tg = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const raio = tam.length() / 2;
    const d = Math.max(tam.y / 2 / tg, Math.max(tam.x, tam.z) / 2 / (tg * this.camera.aspect * livre)) * 1.18 + Math.max(tam.x, tam.z) / 2;
    this.camera.position.set(0, tam.y * 0.05, d);
    this.camera.near = d / 100; this.camera.far = d * 10;
    this.camera.updateProjectionMatrix();
    this.controles.target.set(0, 0, 0);
    this.controles.minDistance = raio * 0.3;
    this.controles.maxDistance = d * 3;
    this.distInicial = d;
  }

  // 0 = montado, 1 = peças bem separadas
  aplicarExplosao(f, imediato = false) {
    this.explosao = f;
    for (const m of this.pecas) {
      m.userData.alvo.copy(m.userData.dir).multiplyScalar(f * 0.85);
      if (imediato) m.position.copy(m.userData.alvo);
    }
    // a câmera se afasta junto, para as peças separadas continuarem na tela
    if (this.distInicial) {
      const v = this.camera.position.clone().sub(this.controles.target);
      this.camera.position.copy(this.controles.target).add(v.setLength(this.distInicial * (1 + f * 0.9)));
    }
    this._animando = imediato ? 0 : 40;
    this.pedirQuadro();
  }

  _passoAnimacao() {
    if (this._animando <= 0) return;
    this._animando--;
    for (const m of this.pecas) m.position.lerp(m.userData.alvo, 0.18);
  }

  // Destaca as peças cujo nome (inglês) bate com as expressões; o resto fica translúcido
  destacar(expressoes) {
    const re = expressoes && expressoes.length ? new RegExp(expressoes.join('|'), 'i') : null;
    this.ativos = re;
    for (const m of this.pecas) {
      const sim = re ? re.test(m.userData.nome) : true;
      m.material.opacity = re && !sim ? 0.12 : 1;
      m.material.depthWrite = !(re && !sim);
      m.material.emissive.set(re && sim ? DESTAQUE : '#000000');
      m.material.emissiveIntensity = re && sim ? 0.28 : 0;
    }
    this.pedirQuadro();
  }

  // Centro (na tela, coordenadas da janela) das peças em destaque, ou de todo o modelo
  pontoDestaque() {
    const alvo = this.pecas.filter(m => !this.ativos || this.ativos.test(m.userData.nome));
    const lista = alvo.length ? alvo : this.pecas;
    const c = new THREE.Vector3();
    if (!lista.length) return null;
    for (const m of lista) c.add(m.userData.dir).add(m.userData.alvo);
    c.divideScalar(lista.length);
    c.project(this.camera);
    const r = this.renderer.domElement.getBoundingClientRect();
    return { x: r.left + (c.x + 1) / 2 * r.width, y: r.top + (1 - c.y) / 2 * r.height };
  }

  selecionar(malha) {
    if (this.selecionada) this.selecionada.material.color.copy(this.selecionada.userData.cor);
    this.selecionada = malha;
    if (malha) malha.material.color.set('#4fc3f7');
    this.pedirQuadro();
    this.aoSelecionar && this.aoSelecionar(malha ? malha.userData : null);
  }

  girar(graus) {
    const e = this.camera.position.clone().sub(this.controles.target);
    e.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(graus));
    this.camera.position.copy(this.controles.target).add(e);
    this.pedirQuadro();
  }

  resetar() {
    if (!this.distInicial) return;
    this.camera.position.set(0, 0, this.distInicial);
    this.controles.target.set(0, 0, 0);
    this.selecionar(null);
    this.pedirQuadro();
  }

  _ligarToque() {
    const el = this.renderer.domElement, ray = new THREE.Raycaster(), ponto = new THREE.Vector2();
    let ini = null;
    el.addEventListener('pointerdown', (e) => { ini = [e.clientX, e.clientY]; });
    el.addEventListener('pointerup', (e) => {
      if (!ini || Math.hypot(e.clientX - ini[0], e.clientY - ini[1]) > 6) return;
      const r = el.getBoundingClientRect();
      ponto.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ponto, this.camera);
      const visiveis = this.pecas.filter(m => m.material.opacity > 0.5);
      const hit = ray.intersectObjects(visiveis, false)[0];
      this.selecionar(hit ? hit.object : null);
    });
  }
}
