const childProcess = require('child_process')
const PluginError = require('plugin-error')
const through = require('through2')
const dargs = require('dargs')

const PLUGIN_NAME = 'gulp-tape'
const TAPE_BINARY_FILEPATH = require.resolve('tape/bin/tape')

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
      .concat(dargs(options, ['reporter', 'outputStream']))
      .join(' ')
    const tapeProcess = childProcess.exec(command, function (error) {
      if (error) {
        callback(new PluginError(PLUGIN_NAME, error))
      }
    })
    tapeProcess.stdout
      .pipe(options.reporter || through())
      .pipe(options.outputStream || process.stdout)
  }

  return through.obj(transform, flush)
}

module.exports = gulpTape
