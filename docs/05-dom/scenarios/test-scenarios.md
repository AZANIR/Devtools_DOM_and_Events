# Практичні сценарії - DOM

## Сценарій: Додавання та видалення елементів на реальному сайті

### Опис завдання

Додати та видалити елементи на реальному сайті example.com

### Покрокова інструкція

1. Відкрити https://example.com
2. Відкрити Console (F12)
3. Виконати код для додавання елемента
4. Перевірити наявність елемента на сторінці
5. Видалити елемент

### Приклади коду

#### DevTools Console

```javascript
// Відкрийте https://example.com та виконайте:

// 1. Знайти батьківський елемент
const body = document.body;
console.log('Body found:', body);

// 2. Створити новий елемент
const newDiv = document.createElement('div');
newDiv.textContent = 'New element created via Console';
newDiv.style.cssText = 'padding: 20px; background: #e0e0e0; margin: 20px 0; border: 2px solid #333;';
newDiv.setAttribute('data-testid', 'console-test');

// 3. Додати до DOM
body.appendChild(newDiv);
console.log('✅ Element added');

// 4. Перевірити наявність
const addedElement = document.querySelector('[data-testid="console-test"]');
console.log('Element found:', addedElement);

// 5. Видалити елемент
// newDiv.remove();
// або
// addedElement?.remove();
```

#### Cypress

```javascript
it('should add and remove elements on real website', () => {
    cy.visit('https://example.com');
    
    // Додаємо елемент
    cy.get('body').then(($body) => {
        const newDiv = document.createElement('div');
        newDiv.textContent = 'Test element';
        newDiv.setAttribute('data-testid', 'cypress-test');
        $body[0].appendChild(newDiv);
    });
    
    // Перевіряємо наявність
    cy.get('[data-testid="cypress-test"]').should('exist');
    
    // Видаляємо елемент
    cy.get('[data-testid="cypress-test"]').then(($el) => {
        $el[0].remove();
    });
    
    // Перевіряємо видалення
    cy.get('[data-testid="cypress-test"]').should('not.exist');
});
```
