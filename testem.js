module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: (!process.argv.includes('cr')) ? ['Chrome'] : ['Chromium'],
  launch_in_dev: (!process.argv.includes('cr')) ? ['Chrome'] : ['Chromium'],
  browser_args: {
    Chrome: {
      mode: 'ci',
      args: [
        process.env.TRAVIS ? '--no-sandbox' : null,

        '--disable-gpu',
        '--headless',
<<<<<<< HEAD
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
=======
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
>>>>>>> 905252c... v3.10.1...v3.12.0
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  }
};
