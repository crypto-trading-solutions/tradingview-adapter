const to = require('await-to-js').default;
const strategies = require('../config/strategy.config');
const axios = require('axios').default;

class AdapterController {

    async determineStrategy(req, res, next) {

        const tradingViewData = req.body;

        console.log("req.remoteAddress:");
        console.log(req.connection.remoteAddress);

        console.log("tradingViewData:");
        console.log(tradingViewData);

        const currentStrategy = strategies.filter(strategy => strategy.strategy === tradingViewData.strategy);

        if (result.length == 1) {

            const [sendRequestError, sendRequest] = await to(
                axios.post(`${currentStrategy.serverIp}:
                ${tradingViewData.mode === "master" ? currentStrategy.master_port : currentStrategy.development_port}/alert_data`, tradingViewData)
            )

            console.log(sendRequestError);

            if (sendRequestError) return res.status(400).json(sendRequestError);

            res.status(200).json(sendRequest.data);
        }
        else {
            return res.status(400).json(sendRequestError);
        }
    }
}

module.exports = new AdapterController();