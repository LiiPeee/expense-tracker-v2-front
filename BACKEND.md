# Integração com Backend

Este documento explica como conectar o frontend ao seu backend existente.

## Configuração da API

### 1. Configure a URL do Backend

Edite o arquivo `src/services/api.ts` e altere a constante `BASE_URL`:

```typescript
const BASE_URL = 'https://sua-api.com/api';
```

### 2. Estrutura das Chamadas API

O projeto já inclui exemplos de chamadas no arquivo `src/services/api.ts`:

- `getBalance(userId)` - Buscar saldo do usuário
- `getTransactions(userId)` - Buscar transações
- `createTransaction(userId, transaction)` - Criar nova transação

### 3. Autenticação

Se sua API requer autenticação, adicione os headers necessários:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
}
```

### 4. Tipos TypeScript

As interfaces estão definidas em `src/services/api.ts`:

```typescript
interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

interface Balance {
  total: number;
  income: number;
  expenses: number;
  savings: number;
}
```

## Como Usar no Componente

Exemplo de uso no Dashboard:

```typescript
import { getBalance, getTransactions } from '@/services/api';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBalance(user.id);
        setBalance(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    
    fetchData();
  }, [user.id]);
  
  return (
    <div>
      {balance && (
        <p>Saldo: R$ {balance.total}</p>
      )}
    </div>
  );
};
```

## Variáveis de Ambiente

Para definir a URL da API em diferentes ambientes, você pode usar variáveis de ambiente.

**Nota:** Como este projeto usa Lovable Cloud, as variáveis de ambiente devem ser gerenciadas através do painel Cloud.

## Autenticação Google OAuth

Para configurar o login com Google:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Credentials"
4. Crie credenciais OAuth 2.0
5. Configure no Lovable Cloud em Configurações > Autenticação

## Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── layout/         # Componentes de layout (Header, etc)
│   └── landing/        # Componentes da landing page
├── pages/              # Páginas da aplicação
│   ├── Index.tsx       # Landing page
│   ├── Auth.tsx        # Página de login
│   └── Dashboard.tsx   # Dashboard principal
├── services/           # Serviços e chamadas API
│   └── api.ts          # Configuração da API
└── lib/                # Utilitários e configurações
    └── supabase.ts     # Configuração de autenticação
```

## Próximos Passos

1. ✅ Configure a URL do seu backend em `src/services/api.ts`
2. ✅ Configure o Google OAuth no Lovable Cloud
3. ✅ Adapte as interfaces TypeScript conforme sua API
4. ✅ Implemente as chamadas nos componentes
5. ✅ Adicione tratamento de erros e loading states
