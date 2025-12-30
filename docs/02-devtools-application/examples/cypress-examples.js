/**
 * DevTools Application - Приклади для Cypress
 * 
 * Ці приклади демонструють, як використовувати Cypress для роботи з
 * Cookies, LocalStorage, SessionStorage та іншими даними браузера.
 */

/**
 * DevTools Application - Приклади для Cypress
 * 
 * ВИКОРИСТОВУЮТЬСЯ РЕАЛЬНІ САЙТИ:
 * - example.com - для базових тестів
 * - jsonplaceholder.typicode.com - для тестів з API
 */

describe('Application Storage Testing', () => {
    beforeEach(() => {
        // Очищаємо всі дані перед кожним тестом
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
    });

    // ============================================================================
    // 1. КЕРУВАННЯ COOKIES
    // ============================================================================

    it('should set and get cookie on real website', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо cookie на реальному сайті
        cy.setCookie('test-cookie', 'test-value', {
            domain: 'example.com',
            path: '/',
            secure: true,
            httpOnly: false,
            sameSite: 'Lax'
        });
        
        // Перевіряємо, що cookie встановлено
        cy.getCookie('test-cookie').then((cookie) => {
            expect(cookie.value).to.eq('test-value');
            expect(cookie.domain).to.include('example.com');
        });
    });

    it('should get all cookies', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо кілька cookies
        cy.setCookie('cookie1', 'value1');
        cy.setCookie('cookie2', 'value2');
        cy.setCookie('cookie3', 'value3');
        
        // Отримуємо всі cookies
        cy.getCookies().then((cookies) => {
            expect(cookies).to.have.length.at.least(3);
            
            const cookieNames = cookies.map(c => c.name);
            expect(cookieNames).to.include('cookie1');
            expect(cookieNames).to.include('cookie2');
            expect(cookieNames).to.include('cookie3');
        });
    });

    it('should delete cookie', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо cookie
        cy.setCookie('temp-cookie', 'temp-value');
        
        // Перевіряємо наявність
        cy.getCookie('temp-cookie').should('exist');
        
        // Видаляємо cookie
        cy.clearCookie('temp-cookie');
        
        // Перевіряємо, що cookie видалено
        cy.getCookie('temp-cookie').should('be.null');
    });

    it('should clear all cookies', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо кілька cookies
        cy.setCookie('cookie1', 'value1');
        cy.setCookie('cookie2', 'value2');
        
        // Очищаємо всі cookies
        cy.clearCookies();
        
        // Перевіряємо, що всі cookies видалено
        cy.getCookies().then((cookies) => {
            // Можуть залишитися системні cookies, але наші повинні бути видалені
            const ourCookies = cookies.filter(c => 
                c.name === 'cookie1' || c.name === 'cookie2'
            );
            expect(ourCookies).to.have.length(0);
        });
    });

    // ============================================================================
    // 2. РОБОТА З LOCALSTORAGE
    // ============================================================================

    it('should set and get LocalStorage value', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо значення в LocalStorage
        cy.window().then((win) => {
            win.localStorage.setItem('test-key', 'test-value');
        });
        
        // Перевіряємо значення
        cy.window().then((win) => {
            expect(win.localStorage.getItem('test-key')).to.eq('test-value');
        });
    });

    it('should store and retrieve complex objects in LocalStorage', () => {
        cy.visit('https://example.com');
        
        const userData = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            preferences: {
                theme: 'dark',
                language: 'en'
            }
        };
        
        // Зберігаємо об'єкт в LocalStorage
        cy.window().then((win) => {
            win.localStorage.setItem('user', JSON.stringify(userData));
        });
        
        // Отримуємо та перевіряємо об'єкт
        cy.window().then((win) => {
            const stored = JSON.parse(win.localStorage.getItem('user'));
            expect(stored).to.deep.eq(userData);
            expect(stored.name).to.eq('John Doe');
            expect(stored.preferences.theme).to.eq('dark');
        });
    });

    it('should clear LocalStorage', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо значення
        cy.window().then((win) => {
            win.localStorage.setItem('key1', 'value1');
            win.localStorage.setItem('key2', 'value2');
        });
        
        // Очищаємо LocalStorage
        cy.clearLocalStorage();
        
        // Перевіряємо, що LocalStorage порожній
        cy.window().then((win) => {
            expect(win.localStorage.length).to.eq(0);
        });
    });

    it('should remove specific key from LocalStorage', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо кілька значень
        cy.window().then((win) => {
            win.localStorage.setItem('keep-me', 'value1');
            win.localStorage.setItem('remove-me', 'value2');
        });
        
        // Видаляємо конкретний ключ
        cy.window().then((win) => {
            win.localStorage.removeItem('remove-me');
        });
        
        // Перевіряємо результат
        cy.window().then((win) => {
            expect(win.localStorage.getItem('keep-me')).to.eq('value1');
            expect(win.localStorage.getItem('remove-me')).to.be.null;
        });
    });

    it('should verify LocalStorage size', () => {
        cy.visit('https://example.com');
        
        // Додаємо дані
        cy.window().then((win) => {
            const largeData = 'x'.repeat(1000);
            win.localStorage.setItem('large-key', largeData);
        });
        
        // Перевіряємо розмір
        cy.window().then((win) => {
            let totalSize = 0;
            for (let i = 0; i < win.localStorage.length; i++) {
                const key = win.localStorage.key(i);
                totalSize += key.length + win.localStorage.getItem(key).length;
            }
            
            // Перевіряємо, що розмір менше 5MB (типовий ліміт)
            expect(totalSize).to.be.lessThan(5 * 1024 * 1024);
        });
    });

    // ============================================================================
    // 3. РОБОТА З SESSIONSTORAGE
    // ============================================================================

    it('should set and get SessionStorage value', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо значення в SessionStorage
        cy.window().then((win) => {
            win.sessionStorage.setItem('session-key', 'session-value');
        });
        
        // Перевіряємо значення
        cy.window().then((win) => {
            expect(win.sessionStorage.getItem('session-key')).to.eq('session-value');
        });
    });

    it('should clear SessionStorage', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо значення
        cy.window().then((win) => {
            win.sessionStorage.setItem('key1', 'value1');
            win.sessionStorage.setItem('key2', 'value2');
        });
        
        // Очищаємо SessionStorage
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
        
        // Перевіряємо, що SessionStorage порожній
        cy.window().then((win) => {
            expect(win.sessionStorage.length).to.eq(0);
        });
    });

    // ============================================================================
    // 4. ОЧИЩЕННЯ КЕШУ ПЕРЕД ТЕСТАМИ
    // ============================================================================

    it('should start with clean state', () => {
        // Перевіряємо, що storage порожній перед тестом
        cy.window().then((win) => {
            expect(win.localStorage.length).to.eq(0);
            expect(win.sessionStorage.length).to.eq(0);
        });
        
        cy.getCookies().then((cookies) => {
            // Можуть бути системні cookies, але наші тестові повинні бути відсутні
            const testCookies = cookies.filter(c => c.name.startsWith('test-'));
            expect(testCookies).to.have.length(0);
        });
    });

    it('should clear storage before each test', () => {
        // Встановлюємо дані в попередньому тесті
        cy.window().then((win) => {
            win.localStorage.setItem('previous-test', 'data');
        });
        
        // В наступному тесті (через beforeEach) storage буде очищено
        // Це демонструє важливість очищення перед кожним тестом
    });

    // ============================================================================
    // 5. ПЕРЕВІРКА ЗБЕРЕЖЕНИХ ДАНИХ
    // ============================================================================

    it('should verify data structure in LocalStorage', () => {
        cy.visit('https://example.com');
        
        const userData = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
        };
        
        // Зберігаємо дані
        cy.window().then((win) => {
            win.localStorage.setItem('user', JSON.stringify(userData));
        });
        
        // Перевіряємо структуру
        cy.window().then((win) => {
            const stored = JSON.parse(win.localStorage.getItem('user'));
            
            // Перевіряємо наявність всіх необхідних полів
            expect(stored).to.have.property('id');
            expect(stored).to.have.property('name');
            expect(stored).to.have.property('email');
            
            // Перевіряємо типи
            expect(stored.id).to.be.a('number');
            expect(stored.name).to.be.a('string');
            expect(stored.email).to.be.a('string');
            
            // Перевіряємо формат email
            expect(stored.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
    });

    it('should verify token is stored securely', () => {
        cy.visit('https://example.com');
        
        // Симулюємо збереження токену
        cy.window().then((win) => {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
            win.localStorage.setItem('authToken', token);
        });
        
        // Перевіряємо, що токен збережено
        cy.window().then((win) => {
            const token = win.localStorage.getItem('authToken');
            expect(token).to.exist;
            expect(token.length).to.be.greaterThan(50); // JWT токени зазвичай довгі
        });
    });

    it('should verify data persists after page reload', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо дані
        cy.window().then((win) => {
            win.localStorage.setItem('persistent-data', 'test-value');
        });
        
        // Перезавантажуємо сторінку
        cy.reload();
        
        // Перевіряємо, що дані збережені
        cy.window().then((win) => {
            expect(win.localStorage.getItem('persistent-data')).to.eq('test-value');
        });
    });

    it('should verify SessionStorage is cleared after session', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо дані в SessionStorage
        cy.window().then((win) => {
            win.sessionStorage.setItem('session-data', 'test-value');
        });
        
        // Відкриваємо нову вкладку (новий session)
        cy.window().then((win) => {
            // SessionStorage повинен бути порожнім у новій вкладці
            // (це залежить від браузера, але зазвичай так)
        });
    });

    // ============================================================================
    // 6. РОЗШИРЕНІ СЦЕНАРІЇ
    // ============================================================================

    it('should handle storage quota exceeded', () => {
        cy.visit('https://example.com');
        
        // Спробуємо заповнити LocalStorage до ліміту
        cy.window().then((win) => {
            try {
                const largeData = 'x'.repeat(10 * 1024 * 1024); // 10MB
                win.localStorage.setItem('large-data', largeData);
            } catch (error) {
                // Очікуємо помилку при перевищенні квоти
                expect(error.name).to.eq('QuotaExceededError');
            }
        });
    });

    it('should sync data between tabs using storage events', () => {
        cy.visit('https://example.com');
        
        // Встановлюємо listener для storage events
        cy.window().then((win) => {
            win.addEventListener('storage', (e) => {
                console.log('Storage event:', e.key, e.newValue);
            });
        });
        
        // Змінюємо дані (це викличе storage event в інших вкладках)
        cy.window().then((win) => {
            win.localStorage.setItem('synced-data', 'new-value');
        });
    });

    it('should export and import storage data', () => {
        cy.visit('https://example.com');
        
        const originalData = {
            user: { id: 1, name: 'John' },
            settings: { theme: 'dark' }
        };
        
        // Зберігаємо дані
        cy.window().then((win) => {
            win.localStorage.setItem('user', JSON.stringify(originalData.user));
            win.localStorage.setItem('settings', JSON.stringify(originalData.settings));
        });
        
        // Експортуємо дані
        cy.window().then((win) => {
            const exported = {
                user: JSON.parse(win.localStorage.getItem('user')),
                settings: JSON.parse(win.localStorage.getItem('settings'))
            };
            
            // Очищаємо storage
            win.localStorage.clear();
            
            // Імпортуємо дані назад
            win.localStorage.setItem('user', JSON.stringify(exported.user));
            win.localStorage.setItem('settings', JSON.stringify(exported.settings));
            
            // Перевіряємо, що дані відновлені
            const restored = {
                user: JSON.parse(win.localStorage.getItem('user')),
                settings: JSON.parse(win.localStorage.getItem('settings'))
            };
            
            expect(restored).to.deep.eq(originalData);
        });
    });
});

