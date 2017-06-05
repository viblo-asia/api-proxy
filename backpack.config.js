const path = require('path')

module.exports = {
    serverSrcPath: path.join(__dirname, 'nodejs'),

    webpack: (config, options, webpack) => {
        config.entry.main = './server.js'
        config.entry.echo = './nodejs/echo.js'

        return config
    },
}
