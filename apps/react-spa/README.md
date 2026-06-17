# React SPA — Frontend Microservices Lab

Aplicação frontend construída com **React + Vite + TypeScript** para consumir a API Spring Boot do laboratório `frontend-microservices-lab`.

Esta aplicação serve como implementação base para validar o fluxo comum de autenticação e consumo de endpoints protegidos antes de replicar a mesma lógica em Vue.js, Angular e Next.js.

---

## Objetivo da aplicação

A `react-spa` implementa uma Single Page Application com:

* Login via JWT
* Armazenamento do `accessToken` no `localStorage`
* Cliente HTTP centralizado com Axios
* Envio automático do header `Authorization`
* Rotas protegidas com React Router
* Consumo de endpoints protegidos do backend Spring Boot
* Página de utilizadores autenticada

Fluxo principal:

```txt
Login
  ↓
POST /api/auth/login
  ↓
Guardar accessToken
  ↓
GET /api/auth/me
  ↓
GET /api/users
  ↓
Mostrar utilizadores
```

---

## Stack técnica

```txt
React
Vite
TypeScript
React Router DOM
Axios
```

---

## Localização no monorepo

```txt
frontend-microservices-lab/
├── apps/
│   └── react-spa/
├── backend/
│   └── spring-api/
└── docker-compose.yml
```

---

## Requisitos

Antes de arrancar esta aplicação, confirma que tens instalado:

```txt
Node.js
pnpm
Docker
```

Verificação:

```powershell
node -v
pnpm -v
docker --version
```

---

## Backend consumido

Esta aplicação consome a API Spring Boot disponível em:

```txt
http://localhost:8080
```

Endpoints usados:

```txt
POST /api/auth/login
GET  /api/auth/me
GET  /api/users
```

Credenciais de laboratório:

```txt
admin@lab.com / admin123
user@lab.com  / user123
```

---

## Variáveis de ambiente

O ficheiro `.env` deve existir na raiz da app:

```txt
apps/react-spa/.env
```

Conteúdo:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Nota: em projetos Vite, variáveis expostas ao frontend devem começar por `VITE_`.

---

## Instalação

A partir da pasta da aplicação:

```powershell
cd "C:\Users\Bruno\Desktop\Java Interview\frontend-microservices-lab\apps\react-spa"

pnpm install
```

---

## Arrancar o backend

A partir da raiz do monorepo:

```powershell
cd "C:\Users\Bruno\Desktop\Java Interview\frontend-microservices-lab"

docker compose up --build spring-api
```

Testar se o backend está ativo:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

Resposta esperada:

```json
{
  "status": "UP",
  "service": "spring-api",
  "timestamp": "..."
}
```

---

## Arrancar a aplicação React

A partir da pasta `apps/react-spa`:

```powershell
pnpm dev
```

A aplicação deverá ficar disponível em:

```txt
http://localhost:5173
```

---

## Estrutura principal

```txt
src/
├── app/
│   └── App.tsx
├── features/
│   ├── auth/
│   │   ├── AuthContext.ts
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   ├── LoginPage.tsx
│   │   └── ProtectedRoute.tsx
│   └── users/
│       └── UsersPage.tsx
├── shared/
│   └── api/
│       └── httpClient.ts
└── main.tsx
```

---

## Responsabilidade dos ficheiros

### `main.tsx`

Ponto de entrada da aplicação React.

Configura:

* `BrowserRouter`
* `AuthProvider`
* `App`

---

### `App.tsx`

Define as rotas da aplicação:

```txt
/       → redireciona para /users
/login  → página de login
/users  → página protegida
*       → redireciona para /users
```

---

### `httpClient.ts`

Cria o cliente HTTP Axios.

Responsabilidades:

* Definir `baseURL`
* Definir `Content-Type`
* Adicionar automaticamente o header `Authorization` quando existir token

Exemplo de header enviado:

```http
Authorization: Bearer <accessToken>
```

---

### `AuthContext.ts`

Define os tipos e o contexto de autenticação.

Inclui:

* `AuthUser`
* `LoginResponse`
* `AuthContextValue`
* `AuthContext`

---

### `AuthProvider.tsx`

Controla o estado global de autenticação.

Responsabilidades:

* Guardar utilizador autenticado
* Guardar token
* Executar login
* Executar logout
* Validar sessão ao iniciar a app
* Chamar `/api/auth/me` quando existe token no `localStorage`

---

### `useAuth.ts`

Hook para aceder ao contexto de autenticação.

Uso típico:

```tsx
const { user, login, logout, isAuthenticated } = useAuth();
```

---

### `ProtectedRoute.tsx`

Componente que protege rotas privadas.

Comportamento:

```txt
Se está a validar sessão → mostra "A validar sessão..."
Se não está autenticado → redireciona para /login
Se está autenticado → mostra a rota protegida
```

---

### `LoginPage.tsx`

Página de login.

Responsabilidades:

* Mostrar formulário
* Enviar email/password para `/api/auth/login`
* Guardar token através do `AuthProvider`
* Redirecionar para `/users` após login válido

---

### `UsersPage.tsx`

Página protegida que consome:

```txt
GET /api/users
```

Mostra:

* Utilizador autenticado
* Lista de utilizadores
* Roles
* Botão de logout

---

## Fluxo de autenticação

### 1. Login

O utilizador envia:

```json
{
  "email": "admin@lab.com",
  "password": "admin123"
}
```

Para:

```txt
POST http://localhost:8080/api/auth/login
```

O backend responde:

```json
{
  "accessToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@lab.com",
    "roles": ["ADMIN", "USER"]
  }
}
```

---

### 2. Armazenamento do token

O token é guardado no browser:

```txt
localStorage.accessToken
```

---

### 3. Pedidos autenticados

Antes de cada pedido HTTP, o `httpClient` procura o token no `localStorage`.

Se existir, adiciona:

```http
Authorization: Bearer <accessToken>
```

---

### 4. Validação da sessão

Quando a app é recarregada, o `AuthProvider` executa:

```txt
GET /api/auth/me
```

Se o token for válido, a sessão é restaurada.

Se o token for inválido ou expirado, é executado logout local.

---

## Rotas

| Rota     | Tipo             | Descrição                 |
| -------- | ---------------- | ------------------------- |
| `/login` | Pública          | Página de login           |
| `/users` | Protegida        | Lista de utilizadores     |
| `/`      | Redirecionamento | Redireciona para `/users` |
| `*`      | Redirecionamento | Redireciona para `/users` |

---

## Como testar manualmente

### 1. Abrir a app

```txt
http://localhost:5173
```

### 2. Login

Usar:

```txt
admin@lab.com
admin123
```

### 3. Resultado esperado

A app deve redirecionar para:

```txt
/users
```

E mostrar a lista de utilizadores.

### 4. Confirmar token

No browser:

```txt
F12 → Application → Local Storage
```

Deve existir:

```txt
accessToken = eyJ...
```

### 5. Confirmar Authorization header

No browser:

```txt
F12 → Network → /api/users → Request Headers
```

Deve existir:

```http
Authorization: Bearer eyJ...
```

---

## Erros comuns

### Erro de CORS

Sintoma:

```txt
Access to XMLHttpRequest has been blocked by CORS policy
```

Causa provável:

```txt
O backend não permite a origem http://localhost:5173
```

Correção:

* Verificar configuração CORS no Spring Boot
* Confirmar que `http://localhost:5173` está nas allowed origins
* Recompilar o backend Docker

```powershell
docker compose down
docker compose up --build spring-api
```

---

### Erro 401 em `/api/users`

Causas possíveis:

* Token ausente
* Token expirado
* Token inválido
* Header `Authorization` não enviado
* Backend reiniciado com outro segredo JWT

Diagnóstico:

```txt
F12 → Application → Local Storage
F12 → Network → /api/users → Request Headers
```

---

### Login falha mesmo com credenciais corretas

Confirmar:

* Backend ativo em `http://localhost:8080`
* `.env` correto
* Vite reiniciado depois de alterar `.env`
* CORS configurado
* Endpoint `/api/auth/login` funcional no Postman

Reiniciar Vite:

```powershell
Ctrl + C
pnpm dev
```

---

### Variável `.env` não é lida

Confirmar que o nome começa com `VITE_`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Depois reiniciar o servidor Vite.

---

## Comandos úteis

Instalar dependências:

```powershell
pnpm install
```

Arrancar em desenvolvimento:

```powershell
pnpm dev
```

Build:

```powershell
pnpm build
```

Preview do build:

```powershell
pnpm preview
```

Lint:

```powershell
pnpm lint
```

---

## Decisões técnicas

### Por que `localStorage`?

Nesta fase, o objetivo é compreender o fluxo JWT de forma simples.

O `localStorage` permite:

* Guardar token
* Restaurar sessão após refresh
* Enviar token em chamadas protegidas

Para produção, uma solução mais robusta deve considerar cookies HTTP-only, refresh tokens, expiração curta e proteção adicional contra XSS.

---

### Por que separar `AuthContext`, `AuthProvider` e `useAuth`?

Separação aplicada:

```txt
AuthContext.ts    → tipos e contexto
AuthProvider.tsx  → componente Provider
useAuth.ts        → hook de acesso ao contexto
```

Isto evita warnings do React Fast Refresh e melhora a organização.

---

### Por que usar `ProtectedRoute`?

Porque algumas páginas só devem estar disponíveis para utilizadores autenticados.

Exemplo:

```txt
/users
```

Sem autenticação, o utilizador é redirecionado para:

```txt
/login
```

---

## Estado atual da aplicação

Implementado:

* Login JWT
* Logout local
* Validação de sessão
* Rota protegida
* Consumo de `/api/users`
* Cliente HTTP com interceptor de token

Não implementado ainda:

* Refresh token
* Expiração visual da sessão
* Gestão de roles nas rotas
* Testes automatizados
* UI final com Tailwind CSS
* Tratamento global de erro 401

---

## Próximos passos

1. Melhorar UI com Tailwind CSS
2. Adicionar página de dashboard
3. Adicionar tratamento global de 401 no Axios
4. Adicionar roles em rotas protegidas
5. Adicionar testes unitários
6. Replicar o mesmo fluxo em Vue.js, Angular e Next.js
