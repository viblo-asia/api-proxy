const api = require('./config').api
const proxy = require('http-proxy-middleware')
const encryptToken = require('./encryptToken')

module.exports = proxy('/api', {
    target: api.url,
    secure: false,
    changeOrigin: true,
    xfwd: true,
    pathRewrite: {
        '^/api': ''
    },

    /**
     * @param {Request} proxyReq
     * @param {Request} req
     * @param {Response} res
     */
    onProxyReq (proxyReq, req, res) {
        const token = encryptToken.token(req)
        if (token) {
            proxyReq.setHeader('authorization', token)
        }
    },
})
