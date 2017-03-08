import ProxyMiddleware from 'http-proxy-middleware'

const api = process.env.APP_URL || 'http://localhost:8000'

export default ProxyMiddleware('/api', {
    target: api,
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
