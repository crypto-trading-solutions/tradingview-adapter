const strategies = [
    {
        "Strategy":"rwi",
        "Server_ip":"http://localhost",
        "Port": process.env.NODE_ENV == 'development' ? '3030' : '81'
    }
]

module.exports = strategies;