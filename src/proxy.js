const proxy = require('http-proxy-middleware');
const debug = require('debug')('proxy:handler');

const { decrypt } = require('./crypto');

const {
    PROXY_TARGET,
    PROXY_PREFIX,
    ZIPKIN_ENABLED,
    AUTH_TOKEN_COOKIE
} = require('./config');

const { extendProxyOptions } = require('./zipkin/util');

const pathRewrite = {};

if (PROXY_PREFIX) {
    pathRewrite[`^${PROXY_PREFIX}`] = '';
}

module.exports = async () => {
    let options = {
        target: PROXY_TARGET,
        secure: false,
        changeOrigin: true,
        xfwd: true,
        pathRewrite,

        onProxyReq(proxyReq, req, res) {
            if (req.cookies && req.cookies[AUTH_TOKEN_COOKIE]) {
                try {
                    proxyReq.setHeader('authorization', decrypt(req.cookies[AUTH_TOKEN_COOKIE]));
                } catch (e) {
                    debug('Cannot decrypt Auth token:', e.message);
                    res.clearCookie(AUTH_TOKEN_COOKIE);
                }
            }
        }
    };

    if (ZIPKIN_ENABLED) {
        options = await extendProxyOptions(options);
    }

    return proxy('/api', options);
};
