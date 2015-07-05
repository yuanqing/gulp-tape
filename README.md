# gulp-tape [![npm Version](http://img.shields.io/npm/v/gulp-tape.svg?style=flat)](https://www.npmjs.org/package/gulp-tape) [![Build Status](https://img.shields.io/travis/yuanqing/gulp-tape.svg?style=flat)](https://travis-ci.org/yuanqing/gulp-tape)

> Run [Tape](https://github.com/substack/tape) tests in [Gulp](http://gulpjs.com/).

## Usage

```js
'use strict';

var gulp = require('gulp');
var tape = require('gulp-tape');

gulp.task('default', function() {
  return gulp.src('test/*.js')
    .pipe(tape());
});
```

## API

```js
var tape = require('gulp-tape');
```

### tape([opts])

Set the stream to [pipe the test output](https://github.com/substack/tape#tap-stream-reporter) by passing in `opts.outputStream`. Defaults to `process.stdout`.

## Installation

Install via [npm](https://npmjs.com/):

```
$ npm i --save gulp-tape
```

## License

[MIT](LICENSE.md)
