/**
 * DevTools Console - Приклади для Cypress
 * 
 * Ці приклади демонструють, як використовувати Cypress для тестування
 * елементів та виконання JavaScript команд.
 * 
 * ВИКОРИСТОВУЮТЬСЯ РЕАЛЬНІ САЙТИ:
 * - example.com - для базових тестів
 * - jsonplaceholder.typicode.com - для тестів з API
 */

describe('Console Testing with Cypress', () => {
    beforeEach(() => {
        cy.visit('https://example.com');
    });

    // ============================================================================
    // 1. ВИКОНАННЯ JAVASCRIPT КОМАНД
    // ============================================================================

    it('should execute JavaScript in browser context', () => {
        cy.window().then((win) => {
            // Виконуємо JavaScript код
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

    it('should execute custom JavaScript functions', () => {
        cy.window().then((win) => {
            // Створюємо функцію в контексті браузера
            win.myCustomFunction = function(a, b) {
                return a + b;
            };
            
            const result = win.myCustomFunction(5, 3);
            expect(result).to.eq(8);
        });
    });

    // ============================================================================
    // 2. ТЕСТУВАННЯ СЕЛЕКТОРІВ
    // ============================================================================

    it('should find element by selector', () => {
        cy.get('h1').should('exist');
        cy.get('.example-class').should('exist');
        cy.get('[data-testid="example"]').should('exist');
    });

    it('should verify element count', () => {
        cy.get('p').should('have.length.at.least', 1);
    });

    it('should check element visibility', () => {
        cy.get('h1').should('be.visible');
        cy.get('.hidden-element').should('not.be.visible');
    });

    it('should verify element text', () => {
        cy.get('h1').should('contain', 'Example Domain');
    });

    it('should verify element attributes', () => {
        cy.get('a').should('have.attr', 'href');
        cy.get('[data-testid="button"]').should('have.attr', 'data-testid', 'button');
    });

    // ============================================================================
    // 3. СКЛАДНІ ПЕРЕВІРКИ
    // ============================================================================

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
        cy.contains('More information...').should('exist');
    });

    // ============================================================================
    // 4. ВИКОРИСТАННЯ CY.WRAP() ДЛЯ JAVASCRIPT ОПЕРАЦІЙ
    // ============================================================================

    it('should use cy.wrap() for JavaScript operations', () => {
        cy.window().then((win) => {
            const elements = win.document.querySelectorAll('p');
            cy.wrap(elements).should('have.length.at.least', 1);
        });
    });

    it('should chain JavaScript operations', () => {
        cy.window().then((win) => {
            return win.document.querySelectorAll('a');
        }).then(($links) => {
            cy.wrap($links).should('have.length.at.least', 1);
        });
    });
});

