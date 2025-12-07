# Настройка Nginx для FOCUS MVP

## Быстрая установка

### Шаг 1: Скопируйте конфигурацию Nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/focus-mvp
```

### Шаг 2: Отредактируйте конфигурацию (если нужен домен)

```bash
sudo nano /etc/nginx/sites-available/focus-mvp
```

Измените строку:
```nginx
server_name _;  # замените на: yourdomain.com www.yourdomain.com
```

### Шаг 3: Активируйте конфигурацию

```bash
# Создайте симлинк
sudo ln -s /etc/nginx/sites-available/focus-mvp /etc/nginx/sites-enabled/

# Удалите дефолтную конфигурацию (опционально)
sudo rm /etc/nginx/sites-enabled/default
```

### Шаг 4: Проверьте конфигурацию

```bash
sudo nginx -t
```

Должно быть:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Шаг 5: Перезагрузите Nginx

```bash
sudo systemctl reload nginx
```

### Шаг 6: Проверьте статус

```bash
sudo systemctl status nginx
```

---

## Готово! 🎉

Теперь ваше приложение доступно:
- **По IP**: http://YOUR_SERVER_IP
- **По домену** (если настроили): http://yourdomain.com

---

## Настройка HTTPS (SSL) с Let's Encrypt

### Установка Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### Получение SSL сертификата

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot автоматически:
- ✅ Получит SSL сертификат
- ✅ Обновит конфигурацию Nginx
- ✅ Настроит автоматическое обновление

### Проверка автообновления

```bash
sudo certbot renew --dry-run
```

---

## Устранение проблем

### Nginx не запускается

```bash
# Проверьте синтаксис
sudo nginx -t

# Посмотрите логи ошибок
sudo tail -50 /var/log/nginx/error.log
```

### Порт 80 занят

```bash
# Проверьте что занимает порт
sudo lsof -i :80

# Остановите конфликтующий сервис
sudo systemctl stop apache2  # если Apache
```

### Приложение не доступно через Nginx

```bash
# 1. Проверьте что PM2 приложение работает
pm2 status

# 2. Проверьте что Next.js слушает на порту 3000
curl http://localhost:3000

# 3. Проверьте логи Nginx
sudo tail -f /var/log/nginx/focus-mvp-error.log

# 4. Проверьте логи приложения
pm2 logs focus-mvp
```

### 502 Bad Gateway

Означает что Nginx не может подключиться к приложению:

```bash
# Убедитесь что приложение запущено
pm2 restart focus-mvp

# Проверьте доступность
curl http://localhost:3000
```

---

## Полезные команды Nginx

```bash
# Перезапуск
sudo systemctl restart nginx

# Перезагрузка конфигурации (без даунтайма)
sudo systemctl reload nginx

# Остановка
sudo systemctl stop nginx

# Запуск
sudo systemctl start nginx

# Статус
sudo systemctl status nginx

# Проверка синтаксиса
sudo nginx -t

# Логи в реальном времени
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Оптимизация производительности

Добавьте в `/etc/nginx/nginx.conf` внутри блока `http {}`:

```nginx
# Worker processes (обычно = количество CPU ядер)
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Кеширование
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;

    # Буферы
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    # Таймауты
    keepalive_timeout 65;
    keepalive_requests 100;

    # ... остальные настройки
}
```

---

## Безопасность

### Базовая защита от DDoS

Добавьте в конфигурацию сайта:

```nginx
# Лимит запросов
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    # ...

    limit_req zone=mylimit burst=20 nodelay;

    # Блокировка доступа к скрытым файлам
    location ~ /\. {
        deny all;
    }
}
```

### Firewall (UFW)

```bash
# Разрешить HTTP и HTTPS
sudo ufw allow 'Nginx Full'

# Или раздельно
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включить firewall
sudo ufw enable

# Проверить статус
sudo ufw status
```

---

## Мониторинг

### Проверка доступности

```bash
# Простая проверка
curl -I http://YOUR_SERVER_IP

# С таймингом
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://YOUR_SERVER_IP
```

### Анализ логов

```bash
# Топ IP адресов
sudo awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -10

# Топ запрашиваемых URL
sudo awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -10

# Коды ответов
sudo awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -nr
```

---

## Обновленный конфиг с кешированием (опционально)

```nginx
proxy_cache_path /var/cache/nginx/focus-mvp levels=1:2 keys_zone=focus_cache:10m max_size=100m inactive=60m;

server {
    # ... (ваша конфигурация)

    location / {
        # ... (существующие proxy настройки)

        # Кеширование статики
        proxy_cache focus_cache;
        proxy_cache_valid 200 60m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

Создайте директорию для кеша:
```bash
sudo mkdir -p /var/cache/nginx/focus-mvp
sudo chown -R www-data:www-data /var/cache/nginx
```

---

**Готово!** Ваш FOCUS MVP правильно настроен с Nginx! 🚀
