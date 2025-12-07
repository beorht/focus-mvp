#!/bin/bash

# Скрипт быстрой настройки Nginx для FOCUS MVP

set -e

echo "🔧 Настройка Nginx для FOCUS MVP..."

# Проверка что скрипт запущен с sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Пожалуйста, запустите с sudo:"
    echo "   sudo ./setup-nginx.sh"
    exit 1
fi

# Проверка что Nginx установлен
if ! command -v nginx &> /dev/null; then
    echo "⚠️  Nginx не установлен. Установка..."
    apt update
    apt install nginx -y
fi

# Копирование конфигурации
echo "📋 Копирование конфигурации..."
cp nginx.conf /etc/nginx/sites-available/focus-mvp

# Создание симлинка
echo "🔗 Активация конфигурации..."
ln -sf /etc/nginx/sites-available/focus-mvp /etc/nginx/sites-enabled/

# Удаление дефолтной конфигурации (если есть)
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️  Удаление дефолтной конфигурации..."
    rm /etc/nginx/sites-enabled/default
fi

# Проверка синтаксиса
echo "✅ Проверка конфигурации Nginx..."
nginx -t

# Перезагрузка Nginx
echo "🔄 Перезагрузка Nginx..."
systemctl reload nginx

# Проверка статуса
echo ""
echo "✅ Nginx успешно настроен!"
echo ""
systemctl status nginx --no-pager -l

echo ""
echo "📊 Ваше приложение доступно по адресу:"
echo "   http://$(hostname -I | awk '{print $1}')"
echo ""
echo "📖 Полная документация: NGINX_SETUP.md"
echo ""
echo "🔐 Для настройки HTTPS выполните:"
echo "   sudo certbot --nginx -d yourdomain.com"
