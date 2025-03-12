/* ============================================================
 * node-binance-api
 * https://github.com/jaggedsoft/node-binance-api
 * ============================================================
 * Copyright 2017-, Jon Eyrick
 * Released under the MIT License
 * ============================================================ */

'use strict';

const WARN_SHOULD_BE_OBJ = 'should be an object';
const WARN_SHOULD_BE_NULL = 'should be null';
const WARN_SHOULD_BE_NOT_NULL = 'should not be null';
const WARN_SHOULD_HAVE_KEY = 'should have key ';
const WARN_SHOULD_NOT_HAVE_KEY = 'should not have key ';
const WARN_SHOULD_BE_UNDEFINED = 'should be undefined';
const WARN_SHOULD_BE_TYPE = 'should be a ';
const TIMEOUT = 10000;

const chai = require( 'chai' );
const assert = chai.assert;
const path = require( 'path' );
const Binance = require( path.resolve( __dirname, '../node-binance-api.js' ) );
const binance = new Binance().options( {
    APIKEY: 'X4BHNSimXOK6RKs2FcKqExquJtHjMxz5hWqF0BBeVnfa5bKFMk7X0wtkfEz0cPrJ',
    APISECRET: 'x8gLihunpNq0d46F2q0TWJmeCDahX5LMXSlv3lSFNbMI3rujSOpTDKdhbcmPSf2i',
    test: true
} );
const futuresBinance = new Binance().options( {
    APIKEY: '227719da8d8499e8d3461587d19f259c0b39c2b462a77c9b748a6119abd74401',
    APISECRET: 'b14b935f9cfacc5dec829008733c40da0588051f29a44625c34967b45c11d73c',
    hedgeMode: true,
    test: true
} );
// binance.options.APIKEY = "X4BHNSimXOK6RKs2FcKqExquJtHjMxz5hWqF0BBeVnfa5bKFMk7X0wtkfEz0cPrJ"
// binance.options.APISECRET = "x8gLihunpNq0d46F2q0TWJmeCDahX5LMXSlv3lSFNbMI3rujSOpTDKdhbcmPSf2i"
// binance.options.test = true;
let util = require( 'util' );

let num_pairs = 299;
let num_currencies = 155;

let logger = {
    log: function ( msg ) {
        let logLineDetails = ( ( new Error().stack ).split( 'at ' )[3] ).trim();
        let logLineNum = logLineDetails.split( ':' );
        console.log( 'DEBUG', logLineNum[1] + ':' + logLineNum[2], msg );
    }
}

let debug = function ( x ) {
    if ( typeof ( process.env.node_binance_api ) === 'undefined' ) {
        return;
    }
    logger.log( typeof ( x ) );
    logger.log( util.inspect( x ) );
}

let stopSockets = function ( log = false ) {
    //stopSocketsRunning = true;
    let endpoints = binance.websockets.subscriptions();
    for ( let endpoint in endpoints ) {
        if ( log ) console.log( 'Terminated ws endpoint: ' + endpoint );
        binance.websockets.terminate( endpoint );
    }
}

debug( 'Begin' );

/*global describe*/
/*eslint no-undef: "error"*/
describe( 'Construct', function () {
    /*global it*/
    /*eslint no-undef: "error"*/
    it( 'Construct the binance object', function ( done ) {
        binance.options( {
            APIKEY: 'X4BHNSimXOK6RKs2FcKqExquJtHjMxz5hWqF0BBeVnfa5bKFMk7X0wtkfEz0cPrJ',
            APISECRET: 'x8gLihunpNq0d46F2q0TWJmeCDahX5LMXSlv3lSFNbMI3rujSOpTDKdhbcmPSf2i',
            useServerTime: true,
            reconnect: false,
            verbose: true,
            test: true,
            log: debug
        } );
        assert( typeof ( binance ) === 'object', 'Binance is not an object' );
        done();
    } ).timeout( TIMEOUT );

    it( 'Construct the binance object in various ways', function () {

        let keyOffset = 1000;
        let key = keyOffset;
        let secret = "secret";

        // Every variant is listed twice to make sure that the options are not shared (which happened in the past)
        let objs = [
            new Binance().options( { APIKEY: key++, APISECRET: secret } ),
            new Binance().options( { APIKEY: key++, APISECRET: secret } ),
            Binance().options( { APIKEY: key++, APISECRET: secret } ),
            Binance().options( { APIKEY: key++, APISECRET: secret } ),
            new Binance( { APIKEY: key++, APISECRET: secret } ),
            new Binance( { APIKEY: key++, APISECRET: secret } ),
            Binance( { APIKEY: key++, APISECRET: secret } ),
            Binance( { APIKEY: key++, APISECRET: secret } ),
        ];

        // Make sure that all objects have their own options
        for ( let i = 0; i < objs.length; i++ ) {
            let expectedKey = keyOffset + i;
            let actualKey = objs[i].getOption( "APIKEY" );
            assert( expectedKey === actualKey, `APIKEY: ${ expectedKey } != ${ actualKey }` );
        }

    } );

} );


describe( 'UseServerTime', function () {
    it( 'Call use server time', function ( done ) {
        binance.useServerTime();
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'Prices', function () {
    it( 'Checks the price of BNBBTC', async function () {
        const ticker = await binance.prices( 'BNBBTC' )
        assert( typeof ( ticker ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( Object.prototype.hasOwnProperty.call( ticker, 'BNBBTC' ), WARN_SHOULD_HAVE_KEY + 'BNBBTC' );
        assert( Object.prototype.hasOwnProperty.call( ticker, 'ETHBTC' ) === false, WARN_SHOULD_NOT_HAVE_KEY + 'ETHBTC' );
    } ).timeout( TIMEOUT );
} );

describe( 'All Prices', function () {
    it( 'Checks the prices of coin pairs', async function  () {
        const ticker = await binance.prices();
        assert( typeof ( ticker ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
    } ).timeout( TIMEOUT );
} );

describe( 'Balances', function () {
    it( 'Get the balances in the account', async function () {
        const balances = await binance.balance();
        assert( balances !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( balances );
        assert( Object.prototype.hasOwnProperty.call( balances, 'BNB' ), WARN_SHOULD_HAVE_KEY + 'BNB' );
        assert( Object.prototype.hasOwnProperty.call( balances.BNB, 'available' ), WARN_SHOULD_HAVE_KEY + 'available' );
        assert( Object.prototype.hasOwnProperty.call( balances.BNB, 'onOrder' ), WARN_SHOULD_HAVE_KEY + 'onOrder' );
        assert( Object.keys( balances ).length >= num_currencies, 'should at least ' + num_currencies + 'currencies?' );
    } ).timeout( TIMEOUT );
} );

describe( 'Book Ticker', function () {
    it( 'Get the BNB book ticker', async function () {
        const ticker = await binance.bookTickers( 'BNBBTC' )
        assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( ticker );
        let members = [ 'symbol', 'bidPrice', 'bidQty', 'askPrice', 'askQty' ];
        members.forEach( function ( value ) {
            assert( Object.prototype.hasOwnProperty.call( ticker, value ), WARN_SHOULD_HAVE_KEY + value );
        } );
    } ).timeout( TIMEOUT );

    it( 'Get all book tickers', async function () {
        const tickers = await binance.bookTickers( false )
        assert( tickers !== undefined );
    } ).timeout( TIMEOUT );
} );

describe( 'Booker Tickers', function () {
    it( 'Get the tickers for all pairs', function ( done ) {
        binance.bookTickers( ( error, ticker ) => {
            debug( error );
            debug( ticker );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( ticker ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( Object.keys( ticker ).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?' );

            let members = [ 'symbol', 'bidPrice', 'bidQty', 'askPrice', 'askQty' ];
            ticker.forEach( function ( obj ) {
                members.forEach( function ( member ) {
                    assert( Object.prototype.hasOwnProperty.call( obj, member ), WARN_SHOULD_HAVE_KEY + member );
                } );
            } );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Market', function () {
    it( 'Get the market base symbol of a symbol pair', function ( done ) {
        let tocheck = [ 'TRXBNB', 'BNBBTC', 'BNBETH', 'BNBUSDT' ];
        tocheck.forEach( function ( element ) {
            let mark = binance.getMarket( element );
            assert( typeof ( mark ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( element.endsWith( mark ), 'should end with: ' + mark );
        } );

        assert.isNotOk( binance.getMarket( 'ABCDEFG' ), WARN_SHOULD_BE_UNDEFINED );
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'ping', function () {
    it( 'call ping', function ( done ) {
        binance.ping();
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'Depth chart BNB', function () {
    it( 'Get the depth chart information for BNBBTC', function ( done ) {
        binance.depth( 'BNBBTC', ( error, depth, symbol ) => {
            debug( error );
            debug( depth );
            debug( symbol );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( depth !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( typeof ( symbol ) === 'string', 'should be type of string' );
            assert( symbol === 'BNBBTC', 'should be BNBBTC' );
            assert( typeof ( depth ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( Object.keys( depth ).length === 3, 'should have length 3' );

            let members = [ 'lastUpdateId', 'asks', 'bids' ];
            members.forEach( function ( value ) {
                assert( Object.prototype.hasOwnProperty.call( depth, value ), WARN_SHOULD_HAVE_KEY + value );
            } );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

// describe( 'Buy', function () {
//     it( 'Attempt to buy ETH', function ( done ) {
//         let quantity = 1;
//         let price = 0.069;
//         assert( typeof ( binance.buy( 'ETHBTC', quantity, price ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED );
//         done();
//     } ).timeout( TIMEOUT );
// } );

// describe( 'Sell', function () {
//     it( 'Attempt to sell ETH', function ( done ) {
//         let quantity = 1;
//         let price = 0.069;
//         assert( typeof ( binance.sell( 'ETHBTC', quantity, price ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED );
//         done();
//     } ).timeout( TIMEOUT );
// } );

describe( 'MarketBuy', function () {
    it( 'Attempt to buy LTC at market price', async function () {
        let quantity = 0.5;
        const res = await binance.marketBuy( 'LTCUSDT', quantity )
        assert( res['orderId'] !== undefined )
    } ).timeout( TIMEOUT );
} );


describe( 'MarketSell', function () {
    it( 'Attempt to buy LTC at market price', async function () {
        let quantity = 0.5;
        const res = await binance.marketSell( 'LTCUSDT', quantity )
        assert( res['orderId'] !== undefined )
    } ).timeout( TIMEOUT );
} );

describe( 'Futures MarketBuy', function () {
    it( 'futures Attempt to buy ETH at market price', async function () {
        let quantity = 0.1;
        const res = await futuresBinance.futuresMarketBuy( 'ETHUSDT', quantity )
        assert( res['orderId'] !== undefined )
    } ).timeout( TIMEOUT );
} );


describe( 'Futures MarketSell', function () {
    it( 'futures Attempt to buy ETH at market price', async function () {
        let quantity = 0.1;
        const res = await futuresBinance.futuresMarketSell( 'ETHUSDT', quantity )
        assert( res['orderId'] !== undefined )
    } ).timeout( TIMEOUT );
} );

// describe( 'MarketSell', function () {
//     it( 'Attempt to sell ETH at market price', function ( done ) {
//         let quantity = 1;
//         assert( typeof ( binance.marketSell( 'ETHBTC', quantity ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED );
//         done();
//     } ).timeout( TIMEOUT );
// } );

// describe( 'Buy order advanced', function () {
//     it( 'Attempt to buy BNB specifying order type', function ( done ) {
//         let type = 'LIMIT';
//         let quantity = 1;
//         let price = 0.069;
//         assert( typeof ( binance.buy( 'BNBETH', quantity, price, { type: type } ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED );
//         done();
//     } ).timeout( TIMEOUT );
// } );

// describe( 'Sell Stop loess', function () {
//     it( 'Attempt to create a stop loss order', function ( done ) {
//         let type = 'STOP_LOSS';
//         let quantity = 1;
//         let price = 0.069;
//         let stopPrice = 0.068;
//         assert( typeof ( binance.sell( 'ETHBTC', quantity, price, { stopPrice: stopPrice, type: type } ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED );
//         done();
//     } ).timeout( TIMEOUT );
// } );

// describe( 'Iceberg sell order', function () {
//     it( 'Attempt to create a sell order', function ( done ) {
//         let quantity = 1;
//         let price = 0.069;
//         assert( typeof ( binance.sell( 'ETHBTC', quantity, price, { icebergQty: 10 } ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED );
//         done();
//     } ).timeout( TIMEOUT );
// } );

describe( 'Cancel order', function () {
    it( 'Attempt to cancel an order', function ( done ) {
        let orderid = '7610385';
        binance.cancel( 'ETHBTC', orderid, ( error, response, symbol ) => {
            debug( error );
            debug( response );
            debug( symbol );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( symbol === 'ETHBTC' );
            assert( error !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( response !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( error.body === '{"code":-2011,"msg":"Unknown order sent."}' );
            assert( typeof ( response.orderId ) === 'undefined', WARN_SHOULD_BE_UNDEFINED );
            assert( Object.keys( response ).length === 0 );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Cancel orders', function () {
    it( 'Attempt to cancel all orders given a symbol', function ( done ) {
        binance.cancelOrders( 'XMRBTC', ( error, response, symbol ) => {
            debug( error );
            // debug( response );
            // debug( symbol );
            assert( typeof ( error ) === 'string', WARN_SHOULD_BE_OBJ );
            assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( symbol === 'XMRBTC' );
            assert( error !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( error === 'No orders present for this symbol', WARN_SHOULD_BE_TYPE + 'string' );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Open Orders', function () {
    it( 'Attempt to show all orders to ETHBTC', function ( done ) {
        binance.openOrders( 'ETHBTC', ( error, openOrders, symbol ) => {
            debug( error );
            debug( openOrders );
            debug( symbol );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( openOrders ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( symbol === 'ETHBTC' );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( openOrders !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( Object.keys( openOrders ).length === 0 );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Open Orders', function () {
    it( 'Attempt to show all orders for all symbols', function ( done ) {
        binance.openOrders( false, ( error, openOrders ) => {
            debug( error );
            debug( openOrders );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( openOrders ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( openOrders !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( Object.keys( openOrders ).length === 0 );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Order status', function () {
    it( 'Attempt to get the order status for a given order id', function ( done ) {
        binance.orderStatus( 'ETHBTC', '1234567890', ( error, orderStatus, symbol ) => {
            debug( error );
            debug( orderStatus );
            debug( symbol );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( orderStatus ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( symbol === 'ETHBTC' );
            assert( error !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( orderStatus !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( error.body === '{"code":-2013,"msg":"Order does not exist."}' );
            assert( Object.keys( orderStatus ).length === 0 );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'trades', function () {
    it( 'Attempt get all trade history for given symbol', function ( done ) {
        binance.trades( 'BTCUSDT', ( error, trades, symbol ) => {
            debug( error );
            debug( trades );
            debug( symbol );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( trades ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( symbol === 'BTCUSDT' );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( trades !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( Object.keys( trades ).length === 0 );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Orders', function () {
    it( 'Attempt get all orders for given symbol', function ( done ) {
        binance.allOrders( 'ETHBTC', ( error, orders, symbol ) => {
            debug( error );
            debug( orders );
            debug( symbol );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( orders ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( symbol === 'ETHBTC' );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( orders !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( Object.keys( orders ).length === 0 );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Prevday all symbols', function () {
    it( 'Attempt get prevday trade status for all symbols', function ( done ) {
        binance.prevDay( false, ( error, prevDay ) => {
            debug( error );
            debug( prevDay );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( prevDay ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( prevDay !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( Object.keys( prevDay ).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?' );

            let members = [
                'symbol', 'priceChange', 'priceChangePercent', 'weightedAvgPrice', 'prevClosePrice',
                'lastPrice', 'lastQty', 'bidPrice', 'bidQty', 'askQty', 'openPrice', 'highPrice', 'lowPrice',
                'volume', 'quoteVolume', 'openTime', 'closeTime', 'firstId', 'lastId', 'count'
            ];
            prevDay.forEach( function ( obj ) {
                members.forEach( function ( key ) {
                    assert( Object.prototype.hasOwnProperty.call( obj, key ), WARN_SHOULD_HAVE_KEY + key );
                } );
            } );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Prevday', function () {
    it( 'Attempt get prevday trade status for given symbol', function ( done ) {
        binance.prevDay( 'BNBBTC', ( error, prevDay, symbol ) => {
            debug( error );
            debug( prevDay );
            debug( symbol );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( prevDay ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( symbol === 'BNBBTC', 'Should be BNBBTC' );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( prevDay !== null, WARN_SHOULD_BE_NOT_NULL );

            let members = [
                'symbol', 'priceChange', 'priceChangePercent', 'weightedAvgPrice', 'prevClosePrice',
                'lastPrice', 'lastQty', 'bidPrice', 'bidQty', 'askQty', 'openPrice', 'highPrice', 'lowPrice',
                'volume', 'quoteVolume', 'openTime', 'closeTime', 'firstId', 'lastId', 'count'
            ];
            members.forEach( function ( key ) {
                assert( Object.prototype.hasOwnProperty.call( prevDay, key ), WARN_SHOULD_HAVE_KEY + key );
            } );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Candle sticks', function () {
    it( 'Attempt get candlesticks for a given symbol', function ( done ) {
        binance.candlesticks( 'BNBBTC', '5m', ( error, ticks, symbol ) => {
            debug( error );
            debug( ticks );
            debug( symbol );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( ticks ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
            assert( symbol === 'BNBBTC', 'Should be BNBBTC' );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( ticks !== null, WARN_SHOULD_BE_NOT_NULL );

            ticks.forEach( function ( tick ) {
                assert( tick.length === 12 );
            } );
            done();
        }, {
            limit: 500,
            endTime: 1514764800000
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Object keys', function () {
    describe( 'First', function () {
        it( 'Gets the first key', function ( done ) {
            let first = binance.first( { first: '1', second: '2', third: '3' } );
            assert.strictEqual( 'first', first, 'should be first' );
            done();
        } ).timeout( TIMEOUT );
    } );

    describe( 'Last', function () {
        it( 'Gets the last key', function ( done ) {
            let last = binance.last( { first: '1', second: '2', third: '3' } );
            assert.strictEqual( 'third', last, 'should be third' );
            done();
        } ).timeout( TIMEOUT );
    } );

    describe( 'slice', function () {
        it( 'Gets slice of the object keys', function ( done ) {
            let slice = binance.slice( { first: '1', second: '2', third: '3' }, 2 );
            assert.deepEqual( [ 'third' ], slice, 'should be ian array with the third' );
            done();
        } ).timeout( TIMEOUT );
    } );

    describe( 'Min', function () {
        it( 'Gets the math min of object', function ( done ) {
            binance.min( { first: '1', second: '2', third: '3' } );
            done();
        } ).timeout( TIMEOUT );
    } );

    describe( 'Max', function () {
        it( 'Gets the math max of object', function ( done ) {
            binance.max( { first: '1', second: '2', third: '3' } );
            done();
        } ).timeout( TIMEOUT );
    } );
} );

describe( 'Set/Get options', function () {
    it( 'Sets/Gets option to specified value', function ( done ) {
        binance.setOption( 'test', 'value' );
        assert.equal( binance.getOption( 'test' ), 'value', 'should be value' );
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'Get options', function () {
    it( 'Gets all options', function ( done ) {
        assert( typeof ( binance.getOptions() ) === 'object', 'should be object' );
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'Percent', function () {
    it( 'Get Percentage of two values', function ( done ) {
        assert( binance.percent( 25, 100 ) === 25, 'should be 25 percent' );
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'Sum', function () {
    it( 'Get sum of array of values', function ( done ) {
        assert( binance.sum( [ 1, 2, 3 ] ) === 6, 'should be 6' );
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'Reverse', function () {
    it( 'Reverse the keys in an object', function ( done ) {
        assert( binance.reverse( { '3': 3, '2': 2, '1': 1 } ).toString() === { '1': 1, '2': 2, '3': 3 }.toString(), 'should be {\'1\': 1, \'2\': 2, \'3\': 3 }' );
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'Array', function () {
    it( 'Convert object to an array', function ( done ) {
        let actual = binance.array( { 'a': 1, 'b': 2, 'c': 3 } );
        let expected = [ [ NaN, 1 ], [ NaN, 2 ], [ NaN, 3 ] ];
        assert.isArray( actual, 'should be an array' );
        assert( actual.length === 3, 'should be of lenght 3' );
        assert.deepEqual( actual, expected, 'should be both arrays with same vlaues' );
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'sortBids', function () {
    it( 'Sorts symbols bids and returns an object', function ( done ) {
    /* let actual = binance.sortBids( 'BNBBTC' );
       debug( actual ); */
        debug( 'todo' );
        done();
    } );
} );

describe( 'sortAsks', function () {
    it( 'Sorts symbols asks and returns an object', function ( done ) {
    //let actual = binance.sortBids( 'BNBBTC' );
        debug( 'todo' );
        done();
    } ).timeout( TIMEOUT );
} );

describe( 'Exchange Info', function () {
    let async_error;
    let async_data;
    /*global beforeEach*/
    /*eslint no-undef: "error"*/
    beforeEach( function ( done ) {
        binance.exchangeInfo( function ( error, data ) {
            async_error = error;
            async_data = data;
            done( error );
        } )
    } ).timeout( TIMEOUT * 5 );

    it( 'Gets the exchange info as an object', function () {
        assert( typeof ( async_error ) === 'object', 'error should be object' );
        assert( async_error === null, 'Error should be null' );
        assert( typeof ( async_data ) === 'object', 'data should be object' );
        assert( async_data !== null, 'data should not be null' );
        assert( Object.prototype.hasOwnProperty.call( async_data, 'symbols' ), 'data should have property \'symbols\'' );

        let symbolMembers = [ 'status', 'orderTypes', 'icebergAllowed', 'baseAsset', 'baseAssetPrecision', 'quoteAsset', 'quotePrecision', 'quoteAssetPrecision' ];
        async_data.symbols.forEach( function ( symbol ) {
            symbolMembers.forEach( function ( member ) {
                assert( Object.prototype.hasOwnProperty.call( symbol, member ), WARN_SHOULD_HAVE_KEY + member );
            } );
        } );
    } ).timeout( TIMEOUT * 5 );
} );

// describe( 'System status', function () {
//     let async_error;
//     let async_data;
//     /*global beforeEach*/
//     beforeEach( function ( done ) {
//         binance.systemStatus( function ( error, data ) {
//             async_error = error;
//             async_data = data;
//             done( error );
//         } )
//     } );

//     it( 'Gets the system status info as an object', function () {
//         assert( typeof ( async_error ) === 'object', 'error should be object' );
//         assert( async_error === null, 'Error should be null' );
//         assert( typeof ( async_data ) === 'object', 'data should be object' );
//         assert( async_data !== null, 'data should not be null' );
//         assert( Object.prototype.hasOwnProperty.call( async_data, 'msg' ), WARN_SHOULD_HAVE_KEY + 'msg' );
//         assert( Object.prototype.hasOwnProperty.call( async_data, 'status' ), WARN_SHOULD_HAVE_KEY + 'status' );

//         let members = [ 'msg', 'status' ];
//         members.forEach( function ( member ) {
//             assert( Object.prototype.hasOwnProperty.call( async_data, member ), WARN_SHOULD_HAVE_KEY + member );
//         } );
//     } ).timeout( TIMEOUT );
// } );

// describe( 'Withdraw', function () {
//     it( 'Attempt to withdraw BNB to another address', function ( done ) {
//         binance.withdraw( 'BNBBTC', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '5', false, ( error, result ) => {
//             debug( error );
//             debug( result );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
//             assert( Object.prototype.hasOwnProperty.call( result, 'msg' ), WARN_SHOULD_HAVE_KEY + 'msg' );
//             assert( result.msg === 'You don\'t have permission.' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
//             assert( result.success === false );
//             done();
//         } );
//     } ).timeout( TIMEOUT );

//     it( 'Attempt to withdraw BNB to another address with address tag', function ( done ) {
//         binance.withdraw( 'BNBBTC', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '5', 'AQSWDEFRGT', ( error, result ) => {
//             debug( error );
//             debug( result );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
//             assert( Object.prototype.hasOwnProperty.call( result, 'msg' ), WARN_SHOULD_HAVE_KEY + 'msg' );
//             assert( result.msg === 'You don\'t have permission.' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
//             assert( result.success === false );
//             done();
//         } );
//     } ).timeout( TIMEOUT );

//     it( 'Attempt to withdraw BNB without saving to address book', function ( done ) {
//         binance.withdraw( 'BNBBTC', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '5', false, ( error, result ) => {
//             debug( error );
//             debug( result );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
//             assert( Object.prototype.hasOwnProperty.call( result, 'msg' ), WARN_SHOULD_HAVE_KEY + 'msg' );
//             assert( result.msg === 'You don\'t have permission.' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
//             assert( result.success === false );
//             done();
//         }, false );
//     } ).timeout( TIMEOUT );
// } );

// describe( 'Withdraw history', function () {
//     it( 'Attempt to get withdraw history for BTC', function ( done ) {
//         binance.withdrawHistory( ( error, result ) => {
//             debug( error );
//             debug( result );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
//             assert( Object.prototype.hasOwnProperty.call( result, 'withdrawList' ), WARN_SHOULD_HAVE_KEY + 'withdrawList' );
//             assert( Array.isArray( result.withdrawList ) );
//             assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
//             assert( result.success === true );
//             done();
//         }, 'BTC' );
//     } ).timeout( TIMEOUT );

//     it( 'Attempt to get withdraw history for all assets', function ( done ) {
//         binance.withdrawHistory( ( error, result ) => {
//             debug( error );
//             debug( result );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
//             assert( Object.prototype.hasOwnProperty.call( result, 'withdrawList' ), WARN_SHOULD_HAVE_KEY + 'withdrawList' );
//             assert( Array.isArray( result.withdrawList ) );
//             assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
//             assert( result.success === true );
//             done();
//         } );
//     } ).timeout( TIMEOUT );
// } );


// describe( 'Deposit history', function () {
//     it( 'Attempt to get deposit history for all assets', function ( done ) {
//         binance.depositHistory( ( error, result ) => {
//             debug( error );
//             debug( result );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
//             assert( Object.prototype.hasOwnProperty.call( result, 'depositList' ), WARN_SHOULD_HAVE_KEY + 'depositList' );
//             assert( Array.isArray( result.depositList ) );
//             assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
//             assert( result.success === true );
//             done();
//         } );
//     } ).timeout( TIMEOUT );
// } );// 

// describe( 'Deposit address', function () {
//     it( 'Attempt to get deposit address for BTC', function ( done ) {
//         binance.depositAddress( 'BTC', ( error, result ) => {
//             debug( error );
//             debug( result );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
//             assert( Object.prototype.hasOwnProperty.call( result, 'address' ), WARN_SHOULD_HAVE_KEY + 'address' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'addressTag' ), WARN_SHOULD_HAVE_KEY + 'addressTag' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'asset' ), WARN_SHOULD_HAVE_KEY + 'asset' );
//             assert( result.asset === 'BTC' );
//             assert( result.success === true );
//             done();
//         } );
//     } ).timeout( TIMEOUT );

//     it( 'Attempt to get deposit address for XYZ', function ( done ) {
//         binance.depositAddress( 'XYZ', ( error, result ) => {
//             debug( error );
//             debug( result );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
//             assert( Object.prototype.hasOwnProperty.call( result, 'address' ) === false, WARN_SHOULD_NOT_HAVE_KEY + 'address' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_NOT_HAVE_KEY + 'success' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'addressTag' ) === false, WARN_SHOULD_NOT_HAVE_KEY + 'addressTag' );
//             assert( Object.prototype.hasOwnProperty.call( result, 'asset' ) === false, WARN_SHOULD_NOT_HAVE_KEY + 'asset' );
//             assert( result.success === false );
//             done();
//         } );
//     } ).timeout( TIMEOUT );
// } );

// describe( 'Account status', function () {
//     it( 'Attempt to get account status', function ( done ) {
//         binance.accountStatus( ( error, data ) => {
//             debug( error );
//             debug( data );
//             assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
//             assert( error === null, WARN_SHOULD_BE_NULL );
//             assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
//             done();
//         } );
//     } ).timeout( TIMEOUT );
// } );

describe( 'Account', function () {
    it( 'Attempt to get account information', function ( done ) {
        binance.account( ( error, data ) => {
            debug( error );
            debug( data );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Time', function () {
    it( 'Attempt to get server time', function ( done ) {
        binance.time( ( error, data ) => {
            debug( error );
            debug( data );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( Object.prototype.hasOwnProperty.call( data, 'serverTime' ), WARN_SHOULD_HAVE_KEY + 'serverTime' );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Aggtrades', function () {
    it( 'Attempt to get aggTrades for given symbol', function ( done ) {
        binance.aggTrades( 'BNBBTC', { limit: 500 }, ( error, response ) => {
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( response !== null, WARN_SHOULD_BE_NOT_NULL );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Recent Trades', function () {
    it( 'Attempt get recent Trades for a given symbol', function ( done ) {
        binance.recentTrades( 'BNBBTC', ( error, data ) => {
            debug( error );
            debug( data );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( data.length > 0 );
            data.forEach( function ( obj ) {
                assert( Object.prototype.hasOwnProperty.call( obj, 'id' ), WARN_SHOULD_HAVE_KEY + 'id' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'price' ), WARN_SHOULD_HAVE_KEY + 'price' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'qty' ), WARN_SHOULD_HAVE_KEY + 'qty' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'time' ), WARN_SHOULD_HAVE_KEY + 'time' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'isBuyerMaker' ), WARN_SHOULD_HAVE_KEY + 'isBuyerMaker' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'isBestMatch' ), WARN_SHOULD_HAVE_KEY + 'isBestMatch' );
            } );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'Historical Trades', function () {
    it( 'Attempt get Historical Trades for a given symbol', function ( done ) {
        binance.historicalTrades( 'BNBBTC', ( error, data ) => {
            debug( error );
            debug( data );
            assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
            assert( error === null, WARN_SHOULD_BE_NULL );
            assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
            assert( data.length > 0 );
            data.forEach( function ( obj ) {
                assert( Object.prototype.hasOwnProperty.call( obj, 'id' ), WARN_SHOULD_HAVE_KEY + 'id' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'price' ), WARN_SHOULD_HAVE_KEY + 'price' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'qty' ), WARN_SHOULD_HAVE_KEY + 'qty' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'time' ), WARN_SHOULD_HAVE_KEY + 'time' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'isBuyerMaker' ), WARN_SHOULD_HAVE_KEY + 'isBuyerMaker' );
                assert( Object.prototype.hasOwnProperty.call( obj, 'isBestMatch' ), WARN_SHOULD_HAVE_KEY + 'isBestMatch' );
            } );
            done();
        } );
    } ).timeout( TIMEOUT );
} );

describe( 'getInfo', function () {
    it( 'Gets the info array form the binance object', function ( done ) {
        assert( typeof ( binance.getInfo() ) === 'object', 'Should be of type array' )
        done();
    } ).timeout( TIMEOUT );
} );

// describe( 'Websockets candlesticks', function () {
//     let candlesticks;
//     let cnt = 0;
//     /*global beforeEach*/
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.candlesticks( [ 'BNBBTC' ], '1m', a_candlesticks => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             candlesticks = a_candlesticks;
//             stopSockets();
//             done();
//         } );
//     } );

//     it( 'Calls candlesticks websocket', function () {
//         assert( typeof ( candlesticks ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( candlesticks !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( Object.keys( candlesticks ).length >= 0, 'should at least 1 currency pairs?' );

//         let keys = [ 't', 'T', 's', 'i', 'f', 'L', 'o', 'c', 'h', 'l', 'v', 'n', 'x', 'q', 'V', 'Q', 'B' ];
//         assert( Object.prototype.hasOwnProperty.call( candlesticks, 'e' ), WARN_SHOULD_HAVE_KEY + 'e' );
//         assert( Object.prototype.hasOwnProperty.call( candlesticks, 'E' ), WARN_SHOULD_HAVE_KEY + 'E' );
//         assert( Object.prototype.hasOwnProperty.call( candlesticks, 's' ), WARN_SHOULD_HAVE_KEY + 's' );
//         assert( Object.prototype.hasOwnProperty.call( candlesticks, 's' ), WARN_SHOULD_HAVE_KEY + 'k' );

//         keys.forEach( function ( key ) {
//             assert( Object.prototype.hasOwnProperty.call( candlesticks.k, key ), WARN_SHOULD_HAVE_KEY + key );
//         } );
//     } );
// } );

// websockets disabled for now
// describe( 'Websockets depth', function () {
//     let depth;
//     let cnt = 0;
//     /*global beforeEach*/
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.depth( [ 'BNBBTC' ], e_depth => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             depth = e_depth;
//             stopSockets();
//             done();
//         } );
//     } );

//     it( 'Calls depth websocket', function () {
//         assert( typeof ( depth ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( depth !== null, WARN_SHOULD_BE_NOT_NULL );
//     } );
// } );

// describe( 'Websockets aggregated trades', function () {
//     let trades;
//     let cnt = 0;
//     /*global beforeEach*/
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.aggTrades( [ 'BNBBTC', 'ETHBTC' ], e_trades => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             trades = e_trades;
//             stopSockets();
//             done();
//         } );
//     } );

//     it( 'Calls trades websocket', function () {
//         assert( typeof ( trades ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( trades !== null, WARN_SHOULD_BE_NOT_NULL );
//     } );
// } );


// describe( 'Websockets (raw) trades', function () {
//     let trades;
//     let cnt = 0;
//     /*global beforeEach*/
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.trades( [ 'BNBBTC', 'ETHBTC' ], e_trades => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             trades = e_trades;
//             stopSockets();
//             done();
//         } );
//     } );

//     it( 'Calls trades websocket', function () {
//         assert( typeof ( trades ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( trades !== null, WARN_SHOULD_BE_NOT_NULL );
//     } );
// } );

// describe( 'depthCache', function () {
//     it( 'depthCache', function ( done ) {
//         binance.depthCache( 'BNBBTC' );
//         done();
//     } ).timeout( TIMEOUT );
// } );

// describe( 'depthVolume', function () {
//     it( 'depthVolume', function ( done ) {
//         binance.depthVolume( 'BNBBTC' );
//         done();
//     } ).timeout( TIMEOUT );
// } );

// describe( 'getPrecision', function () {
//     it( 'getPrecision', function ( done ) {
//         binance.getPrecision( 1.9999999 );
//         done();
//     } ).timeout( TIMEOUT );
// } );

// describe( 'roundStep', function () {
//     it( 'roundStep', function ( done ) {
//         binance.roundStep( 10, 0.8 );
//         done();
//     } ).timeout( TIMEOUT );
// } );

// describe( 'Websockets miniticker', function () {
//     let markets;
//     let cnt = 0;
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.miniTicker( tick => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             markets = tick;
//             stopSockets();
//             done();
//         } );
//     } );

//     it( 'check miniticker websocket', function () {
//         assert( typeof ( markets ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( markets !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( Object.keys( markets ).length >= 0, 'should at least 1 currency pairs?' );

//         Object.keys( markets ).forEach( function ( symbol ) {
//             assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'close' ), WARN_SHOULD_HAVE_KEY + 'close' );
//             assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'open' ), WARN_SHOULD_HAVE_KEY + 'open' );
//             assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'high' ), WARN_SHOULD_HAVE_KEY + 'high' );
//             assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'low' ), WARN_SHOULD_HAVE_KEY + 'low' );
//             assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'volume' ), WARN_SHOULD_HAVE_KEY + 'volume' );
//             assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'quoteVolume' ), WARN_SHOULD_HAVE_KEY + 'quoteVolume' );
//             assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'eventTime' ), WARN_SHOULD_HAVE_KEY + 'eventTime' );
//         } );
//     } );
// } );

// describe( 'Websockets symbol depthcache', function () {
//     let symbol;
//     let bids;
//     let asks;
//     let cnt = 0;
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.depthCache( 'BNBBTC', ( a_symbol, a_depth ) => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             stopSockets( true );
//             symbol = a_symbol;
//             bids = a_depth.bids;
//             asks = a_depth.asks;
//             done();
//         } );
//     } );

//     bids = binance.sortBids( bids );
//     asks = binance.sortAsks( asks );

//     it( 'check result of depth cache', function () {
//         assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
//         assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( Object.keys( asks ).length !== 0, 'should not be 0' );
//         assert( Object.keys( bids ).length !== 0, 'should not be 0' );
//     } );
// } );

// describe( 'Websockets array depthcache', function () {
//     let symbol;
//     let bids;
//     let asks;
//     let cnt = 0;
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.depthCache( [ 'BNBBTC', 'TRXBTC' ], ( a_symbol, a_depth ) => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             stopSockets();
//             symbol = a_symbol;
//             bids = a_depth.bids;
//             asks = a_depth.asks;
//             done();
//         } );
//     } );

//     bids = binance.sortBids( bids );
//     asks = binance.sortAsks( asks );

//     it( 'check result of symbols array depth cache', function () {
//         assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
//         assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( Object.keys( asks ).length !== 0, 'should not be 0' );
//         assert( Object.keys( bids ).length !== 0, 'should not be 0' );
//     } );
// } );

// describe( 'Staggered websockets symbol depthcache', function () {
//     let symbol;
//     let bids;
//     let asks;
//     let cnt = 0;
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.depthCacheStaggered( 'BNBBTC', ( a_symbol, a_depth ) => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             stopSockets( true );
//             symbol = a_symbol;
//             bids = a_depth.bids;
//             asks = a_depth.asks;
//             done();
//         } );
//     } );

//     bids = binance.sortBids( bids );
//     asks = binance.sortAsks( asks );

//     it( 'check result of depth cache', function () {
//         assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
//         assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( Object.keys( asks ).length !== 0, 'should not be 0' );
//         assert( Object.keys( bids ).length !== 0, 'should not be 0' );
//     } );
// } );

// describe( 'Staggered Websockets array depthcache', function () {
//     let symbol;
//     let bids;
//     let asks;
//     let cnt = 0;
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.depthCacheStaggered( [ 'BNBBTC', 'TRXBTC' ], ( a_symbol, a_depth ) => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             stopSockets();
//             symbol = a_symbol;
//             bids = a_depth.bids;
//             asks = a_depth.asks;
//             done();
//         } );
//     } );

//     bids = binance.sortBids( bids );
//     asks = binance.sortAsks( asks );

//     it( 'check result of symbols array depth cache', function () {
//         assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
//         assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( Object.keys( asks ).length !== 0, 'should not be 0' );
//         assert( Object.keys( bids ).length !== 0, 'should not be 0' );
//     } );
// } );

// describe( 'Websockets prevDay', function () {
//     let response;
//     let cnt = 0;

//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.prevDay( false, a_response => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             stopSockets();
//             response = a_response;
//             done();
//         } )
//     } );

//     it( 'Calls prevDay websocket for symbol', function () {
//         assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
//     } );
// } );

// describe( 'Websockets prevDay array', function () {
//     let response;
//     let cnt = 0;

//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.prevDay( [ 'BNBBTC', 'TRXBTC' ], a_response => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             stopSockets();
//             response = a_response;
//             done();
//         } )
//     } );

//     it( 'Calls prevDay websocket for array of symbols', function () {
//         assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
//     } );
// } );

// describe( 'Websockets prevDay single symbol', function () {
//     let response;
//     let cnt = 0;

//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.prevDay( 'BNBBTC', a_response => {
//             cnt++;
//             if ( cnt > 1 ) return;
//             stopSockets();
//             response = a_response;
//             done();
//         } )
//     } );

//     it( 'Calls prevDay websocket for a single symbol', function () {
//         assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
//     } );
// } );

// describe( 'Websockets chart', function () {
//     let chart;
//     let interval;
//     let symbol;
//     let cnt = 0;
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.chart( 'BNBBTC', '1m', ( a_symbol, a_interval, a_chart ) => {
//             cnt++;
//             if ( cnt > 1 ) {
//                 stopSockets();
//                 return;
//             }
//             chart = a_chart;
//             interval = a_interval;
//             symbol = a_symbol;
//             stopSockets();
//             done();
//         } );
//     } );

//     it( 'Calls chart websocket', function () {
//         assert( typeof ( chart ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( interval ) === 'string', WARN_SHOULD_BE_OBJ );
//         assert( chart !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( interval !== null, WARN_SHOULD_BE_NOT_NULL );

//         let keys = [ 'open', 'high', 'open', 'close', 'volume' ];
//         assert( Object.keys( chart ).length > 0, 'Should not be empty' );

//         Object.keys( chart ).forEach( function ( c ) {
//             keys.forEach( function ( key ) {
//                 assert( Object.prototype.hasOwnProperty.call( chart[c], key ), WARN_SHOULD_HAVE_KEY + key );
//             } );
//         } );
//     } );
// } );

// describe( 'ohlc', function () {
//     let chart = [ { 'open': 1.11111, 'high': 6.6666, 'low': 8.88888, 'close': 4.44444, 'volume': 3.333333 }, { 'open': 1.11111, 'high': 6.6666, 'low': 8.88888, 'close': 4.44444, 'volume': 3.333333 } ];
//     it( 'Calls ohlc', function () {
//         binance.ohlc( chart );
//     } );
// } );

// describe( 'highstock', function () {
//     let chart = [ { 'open': 1.11111, 'high': 6.6666, 'low': 8.88888, 'close': 4.44444, 'volume': 3.333333 }, { 'open': 1.11111, 'high': 6.6666, 'low': 8.88888, 'close': 4.44444, 'volume': 3.333333 } ];
//     it( 'Calls highstock', function () {
//         binance.highstock( chart );
//     } );
// } );

// describe( 'Websockets chart array', function () {
//     let chart;
//     let interval;
//     let symbol;
//     let cnt = 0;
//     beforeEach( function ( done ) {
//         this.timeout( TIMEOUT );
//         binance.websockets.chart( [ 'BNBBTC', 'TRXBTC' ], '1m', ( a_symbol, a_interval, a_chart ) => {
//             cnt++;
//             if ( cnt > 1 ) {
//                 stopSockets();
//                 return;
//             }
//             chart = a_chart;
//             interval = a_interval;
//             symbol = a_symbol;
//             stopSockets();
//             done();
//         } );
//     } );

//     it( 'Calls chart websocket array', function () {
//         assert( typeof ( chart ) === 'object', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
//         assert( typeof ( interval ) === 'string', WARN_SHOULD_BE_OBJ );
//         assert( chart !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
//         assert( interval !== null, WARN_SHOULD_BE_NOT_NULL );

//         let keys = [ 'open', 'high', 'open', 'close', 'volume' ];
//         assert( Object.keys( chart ).length > 0, 'Should not be empty' );

//         Object.keys( chart ).forEach( function ( c ) {
//             keys.forEach( function ( key ) {
//                 assert( Object.prototype.hasOwnProperty.call( chart[c], key ), WARN_SHOULD_HAVE_KEY + key );
//             } );
//         } );
//     } );
// } );


/*
describe( 'Websockets userdata', function() {
  let userdata;
  beforeEach(function (done) {
    this.timeout( TIMEOUT );
    binance.websockets.userData( data => {
      userdata = data;
      stopSockets();
      done();
    });
  });

  it( 'Calls userdata websocket', function() {
    assert( typeof ( userdata ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( userdata !== null, WARN_SHOULD_BE_NOT_NULL );
  });
});
*/
