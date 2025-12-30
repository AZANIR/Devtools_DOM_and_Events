# Практичні сценарії тестування - DevTools Console

## Сценарій 1: Тестування селекторів перед написанням тестів

### Опис завдання
Перевірити, що селектор правильно знаходить елемент перед використанням його в автоматизованих тестах.

### Покрокова інструкція
1. Відкрити DevTools Console
2. Виконати команду для пошуку елемента
3. Перевірити результат
4. Протестувати селектор на різних сторінках

### Приклади коду

#### DevTools Console
```javascript
// Тестування селекторів на реальному сайті (example.com)
// 1. Відкрийте https://example.com
// 2. Натисніть F12 → Console
// 3. Виконайте код:

// Тестування селекторів
const h1 = document.querySelector('h1');
console.log('h1 found:', h1);
console.log('h1 text:', h1?.textContent);
console.log('h1 visible:', h1 && h1.offsetParent !== null);

// Тестування всіх параграфів
const paragraphs = document.querySelectorAll('p');
console.log('Paragraphs count:', paragraphs.length);
paragraphs.forEach((p, i) => {
    console.log(`Paragraph ${i + 1}:`, p.textContent.substring(0, 50));
});

// Тестування посилань
const links = document.querySelectorAll('a');
console.log('Links count:', links.length);
links.forEach((link, i) => {
    console.log(`Link ${i + 1}:`, link.href);
});
```

#### Cypress
```javascript
it('should find elements on real website (example.com)', () => {
    cy.visit('https://example.com');
    
    // Перевіряємо реальні елементи на example.com
    cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain', 'Example Domain');
    
    cy.get('p')
        .should('exist')
        .and('have.length.at.least', 1);
    
    cy.get('a')
        .should('exist')
        .and('have.attr', 'href');
});
```

