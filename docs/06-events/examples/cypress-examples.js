/**
 * Events - Приклади для Cypress
 * 
 * ВИКОРИСТОВУЄТЬСЯ РЕАЛЬНИЙ САЙТ: example.com
 */

describe('Events Testing on Real Website', () => {
    beforeEach(() => {
        cy.visit('https://example.com');
    });
    
    it('should trigger click event on real elements', () => {
        // Клік на посилання
        cy.get('a').first().click();
        
        // Перевіряємо, що перехід відбувся (або перевіряємо URL)
        cy.url().should('not.eq', 'https://example.com/');
    });
    
    it('should verify click events are triggered', () => {
        // Перехоплюємо подію через window
        cy.window().then((win) => {
            let clickDetected = false;
            win.document.addEventListener('click', () => {
                clickDetected = true;
            });
            
            // Виконуємо клік
            cy.get('a').first().click().then(() => {
                expect(clickDetected).to.be.true;
            });
        });
    });
    
    it('should test event bubbling', () => {
        // Перевіряємо, що події поширюються
        cy.window().then((win) => {
            let bodyClickDetected = false;
            win.document.body.addEventListener('click', () => {
                bodyClickDetected = true;
            });
            
            // Клік на дочірній елемент
            cy.get('h1').click().then(() => {
                // Подія повинна дійти до body (bubbling)
                expect(bodyClickDetected).to.be.true;
            });
        });
    });
});

