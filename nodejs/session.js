const session = require('express-session')

const RedisStore = require('connect-redis')(session)

const secret = require('./secret')

const store = new RedisStore(secret.redis)

const cookie = {
    maxAge: 86400000,
}

module.exports = session({
    secret: secret.key,
    resave: false,
    saveUninitialized: false,
    cookie,
    store,
})
