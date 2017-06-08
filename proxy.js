const app = require('./nodejs/server.proxy')

app.listen().then(() => console.log('Proxy server is running.')) // eslint-disable-line no-console)
    .catch((error) => {
        console.error(error) // eslint-disable-line no-console
        process.exit(1)
    })
