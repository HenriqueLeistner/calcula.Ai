# Seu Finanças PWA

Uma Progressive Web App (PWA) de organização financeira pessoal com suporte offline completo.

## 🚀 Funcionalidades

- ✅ **CRUD de Transações**: Gerencie receitas e despesas com IndexedDB
- ✅ **Gestão de Categorias**: Categorias pré-configuradas para income e expense
- ✅ **Orçamentos Mensais**: Defina limites por categoria com alertas visuais
- ✅ **Filtros Avançados**: Por mês, tipo, categoria e busca textual
- ✅ **Dashboard Interativo**: Cards com totais e gráficos (pizza e linha)
- ✅ **Importar/Exportar**: Backup completo em JSON
- ✅ **PWA Completo**: Instalável, funciona offline, cache otimizado
- ✅ **Localização PT-BR**: Datas dd/mm/yyyy e valores em R$

## 📦 Tecnologias

- **Frontend**: Vite + React + TypeScript
- **UI**: TailwindCSS + shadcn/ui + lucide-react
- **Gráficos**: Recharts (cores padrão)
- **Storage**: IndexedDB via "idb"
- **Estado**: Zustand
- **PWA**: vite-plugin-pwa + Workbox

## 🛠️ Como Rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

A aplicação estará disponível em `http://localhost:5000`

## 📱 Como Instalar no Dispositivo

### Desktop (Chrome/Edge)
1. Abra a aplicação no navegador
2. Clique no ícone de instalação na barra de endereços
3. Ou clique no botão "Instalar" que aparece na interface
4. Confirme a instalação

### Mobile (Android/iOS)
1. Abra a aplicação no navegador
2. Toque no menu (três pontos)
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme a adição

## 🔌 Como Testar Offline

1. Abra a aplicação e navegue normalmente
2. Adicione algumas transações (dados serão salvos localmente)
3. Abra o DevTools (F12) → Network → Marque "Offline"
4. Recarregue a página
5. A aplicação continuará funcionando com os dados locais

Ou simplesmente:
1. Abra a aplicação
2. Desative o WiFi/dados móveis
3. Recarregue a página - tudo funcionará!

## 💾 Como Exportar/Importar Dados

### Exportar
1. Clique no botão "Exportar" no header
2. Um arquivo JSON será baixado com todas as transações, categorias e orçamentos
3. Guarde este arquivo como backup

### Importar
1. Clique no botão "Importar" no header
2. Selecione um arquivo JSON exportado anteriormente
3. Os dados serão restaurados (sobrescrevendo duplicatas)

## 🗂️ Estrutura de Dados

### Transações
```typescript
{
  id: string,
  type: "income" | "expense",
  date: "YYYY-MM-DD",
  category: string,
  description: string,
  amount: number
}
```

### Categorias Padrão

**Receitas:**
- Salário
- Freelance
- Investimentos

**Despesas:**
- Casa
- Mercado
- Lazer
- Saúde
- Transporte
- Educação

## ✨ Recursos PWA

- **Manifest**: Configurado com nome, ícones, tema PT-BR
- **Service Worker**: Cache strategies (NetworkFirst, StaleWhileRevalidate, CacheFirst)
- **Offline Fallback**: Página `/offline.html` personalizada
- **Ícones**: Múltiplas dimensões (192, 256, 384, 512) + maskable
- **Shortcuts**: Atalho para "Nova Transação"

## 🎨 Design

- Mobile-first responsivo
- Modo escuro/claro (manual)
- Formatação BRL (R$)
- Datas em português (dd/mm/yyyy)
- Gráficos com cores adaptativas
- Alertas de orçamento: verde (<80%), âmbar (80-99%), vermelho (≥100%)

## 📊 Lighthouse PWA

A aplicação está otimizada para passar nos testes do Lighthouse:
- ✅ Installable
- ✅ Works offline
- ✅ Valid manifest
- ✅ Service worker registered

## 🔐 Privacidade

Todos os dados são armazenados localmente no navegador usando IndexedDB. Nenhuma informação é enviada para servidores externos.

## 📄 Licença

MIT
