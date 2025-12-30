# Практичні сценарії тестування - DevTools Network

## Сценарій 1: Перевірка API інтеграції при логіні

### Опис завдання
Перевірити, що при логіні користувача виконується правильний POST запит з коректними credentials, і сервер повертає успішну відповідь з токеном.

### Очікуваний результат
- POST запит на `/api/login` з email та password
- Статус код відповіді: 200
- Відповідь містить поле `token`
- Токен зберігається в localStorage

### Покрокова інструкція

#### Крок 1: Відкрити DevTools Network
1. Відкрити веб-додаток
2. Натиснути F12 або правою кнопкою → Inspect
3. Перейти на вкладку Network
4. Увімкнути "Preserve log" (щоб не втратити запити при редиректах)

#### Крок 2: Виконати логін
1. Заповнити форму логіну
2. Натиснути кнопку "Login"
3. Спостерігати за запитами в Network панелі

#### Крок 3: Аналіз запиту
1. Знайти POST запит до `/api/login`
2. Перевірити Headers:
   - `Content-Type: application/json`
   - Наявність `Authorization` (якщо потрібно)
3. Перевірити Payload:
   - `email` містить коректний email
   - `password` присутній (може бути зашифрований)
4. Перевірити Response:
   - Статус код: 200
   - Тіло містить `token` або `accessToken`

### Приклади коду для вирішення

#### DevTools Console
```javascript
// Перехоплення логін запиту до реального API (ReqRes)
const originalFetch = window.fetch;
window.fetch = function(...args) {
    if (args[0].includes('reqres.in/api/login')) {
        console.log('🔐 Login Request:', args[1]?.body);
        return originalFetch.apply(this, args)
            .then(async response => {
                const data = await response.clone().json();
                console.log('✅ Login Response:', data);
                if (data.token) {
                    console.log('🎫 Token received:', data.token.substring(0, 20) + '...');
                }
                return response;
            });
    }
    return originalFetch.apply(this, args);
};

// Виконайте реальний логін запит:
fetch('https://reqres.in/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
    })
}).then(r => r.json()).then(console.log);
```

#### Cypress
```javascript
it('should login and receive token from real API', () => {
    // Перехоплюємо реальний логін запит до ReqRes API
    cy.intercept('POST', 'https://reqres.in/api/login').as('login');
    
    // Виконуємо реальний логін запит
    cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/login',
        body: {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    cy.wait('@login').then((interception) => {
        expect(interception.request.body).to.have.property('email');
        expect(interception.request.body).to.have.property('password');
        expect(interception.response.body).to.have.property('token');
        expect(interception.response.statusCode).to.eq(200);
    });
});
```

### Поради щодо налагодження
- Якщо запит не з'являється, перевірте фільтри (XHR/Fetch)
- Якщо статус код 401, перевірте формат credentials
- Якщо статус код 500, перевірте логи сервера

---

## Сценарій 2: Тестування продуктивності завантаження даних

### Опис завдання
Перевірити, що API запити виконуються за прийнятний час (менше 1 секунди), і проаналізувати timing інформацію.

### Очікуваний результат
- Всі API запити виконуються менше ніж за 1 секунду
- Timing breakdown показує, що більшість часу витрачається на "Waiting" (очікування сервера)
- Немає помилок та failed requests

### Покрокова інструкція

#### Крок 1: Підготовка
1. Відкрити DevTools Network
2. Очистити лог (кнопка 🚫)
3. Увімкнути "Disable cache"

#### Крок 2: Виконати дію
1. Виконати дію, що викликає API запити (наприклад, завантажити список користувачів)
2. Спостерігати за запитами в реальному часі

#### Крок 3: Аналіз продуктивності
1. Для кожного запиту:
   - Натиснути на запит
   - Перейти на вкладку "Timing"
   - Проаналізувати:
     - DNS Lookup
     - Initial Connection
     - SSL (якщо HTTPS)
     - Time to First Byte (TTFB)
     - Content Download
2. Перевірити загальний час (Duration)
3. Перевірити розмір відповіді (Size)

### Приклади коду для вирішення

#### DevTools Console
```javascript
// Збір статистики продуктивності
const perfStats = [];
const originalFetch = window.fetch;

window.fetch = function(...args) {
    const startTime = performance.now();
    const url = args[0];
    
    return originalFetch.apply(this, args)
        .then(response => {
            const duration = performance.now() - startTime;
            perfStats.push({
                url,
                duration: duration.toFixed(2) + 'ms',
                status: response.status,
                slow: duration > 1000
            });
            
            if (duration > 1000) {
                console.warn(`⚠️ Slow request: ${url} - ${duration.toFixed(2)}ms`);
            }
            
            return response;
        });
};

// Вивести статистику
window.getPerformanceStats = () => {
    console.table(perfStats);
    const slowRequests = perfStats.filter(r => r.slow);
    if (slowRequests.length > 0) {
        console.warn('Slow requests:', slowRequests);
    }
};

// Тестуємо з реальним API:
fetch('https://jsonplaceholder.typicode.com/users')
    .then(r => r.json())
    .then(() => {
        getPerformanceStats();
    });
```

#### Cypress
```javascript
it('should load data within acceptable time from real API', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users').as('getUsers');
    
    const startTime = Date.now();
    
    // Виконуємо реальний запит
    cy.request('GET', 'https://jsonplaceholder.typicode.com/users');
    
    cy.wait('@getUsers').then(() => {
        const duration = Date.now() - startTime;
        // З урахуванням мережі, перевіряємо що менше 5 секунд
        expect(duration).to.be.lessThan(5000);
    });
});

it('should analyze request timing', () => {
    cy.intercept('GET', '/api/data').as('getData');
    
    cy.get('[data-testid="load-data"]').click();
    
    cy.wait('@getData').then((interception) => {
        // Перевіряємо статус
        expect(interception.response.statusCode).to.eq(200);
        
        // Перевіряємо розмір відповіді (не повинен бути занадто великим)
        const responseSize = JSON.stringify(interception.response.body).length;
        expect(responseSize).to.be.lessThan(100000); // 100KB
    });
});
```

### Поради щодо налагодження
- Якщо TTFB великий, проблема на стороні сервера
- Якщо Content Download великий, розмір даних занадто великий
- Використовуйте Network Throttling для тестування на повільних з'єднаннях

---

## Сценарій 3: Тестування обробки помилок

### Опис завдання
Перевірити, що додаток правильно обробляє помилки сервера (404, 500) та відображає відповідні повідомлення користувачу.

### Очікуваний результат
- При помилці 404 показується повідомлення "Resource not found"
- При помилці 500 показується повідомлення "Server error"
- Додаток не падає, а продовжує працювати

### Покрокова інструкція

#### Крок 1: Підготовка
1. Відкрити DevTools Network
2. Увімкнути "Preserve log"

#### Крок 2: Симуляція помилок
1. Використати Request Blocking для блокування певних запитів
2. Або використати мокування для повернення помилок

#### Крок 3: Перевірка обробки
1. Виконати дію, що викликає запит
2. Перевірити, що запит повертає помилку
3. Перевірити UI на наявність повідомлення про помилку

### Приклади коду для вирішення

#### DevTools Console
```javascript
// Симуляція помилки 500 для реального API
const originalFetch = window.fetch;
window.fetch = function(...args) {
    if (args[0].includes('jsonplaceholder.typicode.com/users')) {
        console.log('🎭 Mocking 500 error for:', args[0]);
        return Promise.resolve(new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        ));
    }
    return originalFetch.apply(this, args);
};

// Тестуємо (буде повернено помилку 500):
fetch('https://jsonplaceholder.typicode.com/users')
    .then(r => r.json())
    .then(console.log)
    .catch(console.error);
```

#### Cypress
```javascript
it('should handle 404 error gracefully from real API', () => {
    // Мокуємо 404 для реального API
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users/999', {
        statusCode: 404,
        body: { error: 'User not found' }
    }).as('getUser404');
    
    // Виконуємо запит (буде повернено 404)
    cy.request({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/users/999',
        failOnStatusCode: false
    });
    
    cy.wait('@getUser404').then((interception) => {
        expect(interception.response.statusCode).to.eq(404);
        expect(interception.response.body).to.have.property('error');
    });
});

it('should handle 500 error gracefully', () => {
    cy.intercept('GET', '/api/data', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
    }).as('serverError');
    
    cy.get('[data-testid="load-data"]').click();
    cy.wait('@serverError');
    
    cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Server error');
});
```

### Поради щодо налагодження
- Перевірте, чи правильно парситься body помилки
- Перевірте, чи показується user-friendly повідомлення
- Перевірте, чи не виникають додаткові помилки в консолі

---

## Сценарій 4: Перевірка безпеки (Security Headers)

### Опис завдання
Перевірити, що API запити містять правильні security заголовки та не витікають чутливі дані.

### Очікуваний результат
- Запити містять необхідні security заголовки
- Чутливі дані не передаються в URL (query parameters)
- Використовується HTTPS для всіх запитів

### Покрокова інструкція

#### Крок 1: Аналіз запитів
1. Відкрити DevTools Network
2. Виконати дію, що викликає запити
3. Для кожного запиту перевірити Headers

#### Крок 2: Перевірка безпеки
1. Перевірити наявність:
   - `Authorization` header (не в URL!)
   - `X-CSRF-Token` (якщо використовується)
   - `Content-Type: application/json`
2. Перевірити, що URL не містить чутливих даних
3. Перевірити, що використовується HTTPS

### Приклади коду для вирішення

#### DevTools Console
```javascript
// Перевірка безпеки запитів
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const url = args[0];
    const options = args[1] || {};
    
    // Перевірка HTTPS
    if (!url.startsWith('https://') && !url.startsWith('http://localhost')) {
        console.warn('⚠️ Non-HTTPS request:', url);
    }
    
    // Перевірка чутливих даних в URL
    if (url.includes('password') || url.includes('token')) {
        console.error('❌ Sensitive data in URL:', url);
    }
    
    // Перевірка заголовків
    if (options.headers) {
        if (!options.headers['Authorization'] && url.includes('/api/')) {
            console.warn('⚠️ Missing Authorization header for:', url);
        }
    }
    
    return originalFetch.apply(this, args);
};

// Тестуємо з реальним API:
fetch('https://jsonplaceholder.typicode.com/users/1')
    .then(r => r.json())
    .then(console.log);
```

#### Cypress
```javascript
it('should use secure headers with real API', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users/1').as('getData');
    
    // Виконуємо запит до реального API
    cy.request({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/users/1',
        headers: {
            'Authorization': 'Bearer test-token'
        }
    });
    
    cy.wait('@getData').then((interception) => {
        // Перевіряємо, що використовується HTTPS
        expect(interception.request.url).to.match(/^https:\/\//);
        
        // Перевіряємо наявність security заголовків
        expect(interception.request.headers).to.have.property('authorization');
        
        // Перевіряємо, що чутливі дані не в URL
        expect(interception.request.url).to.not.include('password');
        expect(interception.request.url).to.not.include('token');
    });
});
```

### Поради щодо налагодження
- Використовуйте "Copy as cURL" для детального аналізу
- Перевіряйте Response Headers на наявність security headers (CORS, CSP)
- Звертайте увагу на попередження браузера про mixed content

