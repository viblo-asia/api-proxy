const url = require('url');
const dns = require('dns');
const bluebird = require('bluebird');
const createWrapper = require('./wrapper');

function formatRequestUrl(req) {
    const parsed = url.parse(req.originalUrl);

    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: parsed.pathname,
        search: parsed.search
    });
}

function startTrace(proxyReq, req, res, wrapper) {
    const { traceId, headers } = wrapper.startTrace(req, `${req.method.toUpperCase()} ${req.url}`);

    req.traceId = traceId;

    const headerNames = Object.keys(headers);

    headerNames.forEach((name) => {
        proxyReq.setHeader(name, headers[name]);
    });
}

function endTrace(proxyRes, req, res, wrapper) {
    wrapper.endTrace(req.traceId, {
        'http.status_code': proxyRes.statusCode.toString()
    });
}

const extend = (original, fn, ...extraArgs) => (...args) => {
    if (typeof original === 'function') {
        original(...args);
    }
    fn(...args, ...extraArgs);
};

async function extendProxyOptions(options) {
    const { target } = options;
    const { port, hostname } = url.parse(target);

    const ip = await bluebird.promisify(dns.lookup)(hostname);

    const wrapper = createWrapper({ hostname, ip, port });

    const onProxyRequest = extend(options.onProxyRequest, startTrace, wrapper);
    const onProxyRes = extend(options.onProxyRes, endTrace, wrapper);

    return {
        ...options,
        onProxyRequest,
        onProxyRes
    };
}

module.exports = {
    formatRequestUrl,
    extendProxyOptions
};
