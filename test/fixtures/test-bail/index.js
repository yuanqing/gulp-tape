'use strict';

var test = require('tape');

test('bail', function(t) {
  t.equal(1, 2);
  t.end();
});
