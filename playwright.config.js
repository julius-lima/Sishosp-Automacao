module.exports = {
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost',
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'only-on-failure',
    headless: false
  },
  projects: [
    {
      name: 'Sishosp Automation',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        video: {
          mode: 'on',
          size: { width: 1280, height: 720 }
        }
      }
    }
  ],
  outputDir: 'test-results/',
  globalSetup: require.resolve('./global-setup.js')
};