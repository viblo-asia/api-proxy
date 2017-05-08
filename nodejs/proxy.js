const api = require('./config').api
const proxy = require('http-proxy-middleware')

module.exports = proxy('/api', {
    target: api.url,
    pathRewrite: {
        '^/api': ''
    },
    onProxyReq (proxyReq, req, res) {
        let auth = (req.session && req.session.token)
            ? `${req.session.token.token_type} ${req.session.token.access_token}`
            : ''
        proxyReq.setHeader('authorization', auth)
    },
})
