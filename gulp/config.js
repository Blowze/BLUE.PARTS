const path = require('path')

const root = path.join(__dirname, '../')
const src = path.join(root, 'src')

module.exports = {
  root,
  src,
  buildPath: path.join(root, '/build'),
  build: {
    base: "../src/main/resources/static/",
    html: "../src/main/webapp/WEB-INF/templates/",
    fonts: "../src/main/resources/static/fonts/",
    img: "../src/main/resources/static/img/",
    js: "../src/main/resources/static/js/",
    css: "../src/main/resources/static/css/",
    temp: "../src/main/resources/static/temp/",
    favicon: "../src/main/resources/static/favicon/",
    messages: "../src/main/resources/i18n/messages.properties"
  },
  pug2html: {
    beautifyHtml: false
  },
  lighthouse: {
    reportPath: path.join(root, 'reports'),
    PORT: 8080,
    chromeLauncherPort: 9222,
    config: {
      extends: 'lighthouse:default'
    },
    flags: {
      // available options - https://github.com/GoogleChrome/lighthouse/#cli-options
      chromeFlags: ['--show-paint-rects'],
      output: 'html'
    }
  }
}
