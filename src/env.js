import {
    makeValidator,
    cleanEnv,
    EnvError,
    host,
    str,
    port,
    url,
    bool,
    num
} from 'envalid';

const commaArray = makeValidator((input) => {
    if (typeof input !== 'string') {
        throw new EnvError(`Not a string: "${input}"`);
    }
    return input.split(',');
});

const base64Str = makeValidator((input) => {
    if (typeof input !== 'string' || input.length === 0) {
        throw new EnvError(`"${input}" is not a string`);
    }

    try {
        return Buffer.from(input, 'base64').toString('utf8');
    } catch (e) {
        throw new EnvError(`String was not correctly encoded: "${input}"`);
    }
});

const envs = cleanEnv(process.env, {
    APP_KEY: base64Str({
        desc: 'Encryption key, base64 encoded'
    }),
    HOST: host({
        default: '0.0.0.0',
        desc: 'Application host'
    }),
    PORT: port({
        default: 3000,
        desc: 'Application port'
    }),
    PROXY_TARGET: url({
        desc: 'Target URL for proxy'
    }),
    PROXY_PREFIX: str({
        default: '/api',
        desc: 'Path rewrite prefix for proxy'
    }),
    PROXY_PREFIX_STRIP: bool({
        default: true,
        desc: 'Whether to strip off the prefix from the request'
    }),
    TRUST_PROXIES: commaArray({
        default: 'loopback',
        desc: 'Comma-separated list of trusted proxies'
    }),
    ETAG_ENABLE: bool({
        default: false,
        desc: 'Enables Etag generation for responses'
    }),
    AUTH_TOKEN_COOKIE: str({
        default: 'Auth',
        desc: 'Auth token cookie name'
    }),
    SESSION_COOKIE_MAX_AGE: num({
        default: 86400000,
        desc: 'Session cookie max age'
    }),
    REDIS_HOST: host({
        default: '127.0.0.1',
        desc: 'Redis host'
    }),
    REDIS_PORT: port({
        default: 6379,
        desc: 'Redis port'
    })
}, {
    strict: true
});

export const {
    APP_KEY,
    HOST,
    PORT,
    TRUST_PROXIES,
    ETAG_ENABLE,
    AUTH_TOKEN_COOKIE,
    SESSION_COOKIE_MAX_AGE,
    REDIS_HOST,
    REDIS_PORT,
    PROXY_TARGET,
    PROXY_PREFIX,
    PROXY_PREFIX_STRIP
} = envs;
