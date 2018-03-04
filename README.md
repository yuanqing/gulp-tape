# gulp-tape [![npm Version](http://img.shields.io/npm/v/gulp-tape.svg?style=flat)](https://www.npmjs.org/package/gulp-tape) [![Build Status](https://img.shields.io/travis/yuanqing/gulp-tape.svg?style=flat)](https://travis-ci.org/yuanqing/gulp-tape)

> Run [Tape](https://github.com/substack/tape) tests in [Gulp](http://gulpjs.com/).

## Usage

```js
const gulp = require('gulp')
const tape = require('gulp-tape')

gulp.task('test', function () {
  return gulp.src('test/*.js')
    .pipe(tape({
      bail: true
    }))
})
```

## API

```js
const tape = require('gulp-tape')
```

### tape([options])

`options` is an optional object literal.

Key | Description | Default
:-|:-|:-
`bail` | Whether to stop the Gulp process on the first failing assertion. | `false`
`outputStream` | The stream to [pipe the test output](https://github.com/substack/tape#tap-stream-reporter). | `process.stdout`
`require` | [Modules to load](https://github.com/substack/tape#preloading-modules) before running the tests. | `undefined`

## Installation

Install via [yarn](https://yarnpkg.com):

```sh
$ yarn add --dev gulp-tape
```

Or [npm](https://npmjs.com):

```sh
$ npm install --save-dev gulp-tape
```

## License

[MIT](LICENSE.md)
