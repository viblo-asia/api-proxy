import qs from 'querystring';
import createDebug from 'debug';
import proxy from 'http-proxy-middleware';

import { decrypt } from '../utils/crypto';
import {
    PROXY_TARGET,
    PROXY_PREFIX,
    PROXY_PREFIX_STRIP,
    AUTH_TOKEN_COOKIE
} from '../env';

const debug = createDebug('proxy:handler');

const pathRewrite = PROXY_PREFIX_STRIP
    ? { [PROXY_PREFIX]: '' }
    : {};

export default proxy(PROXY_PREFIX, {
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

        const contentType = proxyReq.getHeader('Content-Type');

        if (contentType === 'application/x-www-form-urlencoded') {
            const bodyData = qs.stringify(req.body);

            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    }
});
