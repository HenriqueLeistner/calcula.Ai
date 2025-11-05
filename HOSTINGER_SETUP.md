# Como Hospedar na Hostinger

## 📦 O que você precisa enviar

Envie **APENAS** o conteúdo da pasta `dist/public/` para a Hostinger.

Os arquivos necessários são:
```
dist/public/
├── index.html
├── .htaccess (criado automaticamente)
├── assets/
│   ├── index-xxxxx.css
│   └── index-xxxxx.js
├── manifest.webmanifest
└── (outros arquivos estáticos)
```

## 🚀 Passo a Passo

### 1. Acesse o Painel da Hostinger
- Entre no hPanel (painel de controle da Hostinger)
- Vá em "Gerenciador de Arquivos" ou use FTP

### 2. Navegue até a pasta pública
- Geralmente é `public_html/` ou `www/`
- Se quiser em um subdiretório, crie uma pasta (ex: `public_html/financas/`)

### 3. Envie os arquivos
**Opção A - Pelo Gerenciador de Arquivos:**
1. Clique em "Upload"
2. Selecione **TODOS** os arquivos e pastas de dentro de `dist/public/`
3. Aguarde o upload completar

**Opção B - Por FTP (FileZilla):**
1. Configure FTP com os dados da Hostinger
2. Arraste a pasta `assets/` e os arquivos (`index.html`, `.htaccess`, etc.) para o servidor
3. Aguarde a transferência

### 4. Configure HTTPS (IMPORTANTE para PWA)
1. No hPanel, vá em "SSL/TLS"
2. Ative SSL gratuito (Let's Encrypt)
3. Marque "Forçar HTTPS"

**PWAs só funcionam com HTTPS!** Sem SSL, a instalação não funciona.

### 5. Teste a aplicação
Acesse seu domínio:
- `https://seudominio.com` (se enviou para a raiz)
- `https://seudominio.com/financas` (se criou um subdiretório)

## ✅ Como saber se funcionou

1. **Site carrega**: Você vê a tela inicial do aplicativo
2. **PWA funciona**: Aparece o botão de "Instalar Aplicativo" no navegador
3. **Offline funciona**: 
   - Adicione algumas transações
   - Desconecte a internet
   - Recarregue a página
   - Tudo deve continuar funcionando!

## 🔧 Solução de Problemas

### Erro 404 ao navegar
- Verifique se o arquivo `.htaccess` foi enviado
- Hostinger pode precisar ativar mod_rewrite no Apache

### PWA não oferece instalação
- Confirme que HTTPS está ativo
- Abra DevTools (F12) → Console para ver erros
- Verifique se `manifest.webmanifest` foi carregado

### Página em branco
- Abra DevTools (F12) → Console
- Provavelmente erro 404 nos arquivos CSS/JS
- Verifique se a pasta `assets/` foi enviada corretamente

## 📱 Como os usuários instalam

Depois de hospedar:

**No celular (Android):**
1. Abra o site no Chrome
2. Toque nos 3 pontos → "Adicionar à tela inicial"
3. App instalado! Funciona offline

**No computador (Chrome/Edge):**
1. Abra o site
2. Clique no ícone de instalação na barra de endereço
3. Ou clique no botão "Instalar" que aparece na interface

## 💡 Dicas

- **Não precisa** de Node.js na Hostinger (são só arquivos HTML/CSS/JS)
- **Não precisa** de banco de dados MySQL (usa IndexedDB do navegador)
- **Funciona** em qualquer plano de hospedagem compartilhada
- Os dados ficam salvos **no navegador** de cada usuário
- Cada usuário tem seus próprios dados (privado e local)

## 🔄 Para Atualizar o Site

1. Rode `npm run build` aqui no Replit
2. Baixe o novo conteúdo de `dist/public/`
3. Substitua os arquivos na Hostinger
4. Os usuários precisarão recarregar para ver mudanças
