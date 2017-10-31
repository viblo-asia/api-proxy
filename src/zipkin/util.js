const url = require('url')

module.exports.formatRequestUrl = (req) => {
    const parsed = url.parse(req.originalUrl)

    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: parsed.pathname,
        search: parsed.search,
    })
}
