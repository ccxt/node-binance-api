/* ============================================================
 * node-binance-api
 * https://github.com/jaggedsoft/node-binance-api
 * ============================================================
 * Copyright 2017-, Jon Eyrick
 * Released under the MIT License
 * ============================================================
 * @module jaggedsoft/node-binance-api
 * @return {object} instance to class object */
let api = function Binance( options = {} ) {
    if ( !new.target ) return new api( options ); // Legacy support for calling the constructor without 'new'
    let Binance = this; // eslint-disable-line consistent-this
    const WebSocket = require( 'ws' );
    const request = require( 'request' );
    const crypto = require( 'crypto' );
    const file = require( 'fs' );
    const url = require( 'url' );
    const JSONbig = require( 'json-bigint' );
    const HttpsProxyAgent = require( 'https-proxy-agent' );
    const SocksProxyAgent = require( 'socks-proxy-agent' );
    const stringHash = require( 'string-hash' );
    const async = require( 'async' );
    let base = 'https://api.binance.com/api/';
    let baseTest = 'https://testnet.binance.vision/api/';
    let wapi = 'https://api.binance.com/wapi/';
    let sapi = 'https://api.binance.com/sapi/';
    let fapi = 'https://fapi.binance.com/fapi/';
    let dapi = 'https://dapi.binance.com/dapi/';
    let fapiTest = 'https://testnet.binancefuture.com/fapi/';
    let dapiTest = 'https://testnet.binancefuture.com/dapi/';
    let fstream = 'wss://fstream.binance.com/stream?streams=';
    let fstreamSingle = 'wss://fstream.binance.com/ws/';
    let fstreamSingleTest = 'wss://stream.binancefuture.com/ws/';
    let fstreamTest = 'wss://stream.binancefuture.com/stream?streams=';
    let dstream = 'wss://dstream.binance.com/stream?streams=';
    let dstreamSingle = 'wss://dstream.binance.com/ws/';
    let dstreamSingleTest = 'wss://dstream.binancefuture.com/ws/';
    let dstreamTest = 'wss://dstream.binancefuture.com/stream?streams=';
    let stream = 'wss://stream.binance.com:9443/ws/';
    let combineStream = 'wss://stream.binance.com:9443/stream?streams=';
    const userAgent = 'Mozilla/4.0 (compatible; Node Binance API)';
    const contentType = 'application/x-www-form-urlencoded';
    const SPOT_PREFIX = "x-HNA2TXFJ"
    const CONTRACT_PREFIX = "x-Cb7ytekJ"
    Binance.subscriptions = {};
    Binance.futuresSubscriptions = {};
    Binance.futuresInfo = {};
    Binance.futuresMeta = {};
    Binance.futuresTicks = {};
    Binance.futuresRealtime = {};
    Binance.futuresKlineQueue = {};
    Binance.deliverySubscriptions = {};
    Binance.deliveryInfo = {};
    Binance.deliveryMeta = {};
    Binance.deliveryTicks = {};
    Binance.deliveryRealtime = {};
    Binance.deliveryKlineQueue = {};
    Binance.depthCache = {};
    Binance.depthCacheContext = {};
    Binance.ohlcLatest = {};
    Binance.klineQueue = {};
    Binance.ohlc = {};

    const default_options = {
        recvWindow: 5000,
        useServerTime: false,
        reconnect: true,
        keepAlive: true,
        verbose: false,
        test: false,
        hedgeMode: false,
        localAddress: false,
        family: 4,
        log: function ( ...args ) {
            console.log( Array.prototype.slice.call( args ) );
        }
    };
    Binance.options = default_options;
    Binance.info = {
        usedWeight: 0,
        futuresLatency: false,
        lastRequest: false,
        lastURL: false,
        statusCode: 0,
        orderCount1s: 0,
        orderCount1m: 0,
        orderCount1h: 0,
        orderCount1d: 0,
        timeOffset: 0
    };
    Binance.socketHeartbeatInterval = null;
    if ( options ) setOptions( options );

    function setOptions( opt = {}, callback = false ) {
        if ( typeof opt === 'string' ) { // Pass json config filename
            Binance.options = JSON.parse( file.readFileSync( opt ) );
        } else Binance.options = opt;
        if ( typeof Binance.options.recvWindow === 'undefined' ) Binance.options.recvWindow = default_options.recvWindow;
        if ( typeof Binance.options.useServerTime === 'undefined' ) Binance.options.useServerTime = default_options.useServerTime;
        if ( typeof Binance.options.reconnect === 'undefined' ) Binance.options.reconnect = default_options.reconnect;
        if ( typeof Binance.options.test === 'undefined' ) Binance.options.test = default_options.test;
        if ( typeof Binance.options.hedgeMode === 'undefined' ) Binance.options.hedgeMode = default_options.hedgeMode;
        if ( typeof Binance.options.log === 'undefined' ) Binance.options.log = default_options.log;
        if ( typeof Binance.options.verbose === 'undefined' ) Binance.options.verbose = default_options.verbose;
        if ( typeof Binance.options.keepAlive === 'undefined' ) Binance.options.keepAlive = default_options.keepAlive;
        if ( typeof Binance.options.localAddress === 'undefined' ) Binance.options.localAddress = default_options.localAddress;
        if ( typeof Binance.options.family === 'undefined' ) Binance.options.family = default_options.family;
        if ( typeof Binance.options.urls !== 'undefined' ) {
            const { urls } = Binance.options;
            if ( typeof urls.base === 'string' ) base = urls.base;
            if ( typeof urls.wapi === 'string' ) wapi = urls.wapi;
            if ( typeof urls.sapi === 'string' ) sapi = urls.sapi;
            if ( typeof urls.fapi === 'string' ) fapi = urls.fapi;
            if ( typeof urls.fapiTest === 'string' ) fapiTest = urls.fapiTest;
            if ( typeof urls.stream === 'string' ) stream = urls.stream;
            if ( typeof urls.combineStream === 'string' ) combineStream = urls.combineStream;
            if ( typeof urls.fstream === 'string' ) fstream = urls.fstream;
            if ( typeof urls.fstreamSingle === 'string' ) fstreamSingle = urls.fstreamSingle;
            if ( typeof urls.fstreamTest === 'string' ) fstreamTest = urls.fstreamTest;
            if ( typeof urls.fstreamSingleTest === 'string' ) fstreamSingleTest = urls.fstreamSingleTest;
            if ( typeof urls.dstream === 'string' ) dstream = urls.dstream;
            if ( typeof urls.dstreamSingle === 'string' ) dstreamSingle = urls.dstreamSingle;
            if ( typeof urls.dstreamTest === 'string' ) dstreamTest = urls.dstreamTest;
            if ( typeof urls.dstreamSingleTest === 'string' ) dstreamSingleTest = urls.dstreamSingleTest;
        }
        if ( Binance.options.useServerTime ) {
            publicRequest( getSpotUrl() + 'v3/time', {}, function ( error, response ) {
                Binance.info.timeOffset = response.serverTime - new Date().getTime();
                //Binance.options.log("server time set: ", response.serverTime, Binance.info.timeOffset);
                if ( callback ) callback();
            } );
        } else if ( callback ) callback();
        return this;
    }

    const getSpotUrl = () => {
        if ( Binance.options.test ) return baseTest;
        return base;
    }

    const uuid22 = ( a ) => {
        return a ? ( a ^ Math.random () * 16 >> a / 4 ).toString ( 16 ) : ( [ 1e7 ] + 1e3 + 4e3 + 8e5 ).replace ( /[018]/g, uuid22 );
    };

    /**
     * Replaces socks connection uri hostname with IP address
     * @param {string} connString - socks connection string
     * @return {string} modified string with ip address
     */
    const proxyReplacewithIp = connString => {
        return connString;
    }

    /**
     * Returns an array in the form of [host, port]
     * @param {string} connString - connection string
     * @return {array} array of host and port
     */
    const parseProxy = connString => {
        let arr = connString.split( '/' );
        let host = arr[2].split( ':' )[0];
        let port = arr[2].split( ':' )[1];
        return [ arr[0], host, port ];
    }

    /**
     * Checks to see of the object is iterable
     * @param {object} obj - The object check
     * @return {boolean} true or false is iterable
     */
    const isIterable = obj => {
        if ( obj === null ) return false;
        return typeof obj[Symbol.iterator] === 'function';
    }

    const addProxy = opt => {
        if ( Binance.options.proxy ) {
            const proxyauth = Binance.options.proxy.auth ? `${ Binance.options.proxy.auth.username }:${ Binance.options.proxy.auth.password }@` : '';
            opt.proxy = `http://${ proxyauth }${ Binance.options.proxy.host }:${ Binance.options.proxy.port }`;
        }
        return opt;
    }

    const reqHandler = cb => ( error, response, body ) => {
        Binance.info.lastRequest = new Date().getTime();
        if ( response ) {
            Binance.info.statusCode = response.statusCode || 0;
            if ( response.request ) Binance.info.lastURL = response.request.uri.href;
            if ( response.headers ) {
                Binance.info.usedWeight = response.headers['x-mbx-used-weight-1m'] || 0;
                Binance.info.orderCount1s = response.headers['x-mbx-order-count-1s'] || 0;
                Binance.info.orderCount1m = response.headers['x-mbx-order-count-1m'] || 0;
                Binance.info.orderCount1h = response.headers['x-mbx-order-count-1h'] || 0;
                Binance.info.orderCount1d = response.headers['x-mbx-order-count-1d'] || 0;
            }
        }
        if ( !cb ) return;
        if ( error ) return cb( error, {} );
        if ( response && response.statusCode !== 200 ) return cb( response, {} );
        return cb( null, JSONbig.parse( body ) );
    }

    const proxyRequest = ( opt, cb ) => {
        const req = request( addProxy( opt ), reqHandler( cb ) ).on( 'error', ( err ) => { cb( err, {} ) } );
        return req;
    }

    const reqObj = ( url, data = {}, method = 'GET', key ) => ( {
        url: url,
        qs: data,
        method: method,
        family: Binance.options.family,
        localAddress: Binance.options.localAddress,
        timeout: Binance.options.recvWindow,
        forever: Binance.options.keepAlive,
        headers: {
            'User-Agent': userAgent,
            'Content-type': contentType,
            'X-MBX-APIKEY': key || ''
        }
    } )
    const reqObjPOST = ( url, data = {}, method = 'POST', key ) => ( {
        url: url,
        form: data,
        method: method,
        family: Binance.options.family,
        localAddress: Binance.options.localAddress,
        timeout: Binance.options.recvWindow,
        forever: Binance.options.keepAlive,
        qsStringifyOptions: {
            arrayFormat: 'repeat'
        },
        headers: {
            'User-Agent': userAgent,
            'Content-type': contentType,
            'X-MBX-APIKEY': key || ''
        }
    } )
    /**
     * Create a http request to the public API
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @return {undefined}
     */
    const publicRequest = ( url, data = {}, callback, method = 'GET' ) => {
        let opt = reqObj( url, data, method );
        proxyRequest( opt, callback );
    };

    // XXX: This one works with array (e.g. for dust.transfer)
    // XXX: I _guess_ we could use replace this function with the `qs` module
    const makeQueryString = q =>
        Object.keys( q )
            .reduce( ( a, k ) => {
                if ( Array.isArray( q[k] ) ) {
                    q[k].forEach( v => {
                        a.push( k + "=" + encodeURIComponent( v ) )
                    } )
                } else if ( q[k] !== undefined ) {
                    a.push( k + "=" + encodeURIComponent( q[k] ) );
                }
                return a;
            }, [] )
            .join( "&" );

    /**
     * Create a http request to the public API
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @return {undefined}
     */
    const apiRequest = ( url, data = {}, callback, method = 'GET' ) => {
        requireApiKey( 'apiRequest' );
        let opt = reqObj(
            url,
            data,
            method,
            Binance.options.APIKEY
        );
        proxyRequest( opt, callback );
    };

    // Check if API key is empty or invalid
    const requireApiKey = function( source = 'requireApiKey', fatalError = true ) {
        if ( !Binance.options.APIKEY ) {
            if ( fatalError ) throw Error( `${ source }: Invalid API Key!` );
            return false;
        }
        return true;
    }

    // Check if API secret is present
    const requireApiSecret = function( source = 'requireApiSecret', fatalError = true ) {
        if ( !Binance.options.APIKEY ) {
            if ( fatalError ) throw Error( `${ source }: Invalid API Key!` );
            return false;
        }
        if ( !Binance.options.APISECRET ) {
            if ( fatalError ) throw Error( `${ source }: Invalid API Secret!` );
            return false;
        }
        return true;
    }

    /**
     * Make market request
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @return {undefined}
     */
    const marketRequest = ( url, data = {}, callback, method = 'GET' ) => {
        requireApiKey( 'marketRequest' );
        let query = makeQueryString( data );
        let opt = reqObj(
            url + ( query ? '?' + query : '' ),
            data,
            method,
            Binance.options.APIKEY
        );
        proxyRequest( opt, callback );
    };

    /**
     * Create a signed http request
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @param {boolean} noDataInSignature - Prevents data from being added to signature
     * @return {undefined}
     */
    const signedRequest = ( url, data = {}, callback, method = 'GET', noDataInSignature = false ) => {
        requireApiSecret( 'signedRequest' );
        data.timestamp = new Date().getTime() + Binance.info.timeOffset;
        if ( typeof data.recvWindow === 'undefined' ) data.recvWindow = Binance.options.recvWindow;
        let query = method === 'POST' && noDataInSignature ? '' : makeQueryString( data );
        let signature = crypto.createHmac( 'sha256', Binance.options.APISECRET ).update( query ).digest( 'hex' ); // set the HMAC hash header
        if ( method === 'POST' ) {
            let opt = reqObjPOST(
                url,
                data,
                method,
                Binance.options.APIKEY
            );
            opt.form.signature = signature;
            proxyRequest( opt, callback );
        } else {
            let opt = reqObj(
                url + '?' + query + '&signature=' + signature,
                data,
                method,
                Binance.options.APIKEY
            );
            proxyRequest( opt, callback );
        }
    };

    /**
     * Create a signed spot order
     * @param {string} side - BUY or SELL
     * @param {string} symbol - The symbol to buy or sell
     * @param {string} quantity - The quantity to buy or sell
     * @param {string} price - The price per unit to transact each unit at
     * @param {object} flags - additional order settings
     * @param {function} callback - the callback function
     * @return {undefined}
     */
    const order = ( side, symbol, quantity, price, flags = {}, callback = false ) => {
        let endpoint = flags.type === 'OCO' ? 'v3/orderList/oco' : 'v3/order';
        if ( typeof flags.test && flags.test ) endpoint += '/test';
        let opt = {
            symbol: symbol,
            side: side,
            type: 'LIMIT'
        };
        if( typeof flags.quoteOrderQty !== undefined && flags.quoteOrderQty > 0 )
            opt.quoteOrderQty = flags.quoteOrderQty
        else
            opt.quantity = quantity
        if ( typeof flags.type !== 'undefined' ) opt.type = flags.type;
        if ( opt.type.includes( 'LIMIT' ) ) {
            opt.price = price;
            if ( opt.type !== 'LIMIT_MAKER' ) {
                opt.timeInForce = 'GTC';
            }
        }
        if ( opt.type == 'MARKET' && typeof flags.quoteOrderQty !== 'undefined' ) {
            opt.quoteOrderQty = flags.quoteOrderQty
            delete opt.quantity;
        }
        if ( opt.type === 'OCO' ) {
            opt.price = price;
            opt.stopLimitPrice = flags.stopLimitPrice;
            opt.stopLimitTimeInForce = 'GTC';
            delete opt.type;
            if ( typeof flags.listClientOrderId !== 'undefined' ) opt.listClientOrderId = flags.listClientOrderId;
            if ( typeof flags.limitClientOrderId !== 'undefined' ) opt.limitClientOrderId = flags.limitClientOrderId;
            if ( typeof flags.stopClientOrderId !== 'undefined' ) opt.stopClientOrderId = flags.stopClientOrderId;
        }
        if ( typeof flags.timeInForce !== 'undefined' ) opt.timeInForce = flags.timeInForce;
        if ( typeof flags.newOrderRespType !== 'undefined' ) opt.newOrderRespType = flags.newOrderRespType;
        if ( typeof flags.newClientOrderId !== 'undefined' ) {
            opt.newClientOrderId = flags.newClientOrderId;
        } else {
            opt.newClientOrderId = SPOT_PREFIX + uuid22();
        }

        /*
         * STOP_LOSS
         * STOP_LOSS_LIMIT
         * TAKE_PROFIT
         * TAKE_PROFIT_LIMIT
         * LIMIT_MAKER
         */
        if ( typeof flags.icebergQty !== 'undefined' ) opt.icebergQty = flags.icebergQty;
        if ( typeof flags.stopPrice !== 'undefined' ) {
            opt.stopPrice = flags.stopPrice;
            if ( opt.type === 'LIMIT' ) throw Error( 'stopPrice: Must set "type" to one of the following: STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT' );
        }
        signedRequest( getSpotUrl() + endpoint, opt, ( error, response ) => {
            if ( !response ) {
                if ( callback ) callback( error, response );
                else Binance.options.log( 'Order() error:', error );
                return;
            }
            if ( typeof response.msg !== 'undefined' && response.msg === 'Filter failure: MIN_NOTIONAL' ) {
                Binance.options.log( 'Order quantity too small. See exchangeInfo() for minimum amounts' );
            }
            if ( callback ) callback( error, response );
            else Binance.options.log( side + '(' + symbol + ',' + quantity + ',' + price + ') ', response );
        }, 'POST' );
    };

    /**
     * Create a signed margin order
     * @param {string} side - BUY or SELL
     * @param {string} symbol - The symbol to buy or sell
     * @param {string} quantity - The quantity to buy or sell
     * @param {string} price - The price per unit to transact each unit at
     * @param {object} flags - additional order settings
     * @param {function} callback - the callback function
     * @return {undefined}
     */
    const marginOrder = ( side, symbol, quantity, price, flags = {}, callback = false ) => {
        let endpoint = 'v1/margin/order';
        if ( Binance.options.test ) endpoint += '/test';
        let opt = {
            symbol: symbol,
            side: side,
            type: 'LIMIT',
            quantity: quantity
        };
        if ( typeof flags.type !== 'undefined' ) opt.type = flags.type;
        if ( typeof flags.isIsolated !== 'undefined' ) opt.isIsolated = flags.isIsolated;
        if ( opt.type.includes( 'LIMIT' ) ) {
            opt.price = price;
            if ( opt.type !== 'LIMIT_MAKER' ) {
                opt.timeInForce = 'GTC';
            }
        }

        if ( typeof flags.timeInForce !== 'undefined' ) opt.timeInForce = flags.timeInForce;
        if ( typeof flags.newOrderRespType !== 'undefined' ) opt.newOrderRespType = flags.newOrderRespType;
        // if ( typeof flags.newClientOrderId !== 'undefined' ) opt.newClientOrderId = flags.newClientOrderId;
        if ( typeof flags.newClientOrderId !== 'undefined' ) {
            opt.newClientOrderId = flags.newClientOrderId;
        } else {
            opt.newClientOrderId = SPOT_PREFIX + uuid22();
        }
        if ( typeof flags.sideEffectType !== 'undefined' ) opt.sideEffectType = flags.sideEffectType;

        /*
         * STOP_LOSS
         * STOP_LOSS_LIMIT
         * TAKE_PROFIT
         * TAKE_PROFIT_LIMIT
         */
        if ( typeof flags.icebergQty !== 'undefined' ) opt.icebergQty = flags.icebergQty;
        if ( typeof flags.stopPrice !== 'undefined' ) {
            opt.stopPrice = flags.stopPrice;
            if ( opt.type === 'LIMIT' ) throw Error( 'stopPrice: Must set "type" to one of the following: STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT' );
        }
        signedRequest( sapi + endpoint, opt, function ( error, response ) {
            if ( !response ) {
                if ( callback ) callback( error, response );
                else Binance.options.log( 'Order() error:', error );
                return;
            }
            if ( typeof response.msg !== 'undefined' && response.msg === 'Filter failure: MIN_NOTIONAL' ) {
                Binance.options.log( 'Order quantity too small. See exchangeInfo() for minimum amounts' );
            }
            if ( callback ) callback( error, response );
            else Binance.options.log( side + '(' + symbol + ',' + quantity + ',' + price + ') ', response );
        }, 'POST' );
    };

    // Futures internal functions
    const futuresOrder = async ( side, symbol, quantity, price = false, params = {} ) => {
        params.symbol = symbol;
        params.side = side;
        if ( quantity ) params.quantity = quantity;
        // if in the binance futures setting Hedged mode is active, positionSide parameter is mandatory
        if( typeof params.positionSide === 'undefined' && Binance.options.hedgeMode ){
            params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT';
        }
        // LIMIT STOP MARKET STOP_MARKET TAKE_PROFIT TAKE_PROFIT_MARKET
        // reduceOnly stopPrice
        if ( price ) {
            params.price = price;
            if ( typeof params.type === 'undefined' ) params.type = 'LIMIT';
        } else {
            if ( typeof params.type === 'undefined' ) params.type = 'MARKET';
        }
        if ( !params.timeInForce && ( params.type.includes( 'LIMIT' ) || params.type === 'STOP' || params.type === 'TAKE_PROFIT' ) ) {
            params.timeInForce = 'GTX'; // Post only by default. Use GTC for limit orders.
        }

        if ( !params.newClientOrderId ) {
            params.newClientOrderId = CONTRACT_PREFIX + uuid22();
        }

        return promiseRequest( 'v1/order', params, { base:fapi, type:'TRADE', method:'POST' } );
    };
    const deliveryOrder = async ( side, symbol, quantity, price = false, params = {} ) => {
        params.symbol = symbol;
        params.side = side;
        params.quantity = quantity;
        // if in the binance futures setting Hedged mode is active, positionSide parameter is mandatory
        if( Binance.options.hedgeMode ){
            params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT';
        }
        // LIMIT STOP MARKET STOP_MARKET TAKE_PROFIT TAKE_PROFIT_MARKET
        // reduceOnly stopPrice
        if ( price ) {
            params.price = price;
            if ( typeof params.type === 'undefined' ) params.type = 'LIMIT';
        } else {
            if ( typeof params.type === 'undefined' ) params.type = 'MARKET';
        }
        if ( !params.timeInForce && ( params.type.includes( 'LIMIT' ) || params.type === 'STOP' || params.type === 'TAKE_PROFIT' ) ) {
            params.timeInForce = 'GTX'; // Post only by default. Use GTC for limit orders.
        }

        if ( !params.newClientOrderId ) {
            params.newClientOrderId = CONTRACT_PREFIX + uuid22();
        }
        return promiseRequest( 'v1/order', params, { base:dapi, type:'TRADE', method:'POST' } );
    };
    const promiseRequest = async ( url, data = {}, flags = {} ) => {
        return new Promise( ( resolve, reject ) => {
            let query = '', headers = {
                'User-Agent': userAgent,
                'Content-type': 'application/x-www-form-urlencoded'
            };
            if ( typeof flags.method === 'undefined' ) flags.method = 'GET'; // GET POST PUT DELETE
            if ( typeof flags.type === 'undefined' ) flags.type = false; // TRADE, SIGNED, MARKET_DATA, USER_DATA, USER_STREAM
            else {
                if ( typeof data.recvWindow === 'undefined' ) data.recvWindow = Binance.options.recvWindow;
                requireApiKey( 'promiseRequest' );
                headers['X-MBX-APIKEY'] = Binance.options.APIKEY;
            }
            let baseURL = typeof flags.base === 'undefined' ? base : flags.base;
            if ( Binance.options.test && baseURL === base ) baseURL = baseTest;
            if ( Binance.options.test && baseURL === fapi ) baseURL = fapiTest;
            if ( Binance.options.test && baseURL === dapi ) baseURL = dapiTest;
            let opt = {
                headers,
                url: baseURL + url,
                method: flags.method,
                timeout: Binance.options.recvWindow,
                followAllRedirects: true
            };
            if ( flags.type === 'SIGNED' || flags.type === 'TRADE' || flags.type === 'USER_DATA' ) {
                if ( !requireApiSecret( 'promiseRequest' ) ) return reject( 'promiseRequest: Invalid API Secret!' );
                data.timestamp = new Date().getTime() + Binance.info.timeOffset;
                query = makeQueryString( data );
                data.signature = crypto.createHmac( 'sha256', Binance.options.APISECRET ).update( query ).digest( 'hex' ); // HMAC hash header
                opt.url = `${ baseURL }${ url }?${ query }&signature=${ data.signature }`;
            }
            opt.qs = data;
            /*if ( flags.method === 'POST' ) {
                opt.form = data;
            } else {
                opt.qs = data;
            }*/
            try {
                request( addProxy( opt ), ( error, response, body ) => {
                    if ( error ) return reject( error );
                    try {
                        Binance.info.lastRequest = new Date().getTime();
                        if ( response ) {
                            Binance.info.statusCode = response.statusCode || 0;
                            if ( response.request ) Binance.info.lastURL = response.request.uri.href;
                            if ( response.headers ) {
                                Binance.info.usedWeight = response.headers['x-mbx-used-weight-1m'] || 0;
                                Binance.info.futuresLatency = response.headers['x-response-time'] || 0;
                            }
                        }
                        if ( !error && response.statusCode == 200 ) return resolve( JSONbig.parse( body ) );
                        if ( typeof response.body !== 'undefined' ) {
                            return resolve( JSONbig.parse( response.body ) );
                        }
                        return reject( response );
                    } catch ( err ) {
                        return reject( `promiseRequest error #${ response.statusCode }` );
                    }
                } ).on( 'error', reject );
            } catch ( err ) {
                return reject( err );
            }
        } );
    };

    /**
     * No-operation function
     * @return {undefined}
     */
    const noop = () => { }; // Do nothing.

    /**
     * Reworked Tuitio's heartbeat code into a shared single interval tick
     * @return {undefined}
     */
    const socketHeartbeat = () => {
        /* Sockets removed from `subscriptions` during a manual terminate()
         will no longer be at risk of having functions called on them */
        for ( let endpointId in Binance.subscriptions ) {
            const ws = Binance.subscriptions[endpointId];
            if ( ws.isAlive ) {
                ws.isAlive = false;
                if ( ws.readyState === WebSocket.OPEN ) ws.ping( noop );
            } else {
                if ( Binance.options.verbose ) Binance.options.log( 'Terminating inactive/broken WebSocket: ' + ws.endpoint );
                if ( ws.readyState === WebSocket.OPEN ) ws.terminate();
            }
        }
    };

    /**
     * Called when socket is opened, subscriptions are registered for later reference
     * @param {function} opened_callback - a callback function
     * @return {undefined}
     */
    const handleSocketOpen = function ( opened_callback ) {
        this.isAlive = true;
        if ( Object.keys( Binance.subscriptions ).length === 0 ) {
            Binance.socketHeartbeatInterval = setInterval( socketHeartbeat, 30000 );
        }
        Binance.subscriptions[this.endpoint] = this;
        if ( typeof opened_callback === 'function' ) opened_callback( this.endpoint );
    };

    /**
     * Called when socket is closed, subscriptions are de-registered for later reference
     * @param {boolean} reconnect - true or false to reconnect the socket
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    const handleSocketClose = function ( reconnect, code, reason ) {
        delete Binance.subscriptions[this.endpoint];
        if ( Binance.subscriptions && Object.keys( Binance.subscriptions ).length === 0 ) {
            clearInterval( Binance.socketHeartbeatInterval );
        }
        Binance.options.log( 'WebSocket closed: ' + this.endpoint +
          ( code ? ' (' + code + ')' : '' ) +
          ( reason ? ' ' + reason : '' ) );
        if ( Binance.options.reconnect && this.reconnect && reconnect ) {
            if ( this.endpoint && parseInt( this.endpoint.length, 10 ) === 60 ) Binance.options.log( 'Account data WebSocket reconnecting...' );
            else Binance.options.log( 'WebSocket reconnecting: ' + this.endpoint + '...' );
            try {
                reconnect();
            } catch ( error ) {
                Binance.options.log( 'WebSocket reconnect error: ' + error.message );
            }
        }
    };

    /**
     * Called when socket errors
     * @param {object} error - error object message
     * @return {undefined}
     */
    const handleSocketError = function ( error ) {
        /* Errors ultimately result in a `close` event.
         see: https://github.com/websockets/ws/blob/828194044bf247af852b31c49e2800d557fedeff/lib/websocket.js#L126 */
        Binance.options.log( 'WebSocket error: ' + this.endpoint +
          ( error.code ? ' (' + error.code + ')' : '' ) +
          ( error.message ? ' ' + error.message : '' ) );
    };

    /**
     * Called on each socket heartbeat
     * @return {undefined}
     */
    const handleSocketHeartbeat = function () {
        this.isAlive = true;
    };

    /**
     * Used to subscribe to a single websocket endpoint
     * @param {string} endpoint - endpoint to connect to
     * @param {function} callback - the function to call when information is received
     * @param {boolean} reconnect - whether to reconnect on disconnect
     * @param {object} opened_callback - the function to call when opened
     * @return {WebSocket} - websocket reference
     */
    const subscribe = function ( endpoint, callback, reconnect = false, opened_callback = false ) {
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        let ws = false;

        if ( socksproxy !== false ) {
            socksproxy = proxyReplacewithIp( socksproxy );
            if ( Binance.options.verbose ) Binance.options.log( 'using socks proxy server ' + socksproxy );
            let agent = new SocksProxyAgent( {
                protocol: parseProxy( socksproxy )[0],
                host: parseProxy( socksproxy )[1],
                port: parseProxy( socksproxy )[2]
            } );
            ws = new WebSocket( stream + endpoint, { agent: agent } );
        } else if ( httpsproxy !== false ) {
            let config = url.parse( httpsproxy );
            let agent = new HttpsProxyAgent( config );
            if ( Binance.options.verbose ) Binance.options.log( 'using proxy server ' + agent );
            ws = new WebSocket( stream + endpoint, { agent: agent } );
        } else {
            ws = new WebSocket( stream + endpoint );
        }

        if ( Binance.options.verbose ) Binance.options.log( 'Subscribed to ' + endpoint );
        ws.reconnect = Binance.options.reconnect;
        ws.endpoint = endpoint;
        ws.isAlive = false;
        ws.on( 'open', handleSocketOpen.bind( ws, opened_callback ) );
        ws.on( 'pong', handleSocketHeartbeat );
        ws.on( 'error', handleSocketError );
        ws.on( 'close', handleSocketClose.bind( ws, reconnect ) );
        ws.on( 'message', data => {
            try {
                callback( JSON.parse( data ) );
            } catch ( error ) {
                Binance.options.log( 'Parse error: ' + error.message );
            }
        } );
        return ws;
    };

    /**
     * Used to subscribe to a combined websocket endpoint
     * @param {string} streams - streams to connect to
     * @param {function} callback - the function to call when information is received
     * @param {boolean} reconnect - whether to reconnect on disconnect
     * @param {object} opened_callback - the function to call when opened
     * @return {WebSocket} - websocket reference
     */
    const subscribeCombined = function ( streams, callback, reconnect = false, opened_callback = false ) {
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        const queryParams = streams.join( '/' );
        let ws = false;
        if ( socksproxy !== false ) {
            socksproxy = proxyReplacewithIp( socksproxy );
            if ( Binance.options.verbose ) Binance.options.log( 'using socks proxy server ' + socksproxy );
            let agent = new SocksProxyAgent( {
                protocol: parseProxy( socksproxy )[0],
                host: parseProxy( socksproxy )[1],
                port: parseProxy( socksproxy )[2]
            } );
            ws = new WebSocket( combineStream + queryParams, { agent: agent } );
        } else if ( httpsproxy !== false ) {
            if ( Binance.options.verbose ) Binance.options.log( 'using proxy server ' + httpsproxy );
            let config = url.parse( httpsproxy );
            let agent = new HttpsProxyAgent( config );
            ws = new WebSocket( combineStream + queryParams, { agent: agent } );
        } else {
            ws = new WebSocket( combineStream + queryParams );
        }

        ws.reconnect = Binance.options.reconnect;
        ws.endpoint = stringHash( queryParams );
        ws.isAlive = false;
        if ( Binance.options.verbose ) {
            Binance.options.log( 'CombinedStream: Subscribed to [' + ws.endpoint + '] ' + queryParams );
        }
        ws.on( 'open', handleSocketOpen.bind( ws, opened_callback ) );
        ws.on( 'pong', handleSocketHeartbeat );
        ws.on( 'error', handleSocketError );
        ws.on( 'close', handleSocketClose.bind( ws, reconnect ) );
        ws.on( 'message', data => {
            try {
                callback( JSON.parse( data ).data );
            } catch ( error ) {
                Binance.options.log( 'CombinedStream: Parse error: ' + error.message );
            }
        } );
        return ws;
    };

    /**
     * Used to terminate a web socket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    const terminate = function ( endpoint, reconnect = false ) {
        let ws = Binance.subscriptions[endpoint];
        if ( !ws ) return;
        ws.removeAllListeners( 'message' );
        ws.reconnect = reconnect;
        ws.terminate();
    }


    /**
     * Futures heartbeat code with a shared single interval tick
     * @return {undefined}
     */
    const futuresSocketHeartbeat = () => {
        /* Sockets removed from subscriptions during a manual terminate()
         will no longer be at risk of having functions called on them */
        for ( let endpointId in Binance.futuresSubscriptions ) {
            const ws = Binance.futuresSubscriptions[endpointId];
            if ( ws.isAlive ) {
                ws.isAlive = false;
                if ( ws.readyState === WebSocket.OPEN ) ws.ping( noop );
            } else {
                if ( Binance.options.verbose ) Binance.options.log( `Terminating zombie futures WebSocket: ${ ws.endpoint }` );
                if ( ws.readyState === WebSocket.OPEN ) ws.terminate();
            }
        }
    };

    /**
     * Called when a futures socket is opened, subscriptions are registered for later reference
     * @param {function} openCallback - a callback function
     * @return {undefined}
     */
    const handleFuturesSocketOpen = function ( openCallback ) {
        this.isAlive = true;
        if ( Object.keys( Binance.futuresSubscriptions ).length === 0 ) {
            Binance.socketHeartbeatInterval = setInterval( futuresSocketHeartbeat, 30000 );
        }
        Binance.futuresSubscriptions[this.endpoint] = this;
        if ( typeof openCallback === 'function' ) openCallback( this.endpoint );
    };

    /**
     * Called when futures websocket is closed, subscriptions are de-registered for later reference
     * @param {boolean} reconnect - true or false to reconnect the socket
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    const handleFuturesSocketClose = function ( reconnect, code, reason ) {
        delete Binance.futuresSubscriptions[this.endpoint];
        if ( Binance.futuresSubscriptions && Object.keys( Binance.futuresSubscriptions ).length === 0 ) {
            clearInterval( Binance.socketHeartbeatInterval );
        }
        Binance.options.log( 'Futures WebSocket closed: ' + this.endpoint +
          ( code ? ' (' + code + ')' : '' ) +
          ( reason ? ' ' + reason : '' ) );
        if ( Binance.options.reconnect && this.reconnect && reconnect ) {
            if ( this.endpoint && parseInt( this.endpoint.length, 10 ) === 60 ) Binance.options.log( 'Futures account data WebSocket reconnecting...' );
            else Binance.options.log( 'Futures WebSocket reconnecting: ' + this.endpoint + '...' );
            try {
                reconnect();
            } catch ( error ) {
                Binance.options.log( 'Futures WebSocket reconnect error: ' + error.message );
            }
        }
    };

    /**
     * Called when a futures websocket errors
     * @param {object} error - error object message
     * @return {undefined}
     */
    const handleFuturesSocketError = function ( error ) {
        Binance.options.log( 'Futures WebSocket error: ' + this.endpoint +
          ( error.code ? ' (' + error.code + ')' : '' ) +
          ( error.message ? ' ' + error.message : '' ) );
    };

    /**
     * Called on each futures socket heartbeat
     * @return {undefined}
     */
    const handleFuturesSocketHeartbeat = function () {
        this.isAlive = true;
    };

    /**
     * Used to subscribe to a single futures websocket endpoint
     * @param {string} endpoint - endpoint to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    const futuresSubscribeSingle = function ( endpoint, callback, params = {} ) {
        if ( typeof params === 'boolean' ) params = { reconnect: params };
        if ( !params.reconnect ) params.reconnect = false;
        if ( !params.openCallback ) params.openCallback = false;
        if ( !params.id ) params.id = false;
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        let ws = false;

        if ( socksproxy !== false ) {
            socksproxy = proxyReplacewithIp( socksproxy );
            if ( Binance.options.verbose ) Binance.options.log( `futuresSubscribeSingle: using socks proxy server: ${ socksproxy }` );
            let agent = new SocksProxyAgent( {
                protocol: parseProxy( socksproxy )[0],
                host: parseProxy( socksproxy )[1],
                port: parseProxy( socksproxy )[2]
            } );
            ws = new WebSocket( ( Binance.options.test ? fstreamSingleTest : fstreamSingle ) + endpoint, { agent } );
        } else if ( httpsproxy !== false ) {
            let config = url.parse( httpsproxy );
            let agent = new HttpsProxyAgent( config );
            if ( Binance.options.verbose ) Binance.options.log( `futuresSubscribeSingle: using proxy server: ${ agent }` );
            ws = new WebSocket( ( Binance.options.test ? fstreamSingleTest : fstreamSingle ) + endpoint, { agent } );
        } else {
            ws = new WebSocket( ( Binance.options.test ? fstreamSingleTest : fstreamSingle ) + endpoint );
        }

        if ( Binance.options.verbose ) Binance.options.log( 'futuresSubscribeSingle: Subscribed to ' + endpoint );
        ws.reconnect = Binance.options.reconnect;
        ws.endpoint = endpoint;
        ws.isAlive = false;
        ws.on( 'open', handleFuturesSocketOpen.bind( ws, params.openCallback ) );
        ws.on( 'pong', handleFuturesSocketHeartbeat );
        ws.on( 'error', handleFuturesSocketError );
        ws.on( 'close', handleFuturesSocketClose.bind( ws, params.reconnect ) );
        ws.on( 'message', data => {
            try {
                callback( JSONbig.parse( data ) );
            } catch ( error ) {
                Binance.options.log( 'Parse error: ' + error.message );
            }
        } );
        return ws;
    };

    /**
     * Used to subscribe to a combined futures websocket endpoint
     * @param {string} streams - streams to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    const futuresSubscribe = function ( streams, callback, params = {} ) {
        if ( typeof streams === 'string' ) return futuresSubscribeSingle( streams, callback, params );
        if ( typeof params === 'boolean' ) params = { reconnect: params };
        if ( !params.reconnect ) params.reconnect = false;
        if ( !params.openCallback ) params.openCallback = false;
        if ( !params.id ) params.id = false;
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        const queryParams = streams.join( '/' );
        let ws = false;
        if ( socksproxy !== false ) {
            socksproxy = proxyReplacewithIp( socksproxy );
            if ( Binance.options.verbose ) Binance.options.log( `futuresSubscribe: using socks proxy server ${ socksproxy }` );
            let agent = new SocksProxyAgent( {
                protocol: parseProxy( socksproxy )[0],
                host: parseProxy( socksproxy )[1],
                port: parseProxy( socksproxy )[2]
            } );
            ws = new WebSocket( ( Binance.options.test ? fstreamTest : fstream ) + queryParams, { agent } );
        } else if ( httpsproxy !== false ) {
            if ( Binance.options.verbose ) Binance.options.log( `futuresSubscribe: using proxy server ${ httpsproxy }` );
            let config = url.parse( httpsproxy );
            let agent = new HttpsProxyAgent( config );
            ws = new WebSocket( ( Binance.options.test ? fstreamTest : fstream ) + queryParams, { agent } );
        } else {
            ws = new WebSocket( ( Binance.options.test ? fstreamTest : fstream ) + queryParams );
        }

        ws.reconnect = Binance.options.reconnect;
        ws.endpoint = stringHash( queryParams );
        ws.isAlive = false;
        if ( Binance.options.verbose ) {
            Binance.options.log( `futuresSubscribe: Subscribed to [${ ws.endpoint }] ${ queryParams }` );
        }
        ws.on( 'open', handleFuturesSocketOpen.bind( ws, params.openCallback ) );
        ws.on( 'pong', handleFuturesSocketHeartbeat );
        ws.on( 'error', handleFuturesSocketError );
        ws.on( 'close', handleFuturesSocketClose.bind( ws, params.reconnect ) );
        ws.on( 'message', data => {
            try {
                callback( JSON.parse( data ).data );
            } catch ( error ) {
                Binance.options.log( `futuresSubscribe: Parse error: ${ error.message }` );
            }
        } );
        return ws;
    };

    /**
     * Used to terminate a futures websocket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    const futuresTerminate = function ( endpoint, reconnect = false ) {
        let ws = Binance.futuresSubscriptions[endpoint];
        if ( !ws ) return;
        ws.removeAllListeners( 'message' );
        ws.reconnect = reconnect;
        ws.terminate();
    }

    /**
     * Combines all futures OHLC data with the latest update
     * @param {string} symbol - the symbol
     * @param {string} interval - time interval
     * @return {array} - interval data for given symbol
     */
    const futuresKlineConcat = ( symbol, interval ) => {
        let output = Binance.futuresTicks[symbol][interval];
        if ( typeof Binance.futuresRealtime[symbol][interval].time === 'undefined' ) return output;
        const time = Binance.futuresRealtime[symbol][interval].time;
        const last_updated = Object.keys( Binance.futuresTicks[symbol][interval] ).pop();
        if ( time >= last_updated ) {
            output[time] = Binance.futuresRealtime[symbol][interval];
            //delete output[time].time;
            output[last_updated].isFinal = true;
            output[time].isFinal = false;
        }
        return output;
    };

    /**
     * Used for websocket futures @kline
     * @param {string} symbol - the symbol
     * @param {object} kline - object with kline info
     * @param {string} firstTime - time filter
     * @return {undefined}
     */
    const futuresKlineHandler = ( symbol, kline, firstTime = 0 ) => {
        // eslint-disable-next-line no-unused-vars
        let { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        let { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, V: takerBuyBaseVolume, Q: takerBuyQuoteVolume, n: trades, t: time, T:closeTime } = ticks;
        if ( time <= firstTime ) return;
        if ( !isFinal ) {
            // if ( typeof Binance.futuresRealtime[symbol][interval].time !== 'undefined' ) {
            //     if ( Binance.futuresRealtime[symbol][interval].time > time ) return;
            // }
            Binance.futuresRealtime[symbol][interval] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades, isFinal };
            return;
        }
        const first_updated = Object.keys( Binance.futuresTicks[symbol][interval] ).shift();
        if ( first_updated ) delete Binance.futuresTicks[symbol][interval][first_updated];
        Binance.futuresTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades, isFinal:false };
    };

    /**
     * Converts the futures liquidation stream data into a friendly object
     * @param {object} data - liquidation data callback data type
     * @return {object} - user friendly data type
     */
    const fLiquidationConvertData = data => {
        let eventType = data.e, eventTime = data.E;
        let {
            s: symbol,
            S: side,
            o: orderType,
            f: timeInForce,
            q: origAmount,
            p: price,
            ap: avgPrice,
            X: orderStatus,
            l: lastFilledQty,
            z: totalFilledQty,
            T: tradeTime
        } = data.o;
        return { symbol, side, orderType, timeInForce, origAmount, price, avgPrice, orderStatus, lastFilledQty, totalFilledQty, eventType, tradeTime, eventTime };
    };

    /**
     * Converts the futures ticker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const fTickerConvertData = data => {
        let friendlyData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                p: priceChange,
                P: percentChange,
                w: averagePrice,
                c: close,
                Q: closeQty,
                o: open,
                h: high,
                l: low,
                v: volume,
                q: quoteVolume,
                O: openTime,
                C: closeTime,
                F: firstTradeId,
                L: lastTradeId,
                n: numTrades
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                priceChange,
                percentChange,
                averagePrice,
                close,
                closeQty,
                open,
                high,
                low,
                volume,
                quoteVolume,
                openTime,
                closeTime,
                firstTradeId,
                lastTradeId,
                numTrades
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                result.push( friendlyData( obj ) );
            }
            return result;
        }
        return friendlyData( data );
    }

    /**
     * Converts the futures miniTicker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const fMiniTickerConvertData = data => {
        let friendlyData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                c: close,
                o: open,
                h: high,
                l: low,
                v: volume,
                q: quoteVolume
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                close,
                open,
                high,
                low,
                volume,
                quoteVolume
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                result.push( friendlyData( obj ) );
            }
            return result;
        }
        return friendlyData( data );
    }

    /**
     * Converts the futures bookTicker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const fBookTickerConvertData = data => {
        let {
            u: updateId,
            s: symbol,
            b: bestBid,
            B: bestBidQty,
            a: bestAsk,
            A: bestAskQty
        } = data;
        return {
            updateId,
            symbol,
            bestBid,
            bestBidQty,
            bestAsk,
            bestAskQty
        };
    };

    /**
     * Converts the futures UserData stream MARGIN_CALL data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const fUserDataMarginConvertData = data => {
        let {
            e: eventType,
            E: eventTime,
            cw: crossWalletBalance, // only pushed with crossed position margin call
            p: positions
        } = data;
        let positionConverter = position => {
            let {
                s: symbol,
                ps: positionSide,
                pa: positionAmount,
                mt: marginType,
                iw: isolatedWallet, // if isolated position
                mp: markPrice,
                up: unrealizedPnL,
                mm: maintenanceMargin // maintenance margin required
            } = position;
            return {
                symbol,
                positionSide,
                positionAmount,
                marginType,
                isolatedWallet,
                markPrice,
                unrealizedPnL,
                maintenanceMargin
            }
        };
        const convertedPositions = [];
        for ( let position of positions ) {
            convertedPositions.push( positionConverter( position ) );
        }
        positions = convertedPositions;
        return {
            eventType,
            eventTime,
            crossWalletBalance,
            positions
        };
    };

    /**
     * Converts the futures UserData stream ACCOUNT_CONFIG_UPDATE into a friendly object
     * @param {object} data - user config callback data type
     * @return {object} - user friendly data type
     */
    const fUserConfigDataAccountUpdateConvertData = data => {
        return {
            eventType: data.e,
            eventTime: data.E,
            transactionTime: data.T,
            ac: {
                symbol: data.ac.s,
                leverage: data.ac.l
            }
        };
    };

    /**
     * Converts the futures UserData stream ACCOUNT_UPDATE data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const fUserDataAccountUpdateConvertData = data => {
        let {
            e: eventType,
            E: eventTime,
            T: transaction,
            a: updateData
        } = data;
        let updateConverter = updateData => {
            let {
                m: eventReasonType,
                B: balances,
                P: positions
            } = updateData;
            let positionConverter = position => {
                let {
                    s: symbol,
                    pa: positionAmount,
                    ep: entryPrice,
                    cr: accumulatedRealized, // (Pre-fee) Accumulated Realized
                    up: unrealizedPnL,
                    mt: marginType,
                    iw: isolatedWallet, // if isolated position
                    ps: positionSide
                } = position;
                return {
                    symbol,
                    positionAmount,
                    entryPrice,
                    accumulatedRealized,
                    unrealizedPnL,
                    marginType,
                    isolatedWallet,
                    positionSide
                };
            };
            let balanceConverter = balance => {
                let {
                    a: asset,
                    wb: walletBalance,
                    cw: crossWalletBalance,
                    bc: balanceChange
                } = balance;
                return {
                    asset,
                    walletBalance,
                    crossWalletBalance,
                    balanceChange
                };
            };

            const balanceResult = [];
            const positionResult = [];

            for ( let balance of balances ) {
                balanceResult.push( balanceConverter( balance ) );
            }
            for ( let position of positions ) {
                positionResult.push( positionConverter( position ) );
            }

            balances = balanceResult;
            positions = positionResult;
            return {
                eventReasonType,
                balances,
                positions
            };
        };
        updateData = updateConverter( updateData );
        return {
            eventType,
            eventTime,
            transaction,
            updateData
        };
    };

    /**
     * Converts the futures UserData stream ORDER_TRADE_UPDATE data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const fUserDataOrderUpdateConvertData = data => {
        let {
            e: eventType,
            E: eventTime,
            T: transaction, // transaction time
            o: order
        } = data;

        let orderConverter = order => {
            let {
                s: symbol,
                c: clientOrderId,
                // special client order id:
                // starts with "autoclose-": liquidation order
                // "adl_autoclose": ADL auto close order
                S: side,
                o: orderType,
                f: timeInForce,
                q: originalQuantity,
                p: originalPrice,
                ap: averagePrice,
                sp: stopPrice, // please ignore with TRAILING_STOP_MARKET order,
                x: executionType,
                X: orderStatus,
                i: orderId,
                l: orderLastFilledQuantity,
                z: orderFilledAccumulatedQuantity,
                L: lastFilledPrice,
                N: commissionAsset, // will not push if no commission
                n: commission, // will not push if no commission
                T: orderTradeTime,
                t: tradeId,
                b: bidsNotional,
                a: askNotional,
                m: isMakerSide, // is this trade maker side
                R: isReduceOnly, // is this reduce only
                wt: stopPriceWorkingType,
                ot: originalOrderType,
                ps: positionSide,
                cp: closeAll, // if close-all, pushed with conditional order
                AP: activationPrice, // only pushed with TRAILING_STOP_MARKET order
                cr: callbackRate, // only pushed with TRAILING_STOP_MARKET order
                rp: realizedProfit
            } = order;
            return {
                symbol,
                clientOrderId,
                side,
                orderType,
                timeInForce,
                originalQuantity,
                originalPrice,
                averagePrice,
                stopPrice,
                executionType,
                orderStatus,
                orderId,
                orderLastFilledQuantity,
                orderFilledAccumulatedQuantity,
                lastFilledPrice,
                commissionAsset,
                commission,
                orderTradeTime,
                tradeId,
                bidsNotional,
                askNotional,
                isMakerSide,
                isReduceOnly,
                stopPriceWorkingType,
                originalOrderType,
                positionSide,
                closeAll,
                activationPrice,
                callbackRate,
                realizedProfit
            };
        };
        order = orderConverter( order );
        return {
            eventType,
            eventTime,
            transaction,
            order
        };
    };

    /**
     * Converts the futures markPrice stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const fMarkPriceConvertData = data => {
        let friendlyData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                p: markPrice,
                i: indexPrice,
                r: fundingRate,
                T: fundingTime
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                markPrice,
                indexPrice,
                fundingRate,
                fundingTime
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                result.push( friendlyData( obj ) );
            }
            return result;
        }
        return friendlyData( data );
    }

    /**
     * Converts the futures aggTrade stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const fAggTradeConvertData = data => {
        let friendlyData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                a: aggTradeId,
                p: price,
                q: amount,
                f: firstTradeId,
                l: lastTradeId,
                T: timestamp,
                m: maker
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                aggTradeId,
                price,
                amount,
                total: price * amount,
                firstTradeId,
                lastTradeId,
                timestamp,
                maker
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                result.push( friendlyData( obj ) );
            }
            return result;
        }
        return friendlyData( data );
    }

    /**
     * Delivery heartbeat code with a shared single interval tick
     * @return {undefined}
     */
    const deliverySocketHeartbeat = () => {
        /* Sockets removed from subscriptions during a manual terminate()
         will no longer be at risk of having functions called on them */
        for ( let endpointId in Binance.deliverySubscriptions ) {
            const ws = Binance.deliverySubscriptions[endpointId];
            if ( ws.isAlive ) {
                ws.isAlive = false;
                if ( ws.readyState === WebSocket.OPEN ) ws.ping( noop );
            } else {
                if ( Binance.options.verbose ) Binance.options.log( `Terminating zombie delivery WebSocket: ${ ws.endpoint }` );
                if ( ws.readyState === WebSocket.OPEN ) ws.terminate();
            }
        }
    };

    /**
     * Called when a delivery socket is opened, subscriptions are registered for later reference
     * @param {function} openCallback - a callback function
     * @return {undefined}
     */
    const handleDeliverySocketOpen = function ( openCallback ) {
        this.isAlive = true;
        if ( Object.keys( Binance.deliverySubscriptions ).length === 0 ) {
            Binance.socketHeartbeatInterval = setInterval( deliverySocketHeartbeat, 30000 );
        }
        Binance.deliverySubscriptions[this.endpoint] = this;
        if ( typeof openCallback === 'function' ) openCallback( this.endpoint );
    };

    /**
     * Called when delivery websocket is closed, subscriptions are de-registered for later reference
     * @param {boolean} reconnect - true or false to reconnect the socket
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    const handleDeliverySocketClose = function ( reconnect, code, reason ) {
        delete Binance.deliverySubscriptions[this.endpoint];
        if ( Binance.deliverySubscriptions && Object.keys( Binance.deliverySubscriptions ).length === 0 ) {
            clearInterval( Binance.socketHeartbeatInterval );
        }
        Binance.options.log( 'Delivery WebSocket closed: ' + this.endpoint +
          ( code ? ' (' + code + ')' : '' ) +
          ( reason ? ' ' + reason : '' ) );
        if ( Binance.options.reconnect && this.reconnect && reconnect ) {
            if ( this.endpoint && parseInt( this.endpoint.length, 10 ) === 60 ) Binance.options.log( 'Delivery account data WebSocket reconnecting...' );
            else Binance.options.log( 'Delivery WebSocket reconnecting: ' + this.endpoint + '...' );
            try {
                reconnect();
            } catch ( error ) {
                Binance.options.log( 'Delivery WebSocket reconnect error: ' + error.message );
            }
        }
    };

    /**
     * Called when a delivery websocket errors
     * @param {object} error - error object message
     * @return {undefined}
     */
    const handleDeliverySocketError = function ( error ) {
        Binance.options.log( 'Delivery WebSocket error: ' + this.endpoint +
          ( error.code ? ' (' + error.code + ')' : '' ) +
          ( error.message ? ' ' + error.message : '' ) );
    };

    /**
     * Called on each delivery socket heartbeat
     * @return {undefined}
     */
    const handleDeliverySocketHeartbeat = function () {
        this.isAlive = true;
    };

    /**
     * Used to subscribe to a single delivery websocket endpoint
     * @param {string} endpoint - endpoint to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    const deliverySubscribeSingle = function ( endpoint, callback, params = {} ) {
        if ( typeof params === 'boolean' ) params = { reconnect: params };
        if ( !params.reconnect ) params.reconnect = false;
        if ( !params.openCallback ) params.openCallback = false;
        if ( !params.id ) params.id = false;
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        let ws = false;
        if ( socksproxy !== false ) {
            socksproxy = proxyReplacewithIp( socksproxy );
            if ( Binance.options.verbose ) Binance.options.log( `deliverySubscribeSingle: using socks proxy server: ${ socksproxy }` );
            let agent = new SocksProxyAgent( {
                protocol: parseProxy( socksproxy )[0],
                host: parseProxy( socksproxy )[1],
                port: parseProxy( socksproxy )[2]
            } );
            ws = new WebSocket( ( Binance.options.test ? dstreamSingleTest : dstreamSingle ) + endpoint, { agent } );
        } else if ( httpsproxy !== false ) {
            let config = url.parse( httpsproxy );
            let agent = new HttpsProxyAgent( config );
            if ( Binance.options.verbose ) Binance.options.log( `deliverySubscribeSingle: using proxy server: ${ agent }` );
            ws = new WebSocket( ( Binance.options.test ? dstreamSingleTest : dstreamSingle ) + endpoint, { agent } );
        } else {
            ws = new WebSocket( ( Binance.options.test ? dstreamSingleTest : dstreamSingle ) + endpoint );
        }

        if ( Binance.options.verbose ) Binance.options.log( 'deliverySubscribeSingle: Subscribed to ' + endpoint );
        ws.reconnect = Binance.options.reconnect;
        ws.endpoint = endpoint;
        ws.isAlive = false;
        ws.on( 'open', handleDeliverySocketOpen.bind( ws, params.openCallback ) );
        ws.on( 'pong', handleDeliverySocketHeartbeat );
        ws.on( 'error', handleDeliverySocketError );
        ws.on( 'close', handleDeliverySocketClose.bind( ws, params.reconnect ) );
        ws.on( 'message', data => {
            try {
                callback( JSON.parse( data ) );
            } catch ( error ) {
                Binance.options.log( 'Parse error: ' + error.message );
            }
        } );
        return ws;
    };

    /**
     * Used to subscribe to a combined delivery websocket endpoint
     * @param {string} streams - streams to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    const deliverySubscribe = function ( streams, callback, params = {} ) {
        if ( typeof streams === 'string' ) return deliverySubscribeSingle( streams, callback, params );
        if ( typeof params === 'boolean' ) params = { reconnect: params };
        if ( !params.reconnect ) params.reconnect = false;
        if ( !params.openCallback ) params.openCallback = false;
        if ( !params.id ) params.id = false;
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        const queryParams = streams.join( '/' );
        let ws = false;
        if ( socksproxy !== false ) {
            socksproxy = proxyReplacewithIp( socksproxy );
            if ( Binance.options.verbose ) Binance.options.log( `deliverySubscribe: using socks proxy server ${ socksproxy }` );
            let agent = new SocksProxyAgent( {
                protocol: parseProxy( socksproxy )[0],
                host: parseProxy( socksproxy )[1],
                port: parseProxy( socksproxy )[2]
            } );
            ws = new WebSocket( ( Binance.options.test ? dstreamTest : dstream ) + queryParams, { agent } );
        } else if ( httpsproxy !== false ) {
            if ( Binance.options.verbose ) Binance.options.log( `deliverySubscribe: using proxy server ${ httpsproxy }` );
            let config = url.parse( httpsproxy );
            let agent = new HttpsProxyAgent( config );
            ws = new WebSocket( ( Binance.options.test ? dstreamTest : dstream ) + queryParams, { agent } );
        } else {
            ws = new WebSocket( ( Binance.options.test ? dstreamTest : dstream ) + queryParams );
        }

        ws.reconnect = Binance.options.reconnect;
        ws.endpoint = stringHash( queryParams );
        ws.isAlive = false;
        if ( Binance.options.verbose ) {
            Binance.options.log( `deliverySubscribe: Subscribed to [${ ws.endpoint }] ${ queryParams }` );
        }
        ws.on( 'open', handleDeliverySocketOpen.bind( ws, params.openCallback ) );
        ws.on( 'pong', handleDeliverySocketHeartbeat );
        ws.on( 'error', handleDeliverySocketError );
        ws.on( 'close', handleDeliverySocketClose.bind( ws, params.reconnect ) );
        ws.on( 'message', data => {
            try {
                callback( JSON.parse( data ).data );
            } catch ( error ) {
                Binance.options.log( `deliverySubscribe: Parse error: ${ error.message }` );
            }
        } );
        return ws;
    };

    /**
     * Used to terminate a delivery websocket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    const deliveryTerminate = function ( endpoint, reconnect = false ) {
        let ws = Binance.deliverySubscriptions[endpoint];
        if ( !ws ) return;
        ws.removeAllListeners( 'message' );
        ws.reconnect = reconnect;
        ws.terminate();
    }

    /**
     * Combines all delivery OHLC data with the latest update
     * @param {string} symbol - the symbol
     * @param {string} interval - time interval
     * @return {array} - interval data for given symbol
     */
    const deliveryKlineConcat = ( symbol, interval ) => {
        let output = Binance.deliveryTicks[symbol][interval];
        if ( typeof Binance.deliveryRealtime[symbol][interval].time === 'undefined' ) return output;
        const time = Binance.deliveryRealtime[symbol][interval].time;
        const last_updated = Object.keys( Binance.deliveryTicks[symbol][interval] ).pop();
        if ( time >= last_updated ) {
            output[time] = Binance.deliveryRealtime[symbol][interval];
            //delete output[time].time;
            output[last_updated].isFinal = true;
            output[time].isFinal = false;
        }
        return output;
    };

    /**
     * Used for websocket delivery @kline
     * @param {string} symbol - the symbol
     * @param {object} kline - object with kline info
     * @param {string} firstTime - time filter
     * @return {undefined}
     */
    const deliveryKlineHandler = ( symbol, kline, firstTime = 0 ) => {
        // eslint-disable-next-line no-unused-vars
        let { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        let { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, V: takerBuyBaseVolume, Q: takerBuyQuoteVolume, n: trades, t: time, T:closeTime } = ticks;
        if ( time <= firstTime ) return;
        if ( !isFinal ) {
            // if ( typeof Binance.futuresRealtime[symbol][interval].time !== 'undefined' ) {
            //     if ( Binance.futuresRealtime[symbol][interval].time > time ) return;
            // }
            Binance.deliveryRealtime[symbol][interval] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades, isFinal };
            return;
        }
        const first_updated = Object.keys( Binance.deliveryTicks[symbol][interval] ).shift();
        if ( first_updated ) delete Binance.deliveryTicks[symbol][interval][first_updated];
        Binance.deliveryTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades, isFinal:false };
    };

    /**
     * Converts the delivery liquidation stream data into a friendly object
     * @param {object} data - liquidation data callback data type
     * @return {object} - user friendly data type
     */
    const dLiquidationConvertData = data => {
        let eventType = data.e, eventTime = data.E;
        let {
            s: symbol,
            S: side,
            o: orderType,
            f: timeInForce,
            q: origAmount,
            p: price,
            ap: avgPrice,
            X: orderStatus,
            l: lastFilledQty,
            z: totalFilledQty,
            T: tradeTime
        } = data.o;
        return { symbol, side, orderType, timeInForce, origAmount, price, avgPrice, orderStatus, lastFilledQty, totalFilledQty, eventType, tradeTime, eventTime };
    };

    /**
     * Converts the delivery ticker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const dTickerConvertData = data => {
        let friendlyData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                p: priceChange,
                P: percentChange,
                w: averagePrice,
                c: close,
                Q: closeQty,
                o: open,
                h: high,
                l: low,
                v: volume,
                q: quoteVolume,
                O: openTime,
                C: closeTime,
                F: firstTradeId,
                L: lastTradeId,
                n: numTrades
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                priceChange,
                percentChange,
                averagePrice,
                close,
                closeQty,
                open,
                high,
                low,
                volume,
                quoteVolume,
                openTime,
                closeTime,
                firstTradeId,
                lastTradeId,
                numTrades
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                result.push( friendlyData( obj ) );
            }
            return result;
        }
        return friendlyData( data );
    }

    /**
     * Converts the delivery miniTicker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const dMiniTickerConvertData = data => {
        let friendlyData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                c: close,
                o: open,
                h: high,
                l: low,
                v: volume,
                q: quoteVolume
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                close,
                open,
                high,
                low,
                volume,
                quoteVolume
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                result.push( friendlyData( obj ) );
            }
            return result;
        }
        return friendlyData( data );
    }

    /**
     * Converts the delivery bookTicker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const dBookTickerConvertData = data => {
        let {
            u: updateId,
            s: symbol,
            b: bestBid,
            B: bestBidQty,
            a: bestAsk,
            A: bestAskQty
        } = data;
        return {
            updateId,
            symbol,
            bestBid,
            bestBidQty,
            bestAsk,
            bestAskQty
        };
    }

    /**
     * Converts the delivery markPrice stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const dMarkPriceConvertData = data => {
        let friendlyData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                p: markPrice,
                r: fundingRate,
                T: fundingTime
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                markPrice,
                fundingRate,
                fundingTime
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                result.push( friendlyData( obj ) );
            }
            return result;
        }
        return friendlyData( data );
    }

    /**
     * Converts the delivery aggTrade stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const dAggTradeConvertData = data => {
        let friendlyData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                a: aggTradeId,
                p: price,
                q: amount,
                f: firstTradeId,
                l: lastTradeId,
                T: timestamp,
                m: maker
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                aggTradeId,
                price,
                amount,
                total: price * amount,
                firstTradeId,
                lastTradeId,
                timestamp,
                maker
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                result.push( friendlyData( obj ) );
            }
            return result;
        }
        return friendlyData( data );
    }

    /**
   * Converts the delivery UserData stream ORDER_TRADE_UPDATE data into a friendly object
   * @param {object} data - user data callback data type
   * @return {object} - user friendly data type
   */
    const dUserDataOrderUpdateConvertData = ( data ) => {
        let {
            e: eventType,
            E: eventTime,
            T: transaction, // transaction time
            o: order,
        } = data;

        let orderConverter = ( order ) => {
            let {
                s: symbol,
                c: clientOrderId,
                // special client order id:
                // starts with "autoclose-": liquidation order
                // "adl_autoclose": ADL auto close order
                S: side,
                o: orderType,
                f: timeInForce,
                q: originalQuantity,
                p: originalPrice,
                ap: averagePrice,
                sp: stopPrice, // please ignore with TRAILING_STOP_MARKET order,
                x: executionType,
                X: orderStatus,
                i: orderId,
                l: orderLastFilledQuantity,
                z: orderFilledAccumulatedQuantity,
                L: lastFilledPrice,
                ma: marginAsset,
                N: commissionAsset, // will not push if no commission
                n: commission, // will not push if no commission
                T: orderTradeTime,
                t: tradeId,
                rp: realizedProfit,
                b: bidsNotional,
                a: askNotional,
                m: isMakerSide, // is this trade maker side
                R: isReduceOnly, // is this reduce only
                wt: stopPriceWorkingType,
                ot: originalOrderType,
                ps: positionSide,
                cp: closeAll, // if close-all, pushed with conditional order
                AP: activationPrice, // only pushed with TRAILING_STOP_MARKET order
                cr: callbackRate, // only pushed with TRAILING_STOP_MARKET order
                pP: priceProtect, // If conditional order trigger is protected
            } = order;
            return {
                symbol,
                clientOrderId,
                side,
                orderType,
                timeInForce,
                originalQuantity,
                originalPrice,
                averagePrice,
                stopPrice,
                executionType,
                orderStatus,
                orderId,
                orderLastFilledQuantity,
                orderFilledAccumulatedQuantity,
                lastFilledPrice,
                marginAsset,
                commissionAsset,
                commission,
                orderTradeTime,
                tradeId,
                bidsNotional,
                askNotional,
                isMakerSide,
                isReduceOnly,
                stopPriceWorkingType,
                originalOrderType,
                positionSide,
                closeAll,
                activationPrice,
                callbackRate,
                realizedProfit,
                priceProtect,
            };
        };
        order = orderConverter( order );
        return {
            eventType,
            eventTime,
            transaction,
            order,
        };
    };

    /**
     * Used as part of the user data websockets callback
     * @param {object} data - user data callback data type
     * @return {undefined}
     */
    const userDataHandler = data => {
        let type = data.e;
        if ( type === 'outboundAccountInfo' ) {
            // XXX: Deprecated in 2020-09-08
        } else if ( type === 'executionReport' ) {
            if ( Binance.options.execution_callback ) Binance.options.execution_callback( data );
        } else if ( type === 'listStatus' ) {
            if ( Binance.options.list_status_callback ) Binance.options.list_status_callback( data );
        } else if ( type === 'outboundAccountPosition' || type === 'balanceUpdate' ) {
            Binance.options.balance_callback( data );
        } else {
            Binance.options.log( 'Unexpected userData: ' + type );
        }
    };

    /**
     * Used as part of the user data websockets callback
     * @param {object} data - user data callback data type
     * @return {undefined}
     */
    const userMarginDataHandler = data => {
        let type = data.e;
        if ( type === 'outboundAccountInfo' ) {
            // XXX: Deprecated in 2020-09-08
        } else if ( type === 'executionReport' ) {
            if ( Binance.options.margin_execution_callback ) Binance.options.margin_execution_callback( data );
        } else if ( type === 'listStatus' ) {
            if ( Binance.options.margin_list_status_callback ) Binance.options.margin_list_status_callback( data );
        } else if ( type === 'outboundAccountPosition' || type === 'balanceUpdate' ) {
            Binance.options.margin_balance_callback( data );
        } else {
            Binance.options.log( 'Unexpected userMarginData: ' + type );
        }
    };

    /**
     * Used as part of the user data websockets callback
     * @param {object} data - user data callback data type
     * @return {undefined}
     */
    const userFutureDataHandler = data => {
        let type = data.e;
        if ( type === 'MARGIN_CALL' ) {
            Binance.options.future_margin_call_callback( fUserDataMarginConvertData( data ) );
        } else if ( type === 'ACCOUNT_UPDATE' ) {
            if ( Binance.options.future_account_update_callback ) {
                Binance.options.future_account_update_callback( fUserDataAccountUpdateConvertData( data ) );
            }
        } else if ( type === 'ORDER_TRADE_UPDATE' ) {
            if ( Binance.options.future_order_update_callback ) {
                Binance.options.future_order_update_callback( fUserDataOrderUpdateConvertData( data ) );
            }
        } else if ( type === 'ACCOUNT_CONFIG_UPDATE' ) {
            if ( Binance.options.future_account_config_update_callback ) {
                Binance.options.future_account_config_update_callback( fUserConfigDataAccountUpdateConvertData( data ) );
            }
        } else {
            Binance.options.log( 'Unexpected userFutureData: ' + type );
        }
    };

    /**
   * Used as part of the user data websockets callback
   * @param {object} data - user data callback data type
   * @return {undefined}
   */
    const userDeliveryDataHandler = ( data ) => {
        let type = data.e;
        if ( type === "MARGIN_CALL" ) {
            Binance.options.delivery_margin_call_callback(
                fUserDataMarginConvertData( data )
            );
        } else if ( type === "ACCOUNT_UPDATE" ) {
            if ( Binance.options.delivery_account_update_callback ) {
                Binance.options.delivery_account_update_callback(
                    fUserDataAccountUpdateConvertData( data )
                );
            }
        } else if ( type === "ORDER_TRADE_UPDATE" ) {
            if ( Binance.options.delivery_order_update_callback ) {
                Binance.options.delivery_order_update_callback(
                    dUserDataOrderUpdateConvertData( data )
                );
            }
        } else {
            Binance.options.log( "Unexpected userDeliveryData: " + type );
        }
    };
	
    /**
    * Universal Transfer requires API permissions enabled 
    * @param {string} type - ENUM , example MAIN_UMFUTURE for SPOT to USDT futures, see https://binance-docs.github.io/apidocs/spot/en/#user-universal-transfer
    * @param {string} asset - the asset - example :USDT    * 
    * @param {number} amount - the callback function
    * @param {function} callback - the callback function
    * @return {promise}
    */
    const universalTransfer = ( type, asset, amount, callback = false ) => {
        let parameters = Object.assign( {
            asset,
            amount,
            type,
        } );
        if ( !callback ) {
            return new Promise( ( resolve, reject ) => {
                signedRequest(
                    sapi + "v1/asset/transfer",
                    parameters,
                    function ( error, data ) {
                        if ( error ) return reject( error );
                        return resolve( data );
                    },
                    "POST"
                );
            } );
        }
        signedRequest(
            sapi + "v1/asset/transfer",
            parameters,
            function ( error, data ) {
                if ( callback ) return callback( error, data );
            },
            "POST"
        );

    }

    /**
   * Transfer between main account and futures/delivery accounts
   * @param {string} asset - the asset
   * @param {number} amount - the asset
   * @param {function} callback - the callback function
   * @param {object} options - additional options
   * @return {undefined}
   */
    const transferBetweenMainAndFutures = function (
        asset,
        amount,
        type,
        callback
    ) {
        let parameters = Object.assign( {
            asset,
            amount,
            type,
        } );
        if ( !callback ) {
            return new Promise( ( resolve, reject ) => {
                signedRequest(
                    sapi + "v1/futures/transfer",
                    parameters,
                    function ( error, data ) {
                        if ( error ) return reject( error );
                        return resolve( data );
                    },
                    "POST"
                );
            } );
        }
        signedRequest(
            sapi + "v1/futures/transfer",
            parameters,
            function ( error, data ) {
                if ( callback ) return callback( error, data );
            },
            "POST"
        );
    };

    /**
     * Converts the previous day stream into friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    const prevDayConvertData = data => {
        let convertData = data => {
            let {
                e: eventType,
                E: eventTime,
                s: symbol,
                p: priceChange,
                P: percentChange,
                w: averagePrice,
                x: prevClose,
                c: close,
                Q: closeQty,
                b: bestBid,
                B: bestBidQty,
                a: bestAsk,
                A: bestAskQty,
                o: open,
                h: high,
                l: low,
                v: volume,
                q: quoteVolume,
                O: openTime,
                C: closeTime,
                F: firstTradeId,
                L: lastTradeId,
                n: numTrades
            } = data;
            return {
                eventType,
                eventTime,
                symbol,
                priceChange,
                percentChange,
                averagePrice,
                prevClose,
                close,
                closeQty,
                bestBid,
                bestBidQty,
                bestAsk,
                bestAskQty,
                open,
                high,
                low,
                volume,
                quoteVolume,
                openTime,
                closeTime,
                firstTradeId,
                lastTradeId,
                numTrades
            };
        }
        if ( Array.isArray( data ) ) {
            const result = [];
            for ( let obj of data ) {
                let converted = convertData( obj );
                result.push( converted );
            }
            return result;
            // eslint-disable-next-line no-else-return
        } else {
            return convertData( data );
        }
    }

    /**
     * Parses the previous day stream and calls the user callback with friendly object
     * @param {object} data - user data callback data type
     * @param {function} callback - user data callback data type
     * @return {undefined}
     */
    const prevDayStreamHandler = ( data, callback ) => {
        const converted = prevDayConvertData( data );
        callback( null, converted );
    };

    /**
     * Gets the price of a given symbol or symbols
     * @param {array} data - array of symbols
     * @return {array} - symbols with their current prices
     */
    const priceData = ( data ) => {
        const prices = {};
        if ( Array.isArray( data ) ) {
            for ( let obj of data ) {
                prices[obj.symbol] = obj.price;
            }
        } else { // Single price returned
            prices[data.symbol] = data.price;
        }
        return prices;
    };

    /**
     * Used by bookTickers to format the bids and asks given given symbols
     * @param {array} data - array of symbols
     * @return {object} - symbols with their bids and asks data
     */
    const bookPriceData = data => {
        let prices = {};
        for ( let obj of data ) {
            prices[obj.symbol] = {
                bid: obj.bidPrice,
                bids: obj.bidQty,
                ask: obj.askPrice,
                asks: obj.askQty
            };
        }
        return prices;
    };

    /**
     * Used by balance to get the balance data
     * @param {array} data - account info object
     * @return {object} - balances hel with available, onorder amounts
     */
    const balanceData = data => {
        let balances = {};
        if ( typeof data === 'undefined' ) return {};
        if ( typeof data.balances === 'undefined' ) {
            Binance.options.log( 'balanceData error', data );
            return {};
        }
        for ( let obj of data.balances ) {
            balances[obj.asset] = { available: obj.free, onOrder: obj.locked };
        }
        return balances;
    };

    /**
     * Used by web sockets depth and populates OHLC and info
     * @param {string} symbol - symbol to get candlestick info
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @param {array} ticks - tick array
     * @return {undefined}
     */
    const klineData = ( symbol, interval, ticks ) => { // Used for /depth
        let last_time = 0;
        if ( isIterable( ticks ) ) {
            for ( let tick of ticks ) {
                // eslint-disable-next-line no-unused-vars
                let [ time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored ] = tick;
                Binance.ohlc[symbol][interval][time] = { open: open, high: high, low: low, close: close, volume: volume };
                last_time = time;
            }

            Binance.info[symbol][interval].timestamp = last_time;
        }
    };

    /**
     * Combines all OHLC data with latest update
     * @param {string} symbol - the symbol
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @return {array} - interval data for given symbol
     */
    const klineConcat = ( symbol, interval ) => {
        let output = Binance.ohlc[symbol][interval];
        if ( typeof Binance.ohlcLatest[symbol][interval].time === 'undefined' ) return output;
        const time = Binance.ohlcLatest[symbol][interval].time;
        const last_updated = Object.keys( Binance.ohlc[symbol][interval] ).pop();
        if ( time >= last_updated ) {
            output[time] = Binance.ohlcLatest[symbol][interval];
            delete output[time].time;
            output[time].isFinal = false;
        }
        return output;
    };

    /**
     * Used for websocket @kline
     * @param {string} symbol - the symbol
     * @param {object} kline - object with kline info
     * @param {string} firstTime - time filter
     * @return {undefined}
     */
    const klineHandler = ( symbol, kline, firstTime = 0 ) => {
        // TODO: add Taker buy base asset volume
        // eslint-disable-next-line no-unused-vars
        let { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        let { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, t: time } = ticks; //n:trades, V:buyVolume, Q:quoteBuyVolume
        if ( time <= firstTime ) return;
        if ( !isFinal ) {
            if ( typeof Binance.ohlcLatest[symbol][interval].time !== 'undefined' ) {
                if ( Binance.ohlcLatest[symbol][interval].time > time ) return;
            }
            Binance.ohlcLatest[symbol][interval] = { open: open, high: high, low: low, close: close, volume: volume, time: time };
            return;
        }
        // Delete an element from the beginning so we don't run out of memory
        const first_updated = Object.keys( Binance.ohlc[symbol][interval] ).shift();
        if ( first_updated ) delete Binance.ohlc[symbol][interval][first_updated];
        Binance.ohlc[symbol][interval][time] = { open: open, high: high, low: low, close: close, volume: volume };
    };


    /**
     * Used by futures websockets chart cache
     * @param {string} symbol - symbol to get candlestick info
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @param {array} ticks - tick array
     * @return {undefined}
     */
    const futuresKlineData = ( symbol, interval, ticks ) => {
        let last_time = 0;
        if ( isIterable( ticks ) ) {
            for ( let tick of ticks ) {
                // eslint-disable-next-line no-unused-vars
                let [ time, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBaseVolume, takerBuyQuoteVolume, ignored ] = tick;
                Binance.futuresTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades };
                last_time = time;
            }
            Binance.futuresMeta[symbol][interval].timestamp = last_time;
        }
    };

    /**
     * Used by delivery websockets chart cache
     * @param {string} symbol - symbol to get candlestick info
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @param {array} ticks - tick array
     * @return {undefined}
     */
    const deliveryKlineData = ( symbol, interval, ticks ) => {
        let last_time = 0;
        if ( isIterable( ticks ) ) {
            for ( let tick of ticks ) {
                // eslint-disable-next-line no-unused-vars
                let [ time, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBaseVolume, takerBuyQuoteVolume, ignored ] = tick;
                Binance.deliveryTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades };
                last_time = time;
            }
            Binance.deliveryMeta[symbol][interval].timestamp = last_time;
        }
    };

    /**
     * Used for /depth endpoint
     * @param {object} data - containing the bids and asks
     * @return {undefined}
     */
    const depthData = data => {
        if ( !data ) return { bids: [], asks: [] };
        let bids = {}, asks = {}, obj;
        if ( typeof data.bids !== 'undefined' ) {
            for ( obj of data.bids ) {
                bids[obj[0]] = parseFloat( obj[1] );
            }
        }
        if ( typeof data.asks !== 'undefined' ) {
            for ( obj of data.asks ) {
                asks[obj[0]] = parseFloat( obj[1] );
            }
        }
        return { lastUpdateId: data.lastUpdateId, bids: bids, asks: asks };
    }

    /**
     * Used for /depth endpoint
     * @param {object} depth - information
     * @return {undefined}
     */
    const depthHandler = depth => {
        let symbol = depth.s, obj;
        let context = Binance.depthCacheContext[symbol];
        let updateDepthCache = () => {
            Binance.depthCache[symbol].eventTime = depth.E;
            for ( obj of depth.b ) { //bids
                if ( obj[1] == 0 ) {
                    delete Binance.depthCache[symbol].bids[obj[0]];
                } else {
                    Binance.depthCache[symbol].bids[obj[0]] = parseFloat( obj[1] );
                }
            }
            for ( obj of depth.a ) { //asks
                if ( obj[1] == 0 ) {
                    delete Binance.depthCache[symbol].asks[obj[0]];
                } else {
                    Binance.depthCache[symbol].asks[obj[0]] = parseFloat( obj[1] );
                }
            }
            context.skipCount = 0;
            context.lastEventUpdateId = depth.u;
            context.lastEventUpdateTime = depth.E;
        };

        // This now conforms 100% to the Binance docs constraints on managing a local order book
        if ( context.lastEventUpdateId ) {
            const expectedUpdateId = context.lastEventUpdateId + 1;
            if ( depth.U <= expectedUpdateId ) {
                updateDepthCache();
            } else {
                let msg = 'depthHandler: [' + symbol + '] The depth cache is out of sync.';
                msg += ' Symptom: Unexpected Update ID. Expected "' + expectedUpdateId + '", got "' + depth.U + '"';
                if ( Binance.options.verbose ) Binance.options.log( msg );
                throw new Error( msg );
            }
        } else if ( depth.U > context.snapshotUpdateId + 1 ) {
            /* In this case we have a gap between the data of the stream and the snapshot.
             This is an out of sync error, and the connection must be torn down and reconnected. */
            let msg = 'depthHandler: [' + symbol + '] The depth cache is out of sync.';
            msg += ' Symptom: Gap between snapshot and first stream data.';
            if ( Binance.options.verbose ) Binance.options.log( msg );
            throw new Error( msg );
        } else if ( depth.u < context.snapshotUpdateId + 1 ) {
            /* In this case we've received data that we've already had since the snapshot.
             This isn't really an issue, and we can just update the cache again, or ignore it entirely. */

            // do nothing
        } else {
            // This is our first legal update from the stream data
            updateDepthCache();
        }
    };

    /**
     * Gets depth cache for given symbol
     * @param {string} symbol - the symbol to fetch
     * @return {object} - the depth cache object
     */
    const getDepthCache = symbol => {
        if ( typeof Binance.depthCache[symbol] === 'undefined' ) return { bids: {}, asks: {} };
        return Binance.depthCache[symbol];
    };

    /**
     * Calculate Buy/Sell volume from DepthCache
     * @param {string} symbol - the symbol to fetch
     * @return {object} - the depth volume cache object
     */
    const depthVolume = symbol => {
        let cache = getDepthCache( symbol ), quantity, price;
        let bidbase = 0, askbase = 0, bidqty = 0, askqty = 0;
        for ( price in cache.bids ) {
            quantity = cache.bids[price];
            bidbase += parseFloat( ( quantity * parseFloat( price ) ).toFixed( 8 ) );
            bidqty += quantity;
        }
        for ( price in cache.asks ) {
            quantity = cache.asks[price];
            askbase += parseFloat( ( quantity * parseFloat( price ) ).toFixed( 8 ) );
            askqty += quantity;
        }
        return { bids: bidbase, asks: askbase, bidQty: bidqty, askQty: askqty };
    };

    /**
     * Checks whether or not an array contains any duplicate elements
     * @param {array} array - the array to check
     * @return {boolean} - true or false
     */
    const isArrayUnique = array => {
        return new Set( array ).size === array.length;
    };
    return {
        /**
        * Gets depth cache for given symbol
        * @param {symbol} symbol - get depch cache for this symbol
        * @return {object} - object
        */
        depthCache: symbol => {
            return getDepthCache( symbol );
        },

        /**
        * Gets depth volume for given symbol
        * @param {symbol} symbol - get depch volume for this symbol
        * @return {object} - object
        */
        depthVolume: symbol => {
            return depthVolume( symbol );
        },

        /**
        * Count decimal places
        * @param {float} float - get the price precision point
        * @return {int} - number of place
        */
        getPrecision: function ( float ) {
            if ( !float || Number.isInteger( float ) ) return 0;
            return float.toString().split( '.' )[1].length || 0;
        },

        /**
        * rounds number with given step
        * @param {float} qty - quantity to round
        * @param {float} stepSize - stepSize as specified by exchangeInfo
        * @return {float} - number
        */
        roundStep: function ( qty, stepSize ) {
            // Integers do not require rounding
            if ( Number.isInteger( qty ) ) return qty;
            const qtyString = parseFloat( qty ).toFixed( 16 );
            const desiredDecimals = Math.max( stepSize.indexOf( '1' ) - 1, 0 );
            const decimalIndex = qtyString.indexOf( '.' );
            return parseFloat( qtyString.slice( 0, decimalIndex + desiredDecimals + 1 ) );
        },

        /**
        * rounds price to required precision
        * @param {float} price - price to round
        * @param {float} tickSize - tickSize as specified by exchangeInfo
        * @return {float} - number
        */
        roundTicks: function ( price, tickSize ) {
            const formatter = new Intl.NumberFormat( 'en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 8 } );
            const precision = formatter.format( tickSize ).split( '.' )[1].length || 0;
            if ( typeof price === 'string' ) price = parseFloat( price );
            return price.toFixed( precision );
        },

        /**
        * Gets percentage of given numbers
        * @param {float} min - the smaller number
        * @param {float} max - the bigger number
        * @param {int} width - percentage width
        * @return {float} - percentage
        */
        percent: function ( min, max, width = 100 ) {
            return ( min * 0.01 ) / ( max * 0.01 ) * width;
        },

        /**
        * Gets the sum of an array of numbers
        * @param {array} array - the number to add
        * @return {float} - sum
        */
        sum: function ( array ) {
            return array.reduce( ( a, b ) => a + b, 0 );
        },

        /**
        * Reverses the keys of an object
        * @param {object} object - the object
        * @return {object} - the object
        */
        reverse: function ( object ) {
            let range = Object.keys( object ).reverse(), output = {};
            for ( let price of range ) {
                output[price] = object[price];
            }
            return output;
        },

        /**
        * Converts an object to an array
        * @param {object} obj - the object
        * @return {array} - the array
        */
        array: function( obj ) {
            return Object.keys( obj ).map( function ( key ) {
                return [ Number( key ), obj[key] ];
            } );
        },

        /**
        * Sorts bids
        * @param {string} symbol - the object
        * @param {int} max - the max number of bids
        * @param {string} baseValue - the object
        * @return {object} - the object
        */
        sortBids: function ( symbol, max = Infinity, baseValue = false ) {
            let object = {}, count = 0, cache;
            if ( typeof symbol === 'object' ) cache = symbol;
            else cache = getDepthCache( symbol ).bids;
            const sorted = Object.keys( cache ).sort( ( a, b ) => parseFloat( b ) - parseFloat( a ) );
            let cumulative = 0;
            for ( let price of sorted ) {
                if ( !baseValue ) object[price] = cache[price];
                else if ( baseValue === 'cumulative' ) {
                    cumulative += cache[price];
                    object[price] = cumulative;
                } else object[price] = parseFloat( ( cache[price] * parseFloat( price ) ).toFixed( 8 ) );
                if ( ++count >= max ) break;
            }
            return object;
        },

        /**
        * Sorts asks
        * @param {string} symbol - the object
        * @param {int} max - the max number of bids
        * @param {string} baseValue - the object
        * @return {object} - the object
        */
        sortAsks: function ( symbol, max = Infinity, baseValue = false ) {
            let object = {}, count = 0, cache;
            if ( typeof symbol === 'object' ) cache = symbol;
            else cache = getDepthCache( symbol ).asks;
            const sorted = Object.keys( cache ).sort( ( a, b ) => parseFloat( a ) - parseFloat( b ) );
            let cumulative = 0;
            for ( let price of sorted ) {
                if ( !baseValue ) object[price] = cache[price];
                else if ( baseValue === 'cumulative' ) {
                    cumulative += cache[price];
                    object[price] = cumulative;
                } else object[price] = parseFloat( ( cache[price] * parseFloat( price ) ).toFixed( 8 ) );
                if ( ++count >= max ) break;
            }
            return object;
        },

        /**
        * Returns the first property of an object
        * @param {object} object - the object to get the first member
        * @return {string} - the object key
        */
        first: function ( object ) {
            return Object.keys( object ).shift();
        },

        /**
        * Returns the last property of an object
        * @param {object} object - the object to get the first member
        * @return {string} - the object key
        */
        last: function ( object ) {
            return Object.keys( object ).pop();
        },

        /**
        * Returns an array of properties starting at start
        * @param {object} object - the object to get the properties form
        * @param {int} start - the starting index
        * @return {array} - the array of entires
        */
        slice: function ( object, start = 0 ) {
            return Object.keys( object ).slice( start );
        },

        /**
        * Gets the minimum key form object
        * @param {object} object - the object to get the properties form
        * @return {string} - the minimum key
        */
        min: function ( object ) {
            return Math.min.apply( Math, Object.keys( object ) );
        },

        /**
        * Gets the maximum key form object
        * @param {object} object - the object to get the properties form
        * @return {string} - the minimum key
        */
        max: function ( object ) {
            return Math.max.apply( Math, Object.keys( object ) );
        },

        /**
        * Sets an option given a key and value
        * @param {string} key - the key to set
        * @param {object} value - the value of the key
        * @return {undefined}
        */
        setOption: function ( key, value ) {
            Binance.options[key] = value;
        },

        /**
        * Gets an option given a key
        * @param {string} key - the key to set
        * @return {undefined}
        */
        getOption: key => Binance.options[key],

        /**
        * Returns the entire info object
        * @return {object} - the info object
        */
        getInfo: () => Binance.info,

        /**
        * Returns the used weight from the last request
        * @return {object} - 1m weight used
        */
        usedWeight: () => Binance.info.usedWeight,

        /**
        * Returns the status code from the last http response
        * @return {object} - status code
        */
        statusCode: () => Binance.info.statusCode,

        /**
        * Returns the ping time from the last futures request
        * @return {object} - latency/ping (2ms)
        */
        futuresLatency: () => Binance.info.futuresLatency,

        /**
        * Returns the complete URL from the last request
        * @return {object} - http address including query string
        */
        lastURL: () => Binance.info.lastURL,

        /**
        * Returns the order count from the last request
        * @return {object} - orders allowed per 1m
        */
        orderCount: () => Binance.info.orderCount1m,

        /**
        * Returns the entire options object
        * @return {object} - the options object
        */
        getOptions: () => Binance.options,

        /**
        * Gets an option given a key
        * @param {object} opt - the object with the class configuration
        * @param {function} callback - the callback function
        * @return {undefined}
        */
        options: setOptions,

        /**
        * Creates an order
        * @param {string} side - BUY or SELL
        * @param {string} symbol - the symbol to buy
        * @param {numeric} quantity - the quantity required
        * @param {numeric} price - the price to pay for each unit
        * @param {object} flags - aadditionalbuy order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        order: function ( side, symbol, quantity, price, flags = {}, callback = false ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    order( side, symbol, quantity, price, flags, callback );
                } )
            } else {
                order( side, symbol, quantity, price, flags, callback );
            }
        },

        /**
        * Creates a buy order
        * @param {string} symbol - the symbol to buy
        * @param {numeric} quantity - the quantity required
        * @param {numeric} price - the price to pay for each unit
        * @param {object} flags - additional buy order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        buy: function( symbol, quantity, price, flags = {}, callback = false ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    order( 'BUY', symbol, quantity, price, flags, callback );
                } )
            } else {
                order( 'BUY', symbol, quantity, price, flags, callback );
            }
        },

        /**
        * Creates a sell order
        * @param {string} symbol - the symbol to sell
        * @param {numeric} quantity - the quantity required
        * @param {numeric} price - the price to sell each unit for
        * @param {object} flags - additional order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        sell: function ( symbol, quantity, price, flags = {}, callback = false ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    order( 'SELL', symbol, quantity, price, flags, callback );
                } )
            } else {
                order( 'SELL', symbol, quantity, price, flags, callback );
            }

        },

        /**
        * Creates a market buy order
        * @param {string} symbol - the symbol to buy
        * @param {numeric} quantity - the quantity required
        * @param {object} flags - additional buy order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        marketBuy: function ( symbol, quantity, flags = { type: 'MARKET' }, callback = false ) {
            if ( typeof flags === 'function' ) { // Accept callback as third parameter
                callback = flags;
                flags = { type: 'MARKET' };
            }
            if ( typeof flags.type === 'undefined' ) flags.type = 'MARKET';
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    order( 'BUY', symbol, quantity, 0, flags, callback );
                } )
            } else {
                order( 'BUY', symbol, quantity, 0, flags, callback );
            }
        },

        /**
        * Creates a market sell order
        * @param {string} symbol - the symbol to sell
        * @param {numeric} quantity - the quantity required
        * @param {object} flags - additional sell order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        marketSell: function ( symbol, quantity, flags = { type: 'MARKET' }, callback = false ) {
            if ( typeof flags === 'function' ) { // Accept callback as third parameter
                callback = flags;
                flags = { type: 'MARKET' };
            }
            if ( typeof flags.type === 'undefined' ) flags.type = 'MARKET';
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    order( 'SELL', symbol, quantity, 0, flags, callback );
                } )
            } else {
                order( 'SELL', symbol, quantity, 0, flags, callback );
            }
        },

        /**
        * Cancels an order
        * @param {string} symbol - the symbol to cancel
        * @param {string} orderid - the orderid to cancel
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        cancel: function ( symbol, orderid, callback = false ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/order', { symbol: symbol, orderId: orderid }, function ( error, data ) {
                        return callback.call( this, error, data, symbol );
                    }, 'DELETE' );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/order', { symbol: symbol, orderId: orderid }, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                }, 'DELETE' );
            }
        },

        /**
        * Gets the status of an order
        * @param {string} symbol - the symbol to check
        * @param {string} orderid - the orderid to check if !orderid then  use flags to search
        * @param {function} callback - the callback function
        * @param {object} flags - any additional flags
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        orderStatus: function ( symbol, orderid, callback, flags = {} ) {
            let parameters = Object.assign( { symbol: symbol }, flags );
            if ( orderid ){
                parameters = Object.assign( { orderId: orderid }, parameters )
            }

            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/order', parameters, function ( error, data ) {
                        return callback.call( this, error, data, symbol );
                    } );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/order', parameters, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                } );
            }
        },

        /**
        * Gets open orders
        * @param {string} symbol - the symbol to get
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        openOrders: function ( symbol, callback ) {
            let parameters = symbol ? { symbol: symbol } : {};
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/openOrders', parameters, function ( error, data ) {
                        return callback.call( this, error, data, symbol );
                    } );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/openOrders', parameters, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                } );
            }
        },

        /**
        * Cancels all orders of a given symbol
        * @param {string} symbol - the symbol to cancel all orders for
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        cancelAll: function ( symbol, callback = false ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/openOrders', { symbol }, callback, 'DELETE' );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/openOrders', { symbol }, callback, 'DELETE' );
            }
        },

        /**
        * Cancels all orders of a given symbol
        * @param {string} symbol - the symbol to cancel all orders for
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        cancelOrders: function ( symbol, callback = false ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/openOrders', { symbol }, function ( error, json ) {
                        if ( json.length === 0 ) {
                            return callback.call( this, 'No orders present for this symbol', {}, symbol );
                        }
                        for ( let obj of json ) {
                            let quantity = obj.origQty - obj.executedQty;
                            Binance.options.log( 'cancel order: ' + obj.side + ' ' + symbol + ' ' + quantity + ' @ ' + obj.price + ' #' + obj.orderId );
                            signedRequest( getSpotUrl() + 'v3/order', { symbol, orderId: obj.orderId }, function ( error, data ) {
                                return callback.call( this, error, data, symbol );
                            }, 'DELETE' );
                        }
                    } );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/openOrders', { symbol: symbol }, function ( error, json ) {
                    if ( json.length === 0 ) {
                        return callback.call( this, 'No orders present for this symbol', {}, symbol );
                    }
                    if ( Object.keys( json ).length === 0 ) {
                        return callback.call( this, 'No orders present for this symbol', {}, symbol );
                    }
                    for ( let obj of json ) {
                        let quantity = obj.origQty - obj.executedQty;
                        Binance.options.log( 'cancel order: ' + obj.side + ' ' + symbol + ' ' + quantity + ' @ ' + obj.price + ' #' + obj.orderId );
                        signedRequest( getSpotUrl() + 'v3/order', { symbol: symbol, orderId: obj.orderId }, function ( error, data ) {
                            return callback.call( this, error, data, symbol );
                        }, 'DELETE' );
                    }
                } );
            }
        },

        /**
        * Gets all order of a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function (can also accept options)
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        allOrders: function ( symbol, callback, options = {} ) {
            let parameters = Object.assign( { symbol }, options );
            if ( typeof callback == 'object' ) { // Allow second parameter to be options
                options = callback;
                callback = false;
            }
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/allOrders', parameters, function ( error, data ) {
                        return callback.call( this, error, data, symbol );
                    } );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/allOrders', parameters, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                } );
            }
        },

        /**
        * Gets the depth information for a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {int} limit - limit the number of returned orders
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        depth: function ( symbol, callback, limit = 100 ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( getSpotUrl() + 'v3/depth', { symbol: symbol, limit: limit }, function ( error, data ) {
                        return callback.call( this, error, depthData( data ), symbol );
                    } );
                } )
            } else {
                publicRequest( getSpotUrl() + 'v3/depth', { symbol: symbol, limit: limit }, function ( error, data ) {
                    return callback.call( this, error, depthData( data ), symbol );
                } );
            }
        },

        /**
        * Gets the average prices of a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        avgPrice: function ( symbol, callback = false ) {
            let opt = {
                url:getSpotUrl() + 'v3/avgPrice?symbol=' + symbol,
                timeout: Binance.options.recvWindow
            };
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    request( addProxy( opt ), ( error, response, body ) => {
                        if ( error ) return reject( error );
                        if ( response.statusCode !== 200 ) return reject( response );
                        let result = {};
                        result[symbol] = JSON.parse( response.body ).price;
                        return resolve( result );
                    } ).on( 'error', reject );
                } );
            }
            request( addProxy( opt ), ( error, response, body ) => {
                if ( error ) return callback( error );
                if ( response.statusCode !== 200 ) return callback( response );
                let result = {};
                result[symbol] = JSON.parse( response.body ).price;
                return callback( null, result );
            } ).on( 'error', callback );
        },

        /**
        * Gets the prices of a given symbol(s)
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        prices: function ( symbol, callback = false ) {
            const params = typeof symbol === 'string' ? '?symbol=' + symbol : '';
            if ( typeof symbol === 'function' ) callback = symbol; // backwards compatibility

            let opt = {
                url:getSpotUrl() + 'v3/ticker/price' + params,
                timeout: Binance.options.recvWindow
            };
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    request( addProxy( opt ), ( error, response, body ) => {
                        if ( error ) return reject( error );
                        if ( response.statusCode !== 200 ) return reject( response );
                        return resolve( priceData( JSON.parse( body ) ) );
                    } ).on( 'error', reject );
                } );
            }
            request( addProxy( opt ), ( error, response, body ) => {
                if ( error ) return callback( error );
                if ( response.statusCode !== 200 ) return callback( response );
                return callback( null, priceData( JSON.parse( body ) ) );
            } ).on( 'error', callback );
        },

        /**
        * Gets the book tickers of given symbol(s)
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        bookTickers: function ( symbol, callback ) {
            const params = typeof symbol === 'string' ? '?symbol=' + symbol : '';
            if ( typeof symbol === 'function' ) callback = symbol; // backwards compatibility
            let opt = {
                url:getSpotUrl() + 'v3/ticker/bookTicker' + params,
                timeout: Binance.options.recvWindow
            };
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    request( addProxy( opt ), function ( error, response, body ) {
                        if ( error ) return reject( error );
                        if ( response.statusCode !== 200 ) return reject( response );
                        const result = symbol ? JSON.parse( body ) : bookPriceData( JSON.parse( body ) );
                        return resolve( result );
                    } ).on( 'error', reject );
                } );
            }
            request( addProxy( opt ), ( error, response, body ) => {
                if ( error ) return callback( error );
                if ( response.statusCode !== 200 ) return callback( response );
                const result = symbol ? JSON.parse( body ) : bookPriceData( JSON.parse( body ) );
                return callback( null, result );
            } ).on( 'error', callback );
        },

        /**
        * Gets the prevday percentage change
        * @param {string} symbol - the symbol or symbols
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        prevDay: function ( symbol, callback ) {
            let input = symbol ? { symbol: symbol } : {};
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( getSpotUrl() + 'v3/ticker/24hr', input, ( error, data ) => {
                        return callback.call( this, error, data, symbol );
                    } );
                } )
            } else {
                publicRequest( getSpotUrl() + 'v3/ticker/24hr', input, ( error, data ) => {
                    return callback.call( this, error, data, symbol );
                } );
            }
        },

        /**
        * Gets the the exchange info
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        exchangeInfo: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( getSpotUrl() + 'v3/exchangeInfo', {}, callback );
                } )
            } else {
                publicRequest( getSpotUrl() + 'v3/exchangeInfo', {}, callback );
            }
        },

        /**
        * Gets the dust log for user
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        dustLog: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( sapi + 'v1/asset/dribblet', {}, callback );
                } )
            } else {
                signedRequest( sapi + 'v1/asset/dribblet', {}, callback );
            }
        },

        dustTransfer: function ( assets, callback ) {
            signedRequest( sapi + 'v1/asset/dust', { asset: assets }, callback, 'POST' );
        },

        assetDividendRecord: function ( callback, params = {} ) {
            signedRequest( sapi + 'v1/asset/assetDividend', params, callback );
        },

        /**
        * Gets the the system status
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        systemStatus: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( wapi + 'v3/systemStatus.html', {}, callback );
                } )
            } else {
                publicRequest( wapi + 'v3/systemStatus.html', {}, callback );
            }
        },

        /**
        * Withdraws asset to given wallet id
        * @param {string} asset - the asset symbol
        * @param {string} address - the wallet to transfer it to
        * @param {number} amount - the amount to transfer
        * @param {string} addressTag - and addtional address tag
        * @param {function} callback - the callback function
        * @param {string} name - the name to save the address as. Set falsy to prevent Binance saving to address book
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        withdraw: function ( asset, address, amount, addressTag = false, callback = false, name = false ) {
            let params = { asset, address, amount };
            if ( name ) params.name = name;
            if ( addressTag ) params.addressTag = addressTag;
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( wapi + 'v3/withdraw.html', params, callback, 'POST' );
                } )
            } else {
                signedRequest( wapi + 'v3/withdraw.html', params, callback, 'POST' );
            }
        },

        /**
        * Get the Withdraws history for a given asset
        * @param {function} callback - the callback function
        * @param {object} params - supports limit and fromId parameters
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        withdrawHistory: function ( callback, params = {} ) {
            if ( typeof params === 'string' ) params = { asset: params };
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( sapi + 'v1/capital/withdraw/history', params, callback );
                } )
            } else {
                signedRequest( sapi + 'v1/capital/withdraw/history', params, callback );
            }
        },

        /**
        * Get the deposit history
        * @param {function} callback - the callback function
        * @param {object} params - additional params
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        depositHistory: function ( callback, params = {} ) {
            if ( typeof params === 'string' ) params = { asset: params }; // Support 'asset' (string) or optional parameters (object)
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( sapi + 'v1/capital/deposit/hisrec', params, callback );
                } )
            } else {
                signedRequest( sapi + 'v1/capital/deposit/hisrec', params, callback );
            }
        },

        /**
        * Get the deposit history for given asset
        * @param {string} asset - the asset
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        depositAddress: function ( asset, callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( wapi + 'v3/depositAddress.html', { asset: asset }, callback );
                } )
            } else {
                signedRequest( wapi + 'v3/depositAddress.html', { asset: asset }, callback );
            }
        },

        /**
        * Get the account status
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        accountStatus: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( wapi + 'v3/accountStatus.html', {}, callback );
                } )
            } else {
                signedRequest( wapi + 'v3/accountStatus.html', {}, callback );
            }
        },

        /**
        * Get the trade fee
        * @param {function} callback - the callback function
        * @param {string} symbol (optional)
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        tradeFee: function ( callback, symbol = false ) {
            let params = symbol ? { symbol: symbol } : {};
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( wapi + 'v3/tradeFee.html', params, callback );
                } )
            } else {
                signedRequest( wapi + 'v3/tradeFee.html', params, callback );
            }
        },

        /**
        * Fetch asset detail (minWithdrawAmount, depositStatus, withdrawFee, withdrawStatus, depositTip)
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        assetDetail: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( wapi + 'v3/assetDetail.html', {}, callback );
                } )
            } else {
                signedRequest( wapi + 'v3/assetDetail.html', {}, callback );
            }
        },

        /**
        * Get the account
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        account: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/account', {}, callback );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/account', {}, callback );
            }
        },

        /**
        * Get the balance data
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        balance: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/account', {}, function ( error, data ) {
                        callback( error, balanceData( data ) );
                    } );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/account', {}, function ( error, data ) {
                    callback( error, balanceData( data ) );
                } );
            }
        },

        /**
        * Get trades for a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        trades: ( symbol, callback, options = {} ) => {
            let parameters = Object.assign( { symbol: symbol }, options );
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( getSpotUrl() + 'v3/myTrades', parameters, function ( error, data ) {
                        return callback.call( this, error, data, symbol );
                    } );
                } )
            } else {
                signedRequest( getSpotUrl() + 'v3/myTrades', parameters, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                } );
            }
        },

        /**
        * Tell api to use the server time to offset time indexes
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        useServerTime: ( callback = false ) => {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( getSpotUrl() + 'v3/time', {}, function ( error, response ) {
                        if ( !error ) {
                            Binance.info.timeOffset = response.serverTime - new Date().getTime();
                            //Binance.options.log("server time set: ", response.serverTime, Binance.info.timeOffset);
                        }
                        callback( error, response );
                    } );
                } )
            } else {
                publicRequest( getSpotUrl() + 'v3/time', {}, function ( error, response ) {
                    if ( !error ) {
                        Binance.info.timeOffset = response.serverTime - new Date().getTime();
                        //Binance.options.log("server time set: ", response.serverTime, Binance.info.timeOffset);
                    }
                    callback( error, response );
                } );
            }
        },

        /**
        * Get Binance server time
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        time: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( getSpotUrl() + 'v3/time', {}, callback );
                } )
            } else {
                publicRequest( getSpotUrl() + 'v3/time', {}, callback );
            }
        },

        /**
        * Ping binance
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        ping: function ( callback ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( getSpotUrl() + 'v3/ping', {}, callback );
                } )
            } else {
                publicRequest( getSpotUrl() + 'v3/ping', {}, callback );
            }
        },

        /**
        * Get agg trades for given symbol
        * @param {string} symbol - the symbol
        * @param {object} options - additional optoins
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        aggTrades: function ( symbol, options = {}, callback = false ) { //fromId startTime endTime limit
            let parameters = Object.assign( { symbol }, options );
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( getSpotUrl() + 'v3/aggTrades', parameters, callback );
                } )
            } else {
                publicRequest( getSpotUrl() + 'v3/aggTrades', parameters, callback );
            }
        },

        /**
        * Get the recent trades
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {int} limit - limit the number of items returned
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        recentTrades: function ( symbol, callback, limit = 500 ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    marketRequest( getSpotUrl() + 'v1/trades', { symbol: symbol, limit: limit }, callback );
                } )
            } else {
                marketRequest( getSpotUrl() + 'v1/trades', { symbol: symbol, limit: limit }, callback );
            }
        },

        /**
        * Get the historical trade info
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {int} limit - limit the number of items returned
        * @param {int} fromId - from this id
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        historicalTrades: function ( symbol, callback, limit = 500, fromId = false ) {
            let parameters = { symbol: symbol, limit: limit };
            if ( fromId ) parameters.fromId = fromId;
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    marketRequest( getSpotUrl() + 'v3/historicalTrades', parameters, callback );
                } )
            } else {
                marketRequest( getSpotUrl() + 'v3/historicalTrades', parameters, callback );
            }
        },

        /**
        * Convert chart data to highstock array [timestamp,open,high,low,close]
        * @param {object} chart - the chart
        * @param {boolean} include_volume - to include the volume or not
        * @return {array} - an array
        */
        highstock: function ( chart, include_volume = false ) {
            let array = [];
            for ( let timestamp in chart ) {
                let obj = chart[timestamp];
                let line = [
                    Number( timestamp ),
                    parseFloat( obj.open ),
                    parseFloat( obj.high ),
                    parseFloat( obj.low ),
                    parseFloat( obj.close )
                ];
                if ( include_volume ) line.push( parseFloat( obj.volume ) );
                array.push( line );
            }
            return array;
        },

        /**
        * Populates OHLC information
        * @param {object} chart - the chart
        * @return {object} - object with candle information
        */
        ohlc: function ( chart ) {
            let open = [], high = [], low = [], close = [], volume = [];
            for ( let timestamp in chart ) { //Binance.ohlc[symbol][interval]
                let obj = chart[timestamp];
                open.push( parseFloat( obj.open ) );
                high.push( parseFloat( obj.high ) );
                low.push( parseFloat( obj.low ) );
                close.push( parseFloat( obj.close ) );
                volume.push( parseFloat( obj.volume ) );
            }
            return { open: open, high: high, low: low, close: close, volume: volume };
        },

        /**
        * Gets the candles information for a given symbol
        * intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
        * @param {string} symbol - the symbol
        * @param {function} interval - the callback function
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        candlesticks: function ( symbol, interval = '5m', callback = false, options = { limit: 500 } ) {
            let params = Object.assign( { symbol: symbol, interval: interval }, options );
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( getSpotUrl() + 'v3/klines', params, function ( error, data ) {
                        return callback.call( this, error, data, symbol );
                    } );
                } )
            } else {
                publicRequest( getSpotUrl() + 'v3/klines', params, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                } );
            }
        },

        /**
        * Queries the public api
        * @param {string} url - the public api endpoint
        * @param {object} data - the data to send
        * @param {function} callback - the callback function
        * @param {string} method - the http method
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        publicRequest: function ( url, data, callback, method = 'GET' ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    publicRequest( url, data, callback, method );
                } )
            } else {
                publicRequest( url, data, callback, method );
            }
        },

        /**
         * Queries the futures API by default
         * @param {string} url - the signed api endpoint
         * @param {object} data - the data to send
         * @param {object} flags - type of request, authentication method and endpoint url
         */
        promiseRequest: function ( url, data = {}, flags = {} ) {
            return promiseRequest( url, data, flags );
        },

        /**
        * Queries the signed api
        * @param {string} url - the signed api endpoint
        * @param {object} data - the data to send
        * @param {function} callback - the callback function
        * @param {string} method - the http method
        * @param {boolean} noDataInSignature - Prevents data from being added to signature
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        signedRequest: function ( url, data, callback, method = 'GET', noDataInSignature = false ) {
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( url, data, callback, method, noDataInSignature );
                } )
            } else {
                signedRequest( url, data, callback, method, noDataInSignature );
            }
        },

        /**
        * Gets the market asset of given symbol
        * @param {string} symbol - the public api endpoint
        * @return {undefined}
        */
        getMarket: function ( symbol ) {
            if ( symbol.endsWith( 'BTC' ) ) return 'BTC';
            else if ( symbol.endsWith( 'ETH' ) ) return 'ETH';
            else if ( symbol.endsWith( 'BNB' ) ) return 'BNB';
            else if ( symbol.endsWith( 'XRP' ) ) return 'XRP';
            else if ( symbol.endsWith( 'PAX' ) ) return 'PAX';
            else if ( symbol.endsWith( 'USDT' ) ) return 'USDT';
            else if ( symbol.endsWith( 'USDC' ) ) return 'USDC';
            else if ( symbol.endsWith( 'USDS' ) ) return 'USDS';
            else if ( symbol.endsWith( 'TUSD' ) ) return 'TUSD';
        },

        /**
        * Get the account binance lending information
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        lending: async ( params = {} ) => {
            return promiseRequest( 'v1/lending/union/account', params, { base:sapi, type:'SIGNED' } );
        },

        //** Futures methods */
        futuresPing: async ( params = {} ) => {
            return promiseRequest( 'v1/ping', params, { base:fapi } );
        },

        futuresTime: async ( params = {} ) => {
            return promiseRequest( 'v1/time', params, { base:fapi } ).then( r => r.serverTime );
        },

        futuresExchangeInfo: async () => {
            return promiseRequest( 'v1/exchangeInfo', {}, { base:fapi } );
        },

        futuresPrices: async ( params = {} ) => {
            let data = await promiseRequest( 'v2/ticker/price', params, { base:fapi } );
            return Array.isArray( data ) ? data.reduce( ( out, i ) => ( ( out[i.symbol] =  i.price ), out ), {} ) : data;
        },

        futuresDaily: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            let data = await promiseRequest( 'v1/ticker/24hr', params, { base:fapi } );
            return symbol ? data : data.reduce( ( out, i ) => ( ( out[i.symbol] = i ), out ), {} );
        },

        futuresOpenInterest: async ( symbol ) => {
            return promiseRequest( 'v1/openInterest', { symbol }, { base:fapi } ).then( r => r.openInterest );
        },

        futuresCandles: async ( symbol, interval = "30m", params = {} ) => {
            params.symbol = symbol;
            params.interval = interval;
            return promiseRequest( 'v1/klines', params, { base:fapi } );
        },

        futuresMarkPrice: async ( symbol = false ) => {
            return promiseRequest( 'v1/premiumIndex', symbol ? { symbol } : {}, { base:fapi } );
        },

        futuresTrades: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/trades', params, { base:fapi } );
        },

        futuresHistoricalTrades: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/historicalTrades', params, { base:fapi, type:'MARKET_DATA' } );
        },

        futuresAggTrades: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/aggTrades', params, { base:fapi } );
        },

        futuresForceOrders: async ( params = {} ) => {
            return promiseRequest( 'v1/forceOrders', params, { base:fapi, type:'SIGNED' } );
        },

        futuresDeleverageQuantile: async ( params = {} ) => {
            return promiseRequest( 'v1/adlQuantile', params, { base:fapi, type:'SIGNED' } );
        },

        futuresUserTrades: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/userTrades', params, { base:fapi, type:'SIGNED' } );
        },

        futuresGetDataStream: async ( params = {} ) => {
            //A User Data Stream listenKey is valid for 60 minutes after creation. setInterval
            return promiseRequest( 'v1/listenKey', params, { base:fapi, type:'SIGNED', method:'POST' } );
        },

        futuresKeepDataStream: async ( params = {} ) => {
            return promiseRequest( 'v1/listenKey', params, { base:fapi, type:'SIGNED', method:'PUT' } );
        },

        futuresCloseDataStream: async ( params = {} ) => {
            return promiseRequest( 'v1/listenKey', params, { base:fapi, type:'SIGNED', method:'DELETE' } );
        },

        futuresLiquidationOrders: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/allForceOrders', params, { base:fapi } );
        },

        futuresPositionRisk: async ( params = {} ) => {
            return promiseRequest( 'v3/positionRisk', params, { base:fapi, type:'SIGNED' } );
        },

        futuresFundingRate: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/fundingRate', params, { base:fapi } );
        },

        futuresLeverageBracket: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/leverageBracket', params, { base:fapi, type:'USER_DATA' } );
        },

        futuresTradingStatus: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/apiTradingStatus', params, { base:fapi, type:'USER_DATA' } );
        },

        futuresCommissionRate: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/commissionRate', params, { base:fapi, type:'USER_DATA' } );
        },

        // leverage 1 to 125
        futuresLeverage: async ( symbol, leverage, params = {} ) => {
            params.symbol = symbol;
            params.leverage = leverage;
            return promiseRequest( 'v1/leverage', params, { base:fapi, method:'POST', type:'SIGNED' } );
        },

        // ISOLATED, CROSSED
        futuresMarginType: async ( symbol, marginType, params = {} ) => {
            params.symbol = symbol;
            params.marginType = marginType;
            return promiseRequest( 'v1/marginType', params, { base:fapi, method:'POST', type:'SIGNED' } );
        },

        // type: 1: Add postion margin，2: Reduce postion margin
        futuresPositionMargin: async ( symbol, amount, type = 1, params = {} ) => {
            params.symbol = symbol;
            params.amount = amount;
            params.type = type;
            return promiseRequest( 'v1/positionMargin', params, { base:fapi, method:'POST', type:'SIGNED' } );
        },

        futuresPositionMarginHistory: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/positionMargin/history', params, { base:fapi, type:'SIGNED' } );
        },

        futuresIncome: async ( params = {} ) => {
            return promiseRequest( 'v1/income', params, { base:fapi, type:'SIGNED' } );
        },

        futuresBalance: async ( params = {} ) => {
            return promiseRequest( 'v2/balance', params, { base:fapi, type:'SIGNED' } );
        },

        futuresAccount: async ( params = {} ) => {
            return promiseRequest( 'v3/account', params, { base:fapi, type:'SIGNED' } );
        },

        futuresDepth: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/depth', params, { base:fapi } );
        },

        futuresQuote: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            //let data = await promiseRequest( 'v1/ticker/bookTicker', params, {base:fapi} );
            //return data.reduce((out, i) => ((out[i.symbol] = i), out), {}),
            let data = await promiseRequest( 'v1/ticker/bookTicker', params, { base:fapi } );
            return symbol ? data : data.reduce( ( out, i ) => ( ( out[i.symbol] = i ), out ), {} );
        },

        futuresBuy: async ( symbol, quantity, price, params = {} ) => {
            return futuresOrder( 'BUY', symbol, quantity, price, params );
        },

        futuresSell: async ( symbol, quantity, price, params = {} ) => {
            return futuresOrder( 'SELL', symbol, quantity, price, params );
        },

        futuresMarketBuy: async ( symbol, quantity, params = {} ) => {
            return futuresOrder( 'BUY', symbol, quantity, false, params );
        },

        futuresMarketSell: async ( symbol, quantity, params = {} ) => {
            return futuresOrder( 'SELL', symbol, quantity, false, params );
        },

        futuresMultipleOrders: async ( orders = [ {} ] ) => {
            for ( let i = 0; i < orders.length; i++ ) {
                if ( !orders[i].newClientOrderId ) {
                    orders[i].newClientOrderId = CONTRACT_PREFIX + uuid22();
                }
            }
            let params = { batchOrders: JSON.stringify( orders ) };
            return promiseRequest( 'v1/batchOrders', params, { base:fapi, type:'TRADE', method:'POST' } );
        },

        futuresOrder, // side symbol quantity [price] [params]

        futuresOrderStatus: async ( symbol, params = {} ) => { // Either orderId or origClientOrderId must be sent
            params.symbol = symbol;
            return promiseRequest( 'v1/order', params, { base:fapi, type:'SIGNED' } );
        },

        futuresCancel: async ( symbol, params = {} ) => { // Either orderId or origClientOrderId must be sent
            params.symbol = symbol;
            return promiseRequest( 'v1/order', params, { base:fapi, type:'SIGNED', method:'DELETE' } );
        },

        futuresCancelAll: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/allOpenOrders', params, { base:fapi, type:'SIGNED', method:'DELETE' } );
        },

        futuresCountdownCancelAll: async ( symbol, countdownTime = 0, params = {} ) => {
            params.symbol = symbol;
            params.countdownTime = countdownTime;
            return promiseRequest( 'v1/countdownCancelAll', params, { base:fapi, type:'SIGNED', method:'POST' } );
        },

        futuresOpenOrders: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/openOrders', params, { base:fapi, type:'SIGNED' } );
        },

        futuresAllOrders: async ( symbol = false, params = {} ) => { // Get all account orders; active, canceled, or filled.
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/allOrders', params, { base:fapi, type:'SIGNED' } );
        },

        futuresPositionSideDual: async ( params = {} ) => {
            return promiseRequest( 'v1/positionSide/dual', params, { base:fapi, type:'SIGNED' } );
        },

        futuresChangePositionSideDual: async ( dualSidePosition, params = {} ) => {
            params.dualSidePosition = dualSidePosition;
            return promiseRequest( 'v1/positionSide/dual', params, { base:fapi, type:'SIGNED', method:'POST' } );
        },
        futuresTransferAsset: async ( asset, amount, type ) => {
            let params = Object.assign( { asset, amount, type } );
            return promiseRequest( 'v1/futures/transfer', params, { base:sapi, type:'SIGNED', method:'POST' } );
        },

        futuresHistDataId: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/futuresHistDataId', params, { base: sapi, type: 'SIGNED', method: 'POST' } )
        },

        futuresDownloadLink: async ( downloadId ) => {
            return promiseRequest( 'v1/downloadLink', { downloadId }, { base: sapi, type: 'SIGNED' } )
        },

        // futures websockets support: ticker bookTicker miniTicker aggTrade markPrice
        /* TODO: https://binance-docs.github.io/apidocs/futures/en/#change-log
        Cancel multiple orders DELETE /fapi/v1/batchOrders
        New Future Account Transfer POST https://api.binance.com/sapi/v1/futures/transfer
        Get Postion Margin Change History (TRADE)

        wss://fstream.binance.com/ws/<listenKey>
        Diff. Book Depth Streams (250ms, 100ms, or realtime): <symbol>@depth OR <symbol>@depth@100ms OR <symbol>@depth@0ms
        Partial Book Depth Streams (5, 10, 20): <symbol>@depth<levels> OR <symbol>@depth<levels>@100ms
        All Market Liquidation Order Streams: !forceOrder@arr
        Liquidation Order Streams for specific symbol: <symbol>@forceOrder
        Chart data (250ms): <symbol>@kline_<interval>
        SUBSCRIBE, UNSUBSCRIBE, LIST_SUBSCRIPTIONS, SET_PROPERTY, GET_PROPERTY
        Live Subscribing/Unsubscribing to streams: requires sending futures subscription id when connecting
        futuresSubscriptions { "method": "LIST_SUBSCRIPTIONS", "id": 1 }
        futuresUnsubscribe { "method": "UNSUBSCRIBE", "params": [ "btcusdt@depth" ], "id": 1 }
        futures depthCache
        */

        /*
        const futuresOrder = (side, symbol, quantity, price = 0, flags = {}, callback = false) => {
            let opt = {
                symbol: symbol,
                side: side,
                type: 'LIMIT',
                quantity: quantity
            };
            if (typeof flags.type !== 'undefined') opt.type = flags.type;
            if (opt.type.includes('LIMIT')) {
                opt.price = price;
                opt.timeInForce = 'GTC';
            }
            if (typeof flags.timeInForce !== 'undefined') opt.timeInForce = flags.timeInForce;
            signedRequest(`${fapi}v1/order`, opt, function (error, response) {
                if (!response) {
                    if (callback) return callback(error, response);
                    else return Binance.options.log('futuresOrder error:', error);
                }
                if (callback) return callback(error, response);
                else return Binance.options.log(`futuresOrder ${side} (${symbol},${quantity},${price})`, response);
            }, 'POST');
        };*/

        //** Delivery methods */
        deliveryPing: async ( params = {} ) => {
            return promiseRequest( 'v1/ping', params, { base:dapi } );
        },

        deliveryTime: async ( params = {} ) => {
            return promiseRequest( 'v1/time', params, { base:dapi } ).then( r => r.serverTime );
        },

        deliveryExchangeInfo: async () => {
            return promiseRequest( 'v1/exchangeInfo', {}, { base:dapi } );
        },

        deliveryPrices: async ( params = {} ) => {
            let data = await promiseRequest( 'v1/ticker/price', params, { base:dapi } );
            return data.reduce( ( out, i ) => ( ( out[i.symbol] =  i.price ), out ), {} );
        },

        deliveryDaily: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            let data = await promiseRequest( 'v1/ticker/24hr', params, { base:dapi } );
            return symbol ? data : data.reduce( ( out, i ) => ( ( out[i.symbol] = i ), out ), {} );
        },

        deliveryOpenInterest: async ( symbol ) => {
            return promiseRequest( 'v1/openInterest', { symbol }, { base:dapi } ).then( r => r.openInterest );
        },

        deliveryCandles: async ( symbol, interval = "30m", params = {} ) => {
            params.symbol = symbol;
            params.interval = interval;
            return promiseRequest( 'v1/klines', params, { base:dapi } );
        },

        deliveryContinuousKlines: async ( pair, contractType = "CURRENT_QUARTER", interval = "30m", params = {} ) => {
            params.pair = pair;
            params.interval = interval;
            params.contractType = contractType;
            return promiseRequest( 'v1/continuousKlines', params, { base:dapi } );
        },

        deliveryIndexKlines: async ( pair, interval = "30m", params = {} ) => {
            params.pair = pair;
            params.interval = interval;
            return promiseRequest( 'v1/indexPriceKlines', params, { base:dapi } );
        },

        deliveryMarkPriceKlines: async ( symbol, interval = "30m", params = {} ) => {
            params.symbol = symbol;
            params.interval = interval;
            return promiseRequest( 'v1/markPriceKlines', params, { base:dapi } );
        },

        deliveryMarkPrice: async ( symbol = false ) => {
            return promiseRequest( 'v1/premiumIndex', symbol ? { symbol } : {}, { base:dapi } );
        },

        deliveryTrades: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/trades', params, { base:dapi } );
        },

        deliveryHistoricalTrades: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/historicalTrades', params, { base:dapi, type:'MARKET_DATA' } );
        },

        deliveryAggTrades: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/aggTrades', params, { base:dapi } );
        },

        deliveryUserTrades: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/userTrades', params, { base:dapi, type:'SIGNED' } );
        },
        
        deliveryCommissionRate: async ( symbol, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/commissionRate', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryGetDataStream: async ( params = {} ) => {
            //A User Data Stream listenKey is valid for 60 minutes after creation. setInterval
            return promiseRequest( 'v1/listenKey', params, { base:dapi, type:'SIGNED', method:'POST' } );
        },

        deliveryKeepDataStream: async ( params = {} ) => {
            return promiseRequest( 'v1/listenKey', params, { base:dapi, type:'SIGNED', method:'PUT' } );
        },

        deliveryCloseDataStream: async ( params = {} ) => {
            return promiseRequest( 'v1/listenKey', params, { base:dapi, type:'SIGNED', method:'DELETE' } );
        },

        deliveryLiquidationOrders: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/allForceOrders', params, { base:dapi } );
        },

        deliveryPositionRisk: async ( params = {} ) => {
            return promiseRequest( 'v1/positionRisk', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryLeverageBracket: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/leverageBracket', params, { base:dapi, type:'USER_DATA' } );
        },

        deliveryLeverageBracketSymbols: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v2/leverageBracket', params, { base:dapi, type:'USER_DATA' } );
        },

        // leverage 1 to 125
        deliveryLeverage: async ( symbol, leverage, params = {} ) => {
            params.symbol = symbol;
            params.leverage = leverage;
            return promiseRequest( 'v1/leverage', params, { base:dapi, method:'POST', type:'SIGNED' } );
        },

        // ISOLATED, CROSSED
        deliveryMarginType: async ( symbol, marginType, params = {} ) => {
            params.symbol = symbol;
            params.marginType = marginType;
            return promiseRequest( 'v1/marginType', params, { base:dapi, method:'POST', type:'SIGNED' } );
        },

        // type: 1: Add postion margin，2: Reduce postion margin
        deliveryPositionMargin: async ( symbol, amount, type = 1, params = {} ) => {
            params.symbol = symbol;
            params.amount = amount;
            params.type = type;
            return promiseRequest( 'v1/positionMargin', params, { base:dapi, method:'POST', type:'SIGNED' } );
        },

        deliveryPositionMarginHistory: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/positionMargin/history', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryIncome: async ( params = {} ) => {
            return promiseRequest( 'v1/income', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryBalance: async ( params = {} ) => {
            return promiseRequest( 'v1/balance', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryAccount: async ( params = {} ) => {
            return promiseRequest( 'v1/account', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryDepth: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/depth', params, { base:dapi } );
        },

        deliveryQuote: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            //let data = await promiseRequest( 'v1/ticker/bookTicker', params, {base:dapi} );
            //return data.reduce((out, i) => ((out[i.symbol] = i), out), {}),
            let data = await promiseRequest( 'v1/ticker/bookTicker', params, { base:dapi } );
            return symbol ? data : data.reduce( ( out, i ) => ( ( out[i.symbol] = i ), out ), {} );
        },

        deliveryBuy: async ( symbol, quantity, price, params = {} ) => {
            return deliveryOrder( 'BUY', symbol, quantity, price, params );
        },

        deliverySell: async ( symbol, quantity, price, params = {} ) => {
            return deliveryOrder( 'SELL', symbol, quantity, price, params );
        },

        deliveryMarketBuy: async ( symbol, quantity, params = {} ) => {
            return deliveryOrder( 'BUY', symbol, quantity, false, params );
        },

        deliveryMarketSell: async ( symbol, quantity, params = {} ) => {
            return deliveryOrder( 'SELL', symbol, quantity, false, params );
        },

        deliveryOrder, // side symbol quantity [price] [params]

        deliveryOrderStatus: async ( symbol, params = {} ) => { // Either orderId or origClientOrderId must be sent
            params.symbol = symbol;
            return promiseRequest( 'v1/order', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryCancel: async ( symbol, params = {} ) => { // Either orderId or origClientOrderId must be sent
            params.symbol = symbol;
            return promiseRequest( 'v1/order', params, { base:dapi, type:'SIGNED', method:'DELETE' } );
        },

        deliveryCancelAll: async ( symbol, params = {} ) => {
            params.symbol = symbol;
            return promiseRequest( 'v1/allOpenOrders', params, { base:dapi, type:'SIGNED', method:'DELETE' } );
        },

        deliveryCountdownCancelAll: async ( symbol, countdownTime = 0, params = {} ) => {
            params.symbol = symbol;
            params.countdownTime = countdownTime;
            return promiseRequest( 'v1/countdownCancelAll', params, { base:dapi, type:'SIGNED', method:'POST' } );
        },

        deliveryOpenOrders: async ( symbol = false, params = {} ) => {
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/openOrders', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryAllOrders: async ( symbol = false, params = {} ) => { // Get all account orders; active, canceled, or filled.
            if ( symbol ) params.symbol = symbol;
            return promiseRequest( 'v1/allOrders', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryPositionSideDual: async ( params = {} ) => {
            return promiseRequest( 'v1/positionSide/dual', params, { base:dapi, type:'SIGNED' } );
        },

        deliveryChangePositionSideDual: async ( dualSidePosition, params = {} ) => {
            params.dualSidePosition = dualSidePosition;
            return promiseRequest( 'v1/positionSide/dual', params, { base:dapi, type:'SIGNED', method:'POST' } );
        },

        //** Margin methods */
        /**
         * Creates an order
         * @param {string} side - BUY or SELL
         * @param {string} symbol - the symbol to buy
         * @param {numeric} quantity - the quantity required
         * @param {numeric} price - the price to pay for each unit
         * @param {object} flags - additional buy order flags
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolate margin option
         * @return {undefined}
         */
        mgOrder: function ( side, symbol, quantity, price, flags = {}, callback = false, isIsolated = 'FALSE'  ) {
            marginOrder( side, symbol, quantity, price, { ...flags, isIsolated }, callback );
        },

        /**
         * Creates a buy order
         * @param {string} symbol - the symbol to buy
         * @param {numeric} quantity - the quantity required
         * @param {numeric} price - the price to pay for each unit
         * @param {object} flags - additional buy order flags
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolate margin option
         * @return {undefined}
         */
        mgBuy: function ( symbol, quantity, price, flags = {}, callback = false, isIsolated = 'FALSE'  ) {
            marginOrder( 'BUY', symbol, quantity, price, { ...flags, isIsolated }, callback );
        },

        /**
         * Creates a sell order
         * @param {string} symbol - the symbol to sell
         * @param {numeric} quantity - the quantity required
         * @param {numeric} price - the price to sell each unit for
         * @param {object} flags - additional order flags
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolate margin option
         * @return {undefined}
         */
        mgSell: function ( symbol, quantity, price, flags = {}, callback = false, isIsolated = 'FALSE'  ) {
            marginOrder( 'SELL', symbol, quantity, price, { ...flags, isIsolated }, callback );
        },

        /**
         * Creates a market buy order
         * @param {string} symbol - the symbol to buy
         * @param {numeric} quantity - the quantity required
         * @param {object} flags - additional buy order flags
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolate margin option
         * @return {undefined}
         */
        mgMarketBuy: function ( symbol, quantity, flags = { type: 'MARKET' }, callback = false, isIsolated = 'FALSE' ) {
            if ( typeof flags === 'function' ) { // Accept callback as third parameter
                callback = flags;
                flags = { type: 'MARKET' };
            }
            if ( typeof flags.type === 'undefined' ) flags.type = 'MARKET';
            marginOrder( 'BUY', symbol, quantity, 0, { ...flags, isIsolated }, callback );
        },

        /**
         * Creates a market sell order
         * @param {string} symbol - the symbol to sell
         * @param {numeric} quantity - the quantity required
         * @param {object} flags - additional sell order flags
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolate margin option
         * @return {undefined}
         */
        mgMarketSell: function ( symbol, quantity, flags = { type: 'MARKET' }, callback = false, isIsolated = 'FALSE'  ) {
            if ( typeof flags === 'function' ) { // Accept callback as third parameter
                callback = flags;
                flags = { type: 'MARKET' };
            }
            if ( typeof flags.type === 'undefined' ) flags.type = 'MARKET';
            marginOrder( 'SELL', symbol, quantity, 0, { ...flags, isIsolated }, callback );
        },

        /**
         * Cancels an order
         * @param {string} symbol - the symbol to cancel
         * @param {string} orderid - the orderid to cancel
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgCancel: function ( symbol, orderid, callback = false, isIsolated = 'FALSE' ) {
            signedRequest( sapi + 'v1/margin/order', { symbol: symbol, orderId: orderid, isIsolated }, function ( error, data ) {
                if ( callback ) return callback.call( this, error, data, symbol );
            }, 'DELETE' );
        },

        /**
        * Gets all order of a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        mgAllOrders: function ( symbol, callback, options = {} ) {
            let parameters = Object.assign( { symbol: symbol }, options );
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( sapi + 'v1/margin/allOrders', parameters, function ( error, data ) {
                        return callback.call( this, error, data, symbol );
                    } );
                } )
            } else {
                signedRequest( sapi + 'v1/margin/allOrders', parameters, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                } );
            }
        },

        /**
         * Gets the status of an order
         * @param {string} symbol - the symbol to check
         * @param {string} orderid - the orderid to check
         * @param {function} callback - the callback function
         * @param {object} flags - any additional flags
         * @return {undefined}
         */
        mgOrderStatus: function ( symbol, orderid, callback, flags = {} ) {
            let parameters = Object.assign( { symbol: symbol, orderId: orderid }, flags );
            signedRequest( sapi + 'v1/margin/order', parameters, function ( error, data ) {
                if ( callback ) return callback.call( this, error, data, symbol );
            } );
        },

        /**
         * Gets open orders
         * @param {string} symbol - the symbol to get
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgOpenOrders: function ( symbol, callback ) {
            let parameters = symbol ? { symbol: symbol } : {};
            signedRequest( sapi + 'v1/margin/openOrders', parameters, function ( error, data ) {
                return callback.call( this, error, data, symbol );
            } );
        },

        /**
         * Cancels all order of a given symbol
         * @param {string} symbol - the symbol to cancel all orders for
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgCancelOrders: function ( symbol, callback = false ) {
            signedRequest( sapi + 'v1/margin/openOrders', { symbol: symbol }, function ( error, json ) {
                if ( json.length === 0 ) {
                    if ( callback ) return callback.call( this, 'No orders present for this symbol', {}, symbol );
                }
                for ( let obj of json ) {
                    let quantity = obj.origQty - obj.executedQty;
                    Binance.options.log( 'cancel order: ' + obj.side + ' ' + symbol + ' ' + quantity + ' @ ' + obj.price + ' #' + obj.orderId );
                    signedRequest( sapi + 'v1/margin/order', { symbol: symbol, orderId: obj.orderId }, function ( error, data ) {
                        if ( callback ) return callback.call( this, error, data, symbol );
                    }, 'DELETE' );
                }
            } );
        },

        /**
         * Transfer from main account to margin account
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @param {object} options - additional options
         * @return {undefined}
         */
        mgTransferMainToMargin: function ( asset, amount, callback ) {
            let parameters = Object.assign( { asset: asset, amount: amount, type: 1 } );
            signedRequest( sapi + 'v1/margin/transfer', parameters, function ( error, data ) {
                if ( callback ) return callback( error, data );
            }, 'POST' );
        },

        /**
         * Transfer from margin account to main account
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgTransferMarginToMain: function ( asset, amount, callback ) {
            let parameters = Object.assign( { asset: asset, amount: amount, type: 2 } );
            signedRequest( sapi + 'v1/margin/transfer', parameters, function ( error, data ) {
                if ( callback ) return callback( error, data );
            }, 'POST' );
        },
        /**
		* Universal Transfer requires API permissions enabled
		* @param {string} type - ENUM , example MAIN_UMFUTURE for SPOT to USDT futures, see https://binance-docs.github.io/apidocs/spot/en/#user-universal-transfer
		* @param {string} asset - the asset - example :USDT
		* @param {number} amount - the callback function
		* @param {function} callback - the callback function (optionnal)
		* @return {promise}
		*/
        universalTransfer: ( type, asset, amount, callback ) =>
            universalTransfer( type, asset, amount, callback ),

        /**
        * Get trades for a given symbol - margin account 
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        mgTrades: ( symbol, callback, options = {} ) => {
            let parameters = Object.assign( { symbol: symbol }, options );
            if ( !callback ) {
                return new Promise( ( resolve, reject ) => {
                    callback = ( error, response ) => {
                        if ( error ) {
                            reject( error );
                        } else {
                            resolve( response );
                        }
                    }
                    signedRequest( sapi + 'v1/margin/myTrades', parameters, function ( error, data ) {
                        return callback.call( this, error, data, symbol );
                    } );
                } )
            } else {
                signedRequest( sapi + 'v1/margin/myTrades', parameters, function ( error, data ) {
                    return callback.call( this, error, data, symbol );
                } );
            }
        },

        /**
     * Transfer from main account to delivery account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {function} callback - the callback function (optionnal)
     * @param {object} options - additional options
     * @return {undefined}
     */
        transferMainToFutures: ( asset, amount, callback ) =>
            transferBetweenMainAndFutures( asset, amount, 1, callback ),

        /**
     * Transfer from delivery account to main account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {function} callback - the callback function (optionnal)
     * @return {undefined}
     */
        transferFuturesToMain: ( asset, amount, callback ) =>
            transferBetweenMainAndFutures( asset, amount, 2, callback ),

        /**
     * Transfer from main account to delivery account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {function} callback - the callback function (optionnal)
     * @param {object} options - additional options
     * @return {undefined}
     */
        transferMainToDelivery: ( asset, amount, callback ) =>
            transferBetweenMainAndFutures( asset, amount, 3, callback ),

        /**
     * Transfer from delivery account to main account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {function} callback - the callback function (optionnal)
     * @return {undefined}
     */
        transferDeliveryToMain: ( asset, amount, callback ) =>
            transferBetweenMainAndFutures( asset, amount, 4, callback ),

        /**
         * Get maximum transfer-out amount of an asset
         * @param {string} asset - the asset
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        maxTransferable: function ( asset, callback ) {
            signedRequest( sapi + 'v1/margin/maxTransferable', { asset: asset }, function( error, data ) {
                if( callback ) return callback( error, data );
            } );
        },

        /**
         * Margin account borrow/loan
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolated option
         * @param {string} symbol - symbol for isolated margin
         * @return {undefined}
         */
        mgBorrow: function ( asset, amount, callback, isIsolated = 'FALSE', symbol = null ) {
            let parameters = Object.assign( { asset: asset, amount: amount } );
            if ( isIsolated === 'TRUE' && !symbol ) throw new Error( 'If "isIsolated" = "TRUE", "symbol" must be sent' )
            const isolatedObj = isIsolated === 'TRUE' ? {
                isIsolated,
                symbol
            } : {}
            signedRequest( sapi + 'v1/margin/loan', { ...parameters, ...isolatedObj }, function ( error, data ) {
                if ( callback ) return callback( error, data );
            }, 'POST' );
        },

        /**
         * Margin account borrow/loan
         * @param {string} asset - the asset
         * @param {object} options - additional options
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgQueryLoan: function ( asset, options, callback ) {
            let parameters = Object.assign( { asset: asset }, options );
            signedRequest( sapi + 'v1/margin/loan', { ...parameters }, function ( error, data ) {
                if ( callback ) return callback( error, data );
            }, 'GET' );
        },

        /**
         * Margin account repay
         * @param {string} asset - the asset
         * @param {object} options - additional options
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgQueryRepay: function ( asset, options, callback ) {
            let parameters = Object.assign( { asset: asset }, options );
            signedRequest( sapi + 'v1/margin/repay', { ...parameters }, function ( error, data ) {
                if ( callback ) return callback( error, data );
            }, 'GET' );
        },
        
        /**
         * Margin account repay
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolated option
         * @param {string} symbol - symbol for isolated margin
         * @return {undefined}
         */
        mgRepay: function ( asset, amount, callback, isIsolated = 'FALSE', symbol = null ) {
            let parameters = Object.assign( { asset: asset, amount: amount } );
            if ( isIsolated === 'TRUE' && !symbol ) throw new Error( 'If "isIsolated" = "TRUE", "symbol" must be sent' )
            const isolatedObj = isIsolated === 'TRUE' ? {
                isIsolated,
                symbol
            } : {}
            signedRequest( sapi + 'v1/margin/repay', { ...parameters, ...isolatedObj }, function ( error, data ) {
                if ( callback ) return callback( error, data );
            }, 'POST' );
        },
        
        /**
         * Margin account details
         * @param {function} callback - the callback function
         * @param {boolean} isIsolated - the callback function
         * @return {undefined}
         */
        mgAccount: function( callback, isIsolated = false ) {
            let endpoint = 'v1/margin';
	        endpoint += ( isIsolated ) ? '/isolated' : '' + '/account';
            signedRequest( sapi + endpoint, {}, function( error, data ) {
                if( callback ) return callback( error, data );
            } );
        },
        /**
         * Get maximum borrow amount of an asset
         * @param {string} asset - the asset
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        maxBorrowable: function ( asset, callback ) {
            signedRequest( sapi + 'v1/margin/maxBorrowable', { asset: asset }, function( error, data ) {
                if( callback ) return callback( error, data );
            } );
        },

        // Futures WebSocket Functions:
        /**
         * Subscribe to a single futures websocket
         * @param {string} url - the futures websocket endpoint
         * @param {function} callback - optional execution callback
         * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
         * @return {WebSocket} the websocket reference
         */
        futuresSubscribeSingle: function ( url, callback, params = {} ) {
            return futuresSubscribeSingle( url, callback, params );
        },

        /**
         * Subscribe to a combined futures websocket
         * @param {string} streams - the list of websocket endpoints to connect to
         * @param {function} callback - optional execution callback
         * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
         * @return {WebSocket} the websocket reference
         */
        futuresSubscribe: function ( streams, callback, params = {} ) {
            return futuresSubscribe( streams, callback, params );
        },

        /**
         * Returns the known futures websockets subscriptions
         * @return {array} array of futures websocket subscriptions
         */
        futuresSubscriptions: function() {
            return Binance.futuresSubscriptions;
        },

        /**
         * Terminates a futures websocket
         * @param {string} endpoint - the string associated with the endpoint
         * @return {undefined}
         */
        futuresTerminate: function ( endpoint ) {
            if ( Binance.options.verbose ) Binance.options.log( 'Futures WebSocket terminating:', endpoint );
            return futuresTerminate( endpoint );
        },

        /**
         * Futures WebSocket aggregated trades
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresAggTradeStream: function futuresAggTradeStream( symbols, callback ) {
            let reconnect = () => {
                if ( Binance.options.reconnect ) futuresAggTradeStream( symbols, callback );
            };
            let subscription, cleanCallback = data => callback( fAggTradeConvertData( data ) );
            if ( Array.isArray( symbols ) ) {
                if ( !isArrayUnique( symbols ) ) throw Error( 'futuresAggTradeStream: "symbols" cannot contain duplicate elements.' );
                let streams = symbols.map( symbol => symbol.toLowerCase() + '@aggTrade' );
                subscription = futuresSubscribe( streams, cleanCallback, { reconnect } );
            } else {
                let symbol = symbols;
                subscription = futuresSubscribeSingle( symbol.toLowerCase() + '@aggTrade', cleanCallback, { reconnect } );
            }
            return subscription.endpoint;
        },

        /**
         * Futures WebSocket mark price
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @param {string} speed - 1 second updates. leave blank for default 3 seconds
         * @return {string} the websocket endpoint
         */
        futuresMarkPriceStream: function fMarkPriceStream( symbol = false, callback = console.log, speed = '@1s' ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) fMarkPriceStream( symbol, callback, speed );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@markPrice` : '!markPrice@arr'
            let subscription = futuresSubscribeSingle( endpoint + speed, data => callback( fMarkPriceConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Futures WebSocket liquidations stream
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresLiquidationStream: function fLiquidationStream( symbol = false, callback = console.log ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) fLiquidationStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@forceOrder` : '!forceOrder@arr'
            let subscription = futuresSubscribeSingle( endpoint, data => callback( fLiquidationConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Futures WebSocket prevDay ticker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresTickerStream: function fTickerStream( symbol = false, callback = console.log ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) fTickerStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@ticker` : '!ticker@arr'
            let subscription = futuresSubscribeSingle( endpoint, data => callback( fTickerConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Futures WebSocket miniTicker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresMiniTickerStream: function fMiniTickerStream( symbol = false, callback = console.log ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) fMiniTickerStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@miniTicker` : '!miniTicker@arr'
            let subscription = futuresSubscribeSingle( endpoint, data => callback( fMiniTickerConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Futures WebSocket bookTicker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresBookTickerStream: function fBookTickerStream( symbol = false, callback = console.log ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) fBookTickerStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@bookTicker` : '!bookTicker'
            let subscription = futuresSubscribeSingle( endpoint, data => callback( fBookTickerConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Websocket futures klines
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @param {int} limit - maximum results, no more than 1000
         * @return {string} the websocket endpoint
         */
        futuresChart: async function futuresChart( symbols, interval, callback, limit = 500 ) {
            let reconnect = () => {
                if ( Binance.options.reconnect ) futuresChart( symbols, interval, callback, limit );
            };

            let futuresChartInit = symbol => {
                if ( typeof Binance.futuresMeta[symbol] === 'undefined' ) Binance.futuresMeta[symbol] = {};
                if ( typeof Binance.futuresMeta[symbol][interval] === 'undefined' ) Binance.futuresMeta[symbol][interval] = {};
                if ( typeof Binance.futuresTicks[symbol] === 'undefined' ) Binance.futuresTicks[symbol] = {};
                if ( typeof Binance.futuresTicks[symbol][interval] === 'undefined' ) Binance.futuresTicks[symbol][interval] = {};
                if ( typeof Binance.futuresRealtime[symbol] === 'undefined' ) Binance.futuresRealtime[symbol] = {};
                if ( typeof Binance.futuresRealtime[symbol][interval] === 'undefined' ) Binance.futuresRealtime[symbol][interval] = {};
                if ( typeof Binance.futuresKlineQueue[symbol] === 'undefined' ) Binance.futuresKlineQueue[symbol] = {};
                if ( typeof Binance.futuresKlineQueue[symbol][interval] === 'undefined' ) Binance.futuresKlineQueue[symbol][interval] = [];
                Binance.futuresMeta[symbol][interval].timestamp = 0;
            }

            let handleFuturesKlineStream = kline => {
                let symbol = kline.s, interval = kline.k.i;
                if ( !Binance.futuresMeta[symbol][interval].timestamp ) {
                    if ( typeof ( Binance.futuresKlineQueue[symbol][interval] ) !== 'undefined' && kline !== null ) {
                        Binance.futuresKlineQueue[symbol][interval].push( kline );
                    }
                } else {
                    //Binance.options.log('futures klines at ' + kline.k.t);
                    futuresKlineHandler( symbol, kline );
                    if ( callback ) callback( symbol, interval, futuresKlineConcat( symbol, interval ) );
                }
            };

            let getFuturesKlineSnapshot = async ( symbol, limit = 500 ) => {
                let data = await promiseRequest( 'v1/klines', { symbol, interval, limit }, { base:fapi } );
                futuresKlineData( symbol, interval, data );
                //Binance.options.log('/futures klines at ' + Binance.futuresMeta[symbol][interval].timestamp);
                if ( typeof Binance.futuresKlineQueue[symbol][interval] !== 'undefined' ) {
                    for ( let kline of Binance.futuresKlineQueue[symbol][interval] ) futuresKlineHandler( symbol, kline, Binance.futuresMeta[symbol][interval].timestamp );
                    delete Binance.futuresKlineQueue[symbol][interval];
                }
                if ( callback ) callback( symbol, interval, futuresKlineConcat( symbol, interval ) );
            };

            let subscription;
            if ( Array.isArray( symbols ) ) {
                if ( !isArrayUnique( symbols ) ) throw Error( 'futuresChart: "symbols" array cannot contain duplicate elements.' );
                symbols.forEach( futuresChartInit );
                let streams = symbols.map( symbol => `${ symbol.toLowerCase() }@kline_${ interval }` );
                subscription = futuresSubscribe( streams, handleFuturesKlineStream, reconnect );
                symbols.forEach( element => getFuturesKlineSnapshot( element, limit ) );
            } else {
                let symbol = symbols;
                futuresChartInit( symbol );
                subscription = futuresSubscribeSingle( symbol.toLowerCase() + '@kline_' + interval, handleFuturesKlineStream, { reconnect } );
                getFuturesKlineSnapshot( symbol, limit );
            }
            return subscription.endpoint;
        },

        /**
         * Websocket futures candlesticks
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresCandlesticks: function futuresCandlesticks( symbols, interval, callback ) {
            let reconnect = () => {
                if ( Binance.options.reconnect ) futuresCandlesticks( symbols, interval, callback );
            };
            let subscription;
            if ( Array.isArray( symbols ) ) {
                if ( !isArrayUnique( symbols ) ) throw Error( 'futuresCandlesticks: "symbols" array cannot contain duplicate elements.' );
                let streams = symbols.map( symbol => symbol.toLowerCase() + '@kline_' + interval );
                subscription = futuresSubscribe( streams, callback, { reconnect } );
            } else {
                let symbol = symbols.toLowerCase();
                subscription = futuresSubscribeSingle( symbol + '@kline_' + interval, callback, { reconnect } );
            }
            return subscription.endpoint;
        },

        // Delivery WebSocket Functions:
        /**
         * Subscribe to a single delivery websocket
         * @param {string} url - the delivery websocket endpoint
         * @param {function} callback - optional execution callback
         * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
         * @return {WebSocket} the websocket reference
         */
        deliverySubscribeSingle: function ( url, callback, params = {} ) {
            return deliverySubscribeSingle( url, callback, params );
        },

        /**
         * Subscribe to a combined delivery websocket
         * @param {string} streams - the list of websocket endpoints to connect to
         * @param {function} callback - optional execution callback
         * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
         * @return {WebSocket} the websocket reference
         */
        deliverySubscribe: function ( streams, callback, params = {} ) {
            return deliverySubscribe( streams, callback, params );
        },

        /**
         * Returns the known delivery websockets subscriptions
         * @return {array} array of delivery websocket subscriptions
         */
        deliverySubscriptions: function() {
            return Binance.deliverySubscriptions;
        },

        /**
         * Terminates a delivery websocket
         * @param {string} endpoint - the string associated with the endpoint
         * @return {undefined}
         */
        deliveryTerminate: function ( endpoint ) {
            if ( Binance.options.verbose ) Binance.options.log( 'Delivery WebSocket terminating:', endpoint );
            return deliveryTerminate( endpoint );
        },

        /**
         * Delivery WebSocket aggregated trades
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryAggTradeStream: function deliveryAggTradeStream( symbols, callback ) {
            let reconnect = () => {
                if ( Binance.options.reconnect ) deliveryAggTradeStream( symbols, callback );
            };
            let subscription, cleanCallback = data => callback( dAggTradeConvertData( data ) );
            if ( Array.isArray( symbols ) ) {
                if ( !isArrayUnique( symbols ) ) throw Error( 'deliveryAggTradeStream: "symbols" cannot contain duplicate elements.' );
                let streams = symbols.map( symbol => symbol.toLowerCase() + '@aggTrade' );
                subscription = deliverySubscribe( streams, cleanCallback, { reconnect } );
            } else {
                let symbol = symbols;
                subscription = deliverySubscribeSingle( symbol.toLowerCase() + '@aggTrade', cleanCallback, { reconnect } );
            }
            return subscription.endpoint;
        },

        /**
         * Delivery WebSocket mark price
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @param {string} speed - 1 second updates. leave blank for default 3 seconds
         * @return {string} the websocket endpoint
         */
        deliveryMarkPriceStream: function dMarkPriceStream( symbol = false, callback = console.log, speed = '@1s' ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) dMarkPriceStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@markPrice` : '!markPrice@arr'
            let subscription = deliverySubscribeSingle( endpoint + speed, data => callback( dMarkPriceConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Delivery WebSocket liquidations stream
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryLiquidationStream: function dLiquidationStream( symbol = false, callback = console.log ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) dLiquidationStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@forceOrder` : '!forceOrder@arr'
            let subscription = deliverySubscribeSingle( endpoint, data => callback( dLiquidationConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Delivery WebSocket prevDay ticker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryTickerStream: function dTickerStream( symbol = false, callback = console.log ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) dTickerStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@ticker` : '!ticker@arr'
            let subscription = deliverySubscribeSingle( endpoint, data => callback( dTickerConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Delivery WebSocket miniTicker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryMiniTickerStream: function dMiniTickerStream( symbol = false, callback = console.log ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) dMiniTickerStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@miniTicker` : '!miniTicker@arr'
            let subscription = deliverySubscribeSingle( endpoint, data => callback( dMiniTickerConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Delivery WebSocket bookTicker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryBookTickerStream: function dBookTickerStream( symbol = false, callback = console.log ) {
            if ( typeof symbol == 'function' ) {
                callback = symbol;
                symbol = false;
            }
            let reconnect = () => {
                if ( Binance.options.reconnect ) dBookTickerStream( symbol, callback );
            };
            const endpoint = symbol ? `${ symbol.toLowerCase() }@bookTicker` : '!bookTicker'
            let subscription = deliverySubscribeSingle( endpoint, data => callback( dBookTickerConvertData( data ) ), { reconnect } );
            return subscription.endpoint;
        },

        /**
         * Websocket delivery klines
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @param {int} limit - maximum results, no more than 1000
         * @return {string} the websocket endpoint
         */
        deliveryChart: async function deliveryChart( symbols, interval, callback, limit = 500 ) {
            let reconnect = () => {
                if ( Binance.options.reconnect ) deliveryChart( symbols, interval, callback, limit );
            };

            let deliveryChartInit = symbol => {
                if ( typeof Binance.deliveryMeta[symbol] === 'undefined' ) Binance.deliveryMeta[symbol] = {};
                if ( typeof Binance.deliveryMeta[symbol][interval] === 'undefined' ) Binance.deliveryMeta[symbol][interval] = {};
                if ( typeof Binance.deliveryTicks[symbol] === 'undefined' ) Binance.deliveryTicks[symbol] = {};
                if ( typeof Binance.deliveryTicks[symbol][interval] === 'undefined' ) Binance.deliveryTicks[symbol][interval] = {};
                if ( typeof Binance.deliveryRealtime[symbol] === 'undefined' ) Binance.deliveryRealtime[symbol] = {};
                if ( typeof Binance.deliveryRealtime[symbol][interval] === 'undefined' ) Binance.deliveryRealtime[symbol][interval] = {};
                if ( typeof Binance.deliveryKlineQueue[symbol] === 'undefined' ) Binance.deliveryKlineQueue[symbol] = {};
                if ( typeof Binance.deliveryKlineQueue[symbol][interval] === 'undefined' ) Binance.deliveryKlineQueue[symbol][interval] = [];
                Binance.deliveryMeta[symbol][interval].timestamp = 0;
            }

            let handleDeliveryKlineStream = kline => {
                let symbol = kline.s, interval = kline.k.i;
                if ( !Binance.deliveryMeta[symbol][interval].timestamp ) {
                    if ( typeof ( Binance.deliveryKlineQueue[symbol][interval] ) !== 'undefined' && kline !== null ) {
                        Binance.deliveryKlineQueue[symbol][interval].push( kline );
                    }
                } else {
                    //Binance.options.log('futures klines at ' + kline.k.t);
                    deliveryKlineHandler( symbol, kline );
                    if ( callback ) callback( symbol, interval, deliveryKlineConcat( symbol, interval ) );
                }
            };

            let getDeliveryKlineSnapshot = async ( symbol, limit = 500 ) => {
                let data = await promiseRequest( 'v1/klines', { symbol, interval, limit }, { base:fapi } );
                deliveryKlineData( symbol, interval, data );
                //Binance.options.log('/delivery klines at ' + Binance.deliveryMeta[symbol][interval].timestamp);
                if ( typeof Binance.deliveryKlineQueue[symbol][interval] !== 'undefined' ) {
                    for ( let kline of Binance.deliveryKlineQueue[symbol][interval] ) deliveryKlineHandler( symbol, kline, Binance.deliveryMeta[symbol][interval].timestamp );
                    delete Binance.deliveryKlineQueue[symbol][interval];
                }
                if ( callback ) callback( symbol, interval, deliveryKlineConcat( symbol, interval ) );
            };

            let subscription;
            if ( Array.isArray( symbols ) ) {
                if ( !isArrayUnique( symbols ) ) throw Error( 'deliveryChart: "symbols" array cannot contain duplicate elements.' );
                symbols.forEach( deliveryChartInit );
                let streams = symbols.map( symbol => `${ symbol.toLowerCase() }@kline_${ interval }` );
                subscription = deliverySubscribe( streams, handleDeliveryKlineStream, reconnect );
                symbols.forEach( element => getDeliveryKlineSnapshot( element, limit ) );
            } else {
                let symbol = symbols;
                deliveryChartInit( symbol );
                subscription = deliverySubscribeSingle( symbol.toLowerCase() + '@kline_' + interval, handleDeliveryKlineStream, reconnect );
                getDeliveryKlineSnapshot( symbol, limit );
            }
            return subscription.endpoint;
        },

        /**
         * Websocket delivery candlesticks
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryCandlesticks: function deliveryCandlesticks( symbols, interval, callback ) {
            let reconnect = () => {
                if ( Binance.options.reconnect ) deliveryCandlesticks( symbols, interval, callback );
            };
            let subscription;
            if ( Array.isArray( symbols ) ) {
                if ( !isArrayUnique( symbols ) ) throw Error( 'deliveryCandlesticks: "symbols" array cannot contain duplicate elements.' );
                let streams = symbols.map( symbol => symbol.toLowerCase() + '@kline_' + interval );
                subscription = deliverySubscribe( streams, callback, { reconnect } );
            } else {
                let symbol = symbols.toLowerCase();
                subscription = deliverySubscribeSingle( symbol + '@kline_' + interval, callback, { reconnect } );
            }
            return subscription.endpoint;
        },

        websockets: {
            /**
             * Userdata websockets function
             * @param {function} callback - the callback function
             * @param {function} execution_callback - optional execution callback
             * @param {function} subscribed_callback - subscription callback
             * @param {function} list_status_callback - status callback
             * @return {undefined}
             */
            userData: function userData( callback, execution_callback = false, subscribed_callback = false, list_status_callback = false ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) userData( callback, execution_callback, subscribed_callback );
                };
                apiRequest( getSpotUrl() + 'v3/userDataStream', {}, function ( error, response ) {
                    Binance.options.listenKey = response.listenKey;
                    setTimeout( function userDataKeepAlive() { // keepalive
                        try {
                            apiRequest( getSpotUrl() + 'v3/userDataStream?listenKey=' + Binance.options.listenKey, {}, function ( err ) {
                                if ( err ) setTimeout( userDataKeepAlive, 60000 ); // retry in 1 minute
                                else setTimeout( userDataKeepAlive, 60 * 30 * 1000 ); // 30 minute keepalive
                            }, 'PUT' );
                        } catch ( error ) {
                            setTimeout( userDataKeepAlive, 60000 ); // retry in 1 minute
                        }
                    }, 60 * 30 * 1000 ); // 30 minute keepalive
                    Binance.options.balance_callback = callback;
                    Binance.options.execution_callback = execution_callback ? execution_callback : callback;//This change is required to listen for Orders
                    Binance.options.list_status_callback = list_status_callback;
                    const subscription = subscribe( Binance.options.listenKey, userDataHandler, reconnect );
                    if ( subscribed_callback ) subscribed_callback( subscription.endpoint );
                }, 'POST' );
            },

            /**
             * Margin Userdata websockets function
             * @param {function} callback - the callback function
             * @param {function} execution_callback - optional execution callback
             * @param {function} subscribed_callback - subscription callback
             * @param {function} list_status_callback - status callback
             * @return {undefined}
             */
            userMarginData: function userMarginData( callback, execution_callback = false, subscribed_callback = false, list_status_callback = false ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) userMarginData( callback, execution_callback, subscribed_callback );
                };
                apiRequest( sapi + 'v1/userDataStream', {}, function ( error, response ) {
                    Binance.options.listenMarginKey = response.listenKey;
                    setTimeout( function userDataKeepAlive() { // keepalive
                        try {
                            apiRequest( sapi + 'v1/userDataStream?listenKey=' + Binance.options.listenMarginKey, {}, function ( err ) {
                                if ( err ) setTimeout( userDataKeepAlive, 60000 ); // retry in 1 minute
                                else setTimeout( userDataKeepAlive, 60 * 30 * 1000 ); // 30 minute keepalive
                            }, 'PUT' );
                        } catch ( error ) {
                            setTimeout( userDataKeepAlive, 60000 ); // retry in 1 minute
                        }
                    }, 60 * 30 * 1000 ); // 30 minute keepalive
                    Binance.options.margin_balance_callback = callback;
                    Binance.options.margin_execution_callback = execution_callback;
                    Binance.options.margin_list_status_callback = list_status_callback;
                    const subscription = subscribe( Binance.options.listenMarginKey, userMarginDataHandler, reconnect );
                    if ( subscribed_callback ) subscribed_callback( subscription.endpoint );
                }, 'POST' );
            },

            /**
             * Future Userdata websockets function
             * @param {function} margin_call_callback
             * @param {function} account_update_callback
             * @param {function} order_update_callback
             * @param {Function} subscribed_callback - subscription callback
             */
            userFutureData: function userFutureData( margin_call_callback, account_update_callback = undefined, order_update_callback = undefined, subscribed_callback = undefined, account_config_update_callback = undefined ) {
                const url = ( Binance.options.test ) ? fapiTest : fapi;

                let reconnect = () => {
                    if ( Binance.options.reconnect ) userFutureData( margin_call_callback, account_update_callback, order_update_callback, subscribed_callback )
                }

                apiRequest( url + 'v1/listenKey', {}, function ( error, response ) {
                    Binance.options.listenFutureKey = response.listenKey;
                    setTimeout( function userDataKeepAlive() { // keepalive
                        try {
                            apiRequest( url + 'v1/listenKey?listenKey=' + Binance.options.listenFutureKey, {}, function ( err ) {
                                if ( err ) setTimeout( userDataKeepAlive, 60000 ); // retry in 1 minute
                                else setTimeout( userDataKeepAlive, 60 * 30 * 1000 ); // 30 minute keepalive
                            }, 'PUT' );
                        } catch ( error ) {
                            setTimeout( userDataKeepAlive, 60000 ); // retry in 1 minute
                        }
                    }, 60 * 30 * 1000 ); // 30 minute keepalive
                    Binance.options.future_margin_call_callback = margin_call_callback;
                    Binance.options.future_account_update_callback = account_update_callback;
                    Binance.options.future_account_config_update_callback = account_config_update_callback;
                    Binance.options.future_order_update_callback = order_update_callback;
                    const subscription = futuresSubscribe( Binance.options.listenFutureKey, userFutureDataHandler, { reconnect } );
                    if ( subscribed_callback ) subscribed_callback( subscription.endpoint );
                }, 'POST' );
            },

            /**
           * Delivery Userdata websockets function
           * @param {function} margin_call_callback
           * @param {function} account_update_callback
           * @param {function} order_update_callback
           * @param {Function} subscribed_callback - subscription callback
           */
            userDeliveryData: function userDeliveryData(
                margin_call_callback,
                account_update_callback = undefined,
                order_update_callback = undefined,
                subscribed_callback = undefined
            ) {
                const url = Binance.options.test ? dapiTest : dapi;

                let reconnect = () => {
                    if ( Binance.options.reconnect )
                        userDeliveryData(
                            margin_call_callback,
                            account_update_callback,
                            order_update_callback,
                            subscribed_callback
                        );
                };

                apiRequest(
                    url + "v1/listenKey",
                    {},
                    function ( error, response ) {
                        Binance.options.listenDeliveryKey = response.listenKey;
                        setTimeout( function userDataKeepAlive() {
                            // keepalive
                            try {
                                apiRequest(
                                    url +
                        "v1/listenKey?listenKey=" +
                        Binance.options.listenDeliveryKey,
                                    {},
                                    function ( err ) {
                                        if ( err ) setTimeout( userDataKeepAlive, 60000 );
                                        // retry in 1 minute
                                        else setTimeout( userDataKeepAlive, 60 * 30 * 1000 ); // 30 minute keepalive
                                    },
                                    "PUT"
                                );
                            } catch ( error ) {
                                setTimeout( userDataKeepAlive, 60000 ); // retry in 1 minute
                            }
                        }, 60 * 30 * 1000 ); // 30 minute keepalive
                        Binance.options.delivery_margin_call_callback = margin_call_callback;
                        Binance.options.delivery_account_update_callback = account_update_callback;
                        Binance.options.delivery_order_update_callback = order_update_callback;
                        const subscription = deliverySubscribe(
                            Binance.options.listenDeliveryKey,
                            userDeliveryDataHandler,
                            { reconnect }
                        );
                        if ( subscribed_callback ) subscribed_callback( subscription.endpoint );
                    },
                    "POST"
                );
            },

            /**
             * Subscribe to a generic websocket
             * @param {string} url - the websocket endpoint
             * @param {function} callback - optional execution callback
             * @param {boolean} reconnect - subscription callback
             * @return {WebSocket} the websocket reference
             */
            subscribe: function ( url, callback, reconnect = false ) {
                return subscribe( url, callback, reconnect );
            },

            /**
             * Subscribe to a generic combined websocket
             * @param {string} url - the websocket endpoint
             * @param {function} callback - optional execution callback
             * @param {boolean} reconnect - subscription callback
             * @return {WebSocket} the websocket reference
             */
            subscribeCombined: function ( url, callback, reconnect = false ) {
                return subscribeCombined( url, callback, reconnect );
            },

            /**
             * Returns the known websockets subscriptions
             * @return {array} array of web socket subscriptions
             */
            subscriptions: function() {
                return Binance.subscriptions;
            },

            /**
             * Terminates a web socket
             * @param {string} endpoint - the string associated with the endpoint
             * @return {undefined}
             */
            terminate: function ( endpoint ) {
                if ( Binance.options.verbose ) Binance.options.log( 'WebSocket terminating:', endpoint );
                return terminate( endpoint );
            },

            /**
             * Websocket depth chart
             * @param {array/string} symbols - an array or string of symbols to query
             * @param {function} callback - callback function
             * @return {string} the websocket endpoint
             */
            depth: function depth ( symbols, callback ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) depth( symbols, callback );
                };
                let subscription;
                if ( Array.isArray( symbols ) ) {
                    if ( !isArrayUnique( symbols ) ) throw Error( 'depth: "symbols" cannot contain duplicate elements.' );
                    let streams = symbols.map( function ( symbol ) {
                        return symbol.toLowerCase() + '@depth@100ms';
                    } );
                    subscription = subscribeCombined( streams, callback, reconnect );
                } else {
                    let symbol = symbols;
                    subscription = subscribe( symbol.toLowerCase() + '@depth@100ms', callback, reconnect );
                }
                return subscription.endpoint;
            },

            /**
             * Websocket depth cache
             * @param {array/string} symbols - an array or string of symbols to query
             * @param {function} callback - callback function
             * @param {int} limit - the number of entries
             * @return {string} the websocket endpoint
             */
            depthCache: function depthCacheFunction( symbols, callback, limit = 500 ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) depthCacheFunction( symbols, callback, limit );
                };

                let symbolDepthInit = symbol => {
                    if ( typeof Binance.depthCacheContext[symbol] === 'undefined' ) Binance.depthCacheContext[symbol] = {};
                    let context = Binance.depthCacheContext[symbol];
                    context.snapshotUpdateId = null;
                    context.lastEventUpdateId = null;
                    context.messageQueue = [];
                    Binance.depthCache[symbol] = { bids: {}, asks: {} };
                };

                let assignEndpointIdToContext = ( symbol, endpointId ) => {
                    if ( Binance.depthCacheContext[symbol] ) {
                        let context = Binance.depthCacheContext[symbol];
                        context.endpointId = endpointId;
                    }
                };

                let handleDepthStreamData = depth => {
                    let symbol = depth.s;
                    let context = Binance.depthCacheContext[symbol];
                    if ( context.messageQueue && !context.snapshotUpdateId ) {
                        context.messageQueue.push( depth );
                    } else {
                        try {
                            depthHandler( depth );
                        } catch ( err ) {
                            return terminate( context.endpointId, true );
                        }
                        if ( callback ) callback( symbol, Binance.depthCache[symbol], context );
                    }
                };

                let getSymbolDepthSnapshot = ( symbol, cb ) => {
                    publicRequest( getSpotUrl() + 'v3/depth', { symbol: symbol, limit: limit }, function ( error, json ) {
                        if ( error ) {
                            return cb( error, null );
                        }
                        // Store symbol next use
                        json.symb = symbol;
                        cb( null, json )
                    } );
                };

                let updateSymbolDepthCache = json => {
                    // Get previous store symbol
                    let symbol = json.symb;
                    // Initialize depth cache from snapshot
                    Binance.depthCache[symbol] = depthData( json );
                    // Prepare depth cache context
                    let context = Binance.depthCacheContext[symbol];
                    context.snapshotUpdateId = json.lastUpdateId;
                    context.messageQueue = context.messageQueue.filter( depth => depth.u > context.snapshotUpdateId );
                    // Process any pending depth messages
                    for ( let depth of context.messageQueue ) {
                        /* Although sync errors shouldn't ever happen here, we catch and swallow them anyway
                         just in case. The stream handler function above will deal with broken caches. */
                        try {
                            depthHandler( depth );
                        } catch ( err ) {
                            // Do nothing
                        }
                    }
                    delete context.messageQueue;
                    if ( callback ) callback( symbol, Binance.depthCache[symbol] );
                };

                /* If an array of symbols are sent we use a combined stream connection rather.
                 This is transparent to the developer, and results in a single socket connection.
                 This essentially eliminates "unexpected response" errors when subscribing to a lot of data. */
                let subscription;
                if ( Array.isArray( symbols ) ) {
                    if ( !isArrayUnique( symbols ) ) throw Error( 'depthCache: "symbols" cannot contain duplicate elements.' );
                    symbols.forEach( symbolDepthInit );
                    let streams = symbols.map( function ( symbol ) {
                        return symbol.toLowerCase() + `@depth@100ms`;
                    } );
                    subscription = subscribeCombined( streams, handleDepthStreamData, reconnect, function () {
                        async.mapLimit( symbols, 50, getSymbolDepthSnapshot, ( err, results ) => {
                            if ( err ) throw err;
                            results.forEach( updateSymbolDepthCache );
                        } );
                    } );
                    symbols.forEach( s => assignEndpointIdToContext( s, subscription.endpoint ) );
                } else {
                    let symbol = symbols;
                    symbolDepthInit( symbol );
                    subscription = subscribe( symbol.toLowerCase() + `@depth@100ms`, handleDepthStreamData, reconnect, function () {
                        async.mapLimit( [ symbol ], 1, getSymbolDepthSnapshot, ( err, results ) => {
                            if ( err ) throw err;
                            results.forEach( updateSymbolDepthCache );
                        } );
                    } );
                    assignEndpointIdToContext( symbol, subscription.endpoint );
                }
                return subscription.endpoint;
            },

            /**
             * Clear Websocket depth cache
             * @param {String|Array} symbols   - a single symbol, or an array of symbols, to clear the cache of
             * @returns {void}
             */
            clearDepthCache( symbols ) {
                const symbolsArr = Array.isArray( symbols ) ? symbols : [ symbols ];
                symbolsArr.forEach( thisSymbol => {
                    delete Binance.depthCache[thisSymbol];
                } );
            },

            /**
             * Websocket staggered depth cache
             * @param {array/string} symbols - an array of symbols to query
             * @param {function} callback - callback function
             * @param {int} limit - the number of entries
             * @param {int} stagger - ms between each depth cache
             * @return {Promise} the websocket endpoint
             */
            depthCacheStaggered: function ( symbols, callback, limit = 100, stagger = 200 ) {
                if ( !Array.isArray( symbols ) ) symbols = [ symbols ];
                let chain = null;

                symbols.forEach( symbol => {
                    let promise = () => new Promise( resolve => {
                        this.depthCache( symbol, callback, limit );
                        setTimeout( resolve, stagger );
                    } );
                    chain = chain ? chain.then( promise ) : promise();
                } );

                return chain;
            },

            /**
             * Websocket aggregated trades
             * @param {array/string} symbols - an array or string of symbols to query
             * @param {function} callback - callback function
             * @return {string} the websocket endpoint
             */
            aggTrades: function trades( symbols, callback ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) trades( symbols, callback );
                };
                let subscription;
                if ( Array.isArray( symbols ) ) {
                    if ( !isArrayUnique( symbols ) ) throw Error( 'trades: "symbols" cannot contain duplicate elements.' );
                    let streams = symbols.map( function ( symbol ) {
                        return symbol.toLowerCase() + '@aggTrade';
                    } );
                    subscription = subscribeCombined( streams, callback, reconnect );
                } else {
                    let symbol = symbols;
                    subscription = subscribe( symbol.toLowerCase() + '@aggTrade', callback, reconnect );
                }
                return subscription.endpoint;
            },

            /**
            * Websocket raw trades
            * @param {array/string} symbols - an array or string of symbols to query
            * @param {function} callback - callback function
            * @return {string} the websocket endpoint
            */
            trades: function trades( symbols, callback ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) trades( symbols, callback );
                };

                let subscription;
                if ( Array.isArray( symbols ) ) {
                    if ( !isArrayUnique( symbols ) ) throw Error( 'trades: "symbols" cannot contain duplicate elements.' );
                    let streams = symbols.map( function ( symbol ) {
                        return symbol.toLowerCase() + '@trade';
                    } );
                    subscription = subscribeCombined( streams, callback, reconnect );
                } else {
                    let symbol = symbols;
                    subscription = subscribe( symbol.toLowerCase() + '@trade', callback, reconnect );
                }
                return subscription.endpoint;
            },

            /**
             * Websocket klines
             * @param {array/string} symbols - an array or string of symbols to query
             * @param {string} interval - the time interval
             * @param {function} callback - callback function
             * @param {int} limit - maximum results, no more than 1000
             * @return {string} the websocket endpoint
             */
            chart: function chart( symbols, interval, callback, limit = 500 ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) chart( symbols, interval, callback, limit );
                };

                let symbolChartInit = symbol => {
                    if ( typeof Binance.info[symbol] === 'undefined' ) Binance.info[symbol] = {};
                    if ( typeof Binance.info[symbol][interval] === 'undefined' ) Binance.info[symbol][interval] = {};
                    if ( typeof Binance.ohlc[symbol] === 'undefined' ) Binance.ohlc[symbol] = {};
                    if ( typeof Binance.ohlc[symbol][interval] === 'undefined' ) Binance.ohlc[symbol][interval] = {};
                    if ( typeof Binance.ohlcLatest[symbol] === 'undefined' ) Binance.ohlcLatest[symbol] = {};
                    if ( typeof Binance.ohlcLatest[symbol][interval] === 'undefined' ) Binance.ohlcLatest[symbol][interval] = {};
                    if ( typeof Binance.klineQueue[symbol] === 'undefined' ) Binance.klineQueue[symbol] = {};
                    if ( typeof Binance.klineQueue[symbol][interval] === 'undefined' ) Binance.klineQueue[symbol][interval] = [];
                    Binance.info[symbol][interval].timestamp = 0;
                }

                let handleKlineStreamData = kline => {
                    let symbol = kline.s, interval = kline.k.i;
                    if ( !Binance.info[symbol][interval].timestamp ) {
                        if ( typeof ( Binance.klineQueue[symbol][interval] ) !== 'undefined' && kline !== null ) {
                            Binance.klineQueue[symbol][interval].push( kline );
                        }
                    } else {
                        //Binance.options.log('@klines at ' + kline.k.t);
                        klineHandler( symbol, kline );
                        if ( callback ) callback( symbol, interval, klineConcat( symbol, interval ) );
                    }
                };

                let getSymbolKlineSnapshot = ( symbol, limit = 500 ) => {
                    publicRequest( getSpotUrl() + 'v3/klines', { symbol: symbol, interval: interval, limit: limit }, function ( error, data ) {
                        klineData( symbol, interval, data );
                        //Binance.options.log('/klines at ' + Binance.info[symbol][interval].timestamp);
                        if ( typeof Binance.klineQueue[symbol][interval] !== 'undefined' ) {
                            for ( let kline of Binance.klineQueue[symbol][interval] ) klineHandler( symbol, kline, Binance.info[symbol][interval].timestamp );
                            delete Binance.klineQueue[symbol][interval];
                        }
                        if ( callback ) callback( symbol, interval, klineConcat( symbol, interval ) );
                    } );
                };

                let subscription;
                if ( Array.isArray( symbols ) ) {
                    if ( !isArrayUnique( symbols ) ) throw Error( 'chart: "symbols" cannot contain duplicate elements.' );
                    symbols.forEach( symbolChartInit );
                    let streams = symbols.map( function ( symbol ) {
                        return symbol.toLowerCase() + '@kline_' + interval;
                    } );
                    subscription = subscribeCombined( streams, handleKlineStreamData, reconnect );
                    symbols.forEach( element => getSymbolKlineSnapshot( element, limit ) );
                } else {
                    let symbol = symbols;
                    symbolChartInit( symbol );
                    subscription = subscribe( symbol.toLowerCase() + '@kline_' + interval, handleKlineStreamData, reconnect );
                    getSymbolKlineSnapshot( symbol, limit );
                }
                return subscription.endpoint;
            },

            /**
             * Websocket candle sticks
             * @param {array/string} symbols - an array or string of symbols to query
             * @param {string} interval - the time interval
             * @param {function} callback - callback function
             * @return {string} the websocket endpoint
             */
            candlesticks: function candlesticks( symbols, interval, callback ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) candlesticks( symbols, interval, callback );
                };

                /* If an array of symbols are sent we use a combined stream connection rather.
                 This is transparent to the developer, and results in a single socket connection.
                 This essentially eliminates "unexpected response" errors when subscribing to a lot of data. */
                let subscription;
                if ( Array.isArray( symbols ) ) {
                    if ( !isArrayUnique( symbols ) ) throw Error( 'candlesticks: "symbols" cannot contain duplicate elements.' );
                    let streams = symbols.map( function ( symbol ) {
                        return symbol.toLowerCase() + '@kline_' + interval;
                    } );
                    subscription = subscribeCombined( streams, callback, reconnect );
                } else {
                    let symbol = symbols.toLowerCase();
                    subscription = subscribe( symbol + '@kline_' + interval, callback, reconnect );
                }
                return subscription.endpoint;
            },

            /**
             * Websocket mini ticker
             * @param {function} callback - callback function
             * @return {string} the websocket endpoint
             */
            miniTicker: function miniTicker( callback ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) miniTicker( callback );
                };
                let subscription = subscribe( '!miniTicker@arr', function ( data ) {
                    let markets = {};
                    for ( let obj of data ) {
                        markets[obj.s] = {
                            close: obj.c,
                            open: obj.o,
                            high: obj.h,
                            low: obj.l,
                            volume: obj.v,
                            quoteVolume: obj.q,
                            eventTime: obj.E
                        };
                    }
                    callback( markets );
                }, reconnect );
                return subscription.endpoint;
            },

            /**
             * Spot WebSocket bookTicker (bid/ask quotes including price & amount)
             * @param {symbol} symbol name or false. can also be a callback
             * @param {function} callback - callback function
             * @return {string} the websocket endpoint
             */
            bookTickers: function bookTickerStream( symbol = false, callback = console.log ) {
                if ( typeof symbol == 'function' ) {
                    callback = symbol;
                    symbol = false;
                }
                let reconnect = () => {
                    if ( Binance.options.reconnect ) bookTickerStream( symbol, callback );
                };
                const endpoint = symbol ? `${ symbol.toLowerCase() }@bookTicker` : '!bookTicker'
                let subscription = subscribe( endpoint, data => callback( fBookTickerConvertData( data ) ), reconnect );
                return subscription.endpoint;
            },

            /**
             * Websocket prevday percentage
             * @param {array/string} symbols - an array or string of symbols to query
             * @param {function} callback - callback function
             * @param {boolean} singleCallback - avoid call one callback for each symbol in data array
             * @return {string} the websocket endpoint
             */
            prevDay: function prevDay( symbols, callback, singleCallback ) {
                let reconnect = () => {
                    if ( Binance.options.reconnect ) prevDay( symbols, callback, singleCallback );
                };

                let subscription;
                // Combine stream for array of symbols
                if ( Array.isArray( symbols ) ) {
                    if ( !isArrayUnique( symbols ) ) throw Error( 'prevDay: "symbols" cannot contain duplicate elements.' );
                    let streams = symbols.map( function ( symbol ) {
                        return symbol.toLowerCase() + '@ticker';
                    } );
                    subscription = subscribeCombined( streams, function ( data ) {
                        prevDayStreamHandler( data, callback );
                    }, reconnect );
                    // Raw stream for  a single symbol
                } else if ( symbols ) {
                    let symbol = symbols;
                    subscription = subscribe( symbol.toLowerCase() + '@ticker', function ( data ) {
                        prevDayStreamHandler( data, callback );
                    }, reconnect );
                    // Raw stream of all listed symbols
                } else {
                    subscription = subscribe( '!ticker@arr', function ( data ) {
                        if ( singleCallback ) {
                            prevDayStreamHandler( data, callback );
                        } else {
                            for ( let line of data ) {
                                prevDayStreamHandler( line, callback );
                            }
                        }
                    }, reconnect );
                }
                return subscription.endpoint;
            }
        }
    };
}
module.exports = api;
//https://github.com/binance-exchange/binance-official-api-docs
