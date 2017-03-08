import session from 'express-session'
import redisConnection from 'connect-redis'

const RedisStore = redisConnection(session)

export default session({
    secret: process.env.APP_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 },
    store: new RedisStore({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || '6379',
        pass: process.env.REDIS_PASSWORD || null,
    }),
})
