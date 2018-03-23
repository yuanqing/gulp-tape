const gulp = require('gulp')
const log = require('fancy-log')
const gulptape = require('../')

gulp.task('test', function () {
  return gulp
    .src('fixtures/test.js')
    .pipe(
      gulptape({
        bail: true
      })
    )
    .on('error', function (error) {
      log(error.message)
      process.exit(1)
    })
})
