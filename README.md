## Student

- Name: Данюк Владислав Олександрович
- Group: 232/1 он

## MiniShop API — Фінальний проєкт

REST API інтернет-магазину на NestJS + PostgreSQL + Redis.

### Технології

- NestJS + TypeScript
- PostgreSQL + TypeORM (міграції, QueryBuilder, транзакції)
- Redis (кешування з інвалідацією)
- JWT автентифікація + RBAC авторизація
- class-validator + class-transformer
- Swagger / OpenAPI

### Запуск

```bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
```

### Swagger UI

http://localhost:3000/api/docs

### Структура репозиторію

```
.
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── users/
│   │   ├── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── categories/
│   │   ├── dto/
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   ├── update-product.dto.ts
│   │   │   └── product-query.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── orders/
│   │   ├── dto/
│   │   │   ├── create-order.dto.ts
│   │   │   ├── create-order-item.dto.ts
│   │   │   ├── update-order-status.dto.ts
│   │   │   └── order-query.dto.ts
│   │   ├── entities/
│   │   │   ├── order.entity.ts
│   │   │   └── order-item.entity.ts
│   │   ├── orders.module.ts
│   │   ├── orders.service.ts
│   │   └── orders.controller.ts
│   ├── common/
│   │   ├── enums/
│   │   │   ├── role.enum.ts
│   │   │   └── order-status.enum.ts
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
│   ├── seeds/
│   │   └── seed.ts
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### API Endpoints

#### Auth

| Method | URL             | Auth | Опис          |
|--------|-----------------|------|---------------|
| POST   | /auth/register  | -    | Реєстрація    |
| POST   | /auth/login     | -    | Логін → JWT   |

#### Categories

| Method | URL                   | Auth  | Опис       |
|--------|-----------------------|-------|------------|
| GET    | /api/categories       | -     | Список     |
| GET    | /api/categories/:id   | -     | Одна       |
| POST   | /api/categories       | admin | Створити   |
| PATCH  | /api/categories/:id   | admin | Оновити    |
| DELETE | /api/categories/:id   | admin | Видалити   |

#### Products

| Method | URL                  | Auth  | Опис                        |
|--------|----------------------|-------|-----------------------------|
| GET    | /api/products        | -     | Список + pagination + filter |
| GET    | /api/products/:id    | -     | Один                        |
| POST   | /api/products        | admin | Створити                    |
| PATCH  | /api/products/:id    | admin | Оновити                     |
| DELETE | /api/products/:id    | admin | Видалити                    |

#### Orders

| Method | URL                         | Auth       | Опис                    |
|--------|-----------------------------|------------|-------------------------|
| POST   | /api/orders                 | user/admin | Створити замовлення     |
| GET    | /api/orders                 | user/admin | Мої / Всі (admin)       |
| GET    | /api/orders/:id             | user/admin | Одне (ownership check)  |
| PATCH  | /api/orders/:id/status      | admin      | Змінити статус          |
| DELETE | /api/orders/:id             | admin      | Видалити                |

### Тест створення замовлення

```
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -d '{"items":[{"productId":1,"quantity":2},{"productId":5,"quantity":1}]}'

{
  "data": {
    "id": 1,
    "status": "pending",
    "totalPrice": "2247.00",
    "items": [...],
    "createdAt": "2026-06-02T10:00:00.000Z"
  },
  "statusCode": 201
}
```

### Тест ownership (403)

```
curl http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer <OTHER_USER_TOKEN>"

{
  "error": {
    "code": 403,
    "message": "You can only view your own orders",
    "traceId": "..."
  }
}
```

### Тест зміни статусу

```
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"status": "confirmed"}'

{
  "data": { "id": 1, "status": "confirmed", ... },
  "statusCode": 200
}
```

### Тест insufficient stock

```
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -d '{"items":[{"productId":1,"quantity":99999}]}'

{
  "error": {
    "code": 400,
    "message": "Insufficient stock for \"iPhone 16\": available 48, requested 99999",
    "traceId": "..."
  }
}
```

### Тест невалідного переходу статусу

```
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"status": "pending"}'

{
  "error": {
    "code": 400,
    "message": "Cannot transition from \"confirmed\" to \"pending\". Allowed transitions: shipped, cancelled",
    "traceId": "..."
  }
}
```
