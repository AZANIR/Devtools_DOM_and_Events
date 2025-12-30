/**
 * DevTools Console - Приклади для Console
 * 
 * Ці приклади можна копіювати та виконувати безпосередньо в DevTools Console
 * для тестування селекторів, налагодження та взаємодії з DOM.
 * 
 * ВИКОРИСТОВУЮТЬСЯ РЕАЛЬНІ САЙТИ:
 * - example.com - для базових тестів
 * - jsonplaceholder.typicode.com - для тестів з API
 * 
 * ІНСТРУКЦІЯ: Відкрийте https://example.com, натисніть F12, перейдіть на Console
 * та скопіюйте/виконайте приклади нижче.
 */

// ============================================================================
// 1. ВИКОНАННЯ JAVASCRIPT КОМАНД
// ============================================================================

/**
 * Базові операції з консоллю
 */
console.log('Hello from Console!');
console.log('Current URL:', window.location.href);
console.log('User Agent:', navigator.userAgent);

/**
 * Виконання багаторядкового коду
 * Натисніть Shift+Enter для нового рядка
 */
const user = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
};
console.log('User object:', user);

/**
 * Використання стрілочних функцій
 */
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled numbers:', doubled);

// ============================================================================
// 2. ВИВІД ІНФОРМАЦІЇ ДЛЯ НАЛАГОДЖЕННЯ
// ============================================================================

/**
 * Різні типи виводу
 */
console.log('Regular log message');
console.info('Info message');
console.warn('Warning message');
console.error('Error message');

/**
 * Вивід у вигляді таблиці
 */
const users = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
    { id: 3, name: 'Bob', email: 'bob@example.com' }
];
console.table(users);

/**
 * Групування виводу
 */
console.group('User Details');
console.log('Name: John Doe');
console.log('Email: john@example.com');
console.log('Age: 30');
console.groupEnd();

/**
 * Умовний вивід
 */
const value = 10;
console.assert(value > 5, 'Value should be greater than 5');
console.assert(value > 20, 'Value should be greater than 20'); // Помилка

/**
 * Вимірювання часу виконання
 */
console.time('Array operation');
const largeArray = Array.from({ length: 1000000 }, (_, i) => i);
const sum = largeArray.reduce((a, b) => a + b, 0);
console.timeEnd('Array operation');

/**
 * Stack trace
 */
function functionA() {
    functionB();
}

function functionB() {
    functionC();
}

function functionC() {
    console.trace('Call stack trace');
}

// functionA(); // Розкоментуйте для виклику

// ============================================================================
// 3. ТЕСТУВАННЯ СЕЛЕКТОРІВ ТА DOM ЕЛЕМЕНТІВ
// ============================================================================

/**
 * Пошук елементів за різними селекторами
 */
// За ID
const elementById = document.getElementById('myId');
console.log('Element by ID:', elementById);

// За CSS селектором (перший елемент)
const elementBySelector = document.querySelector('.my-class');
console.log('Element by selector:', elementBySelector);

// За CSS селектором (всі елементи)
const elementsBySelector = document.querySelectorAll('.my-class');
console.log('Elements by selector:', elementsBySelector);
console.log('Count:', elementsBySelector.length);

// За атрибутом
const elementByAttribute = document.querySelector('[data-testid="submit"]');
console.log('Element by attribute:', elementByAttribute);

/**
 * Перевірка наявності елемента
 */
function elementExists(selector) {
    const element = document.querySelector(selector);
    if (element) {
        console.log(`✅ Element found: ${selector}`);
        return true;
    } else {
        console.log(`❌ Element not found: ${selector}`);
        return false;
    }
}

// Використання
// elementExists('.my-class');
// elementExists('#my-id');
// elementExists('[data-testid="button"]');

/**
 * Отримання тексту елемента
 */
function getElementText(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const text = element.textContent.trim();
        console.log(`Text from ${selector}:`, text);
        return text;
    }
    return null;
}

/**
 * Отримання атрибутів елемента
 */
function getElementAttributes(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const attributes = {};
        Array.from(element.attributes).forEach(attr => {
            attributes[attr.name] = attr.value;
        });
        console.table(attributes);
        return attributes;
    }
    return null;
}

/**
 * Перевірка стилів елемента
 */
function getElementStyles(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const styles = window.getComputedStyle(element);
        console.log('Element styles:', {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            width: styles.width,
            height: styles.height,
            color: styles.color,
            backgroundColor: styles.backgroundColor
        });
        return styles;
    }
    return null;
}

/**
 * Перевірка видимості елемента
 */
function isElementVisible(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.log(`❌ Element not found: ${selector}`);
        return false;
    }
    
    const styles = window.getComputedStyle(element);
    const isVisible = styles.display !== 'none' && 
                     styles.visibility !== 'hidden' && 
                     styles.opacity !== '0' &&
                     element.offsetWidth > 0 &&
                     element.offsetHeight > 0;
    
    console.log(`Element ${selector} is ${isVisible ? 'visible' : 'hidden'}`);
    return isVisible;
}

/**
 * Перевірка, чи елемент в viewport
 */
function isElementInViewport(selector) {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const inViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    console.log(`Element ${selector} is ${inViewport ? 'in' : 'not in'} viewport`);
    return inViewport;
}

/**
 * Знаходження всіх елементів з певним текстом
 */
function findElementsByText(text) {
    const allElements = document.querySelectorAll('*');
    const matchingElements = [];
    
    allElements.forEach(element => {
        if (element.textContent.includes(text)) {
            matchingElements.push({
                tag: element.tagName,
                text: element.textContent.trim().substring(0, 50),
                selector: getSelector(element)
            });
        }
    });
    
    console.table(matchingElements);
    return matchingElements;
}

/**
 * Генерація унікального селектора для елемента
 */
function getSelector(element) {
    if (element.id) {
        return `#${element.id}`;
    }
    
    if (element.className) {
        const classes = element.className.split(' ').filter(c => c);
        if (classes.length > 0) {
            return `.${classes.join('.')}`;
        }
    }
    
    if (element.getAttribute('data-testid')) {
        return `[data-testid="${element.getAttribute('data-testid')}"]`;
    }
    
    // Генерація шляху через батьківські елементи
    const path = [];
    let current = element;
    
    while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();
        if (current.id) {
            selector += `#${current.id}`;
            path.unshift(selector);
            break;
        }
        if (current.className) {
            const classes = current.className.split(' ').filter(c => c);
            if (classes.length > 0) {
                selector += `.${classes[0]}`;
            }
        }
        const siblings = Array.from(current.parentElement.children);
        const index = siblings.indexOf(current);
        if (index > 0) {
            selector += `:nth-child(${index + 1})`;
        }
        path.unshift(selector);
        current = current.parentElement;
    }
    
    return path.join(' > ');
}

// ============================================================================
// 4. КОРИСНІ ФУНКЦІЇ-ПОМІЧНИКИ
// ============================================================================

/**
 * Універсальна функція для тестування селектора
 */
function testSelector(selector) {
    console.group(`Testing selector: ${selector}`);
    
    const elements = document.querySelectorAll(selector);
    console.log(`Found ${elements.length} element(s)`);
    
    if (elements.length === 0) {
        console.warn('⚠️ No elements found');
        console.groupEnd();
        return null;
    }
    
    if (elements.length > 1) {
        console.warn(`⚠️ Multiple elements found (${elements.length})`);
    }
    
    elements.forEach((element, index) => {
        console.group(`Element ${index + 1}`);
        console.log('Tag:', element.tagName);
        console.log('Text:', element.textContent.trim().substring(0, 100));
        console.log('Attributes:', Array.from(element.attributes).map(a => `${a.name}="${a.value}"`).join(', '));
        console.log('Visible:', isElementVisible(selector));
        console.groupEnd();
    });
    
    console.groupEnd();
    return elements.length === 1 ? elements[0] : elements;
}

/**
 * Моніторинг змін DOM
 */
function monitorDOMChanges(selector, callback) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                console.log('DOM changed:', mutation);
                if (callback) callback(mutation);
            }
        });
    });
    
    const target = document.querySelector(selector) || document.body;
    observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true
    });
    
    console.log(`✅ Monitoring DOM changes for: ${selector}`);
    return observer;
}

/**
 * Очікування появи елемента
 */
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`✅ Element found: ${selector}`);
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                console.error(`❌ Timeout waiting for: ${selector}`);
                reject(new Error(`Timeout waiting for ${selector}`));
            } else {
                setTimeout(checkElement, 100);
            }
        };
        
        checkElement();
    });
}

// Використання:
// waitForElement('.my-class').then(element => {
//     console.log('Element is ready:', element);
// });

// Експортуємо корисні функції
window.consoleUtils = {
    elementExists,
    getElementText,
    getElementAttributes,
    getElementStyles,
    isElementVisible,
    isElementInViewport,
    findElementsByText,
    getSelector,
    testSelector,
    monitorDOMChanges,
    waitForElement
};

console.log('✅ Console utilities loaded. Use window.consoleUtils for access.');

// ============================================================================
// ПРИКЛАДИ ВИКОРИСТАННЯ НА РЕАЛЬНОМУ САЙТІ (example.com)
// ============================================================================

/**
 * ПРИКЛАД 1: Тестування селекторів на example.com
 * 
 * 1. Відкрийте https://example.com
 * 2. Натисніть F12 → Console
 * 3. Виконайте:
 */
function example1_TestSelectors() {
    console.log('🔍 Тестування селекторів на example.com...');
    
    // Тестуємо різні селектори
    testSelector('h1');
    testSelector('p');
    testSelector('a');
    
    // Перевіряємо наявність елементів
    console.log('h1 exists:', elementExists('h1'));
    console.log('p exists:', elementExists('p'));
    
    // Отримуємо текст
    console.log('h1 text:', getElementText('h1'));
}

/**
 * ПРИКЛАД 2: Перевірка видимості елементів
 * 
 * Виконайте на example.com:
 */
function example2_CheckVisibility() {
    console.log('👁️ Перевірка видимості елементів...');
    
    isElementVisible('h1');
    isElementVisible('p');
    isElementInViewport('h1');
}

/**
 * ПРИКЛАД 3: Пошук елементів за текстом
 * 
 * Виконайте на example.com:
 */
function example3_FindByText() {
    console.log('🔎 Пошук елементів за текстом...');
    
    findElementsByText('Example Domain');
    findElementsByText('More information');
}

// Експортуємо приклади
window.consoleExamples = {
    testSelectors: example1_TestSelectors,
    checkVisibility: example2_CheckVisibility,
    findByText: example3_FindByText
};

console.log('✅ Приклади завантажено!');
console.log('Відкрийте https://example.com та використайте:');
console.log('  - consoleExamples.testSelectors()');
console.log('  - consoleExamples.checkVisibility()');
console.log('  - consoleExamples.findByText()');

