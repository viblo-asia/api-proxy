const instances = process.env.NODE_INSTANCES !== 'max' ? parseInt(process.env.NODE_INSTANCES, 10) || 2 : 'max';

module.exports = {
    apps: [
        {
            name: 'proxy',
            script: 'index.js',
            cwd: '/proxy',
            instances,
            exec_mod: 'cluster',
            node_args: '-r esm'
        }
    ]
};
