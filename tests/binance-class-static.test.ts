import Binance from '../src/node-binance-api';
import { assert } from 'chai';
import util from 'util';
import nock from 'nock';

const binance = new Binance({
    APIKEY: 'XXXXXXXXXXXXXXXXXXXXXXX',
    APISECRET: 'YYYYYYYYYYYYYYYYYYYYYY',
})


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
        try {
            await binance.candlesticks( 'BTCUSDT' )
        } catch (e) {
            // console.log(e)
        }
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=500' )

    })

    it( 'Futures OHLCVS', async function ( ) {
        try {
            await binance.futuresCandles( 'BTCUSDT' )
        } catch (e) {
            // console.log(e)
        }
        assert.equal( interceptedUrl, 'https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=30m' )

    })

    it( 'Recent Trades', async function ( ) {
        try {
            await binance.recentTrades( 'BTCUSDT' )
        } catch (e) {
            // console.log(e)
        }
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=500' )
    })

    it( 'Agg Trades', async function ( ) {
        try {
            await binance.aggTrades( 'BTCUSDT' )
        } catch (e) {
            // console.log(e)
        }
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/aggTrades?symbol=BTCUSDT' )

    })

    it( 'FuturesTrades', async function ( ) {
        await binance.futuresTrades( 'BTCUSDT' )
        assert.equal( interceptedUrl, 'https://fapi.binance.com/fapi/v1/trades?symbol=BTCUSDT' )
    })

    it( 'FuturesAggTrades', async function ( ) {
        try {
            await binance.futuresAggTrades( 'BTCUSDT' )
        } catch (e) {
            // console.log(e)
        }
        assert.equal( interceptedUrl, 'https://fapi.binance.com/fapi/v1/aggTrades?symbol=BTCUSDT' )
    })

    it( 'PositionRisk V3', async function ( ) {
        await binance.futuresPositionRisk()
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v3/positionRisk') )

    })

    it( 'PositionRisk V2', async function ( ) {
        await binance.futuresPositionRiskV2()
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v2/positionRisk') )

    })

    it( 'CancelOrder', async function ( ) {
        await binance.cancel( 'LTCUSDT', '34234234' )
        assert( interceptedUrl.startsWith('https://api.binance.com/api/v3/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://api.binance.com/api/v3/order', '') )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.orderId, '34234234')
    })

    it( 'Futures CancelOrder', async function ( ) {
        await binance.futuresCancel( 'LTCUSDT', '34234234')
        assert( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/order'))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/order', '') )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.orderId, '34234234')
    })

    const SPOT_PREFIX = "x-B3AUXNYV"

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
        await binance.order('LIMIT', 'BUY', 'LTCUSDT', 0.5 )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/order' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(SPOT_PREFIX))
    })

    it( 'LimitSell', async function ( ) {
        await binance.order('LIMIT', 'SELL', 'LTCUSDT', 0.5 )
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/order' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'SELL' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(SPOT_PREFIX))
    })

    it( 'cancel order', async function ( ) {
        await binance.cancel( 'LTCUSDT', '34234234' )
        const url = 'https://api.binance.com/api/v3/order'
        assert.isTrue( interceptedUrl.startsWith(url) )
        const obj = urlToObject( interceptedUrl.replace(url, '') )
        assert.equal( obj.orderId, '34234234' )
        assert.equal( obj.symbol, 'LTCUSDT' )
    })

    const CONTRACT_PREFIX = "x-ftGmvgAN"

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
        await binance.futuresOrder('LIMIT', 'BUY', 'LTCUSDT', 0.5, 100 )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/order?', '')  )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(CONTRACT_PREFIX))
    })

    it( 'Futures Limit trigger Buy', async function ( ) {
        await binance.futuresOrder('STOP', 'BUY', 'LTCUSDT', 0.5, 100, {'triggerPrice': 90} )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/algoOrder' ))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/algoOrder?', '')  )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'STOP' )
        assert.equal( obj.algoType, 'CONDITIONAL')
        assert.equal( obj.quantity, 0.5 )
        assert(obj.clientAlgoId.startsWith(CONTRACT_PREFIX))
    })

    it( 'Futures Limit trigger Buy using dedicated endpoint', async function ( ) {
        await binance.futuresAlgoOrder('STOP', 'BUY', 'LTCUSDT', 0.5, 100, {'triggerPrice': 90} )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/algoOrder' ))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/algoOrder?', '')  )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'STOP' )
        assert.equal( obj.algoType, 'CONDITIONAL')
        assert.equal( obj.quantity, 0.5 )
        assert(obj.clientAlgoId.startsWith(CONTRACT_PREFIX))
    })

    it( 'Futures LimitSell', async function ( ) {
        await binance.futuresOrder('LIMIT', 'SELL', 'LTCUSDT', 0.5, 100 )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://fapi.binance.com/fapi/v1/order?', '')  )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'SELL' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(CONTRACT_PREFIX))
    })

    it( 'cancel order', async function ( ) {
        await binance.futuresCancel( 'LTCUSDT', '34234234' )
        const url = 'https://fapi.binance.com/fapi/v1/order'
        assert.isTrue( interceptedUrl.startsWith(url) )
        const obj = urlToObject( interceptedUrl.replace(url, '') )
        assert.equal( obj.orderId, '34234234' )
        assert.equal( obj.symbol, 'LTCUSDT' )
    })

    it( 'MarketBuy test', async function ( ) {
        await binance.marketBuy( 'LTCUSDT', 0.5, {'test': true})
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/order/test' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'MARKET' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(SPOT_PREFIX))
    })

    it( 'spot open orders', async function ( ) {
        await binance.openOrders( 'LTCUSDT')
        assert.isTrue( interceptedUrl.startsWith('https://api.binance.com/api/v3/openOrders' ))
    })

    it( 'margin open orders', async function ( ) {
        await binance.mgOpenOrders( 'LTCUSDT')
        assert.isTrue( interceptedUrl.startsWith('https://api.binance.com/sapi/v1/margin/openOrders' ))
    })

    it( 'Margin MarketBuy order', async function ( ) {
        await binance.mgMarketBuy( 'LTCUSDT', 0.5)
        assert.equal( interceptedUrl, 'https://api.binance.com/sapi/v1/margin/order' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'MARKET' )
        assert.equal( obj.quantity, 0.5 )
        assert(obj.newClientOrderId.startsWith(SPOT_PREFIX))
    })

    it( 'spot order with custom clientorderId', async function ( ) {
        await binance.order( 'LIMIT', 'BUY', 'LTCUSDT', 0.5, 100, {'newClientOrderId': 'myid'})
        assert.equal( interceptedUrl, 'https://api.binance.com/api/v3/order' )
        const obj = urlToObject( interceptedBody )
        assert.equal( obj.symbol, 'LTCUSDT' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'LIMIT' )
        assert.equal( obj.quantity, 0.5 )
        assert.equal( obj.price, 100 )
        assert.equal( obj.newClientOrderId, 'myid')
    })

    it( 'delivery OrderBook', async function ( ) {
        await binance.deliveryDepth( 'BTCUSD_PERP' )
        assert.equal( interceptedUrl, 'https://dapi.binance.com/dapi/v1/depth?symbol=BTCUSD_PERP' )

    })


    it( 'futures ser leverage', async function ( ) {
        await binance.futuresLeverage( 'BTCUSDT', 5 )
        assert.isTrue( interceptedUrl.startsWith('https://fapi.binance.com/fapi/v1/leverage?symbol=BTCUSDT&leverage=5' ))
    })

    it( 'delivery MarketBuy', async function ( ) {
        await binance.deliveryOrder( 'MARKET', 'BUY', 'BTCUSD_PERP', 0.1 )
        assert.isTrue( interceptedUrl.startsWith('https://dapi.binance.com/dapi/v1/order' ))
        const obj = urlToObject( interceptedUrl.replace('https://dapi.binance.com/dapi/v1/order', '') )
        assert.equal( obj.symbol, 'BTCUSD_PERP' )
        assert.equal( obj.side, 'BUY' )
        assert.equal( obj.type, 'MARKET' )
        assert.equal( obj.quantity, 0.1 )
        assert(obj.newClientOrderId.startsWith(CONTRACT_PREFIX))
    })

})