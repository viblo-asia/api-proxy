const instances = process.env.NODE_INSTANCES !== 'max' ? parseInt(process.env.NODE_INSTANCES, 10) || 2 : 'max';

module.exports = {
    apps: [
        {
            name: 'viblo-proxy',
            script: 'index.js',
            instances,
            exec_mod: 'cluster',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
