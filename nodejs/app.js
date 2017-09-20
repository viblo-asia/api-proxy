module.exports = (name = 'viblo-frontend') => {
    const debug = require('debug')(name)

    debug('Loading components.')

    const session = require('./session')
    const cookie = require('cookie-parser')()
    const csrf = require('csurf')()

    debug('Components loaded.')

    const app = require('express')()

    app.use(session)
    app.use(cookie)
    app.use(csrf)

    const proxies = require('./secret').proxies
    app.set('trust proxy', proxies)
    app.set('etag', false)

    app.use((req, res, next) => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {})
        next()
    })

    app.use((err, req, res, next) => {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)
        res.status(403).json({
            error: 'session has expired or been tampered with'
        })
    })

    return app
}
