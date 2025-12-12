# Интернационализация (i18n) F.O.C.U.S

Этот проект поддерживает три языка:
- **Русский** (кириллица) - `ru`
- **Узбекский** (кириллица) - `uz-cyrl`
- **O'zbek** (latin) - `uz-latn`

## Структура файлов

- `ru.json` - Переводы на русский язык
- `uz-cyrl.json` - Переводы на узбекский язык (кириллица)
- `uz-latn.json` - Переводы на узбекский язык (латиница)

## Использование

### В компонентах

```tsx
import { useTranslation } from '@/hooks/useTranslation'

export default function MyComponent() {
  const { t, tf } = useTranslation()

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{tf('results.salaryRange', { min: 5000000, max: 15000000 })}</p>
    </div>
  )
}
```

### Функции перевода

- `t(key)` - Простой перевод по ключу
- `tf(key, params)` - Перевод с параметрами (например, для подстановки чисел)

### Добавление новых переводов

1. Откройте нужный файл перевода (ru.json, uz-cyrl.json, uz-latn.json)
2. Добавьте новый ключ в соответствующую секцию
3. Убедитесь, что ключ добавлен во всех трех файлах

Пример:
```json
{
  "home": {
    "newKey": "Новый текст"
  }
}
```

### Переключение языка

Пользователь может переключить язык через выпадающее меню в правом верхнем углу. Выбранный язык сохраняется в localStorage и применяется при следующем посещении.

## Структура секций

- `common` - Общие элементы (кнопки, сообщения)
- `home` - Главная страница
- `test` - Страница тестирования
- `analyze` - Страница анализа
- `results` - Страница результатов
- `chat` - AI-ассистент
- `log` - Консоль логов

## Поддержка новых языков

Чтобы добавить новый язык:

1. Создайте новый файл перевода, например `en.json`
2. Добавьте язык в `store/useLanguageStore.ts`:
   ```ts
   export type Language = 'ru' | 'uz-cyrl' | 'uz-latn' | 'en'
   ```
3. Импортируйте переводы в `hooks/useTranslation.ts`:
   ```ts
   import en from '@/locales/en.json'

   const translations = {
     ru,
     'uz-cyrl': uzCyrl,
     'uz-latn': uzLatn,
     en
   }
   ```
4. Добавьте язык в `components/LanguageSwitcher.tsx`:
   ```ts
   const languages = [
     ...
     { code: 'en', name: 'English', nativeName: 'English' },
   ]
   ```
