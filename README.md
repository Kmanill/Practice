## Student

- Name: Данюк Владислав Олександрович
- Group: 232/1 он

## Практичне заняття №3 — CRUD REST API для MiniShop

### Структура репозиторію

```
.
├── src/
│   ├── categories/
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── migrations/
│   ├── data-source.ts
│   ├── app.module.ts
│   └── main.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Запуск проекту

```
cp .env.example .env
docker compose up --build
```

### API Endpoints

| Method | URL                 | Опис               |
| ------ | ------------------- | ------------------ |
| GET    | /api/categories     | Список категорій   |
| GET    | /api/categories/:id | Одна категорія     |
| POST   | /api/categories     | Створити категорію |
| PATCH  | /api/categories/:id | Оновити категорію  |
| DELETE | /api/categories/:id | Видалити категорію |
| GET    | /api/products       | Список продуктів   |
| GET    | /api/products/:id   | Один продукт       |
| POST   | /api/products       | Створити продукт   |
| PATCH  | /api/products/:id   | Оновити продукт    |
| DELETE | /api/products/:id   | Видалити продукт   |

### Тест створення категорії

```
{"id":1,"name":"Electronics","description":"Electronic devices","createdAt":"2026-04-02T11:17:19.922Z"}
```

### Тест створення продукту

```
{"id":1,"name":"Laptop","description":"Gaming laptop","price":999.99,"stock":10,"isActive":true,"category":{"id":1},"createdAt":"2026-04-02T11:22:14.264Z","updatedAt":"2026-04-02T11:22:14.264Z"}
```

---

## Практичне заняття №4 — DTO + class-validator + Pipes

### Тест валідації — порожнє ім'я категорії

```
{"message":["name must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}
```

### Тест TrimPipe

```
{"id":2,"name":"Accessories","createdAt":"2026-06-02T10:00:00.000Z"}
```

---

## Практичне заняття №5 — JWT Authentication + Guards + RBAC

### API Endpoints

| Method | URL                   | Auth | Role  |
|--------|-----------------------|------|-------|
| POST   | /auth/register        | -    | -     |
| POST   | /auth/login           | -    | -     |
| GET    | /api/categories       | -    | -     |
| POST   | /api/categories       | JWT  | admin |
| GET    | /api/products         | -    | -     |
| POST   | /api/products         | JWT  | admin |
| PATCH  | /api/products/:id     | JWT  | admin |
| DELETE | /api/products/:id     | JWT  | admin |

### Тест реєстрації

```
{"id":1,"email":"admin@test.com","name":"Admin","role":"user","createdAt":"2026-06-02T10:00:00.000Z"}
```

### Тест логіну

```
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### Тест 401 — запит без токена

```
{"message":"Missing authorization token","error":"Unauthorized","statusCode":401}
```

---

## Практичне заняття №6 — Interceptors + Exception Filters + Swagger

### Структура репозиторію

```
.
├── src/
│   ├── auth/ ...
│   ├── users/ ...
│   ├── categories/ ...
│   ├── products/ ...
│   ├── common/
│   │   ├── enums/
│   │   │   └── role.enum.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── pipes/
│   │       └── trim.pipe.ts
│   ├── migrations/
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Запуск проекту

```bash
cp .env.example .env
docker compose up --build
```

### Swagger UI

http://localhost:3000/api/docs

### Формат успішної відповіді

```json
{
  "data": { "id": 1, "name": "Electronics" },
  "statusCode": 200,
  "timestamp": "2026-06-02T10:30:00.000Z"
}
```

### Формат помилки

```json
{
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": ["name must be longer than or equal to 2 characters"],
    "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  },
  "timestamp": "2026-06-02T10:31:00.000Z"
}
```

### Приклад логів (LoggingInterceptor)

```
[HTTP] GET /api/products — 200 — 12ms
[HTTP] POST /auth/login — 200 — 45ms
[HTTP] POST /api/products — 201 — 23ms
```

### Тест помилки з traceId

```
curl http://localhost:3000/api/products/999

{
  "error": {
    "code": 404,
    "message": "Product #999 not found",
    "traceId": "x7y8z9ab-cdef-0123-4567-890abcdef012"
  },
  "timestamp": "2026-06-02T10:32:00.000Z"
}
```
