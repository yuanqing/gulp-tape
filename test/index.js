var gutil = require('gulp-util');
var through = require('through2');

var gulpTape = require('../');

var out = process.stdout.write.bind(process.stdout);

it('circular test', function (done) {
    var stream = gulpTape();

    // process.stdout.write = out;

    var output = '';
    process.stdout.write = function(str) {
      output += str;
    };


    stream.pipe(through.obj(function(file, enc, cb) {
      cb(null, file);
    }, function(cb) {
      process.stdout.write = out;
      console.log('-----');
      console.log(output);
      console.log('-----');
      cb();
      done();
    }));

    stream.write(new gutil.File({
      path: __dirname + '/fixtures/index.js',
      contents: new Buffer('')
    }));
    stream.end();

    // stream.pipe(concat(function(body) {
    //   t.pass();
    //   console.log('---');
    //   console.log(body[0].contents);
    //   console.log('---');
    // }));
})
