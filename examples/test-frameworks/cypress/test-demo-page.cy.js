/**
 * Тести для демо-сторінки
 * 
 * Ці тести використовують локальну demo-page.html
 * Запустіть локальний сервер або відкрийте файл через file:// протокол
 */

describe('Demo Page Testing', () => {
    // Для локального тестування демо-сторінки
    // Варіант 1: Використовуйте file:// протокол
    // Варіант 2: Запустіть локальний сервер (наприклад, python -m http.server)
    
    it('should test demo page elements', () => {
        // Замініть на шлях до вашого demo-page.html
        cy.visit('file:///Volumes/Transcend/DEV/Hillel/AQA_JavaScript/16/Devtools_DOM_and_Events/examples/demo-page.html');
        
        // Тестуємо селектори
        cy.get('[data-testid="primary-button"]').should('exist');
        cy.get('[data-testid="contact-form"]').should('exist');
        cy.get('[data-testid="click-test"]').should('exist');
    });

    it('should test form submission on demo page', () => {
        cy.visit('file:///Volumes/Transcend/DEV/Hillel/AQA_JavaScript/16/Devtools_DOM_and_Events/examples/demo-page.html');
        
        cy.get('[data-testid="name-field"]').type('Test User');
        cy.get('[data-testid="email-field"]').type('test@example.com');
        cy.get('[data-testid="age-select"]').select('26-35');
        cy.get('[data-testid="submit-button"]').click();
        
        cy.get('[data-testid="form-result"]').should('be.visible');
    });

    it('should test LocalStorage on demo page', () => {
        cy.visit('file:///Volumes/Transcend/DEV/Hillel/AQA_JavaScript/16/Devtools_DOM_and_Events/examples/demo-page.html');
        
        cy.get('[data-testid="save-localstorage"]').click();
        cy.get('[data-testid="storage-result"]').should('contain', 'збережено');
        
        cy.get('[data-testid="load-localstorage"]').click();
        cy.get('[data-testid="storage-result"]').should('contain', 'Дані');
    });
});

