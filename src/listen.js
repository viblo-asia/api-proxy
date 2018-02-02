const {
    HOST,
    PORT,
    ZIPKIN_ENABLED,
    SERVICE_NAME,
} = require('./config')

const debug = require('debug')('proxy:init')

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
    debug('Setting up application.')
    const proxy = await loadProxy()

    app.use(proxy)
    app.set('port', PORT)

    debug('Launching server.')
    app.listen(PORT, HOST, () => {
        // eslint-disable-next-line no-console
        console.log(`Proxy listening on ${HOST}:${PORT}`)
    })
}
