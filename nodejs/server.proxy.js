const app = require('./app')()
const config = require('./config')
const cookieParser = require('cookie-parser')

const viewCounter = require('./middleware/views')
const proxy = require('./proxy')

app.get([
    '/api/api/admin',
    '/api/api/user',
    '/api/api/notifications',
    '/api/api/publish',
    '/api/settings',
], (req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.header('Pragma', 'no-cache')
    next()
})

app.get(['/api/posts/:post'], viewCounter)

app.use(cookieParser())
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
