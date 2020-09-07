const childProcess = require('child_process')
const dargs = require('dargs')
const PluginError = require('plugin-error')
const TapParser = require('tap-parser')
const through = require('through2')

const pluginName = 'gulp-tape'
const tapeBinaryFilepath = require.resolve('.bin/tape')

function gulpTape (options) {
  options = options || {}

  const files = []

  function transform (file, encoding, callback) {
    if (file.isNull()) {
      callback(null, file)
      return
    }
    if (file.isStream()) {
      callback(new PluginError(pluginName, 'Streaming is not supported'))
      return
    }
    files.push(file.path)
    callback(null, file)
  }

  function flush (callback) {
    const args = [tapeBinaryFilepath]
      .concat(files)
      .concat(dargs(options, { excludes: ['bail', 'nyc', 'outputStream'] }))

    if (options.nyc) {
      const nycBinaryFilePath = require.resolve('.bin/nyc')
      args.unshift(nycBinaryFilePath)
    }

    var cmd = args.join(' ').split(' ');
    const tapeProcess = childProcess.execFile(cmd[0], cmd.shift(), function (error) {
      if (error) {
        callback(new PluginError(pluginName, error))
      }
    })
    tapeProcess.stdout.on('end', callback)

    const outputStream = options.outputStream || process.stdout
    const tapParser = new TapParser()
    if (options.bail) {
      tapParser.on('assert', function (assert) {
        if (!assert.ok) {
          callback(new PluginError(pluginName, 'Test failed'))
        }
      })
    }
    tapParser.on('line', function (line) {
      outputStream.write(line)
    })

    tapeProcess.stdout.pipe(tapParser)
  }

  return through.obj(transform, flush)
}

module.exports = gulpTape
