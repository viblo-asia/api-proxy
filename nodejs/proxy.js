const api = require('./config').api

module.exports = require('http-proxy-middleware')('/api', {
    target: api.url,
    pathRewrite: {
        '^/api': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        let auth = (req.session && req.session.token)
            ? `${req.session.token.token_type} ${req.session.token.access_token}`
            : ''
        proxyReq.setHeader('authorization', auth)
    },
})
