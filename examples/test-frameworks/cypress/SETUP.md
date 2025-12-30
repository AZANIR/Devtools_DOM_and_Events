# Встановлення та запуск Cypress тестів

## Швидкий старт

### 1. Запуск тестів (БЕЗ встановлення - рекомендовано)

```bash
cd examples/test-frameworks/cypress

# Всі тести
npx --yes cypress@latest run --headless

# Конкретний тест
npx --yes cypress@latest run --spec "cypress/e2e/01-network/network-requests.cy.js" --headless

# Відкрити Cypress Test Runner (інтерактивний режим)
npx --yes cypress@latest open
```

### 2. Встановлення залежностей (опціонально)

Якщо хочете встановити локально:

```bash
cd examples/test-frameworks/cypress
npm install
```

Після встановлення:
```bash
npm run cypress:open  # Інтерактивний режим
npm run cypress:run   # Headless режим
```

### 3. Якщо виникають проблеми

Дивіться [TROUBLESHOOTING.md](TROUBLESHOOTING.md) для детальних інструкцій.

## Структура тестів

```
e2e/
├── 01-network/
│   └── network-requests.cy.js      # Тести Network панелі
├── 02-application/
│   └── storage.cy.js                 # Тести Application панелі
├── 03-console/
│   └── console-testing.cy.js         # Тести Console панелі
├── 04-elements/
│   └── elements.cy.js                 # Тести Elements панелі
├── 05-dom/
│   └── dom-manipulation.cy.js         # Тести DOM маніпуляцій
├── 06-events/
│   └── events.cy.js                  # Тести Events
└── quick-test.cy.js                  # Швидкий тест для перевірки
```

## Реальні API та сайти

Всі тести використовують реальні сервіси:

- **example.com** - https://example.com
- **JSONPlaceholder** - https://jsonplaceholder.typicode.com/
- **ReqRes** - https://reqres.in/api/
- **httpbin.org** - https://httpbin.org/

## Перевірка роботи

Після встановлення запустіть швидкий тест:

```bash
npx cypress run --spec "e2e/quick-test.cy.js"
```

Цей тест перевірить:
- ✅ Підключення до реальних API
- ✅ Знаходження елементів на реальних сайтах
- ✅ Виконання реальних запитів

## Примітки

- Всі тести готові до виконання
- Не потрібно налаштування додаткових серверів
- Тести використовують публічні API

