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
│   │   ├── 1700000001-CreateTables.ts
│   │   └── <timestamp>-AddIsActiveToProducts.ts
│   ├── data-source.ts
│   ├── app.module.ts
│   └── main.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
...
```

## Запуск проекту

```
cp .env.example .env   # налаштувати значення
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
[{"id":1,"name":"Laptop","description":"Gaming laptop","price":"999.99","stock":10,"isActive":true,"category":{"id":1,"name":"Electronics","description":"Electronic devices","createdAt":"2026-04-02T11:17:19.922Z"},"createdAt":"2026-04-02T11:22:14.264Z","updatedAt":"2026-04-02T11:22:14.264Z"}]
```

### Тест 404

```
{"message":"Cannot GET /api/fsff/ddfsfs","error":"Not Found","statusCode":404}
```

---

## Практичне заняття №4 — DTO + class-validator + Pipes

### Структура репозиторію

```
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── common/
│   │   └── pipes/
│   │       └── trim.pipe.ts
│   ├── migrations/
│   ├── data-source.ts
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

{"id":2,"name":"iPhone 16","price":999.99,"stock":50,"category":{"id":1},"createdAt":"2026-06-02T10:01:00.000Z","updatedAt":"2026-06-02T10:01:00.000Z"}
```
