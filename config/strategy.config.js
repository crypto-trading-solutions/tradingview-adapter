const strategies = [
    {
        "strategy":"rwi",
        "serverIp":"http://localhost",
        "port": process.env.NODE_ENV == 'development' ? '3030' : '81'
    }
]

module.exports = strategies;