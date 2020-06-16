// strategies - describes an actual list of strategies that can use tradingview-adapter data,
//              store strategy server address data which will handle adapter signals
const strategies = [
    {
        "strategy":"rwi",
        "serverIp":"http://localhost",
        "developmentPort": "3030",
        "masterPort" : "81"
    }
]

module.exports = strategies;