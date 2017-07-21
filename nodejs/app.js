module.exports = () => {
    const debug = require('debug')('viblo-frontend')

    debug('Loading components.')

    const session = require('./session')
    const cookie = require('cookie-parser')()
    const csrf = require('csurf')()

    debug('Components loaded.')

    const app = require('express')()

    app.use(session)
    app.use(cookie)
    app.use(csrf)

    app.use((req, res, next) => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {})
        next()
    })

    app.use((req, res, next) => {
        if (req.session && (req.session.token || req.session.user || req.session.settings)) {
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
            res.header('Pragma', 'no-cache')
        } else {
            res.header('Cache-Control', 'public, max-age=5')
        }
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
