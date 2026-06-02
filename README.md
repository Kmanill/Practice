## Student

- Name: Данюк Владислав Олександрович
- Group: 232/1 он

## Практичне заняття №3 — CRUD REST API для MiniShop

### Структура репозиторію

```
.
├── src/
│   ├── categories/ ...
│   ├── products/ ...
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

---

## Практичне заняття №6 — Interceptors + Exception Filters + Swagger

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

### Swagger UI

http://localhost:3000/api/docs

---

## Практичне заняття №7 — Redis + Pagination + Filtering

### Структура репозиторію

```
.
├── src/
│   ├── auth/ ...
│   ├── users/ ...
│   ├── categories/ ...
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   ├── update-product.dto.ts
│   │   │   └── product-query.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── seeds/
│   │   └── seed.ts
│   ├── common/ ...
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
docker compose run --rm app npm run seed
```

### API: GET /api/products

| Параметр   | Тип    | Default    | Опис                          |
|------------|--------|------------|-------------------------------|
| page       | number | 1          | Номер сторінки                |
| pageSize   | number | 10         | Елементів на сторінку (max 100) |
| sort       | string | createdAt  | Поле сортування               |
| order      | asc/desc | desc     | Напрямок                      |
| categoryId | number | -          | Фільтр за категорією          |
| minPrice   | number | -          | Мінімальна ціна               |
| maxPrice   | number | -          | Максимальна ціна              |
| search     | string | -          | Пошук за назвою (ILIKE)       |

### Тест пагінації

```
curl "http://localhost:3000/api/products?page=1&pageSize=5"

{
  "data": {
    "items": [...],
    "meta": { "page": 1, "pageSize": 5, "total": 30, "totalPages": 6 }
  },
  "statusCode": 200,
  "timestamp": "2026-06-02T10:30:00.000Z"
}
```

### Тест фільтрації

```
curl "http://localhost:3000/api/products?categoryId=1&minPrice=500"

{
  "data": {
    "items": [MacBook Pro, iPhone 16, iPad Air ...],
    "meta": { "page": 1, "pageSize": 10, "total": 6, "totalPages": 1 }
  },
  "statusCode": 200
}
```

### Тест пошуку

```
curl "http://localhost:3000/api/products?search=mac"

{
  "data": {
    "items": [{"name": "MacBook Pro"}, ...],
    "meta": { "total": 3 }
  }
}
```

### Тест кешування (Redis)

```
docker compose exec redis redis-cli KEYS "products:*"

1) "products:{\"page\":1,\"pageSize\":10,\"sort\":\"createdAt\",\"order\":\"desc\"}"
```

### Тест інвалідації кешу

```
# До POST — є ключ
docker compose exec redis redis-cli KEYS "products:*"
1) "products:{...}"

# Після POST /api/products
docker compose exec redis redis-cli KEYS "products:*"
(empty array)
```
