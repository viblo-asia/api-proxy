const { BatchRecorder, ConsoleRecorder } = require('zipkin')
const { HttpLogger } = require('zipkin-transport-http')
const config = require('../secret').tracing.zipkin

let recorder
if (config !== null) {
    recorder = new BatchRecorder({
        logger: new HttpLogger({
            endpoint: `${config.url}/api/v1/spans`
        })
    })
} else {
    recorder = new ConsoleRecorder()
}

module.exports = recorder
