const session = require('express-session')
const client = require('./lib/redis')
const RedisStore = require('connect-redis')(session)

const secret = require('./secret').key

const store = new RedisStore({
    client,
})

const cookie = {
    maxAge: 86400000,
}

module.exports = session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie,
    store,
})
