// strategies - describes an actual list of strategies that can use tradingview-adapter data,
//              store strategy server address data which will handle adapter signals
const strategies = [
    {
        "Strategy":"scalp sma",
        "serverIp":"http://localhost",
        "development_port": "91",
        "master_port" : "81"
    }
]

module.exports = strategies;
