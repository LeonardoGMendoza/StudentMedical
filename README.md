# StudentMedical

**ES** · Aplicación para estudiantes de medicina que aprenden con un tutor de IA. Empieza con **Anatomía**; después vienen Citología, Biología, Histología y Fisiología.
**PT** · Aplicativo para estudantes de medicina aprenderem com um tutor de IA. Começa com **Anatomia**; depois Citologia, Biologia, Histologia e Fisiologia.
**EN** · An app where medical students learn with an AI tutor. Starts with **Anatomy**; Cytology, Biology, Histology and Physiology come next.

▶️ Demo: https://leonardogmendoza.github.io/StudentMedical/demo/

## O que já faz

- **Professor(a) 3D realista** (os mesmos avatares do VinaCare: mulher e homem), com boca sincronizada, piscar e expressões. Escolha a universidade e a roupa muda, com o nome bordado no peito (mulher: jaleco branco + scrub; homem: scrub):
  - **UMAX** – Universidad María Auxiliadora (scrub vinho)
  - **UCP** – Universidad Central del Paraguay (scrub azul royal)
  - **UMS** – Universidad María Serrana (scrub verde)
- **3 idiomas**: espanhol, português e inglês (tela, aulas, quiz, voz e respostas da IA).
- **Atlas 3D de anatomia** (como os apps Human Body Atlas/Voka): gire, aproxime, **separe as peças** com o controle deslizante e toque numa peça para o professor dizer o nome (ES/PT/EN). Enquanto ele explica cada ponto da aula, as estruturas citadas acendem no modelo.
- **7 temas de Anatomia**: osteologia, cabeça e pescoço, membro superior, tórax, abdome, membro inferior e nervos cranianos. Cada um com aula falada, quiz com explicação e indicação do livro para aprofundar.
- **Pergunte à IA**: na demo responde com o conteúdo das aulas; com o servidor ligado, o tutor (Oracle Generative AI) responde usando **os seus livros** e cita livro e página.

## Estrutura

```
demo/                 página estática (GitHub Pages), sem build: three.js + import map
  js/professor.js     avatar realista (TalkingHead) vestido com o uniforme da universidade
  js/atlas.js         atlas 3D: separar peças, destacar, tocar para ver o nome
  js/universidades.js cores dos uniformes (fácil de ajustar)
  js/conteudo/        aulas, quizzes e glossário das peças em ES/PT/EN
  modelos/            recortes 3D de cada aula (BodyParts3D)
  avatars/            avatares 3D (os mesmos do VinaCare)
backend/              API Python FastAPI: tutor de IA (OCI), memória do aluno, voz (Azure)
ml/indexar_livros.py  lê os PDFs dos livros e cria a biblioteca de busca (SQLite FTS5)
ml/recortar_anatomia.py  gera demo/modelos/ a partir do pacote BodyParts3D do projeto human-atlas
```

## Ligar a IA com os livros

1. Indexe os livros (no seu PC):
   ```powershell
   pip install -r ml/requirements.txt
   python -u ml/indexar_livros.py "D:/documents/Downloads/Items01/Anatomía" --materia anatomia
   ```
   Isso cria `backend/data/biblioteca.db`.

   **Livros escaneados** (só imagem, sem texto): instale o [Tesseract para Windows](https://github.com/UB-Mannheim/tesseract/wiki) marcando o idioma **Spanish** e rode com `--ocr` (dá para fazer um livro por vez com `--somente`):
   ```bash
   pip install pymupdf
   python -u ml/indexar_livros.py "D:/documents/Downloads/Items01/Anatomía" --ocr --somente Latarjet
   ```
   O OCR grava só o texto (não cria cópia do PDF) e, se parar no meio, continua da página onde parou.
2. Configure o back-end com a mesma conta Oracle do VinaCare: copie `backend/.env.example` para `backend/.env`.
3. Rode a API:
   ```powershell
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --port 8000
   ```
4. Em outro terminal, sirva a demo e abra apontando para a API:
   ```powershell
   cd demo
   python -m http.server 5500
   ```
   http://localhost:5500/?api=http://localhost:8000

> Os livros e o `biblioteca.db` **não vão para o GitHub** (estão no `.gitignore`): são obras com direitos autorais e ficam só no seu PC/servidor. Para lançar o app comercialmente, o conteúdo precisa ser próprio ou licenciado.

## Créditos

- **Modelos anatômicos:** BodyParts3D 4.0, © The Database Center for Life Science (DBCLS), licença [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Geometria simplificada e recortada por aula a partir do pacote do projeto [human-atlas](https://github.com/ashemag/human-atlas) (código MIT).
- **Avatar falante:** [TalkingHead](https://github.com/met4citizen/TalkingHead) (MIT, © Mika Suominen).
- **Avatares de exemplo** (`avaturn.glb` do Avaturn, `avatarsdk.glb` do Avatar SDK/MetaPerson): exemplos do TalkingHead, **somente uso não comercial**. Para lançar o app, criar avatares próprios com licença comercial. A roupa é repintada no navegador com as cores de cada universidade.
- [three.js](https://threejs.org) (MIT) em `demo/js/vendor/`.
- Escudos dos uniformes são desenhos genéricos com a sigla, não os logotipos oficiais das universidades.

## Autor

Leonardo Mendoza · Pós-graduação em IA, FIAP
