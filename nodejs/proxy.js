const api = require('./config').api
const proxy = require('http-proxy-middleware')

module.exports = proxy('/api', {
    target: api.url,
    secure: false,
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    },
    onProxyReq (proxyReq, req, res) {
        if (req.session && req.session.token) {
            proxyReq.setHeader('authorization', `${req.session.token.token_type} ${req.session.token.access_token}`)
        }
    },
})
