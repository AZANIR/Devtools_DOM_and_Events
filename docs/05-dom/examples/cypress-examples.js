/**
 * DOM - Приклади для Cypress
 * 
 * ВИКОРИСТОВУЄТЬСЯ РЕАЛЬНИЙ САЙТ: example.com
 */

describe('DOM Manipulation on Real Website', () => {
    beforeEach(() => {
        cy.visit('https://example.com');
    });
    
    it('should find elements on real website', () => {
        cy.get('h1').should('exist');
        cy.get('p').should('exist');
        cy.get('a').should('exist');
    });
    
    it('should manipulate DOM on real website', () => {
        cy.get('body').then(($body) => {
            const newDiv = document.createElement('div');
            newDiv.textContent = 'Test element created by Cypress';
            newDiv.setAttribute('data-testid', 'cypress-test');
            $body[0].appendChild(newDiv);
        });
        cy.contains('Test element created by Cypress').should('exist');
        cy.get('[data-testid="cypress-test"]').should('exist');
    });
    
    it('should work with element attributes', () => {
        cy.get('a').first().then(($link) => {
            const href = $link.attr('href');
            expect(href).to.exist;
            expect(href).to.be.a('string');
        });
    });
});

