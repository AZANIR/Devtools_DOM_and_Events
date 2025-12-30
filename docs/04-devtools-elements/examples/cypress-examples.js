/**
 * DevTools Elements - Приклади для Cypress
 * 
 * ВИКОРИСТОВУЄТЬСЯ РЕАЛЬНИЙ САЙТ: example.com
 */

describe('Elements Testing on Real Website', () => {
    beforeEach(() => {
        cy.visit('https://example.com');
    });
    
    it('should find elements by tag name on real website', () => {
        cy.get('h1').should('exist').and('contain', 'Example Domain');
        cy.get('p').should('exist').and('have.length.at.least', 1);
        cy.get('a').should('exist').and('have.attr', 'href');
    });
    
    it('should verify element hierarchy on real website', () => {
        // Перевіряємо ієрархію: body > h1
        cy.get('body').find('h1').should('exist');
        
        // Перевіряємо, що h1 знаходиться в body
        cy.get('body').should('contain', 'Example Domain');
    });
    
    it('should find elements by attributes', () => {
        // Перевіряємо посилання з атрибутом href
        cy.get('a[href]').should('exist');
        
        // Перевіряємо всі посилання
        cy.get('a').each(($link) => {
            expect($link).to.have.attr('href');
        });
    });
});

