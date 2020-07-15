'use strict';

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: (!process.argv.includes('cr')) ? ['Chrome'] : ['Chromium'],
  launch_in_dev: (!process.argv.includes('cr')) ? ['Chrome'] : ['Chromium'],
  browser_start_timeout: 120,
  browser_args: {
    Chrome: {
      mode: 'ci',
      args: [
        process.env.TRAVIS ? '--no-sandbox' : null,
        '--disable-gpu',
        '--headless',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    },
    Chromium: {
      mode: 'ci',
      args: [
        process.env.TRAVIS ? '--no-sandbox' : null,
        '--disable-gpu',
        '--headless',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  }
};
