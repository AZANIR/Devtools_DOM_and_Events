/**
 * Console Testing
 * 
 * Тести для виконання JavaScript команд та тестування селекторів
 */

describe('Console Testing on Real Website', () => {
    beforeEach(() => {
        cy.visit('https://example.com');
    });

    it('should execute JavaScript in browser context', () => {
        cy.window().then((win) => {
            const result = win.eval('2 + 2');
            expect(result).to.eq(4);
        });
    });

    it('should access window properties', () => {
        cy.window().then((win) => {
            expect(win.location.href).to.include('example.com');
            expect(win.navigator.userAgent).to.exist;
        });
    });

    it('should find elements by selector on real website', () => {
        cy.get('h1').should('exist').and('contain', 'Example Domain');
        cy.get('p').should('exist').and('have.length.at.least', 1);
        cy.get('a').should('exist').and('have.attr', 'href');
    });

    it('should verify element count', () => {
        cy.get('p').should('have.length.at.least', 1);
    });

    it('should check element visibility', () => {
        cy.get('h1').should('be.visible');
    });

    it('should verify element text', () => {
        cy.get('h1').should('contain', 'Example Domain');
    });

    it('should verify element attributes', () => {
        cy.get('a').should('have.attr', 'href');
    });

    it('should check element styles', () => {
        cy.get('h1').then(($el) => {
            const styles = window.getComputedStyle($el[0]);
            expect(styles.display).to.not.eq('none');
        });
    });

    it('should verify element is in viewport', () => {
        cy.get('h1').then(($el) => {
            const rect = $el[0].getBoundingClientRect();
            expect(rect.top).to.be.greaterThan(0);
            expect(rect.left).to.be.greaterThan(0);
        });
    });

    it('should find elements by text content', () => {
        cy.contains('Example Domain').should('exist');
        // Перевіряємо наявність посилань (example.com має посилання)
        cy.get('a').should('exist');
        // Перевіряємо, що є текст на сторінці
        cy.get('body').should('contain.text', 'Example');
    });
});

