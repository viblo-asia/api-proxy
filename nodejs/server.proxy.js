const app = require('./app')()
const config = require('./config')

const viewCounter = require('./middleware/views')
const proxy = require('./proxy')
const csrf = require('csurf')()

app.get([
    '/api/api/admin',
    '/api/api/user',
    '/api/api/notifications',
    '/api/api/publish',
    '/api/settings',
    '/api/user-counters',
], (req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.header('Pragma', 'no-cache')
    next()
})

app.get(['/api/posts/:post'], viewCounter)

app.use((req, res, next) => {
    if (!req.path.startsWith('/api/broadcasting')) {
        csrf(req, res, next)
    }
    next()
})

app.use((req, res, next) => {
    if (req.csrfToken) {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {})
        res.locals.csrftoken = req.csrfToken()
    }
    next()
})

app.use('/api', proxy)

module.exports = {
    listen: (port = null, host = null) => new Promise((resolve, reject) => {
        app.on('error', (e) => {
            reject(e)
        })
        app.set('port', port || config.proxy.port)
        app.listen(port || config.proxy.port, host || config.proxy.host, () => resolve(app))
    })
}
