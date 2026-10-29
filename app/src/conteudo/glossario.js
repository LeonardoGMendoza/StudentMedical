// Nomes das peças do BodyParts3D (inglês) -> espanhol e português.
// Chave = nome em minúsculas, sem "left/right". O que não estiver aqui aparece em inglês.
const G = {
  // ossos
  'frontal bone': ['Hueso frontal', 'Osso frontal'], 'parietal bone': ['Hueso parietal', 'Osso parietal'],
  'temporal bone': ['Hueso temporal', 'Osso temporal'], 'occipital bone': ['Hueso occipital', 'Osso occipital'],
  'sphenoid bone': ['Esfenoides', 'Esfenoide'], 'ethmoid': ['Etmoides', 'Etmoide'], 'maxilla': ['Maxilar', 'Maxila'],
  'mandible': ['Mandíbula', 'Mandíbula'], 'nasal bone': ['Hueso nasal', 'Osso nasal'], 'zygomatic bone': ['Hueso cigomático (malar)', 'Osso zigomático'],
  'palatine bone': ['Hueso palatino', 'Osso palatino'], 'vomer': ['Vómer', 'Vômer'], 'hyoid bone': ['Hueso hioides', 'Osso hioide'],
  'atlas': ['Atlas (C1)', 'Atlas (C1)'], 'axis': ['Axis (C2)', 'Áxis (C2)'], 'sacrum': ['Sacro', 'Sacro'],
  'manubrium': ['Manubrio del esternón', 'Manúbrio do esterno'], 'body of sternum': ['Cuerpo del esternón', 'Corpo do esterno'],
  'xiphoid process': ['Apófisis xifoides', 'Processo xifoide'], 'clavicle': ['Clavícula', 'Clavícula'], 'scapula': ['Escápula (omóplato)', 'Escápula'],
  'humerus': ['Húmero', 'Úmero'], 'radius': ['Radio', 'Rádio'], 'ulna': ['Cúbito', 'Ulna'],
  'scaphoid': ['Escafoides', 'Escafoide'], 'lunate': ['Semilunar', 'Semilunar'], 'triquetral': ['Piramidal', 'Piramidal'],
  'pisiform': ['Pisiforme', 'Pisiforme'], 'trapezium': ['Trapecio (hueso)', 'Trapézio (osso)'], 'trapezoid': ['Trapezoide', 'Trapezoide'],
  'capitate': ['Hueso grande', 'Capitato'], 'hamate': ['Ganchoso', 'Hamato'],
  'hip bone': ['Hueso coxal', 'Osso do quadril'], 'femur': ['Fémur', 'Fêmur'], 'patella': ['Rótula', 'Patela'],
  'tibia': ['Tibia', 'Tíbia'], 'fibula': ['Peroné', 'Fíbula'], 'talus': ['Astrágalo', 'Tálus'], 'calcaneus': ['Calcáneo', 'Calcâneo'],
  'navicular bone of foot': ['Escafoides del pie', 'Navicular'], 'cuboid bone': ['Cuboides', 'Cuboide'],
  'medial cuneiform bone': ['Cuña medial', 'Cuneiforme medial'], 'intermediate cuneiform bone': ['Cuña intermedia', 'Cuneiforme intermédio'],
  'lateral cuneiform bone': ['Cuña lateral', 'Cuneiforme lateral'],
  // músculos
  'sternocleidomastoid': ['Esternocleidomastoideo', 'Esternocleidomastóideo'],
  'acromial part of deltoid': ['Deltoides (porción media)', 'Deltoide (parte acromial)'], 'clavicular part of deltoid': ['Deltoides (porción anterior)', 'Deltoide (parte clavicular)'],
  'spinal part of deltoid': ['Deltoides (porción posterior)', 'Deltoide (parte espinal)'],
  'supraspinatus': ['Supraespinoso', 'Supraespinal'], 'infraspinatus muscle': ['Infraespinoso', 'Infraespinal'],
  'teres minor': ['Redondo menor', 'Redondo menor'], 'teres major': ['Redondo mayor', 'Redondo maior'], 'subscapularis': ['Subescapular', 'Subescapular'],
  'long head of biceps brachii': ['Bíceps braquial (porción larga)', 'Bíceps braquial (cabeça longa)'],
  'short head of biceps brachii': ['Bíceps braquial (porción corta)', 'Bíceps braquial (cabeça curta)'],
  'long head of triceps brachii': ['Tríceps braquial (porción larga)', 'Tríceps braquial (cabeça longa)'],
  'lateral head of triceps brachii': ['Tríceps braquial (vasto externo)', 'Tríceps braquial (cabeça lateral)'],
  'medial head of triceps brachii': ['Tríceps braquial (vasto interno)', 'Tríceps braquial (cabeça medial)'],
  'brachialis': ['Braquial anterior', 'Braquial'], 'coracobrachialis': ['Coracobraquial', 'Coracobraquial'], 'brachioradialis': ['Supinador largo (braquiorradial)', 'Braquiorradial'],
  'clavicular part of pectoralis major': ['Pectoral mayor (porción clavicular)', 'Peitoral maior (parte clavicular)'],
  'abdominal part of pectoralis major': ['Pectoral mayor (porción abdominal)', 'Peitoral maior (parte abdominal)'],
  'pectoralis minor': ['Pectoral menor', 'Peitoral menor'], 'pronator quadratus': ['Pronador cuadrado', 'Pronador quadrado'],
  'flexor carpi radialis': ['Palmar mayor (flexor radial del carpo)', 'Flexor radial do carpo'], 'palmaris longus': ['Palmar menor (palmar largo)', 'Palmar longo'],
  'flexor digitorum superficialis': ['Flexor común superficial de los dedos', 'Flexor superficial dos dedos'],
  'flexor digitorum profundus': ['Flexor común profundo de los dedos', 'Flexor profundo dos dedos'],
  'extensor digitorum': ['Extensor común de los dedos', 'Extensor dos dedos'], 'supinator': ['Supinador corto', 'Supinador'], 'anconeus': ['Ancóneo', 'Ancôneo'],
  'gluteus maximus': ['Glúteo mayor', 'Glúteo máximo'], 'gluteus medius': ['Glúteo medio', 'Glúteo médio'], 'gluteus minimus': ['Glúteo menor', 'Glúteo mínimo'],
  'piriformis': ['Piramidal de la pelvis (piriforme)', 'Piriforme'], 'rectus femoris': ['Recto anterior (recto femoral)', 'Reto femoral'],
  'vastus lateralis': ['Vasto externo (lateral)', 'Vasto lateral'], 'vastus medialis': ['Vasto interno (medial)', 'Vasto medial'],
  'vastus intermedius': ['Crural (vasto intermedio)', 'Vasto intermédio'], 'sartorius': ['Sartorio', 'Sartório'], 'gracilis': ['Recto interno (grácil)', 'Grácil'],
  'long head of biceps femoris': ['Bíceps femoral (porción larga)', 'Bíceps femoral (cabeça longa)'],
  'short head of biceps femoris': ['Bíceps femoral (porción corta)', 'Bíceps femoral (cabeça curta)'],
  'semitendinosus': ['Semitendinoso', 'Semitendíneo'], 'semimembranosus': ['Semimembranoso', 'Semimembranáceo'],
  'adductor longus': ['Aductor mediano (largo)', 'Adutor longo'], 'adductor brevis': ['Aductor menor (corto)', 'Adutor curto'], 'adductor magnus': ['Aductor mayor', 'Adutor magno'],
  'lateral head of gastrocnemius': ['Gemelo externo', 'Gastrocnêmio (cabeça lateral)'], 'medial head of gastrocnemius': ['Gemelo interno', 'Gastrocnêmio (cabeça medial)'],
  'soleus': ['Sóleo', 'Sóleo'], 'tibialis anterior': ['Tibial anterior', 'Tibial anterior'], 'tibialis posterior': ['Tibial posterior', 'Tibial posterior'],
  'fibularis longus': ['Peroneo lateral largo', 'Fibular longo'], 'fibularis brevis': ['Peroneo lateral corto', 'Fibular curto'],
  'psoas major': ['Psoas mayor', 'Psoas maior'], 'iliacus': ['Ilíaco', 'Ilíaco'], 'diaphragm': ['Diafragma', 'Diafragma'],
  // tórax
  'trachea': ['Tráquea', 'Traqueia'], 'main bronchus': ['Bronquio principal', 'Brônquio principal'], 'main bronchus proper': ['Bronquio principal', 'Brônquio principal'],
  'wall of atrium': ['Pared de la aurícula', 'Parede do átrio'], 'wall of ventricle': ['Pared de los ventrículos', 'Parede dos ventrículos'],
  'ascending aorta': ['Aorta ascendente', 'Aorta ascendente'], 'arch of aorta': ['Cayado de la aorta', 'Arco da aorta'],
  'descending thoracic aorta': ['Aorta torácica descendente', 'Aorta torácica descendente'], 'pulmonary trunk': ['Tronco pulmonar', 'Tronco pulmonar'],
  'anterior leaflet of mitral valve': ['Válvula mitral (valva anterior)', 'Valva mitral (válvula anterior)'],
  'posterior leaflet of mitral valve': ['Válvula mitral (valva posterior)', 'Valva mitral (válvula posterior)'],
  'anterior leaflet of tricuspid valve': ['Válvula tricúspide (valva anterior)', 'Valva tricúspide (válvula anterior)'],
  // abdome
  'esophagus': ['Esófago', 'Esôfago'], 'stomach': ['Estómago', 'Estômago'], 'duodenum': ['Duodeno', 'Duodeno'],
  'proximal part of jejunum': ['Yeyuno', 'Jejuno'], 'middle part of jejunum': ['Yeyuno', 'Jejuno'], 'distal part of jejunum': ['Yeyuno', 'Jejuno'],
  'proximal part of ileum': ['Íleon', 'Íleo'], 'middle part of ileum': ['Íleon', 'Íleo'], 'distal part of ileum': ['Íleon', 'Íleo'],
  'ileocecal junction': ['Unión ileocecal', 'Junção ileocecal'], 'appendix': ['Apéndice vermiforme', 'Apêndice vermiforme'],
  'ascending colon': ['Colon ascendente', 'Colo ascendente'], 'transverse colon': ['Colon transverso', 'Colo transverso'],
  'descending colon': ['Colon descendente', 'Colo descendente'], 'rectum': ['Recto', 'Reto'],
  'caudate lobe of liver': ['Hígado (lóbulo caudado)', 'Fígado (lobo caudado)'], 'gallbladder': ['Vesícula biliar', 'Vesícula biliar'],
  'cystic duct': ['Conducto cístico', 'Ducto cístico'], 'common hepatic duct': ['Conducto hepático común', 'Ducto hepático comum'],
  'pancreas': ['Páncreas', 'Pâncreas'], 'parenchyma of pancreas': ['Páncreas', 'Pâncreas'], 'spleen': ['Bazo', 'Baço'],
  'kidney': ['Riñón', 'Rim'], 'ureter': ['Uréter', 'Ureter'], 'urinary bladder': ['Vejiga', 'Bexiga'], 'urethra': ['Uretra', 'Uretra'],
  'abdominal aorta': ['Aorta abdominal', 'Aorta abdominal'],
  // encéfalo e nervos
  'cerebellum': ['Cerebelo', 'Cerebelo'], 'pons': ['Protuberancia (puente)', 'Ponte'], 'midbrain': ['Mesencéfalo', 'Mesencéfalo'],
  'medulla oblongata': ['Bulbo raquídeo', 'Bulbo'], 'thalamus': ['Tálamo', 'Tálamo'], 'hypothalamus': ['Hipotálamo', 'Hipotálamo'],
  'corpus callosum': ['Cuerpo calloso', 'Corpo caloso'], 'hippocampus': ['Hipocampo', 'Hipocampo'], 'amygdala': ['Amígdala cerebral', 'Amígdala'],
  'insula': ['Ínsula', 'Ínsula'], 'occipital lobe': ['Lóbulo occipital', 'Lobo occipital'], 'precentral gyrus': ['Circunvolución frontal ascendente (precentral)', 'Giro pré-central'],
  'postcentral gyrus': ['Circunvolución parietal ascendente (poscentral)', 'Giro pós-central'],
  'white matter of cerebral hemisphere': ['Sustancia blanca del hemisferio', 'Substância branca do hemisfério'],
  'optic nerve': ['Nervio óptico (II)', 'Nervo óptico (II)'], 'optic chiasm': ['Quiasma óptico', 'Quiasma óptico'], 'optic tract': ['Cintilla óptica', 'Trato óptico'],
  'superior branch of oculomotor nerve': ['Motor ocular común (III), rama superior', 'Oculomotor (III), ramo superior'],
  'inferior branch of oculomotor nerve': ['Motor ocular común (III), rama inferior', 'Oculomotor (III), ramo inferior'],
  'trochlear nerve': ['Nervio patético / troclear (IV)', 'Nervo troclear (IV)'], 'ophthalmic nerve': ['Nervio oftálmico (V1)', 'Nervo oftálmico (V1)'],
  'frontal nerve': ['Nervio frontal (V1)', 'Nervo frontal (V1)'], 'lacrimal nerve': ['Nervio lagrimal (V1)', 'Nervo lacrimal (V1)'],
  'nasociliary nerve': ['Nervio nasociliar (V1)', 'Nervo nasociliar (V1)'], 'ciliary ganglion': ['Ganglio ciliar', 'Gânglio ciliar'],
  'tentorium cerebelli': ['Tienda del cerebelo', 'Tentório do cerebelo']
};

const LADO = { es: ['izquierdo', 'derecho'], pt: ['esquerdo', 'direito'], en: ['left', 'right'] };

export function nomePeca(ingles, idioma) {
  let n = ingles.toLowerCase(), lado = -1;
  const m = n.match(/^(left|right) /) || n.match(/ of (left|right) /);
  if (m) { lado = m[1] === 'left' ? 0 : 1; n = n.replace(/^(left|right) /, '').replace(/ of (left|right) /, ' of '); }
  const t = G[n];
  let nome = idioma === 'en' || !t ? ingles.replace(/^(Left|Right) /, '').replace(/ of (left|right) /, ' of ') : t[idioma === 'es' ? 0 : 1];
  if (idioma === 'en' || !t) nome = nome.charAt(0).toUpperCase() + nome.slice(1);
  return lado >= 0 ? `${nome} (${LADO[idioma][lado]})` : nome;
}
