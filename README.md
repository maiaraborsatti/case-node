# Sistema de Processamento de Webhooks v2.0

## 📋 Descrição

Sistema Node.js + TypeScript para coleta, processamento e armazenamento de webhooks de APIs externas.

## 🏗️ Arquitetura

```
case_node/
├── src/
│   ├── config/          # Configurações
│   ├── services/        # Serviços de negócio
│   ├── utils/           # Utilitários
│   ├── types/           # TypeScript types
│   └── index.ts         # Entry point
├── output/              # Dados gerados
├── package.json
├── tsconfig.json
└── .env
```

## 🚀 Como Executar

### Instalação:

```bash
npm install
```

### Desenvolvimento:

```bash
npm run dev
```

### Produção:

```bash
npm run build
npm run start:prod
```

## 📊 Funcionalidades

- ✅ Coleta de webhooks via API REST
- ✅ Validação de payloads
- ✅ Processamento de dados
- ✅ Filtragem dos top 5 webhooks
- ✅ Salvamento em JSON
- ✅ Logging completo

## 🐛 Bugs Intencionais

Este código contém bugs para avaliação técnica.

**Missão:** Encontrar e corrigir os bugs!

## 📚 API Utilizada

- **JSONPlaceholder** - https://jsonplaceholder.typicode.com/posts
- Retorna: 100 posts (webhooks simulados)

## ⚙️ Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

## 📄 Saída

- `output/webhooks_processados.json` - Top 5 webhooks
- `output/summary.json` - Estatísticas
