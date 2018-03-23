const childProcess = require('child_process')
const dargs = require('dargs')
const PluginError = require('plugin-error')
const TapParser = require('tap-parser')
const through = require('through2')

const PLUGIN_NAME = 'gulp-tape'
const TAPE_BINARY_FILEPATH = require.resolve('.bin/tape')

function gulpTape (options) {
  options = options || {}

  const files = []

  function transform (file, encoding, callback) {
    if (file.isNull()) {
      callback(null, file)
      return
    }
    if (file.isStream()) {
      callback(new PluginError(PLUGIN_NAME, 'Streaming is not supported'))
      return
    }
    files.push(file.path)
    callback(null, file)
  }

  function flush (callback) {
    const command = [TAPE_BINARY_FILEPATH]
      .concat(files)
      .concat(dargs(options, { excludes: ['bail', 'outputStream'] }))
      .join(' ')

    const tapeProcess = childProcess.exec(command, function (error) {
      if (error) {
        callback(new PluginError(PLUGIN_NAME, error))
      }
    })
    tapeProcess.stdout.on('end', callback)

    const outputStream = options.outputStream || process.stdout
    const tapParser = new TapParser()
    if (options.bail) {
      tapParser.on('assert', function (assert) {
        if (!assert.ok) {
          callback(new PluginError(PLUGIN_NAME, 'Test failed'))
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
