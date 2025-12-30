/**
 * DOM Manipulation Testing
 * 
 * Тести для маніпуляції DOM елементами
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

    it('should modify element attributes', () => {
        cy.get('h1').then(($h1) => {
            $h1[0].setAttribute('data-test', 'modified');
        });
        
        cy.get('h1').should('have.attr', 'data-test', 'modified');
    });
});

