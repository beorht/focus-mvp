# Краткая инструкция: тёмный дизайн в стиле F.O.C.U.S

## Цветовая палитра (dark)
- **Фон основной**: `#0c0c0f` → `#191919`
- **Фон контейнеров/карточек**: `#1d1d1d`
- **Границы**: `#2e2e2e` (или `border-gray-800`)
- **Текст**: основной `#ffffff`, вторичный `#d1d5db`, приглушённый `#9ca3af`
- **Акцентный градиент**: `from-blue-600 to-purple-600`
- **Подсветка фона**: радиальный градиент `rgba(147, 51, 234, 0.35)` сверху

## Стек
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + lucide-react + Zustand (persist для темы).

## Ключевые приёмы

### 1. CSS-переменные в `:root`
Все цвета вынесены в переменные — тема переключается через `[data-theme='light']` на `<html>`.

```css
:root {
  --background: #191919;
  --container-bg: #1d1d1d;
  --card-bg: #1d1d1d;
  --border-color: #2e2e2e;
  --text-primary: #ffffff;
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;
  --gradient-main-start: #0c0c0f;
  --gradient-main-stop: rgba(147, 51, 234, 0.35);
}
```

### 2. Фоны через radial-gradient
Класс `.main-background` = тёмная база + фиолетовая подсветка сверху:

```css
.main-background {
  background-color: var(--gradient-main-start);
  background-image:
    radial-gradient(ellipse 90% 70% at 50% -25%, var(--gradient-main-stop), transparent);
}
```

### 3. Карточки
```tsx
<div className="bg-[#1d1d1d] border border-gray-800 rounded-xl shadow-sm p-6">
```

### 4. Иконки-бейджи
Круглый контейнер с полупрозрачным цветным фоном:
```tsx
<div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center">
  <Brain className="w-6 h-6 text-blue-400" />
</div>
```

### 5. CTA-кнопка
```tsx
<button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg">
```

### 6. Анимации входа (Framer Motion)
```tsx
initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
```

### 7. Hover-эффекты
```tsx
whileHover={{ scale: 1.05, y: -5 }}
whileTap={{ scale: 0.98 }}
```

### 8. Плавные переходы темы
Глобальный transition на всех элементах, кроме motion:
```css
*:not([class*="motion-"]) {
  transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease;
}
```

## Структура стартового шаблона
```
app/globals.css          — CSS-переменные + классы .main-background
app/page.tsx             — hero + grid карточек + CTA
store/useThemeStore.ts   — Zustand store с persist middleware
components/ThemeToggle.tsx — переключатель темы
```

## Шаги для нового проекта
1. `npx create-next-app@latest` (TypeScript, Tailwind, App Router)
2. `npm i framer-motion lucide-react zustand lenis`
3. Скопировать CSS-переменные и классы `.main-background` в `globals.css`
4. Создать `useThemeStore` с persist middleware
5. Использовать паттерн hero-секции: badge → logo/title → описание → grid карточек → CTA
