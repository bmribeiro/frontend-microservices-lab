# nextjs-app

Aplicação **Next.js** do laboratório `frontend-microservices-lab`.

Esta aplicação representa a terceira fase do laboratório, depois da `spring-api` e da `react-spa`. O objetivo é demonstrar uma implementação frontend com **Next.js App Router**, **Server Components**, **Route Handlers**, **SSR** e um primeiro padrão **BFF — Backend for Frontend**.

Ao contrário da `react-spa`, esta aplicação não depende de guardar o token no `localStorage`. O token devolvido pela `spring-api` é guardado pela aplicação Next.js numa cookie `httpOnly`, permitindo que o servidor Next.js consulte a API Spring em nome do utilizador autenticado.

---

## Sequência do laboratório

| Ordem | Aplicação     | Tecnologia principal | Objetivo                                                   |
| ----: | ------------- | -------------------- | ---------------------------------------------------------- |
|     1 | `spring-api`  | Spring Boot          | Backend comum para os frontends                            |
|     2 | `react-spa`   | React + Vite         | SPA base para consumo direto de APIs                       |
|     3 | `nextjs-app`  | Next.js              | SSR, App Router e BFF básico                               |
|     4 | `angular-app` | Angular              | Arquitetura enterprise com services, guards e interceptors |
|     5 | `vue-app`     | Vue.js               | Abordagem progressiva e comparação de developer experience |

---

## Objetivos desta aplicação

Esta aplicação existe para demonstrar:

* criação de uma app com **Next.js App Router**;
* separação entre **Server Components** e **Client Components**;
* implementação de **Route Handlers** como camada BFF;
* autenticação baseada em cookie `httpOnly`;
* consumo da `spring-api` a partir do servidor Next.js;
* proteção de páginas com redirecionamento server-side;
* listagem e detalhe de utilizadores autenticados;
* diferença técnica entre uma SPA pura e uma app SSR/BFF.

---

## Arquitetura

Na `react-spa`, o browser chama diretamente a `spring-api`:

```txt
Browser
  -> React SPA
  -> Spring API
```

Na `nextjs-app`, o browser comunica primeiro com a aplicação Next.js:

```txt
Browser
  -> Next.js App
  -> Spring API
```

Isto permite que a app Next.js funcione como uma camada BFF simples.

## Backend esperado

A aplicação assume que a `spring-api` está disponível em:

```txt
http://localhost:8080
```

Endpoints usados:

| Método | Endpoint          | Tipo      | Uso                           |
| ------ | ----------------- | --------- | ----------------------------- |
| `GET`  | `/api/health`     | Público   | Verificar se a API está ativa |
| `POST` | `/api/auth/login` | Público   | Autenticação                  |
| `GET`  | `/api/auth/me`    | Protegido | Obter utilizador autenticado  |
| `GET`  | `/api/users`      | Protegido | Listar utilizadores           |
| `GET`  | `/api/users/{id}` | Protegido | Obter detalhe de utilizador   |

Credenciais de teste:

```txt
admin@lab.com / admin123
user@lab.com  / user123
```

---

## Requisitos

* Node.js 22 ou superior recomendado
* npm
* `spring-api` em execução na porta `8080`

---

## Configuração local

Na pasta da aplicação:

```bash
cd frontend/nextjs-app
```

Criar o ficheiro `.env.local`:

### Linux/macOS/Git Bash

```bash
cp .env.local.example .env.local
```

### Windows PowerShell

```powershell
Copy-Item .env.local.example .env.local
```

Conteúdo esperado:

```env
SPRING_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=Frontend Microservices Lab - Next.js
```

`SPRING_API_BASE_URL` não usa `NEXT_PUBLIC_` porque deve ser lida apenas no servidor Next.js.

---

## Executar a spring-api

Antes de iniciar a `nextjs-app`, a API deve estar ativa.

A partir da pasta `backend/spring-api`:

```bash
mvn spring-boot:run
```

Ou, a partir da raiz do laboratório:

```bash
docker compose up --build spring-api
```

Testar a API:

### Linux/macOS/Git Bash

```bash
curl http://localhost:8080/api/health
```

### Windows PowerShell

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

---

## Instalar dependências

Dentro da pasta `nextjs-app`:

```bash
npm install
```

---

## Executar em desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em:

```txt
http://localhost:3000
```

A rota `/` redireciona para `/users`. Se o utilizador não estiver autenticado, será redirecionado para `/login`.

---

## Scripts disponíveis

| Script              | Descrição                                         |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Executa a aplicação em modo desenvolvimento       |
| `npm run build`     | Gera build de produção                            |
| `npm run start`     | Executa a build de produção                       |
| `npm run lint`      | Executa validação de ESLint                       |
| `npm run typecheck` | Executa validação TypeScript sem emitir ficheiros |

---

## Estrutura principal

```txt
nextjs-app/
  public/
  src/
    app/
      api/
        auth/
          login/
            route.ts
          logout/
            route.ts
          me/
            route.ts
        users/
          route.ts
          [id]/
            route.ts
      login/
        page.tsx
      users/
        page.tsx
        [id]/
          page.tsx
      globals.css
      layout.tsx
      not-found.tsx
      page.tsx
    components/
      AppHeader.tsx
      LoginForm.tsx
      LogoutButton.tsx
      UsersTable.tsx
    lib/
      api/
        errors.ts
        spring-api.ts
        types.ts
      auth/
        session.ts
      config.ts
  .env.local.example
  Dockerfile
  next.config.ts
  package.json
  tsconfig.json
```

---

## Rotas da aplicação

| Rota               | Tipo                                | Descrição                                         |
| ------------------ | ----------------------------------- | ------------------------------------------------- |
| `/`                | Server Component                    | Redireciona para `/users`                         |
| `/login`           | Server Component + Client Component | Página de autenticação                            |
| `/users`           | Server Component                    | Lista utilizadores autenticados                   |
| `/users/[id]`      | Server Component                    | Mostra detalhe de um utilizador                   |
| `/api/auth/login`  | Route Handler                       | Efetua login contra a `spring-api` e grava cookie |
| `/api/auth/logout` | Route Handler                       | Remove a cookie de autenticação                   |
| `/api/auth/me`     | Route Handler                       | Proxy autenticado para `/api/auth/me`             |
| `/api/users`       | Route Handler                       | Proxy autenticado para `/api/users`               |
| `/api/users/[id]`  | Route Handler                       | Proxy autenticado para `/api/users/{id}`          |

---

## Cookie de autenticação

O token JWT devolvido pela `spring-api` é guardado numa cookie chamada:

```txt
frontend_lab_access_token
```

Configuração esperada:

```txt
httpOnly: true
sameSite: lax
secure: true em produção
path: /
```

Com cookie `httpOnly`:

```txt
JavaScript do browser não lê o token
Next.js lê a cookie no servidor
Next.js chama a spring-api com Authorization: Bearer <token>
```

---

## Como verificar a cookie

Depois de fazer login:

```txt
Browser DevTools
  -> Application
  -> Cookies
  -> http://localhost:3000
```

Deve existir uma cookie chamada:

```txt
frontend_lab_access_token
```

Na consola do browser:

```js
document.cookie
```

A cookie de autenticação não deve aparecer, porque está marcada como `httpOnly`.

---

## Testar o fluxo manualmente

1. Garantir que a `spring-api` está ativa:

```txt
http://localhost:8080/api/health
```

2. Iniciar a app:

```bash
npm run dev
```

3. Abrir:

```txt
http://localhost:3000/login
```

4. Entrar com:

```txt
admin@lab.com / admin123
```

5. Confirmar redirecionamento para:

```txt
http://localhost:3000/users
```

6. Abrir detalhe de um utilizador a partir da lista.

7. Fazer logout e confirmar redirecionamento para `/login`.

---

## Diferença face à react-spa

| Aspeto                              | `react-spa`     | `nextjs-app`                        |
| ----------------------------------- | --------------- | ----------------------------------- |
| Modelo                              | SPA             | SSR/BFF                             |
| API chamada pelo browser            | Sim             | Parcialmente, via endpoints Next.js |
| Token no `localStorage`             | Sim ou possível | Não                                 |
| Cookie `httpOnly`                   | Não é o foco    | Sim                                 |
| Renderização protegida no servidor  | Não             | Sim                                 |
| Uso de Route Handlers               | Não             | Sim                                 |
| URL real da API exposta ao frontend | Normalmente sim | Não obrigatoriamente                |

---

## Troubleshooting

### Erro: `SPRING_API_BASE_URL is not configured`

Verifica se existe o ficheiro `.env.local` e se contém:

```env
SPRING_API_BASE_URL=http://localhost:8080
```

Depois reinicia o servidor Next.js.

### Erro ao fazer login

Confirma:

* se a `spring-api` está ativa;
* se estás a usar credenciais válidas;
* se o endpoint `http://localhost:8080/api/health` responde;
* se a app Next.js foi reiniciada após alteração do `.env.local`.

### Após login volta para `/login`

Possíveis causas:

* a cookie não foi criada;
* o nome da cookie usado em `session.ts` não coincide com o usado no login;
* o token expirou ou é inválido;
* a `spring-api` está a devolver `401 Unauthorized`.

### `document.cookie` não mostra o token

Isto é esperado. A cookie está protegida por `httpOnly`.

### A app em Docker não consegue contactar a API

Se a app estiver em container e a `spring-api` estiver no host, `localhost:8080` aponta para o próprio container, não para a máquina host.

Usa:

```txt
http://host.docker.internal:8080
```

ou coloca ambos os serviços na mesma rede Docker Compose.

---

## Critérios de validação

A implementação está correta quando:

* `npm install` conclui sem erros;
* `npm run dev` arranca a app em `http://localhost:3000`;
* `/login` permite autenticação com as credenciais de teste;
* o login cria uma cookie `httpOnly`;
* `/users` mostra dados vindos da `spring-api`;
* `/users/[id]` mostra detalhe do utilizador;
* logout remove a sessão;
* utilizadores não autenticados são redirecionados para `/login`.

---