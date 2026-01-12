# 📊 Как посмотреть сохраненные данные

## 🎯 3 способа доступа к данным

### 1️⃣ Веб-панель администратора (Рекомендуется) ⭐

**URL**: http://localhost:3000/admin

Красивая веб-панель с возможностью:
- ✅ Просмотр всех пользователей в таблице
- ✅ Просмотр результатов тестов
- ✅ Экспорт в JSON
- ✅ Экспорт в CSV (для Excel)
- ✅ Обновление данных одной кнопкой

**Как использовать**:
```bash
# 1. Запустите приложение
npm run dev

# 2. Откройте в браузере
http://localhost:3000/admin
```

---

### 2️⃣ Прямой доступ к JSON файлам

Данные хранятся в директории `data/`:

**Пользователи**:
```bash
cat data/users.json
```

**Результаты тестов**:
```bash
cat data/test-results.json
```

**Или открыть в редакторе**:
```bash
nano data/users.json
code data/users.json  # VS Code
```

---

### 3️⃣ API endpoints

**Получить всех пользователей**:
```bash
curl http://localhost:3000/api/register | jq '.'
```

**Получить все результаты**:
```bash
curl http://localhost:3000/api/save-results | jq '.'
```

**Или откройте в браузере**:
- http://localhost:3000/api/register
- http://localhost:3000/api/save-results

---

## 📁 Структура файлов

```
data/
├── users.json          # Данные регистрации
└── test-results.json   # Результаты тестов
```

### Формат users.json:
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

### Формат test-results.json:
```json
[
  {
    "userId": "uuid-v4",
    "userName": "Иван Петров",
    "timestamp": "2026-01-13T20:05:00.000Z",
    "riasec_scores": {
      "R": 7, "I": 9, "A": 5, "S": 3, "E": 6, "C": 8
    },
    "riasec_percentages": {
      "R": 70, "I": 90, "A": 50, "S": 30, "E": 60, "C": 80
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

---

## 📥 Экспорт в Excel

### Способ 1: Через веб-панель (проще всего)
1. Откройте http://localhost:3000/admin
2. Нажмите кнопку **"CSV"**
3. Откройте скачанный файл в Excel

### Способ 2: Онлайн конвертер
1. Скопируйте содержимое `data/users.json`
2. Перейдите на https://www.convertcsv.com/json-to-csv.htm
3. Вставьте JSON и нажмите "Convert"
4. Скачайте CSV и откройте в Excel

### Способ 3: Python скрипт
```python
import json
import pandas as pd

# Конвертация users.json в Excel
with open('data/users.json', 'r', encoding='utf-8') as f:
    users = json.load(f)

df = pd.DataFrame(users)
df.to_excel('users.xlsx', index=False, engine='openpyxl')
print("✅ Экспортировано в users.xlsx")
```

---

## 🔍 Быстрый скрипт для просмотра

Создан удобный bash-скрипт:

```bash
./scripts/view-data.sh
```

Покажет:
- Количество пользователей
- Количество результатов
- Красиво отформатированный JSON
- Подсказки по работе с данными

---

## 💡 Полезные команды

**Подсчитать пользователей**:
```bash
cat data/users.json | jq '. | length'
```

**Последние 5 пользователей**:
```bash
cat data/users.json | jq '.[-5:]'
```

**Фильтр по возрасту (например, старше 18)**:
```bash
cat data/users.json | jq '.[] | select(.age > 18)'
```

**Экспорт определенных полей**:
```bash
cat data/users.json | jq '.[] | {fullName, phone, age}'
```

---

## 🔒 Безопасность

- ✅ Файлы добавлены в `.gitignore` (не попадут в git)
- ✅ Данные хранятся локально на сервере
- ✅ Доступ к `/admin` не защищен (для production добавьте авторизацию)

---

## ❓ FAQ

**Q: Где физически находятся файлы?**
A: В директории `/home/thinklinux/Projects/ai/focus-mvp/focus-mvp/data/`

**Q: Можно ли удалить все данные?**
A: Да, просто удалите или очистите JSON файлы:
```bash
echo "[]" > data/users.json
echo "[]" > data/test-results.json
```

**Q: Как сделать резервную копию?**
A: Скопируйте директорию `data/`:
```bash
cp -r data/ data_backup_$(date +%Y%m%d)/
```

**Q: Почему test-results.json еще не создан?**
A: Файл создастся автоматически после первого прохождения теста
