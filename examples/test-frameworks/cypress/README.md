# Cypress Тести - DevTools, DOM та Events

Готові приклади Cypress тестів для всіх тем документації.

## Встановлення

### Варіант 1: Використання npx (рекомендовано, не потребує встановлення)

```bash
# Не потрібно встановлювати залежності!
# Просто запускайте тести через npx
npx --yes cypress@latest run --headless
```

### Варіант 2: Локальне встановлення (якщо є місце на диску)

```bash
npm install
```

## Запуск тестів

### Через npx (без встановлення):
```bash
# Всі тести
npx --yes cypress@latest run --headless

# Конкретний тест
npx --yes cypress@latest run --spec "cypress/e2e/quick-test.cy.js" --headless

# Відкрити Cypress Test Runner
npx --yes cypress@latest open
```

### Через npm (якщо встановлено):
```bash
# Відкрити Cypress Test Runner
npm run cypress:open

# Запустити тести в headless режимі
npm run cypress:run

# Або просто
npm test
```

### Якщо виникають проблеми:
Дивіться [TROUBLESHOOTING.md](TROUBLESHOOTING.md) для детальних інструкцій.

## Структура тестів

- `e2e/01-network/` - Тести Network панелі
- `e2e/02-application/` - Тести Application панелі
- `e2e/03-console/` - Тести Console панелі
- `e2e/04-elements/` - Тести Elements панелі
- `e2e/05-dom/` - Тести DOM маніпуляцій
- `e2e/06-events/` - Тести Events

## Використання

Всі тести використовують реальні сайти та API:
- example.com
- jsonplaceholder.typicode.com
- reqres.in/api
- httpbin.org

