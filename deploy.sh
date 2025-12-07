#!/bin/bash

# FOCUS MVP Deployment Script
# Использование: ./deploy.sh

set -e  # Остановить при ошибке

echo "🚀 Starting FOCUS MVP Deployment..."

# 1. Установка зависимостей
echo "📦 Installing dependencies..."
npm install --production=false

# 2. Сборка проекта
echo "🔨 Building Next.js application..."
npm run build

# 3. Проверка PM2
if ! command -v pm2 &> /dev/null
then
    echo "⚠️  PM2 не установлен. Установка PM2..."
    npm install -g pm2
fi

# 4. Создание директории для логов
echo "📁 Creating logs directory..."
mkdir -p logs

# 5. Остановка старого процесса (если существует)
echo "⏹️  Stopping old process..."
pm2 stop focus-mvp || true
pm2 delete focus-mvp || true

# 6. Запуск нового процесса
echo "▶️  Starting new process..."
pm2 start ecosystem.config.js

# 7. Сохранение PM2 конфигурации
echo "💾 Saving PM2 configuration..."
pm2 save

# 8. Настройка автозапуска PM2 при перезагрузке сервера
echo "🔄 Setting up PM2 startup..."
pm2 startup || echo "⚠️  Run the command shown above to enable PM2 startup"

# 9. Показать статус
echo ""
echo "✅ Deployment completed successfully!"
echo ""
pm2 status
echo ""
echo "📊 Useful PM2 commands:"
echo "  pm2 status          - Показать статус приложений"
echo "  pm2 logs focus-mvp  - Показать логи"
echo "  pm2 restart focus-mvp - Перезапустить приложение"
echo "  pm2 stop focus-mvp    - Остановить приложение"
echo "  pm2 monit           - Мониторинг в реальном времени"
