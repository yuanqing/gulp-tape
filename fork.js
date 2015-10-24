var vm = require('vm');
var m = require('module');
var path = require('path');
var merge = require('lodash.merge');

var keysBefore = Object.keys(global);

/**
 * patch node's require for execution in vm.runInThisContext
 * @param  {string} dirName __dirname to emulate in the executed script
 * @return {function}       patched require function
 */
function patchRequire(dirName, fileMap) {
  return function patchedRequire(moduleName) {
    if (moduleName[0] === '.') {
      var resolved = path.resolve(dirName, moduleName);

      if (fileMap[resolved]) {
        try {
          var script = vm.runInThisContext(m.wrap(fileMap[resolved]), resolved).bind(global);
          script(exports, patchRequire(dirName, fileMap), module, resolved, dirName);
          return module.exports;
        } catch (err) {
          console.error(err);
          throw new err;
        }
      } else {
        return require(resolved);
      }
    } else {
      return require(moduleName);
    }
  };
}

var args = process.argv.slice(2);
var code = args[0];
var fileName = args[1];
var fileMap = JSON.parse(args[2]);

var dirName = path.dirname(fileName);

var script = vm.runInThisContext(m.wrap(code), fileName).bind(global);
script(exports, patchRequire(dirName, fileMap), module, fileName, dirName);

var newKeys = Object.keys(global).filter(function(key){
  return keysBefore.indexOf(key) === -1;
});

process.on('beforeExit', function(){
  process.send(newKeys.reduce(function(results, newKey){
    results[newKey] = global[newKey];
    return results;
  }, {}));
});
