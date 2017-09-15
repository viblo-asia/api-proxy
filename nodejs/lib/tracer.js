const CLSContext = require('zipkin-context-cls')
const { Tracer } = require('zipkin')

const recorder = require('./recorder')

const ctxImpl = new CLSContext('zipkin')
const tracer = new Tracer({ ctxImpl, recorder })

module.exports = tracer
