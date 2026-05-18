# Controle Financeiro Pessoal

Aplicação web para controle de finanças pessoais — gerencie receitas, despesas, contatos e visualize relatórios com gráficos interativos.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — estilização
- **Radix UI** + **shadcn/ui** — componentes acessíveis
- **React Hook Form** + **Zod** — formulários e validação
- **TanStack Query** — gerenciamento de estado assíncrono
- **Recharts** — gráficos e visualizações
- **React Router DOM** — roteamento
- **Vitest** + **Testing Library** — testes

## 📁 Estrutura

```
src/
├── components/       # Componentes reutilizáveis (layout, charts, transactions, ui)
├── hooks/            # Hooks customizados
├── pages/            # Páginas da aplicação
├── services/         # Chamadas à API (auth, transactions, contacts, categories)
├── lib/              # Utilitários e configurações
├── helper/           # Funções auxiliares
└── test/             # Configuração de testes
```

## 📄 Páginas

| Rota                 | Descrição                              |
| -------------------- | -------------------------------------- |
| `/auth`              | Login e cadastro                       |
| `/forgot-password`   | Recuperação de senha                   |
| `/reset-code`        | Inserção do código de redefinição      |
| `/new-password`      | Cadastro de nova senha                 |
| `/verify-email/:id`  | Verificação de e-mail                  |
| `/dashboard`         | Painel principal com resumo financeiro |
| `/transactions`      | Cadastro de transações                 |
| `/transactions-list` | Listagem e filtragem de transações     |
| `/contacts`          | Gerenciamento de contatos              |
| `/reports`           | Relatórios e gráficos                  |

> As rotas protegidas exigem autenticação via `ProtectedRoute`.

## 🏷️ Categorias de transações

`Alimentação`, `Conforto`, `Moradia`, `Transporte`, `Saúde`, `Educação`, `Lazer`, `Bens Pessoais`, `Investimento`, `Renda Variável`, `Benefícios`, `Salário`, `Outros`

## ⚙️ Configuração e execução

### Pré-requisitos

- Node.js 18+
- npm

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://seu-backend.com
VITE_GOOGLE_CLIENT_ID=seu-google-client-id
```

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8081`.

### Build para produção

```bash
npm run build
```

### Testes

```bash
# Execução única
npm test

# Modo watch
npm run test:watch
```

### Lint

```bash
npm run lint
```

## 🌐 Deploy

O projeto está configurado para deploy na **Vercel**. O arquivo `vercel.json` redireciona todas as rotas para o `index.html`, garantindo que o roteamento do React funcione corretamente.

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## 🔐 Autenticação

- Login/cadastro com e-mail e senha
- Login social via **Google OAuth**
- Fluxo de recuperação de senha com código de verificação por e-mail
- Validação de senha com requisitos: maiúsculas, minúsculas, números e caracteres especiais

## 🔗 Backend

A API de backend está hospedada em: `https://budgettracker-kso8.onrender.com`

Configure a variável `VITE_API_URL` no arquivo `.env` apontando para esse endereço.
