import chai from 'chai';
import path from 'path';
import utils from 'util';
import Binance from  '../node-binance-api.js'
import nock from 'nock';
const assert = chai.assert;

const binance = new Binance({
    APIKEY: 'XXXXXXXXXXXXXXXXXXXXXXX',
    APISECRET: 'YYYYYYYYYYYYYYYYYYYYYY',
})

const debug = function ( x ) {
    if ( typeof ( process.env.node_binance_api ) === 'undefined' ) {
        return;
    }
    logger.log( typeof ( x ) );
    logger.log( util.inspect( x ) );
}

function urlToObject(queryString) {
    const params = new URLSearchParams(queryString);
    const obj = Object.fromEntries(params.entries());
    return obj;
}

describe( 'Static tests', async function () {

    let interceptedUrl = null;
    let interceptedBody = null;

    beforeEach(() => {

        interceptedUrl = null;
        interceptedBody = null;
        nock(/.*/)
            .get(/.*/)
            .reply(200, function (uri, requestBody) {
                interceptedUrl =  `${this.req.options.proto}://${this.req.options.hostname}${uri}`;
                interceptedBody = requestBody; // Capture the request body
                return { success: true };
            });
        nock(/.*/)
            .post(/.*/)
            .reply(200, function (uri, requestBody) {
                interceptedUrl =  `${this.req.options.proto}://${this.req.options.hostname}${uri}`;
                interceptedBody = requestBody; // Capture the request body
                return { success: true };
            });
        nock(/.*/)
            .delete(/.*/)
            .reply(200, function (uri, requestBody) {
                interceptedUrl =  `${this.req.options.proto}://${this.req.options.hostname}${uri}`;
                interceptedBody = requestBody; // Capture the request body
                return { success: true };
            });
    });

    it( 'FetchTicker', async function ( ) {
        await binance.prices( 'BNBBTC' )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/ticker/price?symbol=BNBBTC' )

    })

    it( 'FetchOrderBook', async function ( ) {
        await binance.depth( 'BTCUSDT' )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=100' )

    })

    it( 'Futures OrderBook', async function ( ) {
        await binance.futuresDepth( 'BTCUSDT' )
        assert.equal( interceptedUrl, 'https://fapi.binance.com/fapi/v1/depth?symbol=BTCUSDT' )

    })

    it( 'OHLCVS', async function ( ) {
        await binance.candlesticks( 'BTCUSDT' )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=500' )

    })

    it( 'Futures OHLCVS', async function ( ) {
        await binance.futuresCandles( 'BTCUSDT' )
        assert.equal( interceptedUrl, 'https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=30m' )

    })

    it( 'Trades', async function ( ) {
        await binance.aggTrades( 'BTCUSDT' )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/aggTrades?symbol=BTCUSDT' )

    })

    it( 'FuturesTrades', async function ( ) {
        await binance.futuresTrades( 'BTCUSDT' )
        assert.equal( interceptedUrl, 'https://fapi.binance.com/fapi/v1/trades?symbol=BTCUSDT' )

    })

    it( 'CancelOrder', async function ( ) {
        await binance.cancel( 'LTCUSDT', '34234234' )
        assert( interceptedUrl.startsWith('https://api.binance.com/api/v3/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://api.binance.com/api/v3/order', '') )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.orderId, '34234234')
    })

    it( 'Futures CancelOrder', async function ( ) {
        await binance.futuresCancel( 'LTCUSDT', {'orderId': '34234234' })
        assert( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/order'))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/order', '') )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.orderId, '34234234')
    })

    const SPOT_PREFIX = "x-HNA2TXFJ"

    it( 'MarketBuy', async function ( ) {
        await binance.marketBuy( 'LTCUSDT', 0.5 )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/order' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'MARKET' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(SPOT_PREFIX))
    })

    it( 'MarketSell', async function ( ) {
        await binance.marketSell( 'LTCUSDT', 0.5 )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/order' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'SELL' )
        assert.equal( obj.type, 'MARKET' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(SPOT_PREFIX))
    })

    it( 'LimitBuy', async function ( ) {
        await binance.order( 'BUY', 'LTCUSDT', 0.5 )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/order' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(SPOT_PREFIX))
    })

    it( 'LimitSell', async function ( ) {
        await binance.order( 'SELL', 'LTCUSDT', 0.5 )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/order' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'SELL' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(SPOT_PREFIX))
    })

    const CONTRACT_PREFIX = "x-Cb7ytekJ"

    it( 'Futures MarketBuy', async function ( ) {
        await binance.futuresMarketBuy( 'LTCUSDT', 0.5 )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/order?', '') )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'MARKET' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(CONTRACT_PREFIX))
    })

    it( 'Futures MarketSell', async function ( ) {
        await binance.futuresMarketSell( 'LTCUSDT', 0.5 )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/order?', '')  )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'SELL' )
        assert.equal( obj.type, 'MARKET' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(CONTRACT_PREFIX))
    })

    it( 'Futures LimitBuy', async function ( ) {
        await binance.futuresOrder( 'BUY', 'LTCUSDT', 0.5, 100 )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/order?', '')  )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(CONTRACT_PREFIX))
    })

    it( 'Futures LimitSell', async function ( ) {
        await binance.futuresOrder( 'SELL', 'LTCUSDT', 0.5, 100 )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/order?', '')  )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'SELL' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(CONTRACT_PREFIX))
    })
})