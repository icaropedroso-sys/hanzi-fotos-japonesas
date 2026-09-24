# Hanzi — Histórias Através da Luz (Japão)

Uma jornada fotográfica por ruas antigas, montanhas silenciosas e cidades em néon do Japão. Site interativo com 12 fotos, filtros dinâmicos, histórias visuais e visualizador de lightbox.

---

## 🌐 Como abrir no Visual Studio Code dentro do GitHub (Navegador)

Você pode abrir e editar este projeto no VS Code diretamente pelo navegador no GitHub, sem precisar instalar nada no computador:

### Método 1: Atalho do Teclado (O mais rápido)
1. Acesse o repositório: **[github.com/icaropedroso-sys/hanzi-fotos-japonesas](https://github.com/icaropedroso-sys/hanzi-fotos-japonesas)**.
2. No seu teclado, pressione a tecla **`.`** (ponto final).
3. O GitHub abrirá imediatamente o **VS Code Web** dentro do navegador.

### Método 2: Pela URL
Substitua `.com` por `.dev` no link do repositório:
- Acesse: **[https://github.dev/icaropedroso-sys/hanzi-fotos-japonesas](https://github.dev/icaropedroso-sys/hanzi-fotos-japonesas)**

### Método 3: GitHub Codespaces (Com terminal para rodar o site)
Se além de ver o código você quiser rodar o site na nuvem:
1. No repositório, clique no botão verde **`<> Code`**.
2. Selecione a aba **Codespaces**.
3. Clique em **Create codespace on main**.
4. Quando o VS Code carregar, abra o terminal e rode:
   ```bash
   npm install
   npm run dev
   ```

---

## 💻 Como rodar no seu computador (Localmente)

1. Certifique-se de ter o **Node.js** (versão 20 ou superior) instalado.
2. Abra a pasta do projeto no seu terminal.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor local:
   ```bash
   npm run dev
   ```
5. Acesse no navegador o link exibido: `http://localhost:5173/`.

---

## 📁 Estrutura do Projeto

- `src/page.tsx`: Componente principal do site, galeria de fotos, histórias e filtros.
- `src/globals.css`: Estilização em Tailwind CSS, fontes, animações e tema escuro.
- `public/photos/`: Imagens fotográficas do Japão em alta resolução.
- `public/favicon.svg`: Ícone do site.
