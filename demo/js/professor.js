// Professor(a) 3D realista (os mesmos avatares do VinaCare) vestido(a) com o uniforme da universidade.
// Mulher (Avaturn): blazer vira jaleco branco e a camisa vira o scrub da universidade.
// Homem (MetaPerson): blusa e calça viram scrub da universidade, sem logotipo.
import * as THREE from 'three';
import { TalkingHead } from './talkinghead/talkinghead.mjs';
import { LipsyncPt_br } from './talkinghead/lipsync-pt_br.mjs';

const AVATARES = {
  mulher: { url: './avatars/avaturn.glb', body: 'F', avatarMood: 'neutral', lipsyncLang: 'pt_br',
    retarget: { Hips: { y: 0.03 }, Spine: { y: 0.02 }, Spine1: { y: 0.02, z: 0.01 }, Spine2: { y: 0.02, z: 0.01 }, Neck: { z: 0.02, y: 0.01 }, Head: { z: 0.02 }, LeftShoulder: { rx: -0.5 }, RightShoulder: { rx: -0.5 }, scaleToHipsLevel: 1.0 },
    baseline: { headRotateX: -0.05, eyeBlinkLeft: 0.15, eyeBlinkRight: 0.15 } },
  homem: { url: './avatars/avatarsdk.glb', body: 'M', avatarMood: 'neutral', lipsyncLang: 'pt_br',
    retarget: { Neck: { z: -0.01, rx: -0.15 }, Neck1: { z: -0.01, rx: -0.15 }, Neck2: { z: -0.01, rx: -0.15 }, LeftShoulder: { rz: -0.3 }, RightShoulder: { rz: 0.3 }, scaleToEyesLevel: 1.0, origin: { y: -0.1 } },
    baseline: { headRotateX: -0.04, eyeBlinkLeft: 0.05, eyeBlinkRight: 0.05 } }
};
const HUMOR = { feliz: 'happy', carinho: 'love', neutro: 'neutral' };

const rgb = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

// Repinta uma textura pixel a pixel, mantendo dobras e sombras do tecido
function repintar(textura, fn) {
  const img = textura.image;
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height), px = d.data;
  for (let i = 0; i < px.length; i += 4) fn(px, i);
  g.putImageData(d, 0, 0);
  const nova = new THREE.CanvasTexture(c);
  nova.flipY = textura.flipY; nova.colorSpace = textura.colorSpace; nova.channel = textura.channel;
  nova.wrapS = textura.wrapS; nova.wrapT = textura.wrapT;
  nova.anisotropy = 4;
  return nova;
}

function bordado(univ, nome) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 360;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 512, 360);
  g.strokeStyle = univ.bordado; g.lineWidth = 14;
  g.beginPath(); g.arc(256, 120, 92, 0, Math.PI * 2); g.stroke();
  g.fillStyle = univ.bordado; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 64px Arial, sans-serif'; g.fillText(univ.sigla, 256, 126);
  g.font = 'bold 42px Arial, sans-serif'; g.fillText('MEDICINA', 256, 258);
  g.fillStyle = '#26323a'; g.font = '38px Arial, sans-serif'; g.fillText((nome || '').slice(0, 18), 256, 318);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function vestir(gltf, genero, univ, nome) {
  const [sr, sg, sb] = rgb(univ.scrub);
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material;
    if (genero === 'mulher' && o.name === 'avaturn_look_0' && m.map) {
      // tecido escuro (blazer/calça) -> jaleco branco; camisa clara -> scrub da universidade
      m.map = repintar(m.map, (p, i) => {
        const l = (p[i] + p[i + 1] + p[i + 2]) / 3;
        if (l < 140) { const v = Math.min(255, 196 + l * 0.75); p[i] = v; p[i + 1] = v; p[i + 2] = v + 2; }
        else { const k = Math.min(1.15, l / 215); p[i] = sr * k; p[i + 1] = sg * k; p[i + 2] = sb * k; }
      });
      m.metalness = 0; m.metalnessMap = null; m.roughness = 0.85; m.needsUpdate = true;
    }
    if (genero === 'homem' && (o.name === 'outfit_top' || o.name === 'outfit_bottom') && m.map) {
      const ref = o.name === 'outfit_top' ? 92 : 95; // brilho médio do tecido original
      // 1) acha o logotipo/etiqueta (azul-marinho ou branco, diferente do tecido azul-piscina) e alarga 3 px
      const img = m.map.image, W = img.width, H = img.height;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
      const orig = g.getImageData(0, 0, W, H).data;
      let mascara = new Uint8Array(W * H);
      if (o.name === 'outfit_top') {
        for (let j = 0; j < W * H; j++) {
          const r = orig[j * 4], gg = orig[j * 4 + 1], b = orig[j * 4 + 2];
          if (b - gg > 22 || r > 120 || (r + gg + b) / 3 < 40) mascara[j] = 1;
        }
        for (let passo = 0; passo < 3; passo++) {
          const nova = mascara.slice();
          for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
            const j = y * W + x;
            if (!mascara[j] && (mascara[j - 1] || mascara[j + 1] || mascara[j - W] || mascara[j + W])) nova[j] = 1;
          }
          mascara = nova;
        }
      }
      // 2) pinta na cor do scrub mantendo as dobras; onde era logotipo usa o brilho médio do tecido
      m.map = repintar(m.map, (p, i) => {
        const l = mascara[i / 4] ? ref : (p[i] + p[i + 1] + p[i + 2]) / 3;
        const k = Math.max(0.55, Math.min(1.25, l / ref));
        p[i] = sr * k; p[i + 1] = sg * k; p[i + 2] = sb * k;
      });
      // 3) apaga o relevo do logotipo no mapa de normais (mesmas coordenadas)
      if (o.name === 'outfit_top' && m.normalMap && m.normalMap.image && m.normalMap.image.width === W) {
        m.normalMap = repintar(m.normalMap, (p, i) => { if (mascara[i / 4]) { p[i] = 128; p[i + 1] = 128; p[i + 2] = 255; } });
      }
      m.needsUpdate = true;
    }
    if (o.name === 'outfit_shoes' || o.name === 'avaturn_shoes_0') {
      m.color = new THREE.Color('#f4f4f4'); m.map = null; m.needsUpdate = true;
    }
  });
  // bordado no peito, preso ao osso do tórax (acompanha a respiração)
  gltf.scene.updateMatrixWorld(true);
  const peito = gltf.scene.getObjectByName('Spine2');
  if (peito) {
    const placa = new THREE.Mesh(new THREE.PlaneGeometry(genero === 'mulher' ? 0.075 : 0.09, genero === 'mulher' ? 0.053 : 0.064),
      new THREE.MeshStandardMaterial({ map: bordado(univ, nome), transparent: true, roughness: 0.8, depthWrite: false }));
    const pos = new THREE.Vector3();
    peito.getWorldPosition(pos);
    const off = genero === 'mulher' ? new THREE.Vector3(0.085, 0.07, 0.125) : new THREE.Vector3(0.075, 0.06, 0.13);
    const mundo = pos.add(off);
    placa.position.copy(peito.worldToLocal(mundo.clone()));
    const q = new THREE.Quaternion();
    peito.getWorldQuaternion(q);
    placa.quaternion.copy(q.invert());
    placa.rotateY(0.25);
    placa.renderOrder = 2;
    peito.add(placa);
  }
}

export class Professor {
  constructor(caixa) {
    this.caixa = caixa;
    this.head = new TalkingHead(caixa, {
      lipsyncModules: [], lipsyncLang: 'pt_br', cameraView: 'upper', avatarMood: 'neutral', modelFPS: 30,
      cameraRotateEnable: false, cameraZoomEnable: false, cameraPanEnable: false
    });
    this.head.lipsync['pt_br'] = new LipsyncPt_br();
    this.carregando = null;
  }

  async vestirE(perfil, univ, onProgresso) {
    const chave = perfil.genero + perfil.univ + perfil.nome;
    if (this.chave === chave) return;
    this.chave = chave;
    const tarefa = this.head.showAvatar(AVATARES[perfil.genero], onProgresso, (gltf) => vestir(gltf, perfil.genero, univ, perfil.nome));
    this.carregando = tarefa;
    await tarefa;
    if (this.carregando === tarefa) { this.head.setView('upper'); this.carregando = null; }
  }

  humor(h) { try { this.head.setMood(HUMOR[h] || 'neutral'); } catch (e) {} }

  acenar() { try { this.head.playGesture('handup', 2); } catch (e) {} }

  liberarAudio() { try { this.head.audioCtx.resume(); } catch (e) {} }

  parar() {
    try { this.head.stopSpeaking(); } catch (e) {}
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  // Boca sincronizada com a voz do aparelho (mesma técnica do VinaCare)
  falarComVoz(texto, vozInfo) {
    const palavras = texto.trim().split(/\s+/).filter(Boolean);
    const wtimes = [], wdurations = [];
    let t = 120;
    for (const w of palavras) {
      const n = w.replace(/[^\p{L}\p{N}]/gu, '').length || 1;
      const d = Math.max(170, n * 72);
      wtimes.push(t); wdurations.push(d);
      t += d + (/[.,!?;:]$/.test(w) ? 260 : 50);
    }
    const total = t + 200;
    const ctx = this.head.audioCtx;
    const lab = () => {
      try {
        const mudo = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * total / 1000), ctx.sampleRate);
        this.head.speakAudio({ audio: mudo, words: palavras, wtimes, wdurations }, { lipsyncLang: 'pt_br' });
      } catch (e) {}
    };
    return new Promise((ok) => {
      let fim = false;
      const acabar = () => { if (!fim) { fim = true; ok(); } };
      if (!('speechSynthesis' in window)) { lab(); setTimeout(acabar, total); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = vozInfo.lang; u.rate = 0.95;
      if (vozInfo.voz) u.voice = vozInfo.voz;
      let comecou = false;
      u.onstart = () => { if (!comecou) { comecou = true; lab(); } };
      u.onend = acabar; u.onerror = acabar;
      setTimeout(() => { if (!comecou) { comecou = true; lab(); } }, 700);
      setTimeout(acabar, total + 4000);
      speechSynthesis.speak(u);
    });
  }
}
