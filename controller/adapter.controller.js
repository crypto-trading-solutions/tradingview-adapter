const to = require('await-to-js').default;
const util = require('util');
const colors = require('colors');
const sma = require('sma');

const strategies = require('../config/strategy.config');
const ipWhitelist = require('../config/ipWhitelist.config');

const axios = require('axios').default;

class AdapterController {

    constructor() {
        this.occ_open_data_arr = [];
        this.occ_close_data_arr = [];
        console.log("AdapterController constructor end");
    }

    async determineStrategy(req, res, next) {
        //  tradingViewData - data from tV webhook req
        const tradingViewData = req.body;

        //  Validate IP address
        const isTradingViewIp = ipWhitelist.some(ip => req.connection.remoteAddress.includes(ip));

        //  Determine strategy association with tradingView data.
        //  Note: strategy.config should include such tradingViewData.strategy
        const currentStrategy = strategies.filter(strategy => strategy.strategy_name === tradingViewData.Strategy)[0];

        if (typeof currentStrategy !== 'undefined' && isTradingViewIp) {
            //  Initiate a request to close a previous position, and then send an actual request to open a position.
            if (currentStrategy.use_close_calls_feature == true) {
                let close_data = JSON.parse(JSON.stringify(tradingViewData));

                if (tradingViewData.Action == "long") {
                    close_data.Action = "close_short";
                }
                else {
                    close_data.Action = "close_long";
                }

                this.sendStrategyExecutorCoreRequest(currentStrategy, close_data).then(result => {
                    console.log("-----------close_data----------------\n");
                    console.log(close_data);
                    console.log("-----------close_data----------------");
                    console.log(`sendStrategyExecutorCoreRequest close_data result: ${util.inspect(result)}\n\n`);
                    this.sendStrategyExecutorCoreRequest(currentStrategy, tradingViewData).then(result => {
                        console.log("-----------tradingViewData----------------\n");
                        console.log(tradingViewData);
                        console.log("-----------tradingViewData----------------");
                        console.log(`sendStrategyExecutorCoreRequest tradingViewData result" ${util.inspect(result)}\n\n`);
                    });
                });
            }
            else {
                this.sendStrategyExecutorCoreRequest(currentStrategy, tradingViewData).then(result => {
                    console.log("-----------tradingViewData----------------\n");
                    console.log(tradingViewData);
                    console.log("-----------tradingViewData----------------");
                    console.log(`sendStrategyExecutorCoreRequest tradingViewData result" ${util.inspect(result)}\n\n`);
                });
            }

            res.status(200).send();
        }
        else {
            res.status(400).send();
        }
    }

    async sendStrategyExecutorCoreRequest(currentStrategy, tradingViewData) {
        //Rote tradingViewData to associated tradingView server
        const [sendRequestError, sendRequest] = await to(
            axios.post(`${currentStrategy.serverIp}:${tradingViewData.Mode === "master" ? currentStrategy.master_port : currentStrategy.development_port}/alert_data`, tradingViewData)
        )

        if (sendRequestError)
            return sendRequestError;
        else
            return sendRequest.data;
    }

    async occ_data_agregator(req, res, next) {
        let tradingViewData = req.body;
        console.log(tradingViewData);
        console.log("------------------");

        this.occ_open_data_arr.push(tradingViewData.open);
        this.occ_close_data_arr.push(tradingViewData.close);

        console.log(`occ_open_data_arr: ${this.occ_open_data_arr}`.yellow);
        console.log(`occ_close_data_arr: ${this.occ_close_data_arr}`.yellow);
        console.log(sma(this.occ_close_data_arr, 2));



    }
}

module.exports = new AdapterController();
