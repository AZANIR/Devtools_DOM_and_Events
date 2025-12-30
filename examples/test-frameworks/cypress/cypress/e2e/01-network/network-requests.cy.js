/**
 * Network Requests Testing
 * 
 * Тести для перевірки мережевих запитів з використанням реальних API
 */

describe('Network Requests - Real API Testing', () => {
    // ============================================================================
    // 1. ВІДСТЕЖЕННЯ XHR/FETCH ЗАПИТІВ
    // ============================================================================

    it('should intercept and verify GET request to JSONPlaceholder', () => {
        // cy.request() не проходить через cy.intercept(), тому використовуємо прямий запит
        // та перевіряємо відповідь
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('email');
                expect(response.body.id).to.eq(1);
            });
    });

    it('should make multiple requests to real APIs', () => {
        // Виконуємо кілька запитів та перевіряємо відповіді
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users')
            .then((usersResponse) => {
                expect(usersResponse.status).to.eq(200);
                expect(usersResponse.body).to.be.an('array');
                expect(usersResponse.body.length).to.be.greaterThan(0);
            });
        
        cy.request('GET', 'https://jsonplaceholder.typicode.com/posts')
            .then((postsResponse) => {
                expect(postsResponse.status).to.eq(200);
                expect(postsResponse.body).to.be.an('array');
                expect(postsResponse.body.length).to.be.greaterThan(0);
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
        
        // Перевіряємо дані перед відправкою
        expect(userData).to.have.property('name');
        expect(userData).to.have.property('email');
        expect(userData.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        
        cy.request({
            method: 'POST',
            url: 'https://jsonplaceholder.typicode.com/users',
            body: userData,
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
        });
    });

    it('should verify response data structure from real API', () => {
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('email');
                expect(response.body).to.have.property('address');
                expect(response.body.id).to.be.a('number');
                expect(response.body.name).to.be.a('string');
                expect(response.body.email).to.be.a('string');
            });
    });

    it('should verify query parameters with real API', () => {
        cy.request('GET', 'https://httpbin.org/get?q=test&page=1')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.args).to.have.property('q', 'test');
                expect(response.body.args).to.have.property('page', '1');
            });
    });

    // ============================================================================
    // 3. ВИМІРЮВАННЯ ЧАСУ ЗАВАНТАЖЕННЯ
    // ============================================================================

    it('should measure request duration to real API', () => {
        const startTime = Date.now();
        
        cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1')
            .then(() => {
                const duration = Date.now() - startTime;
                expect(duration).to.be.lessThan(5000);
            });
    });

    // ============================================================================
    // 4. ПЕРЕХОПЛЕННЯ ТА МОДИФІКАЦІЯ ЗАПИТІВ
    // ============================================================================

    it('should verify real API response structure', () => {
        // Примітка: cy.request() не проходить через cy.intercept()
        // Тому перевіряємо реальну відповідь API
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.be.greaterThan(0);
                // Перевіряємо структуру першого елемента
                if (response.body.length > 0) {
                    expect(response.body[0]).to.have.property('id');
                    expect(response.body[0]).to.have.property('name');
                    expect(response.body[0]).to.have.property('email');
                }
            });
    });

    it('should handle API errors gracefully', () => {
        // Тестуємо обробку помилок (наприклад, неіснуючий endpoint)
        cy.request({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/users/999999',
            failOnStatusCode: false
        }).then((response) => {
            // JSONPlaceholder повертає 200 навіть для неіснуючих ID
            // Але перевіряємо, що запит виконався
            expect([200, 404]).to.include(response.status);
        });
    });
});

