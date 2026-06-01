import Binance from '../src/node-binance-api';
import { assert } from 'chai';

const TIMEOUT = 30000;

// Production instance (no auth needed for public/market streams)
const binance = new Binance();

// Demo instance for private stream test
const demoBinance = new Binance().options({
    APIKEY: process.env.BINANCE_APIKEY || '',
    APISECRET: process.env.BINANCE_SECRET || '',
    demo: true,
});

const stopSockets = function (instance) {
    const endpoints = instance.websockets.subscriptions();
    for (const endpoint in endpoints) {
        instance.websockets.terminate(endpoint);
    }
};

describe('classifyFuturesStream', function () {
    it('classifies bookTicker as public', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@bookTicker'), 'public');
        assert.equal(binance.classifyFuturesStream('!bookTicker'), 'public');
    });

    it('classifies depth streams as public', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@depth'), 'public');
        assert.equal(binance.classifyFuturesStream('btcusdt@depth@100ms'), 'public');
        assert.equal(binance.classifyFuturesStream('btcusdt@depth@500ms'), 'public');
        assert.equal(binance.classifyFuturesStream('btcusdt@depth5'), 'public');
        assert.equal(binance.classifyFuturesStream('btcusdt@depth10'), 'public');
        assert.equal(binance.classifyFuturesStream('btcusdt@depth20'), 'public');
        assert.equal(binance.classifyFuturesStream('btcusdt@depth5@100ms'), 'public');
    });

    it('classifies aggTrade as market', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@aggTrade'), 'market');
    });

    it('classifies markPrice as market', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@markPrice'), 'market');
        assert.equal(binance.classifyFuturesStream('btcusdt@markPrice@1s'), 'market');
        assert.equal(binance.classifyFuturesStream('!markPrice@arr'), 'market');
        assert.equal(binance.classifyFuturesStream('!markPrice@arr@1s'), 'market');
    });

    it('classifies kline as market', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@kline_1m'), 'market');
    });

    it('classifies ticker as market', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@ticker'), 'market');
        assert.equal(binance.classifyFuturesStream('!ticker@arr'), 'market');
    });

    it('classifies miniTicker as market', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@miniTicker'), 'market');
        assert.equal(binance.classifyFuturesStream('!miniTicker@arr'), 'market');
    });

    it('classifies forceOrder as market', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@forceOrder'), 'market');
        assert.equal(binance.classifyFuturesStream('!forceOrder@arr'), 'market');
    });

    it('classifies compositeIndex as market', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@compositeIndex'), 'market');
    });

    it('classifies contractInfo as market', function () {
        assert.equal(binance.classifyFuturesStream('!contractInfo'), 'market');
    });

    it('classifies assetIndex as market', function () {
        assert.equal(binance.classifyFuturesStream('btcusdt@assetIndex'), 'market');
        assert.equal(binance.classifyFuturesStream('!assetIndex@arr'), 'market');
    });

    it('classifies listenKey as private', function () {
        assert.equal(binance.classifyFuturesStream('pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a1a65a1a5s61cv6a81va65sd'), 'private');
    });
});

describe('getFStreamSingleUrl with category', function () {
    it('returns public ws URL', function () {
        assert.equal(binance.getFStreamSingleUrl('public'), 'wss://fstream.binance.com/public/ws/');
    });
    it('returns market ws URL', function () {
        assert.equal(binance.getFStreamSingleUrl('market'), 'wss://fstream.binance.com/market/ws/');
    });
    it('returns private ws URL', function () {
        assert.equal(binance.getFStreamSingleUrl('private'), 'wss://fstream.binance.com/private/ws/');
    });
    it('returns legacy URL without category', function () {
        assert.equal(binance.getFStreamSingleUrl(), 'wss://fstream.binance.com/ws/');
    });
});

describe('getFStreamUrl with category', function () {
    it('returns public stream URL', function () {
        assert.equal(binance.getFStreamUrl('public'), 'wss://fstream.binance.com/public/stream?streams=');
    });
    it('returns market stream URL', function () {
        assert.equal(binance.getFStreamUrl('market'), 'wss://fstream.binance.com/market/stream?streams=');
    });
    it('returns private stream URL', function () {
        assert.equal(binance.getFStreamUrl('private'), 'wss://fstream.binance.com/private/stream?streams=');
    });
    it('returns legacy URL without category', function () {
        assert.equal(binance.getFStreamUrl(), 'wss://fstream.binance.com/stream?streams=');
    });
});

describe('Demo mode uses category-based URLs', function () {
    it('getFStreamSingleUrl returns demo URL with category', function () {
        assert.equal(demoBinance.getFStreamSingleUrl('public'), 'wss://fstream.binancefuture.com/public/ws/');
        assert.equal(demoBinance.getFStreamSingleUrl('market'), 'wss://fstream.binancefuture.com/market/ws/');
        assert.equal(demoBinance.getFStreamSingleUrl('private'), 'wss://fstream.binancefuture.com/private/ws/');
    });
    it('getFStreamUrl returns demo URL with category', function () {
        assert.equal(demoBinance.getFStreamUrl('public'), 'wss://fstream.binancefuture.com/public/stream?streams=');
        assert.equal(demoBinance.getFStreamUrl('market'), 'wss://fstream.binancefuture.com/market/stream?streams=');
        assert.equal(demoBinance.getFStreamUrl('private'), 'wss://fstream.binancefuture.com/private/stream?streams=');
    });
    it('getFStreamSingleUrl returns legacy demo URL without category', function () {
        assert.equal(demoBinance.getFStreamSingleUrl(), 'wss://fstream.binancefuture.com/ws/');
    });
    it('getFStreamUrl returns legacy demo URL without category', function () {
        assert.equal(demoBinance.getFStreamUrl(), 'wss://fstream.binancefuture.com/stream?streams=');
    });
});

describe('Private stream URL uses query params for listenKey', function () {
    it('constructs ?listenKey= URL instead of path-based', function () {
        const listenKey = 'pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a1a65a1a5s61cv6a81va65sd';
        const category = binance.classifyFuturesStream(listenKey);
        const baseUrl = binance.getFStreamSingleUrl(category);
        const wsUrl = baseUrl.replace(/\/$/, '') + '?listenKey=' + listenKey;
        assert.equal(category, 'private');
        assert.equal(wsUrl, `wss://fstream.binance.com/private/ws?listenKey=${listenKey}`);
    });

    it('constructs query-param URL for demo too', function () {
        const listenKey = 'pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a1a65a1a5s61cv6a81va65sd';
        const category = demoBinance.classifyFuturesStream(listenKey);
        const baseUrl = demoBinance.getFStreamSingleUrl(category);
        const wsUrl = baseUrl.replace(/\/$/, '') + '?listenKey=' + listenKey;
        assert.equal(wsUrl, `wss://fstream.binancefuture.com/private/ws?listenKey=${listenKey}`);
    });
});

describe('futuresSubscribe rejects mixed-category combined streams', function () {
    const listenKey = 'pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a1a65a1a5s61cv6a81va65sd';

    it('throws when mixing market and public streams', function () {
        assert.throws(
            () => binance.futuresSubscribe(['btcusdt@aggTrade', 'btcusdt@depth'], () => { }),
            /cannot combine/
        );
    });

    it('throws when mixing public and private streams', function () {
        assert.throws(
            () => binance.futuresSubscribe(['btcusdt@bookTicker', listenKey], () => { }),
            /cannot combine/
        );
    });

    it('names both offending categories in the error message', function () {
        try {
            binance.futuresSubscribe(['btcusdt@markPrice', 'btcusdt@bookTicker'], () => { });
            assert.fail('expected futuresSubscribe to throw');
        } catch (e) {
            assert.match(e.message, /market/);
            assert.match(e.message, /public/);
        }
    });
});

describe('Live: production market stream (aggTrade via /market/)', function () {
    let trade;
    let cnt = 0;

    beforeEach(function (done) {
        this.timeout(TIMEOUT);
        binance.futuresAggTradeStream('BTCUSDT', a_trade => {
            cnt++;
            if (cnt > 1) return;
            trade = a_trade;
            stopSockets(binance);
            done();
        });
    });

    it('receives aggTrade data from /market/ endpoint', function () {
        assert(typeof trade === 'object', 'should be an object');
        assert(trade !== null, 'should not be null');
        assert(Object.prototype.hasOwnProperty.call(trade, 'symbol'), 'should have symbol');
        assert(Object.prototype.hasOwnProperty.call(trade, 'price'), 'should have price');
    });
});

describe('Live: production public stream (bookTicker via /public/)', function () {
    let ticker;
    let cnt = 0;

    beforeEach(function (done) {
        this.timeout(TIMEOUT);
        binance.futuresBookTickerStream('BTCUSDT', a_ticker => {
            cnt++;
            if (cnt > 1) return;
            ticker = a_ticker;
            stopSockets(binance);
            done();
        });
    });

    it('receives bookTicker data from /public/ endpoint', function () {
        assert(typeof ticker === 'object', 'should be an object');
        assert(ticker !== null, 'should not be null');
        assert(Object.prototype.hasOwnProperty.call(ticker, 'bestBid'), 'should have bestBid');
        assert(Object.prototype.hasOwnProperty.call(ticker, 'bestAsk'), 'should have bestAsk');
    });
});

describe('Live: demo private stream (userFutureData via /private/)', function () {
    let endpoint;

    beforeEach(function (done) {
        this.timeout(TIMEOUT);
        demoBinance.userFutureData(
            undefined,  // all_updates_callback
            undefined,  // margin_call_callback
            undefined,  // account_update_callback
            undefined,  // order_update_callback
            (a_endpoint) => {  // subscribed_callback
                endpoint = a_endpoint;
                stopSockets(demoBinance);
                done();
            }
        );
    });

    it('connects to private user data stream successfully', function () {
        assert(endpoint !== undefined, 'should have received subscription endpoint');
        assert(typeof endpoint === 'string', 'endpoint should be a string');
    });
});

describe('Live: production combined market stream (kline via /market/)', function () {
    let candle;
    let cnt = 0;

    beforeEach(function (done) {
        this.timeout(TIMEOUT);
        binance.futuresCandlesticksStream(['BTCUSDT'], '1m', a_candle => {
            cnt++;
            if (cnt > 1) return;
            candle = a_candle;
            stopSockets(binance);
            done();
        });
    });

    it('receives kline data from /market/ combined stream', function () {
        assert(typeof candle === 'object', 'should be an object');
        assert(candle !== null, 'should not be null');
        assert(Object.prototype.hasOwnProperty.call(candle, 'k'), 'should have kline data');
    });
});
