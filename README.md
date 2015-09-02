# gulp-tape [![npm Version](http://img.shields.io/npm/v/gulp-tape.svg?style=flat)](https://www.npmjs.org/package/gulp-tape) [![Build Status](https://img.shields.io/travis/yuanqing/gulp-tape.svg?style=flat)](https://travis-ci.org/yuanqing/gulp-tape)

> Run [Tape](https://github.com/substack/tape) tests in [Gulp](http://gulpjs.com/).

## Usage

```js
'use strict';

var gulp = require('gulp');
var tape = require('../');
var tapColorize = require('tap-colorize');

gulp.task('default', function() {
  return gulp.src('fixtures/*.js')
    .pipe(tape({
      reporter: tapColorize()
    }));
});
```

The `reporter` is optional.

## API

```js
var tape = require('gulp-tape');
```

### tape([opts])

`opts` is an object literal that can take the following keys:

- `outputStream` &mdash; The stream to [pipe the test output](https://github.com/substack/tape#tap-stream-reporter). Defaults to `process.stdout`.

- `reporter` &mdash; The reporter (a stream, as in [`tap-colorize`](https://github.com/substack/tap-colorize)) to format the TAP output. The output is simply *not* formatted if a `reporter` is not specified.

## Installation

Install via [npm](https://npmjs.com/):

```
$ npm i --save gulp-tape
```

## License

[MIT](LICENSE.md)
