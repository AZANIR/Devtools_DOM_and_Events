/**
 * DevTools Network - Приклади для Console
 * 
 * Ці приклади можна копіювати та виконувати безпосередньо в DevTools Console
 * для аналізу мережевої активності веб-додатку.
 * 
 * ВИКОРИСТОВУЮТЬСЯ РЕАЛЬНІ API:
 * - JSONPlaceholder: https://jsonplaceholder.typicode.com/
 * - ReqRes: https://reqres.in/api/
 * - httpbin.org: https://httpbin.org/
 */

// ============================================================================
// ПРИКЛАД ВИКОРИСТАННЯ: Спочатку активуйте перехоплювач, потім виконайте запит
// ============================================================================
// 1. Скопіюйте та виконайте код перехоплювача (наприклад, перший приклад нижче)
// 2. Потім виконайте реальний запит:
//    fetch('https://jsonplaceholder.typicode.com/users/1')
//      .then(r => r.json())
//      .then(console.log)
// ============================================================================

// ============================================================================
// 1. ВІДСТЕЖЕННЯ XHR/FETCH ЗАПИТІВ
// ============================================================================

/**
 * Перехоплення всіх Fetch запитів та вивід їх у консоль
 * Корисно для швидкого аналізу всіх API викликів
 */
(function() {
    // Зберігаємо оригінальний fetch
    const originalFetch = window.fetch;
    
    // Перевизначаємо fetch для перехоплення
    window.fetch = function(...args) {
        console.group('🌐 Fetch Request');
        console.log('URL:', args[0]);
        console.log('Options:', args[1] || {});
        console.trace('Stack trace');
        console.groupEnd();
        
        // Викликаємо оригінальний fetch
        return originalFetch.apply(this, args)
            .then(response => {
                console.log('✅ Response:', response.url, response.status);
                return response;
            })
            .catch(error => {
                console.error('❌ Fetch Error:', error);
                throw error;
            });
    };
    
    console.log('✅ Fetch interceptor активовано');
})();

/**
 * Перехоплення всіх XMLHttpRequest запитів
 * Дозволяє відстежувати старіші методи AJAX запитів
 */
(function() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._method = method;
        this._url = url;
        console.log(`📡 XHR ${method}:`, url);
        return originalOpen.apply(this, [method, url, ...rest]);
    };
    
    XMLHttpRequest.prototype.send = function(data) {
        if (data) {
            console.log('📦 XHR Payload:', data);
        }
        
        this.addEventListener('load', function() {
            console.log(`✅ XHR Response [${this.status}]:`, this._url);
            console.log('Response:', this.responseText);
        });
        
        this.addEventListener('error', function() {
            console.error(`❌ XHR Error:`, this._url);
        });
        
        return originalSend.apply(this, arguments);
    };
    
    console.log('✅ XHR interceptor активовано');
})();

// ============================================================================
// 2. АНАЛІЗ ПАРАМЕТРІВ ЗАПИТІВ ТА ВІДПОВІДЕЙ
// ============================================================================

/**
 * Аналіз всіх POST запитів з виводом payload та response
 * Корисно для перевірки даних, що відправляються на сервер
 */
(function() {
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};
        
        // Перевіряємо, чи це POST запит
        if (options.method === 'POST' || options.method === 'PUT') {
            console.group(`📤 ${options.method} Request to:`, url);
            console.log('Headers:', options.headers);
            console.log('Body:', options.body);
            
            return originalFetch.apply(this, args)
                .then(async response => {
                    const responseData = await response.clone().json().catch(() => response.clone().text());
                    console.log('📥 Response Status:', response.status);
                    console.log('📥 Response Data:', responseData);
                    console.groupEnd();
                    return response;
                });
        }
        
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ POST/PUT analyzer активовано');
})();

/**
 * Збір статистики по всіх запитах
 * Підраховує кількість запитів, помилок, загальний розмір даних
 */
(function() {
    const stats = {
        total: 0,
        success: 0,
        errors: 0,
        totalSize: 0,
        requests: []
    };
    
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        stats.total++;
        const startTime = performance.now();
        const url = args[0];
        
        return originalFetch.apply(this, args)
            .then(async response => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                const contentLength = response.headers.get('content-length');
                const size = contentLength ? parseInt(contentLength) : 0;
                
                stats.totalSize += size;
                stats.requests.push({
                    url,
                    status: response.status,
                    duration: duration.toFixed(2) + 'ms',
                    size: size
                });
                
                if (response.ok) {
                    stats.success++;
                } else {
                    stats.errors++;
                }
                
                return response;
            })
            .catch(error => {
                stats.errors++;
                console.error('Request failed:', url, error);
                throw error;
            });
    };
    
    // Функція для виведення статистики
    window.getNetworkStats = function() {
        console.table(stats.requests);
        console.log('📊 Network Statistics:');
        console.log('Total requests:', stats.total);
        console.log('Successful:', stats.success);
        console.log('Errors:', stats.errors);
        console.log('Total size:', (stats.totalSize / 1024).toFixed(2) + ' KB');
        return stats;
    };
    
    console.log('✅ Network statistics collector активовано');
    console.log('Використайте getNetworkStats() для перегляду статистики');
})();

// ============================================================================
// 3. ВИМІРЮВАННЯ ЧАСУ ЗАВАНТАЖЕННЯ
// ============================================================================

/**
 * Вимірювання часу виконання кожного запиту
 * Виводить детальну інформацію про продуктивність
 */
(function() {
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const url = args[0];
        const startTime = performance.now();
        
        return originalFetch.apply(this, args)
            .then(response => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                console.log(`⏱️ ${url}`);
                console.log(`   Duration: ${duration.toFixed(2)}ms`);
                console.log(`   Status: ${response.status}`);
                
                // Попередження про повільні запити
                if (duration > 1000) {
                    console.warn(`⚠️ Slow request detected: ${duration.toFixed(2)}ms`);
                }
                
                return response;
            });
    };
    
    console.log('✅ Performance monitor активовано');
})();

/**
 * Вимірювання загального часу завантаження сторінки
 * Включає всі ресурси та API запити
 */
(function() {
    const pageLoadStart = performance.now();
    const resourceTimings = [];
    
    // Відстежуємо завантаження ресурсів
    window.addEventListener('load', function() {
        const pageLoadEnd = performance.now();
        const totalLoadTime = pageLoadEnd - pageLoadStart;
        
        // Отримуємо timing інформацію про всі ресурси
        const resources = performance.getEntriesByType('resource');
        
        resources.forEach(resource => {
            resourceTimings.push({
                name: resource.name,
                duration: resource.duration.toFixed(2) + 'ms',
                size: resource.transferSize || 0,
                type: resource.initiatorType
            });
        });
        
        console.log('📊 Page Load Performance:');
        console.log('Total load time:', totalLoadTime.toFixed(2) + 'ms');
        console.table(resourceTimings);
    });
    
    console.log('✅ Page load monitor активовано');
})();

// ============================================================================
// 4. ПЕРЕХОПЛЕННЯ ТА МОДИФІКАЦІЯ ЗАПИТІВ
// ============================================================================

/**
 * Блокування певних запитів
 * Корисно для тестування поведінки додатку при відсутності ресурсів
 */
(function() {
    const blockedUrls = [];
    
    // Додати URL до списку блокування
    window.blockRequest = function(urlPattern) {
        blockedUrls.push(urlPattern);
        console.log('🚫 Blocked URL pattern:', urlPattern);
    };
    
    // Видалити URL зі списку блокування
    window.unblockRequest = function(urlPattern) {
        const index = blockedUrls.indexOf(urlPattern);
        if (index > -1) {
            blockedUrls.splice(index, 1);
            console.log('✅ Unblocked URL pattern:', urlPattern);
        }
    };
    
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const url = args[0];
        
        // Перевіряємо, чи URL має бути заблокований
        const shouldBlock = blockedUrls.some(pattern => {
            if (typeof pattern === 'string') {
                return url.includes(pattern);
            } else if (pattern instanceof RegExp) {
                return pattern.test(url);
            }
            return false;
        });
        
        if (shouldBlock) {
            console.warn('🚫 Request blocked:', url);
            return Promise.reject(new Error('Request blocked by interceptor'));
        }
        
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ Request blocker активовано');
    console.log('Використайте blockRequest("pattern") для блокування запитів');
    console.log('Використайте unblockRequest("pattern") для розблокування');
})();

/**
 * Модифікація заголовків запитів
 * Додає або змінює заголовки перед відправкою
 */
(function() {
    const headerModifications = {};
    
    // Додати або змінити заголовок для всіх запитів
    window.modifyHeader = function(name, value) {
        headerModifications[name] = value;
        console.log(`📝 Header modified: ${name} = ${value}`);
    };
    
    // Видалити модифікацію заголовка
    window.removeHeaderModification = function(name) {
        delete headerModifications[name];
        console.log(`🗑️ Header modification removed: ${name}`);
    };
    
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const options = args[1] || {};
        
        // Застосовуємо модифікації заголовків
        if (!options.headers) {
            options.headers = {};
        }
        
        Object.assign(options.headers, headerModifications);
        args[1] = options;
        
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ Header modifier активовано');
    console.log('Використайте modifyHeader("Header-Name", "value") для модифікації');
})();

/**
 * Мокування відповіді сервера
 * Замінює реальну відповідь на кастомну
 */
(function() {
    const mockedResponses = {};
    
    // Додати мок для URL
    window.mockResponse = function(urlPattern, responseData, status = 200) {
        mockedResponses[urlPattern] = {
            data: responseData,
            status: status
        };
        console.log('🎭 Mock added for:', urlPattern);
    };
    
    // Видалити мок
    window.removeMock = function(urlPattern) {
        delete mockedResponses[urlPattern];
        console.log('🗑️ Mock removed for:', urlPattern);
    };
    
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const url = args[0];
        
        // Перевіряємо, чи є мок для цього URL
        for (const pattern in mockedResponses) {
            if (url.includes(pattern) || new RegExp(pattern).test(url)) {
                const mock = mockedResponses[pattern];
                console.log('🎭 Using mocked response for:', url);
                
                return Promise.resolve(new Response(
                    JSON.stringify(mock.data),
                    {
                        status: mock.status,
                        headers: { 'Content-Type': 'application/json' }
                    }
                ));
            }
        }
        
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ Response mocker активовано');
    console.log('Використайте mockResponse("url", data, status) для мокування');
})();

// ============================================================================
// 5. ПРИКЛАДИ ВИКОРИСТАННЯ З РЕАЛЬНИМИ API
// ============================================================================

/**
 * ПРИКЛАД 1: Відстеження запитів до JSONPlaceholder API
 * 
 * 1. Спочатку активуйте перехоплювач (виконайте код вище)
 * 2. Потім виконайте цей код:
 */
function example1_TrackJSONPlaceholder() {
    console.log('📡 Відстеження запитів до JSONPlaceholder...');
    
    // Виконуємо реальний запит
    fetch('https://jsonplaceholder.typicode.com/users/1')
        .then(response => response.json())
        .then(data => {
            console.log('✅ Отримано дані користувача:', data);
        })
        .catch(error => {
            console.error('❌ Помилка:', error);
        });
}

/**
 * ПРИКЛАД 2: Аналіз POST запиту до реального API
 * 
 * Виконайте цей код після активації перехоплювачів:
 */
function example2_PostToRealAPI() {
    console.log('📤 Відправка POST запиту...');
    
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'Test Post',
            body: 'This is a test post',
            userId: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Пост створено:', data);
    })
    .catch(error => {
        console.error('❌ Помилка:', error);
    });
}

/**
 * ПРИКЛАД 3: Вимірювання часу завантаження
 * 
 * Виконайте цей код для вимірювання часу:
 */
function example3_MeasureLoadTime() {
    console.log('⏱️ Вимірювання часу завантаження...');
    
    const startTime = performance.now();
    
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            console.log(`✅ Завантажено ${data.length} постів за ${duration.toFixed(2)}ms`);
        });
}

/**
 * ПРИКЛАД 4: Тестування з ReqRes API
 * 
 * Виконайте цей код для тестування з іншим API:
 */
function example4_ReqResAPI() {
    console.log('📡 Тестування ReqRes API...');
    
    // Отримання списку користувачів
    fetch('https://reqres.in/api/users?page=1')
        .then(response => response.json())
        .then(data => {
            console.log('✅ Користувачі з ReqRes:', data);
        });
    
    // Логін (симуляція)
    fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'eve.holt@reqres.in',
            password: 'cityslicka'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Логін успішний, токен:', data.token);
    });
}

/**
 * ПРИКЛАД 5: Тестування з httpbin.org
 * 
 * Виконайте цей код для тестування різних HTTP методів:
 */
function example5_HttpBin() {
    console.log('📡 Тестування httpbin.org...');
    
    // GET запит
    fetch('https://httpbin.org/get?test=value&page=1')
        .then(response => response.json())
        .then(data => {
            console.log('✅ GET запит:', data.args);
        });
    
    // POST запит
    fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: 'data' })
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ POST запит:', JSON.parse(data.data));
    });
}

// Експортуємо приклади для легкого доступу
window.networkExamples = {
    trackJSONPlaceholder: example1_TrackJSONPlaceholder,
    postToRealAPI: example2_PostToRealAPI,
    measureLoadTime: example3_MeasureLoadTime,
    reqResAPI: example4_ReqResAPI,
    httpBin: example5_HttpBin
};

console.log('✅ Приклади завантажено!');
console.log('Використайте:');
console.log('  - networkExamples.trackJSONPlaceholder()');
console.log('  - networkExamples.postToRealAPI()');
console.log('  - networkExamples.measureLoadTime()');
console.log('  - networkExamples.reqResAPI()');
console.log('  - networkExamples.httpBin()');

