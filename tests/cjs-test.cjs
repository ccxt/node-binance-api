const path = require( 'path' );
const chai = require( 'chai' );
const assert = chai.assert;
const Binance = require( path.resolve( __dirname, '../node-binance-api.js' ) );

const apiKey = 'XXXXXXXXXXXXXXXX'
const apiSecret = 'YYYYYYYYYYYYYYYYYYYYYY'

const binanceWithoutNew = Binance().options({
    APIKEY: apiKey,
    APISECRET: apiSecret,
})

assert(binanceWithoutNew.getOptions().APIKEY === apiKey)
assert(binanceWithoutNew.getOptions().APISECRET === apiSecret)

const binanceWithOptions = new Binance().options({
    APIKEY: apiKey,
    APISECRET: apiSecret,
})

assert(binanceWithOptions.getOptions().APIKEY === apiKey)
assert(binanceWithOptions.getOptions().APISECRET === apiSecret)

const binance = new Binance({
    APIKEY: apiKey,
    APISECRET: apiSecret,
});

assert(binance.getOptions().APIKEY === apiKey)
assert(binance.getOptions().APISECRET === apiSecret)


// async function main() {
//     const ticker = await binanceWithOptions.prices( 'BNBBTC' )
//     console.log(ticker)
// }
