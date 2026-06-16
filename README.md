# Frontend Microservices Lab

Laboratório experimental para comparar diferentes tecnologias de frontend no consumo de uma mesma aplicação backend baseada em microserviços.

O objetivo é implementar aplicações frontend equivalentes usando React, Next.js, Angular e Vue.js, mantendo o mesmo backend, os mesmos contratos de API e os mesmos casos de uso.

## Objetivos

* Comparar diferentes abordagens frontend para consumo de APIs.
* Estudar integração com uma arquitetura backend baseada em microserviços.
* Aplicar TypeScript em diferentes ecossistemas frontend.
* Testar padrões como SPA, SSR, BFF, routing, autenticação, cache e tratamento de erros.
* Organizar múltiplas aplicações frontend num único monorepo.

## Tecnologias

| Aplicação     | Tecnologia principal | Objetivo                                                   |
| ------------- | -------------------- | ---------------------------------------------------------- |
| `react-spa`   | React + Vite         | SPA base para consumo de APIs                              |
| `nextjs-app`  | Next.js              | SSR, App Router e possível BFF                             |
| `angular-app` | Angular              | Arquitetura enterprise com services, guards e interceptors |
| `vue-app`     | Vue.js               | Abordagem progressiva e comparação de developer experience |

## Estrutura do projeto

```txt
frontend-microservices-lab/
├── apps/
│   ├── react-spa/
│   ├── nextjs-app/
│   ├── angular-app/
│   └── vue-app/
├── packages/
│   ├── api-client/
│   ├── contracts/
│   └── ui/
├── docs/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

## Backend

Todas as aplicações frontend devem consumir a mesma aplicação backend.

```txt
React SPA ──────┐
Next.js ────────┤
Angular ────────┤──> API Gateway / Backend API ──> Microservices
Vue.js ─────────┘
```

A API backend deverá ser exposta, por exemplo, em:

```txt
http://localhost:8080
```

## Aplicações

### React SPA

Aplicação base em React com Vite e TypeScript.

```bash
pnpm dev:react
```

Porta esperada:

```txt
http://localhost:5173
```

### Next.js App

Aplicação Next.js para testar App Router, SSR e integração backend/frontend.

```bash
pnpm dev:next
```

Porta esperada:

```txt
http://localhost:3000
```

### Angular App

Aplicação Angular para testar uma abordagem mais estruturada e enterprise.

```bash
pnpm dev:angular
```

Porta esperada:

```txt
http://localhost:4200
```

### Vue App

Aplicação Vue.js para comparar simplicidade, produtividade e organização.

```bash
pnpm dev:vue
```

Porta esperada:

```txt
http://localhost:5174
```

## Instalação

```bash
pnpm install
```

## Execução

Executar uma aplicação específica:

```bash
pnpm dev:react
pnpm dev:next
pnpm dev:angular
pnpm dev:vue
```

## Casos de uso previstos

* Login
* Dashboard
* Listagem de entidades
* Detalhe de entidade
* Criação e edição
* Paginação
* Filtros
* Tratamento de loading e erros
* Autorização por roles
* Consumo de múltiplos endpoints

## Estado do projeto

Projeto em fase inicial de laboratório.
