const {
    PROXY_TARGET,
    PROXY_PREFIX,
    PROXY_TARGET_NAME,
    ZIPKIN_ENABLED,
    AUTH_TOKEN_COOKIE,
} = require('./config')

const {
    decrypt,
} = require('./crypto')

const debug = require('debug')('proxy:handler')

const url = require('url')
const lookup = require('bluebird').promisify(require('dns').lookup)
const proxy = require('http-proxy-middleware')

const { port, hostname } = url.parse(PROXY_TARGET)
const serviceName = PROXY_TARGET_NAME || hostname

const pathRewrite = {}

if (PROXY_PREFIX) {
    pathRewrite[`^${PROXY_PREFIX}`] = ''
}

module.exports = async () => {
    let wrapper = null

    if (ZIPKIN_ENABLED) {
        let ip = await lookup(hostname)

        wrapper = require('./zipkin/wrapper')({
            serviceName,
            ip,
            port,
        })
    }

    return proxy('/api', {
        target: PROXY_TARGET,
        secure: false,
        changeOrigin: true,
        xfwd: true,
        pathRewrite,

        onProxyReq (proxyReq, req, res) {
            debug('Received request')
            if (req.cookies && req.cookies[AUTH_TOKEN_COOKIE]) {
                debug('Setting up cookies')
                try {
                    proxyReq.setHeader('authorization', decrypt(req.cookies[AUTH_TOKEN_COOKIE]))
                } catch (e) {
                    res.clearCookie(AUTH_TOKEN_COOKIE)
                }
            }
            if (ZIPKIN_ENABLED) {
                debug('Applying Zipkin trace ID')
                const { traceId, headers } = wrapper.startTrace(req, `${req.method.toUpperCase()} ${req.url}`)

                req.traceId = traceId
                for (let key in headers) {
                    proxyReq.setHeader(key, headers[key])
                }
            }
        },
        onProxyRes (proxyRes, req, /* res */) {
            debug('Received response.')
            if (ZIPKIN_ENABLED) {
                debug('Finishing Zipkin trace.')
                wrapper.endTrace(req.traceId, {
                    'http.status_code': proxyRes.statusCode.toString(),
                })
            }
        },
    })
}
