const {
    HOST,
    PORT,
    ZIPKIN_ENABLED,
    SERVICE_NAME,
} = require('./config')

const app = require('./app')

if (ZIPKIN_ENABLED) {
    const tracer = require('./zipkin/tracer')
    const { expressMiddleware } = require('zipkin-instrumentation-express')
    app.use(expressMiddleware({
        tracer,
        serviceName: SERVICE_NAME,
    }))
}

const loadProxy = require('./proxy')

module.exports = async () => {
    const proxy = await loadProxy()
    app.use(proxy)
    app.set('port', PORT)
    app.listen(PORT, HOST, () => {
        console.log(`Proxy listening on ${HOST}:${PORT}`)
    })
}
