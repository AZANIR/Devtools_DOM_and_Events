/**
 * DevTools Application - Приклади для Console
 * 
 * Ці приклади можна копіювати та виконувати безпосередньо в DevTools Console
 * для роботи з Cookies, LocalStorage, SessionStorage та іншими даними.
 */

// ============================================================================
// 1. КЕРУВАННЯ COOKIES
// ============================================================================

/**
 * Читання всіх cookies для поточного домену
 * Виводить список всіх cookies з їх значеннями та атрибутами
 */
function getAllCookies() {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value || '';
        return acc;
    }, {});
    
    console.table(cookies);
    return cookies;
}

/**
 * Отримання значення конкретного cookie
 * @param {string} name - Ім'я cookie
 * @returns {string|null} - Значення cookie або null
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

/**
 * Встановлення cookie з опціями
 * @param {string} name - Ім'я cookie
 * @param {string} value - Значення cookie
 * @param {Object} options - Опції (expires, path, domain, secure, sameSite)
 */
function setCookie(name, value, options = {}) {
    let cookieString = `${name}=${value}`;
    
    if (options.expires) {
        const date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
    }
    
    if (options.path) {
        cookieString += `; path=${options.path}`;
    }
    
    if (options.domain) {
        cookieString += `; domain=${options.domain}`;
    }
    
    if (options.secure) {
        cookieString += '; secure';
    }
    
    if (options.sameSite) {
        cookieString += `; sameSite=${options.sameSite}`;
    }
    
    document.cookie = cookieString;
    console.log(`✅ Cookie set: ${name} = ${value}`);
}

/**
 * Видалення cookie
 * @param {string} name - Ім'я cookie
 * @param {string} path - Шлях (зазвичай '/')
 */
function deleteCookie(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    console.log(`🗑️ Cookie deleted: ${name}`);
}

/**
 * Видалення всіх cookies для поточного домену
 */
function clearAllCookies() {
    const cookies = getAllCookies();
    Object.keys(cookies).forEach(name => {
        deleteCookie(name);
    });
    console.log('✅ All cookies cleared');
}

// ============================================================================
// 2. РОБОТА З LOCALSTORAGE
// ============================================================================

/**
 * Отримання всіх даних з LocalStorage
 * Виводить таблицю всіх ключів та значень
 */
function getAllLocalStorage() {
    const storage = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        storage[key] = localStorage.getItem(key);
    }
    console.table(storage);
    return storage;
}

/**
 * Встановлення значення в LocalStorage з валідацією
 * @param {string} key - Ключ
 * @param {*} value - Значення (буде конвертовано в JSON)
 */
function setLocalStorage(key, value) {
    try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
        console.log(`✅ LocalStorage set: ${key} =`, value);
    } catch (error) {
        console.error('❌ Error setting LocalStorage:', error);
        // Якщо JSON.stringify не вдається, зберігаємо як рядок
        localStorage.setItem(key, String(value));
    }
}

/**
 * Отримання значення з LocalStorage з автоматичним парсингом JSON
 * @param {string} key - Ключ
 * @returns {*} - Значення або null
 */
function getLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        if (value === null) return null;
        
        // Спробуємо розпарсити як JSON
        try {
            return JSON.parse(value);
        } catch {
            // Якщо не JSON, повертаємо як рядок
            return value;
        }
    } catch (error) {
        console.error('❌ Error getting LocalStorage:', error);
        return null;
    }
}

/**
 * Видалення значення з LocalStorage
 * @param {string} key - Ключ
 */
function removeLocalStorage(key) {
    localStorage.removeItem(key);
    console.log(`🗑️ LocalStorage removed: ${key}`);
}

/**
 * Очищення всього LocalStorage
 */
function clearLocalStorage() {
    localStorage.clear();
    console.log('✅ LocalStorage cleared');
}

/**
 * Перевірка розміру LocalStorage
 * Показує скільки місця використовується
 */
function getLocalStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    const sizeInKB = (total / 1024).toFixed(2);
    const sizeInMB = (total / 1024 / 1024).toFixed(2);
    
    console.log(`📊 LocalStorage size: ${sizeInKB} KB (${sizeInMB} MB)`);
    return total;
}

// ============================================================================
// 3. РОБОТА З SESSIONSTORAGE
// ============================================================================

/**
 * Отримання всіх даних з SessionStorage
 */
function getAllSessionStorage() {
    const storage = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        storage[key] = sessionStorage.getItem(key);
    }
    console.table(storage);
    return storage;
}

/**
 * Встановлення значення в SessionStorage
 * @param {string} key - Ключ
 * @param {*} value - Значення
 */
function setSessionStorage(key, value) {
    try {
        const jsonValue = JSON.stringify(value);
        sessionStorage.setItem(key, jsonValue);
        console.log(`✅ SessionStorage set: ${key} =`, value);
    } catch (error) {
        console.error('❌ Error setting SessionStorage:', error);
        sessionStorage.setItem(key, String(value));
    }
}

/**
 * Отримання значення з SessionStorage
 * @param {string} key - Ключ
 * @returns {*} - Значення або null
 */
function getSessionStorage(key) {
    try {
        const value = sessionStorage.getItem(key);
        if (value === null) return null;
        
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    } catch (error) {
        console.error('❌ Error getting SessionStorage:', error);
        return null;
    }
}

/**
 * Очищення всього SessionStorage
 */
function clearSessionStorage() {
    sessionStorage.clear();
    console.log('✅ SessionStorage cleared');
}

// ============================================================================
// 4. ОЧИЩЕННЯ КЕШУ ПЕРЕД ТЕСТАМИ
// ============================================================================

/**
 * Повне очищення всіх даних браузера
 * Видаляє cookies, localStorage, sessionStorage
 */
function clearAllStorage() {
    console.group('🧹 Clearing all storage');
    
    // Очищаємо cookies
    clearAllCookies();
    
    // Очищаємо LocalStorage
    clearLocalStorage();
    
    // Очищаємо SessionStorage
    clearSessionStorage();
    
    console.log('✅ All storage cleared');
    console.groupEnd();
}

/**
 * Очищення storage для конкретного ключа в усіх місцях
 * @param {string} key - Ключ для видалення
 */
function clearStorageKey(key) {
    console.group(`🗑️ Clearing key: ${key}`);
    
    // Видаляємо з LocalStorage
    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`✅ Removed from LocalStorage: ${key}`);
    }
    
    // Видаляємо з SessionStorage
    if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        console.log(`✅ Removed from SessionStorage: ${key}`);
    }
    
    // Видаляємо cookie
    if (getCookie(key)) {
        deleteCookie(key);
        console.log(`✅ Removed cookie: ${key}`);
    }
    
    console.groupEnd();
}

// ============================================================================
// 5. ПЕРЕВІРКА ЗБЕРЕЖЕНИХ ДАНИХ
// ============================================================================

/**
 * Перевірка структури даних в LocalStorage
 * Перевіряє, чи дані мають очікувану структуру
 * @param {string} key - Ключ для перевірки
 * @param {Object} expectedStructure - Очікувана структура
 */
function validateLocalStorageStructure(key, expectedStructure) {
    const data = getLocalStorage(key);
    
    if (!data) {
        console.error(`❌ Key "${key}" not found in LocalStorage`);
        return false;
    }
    
    const missingKeys = [];
    const extraKeys = [];
    
    // Перевіряємо наявність всіх очікуваних ключів
    Object.keys(expectedStructure).forEach(expectedKey => {
        if (!(expectedKey in data)) {
            missingKeys.push(expectedKey);
        }
    });
    
    // Перевіряємо наявність зайвих ключів
    Object.keys(data).forEach(dataKey => {
        if (!(dataKey in expectedStructure)) {
            extraKeys.push(dataKey);
        }
    });
    
    if (missingKeys.length > 0) {
        console.error(`❌ Missing keys:`, missingKeys);
        return false;
    }
    
    if (extraKeys.length > 0) {
        console.warn(`⚠️ Extra keys:`, extraKeys);
    }
    
    console.log(`✅ Structure validation passed for "${key}"`);
    return true;
}

/**
 * Перевірка безпеки збережених даних
 * Перевіряє, чи не зберігаються чутливі дані небезпечно
 */
function checkStorageSecurity() {
    console.group('🔒 Security Check');
    
    const sensitivePatterns = ['password', 'token', 'secret', 'key', 'auth'];
    const issues = [];
    
    // Перевіряємо LocalStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        
        sensitivePatterns.forEach(pattern => {
            if (key.toLowerCase().includes(pattern)) {
                // Перевіряємо, чи значення не зашифроване
                if (value && value.length < 100 && !value.startsWith('encrypted:')) {
                    issues.push({
                        type: 'LocalStorage',
                        key: key,
                        issue: 'Sensitive data may be stored insecurely'
                    });
                }
            }
        });
    }
    
    // Перевіряємо SessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        
        sensitivePatterns.forEach(pattern => {
            if (key.toLowerCase().includes(pattern)) {
                if (value && value.length < 100 && !value.startsWith('encrypted:')) {
                    issues.push({
                        type: 'SessionStorage',
                        key: key,
                        issue: 'Sensitive data may be stored insecurely'
                    });
                }
            }
        });
    }
    
    if (issues.length > 0) {
        console.warn('⚠️ Security issues found:');
        console.table(issues);
    } else {
        console.log('✅ No obvious security issues found');
    }
    
    console.groupEnd();
    return issues;
}

/**
 * Експорт всіх даних storage для збереження
 * Створює JSON об'єкт з усіма даними
 */
function exportStorageData() {
    const data = {
        cookies: getAllCookies(),
        localStorage: getAllLocalStorage(),
        sessionStorage: getAllSessionStorage(),
        timestamp: new Date().toISOString()
    };
    
    const json = JSON.stringify(data, null, 2);
    console.log('📦 Exported storage data:');
    console.log(json);
    
    // Копіюємо в буфер обміну (якщо підтримується)
    if (navigator.clipboard) {
        navigator.clipboard.writeText(json).then(() => {
            console.log('✅ Data copied to clipboard');
        });
    }
    
    return data;
}

/**
 * Імпорт даних в storage
 * Відновлює дані з експортованого об'єкта
 * @param {Object} data - Дані для імпорту
 */
function importStorageData(data) {
    console.group('📥 Importing storage data');
    
    // Імпортуємо cookies
    if (data.cookies) {
        Object.entries(data.cookies).forEach(([name, value]) => {
            setCookie(name, value);
        });
    }
    
    // Імпортуємо LocalStorage
    if (data.localStorage) {
        Object.entries(data.localStorage).forEach(([key, value]) => {
            setLocalStorage(key, value);
        });
    }
    
    // Імпортуємо SessionStorage
    if (data.sessionStorage) {
        Object.entries(data.sessionStorage).forEach(([key, value]) => {
            setSessionStorage(key, value);
        });
    }
    
    console.log('✅ Data imported successfully');
    console.groupEnd();
}

// ============================================================================
// 6. МОНІТОРИНГ ЗМІН STORAGE
// ============================================================================

/**
 * Відстеження змін в LocalStorage
 * Виводить повідомлення при будь-якій зміні
 */
function monitorLocalStorage() {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;
    
    localStorage.setItem = function(key, value) {
        console.log(`📝 LocalStorage set: ${key} =`, value);
        return originalSetItem.apply(this, arguments);
    };
    
    localStorage.removeItem = function(key) {
        console.log(`🗑️ LocalStorage removed: ${key}`);
        return originalRemoveItem.apply(this, arguments);
    };
    
    localStorage.clear = function() {
        console.log('🧹 LocalStorage cleared');
        return originalClear.apply(this, arguments);
    };
    
    // Відстежуємо storage events (для синхронізації між вкладками)
    window.addEventListener('storage', function(e) {
        console.log('🔄 Storage event:', {
            key: e.key,
            oldValue: e.oldValue,
            newValue: e.newValue,
            url: e.url
        });
    });
    
    console.log('✅ LocalStorage monitoring activated');
}

// Експортуємо функції для використання
window.storageUtils = {
    // Cookies
    getAllCookies,
    getCookie,
    setCookie,
    deleteCookie,
    clearAllCookies,
    
    // LocalStorage
    getAllLocalStorage,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    clearLocalStorage,
    getLocalStorageSize,
    
    // SessionStorage
    getAllSessionStorage,
    setSessionStorage,
    getSessionStorage,
    clearSessionStorage,
    
    // Utilities
    clearAllStorage,
    clearStorageKey,
    validateLocalStorageStructure,
    checkStorageSecurity,
    exportStorageData,
    importStorageData,
    monitorLocalStorage
};

console.log('✅ Storage utilities loaded. Use window.storageUtils for access.');

