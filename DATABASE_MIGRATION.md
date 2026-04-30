# Миграция на PostgreSQL (Инструкция выполнения)

## 📋 Что было изменено

### 1. **Конфигурация Prisma**
- ✅ `prisma/schema.prisma` — изменен провайдер с SQLite на PostgreSQL
- ✅ Добавлена переменная `DATABASE_URL` для подключения
- ✅ Добавлена новая модель `TestResult` для сохранения результатов тестов

### 2. **API Endpoints**
- ✅ `/api/register/route.ts` — переписано на использование Prisma вместо JSON файлов
- ✅ `/api/save-results/route.ts` — переписано на использование Prisma
- ✅ Оба endpoint'а теперь сохраняют данные в PostgreSQL БД

### 3. **Переменные окружения**
- ✅ `.env.local` — добавлена `DATABASE_URL` для PostgreSQL
- ✅ Формат: `postgresql://postgres:1234@localhost:5432/focus_mvp`

### 4. **Миграции Prisma**
- ✅ Создана новая миграция: `20260429150000_init_postgresql`
- ✅ `migration_lock.toml` — обновлен провайдер на PostgreSQL

---

## 🚀 Пошаговое внедрение

### Шаг 1: Убедитесь, что PostgreSQL установлен и работает

```bash
# Проверьте статус
sudo systemctl status postgresql

# Если не работает, запустите:
sudo systemctl start postgresql
```

### Шаг 2: Создайте базу данных

```bash
# Подключитесь к PostgreSQL
sudo -u postgres psql

# Выполните команды в psql:
CREATE DATABASE focus_mvp;
\l  # Проверить, что БД создана
\q  # Выход
```

Или одной командой:
```bash
sudo -u postgres createdb focus_mvp
```

### Шаг 3: Установите зависимости Prisma

```bash
npm install
```

### Шаг 4: Примените миграции

```bash
# Примените все миграции
npx prisma migrate deploy

# Или создайте миграции с нуля
npx prisma migrate dev --name init
```

### Шаг 5: Проверьте подключение

```bash
# Откройте Prisma Studio (графический интерфейс)
npx prisma studio

# Должно открыться окно браузера с интерфейсом для просмотра/редактирования БД
```

### Шаг 6: Запустите приложение

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Или с PM2
npm run deploy
```

---

## ✅ Проверка работы

### Тест 1: Регистрация пользователя

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "age": 25,
    "phone": "+998901234567",
    "educationalInstitution": "School #1",
    "gradeOrCourse": "10th grade"
  }'
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "data": {
    "userId": "clv12345...",
    "fullName": "John Doe"
  },
  "message": "Регистрация успешна!"
}
```

### Тест 2: Получение пользователей

```bash
curl http://localhost:3000/api/register
```

### Тест 3: Сохранение результатов теста

```bash
curl -X POST http://localhost:3000/api/save-results \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "clv12345...",
    "userName": "John Doe",
    "riasecScores": {"R": 8, "I": 9, "A": 5, "S": 4, "E": 6, "C": 7},
    "riasecPercentages": {"R": 80, "I": 90, "A": 50, "S": 40, "E": 60, "C": 70},
    "hollandCode": "IRA",
    "professions": [
      {
        "name": "Frontend-разработчик",
        "match": 92,
        "matchPercentage": 92,
        "category": "IT"
      }
    ]
  }'
```

### Тест 4: Получение результатов пользователя

```bash
curl "http://localhost:3000/api/save-results?userId=clv12345..."
```

---

## 📊 Структура БД в PostgreSQL

### Таблица: `users`
```sql
id (TEXT)                    — уникальный ID
firstName (TEXT)             — имя
lastName (TEXT)              — фамилия
age (INTEGER)                — возраст
phone (TEXT, UNIQUE)         — номер телефона
educationalInstitution (TEXT) — учебное заведение
createdAt (TIMESTAMP)        — дата создания
updatedAt (TIMESTAMP)        — дата обновления
```

### Таблица: `test_results`
```sql
id (TEXT)                    — уникальный ID
userId (TEXT, FK)            — ID пользователя (ссылка на users)
riasecScores (JSONB)         — RIASEC баллы
riasecPercentages (JSONB)    — RIASEC проценты
hollandCode (TEXT)           — Holland Code (e.g., "IRA")
professions (JSONB)          — массив рекомендованных профессий
createdAt (TIMESTAMP)        — дата создания
updatedAt (TIMESTAMP)        — дата обновления
```

---

## 🔧 Полезные команды

### Просмотр БД
```bash
# Графический интерфейс Prisma Studio
npx prisma studio

# Или через psql командную строку
psql -U postgres -h localhost -d focus_mvp
```

### Экспорт/Импорт данных
```bash
# Экспорт всей БД
pg_dump -U postgres -h localhost focus_mvp > backup.sql

# Импорт
psql -U postgres -h localhost focus_mvp < backup.sql
```

### Удаление и пересоздание БД
```bash
# ⚠️ ВНИМАНИЕ: Удалит все данные!
# Удалить БД
sudo -u postgres dropdb focus_mvp

# Создать заново
sudo -u postgres createdb focus_mvp

# Повторить Шаг 4-5 выше
npx prisma migrate deploy
```

---

## ❓ Часто задаваемые вопросы

### Q: Ошибка "connection refused"
**A:** PostgreSQL не запущен или не доступен. Запустите:
```bash
sudo systemctl start postgresql
# Или проверьте DATABASE_URL в .env.local
```

### Q: Ошибка "database does not exist"
**A:** БД не создана. Выполните:
```bash
sudo -u postgres createdb focus_mvp
```

### Q: Ошибка "password authentication failed"
**A:** Проверьте пароль PostgreSQL в `.env.local`:
```bash
# Измените пароль (если забыли):
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD '1234';
\q
```

### Q: Как убедиться, что миграция успешна?
**A:** Используйте Prisma Studio:
```bash
npx prisma studio
# Должны быть видны таблицы users и test_results
```

### Q: Как откатить миграцию?
**A:**
```bash
# Откатить последнюю миграцию
npx prisma migrate resolve --rolled-back "20260429150000_init_postgresql"

# Или reset всей БД (⚠️ удалит все данные)
npx prisma migrate reset
```

---

## 📝 Итоговый чек-лист

- [ ] PostgreSQL установлен и работает
- [ ] БД `focus_mvp` создана
- [ ] `.env.local` содержит правильный `DATABASE_URL`
- [ ] `npm install` выполнен
- [ ] `npx prisma migrate deploy` выполнен
- [ ] `npx prisma studio` показывает две таблицы (users, test_results)
- [ ] `npm run dev` запускается без ошибок
- [ ] Тест регистрации успешен (пользователь сохранен в БД)
- [ ] Тест сохранения результатов успешен

---

## 🎉 Готово!

Ваше приложение F.O.C.U.S теперь полностью работает с PostgreSQL базой данных. Все пользовательские данные сохраняются в безопасной БД вместо JSON файлов.

**Для просмотра/редактирования данных**: `npx prisma studio`
