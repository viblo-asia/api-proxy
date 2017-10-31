// Environment variables
const {
    ZIPKIN_HOST,
    ZIPKIN_PORT,
} = require('../config')

const CLSContext = require('zipkin-context-cls')
const { HttpLogger } = require('zipkin-transport-http')
const {
    BatchRecorder,
    Tracer,
} = require('zipkin')

const tracer = new Tracer({
    ctxImpl: new CLSContext('zipkin'),
    recorder: new BatchRecorder({
        logger: new HttpLogger({
            endpoint: `http://${ZIPKIN_HOST}:${ZIPKIN_PORT}/api/v1/spans`
        })
    }),
})

module.exports = tracer
