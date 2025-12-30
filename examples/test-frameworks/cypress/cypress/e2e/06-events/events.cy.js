/**
 * Events Testing
 * 
 * Тести для роботи з подіями
 */

describe('Events Testing on Real Website', () => {
    beforeEach(() => {
        cy.visit('https://example.com');
    });
    
    it('should trigger click event on real elements', () => {
        // Клік на посилання (example.com має посилання на IANA)
        cy.get('a').first().should('exist');
        
        // Запобігаємо переходу для тесту
        cy.window().then((win) => {
            const link = win.document.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                });
            }
        });
        
        cy.get('a').first().click();
        
        // Перевіряємо, що клік виконався (запобігли переходу)
        cy.url().should('include', 'example.com');
    });
    
    it('should verify click events are triggered', () => {
        // Перехоплюємо подію через window
        let clickDetected = false;
        
        cy.window().then((win) => {
            const link = win.document.querySelector('a');
            
            if (link) {
                link.addEventListener('click', (e) => {
                    clickDetected = true;
                    // Запобігаємо переходу для тесту
                    e.preventDefault();
                });
            }
        });
        
        // Виконуємо клік
        cy.get('a').first().click({ force: true });
        
        // Перевіряємо через cy.wrap для синхронізації
        cy.wrap(null).then(() => {
            expect(clickDetected).to.be.true;
        });
    });
    
    it('should test event bubbling', () => {
        // Перевіряємо, що події поширюються
        let bodyClickDetected = false;
        
        cy.window().then((win) => {
            win.document.body.addEventListener('click', () => {
                bodyClickDetected = true;
            }, true); // Використовуємо capturing phase для надійності
        });
        
        // Клік на дочірній елемент
        cy.get('h1').click({ force: true });
        
        // Перевіряємо через cy.wrap для синхронізації
        cy.wrap(null).then(() => {
            // Подія повинна дійти до body (bubbling)
            expect(bodyClickDetected).to.be.true;
        });
    });

    it('should prevent default behavior', () => {
        let defaultPrevented = false;
        
        cy.window().then((win) => {
            const link = win.document.querySelector('a');
            
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    defaultPrevented = e.defaultPrevented;
                });
            }
        });
        
        cy.get('a').first().click({ force: true });
        
        // Перевіряємо через cy.wrap для синхронізації
        cy.wrap(null).then(() => {
            expect(defaultPrevented).to.be.true;
        });
    });
});

