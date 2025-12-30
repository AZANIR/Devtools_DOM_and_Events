/**
 * Events - Приклади для Console
 * 
 * ВИКОРИСТОВУЄТЬСЯ РЕАЛЬНИЙ САЙТ: example.com
 * 
 * ІНСТРУКЦІЯ: 
 * 1. Відкрийте https://example.com
 * 2. Натисніть F12 → Console
 * 3. Скопіюйте та виконайте приклади нижче
 */

console.log('🎯 Events приклади на example.com...');

// ============================================================================
// 1. ДОДАВАННЯ EVENT LISTENER
// ============================================================================

// Додавання listener до посилання
const link = document.querySelector('a');
if (link) {
    link.addEventListener('click', (e) => {
        console.log('🔗 Link clicked:', e.target.href);
        // e.preventDefault(); // Розкоментуйте, щоб запобігти переходу
    });
    console.log('✅ Click listener added to link');
}

// Додавання listener до заголовка
const h1 = document.querySelector('h1');
if (h1) {
    h1.addEventListener('click', (e) => {
        console.log('📝 h1 clicked:', e.target.textContent);
    });
    console.log('✅ Click listener added to h1');
}

// ============================================================================
// 2. СИМУЛЯЦІЯ ПОДІЙ
// ============================================================================

// Симуляція кліку на посилання
function simulateLinkClick() {
    if (link) {
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        link.dispatchEvent(clickEvent);
        console.log('✅ Click event simulated');
    }
}

// Симуляція події на h1
function simulateH1Click() {
    if (h1) {
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        });
        h1.dispatchEvent(clickEvent);
        console.log('✅ h1 click event simulated');
    }
}

// ============================================================================
// 3. ВІДСТЕЖЕННЯ ВСІХ ПОДІЙ
// ============================================================================

// Відстеження всіх кліків на сторінці
document.addEventListener('click', (e) => {
    console.log('🖱️ Click event detected:', {
        target: e.target.tagName,
        text: e.target.textContent?.substring(0, 50),
        href: e.target.href || 'N/A'
    });
}, true); // true для capturing phase

console.log('✅ Global click listener activated');

// Відстеження подій клавіатури
document.addEventListener('keydown', (e) => {
    console.log('⌨️ Key pressed:', e.key);
});

// ============================================================================
// 4. ПРИКЛАДИ ВИКОРИСТАННЯ
// ============================================================================

// Експортуємо функції для легкого доступу
window.eventExamples = {
    simulateLinkClick,
    simulateH1Click
};

console.log('✅ Events приклади завантажено!');
console.log('Використайте:');
console.log('  - eventExamples.simulateLinkClick()');
console.log('  - eventExamples.simulateH1Click()');
console.log('  - Клікніть на будь-який елемент на сторінці для тестування');

