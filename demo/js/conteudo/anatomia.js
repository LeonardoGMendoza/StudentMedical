// Anatomía · Anatomia · Anatomy
// Texto original do StudentMedical (resumos próprios). Os livros do aluno entram como
// referência ("livros") e, no back-end, como base de busca da IA (biblioteca local).

export const MATERIAS = [
  { id: 'anatomia', ativo: true, icone: '🦴', nome: { es: 'Anatomía', pt: 'Anatomia', en: 'Anatomy' } },
  { id: 'citologia', ativo: false, icone: '🔬', nome: { es: 'Citología', pt: 'Citologia', en: 'Cytology' } },
  { id: 'biologia', ativo: false, icone: '🧬', nome: { es: 'Biología', pt: 'Biologia', en: 'Biology' } },
  { id: 'histologia', ativo: false, icone: '🧫', nome: { es: 'Histología', pt: 'Histologia', en: 'Histology' } },
  { id: 'fisiologia', ativo: false, icone: '❤️', nome: { es: 'Fisiología', pt: 'Fisiologia', en: 'Physiology' } }
];

export const TEMAS = [
  {
    id: 'osteologia',
    icone: '🦴',
    titulo: { es: 'Osteología general', pt: 'Osteologia geral', en: 'General osteology' },
    livros: ['Rouvière 11ª ed. — Tomo 1', 'Latarjet 4ª ed. — Tomo 1', 'Netter 5ª ed.'],
    pontos: {
      es: [
        'El esqueleto del adulto tiene 206 huesos. Se dividen en esqueleto axial (cráneo, columna, costillas y esternón) y apendicular (miembros y cinturas).',
        'Por su forma, los huesos son largos, cortos, planos, irregulares y sesamoideos. La rótula es el sesamoideo más grande.',
        'Un hueso largo tiene diáfisis (el cuerpo), dos epífisis (los extremos) y metáfisis, la zona de crecimiento entre ambas.',
        'El periostio cubre el hueso por fuera y lo nutre. La médula ósea roja produce las células de la sangre.'
      ],
      pt: [
        'O esqueleto do adulto tem 206 ossos. Ele se divide em esqueleto axial (crânio, coluna, costelas e esterno) e apendicular (membros e cinturas).',
        'Pela forma, os ossos são longos, curtos, planos, irregulares e sesamoides. A patela é o maior sesamoide.',
        'Um osso longo tem diáfise (o corpo), duas epífises (as extremidades) e metáfise, a zona de crescimento entre elas.',
        'O periósteo reveste o osso por fora e o nutre. A medula óssea vermelha produz as células do sangue.'
      ],
      en: [
        'The adult skeleton has 206 bones, divided into the axial skeleton (skull, spine, ribs and sternum) and the appendicular skeleton (limbs and girdles).',
        'By shape, bones are long, short, flat, irregular and sesamoid. The patella is the largest sesamoid bone.',
        'A long bone has a diaphysis (the shaft), two epiphyses (the ends) and the metaphysis, the growth zone between them.',
        'The periosteum covers the outside of the bone and nourishes it. Red bone marrow makes blood cells.'
      ]
    },
    quiz: [
      { p: { es: '¿Cuántos huesos tiene el esqueleto adulto?', pt: 'Quantos ossos tem o esqueleto adulto?', en: 'How many bones does the adult skeleton have?' },
        o: { es: ['186', '206', '226', '300'], pt: ['186', '206', '226', '300'], en: ['186', '206', '226', '300'] }, c: 1,
        e: { es: 'Son 206. El recién nacido tiene más (cerca de 300), porque muchos se fusionan con el crecimiento.', pt: 'São 206. O recém-nascido tem mais (cerca de 300), porque muitos se fundem com o crescimento.', en: 'It is 206. Newborns have more (around 300) because many fuse during growth.' } },
      { p: { es: '¿Cuál es el hueso sesamoideo más grande?', pt: 'Qual é o maior osso sesamoide?', en: 'Which is the largest sesamoid bone?' },
        o: { es: ['Escafoides', 'Rótula', 'Hioides', 'Pisiforme'], pt: ['Escafoide', 'Patela', 'Hioide', 'Pisiforme'], en: ['Scaphoid', 'Patella', 'Hyoid', 'Pisiform'] }, c: 1,
        e: { es: 'La rótula se forma dentro del tendón del cuádriceps.', pt: 'A patela se forma dentro do tendão do quadríceps.', en: 'The patella develops inside the quadriceps tendon.' } },
      { p: { es: '¿Dónde está la zona de crecimiento de un hueso largo?', pt: 'Onde fica a zona de crescimento de um osso longo?', en: 'Where is the growth zone of a long bone?' },
        o: { es: ['Diáfisis', 'Metáfisis', 'Periostio', 'Cavidad medular'], pt: ['Diáfise', 'Metáfise', 'Periósteo', 'Cavidade medular'], en: ['Diaphysis', 'Metaphysis', 'Periosteum', 'Medullary cavity'] }, c: 1,
        e: { es: 'En la metáfisis está el cartílago de crecimiento (placa epifisaria).', pt: 'Na metáfise fica a cartilagem de crescimento (placa epifisária).', en: 'The metaphysis holds the growth (epiphyseal) plate.' } }
    ]
  },
  {
    id: 'cabeza',
    icone: '💀',
    titulo: { es: 'Cabeza y cuello', pt: 'Cabeça e pescoço', en: 'Head and neck' },
    livros: ['Testut — Anatomía topográfica (Cabeza)', 'Bouchet — Cara y cabeza', 'Rouvière 9ª ed. — Tomo 1'],
    pontos: {
      es: [
        'El cráneo tiene neurocráneo (protege el encéfalo) y viscerocráneo (la cara). El neurocráneo tiene 8 huesos: frontal, 2 parietales, 2 temporales, occipital, esfenoides y etmoides.',
        'La mandíbula es el único hueso móvil del cráneo; se articula con el temporal en la articulación temporomandibular (ATM).',
        'El hioides es el único hueso que no se articula con ningún otro: queda suspendido por músculos y ligamentos.',
        'El esternocleidomastoideo divide el cuello en triángulos anterior y posterior, y lo inerva el nervio accesorio (XI par).'
      ],
      pt: [
        'O crânio tem neurocrânio (protege o encéfalo) e viscerocrânio (a face). O neurocrânio tem 8 ossos: frontal, 2 parietais, 2 temporais, occipital, esfenoide e etmoide.',
        'A mandíbula é o único osso móvel do crânio; articula-se com o temporal na articulação temporomandibular (ATM).',
        'O hioide é o único osso que não se articula com nenhum outro: fica suspenso por músculos e ligamentos.',
        'O esternocleidomastóideo divide o pescoço em trígonos anterior e posterior, e é inervado pelo nervo acessório (XI par).'
      ],
      en: [
        'The skull has a neurocranium (protects the brain) and a viscerocranium (the face). The neurocranium has 8 bones: frontal, 2 parietal, 2 temporal, occipital, sphenoid and ethmoid.',
        'The mandible is the only movable bone of the skull; it joins the temporal bone at the temporomandibular joint (TMJ).',
        'The hyoid is the only bone that does not articulate with any other bone: muscles and ligaments hold it in place.',
        'The sternocleidomastoid divides the neck into anterior and posterior triangles and is supplied by the accessory nerve (CN XI).'
      ]
    },
    quiz: [
      { p: { es: '¿Cuántos huesos forman el neurocráneo?', pt: 'Quantos ossos formam o neurocrânio?', en: 'How many bones form the neurocranium?' },
        o: { es: ['6', '8', '14', '22'], pt: ['6', '8', '14', '22'], en: ['6', '8', '14', '22'] }, c: 1,
        e: { es: 'Son 8. El viscerocráneo suma 14 más, en total 22 huesos del cráneo.', pt: 'São 8. O viscerocrânio soma mais 14, total de 22 ossos do crânio.', en: 'Eight. The viscerocranium adds 14 more, for 22 skull bones in total.' } },
      { p: { es: '¿Qué hueso no se articula con ningún otro?', pt: 'Qual osso não se articula com nenhum outro?', en: 'Which bone does not articulate with any other bone?' },
        o: { es: ['Vómer', 'Hioides', 'Atlas', 'Etmoides'], pt: ['Vômer', 'Hioide', 'Atlas', 'Etmoide'], en: ['Vomer', 'Hyoid', 'Atlas', 'Ethmoid'] }, c: 1,
        e: { es: 'El hioides queda suspendido en el cuello, a la altura de C3.', pt: 'O hioide fica suspenso no pescoço, na altura de C3.', en: 'The hyoid hangs in the neck at about the level of C3.' } },
      { p: { es: '¿Qué nervio inerva el esternocleidomastoideo?', pt: 'Qual nervo inerva o esternocleidomastóideo?', en: 'Which nerve supplies the sternocleidomastoid?' },
        o: { es: ['Facial (VII)', 'Vago (X)', 'Accesorio (XI)', 'Hipogloso (XII)'], pt: ['Facial (VII)', 'Vago (X)', 'Acessório (XI)', 'Hipoglosso (XII)'], en: ['Facial (VII)', 'Vagus (X)', 'Accessory (XI)', 'Hypoglossal (XII)'] }, c: 2,
        e: { es: 'El XI par inerva el esternocleidomastoideo y el trapecio.', pt: 'O XI par inerva o esternocleidomastóideo e o trapézio.', en: 'CN XI supplies the sternocleidomastoid and trapezius.' } }
    ]
  },
  {
    id: 'superior',
    icone: '💪',
    titulo: { es: 'Miembro superior', pt: 'Membro superior', en: 'Upper limb' },
    livros: ['Latarjet 4ª ed. — Tomo 1', 'Testut-Latarjet 9ª ed. — Tomo 1', 'Apuntes — Músculos del miembro superior'],
    pontos: {
      es: [
        'Huesos: clavícula y escápula (cintura escapular), húmero, radio y cúbito, 8 del carpo, 5 metacarpianos y 14 falanges.',
        'El plexo braquial nace de las raíces C5 a T1. Sus ramos terminales son: musculocutáneo, axilar, radial, mediano y cubital.',
        'El manguito rotador lo forman supraespinoso, infraespinoso, redondo menor y subescapular. Estabiliza el hombro.',
        'Por el túnel carpiano pasa el nervio mediano; su compresión causa el síndrome del túnel carpiano.'
      ],
      pt: [
        'Ossos: clavícula e escápula (cíngulo do membro superior), úmero, rádio e ulna, 8 do carpo, 5 metacarpais e 14 falanges.',
        'O plexo braquial nasce das raízes C5 a T1. Seus ramos terminais são: musculocutâneo, axilar, radial, mediano e ulnar.',
        'O manguito rotador é formado por supraespinal, infraespinal, redondo menor e subescapular. Ele estabiliza o ombro.',
        'Pelo túnel do carpo passa o nervo mediano; sua compressão causa a síndrome do túnel do carpo.'
      ],
      en: [
        'Bones: clavicle and scapula (shoulder girdle), humerus, radius and ulna, 8 carpals, 5 metacarpals and 14 phalanges.',
        'The brachial plexus arises from roots C5 to T1. Its terminal branches are the musculocutaneous, axillary, radial, median and ulnar nerves.',
        'The rotator cuff is made of supraspinatus, infraspinatus, teres minor and subscapularis. It stabilises the shoulder.',
        'The median nerve passes through the carpal tunnel; compressing it causes carpal tunnel syndrome.'
      ]
    },
    quiz: [
      { p: { es: '¿De qué raíces nace el plexo braquial?', pt: 'De quais raízes nasce o plexo braquial?', en: 'Which roots form the brachial plexus?' },
        o: { es: ['C1–C4', 'C5–T1', 'T1–T6', 'L1–L4'], pt: ['C1–C4', 'C5–T1', 'T1–T6', 'L1–L4'], en: ['C1–C4', 'C5–T1', 'T1–T6', 'L1–L4'] }, c: 1,
        e: { es: 'C5, C6, C7, C8 y T1. C1–C4 forman el plexo cervical.', pt: 'C5, C6, C7, C8 e T1. C1–C4 formam o plexo cervical.', en: 'C5, C6, C7, C8 and T1. C1–C4 form the cervical plexus.' } },
      { p: { es: '¿Qué nervio pasa por el túnel carpiano?', pt: 'Qual nervo passa pelo túnel do carpo?', en: 'Which nerve passes through the carpal tunnel?' },
        o: { es: ['Cubital', 'Radial', 'Mediano', 'Axilar'], pt: ['Ulnar', 'Radial', 'Mediano', 'Axilar'], en: ['Ulnar', 'Radial', 'Median', 'Axillary'] }, c: 2,
        e: { es: 'El mediano. El cubital pasa por el canal de Guyon, fuera del túnel.', pt: 'O mediano. O ulnar passa pelo canal de Guyon, fora do túnel.', en: 'The median nerve. The ulnar nerve runs through Guyon’s canal, outside the tunnel.' } },
      { p: { es: '¿Cuál NO forma parte del manguito rotador?', pt: 'Qual NÃO faz parte do manguito rotador?', en: 'Which is NOT part of the rotator cuff?' },
        o: { es: ['Supraespinoso', 'Redondo menor', 'Redondo mayor', 'Subescapular'], pt: ['Supraespinal', 'Redondo menor', 'Redondo maior', 'Subescapular'], en: ['Supraspinatus', 'Teres minor', 'Teres major', 'Subscapularis'] }, c: 2,
        e: { es: 'El redondo mayor no se inserta en la cápsula del hombro como los otros cuatro.', pt: 'O redondo maior não se insere na cápsula do ombro como os outros quatro.', en: 'Teres major does not blend with the shoulder capsule like the other four.' } }
    ]
  },
  {
    id: 'torax',
    icone: '🫁',
    titulo: { es: 'Tórax', pt: 'Tórax', en: 'Thorax' },
    livros: ['Rouvière 9ª ed. — Tomo 2', 'Galli — Mediastino', 'Netter 5ª ed.'],
    pontos: {
      es: [
        'Hay 12 pares de costillas: 1 a 7 verdaderas (llegan al esternón), 8 a 10 falsas y 11 y 12 flotantes.',
        'El corazón está en el mediastino medio, dentro del pericardio, y tiene 4 cavidades: 2 aurículas y 2 ventrículos.',
        'El pulmón derecho tiene 3 lóbulos; el izquierdo tiene 2, con la escotadura cardíaca y la língula.',
        'El diafragma es el principal músculo de la respiración y lo inerva el nervio frénico (C3, C4 y C5).'
      ],
      pt: [
        'Há 12 pares de costelas: 1 a 7 verdadeiras (chegam ao esterno), 8 a 10 falsas e 11 e 12 flutuantes.',
        'O coração fica no mediastino médio, dentro do pericárdio, e tem 4 câmaras: 2 átrios e 2 ventrículos.',
        'O pulmão direito tem 3 lobos; o esquerdo tem 2, com a incisura cardíaca e a língula.',
        'O diafragma é o principal músculo da respiração e é inervado pelo nervo frênico (C3, C4 e C5).'
      ],
      en: [
        'There are 12 pairs of ribs: 1 to 7 are true ribs (reach the sternum), 8 to 10 are false and 11 and 12 are floating.',
        'The heart lies in the middle mediastinum inside the pericardium and has 4 chambers: 2 atria and 2 ventricles.',
        'The right lung has 3 lobes; the left has 2, with the cardiac notch and the lingula.',
        'The diaphragm is the main breathing muscle and is supplied by the phrenic nerve (C3, C4 and C5).'
      ]
    },
    quiz: [
      { p: { es: '¿Cuántos lóbulos tiene el pulmón izquierdo?', pt: 'Quantos lobos tem o pulmão esquerdo?', en: 'How many lobes does the left lung have?' },
        o: { es: ['1', '2', '3', '4'], pt: ['1', '2', '3', '4'], en: ['1', '2', '3', '4'] }, c: 1,
        e: { es: 'Dos: superior e inferior. El espacio que ocupa el corazón le quita un lóbulo.', pt: 'Dois: superior e inferior. O espaço do coração “rouba” um lobo.', en: 'Two: upper and lower. The heart takes up the room of a third lobe.' } },
      { p: { es: '¿Qué nervio inerva el diafragma?', pt: 'Qual nervo inerva o diafragma?', en: 'Which nerve supplies the diaphragm?' },
        o: { es: ['Vago', 'Frénico', 'Intercostal', 'Torácico largo'], pt: ['Vago', 'Frênico', 'Intercostal', 'Torácico longo'], en: ['Vagus', 'Phrenic', 'Intercostal', 'Long thoracic'] }, c: 1,
        e: { es: 'Frénico, de C3–C5: “C3, 4 y 5 mantienen vivo el diafragma”.', pt: 'Frênico, de C3–C5: “C3, 4 e 5 mantêm o diafragma vivo”.', en: 'Phrenic, from C3–C5: “C3, 4 and 5 keep the diaphragm alive”.' } },
      { p: { es: '¿Cuáles son las costillas flotantes?', pt: 'Quais são as costelas flutuantes?', en: 'Which are the floating ribs?' },
        o: { es: ['1 y 2', '8 a 10', '11 y 12', '6 y 7'], pt: ['1 e 2', '8 a 10', '11 e 12', '6 e 7'], en: ['1 and 2', '8 to 10', '11 and 12', '6 and 7'] }, c: 2,
        e: { es: 'La 11 y la 12 no llegan al esternón ni al cartílago de arriba.', pt: 'A 11 e a 12 não chegam ao esterno nem à cartilagem de cima.', en: 'Ribs 11 and 12 reach neither the sternum nor the cartilage above.' } }
    ]
  },
  {
    id: 'abdomen',
    icone: '🩻',
    titulo: { es: 'Abdomen', pt: 'Abdome', en: 'Abdomen' },
    livros: ['Rouvière 9ª ed. — Tomo 2', 'Testut-Latarjet 9ª ed. — Tomo 4', 'Pro — Anatomía clínica'],
    pontos: {
      es: [
        'El abdomen se divide en 9 regiones (o 4 cuadrantes) para ubicar los órganos y el dolor.',
        'El hígado es la glándula más grande del cuerpo y ocupa sobre todo el hipocondrio derecho y el epigastrio.',
        'El peritoneo tiene una hoja parietal y una visceral. Riñones, uréteres y la mayor parte del páncreas son retroperitoneales.',
        'El punto de McBurney está en la unión del tercio lateral con el tercio medio de la línea entre la espina ilíaca anterosuperior y el ombligo.'
      ],
      pt: [
        'O abdome se divide em 9 regiões (ou 4 quadrantes) para localizar órgãos e dor.',
        'O fígado é a maior glândula do corpo e ocupa principalmente o hipocôndrio direito e o epigástrio.',
        'O peritônio tem um folheto parietal e um visceral. Rins, ureteres e a maior parte do pâncreas são retroperitoneais.',
        'O ponto de McBurney fica na união do terço lateral com o terço médio da linha entre a espinha ilíaca anterossuperior e o umbigo.'
      ],
      en: [
        'The abdomen is divided into 9 regions (or 4 quadrants) to locate organs and pain.',
        'The liver is the largest gland in the body and lies mainly in the right hypochondrium and epigastrium.',
        'The peritoneum has a parietal and a visceral layer. The kidneys, ureters and most of the pancreas are retroperitoneal.',
        'McBurney’s point lies one third of the way from the anterior superior iliac spine to the umbilicus.'
      ]
    },
    quiz: [
      { p: { es: '¿Cuál es la glándula más grande del cuerpo?', pt: 'Qual é a maior glândula do corpo?', en: 'What is the largest gland in the body?' },
        o: { es: ['Páncreas', 'Tiroides', 'Hígado', 'Bazo'], pt: ['Pâncreas', 'Tireoide', 'Fígado', 'Baço'], en: ['Pancreas', 'Thyroid', 'Liver', 'Spleen'] }, c: 2,
        e: { es: 'El hígado. El bazo no es una glándula: es un órgano linfoide.', pt: 'O fígado. O baço não é glândula: é um órgão linfoide.', en: 'The liver. The spleen is not a gland but a lymphoid organ.' } },
      { p: { es: '¿Qué órgano es retroperitoneal?', pt: 'Qual órgão é retroperitoneal?', en: 'Which organ is retroperitoneal?' },
        o: { es: ['Estómago', 'Riñón', 'Yeyuno', 'Bazo'], pt: ['Estômago', 'Rim', 'Jejuno', 'Baço'], en: ['Stomach', 'Kidney', 'Jejunum', 'Spleen'] }, c: 1,
        e: { es: 'El riñón está detrás del peritoneo, en la pared posterior del abdomen.', pt: 'O rim fica atrás do peritônio, na parede posterior do abdome.', en: 'The kidney lies behind the peritoneum on the posterior abdominal wall.' } },
      { p: { es: 'El punto de McBurney se relaciona con…', pt: 'O ponto de McBurney se relaciona com…', en: 'McBurney’s point relates to…' },
        o: { es: ['La vesícula', 'El apéndice', 'El bazo', 'El riñón izquierdo'], pt: ['A vesícula', 'O apêndice', 'O baço', 'O rim esquerdo'], en: ['The gallbladder', 'The appendix', 'The spleen', 'The left kidney'] }, c: 1,
        e: { es: 'Marca la base del apéndice; el dolor ahí sugiere apendicitis.', pt: 'Marca a base do apêndice; dor ali sugere apendicite.', en: 'It marks the base of the appendix; pain there suggests appendicitis.' } }
    ]
  },
  {
    id: 'inferior',
    icone: '🦵',
    titulo: { es: 'Miembro inferior', pt: 'Membro inferior', en: 'Lower limb' },
    livros: ['Latarjet 4ª ed. — Tomo 1', 'Rouvière 9ª ed. — Tomo 3', 'Yokochi 6ª ed.'],
    pontos: {
      es: [
        'El fémur es el hueso más largo y fuerte del cuerpo.',
        'El nervio ciático (L4 a S3) es el más grueso del cuerpo. Sale de la pelvis por el agujero ciático mayor, debajo del piriforme.',
        'El cuádriceps tiene 4 cabezas: recto femoral, vasto lateral, vasto medial y vasto intermedio. Extiende la rodilla.',
        'Dentro de la rodilla, los ligamentos cruzados anterior y posterior impiden que la tibia se deslice hacia delante y hacia atrás.'
      ],
      pt: [
        'O fêmur é o osso mais longo e mais forte do corpo.',
        'O nervo isquiático (ciático, L4 a S3) é o mais grosso do corpo. Sai da pelve pelo forame isquiático maior, abaixo do piriforme.',
        'O quadríceps tem 4 cabeças: reto femoral, vasto lateral, vasto medial e vasto intermédio. Ele estende o joelho.',
        'Dentro do joelho, os ligamentos cruzados anterior e posterior impedem a tíbia de deslizar para frente e para trás.'
      ],
      en: [
        'The femur is the longest and strongest bone in the body.',
        'The sciatic nerve (L4 to S3) is the thickest nerve in the body. It leaves the pelvis through the greater sciatic foramen, below the piriformis.',
        'The quadriceps has 4 heads: rectus femoris, vastus lateralis, vastus medialis and vastus intermedius. It extends the knee.',
        'Inside the knee, the anterior and posterior cruciate ligaments stop the tibia sliding forwards and backwards.'
      ]
    },
    quiz: [
      { p: { es: '¿Cuál es el hueso más largo del cuerpo?', pt: 'Qual é o osso mais longo do corpo?', en: 'What is the longest bone in the body?' },
        o: { es: ['Tibia', 'Húmero', 'Fémur', 'Peroné'], pt: ['Tíbia', 'Úmero', 'Fêmur', 'Fíbula'], en: ['Tibia', 'Humerus', 'Femur', 'Fibula'] }, c: 2,
        e: { es: 'El fémur, cerca de un cuarto de la altura de la persona.', pt: 'O fêmur, cerca de um quarto da altura da pessoa.', en: 'The femur, about a quarter of a person’s height.' } },
      { p: { es: '¿Qué hace el cuádriceps?', pt: 'O que faz o quadríceps?', en: 'What does the quadriceps do?' },
        o: { es: ['Flexiona la rodilla', 'Extiende la rodilla', 'Rota el pie', 'Aduce el muslo'], pt: ['Flexiona o joelho', 'Estende o joelho', 'Gira o pé', 'Aduz a coxa'], en: ['Flexes the knee', 'Extends the knee', 'Rotates the foot', 'Adducts the thigh'] }, c: 1,
        e: { es: 'Extiende la rodilla; el recto femoral además flexiona la cadera.', pt: 'Estende o joelho; o reto femoral também flexiona o quadril.', en: 'It extends the knee; rectus femoris also flexes the hip.' } },
      { p: { es: '¿De qué raíces sale el nervio ciático?', pt: 'De quais raízes sai o nervo isquiático?', en: 'Which roots form the sciatic nerve?' },
        o: { es: ['T12–L2', 'L2–L4', 'L4–S3', 'S2–S4'], pt: ['T12–L2', 'L2–L4', 'L4–S3', 'S2–S4'], en: ['T12–L2', 'L2–L4', 'L4–S3', 'S2–S4'] }, c: 2,
        e: { es: 'L4 a S3, del plexo sacro. L2–L4 forman el femoral y el obturador.', pt: 'L4 a S3, do plexo sacral. L2–L4 formam o femoral e o obturatório.', en: 'L4 to S3, from the sacral plexus. L2–L4 form the femoral and obturator nerves.' } }
    ]
  },
  {
    id: 'pares',
    icone: '🧠',
    titulo: { es: 'Pares craneales', pt: 'Nervos cranianos', en: 'Cranial nerves' },
    livros: ['Apuntes — Pares craneales 12', 'Curso Coscarelli — Nervios craneales', 'Rouvière 11ª ed. — Tomo 4'],
    pontos: {
      es: [
        'Son 12 pares: I olfatorio, II óptico, III motor ocular común, IV troclear (patético), V trigémino, VI abducens (motor ocular externo), VII facial, VIII vestibulococlear, IX glosofaríngeo, X vago, XI accesorio y XII hipogloso.',
        'Sensitivos puros: I, II y VIII. Motores puros: III, IV, VI, XI y XII. Mixtos: V, VII, IX y X.',
        'Los músculos del ojo: el IV mueve el oblicuo superior, el VI el recto lateral y el III todos los demás.',
        'El vago (X) es el más largo: lleva la inervación parasimpática al corazón, pulmones y gran parte del tubo digestivo.'
      ],
      pt: [
        'São 12 pares: I olfatório, II óptico, III oculomotor, IV troclear, V trigêmeo, VI abducente, VII facial, VIII vestibulococlear, IX glossofaríngeo, X vago, XI acessório e XII hipoglosso.',
        'Sensitivos puros: I, II e VIII. Motores puros: III, IV, VI, XI e XII. Mistos: V, VII, IX e X.',
        'Músculos do olho: o IV move o oblíquo superior, o VI o reto lateral e o III todos os outros.',
        'O vago (X) é o mais longo: leva a inervação parassimpática ao coração, pulmões e grande parte do tubo digestivo.'
      ],
      en: [
        'There are 12 pairs: I olfactory, II optic, III oculomotor, IV trochlear, V trigeminal, VI abducens, VII facial, VIII vestibulocochlear, IX glossopharyngeal, X vagus, XI accessory and XII hypoglossal.',
        'Purely sensory: I, II and VIII. Purely motor: III, IV, VI, XI and XII. Mixed: V, VII, IX and X.',
        'Eye muscles: IV moves the superior oblique, VI the lateral rectus and III all the others.',
        'The vagus (X) is the longest: it carries parasympathetic supply to the heart, lungs and most of the gut.'
      ]
    },
    quiz: [
      { p: { es: '¿Qué par inerva el músculo recto lateral del ojo?', pt: 'Qual par inerva o músculo reto lateral do olho?', en: 'Which nerve supplies the lateral rectus?' },
        o: { es: ['III', 'IV', 'VI', 'VII'], pt: ['III', 'IV', 'VI', 'VII'], en: ['III', 'IV', 'VI', 'VII'] }, c: 2,
        e: { es: 'El VI (abducens): abduce el ojo. Regla: LR6 SO4, el resto III.', pt: 'O VI (abducente): abduz o olho. Regra: RL6 OS4, o resto III.', en: 'CN VI (abducens) abducts the eye. Rule: LR6 SO4, the rest III.' } },
      { p: { es: '¿Cuál es un par sensitivo puro?', pt: 'Qual é um par sensitivo puro?', en: 'Which is a purely sensory cranial nerve?' },
        o: { es: ['Trigémino (V)', 'Vestibulococlear (VIII)', 'Facial (VII)', 'Vago (X)'], pt: ['Trigêmeo (V)', 'Vestibulococlear (VIII)', 'Facial (VII)', 'Vago (X)'], en: ['Trigeminal (V)', 'Vestibulocochlear (VIII)', 'Facial (VII)', 'Vagus (X)'] }, c: 1,
        e: { es: 'El VIII lleva audición y equilibrio. V, VII y X son mixtos.', pt: 'O VIII leva audição e equilíbrio. V, VII e X são mistos.', en: 'CN VIII carries hearing and balance. V, VII and X are mixed.' } },
      { p: { es: '¿Qué par mueve los músculos de la mímica facial?', pt: 'Qual par move os músculos da mímica facial?', en: 'Which nerve moves the muscles of facial expression?' },
        o: { es: ['Trigémino (V)', 'Facial (VII)', 'Hipogloso (XII)', 'Glosofaríngeo (IX)'], pt: ['Trigêmeo (V)', 'Facial (VII)', 'Hipoglosso (XII)', 'Glossofaríngeo (IX)'], en: ['Trigeminal (V)', 'Facial (VII)', 'Hypoglossal (XII)', 'Glossopharyngeal (IX)'] }, c: 1,
        e: { es: 'El facial. El trigémino mueve los de la masticación.', pt: 'O facial. O trigêmeo move os da mastigação.', en: 'The facial nerve. The trigeminal moves the muscles of chewing.' } }
    ]
  }
];
