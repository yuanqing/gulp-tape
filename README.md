# gulp-tape [![npm Version](http://img.shields.io/npm/v/gulp-tape.svg?style=flat)](https://www.npmjs.org/package/gulp-tape) [![Build Status](https://img.shields.io/travis/yuanqing/gulp-tape.svg?style=flat)](https://travis-ci.org/yuanqing/gulp-tape)

> Run [Tape](https://github.com/substack/tape) tests in [Gulp](http://gulpjs.com/).

## Usage

```js
'use strict';

var gulp = require('gulp');
var tape = require('gulp-tape');
var tapColorize = require('tap-colorize');

gulp.task('test', function() {
  return gulp.src('test/*.js')
    .pipe(tape({
      reporter: tapColorize()
    }));
});
```

## API

```js
var tape = require('gulp-tape');
```

### tape([opts])

`opts` is an object literal that can take the following keys:

- `outputStream` &mdash; The stream to [pipe the test output](https://github.com/substack/tape#tap-stream-reporter). Defaults to `process.stdout`.

- `reporter` &mdash; The [reporter](https://github.com/substack/tape#pretty-reporters) (a readable/writable stream, as in [`tap-colorize`](https://github.com/substack/tap-colorize)) to format the TAP output. The output is simply not formatted if this isn&rsquo;t specified.

- `tapeOpts` &mdash; The options passed to [`tape.createStream`](https://github.com/substack/tape#var-stream--testcreatestreamopts).

## Installation

Install via [npm](https://npmjs.com/) (together with [Tape](https://github.com/substack/tape)):

```
$ npm i --save-dev gulp-tape tape
```

## License

[MIT](LICENSE.md)
