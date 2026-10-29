# StudentMedical

**ES** · Aplicación para estudiantes de medicina que aprenden con un tutor de IA. Empieza con **Anatomía**; después vienen Citología, Biología, Histología y Fisiología.
**PT** · Aplicativo para estudantes de medicina aprenderem com um tutor de IA. Começa com **Anatomia**; depois Citologia, Biologia, Histologia e Fisiologia.
**EN** · An app where medical students learn with an AI tutor. Starts with **Anatomy**; Cytology, Biology, Histology and Physiology come next.

▶️ Demo: https://leonardogmendoza.github.io/StudentMedical/demo/

## O que já faz

- **Estudante 3D** (homem ou mulher) com jaleco, scrub, touca e estetoscópio. Escolha a universidade e o uniforme muda de cor, com o nome bordado no peito:
  - **UMAX** – Universidad María Auxiliadora (scrub vinho)
  - **UCP** – Universidad Central del Paraguay (scrub azul royal)
  - **UMS** – Universidad María Serrana (scrub verde)
- **3 idiomas**: espanhol, português e inglês (tela, aulas, quiz, voz e respostas da IA).
- **7 temas de Anatomia**: osteologia, cabeça e pescoço, membro superior, tórax, abdome, membro inferior e nervos cranianos. Cada um com aula falada, quiz com explicação e indicação do livro para aprofundar.
- **Pergunte à IA**: na demo responde com o conteúdo das aulas; com o servidor ligado, o tutor (Oracle Generative AI) responde usando **os seus livros** e cita livro e página.

## Estrutura

```
demo/                 página estática (GitHub Pages), sem build: three.js + JavaScript
  js/universidades.js cores dos uniformes (fácil de ajustar)
  js/conteudo/        aulas e quizzes em ES/PT/EN
backend/              API Python FastAPI: tutor de IA (OCI), memória do aluno, voz (Azure)
ml/indexar_livros.py  lê os PDFs dos livros e cria a biblioteca de busca (SQLite FTS5)
```

## Ligar a IA com os livros

1. Indexe os livros (no seu PC):
   ```powershell
   pip install -r ml/requirements.txt
   python ml/indexar_livros.py "D:\documents\Downloads\Items01\Anatomía" --materia anatomia
   ```
   Isso cria `backend/data/biblioteca.db`. Livros escaneados (só imagem) aparecem no final com o comando de OCR.
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

- [three.js](https://threejs.org) (MIT) em `demo/js/vendor/`.
- Escudos dos uniformes são desenhos genéricos com a sigla, não os logotipos oficiais das universidades.

## Autor

Leonardo Mendoza · Pós-graduação em IA, FIAP
