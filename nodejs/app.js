const config = require('./config')

let debug = require('debug')

// Import and Set Nuxt.js options
if (config.debug) {
    debug.enable('*')
}

debug = debug('viblo-frontend')

debug('Loading components.')

const nuxt = require('./nuxt')
const session = require('./session')
const proxy = require('./proxy')
const router = require('./router')
const cookie = require('cookie-parser')()
const csrf = require('csurf')()
const axios = require('axios')
const viewCounter = require('./middleware/views')

debug('Components loaded.')

const app = require('express')()

process.on('unhandledRejection', r => console.log(r))

app.use(session)
app.use(cookie)
app.use(csrf)

axios.interceptors.request.use(function (request) {
    if (request.url.startsWith(config.node.url + '/api')) {
        let url = config.api.url + request.url.substr(config.node.url.length + 4)
        debug(request.url + ' > ' + url)
        request.url = url
    }
    return request
})

axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error.response) {
        console.log(error.response.data)
    } else {
        console.log(error)
    }
    return Promise.reject(error)
})

app.use((req, res, next) => {
    if (req.session && req.session.token) {
        // Temporary workaround to inject token into server-side requests
        // after finished refactoring of API routes, must be changed
        let authorization = `${req.session.token.token_type} ${req.session.token.access_token}`
        axios.defaults.headers.common['Authorization'] = authorization
    }
    next()
})

app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {})
    res.locals.csrftoken = req.csrfToken()
    next()
})

app.use((req, res, next) => {
    // Share public config to frontend
    req.config = config
    next()
})

router.get(['/:user/posts/:post', '/api/posts/:post', '/p/:post'], viewCounter)

app.use('/api', proxy)
app.use('/', router)

app.use('/admin', (req, res, next) => {
    if (!req.session || !req.session.user || !req.session.user.admin_access) {
        res.redirect('/')
    } else {
        return next()
    }
})

app.get('/sitemap.xml', require('./routes/sitemap'))

app.use(nuxt.render)

module.exports = app
