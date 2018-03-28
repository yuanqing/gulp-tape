const test = require('tape')
const foo = require('./')

// Just test that we can access the file, nothing to do with the actual testing
const deep_test = require('deep/deep_test')
console.log('!!! successfully imported deep_test using babel-transformed root paths', deep_test())

test('foo', function (t) {
  t.plan(1)
  t.equal(foo(), 42)
})
