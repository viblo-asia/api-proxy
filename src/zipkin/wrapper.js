const tracer = require('./tracer')

const {
    Annotation: {
        LocalAddr,
        ClientRecv,
        ClientSend,
    },
    Request: {
        addZipkinHeaders,
    },
    InetAddress,
} = require('zipkin')

const {
    formatRequestUrl,
} = require('./util')

module.exports = function ({
       serviceName = 'unknown',
       host = null,
       ip = '0.0.0.0',
       port = 80,
   }) {
    const remote = new LocalAddr({
        host: host instanceof InetAddress ? host : new InetAddress(ip),
        port,
    })
    return {
        startTrace (request, rpc, metadata = {}) {
            const formattedUrl = formatRequestUrl(request)
            return tracer.letChildId(traceId => {
                tracer.recordServiceName(serviceName)
                tracer.recordRpc(rpc)
                for (let key in metadata) {
                    tracer.recordBinary(key, metadata[key])
                }
                tracer.recordBinary('http.url', formattedUrl)
                tracer.recordAnnotation(remote)
                tracer.recordAnnotation(new ClientSend())
                const { headers } = addZipkinHeaders({}, traceId)
                return { traceId, headers }
            })
        },

        endTrace (id, metadata = {}) {
            tracer.scoped(() => {
                tracer.setId(id)
                for (let key in metadata) {
                    tracer.recordBinary(key, metadata[key])
                }
                tracer.recordAnnotation(new ClientRecv())
            })
        },
    }
}
