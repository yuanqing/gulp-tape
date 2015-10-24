'use strict';

var test = require('tape');
var abs = require('../index.js');


test('negative', function(t) {
  t.equal(abs(-1), 1);
  t.end();
});

test('positive', function(t) {
  t.equal(abs(1), 1);

  setTimeout(function(){
    t.end();
  }, 1000);
});
