import Binance from '../src/node-binance-api';
import { assert } from 'chai';
import util from 'util';

const WARN_SHOULD_BE_OBJ = 'should be an object';
const WARN_SHOULD_BE_NULL = 'should be null';
const WARN_SHOULD_BE_NOT_NULL = 'should not be null';
const WARN_SHOULD_HAVE_KEY = 'should have key ';
const WARN_SHOULD_NOT_HAVE_KEY = 'should not have key ';
const WARN_SHOULD_BE_UNDEFINED = 'should be undefined';
const WARN_SHOULD_BE_TYPE = 'should be a ';
const TIMEOUT = 40000;


const binance = new Binance().options({
    APIKEY: 'X4BHNSimXOK6RKs2FcKqExquJtHjMxz5hWqF0BBeVnfa5bKFMk7X0wtkfEz0cPrJ',
    APISECRET: 'x8gLihunpNq0d46F2q0TWJmeCDahX5LMXSlv3lSFNbMI3rujSOpTDKdhbcmPSf2i',
    test: true,
    httpsProxy: 'http://188.245.226.105:8911'
});

const futuresBinance = new Binance().options({
    APIKEY: '227719da8d8499e8d3461587d19f259c0b39c2b462a77c9b748a6119abd74401',
    APISECRET: 'b14b935f9cfacc5dec829008733c40da0588051f29a44625c34967b45c11d73c',
    hedgeMode: true,
    test: true
});

const stopSockets = function ( log = false ) {
    let endpoints = binance.websockets.subscriptions();
    for ( let endpoint in endpoints ) {
        if ( log ) console.log( 'Terminated ws endpoint: ' + endpoint );
        binance.websockets.terminate( endpoint );
    }
}

describe( 'Websockets candlesticks', function () {
    let candlesticks;
    let cnt = 0;
    /*global beforeEach*/
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.candlesticks( [ 'BTCUSDT' ], '1m', a_candlesticks => {
            cnt++;
            if ( cnt > 1 ) return;
            candlesticks = a_candlesticks;
            stopSockets();
            done();
        } );
    } );

    it( 'Calls spot candlesticks websocket', function () {
        assert( typeof ( candlesticks ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( candlesticks !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( Object.keys( candlesticks ).length >= 0, 'should at least 1 currency pairs?' );

        let keys = [ 't', 'T', 's', 'i', 'f', 'L', 'o', 'c', 'h', 'l', 'v', 'n', 'x', 'q', 'V', 'Q', 'B' ];
        assert( Object.prototype.hasOwnProperty.call( candlesticks, 'e' ), WARN_SHOULD_HAVE_KEY + 'e' );
        assert( Object.prototype.hasOwnProperty.call( candlesticks, 'E' ), WARN_SHOULD_HAVE_KEY + 'E' );
        assert( Object.prototype.hasOwnProperty.call( candlesticks, 's' ), WARN_SHOULD_HAVE_KEY + 's' );
        assert( Object.prototype.hasOwnProperty.call( candlesticks, 's' ), WARN_SHOULD_HAVE_KEY + 'k' );

        keys.forEach( function ( key ) {
            assert( Object.prototype.hasOwnProperty.call( candlesticks.k, key ), WARN_SHOULD_HAVE_KEY + key );
        } );
    } );
} );

describe( 'Websockets prevDay', function () {
    let response;
    let cnt = 0;

    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.prevDay( undefined, a_response => {
            cnt++;
            if ( cnt > 1 ) return;
            stopSockets();
            response = a_response;
            done();
        } )
    } );

    it( 'Calls prevDay websocket for symbol', function () {
        assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
    } );
} );


describe( 'Websockets miniticker', function () {
    let markets;
    let cnt = 0;
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.miniTicker( tick => {
            cnt++;
            if ( cnt > 1 ) return;
            markets = tick;
            stopSockets();
            done();
        } );
    } );

    it( 'check miniticker websocket', function () {
        assert( typeof ( markets ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( markets !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( Object.keys( markets ).length >= 0, 'should at least 1 currency pairs?' );

        Object.keys( markets ).forEach( function ( symbol ) {
            assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'close' ), WARN_SHOULD_HAVE_KEY + 'close' );
            assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'open' ), WARN_SHOULD_HAVE_KEY + 'open' );
            assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'high' ), WARN_SHOULD_HAVE_KEY + 'high' );
            assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'low' ), WARN_SHOULD_HAVE_KEY + 'low' );
            assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'volume' ), WARN_SHOULD_HAVE_KEY + 'volume' );
            assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'quoteVolume' ), WARN_SHOULD_HAVE_KEY + 'quoteVolume' );
            assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'eventTime' ), WARN_SHOULD_HAVE_KEY + 'eventTime' );
        } );
    } );
} );


describe( 'Websockets symbol depthcache', function () {
    let symbol;
    let bids;
    let asks;
    let cnt = 0;
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.depthCache( 'BTCUSDT', ( a_symbol, a_depth ) => {
            cnt++;
            if ( cnt > 1 ) return;
            stopSockets( true );
            symbol = a_symbol;
            bids = a_depth.bids;
            asks = a_depth.asks;
            done();
        } );
    } );

    bids = binance.sortBids( bids );
    asks = binance.sortAsks( asks );

    it( 'check result of depth cache', function () {
        assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
        assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( Object.keys( asks ).length !== 0, 'should not be 0' );
        assert( Object.keys( bids ).length !== 0, 'should not be 0' );
    } );
} );


describe( 'Websockets array depthcache', function () {
    let symbol;
    let bids;
    let asks;
    let cnt = 0;
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.depthCache( [ 'BTCUSDT', 'ETHUSDT' ], ( a_symbol, a_depth ) => {
            cnt++;
            if ( cnt > 1 ) return;
            stopSockets();
            symbol = a_symbol;
            bids = a_depth.bids;
            asks = a_depth.asks;
            done();
        } );
    } );

    bids = binance.sortBids( bids );
    asks = binance.sortAsks( asks );

    it( 'check result of symbols array depth cache', function () {
        assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
        assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( Object.keys( asks ).length !== 0, 'should not be 0' );
        assert( Object.keys( bids ).length !== 0, 'should not be 0' );
    } );
} );


describe( 'Staggered websockets symbol depthcache', function () {
    let symbol;
    let bids;
    let asks;
    let cnt = 0;
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.depthCacheStaggered( 'BTCUSDT', ( a_symbol, a_depth ) => {
            cnt++;
            if ( cnt > 1 ) return;
            stopSockets( true );
            symbol = a_symbol;
            bids = a_depth.bids;
            asks = a_depth.asks;
            done();
        } );
    } );

    bids = binance.sortBids( bids );
    asks = binance.sortAsks( asks );

    it( 'check result of depth cache', function () {
        assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
        assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( Object.keys( asks ).length !== 0, 'should not be 0' );
        assert( Object.keys( bids ).length !== 0, 'should not be 0' );
    } );
} );


describe( 'Staggered Websockets array depthcache', function () {
    let symbol;
    let bids;
    let asks;
    let cnt = 0;
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.depthCacheStaggered( [ 'BTCUSDT', 'ETHUSDT' ], ( a_symbol, a_depth ) => {
            cnt++;
            if ( cnt > 1 ) return;
            stopSockets();
            symbol = a_symbol;
            bids = a_depth.bids;
            asks = a_depth.asks;
            done();
        } );
    } );

    bids = binance.sortBids( bids );
    asks = binance.sortAsks( asks );

    it( 'check result of symbols array depth cache', function () {
        assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
        assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( Object.keys( asks ).length !== 0, 'should not be 0' );
        assert( Object.keys( bids ).length !== 0, 'should not be 0' );
    } );
} );


describe( 'Websockets chart', function () {
    let chart;
    let interval;
    let symbol;
    let cnt = 0;
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.chart( 'BTCUSDT', '1m', ( a_symbol, a_interval, a_chart ) => {
            cnt++;
            if ( cnt > 1 ) {
                stopSockets();
                return;
            }
            chart = a_chart;
            interval = a_interval;
            symbol = a_symbol;
            stopSockets();
            done();
        } );
    } );

    it( 'Calls chart websocket', function () {
        assert( typeof ( chart ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
        assert( typeof ( interval ) === 'string', WARN_SHOULD_BE_OBJ );
        assert( chart !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
        assert( interval !== null, WARN_SHOULD_BE_NOT_NULL );

        let keys = [ 'open', 'high', 'open', 'close', 'volume' ];
        assert( Object.keys( chart ).length > 0, 'Should not be empty' );

        Object.keys( chart ).forEach( function ( c ) {
            keys.forEach( function ( key ) {
                assert( Object.prototype.hasOwnProperty.call( chart[c], key ), WARN_SHOULD_HAVE_KEY + key );
            } );
        } );
    } );
} );


describe( 'Websockets depth', function () {
    let depth;
    let cnt = 0;
    /*global beforeEach*/
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.depth( [ 'BNBBTC' ], e_depth => {
            cnt++;
            if ( cnt > 1 ) return;
            depth = e_depth;
            stopSockets();
            done();
        } );
    } );

    it( 'Calls depth websocket', function () {
        assert( typeof ( depth ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( depth !== null, WARN_SHOULD_BE_NOT_NULL );
    } );
} );

describe( 'Websockets aggregated trades', function () {
    let trades;
    let cnt = 0;
    /*global beforeEach*/
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.aggTrades( [ 'BTCUSDT', 'ETHUSDT' ], e_trades => {
            cnt++;
            if ( cnt > 1 ) return;
            trades = e_trades;
            stopSockets();
            done();
        } );
    } );

    it( 'Calls trades websocket', function () {
        assert( typeof ( trades ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( trades !== null, WARN_SHOULD_BE_NOT_NULL );
    } );
} );


describe( 'Websockets (raw) trades', function () {
    let trades;
    let cnt = 0;
    /*global beforeEach*/
    beforeEach( function ( done ) {
        this.timeout( TIMEOUT );
        binance.websockets.trades( [ 'BTCUSDT', 'ETHUSDT' ], e_trades => {
            cnt++;
            if ( cnt > 1 ) return;
            trades = e_trades;
            stopSockets();
            done();
        } );
    } );

    it( 'Calls trades websocket', function () {
        assert( typeof ( trades ) === 'object', WARN_SHOULD_BE_OBJ );
        assert( trades !== null, WARN_SHOULD_BE_NOT_NULL );
    } );
} );
