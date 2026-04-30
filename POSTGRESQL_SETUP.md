# PostgreSQL Setup Guide для F.O.C.U.S MVP

## 1️⃣ Установка PostgreSQL

### На Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### На macOS (Homebrew):
```bash
brew install postgresql
```

### На Windows:
Скачайте инсталлер с [postgresql.org](https://www.postgresql.org/download/windows/)

---

## 2️⃣ Запуск PostgreSQL

### Linux:
```bash
# Запустить сервис
sudo systemctl start postgresql

# Проверить статус
sudo systemctl status postgresql

# (Опционально) Запустить при загрузке
sudo systemctl enable postgresql
```

### macOS:
```bash
# Запустить сервис
brew services start postgresql

# Остановить
brew services stop postgresql
```

### Windows:
PostgreSQL должен запуститься автоматически после установки.

---

## 3️⃣ Создание базы данных

```bash
# Подключиться к PostgreSQL
sudo -u postgres psql

# Или если используется пароль:
psql -U postgres -h localhost
```

**В psql консоли выполните:**

```sql
-- Создать базу данных
CREATE DATABASE focus_mvp;

-- Проверить создание
\l

-- Выход
\q
```

**Или одной командой:**

```bash
sudo -u postgres createdb focus_mvp
```

---

## 4️⃣ Инициализация Prisma

```bash
# Установить зависимости (если еще не установлены)
npm install

# Создать миграцию (если нужна)
npx prisma migrate dev --name init

# Или применить существующие миграции
npx prisma migrate deploy

# (Опционально) Открыть Prisma Studio для просмотра БД
npx prisma studio
```

---

## 5️⃣ Проверка подключения

```bash
# Подключиться к БД напрямую
psql -U postgres -h localhost -d focus_mvp

# Проверить таблицы
\dt

# Выход
\q
```

---

## 6️⃣ Переменные окружения

В файле `.env.local` уже указано:

```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/focus_mvp"
```

**Если у вас другие параметры:**
- `postgres` — имя пользователя
- `1234` — пароль
- `localhost` — хост (обычно localhost или 127.0.0.1)
- `5432` — порт PostgreSQL (по умолчанию)
- `focus_mvp` — имя базы данных

---

## 7️⃣ Структура базы данных

После миграции будут созданы две таблицы:

### `users` (Пользователи)
- `id` — уникальный ID (cuid)
- `firstName` — имя
- `lastName` — фамилия
- `age` — возраст
- `phone` — телефон (уникальный)
- `educationalInstitution` — учебное заведение
- `createdAt` — дата создания
- `updatedAt` — дата обновления

### `test_results` (Результаты тестов)
- `id` — уникальный ID
- `userId` — ID пользователя (внешний ключ)
- `riasecScores` — RIASEC баллы (JSON)
- `riasecPercentages` — RIASEC проценты (JSON)
- `hollandCode` — Holland Code (например, "IRA")
- `professions` — рекомендованные профессии (JSON)
- `createdAt` — дата создания
- `updatedAt` — дата обновления

---

## 8️⃣ Запуск приложения

```bash
# Development
npm run dev

# Production
npm run build
npm run start

# С PM2
npm run deploy
```

---

## 🔧 Troubleshooting

### Ошибка: "connection refused"
- Проверьте, запущен ли PostgreSQL: `sudo systemctl status postgresql`
- Проверьте правильность `DATABASE_URL` в `.env.local`

### Ошибка: "password authentication failed"
- Проверьте пароль PostgreSQL (по умолчанию пустой или совпадает с логином)
- Может потребоваться изменить пароль:
  ```bash
  sudo -u postgres psql
  # В psql:
  ALTER USER postgres WITH PASSWORD '1234';
  ```

### Ошибка: "database does not exist"
- Создайте базу данных: `sudo -u postgres createdb focus_mvp`

### Не могу подключиться локально
- Проверьте `/etc/postgresql/*/main/postgresql.conf` и убедитесь, что `listen_addresses = 'localhost'`
- Перезагрузите PostgreSQL: `sudo systemctl restart postgresql`

---

## 📊 Полезные команды

```bash
# Просмотр БД в Prisma Studio (графический интерфейс)
npx prisma studio

# Просмотр логов миграций
npx prisma migrate status

# Откат последней миграции
npx prisma migrate resolve --rolled-back "migration_name"

# Reset БД (ВНИМАНИЕ: удалит все данные!)
npx prisma migrate reset

# Экспорт/импорт БД
pg_dump -U postgres focus_mvp > backup.sql
psql -U postgres focus_mvp < backup.sql
```

---

## ✅ Готово!

После завершения этих шагов приложение F.O.C.U.S будет сохранять:
- ✅ Данные пользователей в таблице `users`
- ✅ Результаты тестов в таблице `test_results`
- ✅ Все данные в защищенной PostgreSQL БД

Для просмотра данных используйте `npx prisma studio`
