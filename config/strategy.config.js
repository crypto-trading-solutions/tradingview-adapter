/////////////////////////
// *strategies* - Describes an actual list of strategies that can use tradingview-adapter data,
//                store strategy server address data which will handle adapter signals
////
// strategy_name - Name of your strategy
// serverIp      - The IP address of the server to which the call will be delivered 
// 
// development_port -  if tradingViewData.Mode == development => IP:development_port will be used for request
// master_port      -  if tradingViewData.Mode == master => IP:master_port will be used for request
//
// use_close_calls_feature - Some tradingview strategies can correctly use only 2 types of signals, 
//                           as for example, short and long, but for the convenient operation of the signal execution core, 
//                           4 signals would be appropriate - short, close_short, long, close_long.
//
//                           Those tradingview strategies that use 2 signals in this way - Short automatically replaces the long
//                           and Long Automatically replaces the short, this function will be useful.
//
//                           But if you set up 4 signals in the tradingview pine, then the tradingview itself sometimes confuses them in places,
//                           that is, first the signal to open a new deal and then the signal to close the previous one.
////////////////////////

const strategies = [
    {
        "strategy_name":"scalp sma",
        "serverIp":"http://localhost",
        "development_port": "91",
        "master_port" : "81",
        "use_close_calls_feature":true
    }
]

module.exports = strategies;
