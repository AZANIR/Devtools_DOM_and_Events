/**
 * Application Storage Testing
 * 
 * Тести для роботи з Cookies, LocalStorage, SessionStorage
 */

describe('Application Storage - Real Website Testing', () => {
    beforeEach(() => {
        cy.visit('https://example.com');
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
        cy.setCookie('test-cookie', 'test-value', {
            domain: 'example.com',
            path: '/',
            secure: true,
            httpOnly: false,
            sameSite: 'Lax'
        });
        
        cy.getCookie('test-cookie').then((cookie) => {
            expect(cookie.value).to.eq('test-value');
            expect(cookie.domain).to.include('example.com');
        });
    });

    it('should clear all cookies', () => {
        cy.setCookie('cookie1', 'value1');
        cy.setCookie('cookie2', 'value2');
        
        cy.clearCookies();
        
        cy.getCookies().then((cookies) => {
            const ourCookies = cookies.filter(c => 
                c.name === 'cookie1' || c.name === 'cookie2'
            );
            expect(ourCookies).to.have.length(0);
        });
    });

    // ============================================================================
    // 2. РОБОТА З LOCALSTORAGE
    // ============================================================================

    it('should store and retrieve data from real API in LocalStorage', () => {
        // Завантажуємо дані з реального API
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
            .then((response) => {
                const userData = response.body;
                
                // Зберігаємо в LocalStorage
                cy.window().then((win) => {
                    win.localStorage.setItem('user', JSON.stringify(userData));
                });
                
                // Перевіряємо збереження
                cy.window().then((win) => {
                    const stored = JSON.parse(win.localStorage.getItem('user'));
                    expect(stored).to.deep.eq(userData);
                    expect(stored.name).to.exist;
                    expect(stored.email).to.exist;
                });
            });
    });

    it('should clear LocalStorage', () => {
        cy.window().then((win) => {
            win.localStorage.setItem('key1', 'value1');
            win.localStorage.setItem('key2', 'value2');
        });
        
        cy.clearLocalStorage();
        
        cy.window().then((win) => {
            expect(win.localStorage.length).to.eq(0);
        });
    });

    // ============================================================================
    // 3. РОБОТА З SESSIONSTORAGE
    // ============================================================================

    it('should set and get SessionStorage value', () => {
        cy.window().then((win) => {
            win.sessionStorage.setItem('session-key', 'session-value');
        });
        
        cy.window().then((win) => {
            expect(win.sessionStorage.getItem('session-key')).to.eq('session-value');
        });
    });

    it('should clear SessionStorage', () => {
        cy.window().then((win) => {
            win.sessionStorage.setItem('key1', 'value1');
            win.sessionStorage.setItem('key2', 'value2');
        });
        
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
        
        cy.window().then((win) => {
            expect(win.sessionStorage.length).to.eq(0);
        });
    });

    // ============================================================================
    // 4. ПЕРЕВІРКА ЗБЕРЕЖЕНИХ ДАНИХ
    // ============================================================================

    it('should verify data structure from real API', () => {
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
            .then((response) => {
                const userData = response.body;
                
                cy.window().then((win) => {
                    win.localStorage.setItem('user', JSON.stringify(userData));
                });
                
                cy.window().then((win) => {
                    const stored = JSON.parse(win.localStorage.getItem('user'));
                    
                    expect(stored).to.have.property('id');
                    expect(stored).to.have.property('name');
                    expect(stored).to.have.property('email');
                    expect(stored.id).to.be.a('number');
                    expect(stored.name).to.be.a('string');
                    expect(stored.email).to.be.a('string');
                    expect(stored.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
                });
            });
    });
});

