'use strict';

var test = require('tape');
var abs = require('./lib/abs');

test('abs, negative', function(t) {
  t.equal(abs(-1), 1);
  t.end();
});

test('abs, positive', function(t) {
  t.equal(abs(1), 1);
  t.end();
});

