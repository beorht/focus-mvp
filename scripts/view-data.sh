#!/bin/bash

# Скрипт для удобного просмотра сохраненных данных

echo "=========================================="
echo "  F.O.C.U.S - Просмотр данных"
echo "=========================================="
echo ""

# Проверка существования файлов
DATA_DIR="$(dirname "$0")/../data"

echo "📁 Директория с данными: $DATA_DIR"
echo ""

# Пользователи
echo "👥 ЗАРЕГИСТРИРОВАННЫЕ ПОЛЬЗОВАТЕЛИ:"
echo "=========================================="
if [ -f "$DATA_DIR/users.json" ]; then
    USERS_COUNT=$(cat "$DATA_DIR/users.json" | jq '. | length' 2>/dev/null || echo "0")
    echo "Всего пользователей: $USERS_COUNT"
    echo ""

    if command -v jq &> /dev/null; then
        cat "$DATA_DIR/users.json" | jq '.'
    else
        cat "$DATA_DIR/users.json"
    fi
else
    echo "❌ Файл users.json не найден"
fi

echo ""
echo ""

# Результаты тестов
echo "📊 РЕЗУЛЬТАТЫ ТЕСТОВ:"
echo "=========================================="
if [ -f "$DATA_DIR/test-results.json" ]; then
    RESULTS_COUNT=$(cat "$DATA_DIR/test-results.json" | jq '. | length' 2>/dev/null || echo "0")
    echo "Всего результатов: $RESULTS_COUNT"
    echo ""

    if command -v jq &> /dev/null; then
        cat "$DATA_DIR/test-results.json" | jq '.'
    else
        cat "$DATA_DIR/test-results.json"
    fi
else
    echo "❌ Файл test-results.json не найден (будет создан после первого прохождения теста)"
fi

echo ""
echo ""
echo "=========================================="
echo "💡 Подсказки:"
echo "  - Файлы находятся в: $DATA_DIR"
echo "  - Открыть в редакторе: nano $DATA_DIR/users.json"
echo "  - Экспорт через API: http://localhost:3000/api/register"
echo "=========================================="
