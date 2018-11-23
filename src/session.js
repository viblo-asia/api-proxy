import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import {
    APP_KEY,
    REDIS_HOST,
    REDIS_PORT,
    SESSION_COOKIE_MAX_AGE
} from './env';

const RedisStore = connectRedis(session);

const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});

const store = new RedisStore({ client });
const cookie = { maxAge: SESSION_COOKIE_MAX_AGE };

export default session({
    secret: APP_KEY,
    resave: false,
    saveUninitialized: false,
    store,
    cookie
});
