const to = require('await-to-js').default;
const strategies = require('../config/strategy.config');
const ipWhitelist = require('../config/ipWhitelist.config');

const axios = require('axios').default;

class AdapterController {
    //  tV - tradingView
    async determineStrategy(req, res, next) {
        //  tradingViewData - data from tV webhook req
        const tradingViewData = req.body;

        //  Validate IP address
        let isTradingViewIp = ipWhitelist.some(ip => req.connection.remoteAddress.includes(ip));
        if(tradingViewData.mode === "development") isTradingViewIp = true;

        //  Determine strategy association with tV data.
        //  Note: strategy.config should include such tradingViewData.strategy
        const currentStrategy = strategies.filter(strategy => strategy.strategy === tradingViewData.strategy)[0];

        console.log(currentStrategy);

        if (typeof currentStrategy !== 'undefined' && isTradingViewIp) {
            //Rote tradingViewData to associated strategy server
            const [sendRequestError, sendRequest] = await to(
                axios.post(`${currentStrategy.serverIp}:${tradingViewData.mode === "master" ? currentStrategy.masterPort : currentStrategy.developmentPort}/alert_data`, tradingViewData)
            )

            if (sendRequestError) {
                console.log(sendRequestError);
                return res.status(400).json(sendRequestError);
            }

            res.status(200).json(sendRequest.data);
        }
        else {
            res.status(400).send({
                'strategy':`Strategy: ${currentStrategy}`,
                'ipFlag': isTradingViewIp
            });
        }
    }
}

module.exports = new AdapterController();