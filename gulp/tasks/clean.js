const del = require('del')
const config = require('../config')

module.exports = function clean(cb) {
  return del(config.resolvePath('build'), {force: config.forceClean}).then(() => {
    cb()
  })
}
