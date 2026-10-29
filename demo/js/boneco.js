// Boneco 3D do estudante de medicina (homem ou mulher), feito só com formas do three.js:
// jaleco branco, scrub e touca na cor da universidade, estetoscópio e bordado no peito.
import * as THREE from './vendor/three.module.js';

const mat = (cor, extra = {}) => new THREE.MeshStandardMaterial({ color: cor, roughness: 0.75, metalness: 0, ...extra });

function malha(geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

function bordado(univ, nome) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 384;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 512, 384);
  // escudo genérico (não é o logo oficial): círculo com a sigla
  g.strokeStyle = univ.bordado; g.lineWidth = 16;
  g.beginPath(); g.arc(256, 140, 104, 0, Math.PI * 2); g.stroke();
  g.fillStyle = univ.bordado;
  g.font = 'bold 72px Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(univ.sigla, 256, 146);
  g.font = 'bold 44px Arial, sans-serif';
  g.fillText('MEDICINA', 256, 286);
  g.fillStyle = '#26323a';
  g.font = '40px Arial, sans-serif';
  g.fillText((nome || '').slice(0, 18), 256, 346);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function tubo(pontos, raio, material) {
  const curva = new THREE.CatmullRomCurve3(pontos.map(p => new THREE.Vector3(...p)));
  return malha(new THREE.TubeGeometry(curva, 40, raio, 8, false), material);
}

export function criarBoneco(o) {
  const mulher = o.genero === 'mulher';
  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);

  const pele = mat(o.pele);
  const cabelo = mat(o.cabelo, { roughness: 0.9 });
  const scrub = mat(o.univ.scrub);
  const branco = mat('#f7f8f8', { roughness: 0.6, side: THREE.DoubleSide });
  const escuro = mat('#1d2328', { roughness: 0.4 });
  const metal = mat('#c9ced3', { roughness: 0.25, metalness: 0.8 });
  const tenis = mat('#ffffff', { roughness: 0.5 });

  const s = mulher ? 0.96 : 1;          // altura
  const ombro = mulher ? 0.215 : 0.245; // largura dos ombros
  const quadril = mulher ? 0.2 : 0.18;

  // Pernas (calça do scrub) e tênis
  for (const lado of [-1, 1]) {
    corpo.add(malha(new THREE.CapsuleGeometry(0.075, 0.66, 6, 16), scrub, lado * 0.095, 0.47, 0));
    const pe = malha(new THREE.CapsuleGeometry(0.055, 0.12, 6, 12), tenis, lado * 0.095, 0.05, 0.04);
    pe.rotation.x = Math.PI / 2;
    corpo.add(pe);
  }
  corpo.add(malha(new THREE.CylinderGeometry(quadril, quadril, 0.16, 24), scrub, 0, 0.84, 0));

  // Tronco (blusa do scrub) com decote em V
  const tronco = new THREE.Group();
  tronco.position.y = 0.92;
  corpo.add(tronco);
  tronco.add(malha(new THREE.CylinderGeometry(ombro - 0.035, quadril - 0.01, 0.5, 24), scrub, 0, 0.25, 0));
  const v = malha(new THREE.PlaneGeometry(0.085, 0.085), pele, 0, 0.44, ombro - 0.03);
  v.rotation.z = Math.PI / 4;
  v.position.z = (ombro - 0.035) + 0.002;
  tronco.add(v);
  if (mulher) {
    for (const lado of [-1, 1]) tronco.add(malha(new THREE.SphereGeometry(0.06, 16, 12), scrub, lado * 0.07, 0.32, 0.12));
  }

  // Jaleco: cilindro aberto na frente, até o joelho
  const abertura = 0.62;
  const jaleco = malha(new THREE.CylinderGeometry(ombro - 0.01, ombro + 0.045, 0.86, 40, 1, true,
    abertura / 2, Math.PI * 2 - abertura), branco, 0, 0.07, 0); // topo no ombro (0.5), barra no joelho
  tronco.add(jaleco);
  // gola / lapelas
  for (const lado of [-1, 1]) {
    const lapela = malha(new THREE.BoxGeometry(0.04, 0.2, 0.006), branco, lado * 0.072, 0.4, ombro - 0.02);
    lapela.rotation.z = lado * 0.22;
    lapela.rotation.y = lado * 0.3;
    tronco.add(lapela);
  }
  const gola = malha(new THREE.TorusGeometry(0.08, 0.022, 8, 24, Math.PI * 1.25), branco, 0, 0.5, 0);
  gola.rotation.set(-Math.PI / 2, 0, -Math.PI * 0.125); // arco atrás do pescoço
  tronco.add(gola);
  // bolsos
  for (const lado of [-1, 1]) {
    const ang = lado * 0.75;
    const r = ombro + 0.035;
    const bolso = malha(new THREE.BoxGeometry(0.1, 0.1, 0.008), branco, Math.sin(ang) * r, -0.12, Math.cos(ang) * r);
    bolso.rotation.y = ang;
    tronco.add(bolso);
  }
  // bordado no peito (lado esquerdo de quem veste)
  const angB = 0.62;
  const rB = ombro + 0.014;
  const placa = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.09), new THREE.MeshStandardMaterial({ map: bordado(o.univ, o.nome), roughness: 0.7 }));
  placa.position.set(Math.sin(angB) * rB, 0.33, Math.cos(angB) * rB);
  placa.rotation.y = angB;
  tronco.add(placa);

  // Braços (manga do jaleco + mão)
  const bracos = [];
  for (const lado of [-1, 1]) {
    const b = new THREE.Group();
    b.position.set(lado * ombro, 0.47, 0);
    b.rotation.z = lado * 0.1;
    b.add(malha(new THREE.SphereGeometry(0.068, 16, 12), branco, 0, 0, 0));
    b.add(malha(new THREE.CapsuleGeometry(0.06, 0.5, 6, 16), branco, 0, -0.3, 0));
    b.add(malha(new THREE.SphereGeometry(0.05, 16, 12), pele, 0, -0.62, 0.005));
    tronco.add(b);
    bracos.push(b);
  }

  // Estetoscópio no pescoço
  const r0 = ombro - 0.06;
  tronco.add(tubo([[-0.07, 0.36, r0 + 0.04], [-0.1, 0.5, 0.06], [0, 0.56, -0.08], [0.1, 0.5, 0.06], [0.07, 0.36, r0 + 0.04]], 0.008, escuro));
  tronco.add(tubo([[0.07, 0.36, r0 + 0.04], [0.04, 0.24, r0 + 0.05], [0.02, 0.16, r0 + 0.05]], 0.008, escuro));
  const disco = malha(new THREE.CylinderGeometry(0.025, 0.025, 0.012, 20), metal, 0.02, 0.14, r0 + 0.055);
  disco.rotation.x = Math.PI / 2;
  tronco.add(disco);

  // Pescoço e cabeça
  tronco.add(malha(new THREE.CylinderGeometry(0.055, 0.06, 0.12, 16), pele, 0, 0.55, 0));
  const cabeca = new THREE.Group();
  cabeca.position.y = 0.72;
  tronco.add(cabeca);
  const cranio = malha(new THREE.SphereGeometry(0.135, 32, 24), pele);
  cranio.scale.set(1, 1.12, 1.02);
  cabeca.add(cranio);
  for (const lado of [-1, 1]) cabeca.add(malha(new THREE.SphereGeometry(0.03, 12, 10), pele, lado * 0.135, 0, 0)).scale.set(0.6, 1, 1);
  cabeca.add(malha(new THREE.SphereGeometry(0.018, 12, 10), pele, 0, -0.02, 0.137));

  const olhos = [];
  for (const lado of [-1, 1]) {
    const olho = new THREE.Group();
    olho.position.set(lado * 0.048, 0.022, 0.118);
    olho.add(malha(new THREE.SphereGeometry(0.022, 16, 12), mat('#ffffff', { roughness: 0.3 })));
    olho.add(malha(new THREE.SphereGeometry(0.013, 16, 12), mat('#3b2a1e', { roughness: 0.2 }), 0, 0, 0.014));
    olho.add(malha(new THREE.SphereGeometry(0.004, 8, 6), mat('#ffffff', { emissive: '#ffffff' }), 0.004, 0.005, 0.026));
    cabeca.add(olho);
    olhos.push(olho);
    const sobrancelha = malha(new THREE.BoxGeometry(0.045, 0.008, 0.01), cabelo, lado * 0.05, 0.062, 0.122);
    sobrancelha.rotation.z = -lado * 0.12;
    cabeca.add(sobrancelha);
  }
  const boca = malha(new THREE.SphereGeometry(0.03, 16, 10), mat('#8c3b3b', { roughness: 0.5 }), 0, -0.068, 0.124);
  boca.scale.set(1, 0.18, 0.4);
  cabeca.add(boca);

  // Cabelo
  const cap = malha(new THREE.SphereGeometry(0.143, 32, 16, 0, Math.PI * 2, 0, Math.PI * (mulher ? 0.56 : 0.5)), cabelo, 0, 0.012, -0.004);
  cap.scale.set(1.02, 1.12, 1.04);
  cap.rotation.x = -0.35;
  cabeca.add(cap);
  if (mulher) {
    const longo = malha(new THREE.CapsuleGeometry(0.11, 0.2, 6, 16), cabelo, 0, -0.12, -0.08);
    longo.scale.set(1.15, 1, 0.55);
    cabeca.add(longo);
  }

  // Touca cirúrgica
  if (o.touca) {
    const touca = malha(new THREE.SphereGeometry(0.152, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.47), mat(o.univ.touca), 0, 0.03, -0.01);
    touca.scale.set(1.03, 1.12, 1.06);
    touca.rotation.x = -0.3;
    cabeca.add(touca);
  }

  raiz.scale.setScalar(s);

  // Animação: respirar, piscar, falar, acenar
  let falando = false, aceno = 0, piscar = 2 + Math.random() * 2;
  const api = {
    grupo: raiz,
    falar(sim) { falando = sim; },
    acenar() { aceno = 2.2; },
    tick(dt, t) {
      tronco.scale.y = 1 + Math.sin(t * 1.6) * 0.006;
      cabeca.rotation.y = Math.sin(t * 0.5) * 0.08 + (falando ? Math.sin(t * 2.1) * 0.05 : 0);
      cabeca.rotation.x = falando ? Math.sin(t * 3.3) * 0.035 : 0;
      boca.scale.y = falando ? 0.25 + Math.abs(Math.sin(t * 13)) * 0.55 + Math.abs(Math.sin(t * 7.3)) * 0.2 : 0.18;
      piscar -= dt;
      const p = piscar < 0.12 && piscar > 0 ? 0.1 : 1;
      olhos.forEach(e => { e.scale.y = p; });
      if (piscar < 0) piscar = 2.5 + Math.random() * 3;
      const direito = bracos[0];
      if (aceno > 0) {
        aceno -= dt;
        direito.rotation.z = -2.5 + Math.sin(t * 9) * 0.3;
      } else {
        direito.rotation.z += (-0.1 - direito.rotation.z) * Math.min(1, dt * 6);
      }
      bracos[1].rotation.z = 0.1 + (falando ? Math.sin(t * 2.4) * 0.06 : 0);
    }
  };
  return api;
}
