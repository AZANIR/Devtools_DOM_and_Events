# Практичні сценарії тестування - DevTools Application

## Сценарій 1: Перевірка збереження токену авторизації

### Опис завдання
Перевірити, що після успішного логіну токен авторизації правильно зберігається в LocalStorage, і що він використовується для наступних запитів.

### Очікуваний результат
- Токен зберігається в LocalStorage під ключем `authToken` або `accessToken`
- Токен має правильний формат (зазвичай JWT)
- Токен використовується в заголовках наступних API запитів
- Токен зберігається після перезавантаження сторінки

### Покрокова інструкція

#### Крок 1: Відкрити DevTools Application
1. Відкрити веб-додаток
2. Натиснути F12 або правою кнопкою → Inspect
3. Перейти на вкладку Application
4. Розгорнути "Local Storage" в лівій панелі
5. Вибрати поточний домен

#### Крок 2: Виконати логін
1. Заповнити форму логіну
2. Натиснути кнопку "Login"
3. Спостерігати за змінами в LocalStorage

#### Крок 3: Перевірка токену
1. Знайти ключ `authToken` або `accessToken` в LocalStorage
2. Перевірити значення токену:
   - Не повинен бути порожнім
   - Повинен мати достатню довжину (JWT токени зазвичай > 100 символів)
   - Може містити крапки (якщо це JWT)
3. Перевірити, що токен зберігається після перезавантаження сторінки

### Приклади коду для вирішення

#### DevTools Console
```javascript
// Перевірка наявності токену (працює на будь-якому сайті)
const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
if (token) {
    console.log('✅ Token found:', token.substring(0, 20) + '...');
    console.log('Token length:', token.length);
    
    // Перевірка формату JWT
    if (token.includes('.')) {
        const parts = token.split('.');
        console.log('JWT parts:', parts.length);
    }
} else {
    console.log('ℹ️ Token not found in LocalStorage (це нормально для нових сайтів)');
    console.log('Спробуйте зберегти токен:');
    console.log('localStorage.setItem("authToken", "test-token-123")');
}

// Перевірка використання токену в запитах до реального API
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const options = args[1] || {};
    if (options.headers && options.headers['Authorization']) {
        console.log('✅ Token used in request:', options.headers['Authorization'].substring(0, 20) + '...');
    }
    return originalFetch.apply(this, args);
};

// Тестуємо з реальним API (ReqRes):
fetch('https://reqres.in/api/users/1', {
    headers: {
        'Authorization': 'Bearer test-token-123'
    }
}).then(r => r.json()).then(console.log);
```

#### Cypress
```javascript
it('should store and verify auth token from real API', () => {
    // Виконуємо логін до реального API (ReqRes)
    cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/login',
        body: {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka'
        }
    }).then((response) => {
        // Отримуємо токен з відповіді
        const token = response.body.token;
        
        // Зберігаємо токен в LocalStorage (симуляція реального додатку)
        cy.window().then((win) => {
            win.localStorage.setItem('authToken', token);
        });
        
        // Перевіряємо, що токен збережено
        cy.window().then((win) => {
            const storedToken = win.localStorage.getItem('authToken');
            
            expect(storedToken).to.exist;
            expect(storedToken.length).to.be.greaterThan(10);
        });
    });
});

it('should use token in subsequent requests', () => {
    // Спочатку логінимося
    cy.login('user@example.com', 'password123');
    
    // Перехоплюємо наступний запит
    cy.intercept('GET', '/api/user', (req) => {
        expect(req.headers).to.have.property('authorization');
        expect(req.headers['authorization']).to.include('Bearer');
    }).as('getUser');
    
    cy.visit('/profile');
    cy.wait('@getUser');
});
```

### Поради щодо налагодження
- Якщо токен не зберігається, перевірте, чи не використовується SessionStorage замість LocalStorage
- Якщо токен зникає після перезавантаження, перевірте, чи не очищається LocalStorage
- Перевірте, чи токен не зберігається в cookies замість LocalStorage

---

## Сценарій 2: Очищення даних перед тестами

### Опис завдання
Переконатися, що перед кожним тестом всі дані (Cookies, LocalStorage, SessionStorage) очищені, щоб забезпечити ізольованість тестів.

### Очікуваний результат
- LocalStorage порожній
- SessionStorage порожній
- Тестові cookies відсутні
- Тест виконується з чистим станом

### Покрокова інструкція

#### Крок 1: Перевірка поточного стану
1. Відкрити DevTools Application
2. Перевірити LocalStorage - має бути порожнім або містити тільки тестові дані
3. Перевірити SessionStorage - має бути порожнім
4. Перевірити Cookies - мають бути відсутні тестові cookies

#### Крок 2: Очищення даних
1. В LocalStorage: натиснути правою кнопкою → Clear
2. В SessionStorage: натиснути правою кнопкою → Clear
3. В Cookies: видалити тестові cookies вручну або використати "Clear site data"

#### Крок 3: Перевірка після очищення
1. Перевірити, що LocalStorage порожній
2. Перевірити, що SessionStorage порожній
3. Перевірити, що тестові cookies відсутні

### Приклади коду для вирішення

#### DevTools Console
```javascript
// Очищення всіх даних (працює на будь-якому сайті)
function clearAllStorage() {
    // Очищаємо LocalStorage
    localStorage.clear();
    console.log('✅ LocalStorage cleared');
    
    // Очищаємо SessionStorage
    sessionStorage.clear();
    console.log('✅ SessionStorage cleared');
    
    // Очищаємо cookies
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('✅ Cookies cleared');
}

// Перевірка стану
function checkStorageState() {
    console.log('LocalStorage items:', localStorage.length);
    console.log('SessionStorage items:', sessionStorage.length);
    console.log('Cookies:', document.cookie || '(none)');
    
    if (localStorage.length === 0 && sessionStorage.length === 0) {
        console.log('✅ Storage is clean');
    } else {
        console.warn('⚠️ Storage is not empty');
        console.table(Object.keys(localStorage).reduce((acc, key) => {
            acc[key] = localStorage.getItem(key).substring(0, 50);
            return acc;
        }, {}));
    }
}

// Використання (виконайте на будь-якому сайті):
clearAllStorage();
checkStorageState();

// Тестуємо: додаємо дані та перевіряємо
localStorage.setItem('test-key', 'test-value');
checkStorageState();
```

#### Cypress
```javascript
describe('Tests with clean state', () => {
    beforeEach(() => {
        // Очищаємо всі дані перед кожним тестом
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
    });
    
    it('should start with empty storage', () => {
        cy.window().then((win) => {
            expect(win.localStorage.length).to.eq(0);
            expect(win.sessionStorage.length).to.eq(0);
        });
    });
    
    it('should not have test cookies', () => {
        cy.getCookies().then((cookies) => {
            const testCookies = cookies.filter(c => 
                c.name.startsWith('test-') || 
                c.name.startsWith('cypress-')
            );
            expect(testCookies).to.have.length(0);
        });
    });
});
```

### Поради щодо налагодження
- Використовуйте `beforeEach` hook для автоматичного очищення
- Перевіряйте стан storage на початку кожного тесту
- Звертайте увагу на системні cookies, які можуть залишатися

---

## Сценарій 3: Перевірка структури збережених даних

### Опис завдання
Перевірити, що дані користувача зберігаються в LocalStorage з правильною структурою та всіма необхідними полями.

### Очікуваний результат
- Дані зберігаються як JSON об'єкт
- Всі необхідні поля присутні
- Типи даних коректні
- Дані можуть бути правильно відновлені

### Покрокова інструкція

#### Крок 1: Збереження даних
1. Виконати дію, що зберігає дані (наприклад, оновити профіль)
2. Відкрити DevTools Application
3. Перейти до LocalStorage
4. Знайти ключ з даними користувача

#### Крок 2: Аналіз структури
1. Переглянути значення ключа
2. Перевірити, що це валідний JSON
3. Перевірити наявність всіх необхідних полів
4. Перевірити типи даних

#### Крок 3: Валідація даних
1. Перевірити формат email (якщо є)
2. Перевірити формат дат (якщо є)
3. Перевірити обов'язкові поля

### Приклади коду для вирішення

#### DevTools Console
```javascript
// Перевірка структури даних користувача
function validateUserData() {
    const userDataStr = localStorage.getItem('user');
    
    if (!userDataStr) {
        console.log('ℹ️ User data not found. Завантажуємо з реального API...');
        
        // Завантажуємо дані з реального API
        fetch('https://jsonplaceholder.typicode.com/users/1')
            .then(r => r.json())
            .then(userData => {
                // Зберігаємо в LocalStorage
                localStorage.setItem('user', JSON.stringify(userData));
                // Перевіряємо
                validateUserData();
            });
        return false;
    }
    
    try {
        const userData = JSON.parse(userDataStr);
        
        // Перевірка наявності обов'язкових полів
        const requiredFields = ['id', 'name', 'email'];
        const missingFields = requiredFields.filter(field => !(field in userData));
        
        if (missingFields.length > 0) {
            console.error('❌ Missing fields:', missingFields);
            return false;
        }
        
        // Перевірка типів
        if (typeof userData.id !== 'number') {
            console.error('❌ Invalid id type');
            return false;
        }
        
        if (typeof userData.name !== 'string') {
            console.error('❌ Invalid name type');
            return false;
        }
        
        // Перевірка формату email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            console.error('❌ Invalid email format');
            return false;
        }
        
        console.log('✅ User data structure is valid');
        console.table(userData);
        return true;
        
    } catch (error) {
        console.error('❌ Invalid JSON:', error);
        return false;
    }
}

// Використання (працює на будь-якому сайті):
validateUserData();
```

#### Cypress
```javascript
it('should store user data with correct structure from real API', () => {
    // Завантажуємо дані користувача з реального API
    cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
        .then((response) => {
            const userData = response.body;
            
            // Зберігаємо в LocalStorage (симуляція реального додатку)
            cy.window().then((win) => {
                win.localStorage.setItem('user', JSON.stringify(userData));
            });
            
            // Перевіряємо структуру даних
            cy.window().then((win) => {
                const storedData = JSON.parse(win.localStorage.getItem('user'));
                
                // Перевіряємо наявність полів
                expect(storedData).to.have.property('id');
                expect(storedData).to.have.property('name');
                expect(storedData).to.have.property('email');
                expect(storedData).to.have.property('address');
                
                // Перевіряємо типи
                expect(storedData.id).to.be.a('number');
                expect(storedData.name).to.be.a('string');
                expect(storedData.email).to.be.a('string');
                
                // Перевіряємо формат email
                expect(storedData.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            });
        });
});
```

### Поради щодо налагодження
- Використовуйте `JSON.parse` з try-catch для безпечного парсингу
- Перевіряйте не тільки наявність полів, але й їх типи
- Звертайте увагу на null/undefined значення

---

## Сценарій 4: Тестування безпеки збереження даних

### Опис завдання
Перевірити, що чутливі дані (паролі, токени) не зберігаються небезпечно в LocalStorage або cookies.

### Очікуваний результат
- Паролі не зберігаються в plain text
- Токени зберігаються безпечно
- Чутливі дані не передаються в URL
- Використовуються правильні атрибути безпеки для cookies

### Покрокова інструкція

#### Крок 1: Перевірка LocalStorage
1. Відкрити DevTools Application
2. Переглянути всі ключі в LocalStorage
3. Перевірити, чи немає ключів з "password", "secret", "token" в назві
4. Якщо є токени, перевірити, що вони не в plain text

#### Крок 2: Перевірка Cookies
1. Перейти до Cookies в Application
2. Перевірити атрибути безпеки:
   - `HttpOnly` - для cookies з токенами
   - `Secure` - для HTTPS сайтів
   - `SameSite` - для захисту від CSRF

#### Крок 3: Перевірка URL
1. Перевірити, чи чутливі дані не передаються в query parameters
2. Перевірити Network панель на наявність чутливих даних в URL

### Приклади коду для вирішення

#### DevTools Console
```javascript
// Перевірка безпеки збереження даних
function checkStorageSecurity() {
    const sensitivePatterns = ['password', 'secret', 'token', 'key', 'auth'];
    const issues = [];
    
    // Перевіряємо LocalStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        
        sensitivePatterns.forEach(pattern => {
            if (key.toLowerCase().includes(pattern)) {
                // Перевіряємо, чи значення не занадто коротке (може бути plain text)
                if (value && value.length < 50 && !value.startsWith('encrypted:')) {
                    issues.push({
                        type: 'LocalStorage',
                        key: key,
                        issue: 'Sensitive data may be stored insecurely'
                    });
                }
            }
        });
    }
    
    // Перевіряємо cookies
    document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        sensitivePatterns.forEach(pattern => {
            if (name.toLowerCase().includes(pattern)) {
                // Перевіряємо атрибути безпеки
                const cookieString = document.cookie;
                if (!cookieString.includes('HttpOnly') && !cookieString.includes('Secure')) {
                    issues.push({
                        type: 'Cookie',
                        key: name,
                        issue: 'Missing security attributes'
                    });
                }
            }
        });
    });
    
    if (issues.length > 0) {
        console.warn('⚠️ Security issues found:');
        console.table(issues);
    } else {
        console.log('✅ No obvious security issues found');
    }
    
    return issues;
}

checkStorageSecurity();
```

#### Cypress
```javascript
it('should not store passwords in plain text', () => {
    cy.visit('/login');
    
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    
    // Перевіряємо, що пароль не збережено
    cy.window().then((win) => {
        const storageKeys = Object.keys(win.localStorage);
        const passwordKeys = storageKeys.filter(key => 
            key.toLowerCase().includes('password')
        );
        
        expect(passwordKeys).to.have.length(0);
    });
});

it('should use secure cookie attributes', () => {
    cy.visit('https://example.com');
    
    cy.setCookie('auth-token', 'test-token', {
        secure: true,
        httpOnly: true,
        sameSite: 'Strict'
    });
    
    cy.getCookie('auth-token').then((cookie) => {
        expect(cookie.secure).to.be.true;
        // httpOnly не доступний через JavaScript, але перевіряємо через Network
    });
});
```

### Поради щодо налагодження
- Перевіряйте не тільки назви ключів, але й значення
- Звертайте увагу на довжину токенів (короткі токени можуть бути небезпечними)
- Перевіряйте атрибути cookies через Network панель

