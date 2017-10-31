const path = require('path')

module.exports = {
    serverSrcPath: path.join(__dirname, 'nodejs'),

    webpack: (config, options, webpack) => {
        config.entry.proxy = './proxy.js'

        return config
    },
}
