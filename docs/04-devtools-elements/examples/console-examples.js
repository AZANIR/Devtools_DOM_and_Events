/**
 * DevTools Elements - Приклади для Console
 * 
 * ВИКОРИСТОВУЄТЬСЯ РЕАЛЬНИЙ САЙТ: example.com
 * 
 * ІНСТРУКЦІЯ: 
 * 1. Відкрийте https://example.com
 * 2. Натисніть F12 → Console
 * 3. Скопіюйте та виконайте приклади нижче
 */

// ============================================================================
// ПРИКЛАДИ ПОШУКУ ЕЛЕМЕНТІВ НА РЕАЛЬНОМУ САЙТІ
// ============================================================================

// Пошук елементів за різними селекторами на example.com
console.log('🔍 Пошук елементів на example.com...');

// Пошук за тегом
const h1 = document.querySelector('h1');
console.log('h1 element:', h1);
console.log('h1 text:', h1?.textContent);

// Пошук за класом (якщо є)
const paragraphs = document.querySelectorAll('p');
console.log('Paragraphs found:', paragraphs.length);

// Пошук посилань
const links = document.querySelectorAll('a');
console.log('Links found:', links.length);
links.forEach((link, i) => {
    console.log(`Link ${i + 1}:`, link.href);
});

// Копіювання селектора елемента
function getSelector(element) {
    if (!element) return null;
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    if (element.getAttribute('data-testid')) return `[data-testid="${element.getAttribute('data-testid')}"]`;
    return element.tagName.toLowerCase();
}

// Приклад використання
if (h1) {
    console.log('Selector for h1:', getSelector(h1));
}

// Пошук за XPath (якщо потрібно)
function findByXPath(xpath) {
    const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    return result.singleNodeValue;
}

// Приклад XPath пошуку
const h1ByXPath = findByXPath('//h1');
console.log('h1 by XPath:', h1ByXPath);

console.log('✅ Приклади виконано! Перевірте результати вище.');

