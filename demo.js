const Binance = require( './node-binance-api.js' );

async function run() {
    const exchange = new Binance();
    const res = await exchange.futuresTime();
    console.log( res );
}


run();
