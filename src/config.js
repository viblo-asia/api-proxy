const envalid = require('envalid')
const {
    makeValidator,
    cleanEnv,
    EnvError,
    host,
    str,
    port,
    url,
    bool,
    num,
} = envalid

const commaArray = makeValidator(input => {
    if (typeof input !== 'string') throw new EnvError(`Not a string: "${input}"`)
    return input.split(',')
})

const base64Str = makeValidator(input => {
    if (typeof input !== 'string' || input.length === 0) throw new EnvError(`Not a string: "${input}"`)
    // Decode Laravel-style base64-encoded key
    if (input.startsWith('base64:')) {
        return Buffer.from(input.substr(7), 'base64').toString('utf8')
    }
    return input.toString()
})

if (typeof process.env.ENCRYPT_KEY === 'undefined') {
    process.env.ENCRYPT_KEY = process.env.APP_KEY
}

module.exports = cleanEnv(process.env, {
    APP_KEY: base64Str({
        desc: 'Encryption key',
    }),
    HOST: host({
        default: '0.0.0.0',
        desc: 'Application host',
    }),
    PORT: port({
        default: 3000,
        desc: 'Application port',
    }),
    ZIPKIN_HOST: host({
        default: '127.0.0.1',
        desc: 'Zipkin tracer host',
    }),
    ZIPKIN_ENABLED: bool({
        default: false,
    }),
    ZIPKIN_PORT: port({
        default: 9411,
        desc: 'Zipkin tracer port',
    }),
    SERVICE_NAME: str({
        default: 'api-proxy',
        desc: 'Application service name',
    }),
    TRUST_PROXIES: commaArray({
        default: 'loopback',
        desc: 'Comma-separated list of trusted proxies',
    }),
    ETAG_ENABLE: bool({
        default: false,
        desc: 'Enables Etag generation for responses',
    }),
    XSRF_TOKEN_COOKIE: str({
        default: 'XSRF-TOKEN',
        desc: 'XSRF token cookie name',
    }),
    AUTH_TOKEN_COOKIE: str({
        default: 'Auth',
        desc: 'Auth token cookie name',
    }),
    ENCRYPT_KEY: str({
        desc: 'Auth cookie encryption key',
    }),
    SESSION_COOKIE_MAX_AGE: num({
        default: 86400000,
        desc: 'Session cookie max age',
    }),
    REDIS_HOST: host({
        default: '127.0.0.1',
        desc: 'Redis host',
    }),
    REDIS_PORT: port({
        default: 6379,
        desc: 'Redis port',
    }),
    PROXY_TARGET: url({
        desc: 'Target URL for proxy',
    }),
    PROXY_PREFIX: str({
        default: '',
        desc: 'Path rewrite prefix for proxy',
    }),
    PROXY_TARGET_NAME: str({
        default: '',
        desc: 'Proxy target service name',
    }),
})
