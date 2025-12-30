# Практичні сценарії - Events

## Сценарій: Тестування обробки подій на реальному сайті

### Опис завдання
Протестувати обробку подій на реальному сайті example.com

### Покрокова інструкція

1. Відкрити https://example.com
2. Відкрити Console (F12)
3. Додати event listener до елемента
4. Симулювати подію або клікнути на елемент
5. Перевірити обробку події

### Приклади коду

#### DevTools Console
```javascript
// Відкрийте https://example.com та виконайте:

// 1. Знайти елемент
const link = document.querySelector('a');
const h1 = document.querySelector('h1');

// 2. Додати event listener
let clickCount = 0;
link.addEventListener('click', (e) => {
    clickCount++;
    console.log(`🔗 Link clicked ${clickCount} times`);
    console.log('Event details:', {
        target: e.target.tagName,
        href: e.target.href,
        preventDefault: e.defaultPrevented
    });
});

h1.addEventListener('click', (e) => {
    console.log('📝 h1 clicked:', e.target.textContent);
});

// 3. Симулювати подію
const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
});
link.dispatchEvent(clickEvent);

// 4. Або просто клікніть на посилання на сторінці
// та подивіться на вивід в консолі
```

#### Cypress
```javascript
it('should test event handling on real website', () => {
    cy.visit('https://example.com');
    
    // Перехоплюємо подію
    cy.window().then((win) => {
        let clickDetected = false;
        win.document.querySelector('a').addEventListener('click', () => {
            clickDetected = true;
        });
        
        // Виконуємо клік
        cy.get('a').first().click().then(() => {
            expect(clickDetected).to.be.true;
        });
    });
});

it('should test event bubbling', () => {
    cy.visit('https://example.com');
    
    cy.window().then((win) => {
        let bodyClickCount = 0;
        win.document.body.addEventListener('click', () => {
            bodyClickCount++;
        });
        
        // Клік на дочірній елемент
        cy.get('h1').click().then(() => {
            // Подія повинна дійти до body (bubbling)
            expect(bodyClickCount).to.be.greaterThan(0);
        });
    });
});
```

