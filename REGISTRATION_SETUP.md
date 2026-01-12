# Инструкция по системе регистрации

## 📋 Что было добавлено

Теперь перед прохождением теста пользователи должны пройти регистрацию. Система собирает следующие данные:

### Поля регистрации
1. **ФИО** (обязательно, минимум 5 символов)
2. **Возраст** (обязательно, 14-100 лет)
3. **Телефон** (обязательно, формат +998XXXXXXXXX)
4. **Учебное заведение** (обязательно)
5. **Класс или курс** (обязательно)

### Поток пользователя
```
Landing Page → Registration → Test (12 вопросов) → Analysis → Results
```

## 📂 Где хранятся данные

Все данные сохраняются в JSON файлах в директории `/data/`:

### 1. Данные регистрации
**Файл**: `data/users.json`

**Формат**:
```json
[
  {
    "id": "uuid-v4",
    "timestamp": "2026-01-13T20:00:00.000Z",
    "fullName": "Иван Петров",
    "age": 17,
    "phone": "+998901234567",
    "educationalInstitution": "Школа №1",
    "gradeOrCourse": "11 класс"
  }
]
```

### 2. Результаты тестов
**Файл**: `data/test-results.json`

**Формат**:
```json
[
  {
    "userId": "uuid-v4",
    "userName": "Иван Петров",
    "timestamp": "2026-01-13T20:05:00.000Z",
    "riasec_scores": {
      "R": 7,
      "I": 9,
      "A": 5,
      "S": 3,
      "E": 6,
      "C": 8
    },
    "riasec_percentages": {
      "R": 70,
      "I": 90,
      "A": 50,
      "S": 30,
      "E": 60,
      "C": 80
    },
    "holland_code": "ICE",
    "professions": [
      {
        "name": "Backend-разработчик",
        "match": 87,
        "category": "IT"
      }
    ]
  }
]
```

## 🔒 Безопасность

1. **Валидация данных**:
   - Имя/Фамилия: только буквы (кириллица + латиница), 2-50 символов
   - Возраст: 14-100 лет
   - Телефон: строгий формат +998XXXXXXXXX
   - Защита от дубликатов телефонов

2. **Приватность**:
   - Файлы `data/*.json` добавлены в `.gitignore`
   - Данные НЕ попадают в git репозиторий

## 📊 Как получить данные

### Вариант 1: Прямой доступ к JSON файлам
```bash
# Данные регистрации
cat data/users.json

# Результаты тестов
cat data/test-results.json
```

### Вариант 2: Через API endpoints

**Получить всех пользователей**:
```bash
curl http://localhost:3000/api/register
```

**Получить все результаты**:
```bash
curl http://localhost:3000/api/save-results
```

## 📥 Экспорт в Excel/CSV

### Способ 1: Онлайн конвертер
1. Откройте `data/users.json` или `data/test-results.json`
2. Скопируйте содержимое
3. Используйте онлайн конвертер (например: https://www.convertcsv.com/json-to-csv.htm)
4. Конвертируйте в CSV
5. Откройте в Excel

### Способ 2: Python скрипт
```python
import json
import pandas as pd

# Конвертация users.json
with open('data/users.json', 'r', encoding='utf-8') as f:
    users = json.load(f)
df_users = pd.DataFrame(users)
df_users.to_excel('users.xlsx', index=False)

# Конвертация test-results.json
with open('data/test-results.json', 'r', encoding='utf-8') as f:
    results = json.load(f)
df_results = pd.DataFrame(results)
df_results.to_excel('test-results.xlsx', index=False)
```

### Способ 3: Node.js скрипт
```javascript
const fs = require('fs');
const { utils, writeFile } = require('xlsx');

// Конвертация users.json
const users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
const wsUsers = utils.json_to_sheet(users);
const wbUsers = utils.book_new();
utils.book_append_sheet(wbUsers, wsUsers, 'Users');
writeFile(wbUsers, 'users.xlsx');

// Конвертация test-results.json
const results = JSON.parse(fs.readFileSync('data/test-results.json', 'utf-8'));
const wsResults = utils.json_to_sheet(results);
const wbResults = utils.book_new();
utils.book_append_sheet(wbResults, wsResults, 'Results');
writeFile(wbResults, 'test-results.xlsx');
```

## 🌐 Мультиязычность

Форма регистрации поддерживает 3 языка:
- Русский (ru)
- Узбекский кириллица (uz-cyrl)
- Узбекский латиница (uz-latn)

Переключение языка доступно через селектор в правом верхнем углу.

## 🚀 Запуск приложения

```bash
# Разработка
npm run dev

# Продакшн
npm run build
npm start

# PM2 (рекомендуется)
npm run deploy
```

## 📝 Примечания

- Данные пользователей связаны с результатами через `userId`
- Timestamp в ISO формате для удобной сортировки
- JSON файлы отформатированы с отступами (2 пробела) для читаемости
- Все операции записи используют UTF-8 кодировку

## 🛠️ Дополнительные настройки

Если нужно изменить поля формы:
1. Обновите `app/register/page.tsx` (форма)
2. Обновите `app/api/register/route.ts` (валидация и сохранение)
3. Обновите переводы в `locales/*.json`
