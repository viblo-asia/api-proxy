const serviceName = 'viblo-proxy'
const config = require('./config')
const cookieParser = require('cookie-parser')
const zipkinMiddleware = require('./middleware/zipkin')
const tracer = require('./lib/tracer')

const proxy = require('./proxy')

module.exports = {
    listen: (port = null, host = null) => new Promise((resolve, reject) => {
        const app = require('./app')(serviceName)
        app.use(zipkinMiddleware({
            tracer,
            serviceName,
        }))
        app.use('/api', proxy)
        setup(app)
        app.on('error', (e) => {
            reject(e)
        })
        app.set('port', port || config.proxy.port)
        config.resolve().then(() => {
            app.listen(port || config.proxy.port, host || config.proxy.host, () => resolve(app))
        })
    })
}
