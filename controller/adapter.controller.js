const to = require('await-to-js').default;
const util = require('util');
const colors = require('colors');

const strategies = require('../config/strategy.config');
const ipWhitelist = require('../config/ipWhitelist.config');

const axios = require('axios').default;

class AdapterController {

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
        const tradingViewData = req.body;
        //  Initialize position side: True - long | False - short
        if(tradingViewData.info = "previous bar info")
        this.previous_occ_position_side = this.previous_occ_position_side == tradingViewData.isLong?this.previous_occ_position_side:tradingViewData.isLong;
        if(tradingViewData.info = "current bar info")
        {
        console.log("---------------------");
        this.current_occ_position_side = this.current_occ_position_side == tradingViewData.isLong?this.current_occ_position_side:tradingViewData.isLong;
        }

        console.log(`${util.inspect(tradingViewData)}`.yellow);
        console.log(`previous_occ_position_side:${ this.previous_occ_position_side}`.yellow);
        console.log(`current_occ_position_side:${ this.current_occ_position_side}`.yellow);

    }
}

module.exports = new AdapterController();
