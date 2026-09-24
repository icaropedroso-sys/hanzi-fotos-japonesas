# Hanzi — Stories Through Light

Código do site com as 12 fotos, galeria interativa, filtros, animações e visualização ampliada. Esta cópia foi preparada para abrir em uma IDE e rodar no seu computador.

## Abrir no Antigravity IDE (Windows)

1. Instale o Node.js versão 22.13 ou mais recente, caso ainda não esteja instalado.
2. Extraia o ZIP. A pasta `Hanzi-Antigravity` precisa conter `package.json`, `index.html` e as pastas `src` e `public`.
3. No Antigravity IDE, escolha **File > Open Folder** e selecione a pasta `Hanzi-Antigravity`. Em algumas versões, use o ícone de pasta com **+**, **New Project**, **Add Folder**, **Create**.
4. Abra o terminal da IDE (menu **Terminal > New Terminal**).
5. Execute `npm install` e aguarde terminar.
6. Execute `npm run dev`.
7. Abra no navegador o endereço **Local** mostrado no terminal, geralmente `http://localhost:5173/`.

Se quiser conferir a versão pronta para distribuição, execute `npm run build` e depois `npm run preview`. A versão local é independente da página privada já publicada. Mudar estes arquivos no seu computador não atualiza automaticamente a página hospedada.

## Onde alterar

- `src/page.tsx`: textos, fotos exibidas, categorias e interações.
- `src/globals.css`: cores, fontes, layouts e animações.
- `public/photos`: as imagens do Japão.
- `public/favicon.svg`: ícone do site.

As fotos desta cópia são os arquivos fornecidos para o projeto. Os dados de câmera, lente, contato e Instagram não foram fornecidos e permanecem sem informação.
