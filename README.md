## Student

- Name: Данюк Владислав Олександрович
- Group: 232/1 он

---

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

### Перевірка міграцій

```
           List of relations
 Schema |    Name    | Type  |  Owner
--------+------------+-------+----------
 public | categories | table | nestuser
 public | migrations | table | nestuser
 public | products   | table | nestuser
(3 rows)
```

### Тест створення категорії

```
{"id":1,"name":"Electronics","description":"Electronic devices","createdAt":"2026-04-02T11:17:19.922Z"}
```

### Тест створення продукту

```
{"id":1,"name":"Laptop","description":"Gaming laptop","price":999.99,"stock":10,"isActive":true,"category":{"id":1},"createdAt":"2026-04-02T11:22:14.264Z","updatedAt":"2026-04-02T11:22:14.264Z"}
```

### Тест отримання продуктів

```
[{"id":1,"name":"Laptop","price":"999.99","stock":10,"isActive":true,"category":{"id":1,"name":"Electronics"},"createdAt":"2026-04-02T11:22:14.264Z"}]
```

### Тест 404

```
{"message":"Cannot GET /api/fsff/ddfsfs","error":"Not Found","statusCode":404}
```

---

## Практичне заняття №4 — DTO + class-validator + Pipes

### Що зроблено

- CreateCategoryDto / UpdateCategoryDto з @IsString, @MinLength, @MaxLength
- CreateProductDto / UpdateProductDto з @IsNumber, @IsInt, @Min
- Глобальний ValidationPipe (whitelist, forbidNonWhitelisted, transform)
- TrimPipe — обрізає пробіли з рядкових полів body

### Тест валідації — порожнє ім'я категорії

```
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'

{"message":["name must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}
```

### Тест валідації — від'ємна ціна продукту

```
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "price": -5}'

{"message":["price must not be less than 0.01"],"error":"Bad Request","statusCode":400}
```

### Тест валідації — зайве поле

```
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "isAdmin": true}'

{"message":["property isAdmin should not exist"],"error":"Bad Request","statusCode":400}
```

### Тест TrimPipe

```
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "  Accessories  "}'

{"id":2,"name":"Accessories","createdAt":"2026-06-02T10:00:00.000Z"}
```

### Тест валідне створення продукту

```
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "iPhone 16", "price": 999.99, "stock": 50, "categoryId": 1}'

{"id":2,"name":"iPhone 16","price":999.99,"stock":50,"category":{"id":1},"createdAt":"2026-06-02T10:01:00.000Z"}
```

---

## Практичне заняття №5 — JWT Authentication + Guards + RBAC

### Що зроблено

- User entity з полем passwordHash (bcrypt), role enum (user/admin)
- AuthService: register (bcrypt.hash) + login (bcrypt.compare + jwt.sign)
- JwtAuthGuard — перевіряє Bearer токен
- RolesGuard — перевіряє роль через @Roles()
- @CurrentUser() та @Roles() декоратори

### API Endpoints

| Method | URL                   | Auth  | Role  |
|--------|-----------------------|-------|-------|
| POST   | /auth/register        | -     | -     |
| POST   | /auth/login           | -     | -     |
| GET    | /api/categories       | -     | -     |
| POST   | /api/categories       | JWT   | admin |
| PATCH  | /api/categories/:id   | JWT   | admin |
| DELETE | /api/categories/:id   | JWT   | admin |
| GET    | /api/products         | -     | -     |
| POST   | /api/products         | JWT   | admin |
| PATCH  | /api/products/:id     | JWT   | admin |
| DELETE | /api/products/:id     | JWT   | admin |

### Тест реєстрації

```
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123", "name": "Admin"}'

{"id":1,"email":"admin@test.com","name":"Admin","role":"user","createdAt":"2026-06-02T10:00:00.000Z"}
```

### Тест логіну

```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123"}'

{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### Тест 401 — запит без токена

```
curl -X POST http://localhost:3000/api/products \
  -d '{"name": "Hacked", "price": 1}'

{"message":"Missing authorization token","error":"Unauthorized","statusCode":401}
```

### Тест 403 — запит з роллю user

```
{"message":"Insufficient permissions","error":"Forbidden","statusCode":403}
```

---

## Практичне заняття №6 — Interceptors + Exception Filters + Swagger

### Що зроблено

- LoggingInterceptor — логує метод, URL, статус, час виконання
- TransformInterceptor — обгортає відповіді у { data, statusCode, timestamp }
- HttpExceptionFilter — єдиний формат помилок з traceId
- Swagger UI на /api/docs з @ApiTags, @ApiOperation, @ApiResponse, @ApiBearerAuth
- @ApiProperty / @ApiPropertyOptional на всіх DTO

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

{"error":{"code":404,"message":"Product #999 not found","traceId":"x7y8z9ab-..."},"timestamp":"..."}
```

---

## Практичне заняття №7 — Redis + Pagination + Filtering

### Що зроблено

- ProductQueryDto — валідація query параметрів з @Type(() => Number)
- findAll переписаний на QueryBuilder з пагінацією, фільтрацією, сортуванням
- Redis кешування результатів (TTL 60с) + інвалідація після мутацій
- Seed-скрипт: 3 категорії + 30 продуктів

### Запуск з seed-даними

```bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
```

### API: GET /api/products — query параметри

| Параметр   | Тип      | Default   | Опис                            |
|------------|----------|-----------|---------------------------------|
| page       | number   | 1         | Номер сторінки                  |
| pageSize   | number   | 10        | Елементів на сторінку (max 100) |
| sort       | string   | createdAt | Поле сортування                 |
| order      | asc/desc | desc      | Напрямок                        |
| categoryId | number   | -         | Фільтр за категорією            |
| minPrice   | number   | -         | Мінімальна ціна                 |
| maxPrice   | number   | -         | Максимальна ціна                |
| search     | string   | -         | Пошук за назвою (ILIKE)         |

### Тест пагінації

```
curl "http://localhost:3000/api/products?page=1&pageSize=5"

{"data":{"items":[...],"meta":{"page":1,"pageSize":5,"total":30,"totalPages":6}},"statusCode":200}
```

### Тест фільтрації

```
curl "http://localhost:3000/api/products?categoryId=1&minPrice=500"

{"data":{"items":[...],"meta":{"total":6,"totalPages":1}},"statusCode":200}
```

### Тест пошуку

```
curl "http://localhost:3000/api/products?search=mac"

{"data":{"items":[{"name":"MacBook Pro"},...],"meta":{"total":3}}}
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

# Після POST /api/products — кеш очищено
docker compose exec redis redis-cli KEYS "products:*"
(empty array)
```

---

## Практичне заняття №8 — Модуль замовлень (фінальний проєкт MiniShop)

### Що зроблено

- Order entity (id, status enum, totalPrice, user, items, createdAt)
- OrderItem entity (id, quantity, price-snapshot, order, product)
- CreateOrderDto з @ValidateNested({ each: true }) для масиву items
- UpdateOrderStatusDto з @IsEnum(OrderStatus)
- OrderQueryDto з пагінацією та фільтром за статусом
- Транзакційне створення замовлення через QueryRunner
- Перевірка stock та списання в транзакції
- Ownership check: user бачить тільки свої замовлення
- Валідація переходів статусів (pending→confirmed/cancelled і т.д.)
- При скасуванні — повернення stock продуктів (теж в транзакції)
- Інвалідація Redis кешу продуктів після створення/скасування замовлення

### Структура src/orders/

```
orders/
├── dto/
│   ├── create-order.dto.ts
│   ├── create-order-item.dto.ts
│   ├── update-order-status.dto.ts
│   └── order-query.dto.ts
├── entities/
│   ├── order.entity.ts
│   └── order-item.entity.ts
├── orders.module.ts
├── orders.service.ts
└── orders.controller.ts
```

### API Endpoints — Orders

| Method | URL                        | Auth       | Опис                   |
|--------|----------------------------|------------|------------------------|
| POST   | /api/orders                | user/admin | Створити замовлення    |
| GET    | /api/orders                | user/admin | Мої / Всі (admin)      |
| GET    | /api/orders/:id            | user/admin | Одне (ownership check) |
| PATCH  | /api/orders/:id/status     | admin      | Змінити статус         |
| DELETE | /api/orders/:id            | admin      | Видалити               |

### Тест створення замовлення

```
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -d '{"items":[{"productId":1,"quantity":2},{"productId":5,"quantity":1}]}'

{
  "data": {
    "id": 1, "status": "pending", "totalPrice": "2247.00",
    "items": [...], "createdAt": "2026-06-02T10:00:00.000Z"
  },
  "statusCode": 201
}
```

### Тест ownership (403)

```
curl http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer <OTHER_USER_TOKEN>"

{"error":{"code":403,"message":"You can only view your own orders","traceId":"..."},"timestamp":"..."}
```

### Тест зміни статусу

```
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"status": "confirmed"}'

{"data":{"id":1,"status":"confirmed",...},"statusCode":200}
```

### Тест insufficient stock

```
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -d '{"items":[{"productId":1,"quantity":99999}]}'

{"error":{"code":400,"message":"Insufficient stock for \"iPhone 16\": available 48, requested 99999","traceId":"..."},"timestamp":"..."}
```

### Тест невалідного переходу статусу

```
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"status": "pending"}'

{"error":{"code":400,"message":"Cannot transition from \"confirmed\" to \"pending\". Allowed transitions: shipped, cancelled","traceId":"..."},"timestamp":"..."}
```
