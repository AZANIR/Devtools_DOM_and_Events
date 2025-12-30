# Практичні сценарії - DevTools Elements

## Сценарій: Пошук унікального селектора на реальному сайті

### Опис завдання
Знайти унікальний селектор для елементів на реальному сайті example.com

### Покрокова інструкція

1. Відкрити https://example.com
2. Відкрити Elements панель (F12)
3. Використати "Select element" (Ctrl+Shift+C) для вибору заголовка h1
4. Перевірити різні селектори в Console:
   ```javascript
   // Тестуємо різні селектори
   document.querySelector('h1');
   document.querySelectorAll('h1');
   document.querySelector('body > h1');
   ```
5. Вибрати найбільш стабільний селектор

### Приклади коду

#### DevTools Console
```javascript
// Відкрийте https://example.com та виконайте:

// Тестування селекторів
const h1 = document.querySelector('h1');
console.log('h1 found:', h1);
console.log('h1 text:', h1?.textContent);

// Перевірка унікальності
const allH1 = document.querySelectorAll('h1');
console.log('h1 count:', allH1.length); // Має бути 1

// Тестування посилань
const links = document.querySelectorAll('a');
console.log('Links:', links.length);
links.forEach((link, i) => {
    console.log(`Link ${i + 1}:`, link.href);
});
```

#### Cypress
```javascript
it('should find unique selector on real website', () => {
    cy.visit('https://example.com');
    
    // Перевіряємо, що селектор знаходить тільки один елемент
    cy.get('h1').should('have.length', 1);
    cy.get('h1').should('contain', 'Example Domain');
});
```

