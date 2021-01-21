const gulp = require('gulp')
const config = require('../config')

module.exports = function fonts() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest(config.resolvePath('build/fonts')))
}


