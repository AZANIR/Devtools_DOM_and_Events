/**
 * Швидкий тест для перевірки, чи все працює
 * 
 * Цей тест перевіряє базову функціональність з реальними API
 */

describe('Quick Verification Test', () => {
    it('should make real API request to JSONPlaceholder', () => {
        cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('email');
                console.log('✅ API request successful:', response.body.name);
            });
    });

    it('should visit real website and find elements', () => {
        cy.visit('https://example.com');
        cy.get('h1').should('exist').and('contain', 'Example Domain');
        cy.get('p').should('exist');
        cy.get('a').should('exist');
        console.log('✅ Website elements found successfully');
    });

    it('should test login with real API (ReqRes)', () => {
        cy.request({
            method: 'POST',
            url: 'https://reqres.in/api/login',
            body: {
                email: 'eve.holt@reqres.in',
                password: 'cityslicka'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            console.log('✅ Login successful, token received');
        });
    });
});

