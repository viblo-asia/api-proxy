const { BatchRecorder, ConsoleRecorder } = require('zipkin')
const { HttpLogger } = require('zipkin-transport-http')
const config = require('../secret').tracing.zipkin
const debug = require('../config').debug

let recorder
if (config !== null) {
    recorder = new BatchRecorder({
        logger: new HttpLogger({
            endpoint: `${config.url}/api/v1/spans`
        })
    })
} else if (debug) {
    recorder = new ConsoleRecorder()
} else {
    recorder = {
        record: function record () {},
        toString: function toString () {
            return 'NullRecorder'
        },
    }
}

module.exports = recorder
