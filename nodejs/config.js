require('dotenv').config({
    silent: true,
})

class HostConfig {
    constructor (env, prefix) {
        this.host = env[prefix + '_HOST'] || '127.0.0.1'
        this.port = parseInt(env[prefix + '_PORT'], 10) || 3030
        this.https = env[prefix + '_HTTPS'] === 'true' || env[prefix + '_HTTPS'] === true

        let default_port

        if (this.https) {
            default_port = 443
            this.protocol = 'https'
        } else {
            default_port = 80
            this.protocol = 'http'
        }

        this.url = this.protocol + '://' + this.host + (this.port === default_port ? '' : ':' + this.port)

        process.env[prefix + '_URL'] = this.url

        this.ip = null
    }

    resolve () {
        return new Promise((resolve, reject) => {
            require('dns').lookup(this.host, (err, address) => {
                if (err !== null) {
                    // We don't care about bad results here
                    reject(false)
                } else {
                    this.ip = address
                    resolve()
                }
            })
        })
    }
}

const env = process.env.APP_ENV || 'local'

const atom = {
    announcement_url: process.env.ATOM_PLUGIN_ANNOUNCEMENT_URL || '#',
}

const node = new HostConfig(process.env, 'NODE')
const api = new HostConfig(process.env, 'API')
const proxy = new HostConfig(process.env, 'PROXY')
const external = new HostConfig(process.env, 'APP')

module.exports = {
    node,
    api,
    proxy,
    external,
    websocket: {
        host: process.env.ECHO_HOST || 'localhost',
        port: process.env.ECHO_PORT || '6002',
    },
    debug: process.env.NODE_DEBUG === 'true' || process.env.NODE_DEBUG === true,
    env,
    production: env === 'production',
    dev: env !== 'production',
    atom,
    analytics_track_id: process.env.GOOGLE_ANALYTICS_TRACK_ID,

    resolve () {
        return Promise.all([
            node.resolve(),
            api.resolve(),
            proxy.resolve(),
            external.resolve(),
        ])
    }
}
