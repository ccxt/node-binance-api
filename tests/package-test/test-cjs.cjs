const Binance = require('node-binance-api');

const client = new Binance({test: true, httpsProxy: 'http://188.245.226.105:8911'})

async function main() {
    const ticker = await client.prices('BTCUSDT')
    console.log(ticker)
}

main()