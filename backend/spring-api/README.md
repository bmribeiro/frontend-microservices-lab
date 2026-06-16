# spring-api

Backend Spring Boot inicial para o laboratório `frontend-microservices-lab`.

Nesta fase, esta aplicação é uma API backend única. Ainda não é um API Gateway real. Os frontends consomem todos o mesmo endpoint base:

```txt
http://localhost:8080
```

## Endpoints

Públicos:

```txt
GET  /api/health
POST /api/auth/login
```

Protegidos:

```txt
GET /api/auth/me
GET /api/users
GET /api/users/{id}
```

## Credenciais de teste

```txt
admin@lab.com / admin123
user@lab.com  / user123
```

## Executar com Maven local

Requisito: Java 21 e Maven instalados.

```powershell
cd backend\spring-api
mvn spring-boot:run
```

## Executar com Docker

A partir da raiz do laboratório:

```powershell
docker compose up --build spring-api
```

Testar:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

Login:

```powershell
$loginResponse = Invoke-RestMethod `
  -Uri "http://localhost:8080/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@lab.com","password":"admin123"}'

$token = $loginResponse.accessToken
```

Endpoint protegido:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8080/api/auth/me" `
  -Headers @{ Authorization = "Bearer $token" }
```

## CORS configurado para

```txt
http://localhost:3000  Next.js
http://localhost:4200  Angular
http://localhost:5173  React/Vite
http://localhost:5174  Vue/Vite
http://localhost:5175  porta alternativa Vite
```
