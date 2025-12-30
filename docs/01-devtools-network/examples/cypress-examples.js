/**
 * DevTools Network - Приклади для Cypress
 * 
 * Ці приклади демонструють, як використовувати Cypress для тестування
 * мережевої активності веб-додатку.
 * 
 * ВИКОРИСТОВУЮТЬСЯ РЕАЛЬНІ API:
 * - JSONPlaceholder: https://jsonplaceholder.typicode.com/
 * - ReqRes: https://reqres.in/api/
 * - httpbin.org: https://httpbin.org/
 */

describe('Network Requests Testing', () => {
    // ============================================================================
    // 1. ВІДСТЕЖЕННЯ XHR/FETCH ЗАПИТІВ
    // ============================================================================

    it('should intercept and verify GET request to real API', () => {
        // Перехоплюємо GET запит до реального API
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users/1').as('getUser');
        
        // Виконуємо реальний запит
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1');
        
        // Чекаємо на завершення запиту та перевіряємо його
        cy.wait('@getUser').then((interception) => {
            expect(interception.request.method).to.eq('GET');
            expect(interception.request.url).to.include('jsonplaceholder.typicode.com');
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body).to.have.property('id');
            expect(interception.response.body).to.have.property('name');
        });
    });

    it('should intercept multiple requests to real APIs', () => {
        // Перехоплюємо кілька запитів до реальних API одночасно
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users').as('users');
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts').as('posts');
        
        // Виконуємо обидва запити
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users');
        cy.request('GET', 'https://jsonplaceholder.typicode.com/posts');
        
        // Чекаємо на обидва запити
        cy.wait(['@users', '@posts']);
        
        // Перевіряємо обидва запити
        cy.get('@users').its('response.statusCode').should('eq', 200);
        cy.get('@users').its('response.body').should('be.an', 'array');
        cy.get('@posts').its('response.statusCode').should('eq', 200);
        cy.get('@posts').its('response.body').should('be.an', 'array');
    });

    it('should verify request headers', () => {
        cy.intercept('GET', 'https://httpbin.org/get', (req) => {
            // Перевіряємо заголовки запиту
            expect(req.headers).to.exist;
        }).as('getData');
        
        // Виконуємо запит з кастомними заголовками
        cy.request({
            method: 'GET',
            url: 'https://httpbin.org/get',
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'test-value'
            }
        });
        
        cy.wait('@getData').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });

    // ============================================================================
    // 2. АНАЛІЗ ПАРАМЕТРІВ ЗАПИТІВ ТА ВІДПОВІДЕЙ
    // ============================================================================

    it('should verify POST request payload to real API', () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            username: 'johndoe'
        };
        
        // Перехоплюємо POST запит до реального API та перевіряємо body
        cy.intercept('POST', 'https://jsonplaceholder.typicode.com/users', (req) => {
            // Перевіряємо дані, що відправляються
            expect(req.body).to.have.property('name');
            expect(req.body).to.have.property('email');
            expect(req.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        }).as('createUser');
        
        // Відправляємо POST запит
        cy.request({
            method: 'POST',
            url: 'https://jsonplaceholder.typicode.com/users',
            body: userData,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        cy.wait('@createUser').then((interception) => {
            expect(interception.response.statusCode).to.eq(201);
        });
    });

    it('should verify response data structure from real API', () => {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users/1').as('getUser');
        
        // Виконуємо запит до реального API
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1');
        
        cy.wait('@getUser').then((interception) => {
            const response = interception.response.body;
            
            // Перевіряємо структуру відповіді
            expect(response).to.have.property('id');
            expect(response).to.have.property('name');
            expect(response).to.have.property('email');
            expect(response).to.have.property('address');
            expect(response.id).to.be.a('number');
            expect(response.name).to.be.a('string');
            expect(response.email).to.be.a('string');
        });
    });

    it('should verify query parameters with real API', () => {
        cy.intercept('GET', 'https://httpbin.org/get*', (req) => {
            // Перевіряємо query параметри
            expect(req.query).to.exist;
        }).as('getWithParams');
        
        // Виконуємо запит з query параметрами
        cy.request('GET', 'https://httpbin.org/get?q=test&page=1');
        
        cy.wait('@getWithParams').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.args).to.have.property('q', 'test');
            expect(interception.response.body.args).to.have.property('page', '1');
        });
    });

    // ============================================================================
    // 3. ВИМІРЮВАННЯ ЧАСУ ЗАВАНТАЖЕННЯ
    // ============================================================================

    it('should measure request duration to real API', () => {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts/1').as('getData');
        
        const startTime = Date.now();
        
        // Виконуємо запит до реального API
        cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1');
        
        cy.wait('@getData').then(() => {
            const duration = Date.now() - startTime;
            
            // Перевіряємо, що запит виконався швидше ніж за 5 секунд (з урахуванням мережі)
            expect(duration).to.be.lessThan(5000);
        });
    });

    it('should verify response time is acceptable from real API', () => {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users').as('getUsers');
        
        // Виконуємо запит до реального API
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users');
        
        cy.wait('@getUsers').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            // Перевіряємо, що відповідь містить дані
            expect(interception.response.body).to.be.an('array');
            expect(interception.response.body.length).to.be.greaterThan(0);
        });
    });

    // ============================================================================
    // 4. ПЕРЕХОПЛЕННЯ ТА МОДИФІКАЦІЯ ЗАПИТІВ
    // ============================================================================

    it('should modify request before sending to real API', () => {
        cy.intercept('POST', 'https://jsonplaceholder.typicode.com/users', (req) => {
            // Модифікуємо body перед відправкою
            req.body.customField = 'modified-value';
            expect(req.body.customField).to.eq('modified-value');
        }).as('createUser');
        
        // Відправляємо POST запит
        cy.request({
            method: 'POST',
            url: 'https://jsonplaceholder.typicode.com/users',
            body: { name: 'Test User', email: 'test@example.com' },
            headers: { 'Content-Type': 'application/json' }
        });
        
        cy.wait('@createUser');
    });

    it('should mock response with custom data', () => {
        // Мокуємо відповідь сервера для реального API
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Mocked User', email: 'mock@example.com' }
            ]
        }).as('getUsers');
        
        // Виконуємо запит (буде повернено моковані дані)
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users');
        
        cy.wait('@getUsers').then((interception) => {
            expect(interception.response.body).to.deep.eq([
                { id: 1, name: 'Mocked User', email: 'mock@example.com' }
            ]);
        });
    });

    it('should simulate server error', () => {
        // Мокуємо помилку сервера для реального API
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
            statusCode: 500,
            body: { error: 'Internal Server Error' }
        }).as('getUsersError');
        
        // Виконуємо запит (буде повернено помилку)
        cy.request({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/users',
            failOnStatusCode: false
        });
        
        cy.wait('@getUsersError').then((interception) => {
            expect(interception.response.statusCode).to.eq(500);
            expect(interception.response.body).to.have.property('error');
        });
    });

    it('should block specific requests', () => {
        // Блокуємо запит до реального API (повертаємо помилку)
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts', { 
            forceNetworkError: true 
        }).as('blockPosts');
        
        // Спробуємо виконати запит (буде помилка)
        cy.request({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/posts',
            failOnStatusCode: false
        }).then((response) => {
            // Очікуємо помилку через forceNetworkError
            expect(response.status).to.eq(0);
        });
    });

    it('should modify response headers from real API', () => {
        cy.intercept('GET', 'https://httpbin.org/get', (req) => {
            req.reply((res) => {
                // Модифікуємо заголовки відповіді
                res.headers['x-custom-header'] = 'custom-value';
                return res;
            });
        }).as('getData');
        
        // Виконуємо запит до реального API
        cy.request('GET', 'https://httpbin.org/get');
        
        cy.wait('@getData').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.headers['x-custom-header']).to.eq('custom-value');
        });
    });

    // ============================================================================
    // 5. РОЗШИРЕНІ СЦЕНАРІЇ
    // ============================================================================

    it('should handle retry logic on failed requests', () => {
        let requestCount = 0;
        
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts/1', (req) => {
            requestCount++;
            if (requestCount < 3) {
                // Перші два запити повертають помилку
                req.reply({ statusCode: 500 });
            } else {
                // Третій запит успішний
                req.reply({ statusCode: 200, body: { id: 1, title: 'success', body: 'test' } });
            }
        }).as('getData');
        
        // Виконуємо запити (симулюємо retry)
        cy.request({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            failOnStatusCode: false
        });
        cy.request({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            failOnStatusCode: false
        });
        cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1');
        
        // Чекаємо на успішний запит
        cy.wait('@getData', { timeout: 10000 }).then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });

    it('should verify request sequence to real APIs', () => {
        const requests = [];
        
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/*', (req) => {
            requests.push({
                url: req.url,
                method: req.method,
                timestamp: Date.now()
            });
        }).as('apiRequests');
        
        // Виконуємо послідовні запити до реальних API
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users');
        cy.request('GET', 'https://jsonplaceholder.typicode.com/posts');
        cy.request('GET', 'https://jsonplaceholder.typicode.com/comments');
        
        // Чекаємо на всі запити
        cy.wait(['@apiRequests', '@apiRequests', '@apiRequests']).then(() => {
            // Перевіряємо послідовність запитів
            expect(requests[0].url).to.include('/users');
            expect(requests[1].url).to.include('/posts');
            expect(requests[2].url).to.include('/comments');
        });
    });

    it('should test with different network conditions', () => {
        // Симулюємо повільне з'єднання для реального API
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts/1', {
            delay: 2000, // Затримка 2 секунди
            body: { id: 1, title: 'Test', body: 'Test body' }
        }).as('slowRequest');
        
        const startTime = Date.now();
        
        // Виконуємо запит
        cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1');
        
        cy.wait('@slowRequest');
        
        const duration = Date.now() - startTime;
        
        // Перевіряємо, що запит зайняв принаймні 2 секунди
        expect(duration).to.be.at.least(2000);
    });
});

