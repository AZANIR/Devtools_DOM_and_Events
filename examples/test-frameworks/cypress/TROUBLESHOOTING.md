# Вирішення проблем з Cypress

## Проблема: Cypress не запускається

### Симптоми:
- `Cypress failed to start`
- `Command was killed with SIGKILL`
- `No version of Cypress is installed`
- `cypress install: command not found`

## Рішення

### Варіант 1: Використання npx (рекомендовано)

```bash
cd examples/test-frameworks/cypress

# Очистити кеш Cypress
rm -rf ~/Library/Caches/Cypress

# Запустити тести через npx (не потребує локального встановлення)
npx --yes cypress@latest run --headless
```

### Варіант 2: Локальне встановлення (якщо є місце на диску)

```bash
cd examples/test-frameworks/cypress

# Встановити залежності
npm install

# Запустити тести
npm run cypress:run
```

### Варіант 3: Використання Docker (якщо доступно)

```bash
# Запуск через Docker (якщо встановлено)
docker run -it -v $PWD:/e2e -w /e2e cypress/included:latest
```

## Перевірка

### Перевірити версію Node.js:
```bash
node --version  # Має бути 18+
```

### Перевірити наявність місця на диску:
```bash
df -h
```

### Перевірити синтаксис тестів:
```bash
cd examples/test-frameworks/cypress
./check-examples.sh
```

## Альтернатива: Використання без встановлення

Якщо немає місця на диску або проблеми з встановленням, можна:

1. **Використовувати Console приклади** - вони працюють без встановлення
2. **Використовувати npx** - автоматично завантажує Cypress при запуску
3. **Використовувати онлайн Cypress** - через GitHub Actions або інші CI/CD

## Примітки

- Cypress потребує ~500MB місця на диску
- Може потребувати додаткових системних залежностей на macOS
- npx автоматично завантажує потрібну версію при запуску

