/**
 * DOM - Приклади для Console
 * 
 * ВИКОРИСТОВУЄТЬСЯ РЕАЛЬНИЙ САЙТ: example.com
 * 
 * ІНСТРУКЦІЯ: 
 * 1. Відкрийте https://example.com
 * 2. Натисніть F12 → Console
 * 3. Скопіюйте та виконайте приклади нижче
 */

console.log('🔍 DOM приклади на example.com...');

// ============================================================================
// 1. ПОШУК ЕЛЕМЕНТІВ
// ============================================================================

// Пошук за селектором
const h1 = document.querySelector('h1');
console.log('h1 found:', h1);
console.log('h1 text:', h1?.textContent);

// Пошук всіх елементів
const paragraphs = document.querySelectorAll('p');
console.log('Paragraphs count:', paragraphs.length);

// Пошук посилань
const links = document.querySelectorAll('a');
console.log('Links count:', links.length);

// ============================================================================
// 2. МАНІПУЛЯЦІЯ DOM
// ============================================================================

// Створення нового елемента
const newElement = document.createElement('div');
newElement.textContent = 'New element created via Console';
newElement.style.cssText = 'padding: 10px; background: #f0f0f0; margin: 10px 0;';
document.body.appendChild(newElement);
console.log('✅ New element added to page');

// Видалення елемента (якщо потрібно)
// newElement.remove();

// ============================================================================
// 3. РОБОТА З АТРИБУТАМИ
// ============================================================================


// Отримання атрибутів
if (h1) {
    console.log('h1 attributes:', Array.from(h1.attributes).map(a => `${a.name}="${a.value}"`));
}

// Встановлення атрибута
if (h1) {
    h1.setAttribute('data-test', 'console-test');
    console.log('✅ Attribute set:', h1.getAttribute('data-test'));
}

// Перевірка наявності атрибута
const linksArr = document.querySelectorAll('a');
if (linksArr.length > 0) {
    const firstLink = linksArr[0];
    console.log('First link href:', firstLink.getAttribute('href'));
    console.log('Has href:', firstLink.hasAttribute('href'));
}

console.log('✅ DOM приклади виконано!');

