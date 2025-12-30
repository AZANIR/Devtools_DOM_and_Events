// Використовуємо простий експорт без require для роботи з npx
// Якщо cypress встановлено локально, можна використати: const { defineConfig } = require('cypress');
module.exports = {
  e2e: {
    // Не використовуємо baseUrl, оскільки тести працюють з різними реальними сайтами та API
    // Всі тести використовують повні URL до реальних сервісів:
    // - https://example.com - для базових тестів DOM/Elements/Events
    // - https://jsonplaceholder.typicode.com - для Network тестів
    // - https://reqres.in/api - для тестів авторизації
    // - https://httpbin.org - для HTTP тестів
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
};

