import session from 'express-session'
import redisConnection from 'connect-redis'

const RedisStore = redisConnection(session)

const store = new RedisStore({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    pass: process.env.REDIS_PASSWORD || null,
})

const cookie = {
    maxAge: 86400000,
}

let SessionMiddleware = session({
    secret: process.env.NODE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie,
    store,
})

export default SessionMiddleware
