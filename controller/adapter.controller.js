const to = require('await-to-js').default;
const strategies = require('../config/strategy.config');
const axios = require('axios').default;

class AdapterController {

    async determineStrategy(req, res, next) {

        const tradingViewData = req.body;

        let currentStrategy = {};

        for (let i = 0; i < strategies.length; i++) {

            if (strategies[i].Strategy === tradingViewData.Strategy) {
                currentStrategy = strategies[i];
                break;
            }
        }

        const [sendRequestError, sendRequest] = await to(
            axios.post(`${currentStrategy.Server_ip}:${currentStrategy.Port}/alert_data`, currentStrategy)
        )

        if (sendRequestError) return res.status(400).json(sendRequestError);

        res.status(200).json(sendRequest.data);
    }
}

module.exports = new AdapterController();