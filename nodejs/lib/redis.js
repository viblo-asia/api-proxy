const config = require('../secret').redis
const redis = require('redis')

/** @var RedisClient **/
const client = redis.createClient(config)

module.exports = client
