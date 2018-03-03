'use strict'

const tape = require('tape')
const through = require('through2')
const PluginError = require('plugin-error')
const requireUncached = require('require-uncached')

const PLUGIN_NAME = 'gulp-tape'

function gulpTape (options) {
  options = options || {}

  const bail = options.bail || false
  const outputStream = options.outputStream || process.stdout
  const reporter = options.reporter || through.obj()
  const tapeOpts = options.tapeOpts || {}

  const files = []

  function transform (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file)
    }
    if (file.isStream()) {
      return callback(
        new PluginError(PLUGIN_NAME, 'Streaming is not supported')
      )
    }
    files.push(file.path)
    callback(null, file)
  }

  function flush (callback) {
    try {
      const tapeStream = tape.createStream(tapeOpts)
      tapeStream.pipe(reporter).pipe(outputStream)
      files.forEach(function (file) {
        requireUncached(file)
      })
      const results = tape.getHarness()._results
      results.once('done', function () {
        let shouldErrorOut = false

        // The following messages will never reach the reporter if we end the
        // tape output here.
        const write = this._stream.push.bind(this._stream)
        write('\n1..' + this.count + '\n')
        write('# tests ' + this.count + '\n')
        write('# pass  ' + this.pass + '\n')
        if (this.fail) {
          write('# fail  ' + this.fail + '\n')

          // Some test failed; we should error out if and only if `bail`
          // is `true`.
          shouldErrorOut = bail
        } else {
          write('\n# ok\n')
        }

        // Reset the counts.
        this.count = 0
        this.fail = 0
        this.pass = 0
        tapeStream.push(null)

        callback(
          shouldErrorOut ? new PluginError(PLUGIN_NAME, 'Test failed') : null
        )
      })

      // This is hacky. Each time `tape.createStream` is called,
      // `results._stream` pipes to a new output stream, and more listeners
      // are added, so we have to remove the max limit.
      results._stream.setMaxListeners(0)
    } catch (error) {
      callback(new PluginError(PLUGIN_NAME, error))
    }
  }

  return through.obj(transform, flush)
}

module.exports = gulpTape
