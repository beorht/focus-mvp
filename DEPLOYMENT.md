# FOCUS MVP - Deployment Guide

Руководство по развертыванию проекта FOCUS MVP на production сервере с использованием PM2.

## Требования

- Node.js >= 18.x
- npm или yarn
- PM2 (устанавливается автоматически скриптом)
- Git (для клонирования репозитория)

## Быстрый старт

### 1. Клонирование проекта на сервер

```bash
git clone <repository-url> focus-mvp
cd focus-mvp
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` с вашими API ключами:

```bash
cp .env.example .env.local  # если есть example файл
# или создайте вручную:
nano .env.local
```

Содержимое `.env.local`:

```bash
# Multiple Gemini API keys for rotation (separate with commas)
GEMINI_API_KEYS=key1,key2,key3,key4,key5,key6,key7

# Multiple API keys for Chat Assistant (with rotation support)
GEMINI_API_KEYS_FOR_CHAT_ASSITENT=chatkey1,chatkey2,chatkey3,chatkey4,chatkey5,chatkey6,chatkey7
```

### 3. Автоматический деплой

Запустите скрипт автоматического деплоя:

```bash
./deploy.sh
```

Этот скрипт автоматически:
- ✅ Установит зависимости
- ✅ Соберет production build
- ✅ Установит PM2 (если не установлен)
- ✅ Создаст директорию для логов
- ✅ Остановит старую версию (если есть)
- ✅ Запустит новую версию
- ✅ Сохранит конфигурацию PM2

### 4. Настройка автозапуска при перезагрузке

После первого деплоя выполните команду, которую покажет PM2:

```bash
# PM2 покажет команду типа:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username
```

Выполните эту команду для автозапуска PM2 при перезагрузке сервера.

## Ручной деплой (без скрипта)

### Шаг 1: Установка зависимостей

```bash
npm install
```

### Шаг 2: Сборка проекта

```bash
npm run build
```

### Шаг 3: Установка PM2 (если не установлен)

```bash
npm install -g pm2
```

### Шаг 4: Запуск через PM2

```bash
npm run pm2:start
# или напрямую:
pm2 start ecosystem.config.js
```

### Шаг 5: Сохранение конфигурации

```bash
pm2 save
pm2 startup
```

## Управление приложением

### Через npm скрипты:

```bash
# Запуск
npm run pm2:start

# Остановка
npm run pm2:stop

# Перезапуск
npm run pm2:restart

# Логи
npm run pm2:logs

# Мониторинг
npm run pm2:monit

# Статус
npm run pm2:status

# Удаление из PM2
npm run pm2:delete
```

### Напрямую через PM2:

```bash
# Показать статус всех приложений
pm2 status

# Показать логи
pm2 logs focus-mvp

# Показать логи в реальном времени
pm2 logs focus-mvp --lines 100

# Перезапуск
pm2 restart focus-mvp

# Остановка
pm2 stop focus-mvp

# Удаление
pm2 delete focus-mvp

# Мониторинг (интерактивный)
pm2 monit

# Очистить логи
pm2 flush focus-mvp
```

## Конфигурация PM2 (ecosystem.config.js)

По умолчанию приложение запускается с такими параметрами:

- **Имя приложения**: `focus-mvp`
- **Порт**: `3000`
- **Instances**: `1` (можно увеличить для кластерного режима)
- **Auto-restart**: `true` (автоматический перезапуск при падении)
- **Max memory**: `1GB` (перезапуск при превышении)
- **Логи**: `./logs/`

### Изменение порта

Отредактируйте `ecosystem.config.js`:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 8080  // измените порт здесь
}
```

### Кластерный режим (несколько инстансов)

```javascript
instances: 4,  // или 'max' для автоопределения по CPU
exec_mode: 'cluster'
```

## Nginx (опционально)

Если используете Nginx как reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Обновление приложения

### Метод 1: Автоматический (рекомендуется)

```bash
git pull origin main
./deploy.sh
```

### Метод 2: Ручной

```bash
git pull origin main
npm install
npm run build
npm run pm2:restart
```

## Логи

Логи сохраняются в директории `./logs/`:

- `pm2-error.log` - логи ошибок
- `pm2-out.log` - стандартный вывод
- `pm2-combined.log` - объединенные логи

Просмотр логов:

```bash
# В реальном времени
npm run pm2:logs

# Последние 100 строк
pm2 logs focus-mvp --lines 100

# Только ошибки
pm2 logs focus-mvp --err

# Файлы логов напрямую
tail -f logs/pm2-error.log
```

## Мониторинг

### PM2 Monit (встроенный)

```bash
npm run pm2:monit
```

### Системная информация

```bash
# CPU и память
pm2 monit

# Детальная информация
pm2 show focus-mvp

# Метрики
pm2 describe focus-mvp
```

## Устранение проблем

### Приложение не запускается

1. Проверьте логи:
   ```bash
   npm run pm2:logs
   ```

2. Проверьте порт (не занят ли):
   ```bash
   lsof -i :3000
   ```

3. Проверьте переменные окружения:
   ```bash
   cat .env.local
   ```

### Приложение падает

1. Увеличьте лимит памяти в `ecosystem.config.js`:
   ```javascript
   max_memory_restart: '2G'
   ```

2. Проверьте логи ошибок:
   ```bash
   tail -100 logs/pm2-error.log
   ```

### PM2 не работает после перезагрузки

```bash
pm2 startup
pm2 save
```

## Бэкап и восстановление

### Сохранение конфигурации PM2

```bash
pm2 save
```

### Восстановление

```bash
pm2 resurrect
```

## Полезные команды

```bash
# Полная остановка PM2
pm2 kill

# Перезагрузка daemon PM2
pm2 update

# Список всех процессов
pm2 list

# Информация о процессе
pm2 info focus-mvp

# Очистить все логи
pm2 flush

# Сброс метрик
pm2 reset focus-mvp
```

## Безопасность

1. ✅ Никогда не коммитьте `.env.local` в Git
2. ✅ Используйте HTTPS в production (Nginx + Let's Encrypt)
3. ✅ Ограничьте доступ к логам
4. ✅ Регулярно обновляйте зависимости: `npm audit fix`

## Производительность

### Рекомендации для production:

1. Используйте кластерный режим для multi-core серверов
2. Настройте CDN для статических файлов
3. Включите сжатие в Nginx
4. Мониторьте использование памяти через PM2

---

**Вопросы или проблемы?** Проверьте логи: `npm run pm2:logs`
