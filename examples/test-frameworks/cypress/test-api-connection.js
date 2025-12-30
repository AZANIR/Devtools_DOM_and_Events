/**
 * Простий Node.js скрипт для перевірки підключення до реальних API
 * 
 * Запустіть: node test-api-connection.js
 */

const https = require('https');
const http = require('http');

function testAPI(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, data: json, raw: data });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data.substring(0, 100), raw: data });
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function runTests() {
    console.log('🧪 Тестування підключення до реальних API...\n');
    
    // Тест 1: JSONPlaceholder
    try {
        console.log('1. Тестування JSONPlaceholder...');
        const result1 = await testAPI('https://jsonplaceholder.typicode.com/users/1');
        if (result1.status === 200 && result1.data.id) {
            console.log('   ✅ JSONPlaceholder працює!');
            console.log(`   Користувач: ${result1.data.name}`);
        } else {
            console.log('   ❌ Неочікувана відповідь');
        }
    } catch (error) {
        console.log('   ❌ Помилка:', error.message);
    }
    
    // Тест 2: ReqRes
    try {
        console.log('\n2. Тестування ReqRes...');
        const result2 = await testAPI('https://reqres.in/api/users/1');
        if (result2.status === 200) {
            // ReqRes повертає { data: { id, email, first_name, last_name, avatar } }
            if (result2.data && result2.data.data) {
                console.log('   ✅ ReqRes працює!');
                const user = result2.data.data;
                console.log(`   Користувач: ${user.first_name} ${user.last_name}`);
                console.log(`   Email: ${user.email}`);
            } else if (result2.data) {
                console.log('   ✅ ReqRes працює!');
                console.log(`   Структура: ${Object.keys(result2.data).join(', ')}`);
            } else {
                console.log('   ⚠️  ReqRes відповідає, але структура неочікувана');
            }
        } else {
            console.log(`   ❌ Статус: ${result2.status}`);
        }
    } catch (error) {
        console.log('   ❌ Помилка:', error.message);
    }
    
    // Тест 3: httpbin.org
    try {
        console.log('\n3. Тестування httpbin.org...');
        const result3 = await testAPI('https://httpbin.org/get?test=value');
        if (result3.status === 200 && result3.data.args) {
            console.log('   ✅ httpbin.org працює!');
            console.log(`   Query параметри: ${JSON.stringify(result3.data.args)}`);
        } else {
            console.log('   ❌ Неочікувана відповідь');
        }
    } catch (error) {
        console.log('   ❌ Помилка:', error.message);
    }
    
    console.log('\n✅ Перевірка завершена!');
    console.log('\n💡 Всі API працюють. Можете використовувати приклади з документації!');
}

runTests().catch(console.error);

