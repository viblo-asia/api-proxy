const api = require('./config').api
const proxy = require('http-proxy-middleware')
const encryptToken = require('./encryptToken')
const url = require('url')
const _ = require('lodash')
const tracer = require('./lib/tracer')
const { Request, Annotation, InetAddress } = require('zipkin')
class ClientAddr extends Annotation.ClientAddr {}
ClientAddr.prototype.annotationType = 'LocalAddr'

function formatRequestUrl (proxyReq) {
    // Protocol is not available in proxyReq by express-http-proxy
    const parsedPath = url.parse(proxyReq.path)
    return url.format({
        hostname: proxyReq.hostname,
        port: proxyReq.port,
        pathname: parsedPath.pathname,
        search: parsedPath.search,
    })
}

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
        tracer.letChildId((traceId) => {
            req.traceId = traceId
            tracer.recordServiceName('Viblo API')
            const url = formatRequestUrl(proxyReq)
            tracer.recordRpc(`${req.method.toUpperCase()} ${url}`)
            tracer.recordBinary('http.url', url)
            tracer.recordAnnotation(new ClientAddr({
                serviceName: 'Viblo API',
                host: new InetAddress(api.ip),
                port: api.port,
            }))
            tracer.recordAnnotation(new Annotation.ClientSend())
            _.each(Request.addZipkinHeaders({}, traceId).headers, (value, key) => {
                proxyReq.setHeader(key, value)
            })
        })
    },
    onProxyRes (proxyRes, req, res) {
        tracer.scoped(() => {
            tracer.setId(req.traceId)
            tracer.recordBinary('http.status_code', proxyRes.statusCode.toString())
            tracer.recordAnnotation(new Annotation.ClientRecv())
        })
    },
})
