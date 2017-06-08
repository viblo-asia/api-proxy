require('dotenv').config({
    silent: true,
})

let makeHostConfig = (env, prefix) => {
    let host = env[prefix + '_HOST'] || '127.0.0.1'
    let port = parseInt(env[prefix + '_PORT'], 10) || 3030
    let https = env[prefix + '_HTTPS'] === 'true' || env[prefix + '_HTTPS'] === true

    let default_port, protocol

    if (https) {
        default_port = 443
        protocol = 'https'
    } else {
        default_port = 80
        protocol = 'http'
    }

    let url = protocol + '://' + host + (port === default_port ? '' : ':' + port)

    process.env[prefix + '_URL'] = url

    return {
        host,
        port,
        url,
        protocol,
        https,
    }
}

const env = process.env.APP_ENV || 'local'

const atom = {
    announcement_url: process.env.ATOM_PLUGIN_ANNOUNCEMENT_URL || '#',
}

module.exports = {
    node: makeHostConfig(process.env, 'NODE'),
    api: makeHostConfig(process.env, 'API'),
    proxy: makeHostConfig(process.env, 'PROXY'),
    external: makeHostConfig(process.env, 'APP'),
    websocket: {
        host: process.env.ECHO_HOST || 'localhost',
        port: process.env.ECHO_PORT || '6002',
    },
    debug: process.env.NODE_DEBUG === 'true' || process.env.NODE_DEBUG === true,
    env,
    production: env === 'production',
    dev: env !== 'production',
    atom,
    analytics_track_id: process.env.GOOGLE_ANALYTICS_TRACK_ID
}
