# **ТЕХНИЧЕСКОЕ ЗАДАНИЕ (ТЗ) НА РАЗРАБОТКУ MVP**
**Проект:** F.O.C.U.S — AI-Навигатор Профессий
**Тип:** Веб-приложение (Single Page Application)
**Срок реализации:** 24–48 часов (Hackathon Mode)

---

## **1. Архитектура Интерфейса (Split Screen)**

Весь сайт разделен на две части. Это ключевое требование для демонстрации технологичности.

*   **Левая часть (Main App, 65-70% ширины):**
    *   Основной интерфейс взаимодействия с пользователем.
    *   Чистый, современный дизайн, интуитивно понятный (Apple/Notion style).
*   **Правая часть (AI Terminal / Log Console, 30-35% ширины):**
    *   Фиксированная панель, стилизованная под терминал (черный фон, зеленый/белый моноширинный шрифт).
    *   **Функция:** В реальном времени показывает JSON-запросы, ответы от GeminiAi, статус обработки ("Analyzing psychotype...", "Generating roadmap...").
    *   **Цель:** Доказать жюри, что под капотом работает реальный ИИ, а не заготовленные картинки.

---

## **2. Стек Технологий**

*   **Frontend & Backend:** Next.js 14+ (App Router) — позволяет писать API routes в одном проекте.
*   **Стилизация:** Tailwind CSS + Lucide React (иконки).
*   **State Management:** React Context API или Zustand (для передачи логов из любой части приложения в правую панель).
*   **AI Provider:** Gemini API (модель `gemini-2.5-flash` ) или Vercel AI SDK.
*   **Деплой:** Vercel (автоматически создает HTTPS домен).

---

## **3. Функциональные этапы (User Flow)**

Мы реализуем **"Happy Path"** — один идеальный сценарий прохождения.

### **Этап 1: Лендинг и Вход (/demo)**
*   **Левая часть:**
    *   Заголовок, слоган.
    *   Встроенное видео (Placeholder для YouTube).
    *   Кнопка "Start Journey" (Начать).
    *   Кнопка "Test API" (отправляет тестовый запрос, чтобы зритель увидел реакцию в правой панели).
*   **Правая часть (Логи):**
    *   `[SYSTEM] System initialized...`
    *   `[SYSTEM] Waiting for user input...`

### **Этап 2: Экспресс-Тестирование**
Вместо 60 вопросов делаем 5-7 ключевых (чтобы демо было динамичным).
*   **Вопросы:**
    1.  Твои главные интересы? (Теги: Код, Дизайн, Люди, Цифры...)
    2.  Твой текущий уровень? (Новичок, Студент, Есть опыт).
    3.  Что важнее: Зарплата или Творчество?
    4.  Любишь работать один или в команде?
*   **Логи (Правая панель):**
    *   При выборе ответа: `[USER_ACTION] Selected interest: "Coding"`

### **Этап 3: AI-Анализ (Loader)**
*   **Левая часть:** Красивая анимация пульсирующего мозга или нейросети.
*   **Правая часть (Ключевой момент шоу):**
    *   Бегущая строка логов:
    *   `POST /api/analyze-profile`
    *   `Sending payload: { interests: ["coding"], type: "introvert" }`
    *   `Connecting to Gemini API...`
    *   `Processing embeddings...`
    *   `Received Response: { profession: "Backend Developer", match: 98% }`

### **Этап 4: Результат и Roadmap**
*   **Левая часть:**
    *   **Карточка профессии:** Название, Зарплата в Узбекистане (генерируется ИИ), Краткое описание.
    *   **Roadmap (Визуализация):** Вертикальная линия с точками (Junior -> Middle -> Senior). При клике на точку раскрывается список навыков.
    *   **Материалы:** 3 ссылки на курсы (YouTube/Udemy), подобранные ИИ.
*   **Правая часть:**
    *   `[DATA] Rendering roadmap components...`

### **Этап 5: Чат-ассистент (Bonus #1)**
*   Кнопка в углу левой части (FAB).
*   Открывает мини-чат.
*   При отправке сообщения, в правой панели видим: `POST /api/chat`, `Question: "Как стать сеньором?"`, `Answer generated`.

---

## **4. Структура Базы Данных (JSON / Mock)**
Для MVP и скорости **не подключаем PostgreSQL**. Храним состояние в памяти браузера или передаем всё в одном большом JSON-объекте между шагами.
*   *Обоснование:* Нам нужно показать функционал за 2 дня. Настройка БД съест время.

---

## **5. План Разработки (Пошаговый)**

### **Часть 1: Каркас и Логгер (Часы 1-4)**
1.  `npx create-next-app@latest focus-ai`
2.  Настроить layout: `div.flex` -> `div.w-2/3` (App) + `div.w-1/3` (Logs).
3.  Создать **Context** `LogContext`.
    *   Метод `addLog(type, message)`.
    *   Компонент `LogConsole` который делает `.map()` по массиву логов и выводит их красиво.

### **Часть 2: Интеграция с Gemini (Часы 5-10)**
1.  Создать API Route: `app/api/generate/route.ts`.
2.  Написать **System Prompt**:
    > "Ты карьерный консультант для рынка Узбекистана. На вход получаешь ответы пользователя. Верни JSON строго определенной структуры: { profession: string, salary_uz_sum: string, description: string, roadmap: [{ stage: string, duration: string, topics: [] }] }. Не пиши лишнего текста."
3.  Связать фронтенд форму с этим API.
4.  **Важно:** Внутри API роута добавить вызов `console.log`, но так как логи на сервере не видны клиенту, API должен возвращать в ответе не только данные, но и "debug_info", который мы отправим в правое окно.

### **Часть 3: UI Результатов (Часы 11-16)**
1.  Верстка Roadmap. Используйте готовые компоненты (например, `shadcn/ui` или просто Tailwind Timeline), чтобы выглядело дорого.
2.  Верстка карточки профессии.

### **Часть 4: Чат-бот и Демо страница (Часы 17-20)**
1.  Реализовать простой UI чата.
2.  Собрать страницу `/demo` по требованиям PDF (Видео + Описание).
3.  Добавить кнопку "Copy JSON" в правой панели (для закрытия требования API Access).

---

## **6. Пример кода для "Log Console" (Правая панель)**

Чтобы вы не тратили время на архитектуру логгера, вот готовая идея реализации на React/Zustand:

```typescript
// store/useLogStore.ts
import { create } from 'zustand'

type LogEntry = {
  id: string;
  timestamp: string;
  type: 'INFO' | 'API_REQ' | 'API_RES' | 'ERROR';
  message: string;
}

export const useLogStore = create((set) => ({
  logs: [],
  addLog: (type, message) => set((state) => ({
    logs: [...state.logs, {
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    }]
  })),
}))

// components/LogConsole.tsx
'use client'
import { useLogStore } from '@/store/useLogStore'
import { useEffect, useRef } from 'react'

export default function LogConsole() {
  const logs = useLogStore((state: any) => state.logs)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="fixed right-0 top-0 h-screen w-1/3 bg-black text-green-400 p-4 font-mono text-sm overflow-y-auto border-l border-gray-800 z-50 hidden md:block">
      <div className="mb-4 border-b border-gray-700 pb-2">
        <h3 className="font-bold text-white">F.O.C.U.S AI CORE // TERMINAL</h3>
        <p className="text-xs text-gray-500">Live connection established...</p>
      </div>
      <div className="space-y-2">
        {logs.map((log: any) => (
          <div key={log.id} className="break-words">
            <span className="text-gray-500">[{log.timestamp}]</span>{' '}
            <span className={`font-bold ${
              log.type === 'API_REQ' ? 'text-yellow-400' :
              log.type === 'API_RES' ? 'text-cyan-400' : 'text-green-400'
            }`}>
              [{log.type}]
            </span>{' '}
            {log.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
```

## **7. Итоговая комплектация для сдачи**

1.  **Ссылка:** `focus-ai-mvp.vercel.app/demo`
2.  **На странице:**
    *   Видео (запишите захват экрана, как вы проходите тест, и как сбоку бегут логи).
    *   Описание (Prototype/MVP).
    *   Кнопка "Launch Demo" (ведет на `/` или `/app`).
3.  **В коде:**
    *   Роут `/api/chat` (для Bonus 1).
    *   Роут `/api/generate` (для основной функции).

