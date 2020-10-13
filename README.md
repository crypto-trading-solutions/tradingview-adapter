# tradingview-adapter

tradingview-adapter is a node.js application for handling data from Trading View webhooks and route it to associated strategies servers.

## Installation

Use npm.

```bash
npm install 
```

## Usage

1) Determine ```.env``` file for the local server as in ```.env.example```
2) Edit ```strategy.config.js``` for your own strategies servers configuration.
3) Recommended payload for Trading View alert webhook:

```yaml 
{
"Ticker"  : "{{ticker}}",
"Price"   : "{{strategy.order.price}}",
"Time"    : "{{time}}",
"Strategy": "strategy name",
"Action"  : "long || short || close_long || close_short"
"Mode"    : "development" || "master"
}
```
NOTE: 
Ticker - Use ticker name as on exchange! Not always Tradingview has the same ticker name, for example, Tradingview ticker - *BTCUSDTPERP* | Binance futures ticker - *BTCUSDT* *use this one.

Action - You can use {{strategy.order.alert_message}} + set alert_message in pine script (v4+)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)
