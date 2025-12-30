/**
 * Скрипт для перевірки прикладів коду
 * 
 * Цей скрипт перевіряє, чи всі приклади мають правильний синтаксис
 * та чи використовують реальні API
 */

const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '../../../docs');
const realAPIs = [
    'jsonplaceholder.typicode.com',
    'reqres.in',
    'httpbin.org',
    'example.com'
];

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Перевірка наявності реальних API
    const hasRealAPI = realAPIs.some(api => content.includes(api));
    
    if (!hasRealAPI && (filePath.includes('network') || filePath.includes('application'))) {
        issues.push('⚠️  Можливо відсутні посилання на реальні API');
    }
    
    // Перевірка синтаксису (базова)
    try {
        // Для console-examples.js - перевіряємо базовий синтаксис
        if (filePath.endsWith('.js') && !filePath.includes('cypress')) {
            // Простий перевірка на закриті дужки
            const openBraces = (content.match(/\{/g) || []).length;
            const closeBraces = (content.match(/\}/g) || []).length;
            if (openBraces !== closeBraces) {
                issues.push('❌ Неспівпадіння фігурних дужок');
            }
        }
    } catch (error) {
        issues.push(`❌ Помилка перевірки: ${error.message}`);
    }
    
    return issues;
}

function scanDirectory(dir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files.push(...scanDirectory(fullPath));
        } else if (item.isFile() && item.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

console.log('🔍 Перевірка прикладів коду...\n');

const exampleFiles = scanDirectory(path.join(docsPath, '01-devtools-network/examples'))
    .concat(scanDirectory(path.join(docsPath, '02-devtools-application/examples')))
    .concat(scanDirectory(path.join(docsPath, '03-devtools-console/examples')));

let totalIssues = 0;

exampleFiles.forEach(file => {
    const issues = checkFile(file);
    if (issues.length > 0) {
        console.log(`📄 ${path.basename(file)}:`);
        issues.forEach(issue => console.log(`   ${issue}`));
        totalIssues += issues.length;
    }
});

if (totalIssues === 0) {
    console.log('✅ Всі приклади перевірено успішно!');
} else {
    console.log(`\n⚠️  Знайдено ${totalIssues} потенційних проблем`);
}

console.log(`\n📊 Перевірено файлів: ${exampleFiles.length}`);

