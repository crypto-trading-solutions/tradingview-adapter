const to = require('await-to-js').default;
const strategies = require('../config/strategy.config');
const ipWhitelist = require('../config/ipWhitelist.config');

const axios = require('axios').default;

class AdapterController {

    async determineStrategy(req, res, next) {
        //  tradingViewData - data from tV webhook req
        const tradingViewData = req.body;

        console.log("-----------tradingViewData----------------\n");
        console.log(tradingViewData);
        console.log("-----------tradingViewData----------------\n");

        //  Validate IP address
        const isTradingViewIp = ipWhitelist.some(ip => req.connection.remoteAddress.includes(ip));

        //  Determine strategy association with tradingView data.
        //  Note: strategy.config should include such tradingViewData.strategy
        const currentStrategy = strategies.filter(strategy => strategy.strategy_name === tradingViewData.strategy_name)[0];

        if (typeof currentStrategy !== 'undefined' && isTradingViewIp) {
            //  Initiate a request to close a previous position, and then send an actual request to open a position.
            if (currentStrategy.use_close_calls_feature == true) {
                let close_data = tradingViewData;

                if (tradingViewData.Action == "long") {
                    close_data.Action = "close_short";
                }
                else {
                    close_data.Action = "close_long";
                }

                console.log("-----------close_data----------------\n");
                console.log(close_data);
                console.log("-----------close_data----------------\n");

                sendStrategyExecutorCoreRequest(currentStrategy, close_data);
                sendStrategyExecutorCoreRequest(currentStrategy, tradingViewData)
            }
            else {
                sendStrategyExecutorCoreRequest(currentStrategy, tradingViewData)
            }

        }
        else {
            res.status(400).send(`Strategy: ${currentStrategy} ipFlag: ${isTradingViewIp}`);
        }
    }

    async sendStrategyExecutorCoreRequest(currentStrategy, tradingViewData) {
        //Rote tradingViewData to associated tradingView server
        const [sendRequestError, sendRequest] = await to(
            axios.post(`${currentStrategy.serverIp}:${tradingViewData.Mode === "master" ? currentStrategy.master_port : currentStrategy.development_port}/alert_data`, tradingViewData)
        )

        if (sendRequestError) {
            console.log(sendRequestError);
            return res.status(400).json(sendRequestError);
        }

        console.log(sendRequest.data);
        res.status(200).json(sendRequest.data);
    }
}

module.exports = new AdapterController();
