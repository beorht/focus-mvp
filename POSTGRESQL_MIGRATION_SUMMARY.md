# 📊 Сводка миграции на PostgreSQL

## ✅ Что было сделано

### 1️⃣ Обновлена конфигурация Prisma
**Файл:** `prisma/schema.prisma`
```prisma
# Было (SQLite):
datasource db {
  provider = "sqlite"
}

# Стало (PostgreSQL):
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Добавлена новая модель:**
```prisma
model TestResult {
  id                  String   @id @default(cuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  riasecScores        Json
  riasecPercentages   Json
  hollandCode         String
  professions         Json
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@map("test_results")
}
```

### 2️⃣ Переписаны API endpoints

**`/api/register/route.ts`**
- ❌ Было: Сохранение в `data/users.json`
- ✅ Стало: Сохранение в `users` таблице PostgreSQL через Prisma
- Добавлена проверка дубликатов в БД

**`/api/save-results/route.ts`**
- ❌ Было: Сохранение в `data/test-results.json`
- ✅ Стало: Сохранение в `test_results` таблице PostgreSQL
- Добавлена привязка к пользователю (userId)
- GET endpoint теперь поддерживает фильтр по userId

### 3️⃣ Добавлены переменные окружения

**`.env.local`** (первая строка):
```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/focus_mvp"
```

Параметры:
- User: `postgres`
- Password: `1234`
- Host: `localhost` (или 127.0.0.1)
- Port: `5432` (стандартный PostgreSQL port)
- Database: `focus_mvp`

### 4️⃣ Созданы миграции Prisma

**Новая миграция:** `prisma/migrations/20260429150000_init_postgresql/migration.sql`

Создает:
- Таблица `users` с полями: id, firstName, lastName, age, phone, educationalInstitution, createdAt, updatedAt
- Таблица `test_results` с JSONB полями для хранения результатов тестов
- Индексы для быстрого поиска (phone, userId)
- Foreign Key связь между users и test_results

**Обновлен:** `prisma/migrations/migration_lock.toml`
```toml
provider = "postgresql"  # было "sqlite"
```

### 5️⃣ Созданы документы

- **DATABASE_MIGRATION.md** — пошаговая инструкция внедрения
- **POSTGRESQL_SETUP.md** — подробная инструкция установки PostgreSQL

---

## 🚀 Что нужно сделать (Пошагово)

### Этап 1: Установка PostgreSQL (5-10 минут)

```bash
# Linux (Ubuntu/Debian)
sudo apt update && sudo apt install postgresql

# macOS
brew install postgresql

# Windows
# Скачать инсталлер с postgresql.org
```

### Этап 2: Создание БД (2 минуты)

```bash
# Создать БД
sudo -u postgres createdb focus_mvp

# Или подключиться и создать вручную
sudo -u postgres psql
CREATE DATABASE focus_mvp;
\q
```

### Этап 3: Применение миграций (1-2 минуты)

```bash
# В папке проекта:
npm install

# Примените миграции
npx prisma migrate deploy
```

### Этап 4: Проверка (1 минута)

```bash
# Откройте Prisma Studio (графический интерфейс)
npx prisma studio

# Должны быть видны две таблицы: users и test_results
```

### Этап 5: Запуск (1 минута)

```bash
npm run dev
```

---

## 📈 Преимущества PostgreSQL

| Параметр | SQLite (Было) | PostgreSQL (Стало) |
|----------|--------------|------------------|
| Масштабируемость | ❌ Не масштабируется | ✅ Масштабируется |
| Конкурентность | ❌ Блокировка файла | ✅ ACID транзакции |
| Безопасность | ❌ Файл на диске | ✅ Защищенная БД |
| Production | ❌ Не рекомендуется | ✅ Enterprise-grade |
| Backup | ❌ Копирование файла | ✅ Встроенные инструменты |
| JSON поля | ⚠️ Ограниченно | ✅ JSONB (с индексами) |
| Количество пользователей | ⚠️ ~1000 | ✅ Миллионы |

---

## 🔄 Данные JSON files → PostgreSQL

**Старые файлы (больше не используются):**
- ❌ `data/users.json` — удалить/архивировать
- ❌ `data/test-results.json` — удалить/архивировать

**Новые таблицы в БД:**
- ✅ `users` — пользовательские данные
- ✅ `test_results` — результаты тестов

**Миграция данных:**
Если нужно перенести старые данные из JSON в БД:
```bash
# Скрипт для миграции (если нужен):
node scripts/migrate-json-to-db.js
```

---

## 🧪 Проверка работы

### Тест 1: Регистрация
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "age": 25,
    "phone": "+998901234567",
    "educationalInstitution": "School",
    "gradeOrCourse": "10"
  }'
```

**Результат:** Пользователь сохранен в `users` таблице БД ✅

### Тест 2: Просмотр в Prisma Studio
```bash
npx prisma studio
# Перейти на http://localhost:5555
# Видны данные в users таблице
```

---

## ⚠️ Важные моменты

1. **DATABASE_URL** — обязательно указать перед запуском приложения
2. **PostgreSQL должен работать** — иначе ошибка "connection refused"
3. **БД должна существовать** — создайте `focus_mvp` перед миграциями
4. **Миграции идемпотентны** — можно запустить несколько раз без проблем

---

## 📋 Команды для быстрого старта

```bash
# 1. Установить зависимости
npm install

# 2. Применить миграции
npx prisma migrate deploy

# 3. Проверить БД
npx prisma studio

# 4. Запустить приложение
npm run dev
```

---

## 🎯 Итоговый результат

После выполнения всех шагов:

✅ Все пользовательские данные сохраняются в PostgreSQL  
✅ Результаты тестов хранятся в таблице test_results  
✅ Данные защищены и масштабируемы  
✅ Приложение готово к production  
✅ Легко добавлять новые функции и данные  

---

**Документация:**
- 📖 `DATABASE_MIGRATION.md` — подробная пошаговая инструкция
- 📖 `POSTGRESQL_SETUP.md` — установка PostgreSQL
- 📖 `CLAUDE.md` — архитектура проекта

**Нужна помощь?** Смотрите раздел "Troubleshooting" в DATABASE_MIGRATION.md
