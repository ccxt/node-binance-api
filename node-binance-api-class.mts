

import WebSocket from 'ws';
import request from 'request';
import crypto from 'crypto';
import file from 'fs';
import url from 'url';
import JSONbig from 'json-bigint';
import HttpsProxyAgent from 'https-proxy-agent';
import SocksProxyAgent from 'socks-proxy-agent';
import stringHash from 'string-hash';
import async from 'async';


export default class Binance {

    base = 'https://api.binance.com/api/';
    baseTest = 'https://testnet.binance.vision/api/';
    wapi = 'https://api.binance.com/wapi/';
    sapi = 'https://api.binance.com/sapi/';
    fapi = 'https://fapi.binance.com/fapi/';
    dapi = 'https://dapi.binance.com/dapi/';
    fapiTest = 'https://testnet.binancefuture.com/fapi/';
    dapiTest = 'https://testnet.binancefuture.com/dapi/';
    fstream = 'wss://fstream.binance.com/stream?streams=';
    fstreamSingle = 'wss://fstream.binance.com/ws/';
    fstreamSingleTest = 'wss://stream.binancefuture.com/ws/';
    fstreamTest = 'wss://stream.binancefuture.com/stream?streams=';
    dstream = 'wss://dstream.binance.com/stream?streams=';
    dstreamSingle = 'wss://dstream.binance.com/ws/';
    dstreamSingleTest = 'wss://dstream.binancefuture.com/ws/';
    dstreamTest = 'wss://dstream.binancefuture.com/stream?streams=';
    stream = 'wss://stream.binance.com:9443/ws/';
    combineStream = 'wss://stream.binance.com:9443/stream?streams=';


    userAgent = 'Mozilla/4.0 (compatible; Node Binance API)';
    contentType = 'application/x-www-form-urlencoded';
    SPOT_PREFIX = "x-HNA2TXFJ"
    CONTRACT_PREFIX = "x-Cb7ytekJ"


    // Websockets Options
    isAlive = false;
    socketHeartbeatInterval: any = null;
    endpoint: string = ""; // endpoint for WS?
    reconnect = true;


    subscriptions: { [key: string]: any } = {};
    futuresSubscriptions: { [key: string]: any } = {};
    futuresInfo: { [key: string]: any } = {};
    futuresMeta: { [key: string]: any } = {};
    futuresTicks: { [key: string]: any } = {};
    futuresRealtime: { [key: string]: any } = {};
    futuresKlineQueue: { [key: string]: any } = {};
    deliverySubscriptions: { [key: string]: any } = {};
    deliveryInfo: { [key: string]: any } = {};
    deliveryMeta: { [key: string]: any } = {};
    deliveryTicks: { [key: string]: any } = {};
    deliveryRealtime: { [key: string]: any } = {};
    deliveryKlineQueue: { [key: string]: any } = {};
    depthCache: { [key: string]: any } = {};
    depthCacheContext: { [key: string]: any } = {};
    ohlcLatest: { [key: string]: any } = {};
    klineQueue: { [key: string]: any } = {};
    ohlc: { [key: string]: any } = {};
    info: { [key: string]: any } = {};

    default_options = {
        recvWindow: 5000,
        useServerTime: false,
        reconnect: true,
        keepAlive: true,
        verbose: false,
        test: false,
        hedgeMode: false,
        localAddress: false,
        family: 4,
        log(...args) {
            console.log(Array.prototype.slice.call(args));
        }
    };

    options: any = {
    };


    constructor(userOptions = {}) {

        if (userOptions) {
            this.setOptions(userOptions);
        }

    }

    async setOptions(opt = {}, callback: any = false) {
        if (typeof opt === 'string') { // Pass json config filename
            this.options = JSON.parse(file.readFileSync(opt));
        } else this.options = opt;
        if (typeof this.options.recvWindow === 'undefined') this.options.recvWindow = this.default_options.recvWindow;
        if (typeof this.options.useServerTime === 'undefined') this.options.useServerTime = this.default_options.useServerTime;
        if (typeof this.options.reconnect === 'undefined') this.options.reconnect = this.default_options.reconnect;
        if (typeof this.options.test === 'undefined') this.options.test = this.default_options.test;
        if (typeof this.options.hedgeMode === 'undefined') this.options.hedgeMode = this.default_options.hedgeMode;
        if (typeof this.options.log === 'undefined') this.options.log = this.default_options.log;
        if (typeof this.options.verbose === 'undefined') this.options.verbose = this.default_options.verbose;
        if (typeof this.options.keepAlive === 'undefined') this.options.keepAlive = this.default_options.keepAlive;
        if (typeof this.options.localAddress === 'undefined') this.options.localAddress = this.default_options.localAddress;
        if (typeof this.options.family === 'undefined') this.options.family = this.default_options.family;
        if (typeof this.options.urls !== 'undefined') {
            const { urls } = this.options;
            if (typeof urls.base === 'string') this.base = urls.base;
            if (typeof urls.wapi === 'string') this.wapi = urls.wapi;
            if (typeof urls.sapi === 'string') this.sapi = urls.sapi;
            if (typeof urls.fapi === 'string') this.fapi = urls.fapi;
            if (typeof urls.fapiTest === 'string') this.fapiTest = urls.fapiTest;
            if (typeof urls.stream === 'string') this.stream = urls.stream;
            if (typeof urls.combineStream === 'string') this.combineStream = urls.combineStream;
            if (typeof urls.fstream === 'string') this.fstream = urls.fstream;
            if (typeof urls.fstreamSingle === 'string') this.fstreamSingle = urls.fstreamSingle;
            if (typeof urls.fstreamTest === 'string') this.fstreamTest = urls.fstreamTest;
            if (typeof urls.fstreamSingleTest === 'string') this.fstreamSingleTest = urls.fstreamSingleTest;
            if (typeof urls.dstream === 'string') this.dstream = urls.dstream;
            if (typeof urls.dstreamSingle === 'string') this.dstreamSingle = urls.dstreamSingle;
            if (typeof urls.dstreamTest === 'string') this.dstreamTest = urls.dstreamTest;
            if (typeof urls.dstreamSingleTest === 'string') this.dstreamSingleTest = urls.dstreamSingleTest;
        }
        if (this.options.useServerTime) {

            const res = await this.publicRequest(this.getSpotUrl() + 'v3/time');
            this.info.timeOffset = res.serverTime - new Date().getTime();

        }
        return this;
    }



    // ---- HELPER FUNCTIONS ---- //

    getSpotUrl() {
        if (this.options.test) return this.baseTest;
        return this.base;
    }

    uuid22(a?: any) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + 1e3 + 4e3 + 8e5).replace(/[018]/g, uuid22);
    };

    // ------ Request Related Functions ------ //

    /**
     * Replaces socks connection uri hostname with IP address
     * @param {string} connString - socks connection string
     * @return {string} modified string with ip address
     */
    proxyReplacewithIp(connString: string) {
        return connString;
    }

    /**
     * Returns an array in the form of [host, port]
     * @param {string} connString - connection string
     * @return {array} array of host and port
     */
    parseProxy(connString: string) {
        let arr = connString.split('/');
        let host = arr[2].split(':')[0];
        let port = arr[2].split(':')[1];
        return [arr[0], host, port];
    }

    /**
     * Checks to see of the object is iterable
     * @param {object} obj - The object check
     * @return {boolean} true or false is iterable
     */
    isIterable(obj) {
        if (obj === null) return false;
        return typeof obj[Symbol.iterator] === 'function';
    }

    addProxy(opt) {
        if (this.options.proxy) {
            const proxyauth = this.options.proxy.auth ? `${this.options.proxy.auth.username}:${this.options.proxy.auth.password}@` : '';
            opt.proxy = `http://${proxyauth}${this.options.proxy.host}:${this.options.proxy.port}`;
        }
        return opt;
    }


    reqHandler(response) {
        this.info.lastRequest = new Date().getTime();
        if (response) {
            this.info.statusCode = response.status || 0;
            if (response.request) this.info.lastURL = response.request.uri.href;
            if (response.headers) {
                this.info.usedWeight = response.headers['x-mbx-used-weight-1m'] || 0;
                this.info.orderCount1s = response.headers['x-mbx-order-count-1s'] || 0;
                this.info.orderCount1m = response.headers['x-mbx-order-count-1m'] || 0;
                this.info.orderCount1h = response.headers['x-mbx-order-count-1h'] || 0;
                this.info.orderCount1d = response.headers['x-mbx-order-count-1d'] || 0;
            }
        }
        // if ( !cb ) return;
        // if ( error ) return cb( error, {} );
        // if ( response && response.statusCode !== 200 ) return cb( response, {} );
        // return cb( null, JSONbig.parse( body ) );
        if (response && response.status !== 200) {
            throw Error(response);
        }
    }

    async proxyRequest(opt: any) {
        // const req = request(this.addProxy(opt), this.reqHandler(cb)).on('error', (err) => { cb(err, {}) });
        const response = await fetch(opt.url, {
            method: opt.method,
            headers: opt.headers,
            // family: opt.family,
            // timeout: opt.timeout,
            body: JSON.stringify(opt.form)
        })
        this.reqHandler(response);
        const json = await response.json();
        return json;
    }

    reqObj(url: string, data: { [key: string]: any } = {}, method = 'GET', key?: string) {
        return {
            url: url,
            qs: data,
            method: method,
            family: this.options.family,
            localAddress: this.options.localAddress,
            timeout: this.options.recvWindow,
            forever: this.options.keepAlive,
            headers: {
                'User-Agent': this.userAgent,
                'Content-type': this.contentType,
                'X-MBX-APIKEY': key || ''
            }
        }
    }

    reqObjPOST(url: string, data: { [key: string]: any } = {}, method = 'POST', key: string) {
        return {
            url: url,
            form: data,
            method: method,
            family: this.options.family,
            localAddress: this.options.localAddress,
            timeout: this.options.recvWindow,
            forever: this.options.keepAlive,
            qsStringifyOptions: {
                arrayFormat: 'repeat'
            }
            headers: {
                'User-Agent': this.userAgent,
                'Content-type': this.contentType,
                'X-MBX-APIKEY': key || ''
            }
        }
    }


    async publicRequest(url: string, data: { [key: string]: any } = {}, method = 'GET') {
        let opt = this.reqObj(url, data, method);
        const res = await this.proxyRequest(opt);
        return res;
    };

    // used for futures
    async promiseRequest(url: string, data: { [key: string]: any } = {}, flags: { [key: string]: any } = {}) {
        let query = '', headers = {
            'User-Agent': this.userAgent,
            'Content-type': 'application/x-www-form-urlencoded'
        } as { [key: string]: any };
        if (!flags.method) flags.method = 'GET'; // GET POST PUT DELETE
        if (!flags.type) flags.type = false; // TRADE, SIGNED, MARKET_DATA, USER_DATA, USER_STREAM
        else {
            if (!data.recvWindow) data.recvWindow = this.options.recvWindow;
            this.requireApiKey('promiseRequest');
            headers['X-MBX-APIKEY'] = this.options.APIKEY;
        }
        let baseURL = !flags.base ? this.base : flags.base;
        if (this.options.test && baseURL === this.base) baseURL = this.baseTest;
        if (this.options.test && baseURL === this.fapi) baseURL = this.fapiTest;
        if (this.options.test && baseURL === this.dapi) baseURL = this.dapiTest;
        let opt = {
            headers,
            url: baseURL + url,
            method: flags.method,
            timeout: this.options.recvWindow,
            followAllRedirects: true
        };
        if (flags.type === 'SIGNED' || flags.type === 'TRADE' || flags.type === 'USER_DATA') {
            data.timestamp = new Date().getTime() + this.info.timeOffset;
            query = this.makeQueryString(data);
            data.signature = crypto.createHmac('sha256', this.options.APISECRET).update(query).digest('hex'); // HMAC hash header
            opt.url = `${baseURL}${url}?${query}&signature=${data.signature}`;
        }
        opt.qs = data;
        /*if ( flags.method === 'POST' ) {
            opt.form = data;
        } else {
            opt.qs = data;
        }*/
        // try {
        //     request(addProxy(opt), (error, response, body) => {
        //         if (error) return reject(error);
        //         try {
        //             this.info.lastRequest = new Date().getTime();
        //             if (response) {
        //                 this.info.statusCode = response.statusCode || 0;
        //                 if (response.request) this.info.lastURL = response.request.uri.href;
        //                 if (response.headers) {
        //                     this.info.usedWeight = response.headers['x-mbx-used-weight-1m'] || 0;
        //                     this.info.futuresLatency = response.headers['x-response-time'] || 0;
        //                 }
        //             }
        //             if (!error && response.statusCode == 200) return resolve(JSONbig.parse(body));
        //             if (typeof response.body !== 'undefined') {
        //                 return resolve(JSONbig.parse(response.body));
        //             }
        //             return reject(response);
        //         } catch (err) {
        //             return reject(`promiseRequest error #${response.statusCode}`);
        //         }
        //     }).on('error', reject);
        // } catch (err) {
        //     return reject(err);
        // }
        const response = await this.proxyRequest(opt);
        return response;

    };

    // ------ Request Related Functions ------ //


    // XXX: This one works with array (e.g. for dust.transfer)
    // XXX: I _guess_ we could use replace this function with the `qs` module
    makeQueryString(q) {

        const res = Object.keys(q)
            .reduce((a, k) => {
                if (Array.isArray(q[k])) {
                    q[k].forEach(v => {
                        a.push(k + "=" + encodeURIComponent(v))
                    })
                } else if (q[k] !== undefined) {
                    a.push(k + "=" + encodeURIComponent(q[k]));
                }
                return a;
            }, [])
            .join("&");
        return res;
    }

    /**
     * Create a http request to the public API
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @return {undefined}
     */
    async apiRequest(url: string, data: { [key: string]: any } = {}, method = 'GET') {
        this.requireApiKey('apiRequest');
        let opt = this.reqObj(
            url,
            data,
            method,
            this.options.APIKEY
        );
        const res = await this.proxyRequest(opt);
        return res;
    };


    requireApiKey(source = 'requireApiKey', fatalError = true) {
        if (!this.options.APIKEY) {
            if (fatalError) throw Error(`${source}: Invalid API Key!`);
            return false;
        }
        return true;
    }


    // Check if API secret is present
    requireApiSecret(source = 'requireApiSecret', fatalError = true) {
        if (!this.options.APIKEY) {
            if (fatalError) throw Error(`${source}: Invalid API Key!`);
            return false;
        }
        if (!this.options.APISECRET) {
            if (fatalError) throw Error(`${source}: Invalid API Secret!`);
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
    async marketRequest(url: string, data: { [key: string]: any } = {}, method = 'GET') {
        this.requireApiKey('marketRequest');
        let query = this.makeQueryString(data);
        let opt = this.reqObj(
            url + (query ? '?' + query : ''),
            data,
            method,
            this.options.APIKEY
        );
        const res = await this.proxyRequest(opt);
        return res;
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
    async signedRequest(url: string, data: { [key: string]: any } = {}, method = 'GET', noDataInSignature = false) {
        this.requireApiSecret('signedRequest');
        data.timestamp = new Date().getTime() + this.info.timeOffset;
        if (!data.recvWindow) data.recvWindow = this.options.recvWindow;
        let query = method === 'POST' && noDataInSignature ? '' : this.makeQueryString(data);
        let signature = crypto.createHmac('sha256', this.options.APISECRET).update(query).digest('hex'); // set the HMAC hash header
        if (method === 'POST') {
            let opt = this.reqObjPOST(
                url,
                data,
                method,
                this.options.APIKEY
            );
            opt.form.signature = signature;
            const reqPost = await this.proxyRequest(opt);
            return reqPost
        } else {
            let opt = this.reqObj(
                url + '?' + query + '&signature=' + signature,
                data,
                method,
                this.options.APIKEY
            );
            const reqGet = await this.proxyRequest(opt);
            return reqGet
        }
    };

    // --- ENDPOINTS --- //


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
    async order(side: string, symbol: string, quantity: number, price?: number, flags: { [key: string]: any } = {}) {
        let endpoint = flags.type === 'OCO' ? 'v3/orderList/oco' : 'v3/order';
        if (typeof flags.test && flags.test) endpoint += '/test';
        let opt = {
            symbol: symbol,
            side: side,
            type: 'LIMIT'
        } as { [key: string]: any };
        if (typeof flags.quoteOrderQty !== undefined && flags.quoteOrderQty > 0)
            opt.quoteOrderQty = flags.quoteOrderQty
        else
            opt.quantity = quantity
        if (typeof flags.type !== 'undefined') opt.type = flags.type;
        if (opt.type.includes('LIMIT')) {
            opt.price = price;
            if (opt.type !== 'LIMIT_MAKER') {
                opt.timeInForce = 'GTC';
            }
        }
        if (opt.type == 'MARKET' && typeof flags.quoteOrderQty !== 'undefined') {
            opt.quoteOrderQty = flags.quoteOrderQty
            delete opt.quantity;
        }
        if (opt.type === 'OCO') {
            opt.price = price;
            opt.stopLimitPrice = flags.stopLimitPrice;
            opt.stopLimitTimeInForce = 'GTC';
            delete opt.type;
            if (typeof flags.listClientOrderId !== 'undefined') opt.listClientOrderId = flags.listClientOrderId;
            if (typeof flags.limitClientOrderId !== 'undefined') opt.limitClientOrderId = flags.limitClientOrderId;
            if (typeof flags.stopClientOrderId !== 'undefined') opt.stopClientOrderId = flags.stopClientOrderId;
        }
        if (typeof flags.timeInForce !== 'undefined') opt.timeInForce = flags.timeInForce;
        if (typeof flags.newOrderRespType !== 'undefined') opt.newOrderRespType = flags.newOrderRespType;
        if (typeof flags.newClientOrderId !== 'undefined') {
            opt.newClientOrderId = flags.newClientOrderId;
        } else {
            opt.newClientOrderId = this.SPOT_PREFIX + this.uuid22();
        }

        /*
         * STOP_LOSS
         * STOP_LOSS_LIMIT
         * TAKE_PROFIT
         * TAKE_PROFIT_LIMIT
         * LIMIT_MAKER
         */
        if (typeof flags.icebergQty !== 'undefined') opt.icebergQty = flags.icebergQty;
        if (typeof flags.stopPrice !== 'undefined') {
            opt.stopPrice = flags.stopPrice;
            if (opt.type === 'LIMIT') throw Error('stopPrice: Must set "type" to one of the following: STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT');
        }
        const response = await this.signedRequest(this.getSpotUrl() + endpoint, opt, 'POST');
        // to do error handling
        // if ( !response ) {
        //     if ( callback ) callback( error, response );
        //     else this.options.log( 'Order() error:', error );
        //     return;
        // }
        // if ( typeof response.msg !== 'undefined' && response.msg === 'Filter failure: MIN_NOTIONAL' ) {
        //     this.options.log( 'Order quantity too small. See exchangeInfo() for minimum amounts' );
        // }
        // if ( callback ) callback( error, response );
        // else this.options.log( side + '(' + symbol + ',' + quantity + ',' + price + ') ', response );
        return response
    };

    /**
    * Creates a buy order
    * @param {string} symbol - the symbol to buy
    * @param {numeric} quantity - the quantity required
    * @param {numeric} price - the price to pay for each unit
    * @param {object} flags - additional buy order flags
    * @param {function} callback - the callback function
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async buy(symbol: string, quantity: number, price: number, flags = {}) {
        return await this.order('BUY', symbol, quantity, price, flags);
    }

    /**
* Creates a sell order
* @param {string} symbol - the symbol to sell
* @param {numeric} quantity - the quantity required
* @param {numeric} price - the price to pay for each unit
* @param {object} flags - additional buy order flags
* @param {function} callback - the callback function
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async sell(symbol: string, quantity: number, price: number, flags = {}) {
        return await this.order('SELL', symbol, quantity, price, flags);
    }


    /**
* Creates a market buy order
* @param {string} symbol - the symbol to buy
* @param {numeric} quantity - the quantity required
* @param {object} flags - additional buy order flags
* @param {function} callback - the callback function
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async marketBuy(symbol: string, quantity: number, flags = { type: 'MARKET' }) {
        if (typeof flags.type === 'undefined') flags.type = 'MARKET';
        return await this.order('BUY', symbol, quantity, 0, flags);
    }

    /**
    * Creates a market sell order
    * @param {string} symbol - the symbol to sell
    * @param {numeric} quantity - the quantity required
    * @param {object} flags - additional buy order flags
    * @param {function} callback - the callback function
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async marketSell(symbol: string, quantity: number, flags = { type: 'MARKET' }) {
        if (typeof flags.type === 'undefined') flags.type = 'MARKET';
        return await this.order('SELL', symbol, quantity, 0, flags);
    }



    /**
    * Cancels an order
    * @param {string} symbol - the symbol to cancel
    * @param {string} orderid - the orderid to cancel
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async cancel(symbol: string, orderid: string) {
        return await this.signedRequest(this.getSpotUrl() + 'v3/order', { symbol: symbol, orderId: orderid }, 'DELETE');
    }


    /**
* Gets the status of an order
* @param {string} symbol - the symbol to check
* @param {string} orderid - the orderid to check if !orderid then  use flags to search
* @param {object} flags - any additional flags
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async orderStatus(symbol: string, orderid?: string, flags = {}) {
        let parameters = Object.assign({ symbol: symbol }, flags);
        if (orderid) {
            parameters = Object.assign({ orderId: orderid }, parameters)
        }
        return await this.signedRequest(this.getSpotUrl() + 'v3/order', parameters);
    }

    /**
* Gets open orders
* @param {string} symbol - the symbol to get
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async openOrders(symbol: string) {
        let parameters = symbol ? { symbol: symbol } : {};
        return await this.signedRequest(this.getSpotUrl() + 'v3/openOrders', parameters,);
    }

    /**
    * Cancels all orders of a given symbol
    * @param {string} symbol - the symbol to cancel all orders for
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async cancelAll(symbol: string) {
        return await this.signedRequest(this.getSpotUrl() + 'v3/openOrders', { symbol }, 'DELETE');
    }



    /**
    * Cancels all orders of a given symbol
    * @param {string} symbol - the symbol to cancel all orders for
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async cancelOrders(symbol: string) {

        const json = await this.signedRequest(this.getSpotUrl() + 'v3/openOrders', { symbol: symbol }, 'DELETE');


        // if (json.length === 0) {
        //     return callback.call(this, 'No orders present for this symbol', {}, symbol);
        // }
        // if (Object.keys(json).length === 0) {
        //     return callback.call(this, 'No orders present for this symbol', {}, symbol);
        // }
        // for (let obj of json) {
        //     let quantity = obj.origQty - obj.executedQty;
        //     this.options.log('cancel order: ' + obj.side + ' ' + symbol + ' ' + quantity + ' @ ' + obj.price + ' #' + obj.orderId);
        //     signedRequest(this.getSpotUrl() + 'v3/order', { symbol: symbol, orderId: obj.orderId }, function (error, data) {
        //         return callback.call(this, error, data, symbol);
        //     }, 'DELETE');
        // }
        return json; // to do: check this logic of cancelling remaining orders manually

    }

    /**
    * Gets all order of a given symbol
    * @param {string} symbol - the symbol
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async allOrders(symbol: string, options = {}) {
        let parameters = Object.assign({ symbol }, options);
        return await this.signedRequest(this.getSpotUrl() + 'v3/allOrders', parameters);
    }


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
    async marginOrder(side: string, symbol: string, quantity: number, price?: number, flags: { [key: string]: any } = {}) {
        let endpoint = 'v1/margin/order';
        if (this.options.test) endpoint += '/test';
        let opt = {
            symbol: symbol,
            side: side,
            type: 'LIMIT',
            quantity: quantity
        } as { [key: string]: any };
        if (typeof flags.type !== 'undefined') opt.type = flags.type;
        if (typeof flags.isIsolated !== 'undefined') opt.isIsolated = flags.isIsolated;
        if (opt.type.includes('LIMIT')) {
            opt.price = price;
            if (opt.type !== 'LIMIT_MAKER') {
                opt.timeInForce = 'GTC';
            }
        }

        if (typeof flags.timeInForce !== 'undefined') opt.timeInForce = flags.timeInForce;
        if (typeof flags.newOrderRespType !== 'undefined') opt.newOrderRespType = flags.newOrderRespType;
        // if ( typeof flags.newClientOrderId !== 'undefined' ) opt.newClientOrderId = flags.newClientOrderId;
        if (typeof flags.newClientOrderId !== 'undefined') {
            opt.newClientOrderId = flags.newClientOrderId;
        } else {
            opt.newClientOrderId = this.SPOT_PREFIX + this.uuid22();
        }
        if (typeof flags.sideEffectType !== 'undefined') opt.sideEffectType = flags.sideEffectType;

        /*
         * STOP_LOSS
         * STOP_LOSS_LIMIT
         * TAKE_PROFIT
         * TAKE_PROFIT_LIMIT
         */
        if (typeof flags.icebergQty !== 'undefined') opt.icebergQty = flags.icebergQty;
        if (typeof flags.stopPrice !== 'undefined') {
            opt.stopPrice = flags.stopPrice;
            if (opt.type === 'LIMIT') throw Error('stopPrice: Must set "type" to one of the following: STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT');
        }
        return await this.signedRequest(this.sapi + endpoint, opt, 'POST');
    };


    // Futures internal functions
    async futuresOrder(side: string, symbol: string, quantity: number, price = false, params: { [key: string]: any } = {}) {
        params.symbol = symbol;
        params.side = side;
        if (quantity) params.quantity = quantity;
        // if in the binance futures setting Hedged mode is active, positionSide parameter is mandatory
        if (!params.positionSide && this.options.hedgeMode) {
            params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT';
        }
        // LIMIT STOP MARKET STOP_MARKET TAKE_PROFIT TAKE_PROFIT_MARKET
        // reduceOnly stopPrice
        if (price) {
            params.price = price;
            if (!params.type) params.type = 'LIMIT';
        } else {
            if (!params.type) params.type = 'MARKET';
        }
        if (!params.timeInForce && (params.type.includes('LIMIT') || params.type === 'STOP' || params.type === 'TAKE_PROFIT')) {
            params.timeInForce = 'GTX'; // Post only by default. Use GTC for limit orders.
        }

        if (!params.newClientOrderId) {
            params.newClientOrderId = this.CONTRACT_PREFIX + this.uuid22();
        }
        return await this.promiseRequest('v1/order', params, { base: this.fapi, type: 'TRADE', method: 'POST' });
    };


    async deliveryOrder(side: string, symbol: string, quantity: number, price = false, params: { [key: string]: any } = {}) {
        params.symbol = symbol;
        params.side = side;
        params.quantity = quantity;
        // if in the binance futures setting Hedged mode is active, positionSide parameter is mandatory
        if (this.options.hedgeMode) {
            params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT';
        }
        // LIMIT STOP MARKET STOP_MARKET TAKE_PROFIT TAKE_PROFIT_MARKET
        // reduceOnly stopPrice
        if (price) {
            params.price = price;
            if (!params.type) params.type = 'LIMIT';
        } else {
            if (!params.type) params.type = 'MARKET';
        }
        if (!params.timeInForce && (params.type.includes('LIMIT') || params.type === 'STOP' || params.type === 'TAKE_PROFIT')) {
            params.timeInForce = 'GTX'; // Post only by default. Use GTC for limit orders.
        }

        if (!params.newClientOrderId) {
            params.newClientOrderId = this.CONTRACT_PREFIX + this.uuid22();
        }
        return await this.promiseRequest('v1/order', params, { base: this.dapi, type: 'TRADE', method: 'POST' });
    };

    // ------ WS RELATED FUNCTIONS ------ //

    noop() {
        return;
    }

    /**
     * Reworked Tuitio's heartbeat code into a shared single interval tick
     * @return {undefined}
     */
    socketHeartbeat() {
        /* Sockets removed from `subscriptions` during a manual terminate()
         will no longer be at risk of having functions called on them */
        for (let endpointId in this.subscriptions) {
            const ws = this.subscriptions[endpointId];
            if (ws.isAlive) {
                ws.isAlive = false;
                if (ws.readyState === WebSocket.OPEN) ws.ping(this.noop);
            } else {
                if (this.options.verbose) this.options.log('Terminating inactive/broken WebSocket: ' + ws.endpoint);
                if (ws.readyState === WebSocket.OPEN) ws.terminate();
            }
        }
    };

    /**
     * Called when socket is opened, subscriptions are registered for later reference
     * @param {function} opened_callback - a callback function
     * @return {undefined}
     */
    handleSocketOpen(opened_callback) {
        this.isAlive = true;
        if (Object.keys(this.subscriptions).length === 0) {
            this.socketHeartbeatInterval = setInterval(this.socketHeartbeat, 30000);
        }
        this.subscriptions[this.endpoint] = this;
        if (typeof opened_callback === 'function') opened_callback(this.endpoint);
    };


    /**
     * Called when socket is closed, subscriptions are de-registered for later reference
     * @param {boolean} reconnect - true or false to reconnect the socket
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    handleSocketClose(reconnect: boolean, code, reason: string) {
        delete this.subscriptions[this.endpoint];
        if (this.subscriptions && Object.keys(this.subscriptions).length === 0) {
            clearInterval(this.socketHeartbeatInterval);
        }
        this.options.log('WebSocket closed: ' + this.endpoint +
            (code ? ' (' + code + ')' : '') +
            (reason ? ' ' + reason : ''));
        if (this.options.reconnect && this.reconnect && reconnect) {
            if (this.endpoint && parseInt(this.endpoint.length, 10) === 60) this.options.log('Account data WebSocket reconnecting...');
            else this.options.log('WebSocket reconnecting: ' + this.endpoint + '...');
            try {
                this.reconnect();
            } catch (error) {
                this.options.log('WebSocket reconnect error: ' + error.message);
            }
        }
    };


    /**
 * Called when socket errors
 * @param {object} error - error object message
 * @return {undefined}
 */
    handleSocketError(error) {
        /* Errors ultimately result in a `close` event.
         see: https://github.com/websockets/ws/blob/828194044bf247af852b31c49e2800d557fedeff/lib/websocket.js#L126 */
        this.options.log('WebSocket error: ' + this.endpoint +
            (error.code ? ' (' + error.code + ')' : '') +
            (error.message ? ' ' + error.message : ''));
    };

    /**
     * Called on each socket heartbeat
     * @return {undefined}
     */
    handleSocketHeartbeat() {
        this.isAlive = true;
    };

    // ----- WS ENDPOINTS ----- //

    /**
    * Get Binance server time
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async time() {
        const res = await this.publicRequest(this.getSpotUrl() + 'v3/time', {});
        return res;
    }



    /**
     * Used to subscribe to a single websocket endpoint
     * @param {string} endpoint - endpoint to connect to
     * @param {function} callback - the function to call when information is received
     * @param {boolean} reconnect - whether to reconnect on disconnect
     * @param {object} opened_callback - the function to call when opened
     * @return {WebSocket} - websocket reference
     */
    subscribe(endpoint: string, callback, reconnect = false, opened_callback = false) {
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        let ws: WebSocket = undefined;

        if (socksproxy !== false) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.options.verbose) this.options.log('using socks proxy server ' + socksproxy);
            let agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket(this.stream + endpoint, { agent: agent });
        } else if (httpsproxy !== false) {
            let config = url.parse(httpsproxy);
            let agent = new HttpsProxyAgent(config);
            if (this.options.verbose) this.options.log('using proxy server ' + agent);
            ws = new WebSocket(this.stream + endpoint, { agent: agent });
        } else {
            ws = new WebSocket(this.stream + endpoint);
        }

        if (this.options.verbose) this.options.log('Subscribed to ' + endpoint);
        ws.reconnect = this.options.reconnect;
        ws.endpoint = endpoint;
        ws.isAlive = false;
        ws.on('open', handleSocketOpen.bind(ws, opened_callback));
        ws.on('pong', handleSocketHeartbeat);
        ws.on('error', handleSocketError);
        ws.on('close', handleSocketClose.bind(ws, reconnect));
        ws.on('message', data => {
            try {
                callback(JSON.parse(data));
            } catch (error) {
                this.options.log('Parse error: ' + error.message);
            }
        });
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
    subscribeCombined(streams, callback, reconnect = false, opened_callback = false) {
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        const queryParams = streams.join('/');
        let ws = false;
        if (socksproxy !== false) {
            socksproxy = proxyReplacewithIp(socksproxy);
            if (this.options.verbose) this.options.log('using socks proxy server ' + socksproxy);
            let agent = new SocksProxyAgent({
                protocol: parseProxy(socksproxy)[0],
                host: parseProxy(socksproxy)[1],
                port: parseProxy(socksproxy)[2]
            });
            ws = new WebSocket(combineStream + queryParams, { agent: agent });
        } else if (httpsproxy !== false) {
            if (this.options.verbose) this.options.log('using proxy server ' + httpsproxy);
            let config = url.parse(httpsproxy);
            let agent = new HttpsProxyAgent(config);
            ws = new WebSocket(combineStream + queryParams, { agent: agent });
        } else {
            ws = new WebSocket(combineStream + queryParams);
        }

        ws.reconnect = this.options.reconnect;
        ws.endpoint = stringHash(queryParams);
        ws.isAlive = false;
        if (this.options.verbose) {
            this.options.log('CombinedStream: Subscribed to [' + ws.endpoint + '] ' + queryParams);
        }
        ws.on('open', handleSocketOpen.bind(ws, opened_callback));
        ws.on('pong', handleSocketHeartbeat);
        ws.on('error', handleSocketError);
        ws.on('close', handleSocketClose.bind(ws, reconnect));
        ws.on('message', data => {
            try {
                callback(JSON.parse(data).data);
            } catch (error) {
                this.options.log('CombinedStream: Parse error: ' + error.message);
            }
        });
        return ws;
    };

    /**
     * Used to terminate a web socket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    terminate(endpoint: string, reconnect = false) {
        if (this.options.verbose) this.options.log('WebSocket terminating:', endpoint);
        let ws = this.subscriptions[endpoint];
        if (!ws) return;
        ws.removeAllListeners('message');
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
        for (let endpointId in this.futuresSubscriptions) {
            const ws = this.futuresSubscriptions[endpointId];
            if (ws.isAlive) {
                ws.isAlive = false;
                if (ws.readyState === WebSocket.OPEN) ws.ping(noop);
            } else {
                if (this.options.verbose) this.options.log(`Terminating zombie futures WebSocket: ${ws.endpoint}`);
                if (ws.readyState === WebSocket.OPEN) ws.terminate();
            }
        }
    };

    /**
     * Called when a futures socket is opened, subscriptions are registered for later reference
     * @param {function} openCallback - a callback function
     * @return {undefined}
     */
    handleFuturesSocketOpen(openCallback) {
        this.isAlive = true;
        if (Object.keys(this.futuresSubscriptions).length === 0) {
            this.socketHeartbeatInterval = setInterval(futuresSocketHeartbeat, 30000);
        }
        this.futuresSubscriptions[this.endpoint] = this;
        if (typeof openCallback === 'function') openCallback(this.endpoint);
    };

    /**
     * Called when futures websocket is closed, subscriptions are de-registered for later reference
     * @param {boolean} reconnect - true or false to reconnect the socket
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    handleFuturesSocketClose(reconnect, code, reason) {
        delete this.futuresSubscriptions[this.endpoint];
        if (this.futuresSubscriptions && Object.keys(this.futuresSubscriptions).length === 0) {
            clearInterval(this.socketHeartbeatInterval);
        }
        this.options.log('Futures WebSocket closed: ' + this.endpoint +
            (code ? ' (' + code + ')' : '') +
            (reason ? ' ' + reason : ''));
        if (this.options.reconnect && this.reconnect && reconnect) {
            if (this.endpoint && parseInt(this.endpoint.length, 10) === 60) this.options.log('Futures account data WebSocket reconnecting...');
            else this.options.log('Futures WebSocket reconnecting: ' + this.endpoint + '...');
            try {
                reconnect();
            } catch (error) {
                this.options.log('Futures WebSocket reconnect error: ' + error.message);
            }
        }
    };

    /**
     * Called when a futures websocket errors
     * @param {object} error - error object message
     * @return {undefined}
     */
    handleFuturesSocketError(error) {
        this.options.log('Futures WebSocket error: ' + this.endpoint +
            (error.code ? ' (' + error.code + ')' : '') +
            (error.message ? ' ' + error.message : ''));
    };

    /**
     * Called on each futures socket heartbeat
     * @return {undefined}
     */
    handleFuturesSocketHeartbeat() {
        this.isAlive = true;
    };

    /**
     * Used to subscribe to a single futures websocket endpoint
     * @param {string} endpoint - endpoint to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    futuresSubscribeSingle(endpoint: string, callback, params = {}) {
        if (typeof params === 'boolean') params = { reconnect: params };
        if (!params.reconnect) params.reconnect = false;
        if (!params.openCallback) params.openCallback = false;
        if (!params.id) params.id = false;
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        let ws = false;

        if (socksproxy !== false) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.options.verbose) this.options.log(`futuresSubscribeSingle: using socks proxy server: ${socksproxy}`);
            let agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket((this.options.test ? this.fstreamSingleTest : this.fstreamSingle) + endpoint, { agent });
        } else if (httpsproxy !== false) {
            let config = url.parse(httpsproxy);
            let agent = new HttpsProxyAgent(config);
            if (this.options.verbose) this.options.log(`futuresSubscribeSingle: using proxy server: ${agent}`);
            ws = new WebSocket((this.options.test ? this.fstreamSingleTest : this.fstreamSingle) + endpoint, { agent });
        } else {
            ws = new WebSocket((this.options.test ? this.fstreamSingleTest : this.fstreamSingle) + endpoint);
        }

        if (this.options.verbose) this.options.log('futuresSubscribeSingle: Subscribed to ' + endpoint);
        ws.reconnect = this.options.reconnect;
        ws.endpoint = endpoint;
        ws.isAlive = false;
        ws.on('open', handleFuturesSocketOpen.bind(ws, params.openCallback));
        ws.on('pong', handleFuturesSocketHeartbeat);
        ws.on('error', handleFuturesSocketError);
        ws.on('close', handleFuturesSocketClose.bind(ws, params.reconnect));
        ws.on('message', data => {
            try {
                callback(JSONbig.parse(data));
            } catch (error) {
                this.options.log('Parse error: ' + error.message);
            }
        });
        return ws;
    };

    /**
     * Used to subscribe to a combined futures websocket endpoint
     * @param {string} streams - streams to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    futuresSubscribe(streams, callback, params = {}) {
        if (typeof streams === 'string') return this.futuresSubscribeSingle(streams, callback, params);
        if (typeof params === 'boolean') params = { reconnect: params };
        if (!params.reconnect) params.reconnect = false;
        if (!params.openCallback) params.openCallback = false;
        if (!params.id) params.id = false;
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        const queryParams = streams.join('/');
        let ws = false;
        if (socksproxy !== false) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.options.verbose) this.options.log(`futuresSubscribe: using socks proxy server ${socksproxy}`);
            let agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket((this.options.test ? this.fstreamTest : this.fstream) + queryParams, { agent });
        } else if (httpsproxy !== false) {
            if (this.options.verbose) this.options.log(`futuresSubscribe: using proxy server ${httpsproxy}`);
            let config = url.parse(httpsproxy);
            let agent = new HttpsProxyAgent(config);
            ws = new WebSocket((this.options.test ? this.fstreamTest : this.fstream) + queryParams, { agent });
        } else {
            ws = new WebSocket((this.options.test ? this.fstreamTest : this.fstream) + queryParams);
        }

        ws.reconnect = this.options.reconnect;
        ws.endpoint = stringHash(queryParams);
        ws.isAlive = false;
        if (this.options.verbose) {
            this.options.log(`futuresSubscribe: Subscribed to [${ws.endpoint}] ${queryParams}`);
        }
        ws.on('open', handleFuturesSocketOpen.bind(ws, params.openCallback));
        ws.on('pong', handleFuturesSocketHeartbeat);
        ws.on('error', handleFuturesSocketError);
        ws.on('close', handleFuturesSocketClose.bind(ws, params.reconnect));
        ws.on('message', data => {
            try {
                callback(JSON.parse(data).data);
            } catch (error) {
                this.options.log(`futuresSubscribe: Parse error: ${error.message}`);
            }
        });
        return ws;
    };

    /**
     * Used to terminate a futures websocket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    futuresTerminate(endpoint: string, reconnect = false) {
        if (this.options.verbose) this.options.log('Futures WebSocket terminating:', endpoint);
        let ws = this.futuresSubscriptions[endpoint];
        if (!ws) return;
        ws.removeAllListeners('message');
        ws.reconnect = reconnect;
        ws.terminate();
    }

    /**
     * Combines all futures OHLC data with the latest update
     * @param {string} symbol - the symbol
     * @param {string} interval - time interval
     * @return {array} - interval data for given symbol
     */
    futuresKlineConcat(symbol: string, interval: string) {
        let output = this.futuresTicks[symbol][interval];
        if (typeof this.futuresRealtime[symbol][interval].time === 'undefined') return output;
        const time = this.futuresRealtime[symbol][interval].time;
        const last_updated = Object.keys(this.futuresTicks[symbol][interval]).pop();
        if (time >= last_updated) {
            output[time] = this.futuresRealtime[symbol][interval];
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
    futuresKlineHandler(symbol: string, kline: string, firstTime = 0) {
        // eslint-disable-next-line no-unused-vars
        let { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        let { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, V: takerBuyBaseVolume, Q: takerBuyQuoteVolume, n: trades, t: time, T: closeTime } = ticks;
        if (time <= firstTime) return;
        if (!isFinal) {
            // if ( typeof this.futuresRealtime[symbol][interval].time !== 'undefined' ) {
            //     if ( this.futuresRealtime[symbol][interval].time > time ) return;
            // }
            this.futuresRealtime[symbol][interval] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades, isFinal };
            return;
        }
        const first_updated = Object.keys(this.futuresTicks[symbol][interval]).shift();
        if (first_updated) delete this.futuresTicks[symbol][interval][first_updated];
        this.futuresTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades, isFinal: false };
    };

    /**
     * Converts the futures liquidation stream data into a friendly object
     * @param {object} data - liquidation data callback data type
     * @return {object} - user friendly data type
     */
    fLiquidationConvertData(data) {
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
    fTickerConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                result.push(friendlyData(obj));
            }
            return result;
        }
        return friendlyData(data);
    }

    /**
     * Converts the futures miniTicker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    fMiniTickerConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                result.push(friendlyData(obj));
            }
            return result;
        }
        return friendlyData(data);
    }

    /**
     * Converts the futures bookTicker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    fBookTickerConvertData(data) {
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
    fUserDataMarginConvertData(data) {
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
        for (let position of positions) {
            convertedPositions.push(positionConverter(position));
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
    fUserConfigDataAccountUpdateConvertData(data) {
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
    fUserDataAccountUpdateConvertData(data) {
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

            for (let balance of balances) {
                balanceResult.push(balanceConverter(balance));
            }
            for (let position of positions) {
                positionResult.push(positionConverter(position));
            }

            balances = balanceResult;
            positions = positionResult;
            return {
                eventReasonType,
                balances,
                positions
            };
        };
        updateData = updateConverter(updateData);
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
    fUserDataOrderUpdateConvertData(data) {
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
        order = orderConverter(order);
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
    fMarkPriceConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                result.push(friendlyData(obj));
            }
            return result;
        }
        return friendlyData(data);
    }

    /**
     * Converts the futures aggTrade stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    fAggTradeConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                result.push(friendlyData(obj));
            }
            return result;
        }
        return friendlyData(data);
    }

    /**
     * Delivery heartbeat code with a shared single interval tick
     * @return {undefined}
     */
    const deliverySocketHeartbeat = () => {
        /* Sockets removed from subscriptions during a manual terminate()
         will no longer be at risk of having functions called on them */
        for (let endpointId in this.deliverySubscriptions) {
            const ws = this.deliverySubscriptions[endpointId];
            if (ws.isAlive) {
                ws.isAlive = false;
                if (ws.readyState === WebSocket.OPEN) ws.ping(noop);
            } else {
                if (this.options.verbose) this.options.log(`Terminating zombie delivery WebSocket: ${ws.endpoint}`);
                if (ws.readyState === WebSocket.OPEN) ws.terminate();
            }
        }
    };

    /**
     * Called when a delivery socket is opened, subscriptions are registered for later reference
     * @param {function} openCallback - a callback function
     * @return {undefined}
     */
    handleDeliverySocketOpen(openCallback) {
        this.isAlive = true;
        if (Object.keys(this.deliverySubscriptions).length === 0) {
            this.socketHeartbeatInterval = setInterval(deliverySocketHeartbeat, 30000);
        }
        this.deliverySubscriptions[this.endpoint] = this;
        if (typeof openCallback === 'function') openCallback(this.endpoint);
    };

    /**
     * Called when delivery websocket is closed, subscriptions are de-registered for later reference
     * @param {boolean} reconnect - true or false to reconnect the socket
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    handleDeliverySocketClose(reconnect, code, reason) {
        delete this.deliverySubscriptions[this.endpoint];
        if (this.deliverySubscriptions && Object.keys(this.deliverySubscriptions).length === 0) {
            clearInterval(this.socketHeartbeatInterval);
        }
        this.options.log('Delivery WebSocket closed: ' + this.endpoint +
            (code ? ' (' + code + ')' : '') +
            (reason ? ' ' + reason : ''));
        if (this.options.reconnect && this.reconnect && reconnect) {
            if (this.endpoint && parseInt(this.endpoint.length, 10) === 60) this.options.log('Delivery account data WebSocket reconnecting...');
            else this.options.log('Delivery WebSocket reconnecting: ' + this.endpoint + '...');
            try {
                reconnect();
            } catch (error) {
                this.options.log('Delivery WebSocket reconnect error: ' + error.message);
            }
        }
    };

    /**
     * Called when a delivery websocket errors
     * @param {object} error - error object message
     * @return {undefined}
     */
    handleDeliverySocketError(error) {
        this.options.log('Delivery WebSocket error: ' + this.endpoint +
            (error.code ? ' (' + error.code + ')' : '') +
            (error.message ? ' ' + error.message : ''));
    };

    /**
     * Called on each delivery socket heartbeat
     * @return {undefined}
     */
    handleDeliverySocketHeartbeat() {
        this.isAlive = true;
    };

    /**
     * Used to subscribe to a single delivery websocket endpoint
     * @param {string} endpoint - endpoint to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    deliverySubscribeSingle(endpoint: string, callback, params = {}) {
        if (typeof params === 'boolean') params = { reconnect: params };
        if (!params.reconnect) params.reconnect = false;
        if (!params.openCallback) params.openCallback = false;
        if (!params.id) params.id = false;
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        let ws = false;
        if (socksproxy !== false) {
            socksproxy = proxyReplacewithIp(socksproxy);
            if (this.options.verbose) this.options.log(`deliverySubscribeSingle: using socks proxy server: ${socksproxy}`);
            let agent = new SocksProxyAgent({
                protocol: parseProxy(socksproxy)[0],
                host: parseProxy(socksproxy)[1],
                port: parseProxy(socksproxy)[2]
            });
            ws = new WebSocket((this.options.test ? dstreamSingleTest : dstreamSingle) + endpoint, { agent });
        } else if (httpsproxy !== false) {
            let config = url.parse(httpsproxy);
            let agent = new HttpsProxyAgent(config);
            if (this.options.verbose) this.options.log(`deliverySubscribeSingle: using proxy server: ${agent}`);
            ws = new WebSocket((this.options.test ? dstreamSingleTest : dstreamSingle) + endpoint, { agent });
        } else {
            ws = new WebSocket((this.options.test ? dstreamSingleTest : dstreamSingle) + endpoint);
        }

        if (this.options.verbose) this.options.log('deliverySubscribeSingle: Subscribed to ' + endpoint);
        ws.reconnect = this.options.reconnect;
        ws.endpoint = endpoint;
        ws.isAlive = false;
        ws.on('open', handleDeliverySocketOpen.bind(ws, params.openCallback));
        ws.on('pong', handleDeliverySocketHeartbeat);
        ws.on('error', handleDeliverySocketError);
        ws.on('close', handleDeliverySocketClose.bind(ws, params.reconnect));
        ws.on('message', data => {
            try {
                callback(JSON.parse(data));
            } catch (error) {
                this.options.log('Parse error: ' + error.message);
            }
        });
        return ws;
    };

    /**
     * Used to subscribe to a combined delivery websocket endpoint
     * @param {string} streams - streams to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    deliverySubscribe(streams, callback, params = {}) {
        if (typeof streams === 'string') return this.deliverySubscribeSingle(streams, callback, params);
        if (typeof params === 'boolean') params = { reconnect: params };
        if (!params.reconnect) params.reconnect = false;
        if (!params.openCallback) params.openCallback = false;
        if (!params.id) params.id = false;
        let httpsproxy = process.env.https_proxy || false;
        let socksproxy = process.env.socks_proxy || false;
        const queryParams = streams.join('/');
        let ws = false;
        if (socksproxy !== false) {
            socksproxy = proxyReplacewithIp(socksproxy);
            if (this.options.verbose) this.options.log(`deliverySubscribe: using socks proxy server ${socksproxy}`);
            let agent = new SocksProxyAgent({
                protocol: parseProxy(socksproxy)[0],
                host: parseProxy(socksproxy)[1],
                port: parseProxy(socksproxy)[2]
            });
            ws = new WebSocket((this.options.test ? dstreamTest : dstream) + queryParams, { agent });
        } else if (httpsproxy !== false) {
            if (this.options.verbose) this.options.log(`deliverySubscribe: using proxy server ${httpsproxy}`);
            let config = url.parse(httpsproxy);
            let agent = new HttpsProxyAgent(config);
            ws = new WebSocket((this.options.test ? dstreamTest : dstream) + queryParams, { agent });
        } else {
            ws = new WebSocket((this.options.test ? dstreamTest : dstream) + queryParams);
        }

        ws.reconnect = this.options.reconnect;
        ws.endpoint = stringHash(queryParams);
        ws.isAlive = false;
        if (this.options.verbose) {
            this.options.log(`deliverySubscribe: Subscribed to [${ws.endpoint}] ${queryParams}`);
        }
        ws.on('open', handleDeliverySocketOpen.bind(ws, params.openCallback));
        ws.on('pong', handleDeliverySocketHeartbeat);
        ws.on('error', handleDeliverySocketError);
        ws.on('close', handleDeliverySocketClose.bind(ws, params.reconnect));
        ws.on('message', data => {
            try {
                callback(JSON.parse(data).data);
            } catch (error) {
                this.options.log(`deliverySubscribe: Parse error: ${error.message}`);
            }
        });
        return ws;
    };

    /**
     * Used to terminate a delivery websocket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    deliveryTerminate(endpoint: string, reconnect = false) {
        if (this.options.verbose) this.options.log('Delivery WebSocket terminating:', endpoint);
        let ws = this.deliverySubscriptions[endpoint];
        if (!ws) return;
        ws.removeAllListeners('message');
        ws.reconnect = reconnect;
        ws.terminate();
    }

    /**
     * Combines all delivery OHLC data with the latest update
     * @param {string} symbol - the symbol
     * @param {string} interval - time interval
     * @return {array} - interval data for given symbol
     */
    deliveryKlineConcat(symbol: string, interval: string) {
        let output = this.deliveryTicks[symbol][interval];
        if (typeof this.deliveryRealtime[symbol][interval].time === 'undefined') return output;
        const time = this.deliveryRealtime[symbol][interval].time;
        const last_updated = Object.keys(this.deliveryTicks[symbol][interval]).pop();
        if (time >= last_updated) {
            output[time] = this.deliveryRealtime[symbol][interval];
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
    deliveryKlineHandler(symbol, kline, firstTime = 0) {
        // eslint-disable-next-line no-unused-vars
        let { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        let { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, V: takerBuyBaseVolume, Q: takerBuyQuoteVolume, n: trades, t: time, T: closeTime } = ticks;
        if (time <= firstTime) return;
        if (!isFinal) {
            // if ( typeof this.futuresRealtime[symbol][interval].time !== 'undefined' ) {
            //     if ( this.futuresRealtime[symbol][interval].time > time ) return;
            // }
            this.deliveryRealtime[symbol][interval] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades, isFinal };
            return;
        }
        const first_updated = Object.keys(this.deliveryTicks[symbol][interval]).shift();
        if (first_updated) delete this.deliveryTicks[symbol][interval][first_updated];
        this.deliveryTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades, isFinal: false };
    };

    /**
     * Converts the delivery liquidation stream data into a friendly object
     * @param {object} data - liquidation data callback data type
     * @return {object} - user friendly data type
     */
    dLiquidationConvertData(data) {
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
    dTickerConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                result.push(friendlyData(obj));
            }
            return result;
        }
        return friendlyData(data);
    }

    /**
     * Converts the delivery miniTicker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    dMiniTickerConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                result.push(friendlyData(obj));
            }
            return result;
        }
        return friendlyData(data);
    }

    /**
     * Converts the delivery bookTicker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    dBookTickerConvertData(data) {
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
    dMarkPriceConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                result.push(friendlyData(obj));
            }
            return result;
        }
        return friendlyData(data);
    }

    /**
     * Converts the delivery aggTrade stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    dAggTradeConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                result.push(friendlyData(obj));
            }
            return result;
        }
        return friendlyData(data);
    }

    /**
   * Converts the delivery UserData stream ORDER_TRADE_UPDATE data into a friendly object
   * @param {object} data - user data callback data type
   * @return {object} - user friendly data type
   */
    dUserDataOrderUpdateConvertData(data) {
        let {
            e: eventType,
            E: eventTime,
            T: transaction, // transaction time
            o: order,
        } = data;

        let orderConverter = (order) => {
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
        order = orderConverter(order);
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
    userDataHandler(data) {
        let type = data.e;
        if (type === 'outboundAccountInfo') {
            // XXX: Deprecated in 2020-09-08
        } else if (type === 'executionReport') {
            if (this.options.execution_callback) this.options.execution_callback(data);
        } else if (type === 'listStatus') {
            if (this.options.list_status_callback) this.options.list_status_callback(data);
        } else if (type === 'outboundAccountPosition' || type === 'balanceUpdate') {
            this.options.balance_callback(data);
        } else {
            this.options.log('Unexpected userData: ' + type);
        }
    };

    /**
     * Used as part of the user data websockets callback
     * @param {object} data - user data callback data type
     * @return {undefined}
     */
    userMarginDataHandler(data) {
        let type = data.e;
        if (type === 'outboundAccountInfo') {
            // XXX: Deprecated in 2020-09-08
        } else if (type === 'executionReport') {
            if (this.options.margin_execution_callback) this.options.margin_execution_callback(data);
        } else if (type === 'listStatus') {
            if (this.options.margin_list_status_callback) this.options.margin_list_status_callback(data);
        } else if (type === 'outboundAccountPosition' || type === 'balanceUpdate') {
            this.options.margin_balance_callback(data);
        } else {
            this.options.log('Unexpected userMarginData: ' + type);
        }
    };

    /**
     * Used as part of the user data websockets callback
     * @param {object} data - user data callback data type
     * @return {undefined}
     */
    userFutureDataHandler(data) {
        let type = data.e;
        if (type === 'MARGIN_CALL') {
            this.options.future_margin_call_callback(this.fUserDataMarginConvertData(data));
        } else if (type === 'ACCOUNT_UPDATE') {
            if (this.options.future_account_update_callback) {
                this.options.future_account_update_callback(this.fUserDataAccountUpdateConvertData(data));
            }
        } else if (type === 'ORDER_TRADE_UPDATE') {
            if (this.options.future_order_update_callback) {
                this.options.future_order_update_callback(this.fUserDataOrderUpdateConvertData(data));
            }
        } else if (type === 'ACCOUNT_CONFIG_UPDATE') {
            if (this.options.future_account_config_update_callback) {
                this.options.future_account_config_update_callback(this.fUserConfigDataAccountUpdateConvertData(data));
            }
        } else {
            this.options.log('Unexpected userFutureData: ' + type);
        }
    };

    /**
   * Used as part of the user data websockets callback
   * @param {object} data - user data callback data type
   * @return {undefined}
   */
    userDeliveryDataHandler(data) {
        let type = data.e;
        if (type === "MARGIN_CALL") {
            this.options.delivery_margin_call_callback(
                this.fUserDataMarginConvertData(data)
            );
        } else if (type === "ACCOUNT_UPDATE") {
            if (this.options.delivery_account_update_callback) {
                this.options.delivery_account_update_callback(
                    this.fUserDataAccountUpdateConvertData(data)
                );
            }
        } else if (type === "ORDER_TRADE_UPDATE") {
            if (this.options.delivery_order_update_callback) {
                this.options.delivery_order_update_callback(
                    this.dUserDataOrderUpdateConvertData(data)
                );
            }
        } else {
            this.options.log("Unexpected userDeliveryData: " + type);
        }
    };

    /**
    * Universal Transfer requires API permissions enabled 
    * @param {string} type - ENUM , example MAIN_UMFUTURE for SPOT to USDT futures, see https://binance-docs.github.io/apidocs/spot/en/#user-universal-transfer
    * @param {string} asset - the asset - example :USDT    * 
    * @param {number} amount - the callback function
    * @return {promise}
    */
    async universalTransfer(type: string, asset: string, amount: number) {
        let parameters = Object.assign({
            asset,
            amount,
            type,
        });
        return await this.signedRequest(
            this.sapi + "v1/asset/transfer",
            parameters,
            "POST"
        );
    }

    /**
   * Transfer between main account and futures/delivery accounts
   * @param {string} asset - the asset
   * @param {number} amount - the asset
   * @param {object} options - additional options
   * @return {undefined}
   */
    async transferBetweenMainAndFutures(
        asset: string,
        amount: number,
        type: any,
    ) {
        let parameters = Object.assign({
            asset,
            amount,
            type,
        });
        return await this.signedRequest(
            this.sapi + "v1/futures/transfer",
            parameters,
            "POST"
        );
    };

    /**
     * Converts the previous day stream into friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    prevDayConvertData(data) {
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
        if (Array.isArray(data)) {
            const result = [];
            for (let obj of data) {
                let converted = convertData(obj);
                result.push(converted);
            }
            return result;
            // eslint-disable-next-line no-else-return
        } else {
            return convertData(data);
        }
    }

    /**
     * Parses the previous day stream and calls the user callback with friendly object
     * @param {object} data - user data callback data type
     * @param {function} callback - user data callback data type
     * @return {undefined}
     */
    prevDayStreamHandler(data, callback) {
        const converted = this.prevDayConvertData(data);
        callback(null, converted);
    };

    /**
     * Gets the price of a given symbol or symbols
     * @param {array} data - array of symbols
     * @return {array} - symbols with their current prices
     */
    priceData(data) {
        const prices = {};
        if (Array.isArray(data)) {
            for (let obj of data) {
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
    bookPriceData(data) {
        let prices = {};
        for (let obj of data) {
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
    balanceData(data) {
        let balances = {};
        if (typeof data === 'undefined') return {};
        if (typeof data.balances === 'undefined') {
            this.options.log('balanceData error', data);
            return {};
        }
        for (let obj of data.balances) {
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
    klineData(symbol, interval, ticks) { // Used for /depth
        let last_time = 0;
        if (isIterable(ticks)) {
            for (let tick of ticks) {
                // eslint-disable-next-line no-unused-vars
                let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
                this.ohlc[symbol][interval][time] = { open: open, high: high, low: low, close: close, volume: volume };
                last_time = time;
            }

            this.info[symbol][interval].timestamp = last_time;
        }
    };

    /**
     * Combines all OHLC data with latest update
     * @param {string} symbol - the symbol
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @return {array} - interval data for given symbol
     */
    klineConcat(symbol, interval) {
        let output = this.ohlc[symbol][interval];
        if (typeof this.ohlcLatest[symbol][interval].time === 'undefined') return output;
        const time = this.ohlcLatest[symbol][interval].time;
        const last_updated = Object.keys(this.ohlc[symbol][interval]).pop();
        if (time >= last_updated) {
            output[time] = this.ohlcLatest[symbol][interval];
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
    klineHandler(symbol, kline, firstTime = 0) {
        // TODO: add Taker buy base asset volume
        // eslint-disable-next-line no-unused-vars
        let { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        let { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, t: time } = ticks; //n:trades, V:buyVolume, Q:quoteBuyVolume
        if (time <= firstTime) return;
        if (!isFinal) {
            if (typeof this.ohlcLatest[symbol][interval].time !== 'undefined') {
                if (this.ohlcLatest[symbol][interval].time > time) return;
            }
            this.ohlcLatest[symbol][interval] = { open: open, high: high, low: low, close: close, volume: volume, time: time };
            return;
        }
        // Delete an element from the beginning so we don't run out of memory
        const first_updated = Object.keys(this.ohlc[symbol][interval]).shift();
        if (first_updated) delete this.ohlc[symbol][interval][first_updated];
        this.ohlc[symbol][interval][time] = { open: open, high: high, low: low, close: close, volume: volume };
    };


    /**
     * Used by futures websockets chart cache
     * @param {string} symbol - symbol to get candlestick info
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @param {array} ticks - tick array
     * @return {undefined}
     */
    futuresKlineData(symbol, interval, ticks) {
        let last_time = 0;
        if (this.isIterable(ticks)) {
            for (let tick of ticks) {
                // eslint-disable-next-line no-unused-vars
                let [time, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBaseVolume, takerBuyQuoteVolume, ignored] = tick;
                this.futuresTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades };
                last_time = time;
            }
            this.futuresMeta[symbol][interval].timestamp = last_time;
        }
    };

    /**
     * Used by delivery websockets chart cache
     * @param {string} symbol - symbol to get candlestick info
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @param {array} ticks - tick array
     * @return {undefined}
     */
    deliveryKlineData(symbol, interval, ticks) {
        let last_time = 0;
        if (this.isIterable(ticks)) {
            for (let tick of ticks) {
                // eslint-disable-next-line no-unused-vars
                let [time, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBaseVolume, takerBuyQuoteVolume, ignored] = tick;
                this.deliveryTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades };
                last_time = time;
            }
            this.deliveryMeta[symbol][interval].timestamp = last_time;
        }
    };

    /**
     * Used for /depth endpoint
     * @param {object} data - containing the bids and asks
     * @return {undefined}
     */
    depthData(data) {
        if (!data) return { bids: [], asks: [] };
        let bids = {}, asks = {}, obj;
        if (typeof data.bids !== 'undefined') {
            for (obj of data.bids) {
                bids[obj[0]] = parseFloat(obj[1]);
            }
        }
        if (typeof data.asks !== 'undefined') {
            for (obj of data.asks) {
                asks[obj[0]] = parseFloat(obj[1]);
            }
        }
        return { lastUpdateId: data.lastUpdateId, bids: bids, asks: asks };
    }

    /**
     * Used for /depth endpoint
     * @param {object} depth - information
     * @return {undefined}
     */
    depthHandler(depth) {
        let symbol = depth.s, obj;
        let context = this.depthCacheContext[symbol];
        let updateDepthCache = () => {
            this.depthCache[symbol].eventTime = depth.E;
            for (obj of depth.b) { //bids
                if (obj[1] == 0) {
                    delete this.depthCache[symbol].bids[obj[0]];
                } else {
                    this.depthCache[symbol].bids[obj[0]] = parseFloat(obj[1]);
                }
            }
            for (obj of depth.a) { //asks
                if (obj[1] == 0) {
                    delete this.depthCache[symbol].asks[obj[0]];
                } else {
                    this.depthCache[symbol].asks[obj[0]] = parseFloat(obj[1]);
                }
            }
            context.skipCount = 0;
            context.lastEventUpdateId = depth.u;
            context.lastEventUpdateTime = depth.E;
        };

        // This now conforms 100% to the Binance docs constraints on managing a local order book
        if (context.lastEventUpdateId) {
            const expectedUpdateId = context.lastEventUpdateId + 1;
            if (depth.U <= expectedUpdateId) {
                updateDepthCache();
            } else {
                let msg = 'depthHandler: [' + symbol + '] The depth cache is out of sync.';
                msg += ' Symptom: Unexpected Update ID. Expected "' + expectedUpdateId + '", got "' + depth.U + '"';
                if (this.options.verbose) this.options.log(msg);
                throw new Error(msg);
            }
        } else if (depth.U > context.snapshotUpdateId + 1) {
            /* In this case we have a gap between the data of the stream and the snapshot.
             This is an out of sync error, and the connection must be torn down and reconnected. */
            let msg = 'depthHandler: [' + symbol + '] The depth cache is out of sync.';
            msg += ' Symptom: Gap between snapshot and first stream data.';
            if (this.options.verbose) this.options.log(msg);
            throw new Error(msg);
        } else if (depth.u < context.snapshotUpdateId + 1) {
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
    getDepthCache(symbol: string) {
        if (typeof this.depthCache[symbol] === 'undefined') return { bids: {}, asks: {} };
        return this.depthCache[symbol];
    };

    /**
     * Calculate Buy/Sell volume from DepthCache
     * @param {string} symbol - the symbol to fetch
     * @return {object} - the depth volume cache object
     */
    depthVolume(symbol: string) {
        let cache = this.getDepthCache(symbol), quantity, price;
        let bidbase = 0, askbase = 0, bidqty = 0, askqty = 0;
        for (price in cache.bids) {
            quantity = cache.bids[price];
            bidbase += parseFloat((quantity * parseFloat(price)).toFixed(8));
            bidqty += quantity;
        }
        for (price in cache.asks) {
            quantity = cache.asks[price];
            askbase += parseFloat((quantity * parseFloat(price)).toFixed(8));
            askqty += quantity;
        }
        return { bids: bidbase, asks: askbase, bidQty: bidqty, askQty: askqty };
    };

    /**
     * Checks whether or not an array contains any duplicate elements
     * @param {array} array - the array to check
     * @return {boolean} - true or false
     */
    isArrayUnique(array: any[]) {
        return new Set(array).size === array.length;
    };

    // --- PUBLIC FUNCTIONS --- //

    /**
        * Count decimal places
        * @param {float} float - get the price precision point
        * @return {int} - number of place
        */
    getPrecision(float: number) {
        if (!float || Number.isInteger(float)) return 0;
        return float.toString().split('.')[1].length || 0;
    }



    /**
    * rounds number with given step
    * @param {float} qty - quantity to round
    * @param {float} stepSize - stepSize as specified by exchangeInfo
    * @return {float} - number
    */
    roundStep(qty, stepSize) {
        // Integers do not require rounding
        if (Number.isInteger(qty)) return qty;
        const qtyString = parseFloat(qty).toFixed(16);
        const desiredDecimals = Math.max(stepSize.indexOf('1') - 1, 0);
        const decimalIndex = qtyString.indexOf('.');
        return parseFloat(qtyString.slice(0, decimalIndex + desiredDecimals + 1));
    }

    /**
    * rounds price to required precision
    * @param {float} price - price to round
    * @param {float} tickSize - tickSize as specified by exchangeInfo
    * @return {float} - number
    */
    roundTicks(price, tickSize) {
        const formatter = new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 8 });
        const precision = formatter.format(tickSize).split('.')[1].length || 0;
        if (typeof price === 'string') price = parseFloat(price);
        return price.toFixed(precision);
    }

    /**
    * Gets percentage of given numbers
    * @param {float} min - the smaller number
    * @param {float} max - the bigger number
    * @param {int} width - percentage width
    * @return {float} - percentage
    */
    percent(min, max, width = 100) {
        return (min * 0.01) / (max * 0.01) * width;
    }

    /**
    * Gets the sum of an array of numbers
    * @param {array} array - the number to add
    * @return {float} - sum
    */
    sum(array) {
        return array.reduce((a, b) => a + b, 0);
    }

    /**
    * Reverses the keys of an object
    * @param {object} object - the object
    * @return {object} - the object
    */
    reverse(object) {
        let range = Object.keys(object).reverse(), output = {};
        for (let price of range) {
            output[price] = object[price];
        }
        return output;
    }

    /**
    * Converts an object to an array
    * @param {object} obj - the object
    * @return {array} - the array
    */
    array(obj) {
        return Object.keys(obj).map(function (key) {
            return [Number(key), obj[key]];
        });
    }

    /**
    * Sorts bids
    * @param {string} symbol - the object
    * @param {int} max - the max number of bids
    * @param {string} baseValue - the object
    * @return {object} - the object
    */
    sortBids(symbol, max = Infinity, baseValue = false) {
        let object = {}, count = 0, cache;
        if (typeof symbol === 'object') cache = symbol;
        else cache = getDepthCache(symbol).bids;
        const sorted = Object.keys(cache).sort((a, b) => parseFloat(b) - parseFloat(a));
        let cumulative = 0;
        for (let price of sorted) {
            if (!baseValue) object[price] = cache[price];
            else if (baseValue === 'cumulative') {
                cumulative += cache[price];
                object[price] = cumulative;
            } else object[price] = parseFloat((cache[price] * parseFloat(price)).toFixed(8));
            if (++count >= max) break;
        }
        return object;
    }

    /**
    * Sorts asks
    * @param {string} symbol - the object
    * @param {int} max - the max number of bids
    * @param {string} baseValue - the object
    * @return {object} - the object
    */
    sortAsks(symbol, max = Infinity, baseValue = false) {
        let object = {}, count = 0, cache;
        if (typeof symbol === 'object') cache = symbol;
        else cache = getDepthCache(symbol).asks;
        const sorted = Object.keys(cache).sort((a, b) => parseFloat(a) - parseFloat(b));
        let cumulative = 0;
        for (let price of sorted) {
            if (!baseValue) object[price] = cache[price];
            else if (baseValue === 'cumulative') {
                cumulative += cache[price];
                object[price] = cumulative;
            } else object[price] = parseFloat((cache[price] * parseFloat(price)).toFixed(8));
            if (++count >= max) break;
        }
        return object;
    }

    /**
    * Returns the first property of an object
    * @param {object} object - the object to get the first member
    * @return {string} - the object key
    */
    first(object) {
        return Object.keys(object).shift();
    }

    /**
    * Returns the last property of an object
    * @param {object} object - the object to get the first member
    * @return {string} - the object key
    */
    last(object) {
        return Object.keys(object).pop();
    }

    /**
    * Returns an array of properties starting at start
    * @param {object} object - the object to get the properties form
    * @param {int} start - the starting index
    * @return {array} - the array of entires
    */
    slice(object, start = 0) {
        return Object.keys(object).slice(start);
    }

    /**
    * Gets the minimum key form object
    * @param {object} object - the object to get the properties form
    * @return {string} - the minimum key
    */
    min(object) {
        return Math.min.apply(Math, Object.keys(object));
    }

    /**
    * Gets the maximum key form object
    * @param {object} object - the object to get the properties form
    * @return {string} - the minimum key
    */
    max(object) {
        return Math.max.apply(Math, Object.keys(object));
    }

    /**
    * Sets an option given a key and value
    * @param {string} key - the key to set
    * @param {object} value - the value of the key
    * @return {undefined}
    */
    setOption(key, value) {
        this.options[key] = value;
    }

    /**
    * Gets an option given a key
    * @param {string} key - the key to set
    * @return {undefined}
    */
    getOption(key: string) { return this.options[key] }

    /**
    * Returns the entire info object
    * @return {object} - the info object
    */
    getInfo() { return this.info }

    /**
    * Returns the used weight from the last request
    * @return {object} - 1m weight used
    */
    usedWeight() { return this.info.usedWeight }

    /**
    * Returns the status code from the last http response
    * @return {object} - status code
    */
    statusCode() { return this.info.statusCode }

    /**
    * Returns the ping time from the last futures request
    * @return {object} - latency/ping (2ms)
    */
    futuresLatency() { return this.info.futuresLatency }

    /**
    * Returns the complete URL from the last request
    * @return {object} - http address including query string
    */
    lastURL() { return this.info.lastURL }

    /**
    * Returns the order count from the last request
    * @return {object} - orders allowed per 1m
    */
    orderCount() { return this.info.orderCount1m }

    /**
    * Returns the entire options object
    * @return {object} - the options object
    */
    getOptions() { return this.options }

    // /**
    // * Gets an option given a key
    // * @param {object} opt - the object with the class configuration
    // * @param {function} callback - the callback function
    // * @return {undefined}
    // */
    // options() {this.setOptions()}


    // /**
    // * Creates a buy order
    // * @param {string} symbol - the symbol to buy
    // * @param {numeric} quantity - the quantity required
    // * @param {numeric} price - the price to pay for each unit
    // * @param {object} flags - additional buy order flags
    // * @param {function} callback - the callback function
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // buy(symbol, quantity, price, flags = {}, callback = false) {
    //     if (!callback) {
    //         return new Promise((resolve, reject) => {
    //             callback = (error, response) => {
    //                 if (error) {
    //                     reject(error);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             }
    //             order('BUY', symbol, quantity, price, flags, callback);
    //         })
    //     } else {
    //         order('BUY', symbol, quantity, price, flags, callback);
    //     }
    // }

    // /**
    // * Creates a sell order
    // * @param {string} symbol - the symbol to sell
    // * @param {numeric} quantity - the quantity required
    // * @param {numeric} price - the price to sell each unit for
    // * @param {object} flags - additional order flags
    // * @param {function} callback - the callback function
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // sell(symbol, quantity, price, flags = {}, callback = false) {
    //     if (!callback) {
    //         return new Promise((resolve, reject) => {
    //             callback = (error, response) => {
    //                 if (error) {
    //                     reject(error);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             }
    //             order('SELL', symbol, quantity, price, flags, callback);
    //         })
    //     } else {
    //         order('SELL', symbol, quantity, price, flags, callback);
    //     }
    // }



    // /**
    // * Creates a market sell order
    // * @param {string} symbol - the symbol to sell
    // * @param {numeric} quantity - the quantity required
    // * @param {object} flags - additional sell order flags
    // * @param {function} callback - the callback function
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // marketSell(symbol, quantity, flags = { type: 'MARKET' }, callback = false) {
    //     if (typeof flags === 'function') { // Accept callback as third parameter
    //         callback = flags;
    //         flags = { type: 'MARKET' };
    //     }
    //     if (typeof flags.type === 'undefined') flags.type = 'MARKET';
    //     if (!callback) {
    //         return new Promise((resolve, reject) => {
    //             callback = (error, response) => {
    //                 if (error) {
    //                     reject(error);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             }
    //             order('SELL', symbol, quantity, 0, flags, callback);
    //         })
    //     } else {
    //         order('SELL', symbol, quantity, 0, flags, callback);
    //     }
    // }



    /**
    * Gets the depth information for a given symbol
    * @param {string} symbol - the symbol
    * @param {int} limit - limit the number of returned orders
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async depth(symbol: string, limit = 100) {
        const data = await this.publicRequest(this.getSpotUrl() + 'v3/depth', { symbol: symbol, limit: limit });
        return this.depthData(data);
    }

    /**
    * Gets the average prices of a given symbol
    * @param {string} symbol - the symbol
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async avgPrice(symbol: string) {
        return await this.publicRequest(this.getSpotUrl() + 'v3/avgPrice', { symbol: symbol });
    }

    /**
    * Gets the prices of a given symbol(s)
    * @param {string} symbol - the symbol
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async prices(symbol: string) {
        const data = await this.publicRequest(this.getSpotUrl() + 'v3/ticker/price', { symbol: symbol });
        return this.priceData(data);
    }

    /**
    * Gets the book tickers of given symbol(s)
    * @param {string} symbol - the symbol
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async bookTickers(symbol: string) {
        const data = await this.publicRequest(this.getSpotUrl() + 'v3/ticker/bookTicker', { symbol: symbol });
        return this.bookPriceData(data);
    }

    /**
    * Gets the prevday percentage change
    * @param {string} symbol - the symbol or symbols
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async prevDay(symbol: string) {
        let input = symbol ? { symbol: symbol } : {};
        return await this.publicRequest(this.getSpotUrl() + 'v3/ticker/24hr', input);
    }

    /**
    * Gets the the exchange info
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    exchangeInfo() {
        return await this.publicRequest(this.getSpotUrl() + 'v3/exchangeInfo', {});
    }

    /**
    * Gets the dust log for user
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async dustLog() {
        return await this.signedRequest(this.sapi + 'v1/asset/dribblet', {});
    }

    async dustTransfer(assets) {
        return await this.signedRequest(this.sapi + 'v1/asset/dust', { asset: assets }, 'POST');
    }

    async assetDividendRecord(params = {}) {
        return await this.signedRequest(this.sapi + 'v1/asset/assetDividend', params);
    }

    /**
    * Gets the the system status
    * @see https://developers.binance.com/docs/wallet/others/system-status
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async systemStatus() {
        return await this.publicRequest(this.sapi + 'v1/system/status', {});
    }

    /**
    * Withdraws asset to given wallet id
    * @param {string} asset - the asset symbol
    * @param {string} address - the wallet to transfer it to
    * @param {number} amount - the amount to transfer
    * @param {string} addressTag - and addtional address tag
    * @param {string} name - the name to save the address as. Set falsy to prevent Binance saving to address book
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async withdraw(asset: string, address: string, amount: number, addressTag = false, name = false) {
        let params = { asset, address, amount };
        if (name) params.name = name;
        if (addressTag) params.addressTag = addressTag;

        return await this.signedRequest(this.sapi + 'v1/capital/withdraw/apply', params, 'POST');
    }

    /**
    * Get the Withdraws history for a given asset
    * @param {object} params - supports limit and fromId parameters
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async withdrawHistory(params = {}) {
        if (typeof params === 'string') params = { asset: params };
        return await this.signedRequest(this.sapi + 'v1/capital/withdraw/history', params);
    }

    /**
    * Get the deposit history
    * @param {object} params - additional params
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async depositHistory(params = {}) {
        if (typeof params === 'string') params = { asset: params }; // Support 'asset' (string) or optional parameters (object)
        return await this.signedRequest(this.sapi + 'v1/capital/deposit/hisrec', params);
    }

    /**
    * Get the deposit address for given asset
    * @see https://developers.binance.com/docs/wallet/capital/deposite-address
    * @param {string} coin - the asset
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async depositAddress(asset: string) {
        return await this.signedRequest(this.sapi + 'v1/capital/deposit/address', { coin: asset });
    }

    /**
    * Get the deposit address list for given asset
    * @see https://developers.binance.com/docs/wallet/capital/fetch-deposit-address-list-with-network
    * @param {string} coin - the asset
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async depositAddressList(asset: string) {
        return await this.signedRequest(this.sapi + 'v1/capital/deposit/address/list', { coin: asset });
    }

    /**
    * Get the account status
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async accountStatus() {
        return await this.signedRequest(this.sapi + 'v3/account', {});
    }

    /**
    * Get the trade fee
    * @see https://developers.binance.com/docs/wallet/asset/trade-fee
    * @param {string} symbol (optional)
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async tradeFee(symbol?: string) {
        let params = symbol ? { symbol: symbol } : {};
        return await this.signedRequest(this.sapi + 'v1/asset/tradeFee', params);
    }

    /**
    * Fetch asset detail (minWithdrawAmount, depositStatus, withdrawFee, withdrawStatus, depositTip)
    * @see https://developers.binance.com/docs/wallet/asset
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async assetDetail() {
        return await this.signedRequest(this.sapi + 'asset/assetDetail', {});
    }

    /**
    * Get the account
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async account() {
        return await this.signedRequest(this.getSpotUrl() + 'v3/account', {});
    }

    /**
    * Get the balance data
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async balance() {
        const data = await this.signedRequest(this.getSpotUrl() + 'v3/account', {});
        return this.balanceData(data)
    }

    /**
    * Get trades for a given symbol
    * @param {string} symbol - the symbol
    * @param {function} callback - the callback function
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async trades(symbol: string, options = {}) {
        let parameters = Object.assign({ symbol: symbol }, options);
        return await this.signedRequest(this.getSpotUrl() + 'v3/myTrades', parameters);
    }

    /**
    * Tell api to use the server time to offset time indexes
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    useServerTime() {
        const response = await this.publicRequest(this.getSpotUrl() + 'v3/time', {});
        this.info.timeOffset = response.serverTime - new Date().getTime();
        return response;
    }

    // /**
    // * Get Binance server time
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // time() {

    //     publicRequest(this.getSpotUrl() + 'v3/time', {}, callback);
    // }

    /**
    * Ping binance
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async ping() {
        return await this.publicRequest(this.getSpotUrl() + 'v3/ping', {});
    }

    /**
    * Get agg trades for given symbol
    * @param {string} symbol - the symbol
    * @param {object} options - additional optoins
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async aggTrades(symbol: string, options = {}) { //fromId startTime endTime limit
        let parameters = Object.assign({ symbol }, options);
        return await this.publicRequest(this.getSpotUrl() + 'v3/aggTrades', parameters);
    }

    /**
    * Get the recent trades
    * @param {string} symbol - the symbol
    * @param {int} limit - limit the number of items returned
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async recentTrades(symbol: string, limit = 500) {
        return await this.marketRequest(this.getSpotUrl() + 'v1/trades', { symbol: symbol, limit: limit });
    }

    /**
    * Get the historical trade info
    * @param {string} symbol - the symbol
    * @param {function} callback - the callback function
    * @param {int} limit - limit the number of items returned
    * @param {int} fromId - from this id
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async historicalTrades(symbol: string, limit = 500, fromId?: number) {
        const parameters = { symbol: symbol, limit: limit };
        if (fromId) parameters.fromId = fromId;
        return await this.marketRequest(this.getSpotUrl() + 'v3/historicalTrades', parameters);
    }

    /**
    * Convert chart data to highstock array [timestamp,open,high,low,close]
    * @param {object} chart - the chart
    * @param {boolean} include_volume - to include the volume or not
    * @return {array} - an array
    */
    highstock(chart, include_volume = false) {
        let array = [];
        for (let timestamp in chart) {
            let obj = chart[timestamp];
            let line = [
                Number(timestamp),
                parseFloat(obj.open),
                parseFloat(obj.high),
                parseFloat(obj.low),
                parseFloat(obj.close)
            ];
            if (include_volume) line.push(parseFloat(obj.volume));
            array.push(line);
        }
        return array;
    }

    /**
    * Populates OHLC information
    * @param {object} chart - the chart
    * @return {object} - object with candle information
    */
    populateOHLC(chart) {
        let open = [], high = [], low = [], close = [], volume = [];
        for (let timestamp in chart) { //this.ohlc[symbol][interval]
            let obj = chart[timestamp];
            open.push(parseFloat(obj.open));
            high.push(parseFloat(obj.high));
            low.push(parseFloat(obj.low));
            close.push(parseFloat(obj.close));
            volume.push(parseFloat(obj.volume));
        }
        return { open: open, high: high, low: low, close: close, volume: volume };
    }

    /**
    * Gets the candles information for a given symbol
    * intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    * @param {string} symbol - the symbol
    * @param {function} interval - the callback function
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    candlesticks(symbol: string, interval = '5m', options = { limit: 500 }) {
        let params = Object.assign({ symbol: symbol, interval: interval }, options);
        return await this.publicRequest(this.getSpotUrl() + 'v3/klines', params);
    }

    // /**
    // * Queries the public api
    // * @param {string} url - the public api endpoint
    // * @param {object} data - the data to send
    // * @param {string} method - the http method
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // publicRequest(url: string, data, method = 'GET') {
    //     if (!callback) {
    //         return new Promise((resolve, reject) => {
    //             callback = (error, response) => {
    //                 if (error) {
    //                     reject(error);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             }
    //             this.publicRequest(url, data, callback, method);
    //         })
    //     } else {
    //         publicRequest(url, data, callback, method);
    //     }
    // }

    // /**
    //  * Queries the futures API by default
    //  * @param {string} url - the signed api endpoint
    //  * @param {object} data - the data to send
    //  * @param {object} flags - type of request, authentication method and endpoint url
    //  */
    // promiseRequest(url, data = {}, flags = {}) {
    //     return await this.promiseRequest(url, data, flags);
    // }

    // /**
    // * Queries the signed api
    // * @param {string} url - the signed api endpoint
    // * @param {object} data - the data to send
    // * @param {function} callback - the callback function
    // * @param {string} method - the http method
    // * @param {boolean} noDataInSignature - Prevents data from being added to signature
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // signedRequest(url, data, callback, method = 'GET', noDataInSignature = false) {
    //     if (!callback) {
    //         return new Promise((resolve, reject) => {
    //             callback = (error, response) => {
    //                 if (error) {
    //                     reject(error);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             }
    //             signedRequest(url, data, callback, method, noDataInSignature);
    //         })
    //     } else {
    //         signedRequest(url, data, callback, method, noDataInSignature);
    //     }
    // }

    /**
    * Gets the market asset of given symbol
    * @param {string} symbol - the public api endpoint
    * @return {undefined}
    */
    getMarket(symbol: string) {
        if (symbol.endsWith('BTC')) return 'BTC';
        else if (symbol.endsWith('ETH')) return 'ETH';
        else if (symbol.endsWith('BNB')) return 'BNB';
        else if (symbol.endsWith('XRP')) return 'XRP';
        else if (symbol.endsWith('PAX')) return 'PAX';
        else if (symbol.endsWith('USDT')) return 'USDT';
        else if (symbol.endsWith('USDC')) return 'USDC';
        else if (symbol.endsWith('USDS')) return 'USDS';
        else if (symbol.endsWith('TUSD')) return 'TUSD';
    }

    /**
    * Get the account binance lending information
    * @param {function} callback - the callback function
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async lending(params = {}) {
        return await this.promiseRequest('v1/lending/union/account', params, { base: this.sapi, type: 'SIGNED' });
    }

    //** Futures methods */
    async futuresPing(params = {}) {
        return await this.promiseRequest('v1/ping', params, { base: this.fapi });
    }

    async futuresTime(params = {}) {
        return await this.promiseRequest('v1/time', params, { base: this.fapi }).then(r => r.serverTime);
    }

    async futuresExchangeInfo() {
        return await this.promiseRequest('v1/exchangeInfo', {}, { base: this.fapi });
    }

    async futuresPrices(params = {}) {
        let data = await this.promiseRequest('v2/ticker/price', params, { base: this.fapi });
        return Array.isArray(data) ? data.reduce((out, i) => ((out[i.symbol] = i.price), out), {}) : data;
    }

    async futuresDaily(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        let data = await this.promiseRequest('v1/ticker/24hr', params, { base: this.fapi });
        return symbol ? data : data.reduce((out, i) => ((out[i.symbol] = i), out), {});
    }

    async futuresOpenInterest(symbol: string) {
        return await this.promiseRequest('v1/openInterest', { symbol }, { base: this.fapi }).then(r => r.openInterest);
    }

    async futuresCandles(symbol: string, interval = "30m", params = {}) {
        params.symbol = symbol;
        params.interval = interval;
        return await this.promiseRequest('v1/klines', params, { base: this.fapi });
    }

    async futuresMarkPrice(symbol = false) {
        return await this.promiseRequest('v1/premiumIndex', symbol ? { symbol } : {}, { base: this.fapi });
    }

    async futuresTrades(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/trades', params, { base: this.fapi });
    }

    async futuresHistoricalTrades(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/historicalTrades', params, { base: this.fapi, type: 'MARKET_DATA' });
    }

    async futuresAggTrades(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/aggTrades', params, { base: this.fapi });
    }

    async futuresForceOrders(params = {}) {
        return await this.promiseRequest('v1/forceOrders', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresDeleverageQuantile(params = {}) {
        return await this.promiseRequest('v1/adlQuantile', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresUserTrades(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/userTrades', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresGetDataStream(params = {}) {
        //A User Data Stream listenKey is valid for 60 minutes after creation. setInterval
        return await this.promiseRequest('v1/listenKey', params, { base: this.fapi, type: 'SIGNED', method: 'POST' });
    }

    async futuresKeepDataStream(params = {}) {
        return await this.promiseRequest('v1/listenKey', params, { base: this.fapi, type: 'SIGNED', method: 'PUT' });
    }

    async futuresCloseDataStream(params = {}) {
        return await this.promiseRequest('v1/listenKey', params, { base: this.fapi, type: 'SIGNED', method: 'DELETE' });
    }

    async futuresLiquidationOrders(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/allForceOrders', params, { base: this.fapi });
    }

    /**
    * Get the account binance lending information
    * @param {function} callback - the callback function
    * @param {string} symbol - position symbol, optional
    * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3
    * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async futuresPositionRisk(params = {}, useV2 = false) {
        const endpoint = useV2 ? 'v2/positionRisk' : 'v3/positionRisk'
        return await this.promiseRequest(endpoint, params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresPositionRiskV2(params = {}) {
        return this.futuresPositionRisk(params, true)
    }

    async futuresFundingRate(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/fundingRate', params, { base: this.fapi });
    }

    async futuresLeverageBracket(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/leverageBracket', params, { base: this.fapi, type: 'USER_DATA' });
    }

    async futuresTradingStatus(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/apiTradingStatus', params, { base: this.fapi, type: 'USER_DATA' });
    }

    async futuresCommissionRate(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/commissionRate', params, { base: this.fapi, type: 'USER_DATA' });
    }

    // leverage 1 to 125
    async futuresLeverage(symbol, leverage, params = {}) {
        params.symbol = symbol;
        params.leverage = leverage;
        return await this.promiseRequest('v1/leverage', params, { base: this.fapi, method: 'POST', type: 'SIGNED' });
    }

    // ISOLATED, CROSSED
    async futuresMarginType(symbol, marginType, params = {}) {
        params.symbol = symbol;
        params.marginType = marginType;
        return await this.promiseRequest('v1/marginType', params, { base: this.fapi, method: 'POST', type: 'SIGNED' });
    }

    // type: 1: Add postion margin，2: Reduce postion margin
    async futuresPositionMargin(symbol, amount, type = 1, params = {}) {
        params.symbol = symbol;
        params.amount = amount;
        params.type = type;
        return await this.promiseRequest('v1/positionMargin', params, { base: this.fapi, method: 'POST', type: 'SIGNED' });
    }

    async futuresPositionMarginHistory(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/positionMargin/history', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresIncome(params = {}) {
        return await this.promiseRequest('v1/income', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresBalance(params = {}) {
        return await this.promiseRequest('v2/balance', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresAccount(params = {}) {
        return await this.promiseRequest('v3/account', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresDepth(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/depth', params, { base: this.fapi });
    }

    async futuresQuote(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        //let data = await this.promiseRequest( 'v1/ticker/bookTicker', params, {base:fapi} );
        //return data.reduce((out, i) => ((out[i.symbol] = i), out), {}),
        let data = await this.promiseRequest('v1/ticker/bookTicker', params, { base: this.fapi });
        return symbol ? data : data.reduce((out, i) => ((out[i.symbol] = i), out), {});
    }

    async futuresBuy(symbol: string, quantity: number, price: number, params = {}) {
        return await this.futuresOrder('BUY', symbol, quantity, price, params);
    }

    async futuresSell(symbol: string, quantity: number, price: number, params = {}) {
        return await this.futuresOrder('SELL', symbol, quantity, price, params);
    }

    async futuresMarketBuy(symbol: string, quantity: number, params = {}) {
        return await this.futuresOrder('BUY', symbol, quantity, false, params);
    }

    async futuresMarketSell(symbol: string, quantity: number, params = {}) {
        return await this.futuresOrder('SELL', symbol, quantity, false, params);
    }

    async futuresMultipleOrders(orders = [{}]) {
        for (let i = 0; i < orders.length; i++) {
            if (!orders[i].newClientOrderId) {
                orders[i].newClientOrderId = CONTRACT_PREFIX + uuid22();
            }
        }
        let params = { batchOrders: JSON.stringify(orders) };
        return await this.promiseRequest('v1/batchOrders', params, { base: this.fapi, type: 'TRADE', method: 'POST' });
    }

    // futuresOrder, // side symbol quantity [price] [params]

    async futuresOrderStatus(symbol: string, params = {}) { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        return await this.promiseRequest('v1/order', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresCancel(symbol: string, params = {}) { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        return await this.promiseRequest('v1/order', params, { base: this.fapi, type: 'SIGNED', method: 'DELETE' });
    }

    async futuresCancelAll(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/allOpenOrders', params, { base: this.fapi, type: 'SIGNED', method: 'DELETE' });
    }

    async futuresCountdownCancelAll(symbol, countdownTime = 0, params = {}) {
        params.symbol = symbol;
        params.countdownTime = countdownTime;
        return await this.promiseRequest('v1/countdownCancelAll', params, { base: this.fapi, type: 'SIGNED', method: 'POST' });
    }

    async futuresOpenOrders(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/openOrders', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresAllOrders(symbol?: string = undefined, params = {}) { // Get all account orders; active, canceled, or filled.
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/allOrders', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresPositionSideDual(params = {}) {
        return await this.promiseRequest('v1/positionSide/dual', params, { base: this.fapi, type: 'SIGNED' });
    }

    async futuresChangePositionSideDual(dualSidePosition, params = {}) {
        params.dualSidePosition = dualSidePosition;
        return await this.promiseRequest('v1/positionSide/dual', params, { base: this.fapi, type: 'SIGNED', method: 'POST' });
    }
    async futuresTransferAsset(asset, amount, type) {
        let params = Object.assign({ asset, amount, type });
        return await this.promiseRequest('v1/futures/transfer', params, { base: sapi, type: 'SIGNED', method: 'POST' });
    }

    async futuresHistDataId(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/futuresHistDataId', params, { base: sapi, type: 'SIGNED', method: 'POST' })
    }

    async futuresDownloadLink(downloadId) {
        return await this.promiseRequest('v1/downloadLink', { downloadId }, { base: sapi, type: 'SIGNED' })
    }

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
                else return this.options.log('futuresOrder error:', error);
            }
            if (callback) return callback(error, response);
            else return this.options.log(`futuresOrder ${side} (${symbol},${quantity},${price})`, response);
        }, 'POST');
    };*/

    //** Delivery methods */

    async deliveryPing(params = {}) {
        return await this.promiseRequest('v1/ping', params, { base: this.dapi });
    }

    async deliveryTime(params = {}) {
        return await this.promiseRequest('v1/time', params, { base: this.dapi }).then(r => r.serverTime);
    }

    async deliveryExchangeInfo() {
        return await this.promiseRequest('v1/exchangeInfo', {}, { base: this.dapi })
    };

    async deliveryPrices(params = {}) {
        let data = await this.promiseRequest('v1/ticker/price', params, { base: this.dapi });
        return data.reduce((out, i) => ((out[i.symbol] = i.price), out), {});
    }

    async deliveryDaily(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        let data = await this.promiseRequest('v1/ticker/24hr', params, { base: this.dapi });
        return symbol ? data : data.reduce((out, i) => ((out[i.symbol] = i), out), {});
    }

    async deliveryOpenInterest(symbol: string) {
        return await this.promiseRequest('v1/openInterest', { symbol }, { base: this.dapi }).then(r => r.openInterest);
    }

    async deliveryCandles(symbol, interval = "30m", params = {}) {
        params.symbol = symbol;
        params.interval = interval;
        return await this.promiseRequest('v1/klines', params, { base: this.dapi });
    }

    async deliveryContinuousKlines(pair, contractType = "CURRENT_QUARTER", interval = "30m", params = {}) {
        params.pair = pair;
        params.interval = interval;
        params.contractType = contractType;
        return await this.promiseRequest('v1/continuousKlines', params, { base: this.dapi });
    }

    async deliveryIndexKlines(pair, interval = "30m", params = {}) {
        params.pair = pair;
        params.interval = interval;
        return await this.promiseRequest('v1/indexPriceKlines', params, { base: this.dapi });
    }

    async deliveryMarkPriceKlines(symbol, interval = "30m", params = {}) {
        params.symbol = symbol;
        params.interval = interval;
        return await this.promiseRequest('v1/markPriceKlines', params, { base: this.dapi });
    }

    async deliveryMarkPrice(symbol = false) {
        return await this.promiseRequest('v1/premiumIndex', symbol ? { symbol } : {}, { base: this.dapi });
    }

    async deliveryTrades(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/trades', params, { base: this.dapi });
    }

    async deliveryHistoricalTrades(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/historicalTrades', params, { base: this.dapi, type: 'MARKET_DATA' });
    }

    async deliveryAggTrades(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/aggTrades', params, { base: this.dapi });
    }

    async deliveryUserTrades(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/userTrades', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryCommissionRate(symbol: string, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/commissionRate', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryGetDataStream(params = {}) {
        //A User Data Stream listenKey is valid for 60 minutes after creation. setInterval
        return await this.promiseRequest('v1/listenKey', params, { base: this.dapi, type: 'SIGNED', method: 'POST' });
    }

    async deliveryKeepDataStream(params = {}) {
        return await this.promiseRequest('v1/listenKey', params, { base: this.dapi, type: 'SIGNED', method: 'PUT' });
    }

    async deliveryCloseDataStream(params = {}) {
        return await this.promiseRequest('v1/listenKey', params, { base: this.dapi, type: 'SIGNED', method: 'DELETE' });
    }

    async deliveryLiquidationOrders(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/allForceOrders', params, { base: this.dapi });
    }

    async deliveryPositionRisk(params = {}) {
        return await this.promiseRequest('v1/positionRisk', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryLeverageBracket(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/leverageBracket', params, { base: this.dapi, type: 'USER_DATA' });
    }

    async deliveryLeverageBracketSymbols(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v2/leverageBracket', params, { base: this.dapi, type: 'USER_DATA' });
    }

    // leverage 1 to 125
    async deliveryLeverage(symbol, leverage, params = {}) {
        params.symbol = symbol;
        params.leverage = leverage;
        return await this.promiseRequest('v1/leverage', params, { base: this.dapi, method: 'POST', type: 'SIGNED' });
    }

    // ISOLATED, CROSSED
    async deliveryMarginType(symbol, marginType, params = {}) {
        params.symbol = symbol;
        params.marginType = marginType;
        return await this.promiseRequest('v1/marginType', params, { base: this.dapi, method: 'POST', type: 'SIGNED' });
    }

    // type: 1: Add postion margin，2: Reduce postion margin
    async deliveryPositionMargin(symbol, amount, type = 1, params = {}) {
        params.symbol = symbol;
        params.amount = amount;
        params.type = type;
        return await this.promiseRequest('v1/positionMargin', params, { base: this.dapi, method: 'POST', type: 'SIGNED' });
    }

    async deliveryPositionMarginHistory(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/positionMargin/history', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryIncome(params = {}) {
        return await this.promiseRequest('v1/income', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryBalance(params = {}) {
        return await this.promiseRequest('v1/balance', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryAccount(params = {}) {
        return await this.promiseRequest('v1/account', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryDepth(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/depth', params, { base: this.dapi });
    }

    async deliveryQuote(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        //let data = await this.promiseRequest( 'v1/ticker/bookTicker', params, {base:dapi} );
        //return data.reduce((out, i) => ((out[i.symbol] = i), out), {}),
        let data = await this.promiseRequest('v1/ticker/bookTicker', params, { base: this.dapi });
        return symbol ? data : data.reduce((out, i) => ((out[i.symbol] = i), out), {});
    }

    async deliveryBuy(symbol: string, quantity: number, price: number, params = {}) {
        return await this.deliveryOrder('BUY', symbol, quantity, price, params);
    }

    async deliverySell(symbol: string, quantity: number, price: number, params = {}) {
        return await this.deliveryOrder('SELL', symbol, quantity, price, params);
    }

    async deliveryMarketBuy(symbol, quantity, params = {}) {
        return await this.deliveryOrder('BUY', symbol, quantity, false, params);
    }

    async deliveryMarketSell(symbol, quantity, params = {}) {
        return await this.deliveryOrder('SELL', symbol, quantity, false, params);
    }

    // deliveryOrder, // side symbol quantity [price] [params]

    async deliveryOrderStatus(symbol: string, params = {}) { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        return await this.promiseRequest('v1/order', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryCancel(symbol: string, params = {}) { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        return await this.promiseRequest('v1/order', params, { base: this.dapi, type: 'SIGNED', method: 'DELETE' });
    }

    async deliveryCancelAll(symbol: string, params = {}) {
        params.symbol = symbol;
        return await this.promiseRequest('v1/allOpenOrders', params, { base: this.dapi, type: 'SIGNED', method: 'DELETE' });
    }

    async deliveryCountdownCancelAll(symbol: string, countdownTime = 0, params = {}) {
        params.symbol = symbol;
        params.countdownTime = countdownTime;
        return await this.promiseRequest('v1/countdownCancelAll', params, { base: this.dapi, type: 'SIGNED', method: 'POST' });
    }

    async deliveryOpenOrders(symbol?: string = undefined, params = {}) {
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/openOrders', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryAllOrders(symbol?: string = undefined, params = {}) { // Get all account orders; active, canceled, or filled.
        if (symbol) params.symbol = symbol;
        return await this.promiseRequest('v1/allOrders', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryPositionSideDual(params = {}) {
        return await this.promiseRequest('v1/positionSide/dual', params, { base: this.dapi, type: 'SIGNED' });
    }

    async deliveryChangePositionSideDual(dualSidePosition, params = {}) {
        params.dualSidePosition = dualSidePosition;
        return await this.promiseRequest('v1/positionSide/dual', params, { base: this.dapi, type: 'SIGNED', method: 'POST' });
    }

    //** Margin methods */

    /**
     * Creates an order
     * @param {string} side - BUY or SELL
     * @param {string} symbol - the symbol to buy
     * @param {numeric} quantity - the quantity required
     * @param {numeric} price - the price to pay for each unit
     * @param {object} flags - additional buy order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgOrder(side, symbol, quantity, price, flags = {}, isIsolated = 'FALSE') {
        return await this.marginOrder(side, symbol, quantity, price, { ...flags, isIsolated });
    }

    /**
     * Creates a buy order
     * @param {string} symbol - the symbol to buy
     * @param {numeric} quantity - the quantity required
     * @param {numeric} price - the price to pay for each unit
     * @param {object} flags - additional buy order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgBuy(symbol: string, quantity: number, price:number, flags = {}, isIsolated = 'FALSE') {
        return await this.marginOrder('BUY', symbol, quantity, price, { ...flags, isIsolated });
    }

    /**
     * Creates a sell order
     * @param {string} symbol - the symbol to sell
     * @param {numeric} quantity - the quantity required
     * @param {numeric} price - the price to sell each unit for
     * @param {object} flags - additional order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgSell(symbol: string, quantity: number, price:number, flags = {}, isIsolated = 'FALSE') {
        return await this.marginOrder('SELL', symbol, quantity, price, { ...flags, isIsolated });
    }

    /**
     * Creates a market buy order
     * @param {string} symbol - the symbol to buy
     * @param {numeric} quantity - the quantity required
     * @param {object} flags - additional buy order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgMarketBuy(symbol: string, quantity: number, flags = { type: 'MARKET' }, isIsolated = 'FALSE') {
        if (typeof flags.type === 'undefined') flags.type = 'MARKET';
        return await this.marginOrder('BUY', symbol, quantity, 0, { ...flags, isIsolated });
    }

    /**
     * Creates a market sell order
     * @param {string} symbol - the symbol to sell
     * @param {numeric} quantity - the quantity required
     * @param {object} flags - additional sell order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgMarketSell(symbol: string, quantity: number, flags = { type: 'MARKET' }, isIsolated = 'FALSE') {
        if (typeof flags.type === 'undefined') flags.type = 'MARKET';
        return await this.marginOrder('SELL', symbol, quantity, 0, { ...flags, isIsolated });
    }

    /**
     * Cancels an order
     * @param {string} symbol - the symbol to cancel
     * @param {string} orderid - the orderid to cancel
     * @return {undefined}
     */
    async mgCancel(symbol: string, orderid: string, isIsolated = 'FALSE') {
        return await this.signedRequest(this.sapi + 'v1/margin/order', { symbol: symbol, orderId: orderid, isIsolated }, 'DELETE');
    }

    /**
    * Gets all order of a given symbol
    * @param {string} symbol - the symbol
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async mgAllOrders(symbol: string, options = {}) {
        let parameters = Object.assign({ symbol: symbol }, options);
        return await this.signedRequest(this.sapi + 'v1/margin/allOrders', parameters);
    }

    /**
     * Gets the status of an order
     * @param {string} symbol - the symbol to check
     * @param {string} orderid - the orderid to check
     * @param {object} flags - any additional flags
     * @return {undefined}
     */
    async mgOrderStatus(symbol: string, orderid: string, flags = {}) {
        let parameters = Object.assign({ symbol: symbol, orderId: orderid }, flags);
        return await this.signedRequest(this.sapi + 'v1/margin/order', parameters);
    }

    /**
     * Gets open orders
     * @param {string} symbol - the symbol to get
     * @return {undefined}
     */
    async mgOpenOrders(symbol: string) {
        let parameters = symbol ? { symbol: symbol } : {};
        return await this.signedRequest(this.sapi + 'v1/margin/openOrders', parameters);
    }

    /**
     * Cancels all order of a given symbol
     * @param {string} symbol - the symbol to cancel all orders for
     * @param {function} callback - the callback function
     * @return {undefined}
     */
    mgCancelOrders(symbol: string) {
        // signedRequest(this.sapi + 'v1/margin/openOrders', { symbol: symbol }, function (error, json) {
        //     if (json.length === 0) {
        //         if (callback) return callback.call(this, 'No orders present for this symbol', {}, symbol);
        //     }
        //     for (let obj of json) {
        //         let quantity = obj.origQty - obj.executedQty;
        //         this.options.log('cancel order: ' + obj.side + ' ' + symbol + ' ' + quantity + ' @ ' + obj.price + ' #' + obj.orderId);
        //         signedRequest(this.sapi + 'v1/margin/order', { symbol: symbol, orderId: obj.orderId }, function (error, data) {
        //             if (callback) return callback.call(this, error, data, symbol);
        //         }, 'DELETE');
        //     }
        // }); // to do check this
        return await this.signedRequest(this.sapi + 'v1/margin/openOrders', { symbol: symbol }, 'DELETE');
    }

    /**
     * Transfer from main account to margin account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {object} options - additional options
     * @return {undefined}
     */
    async mgTransferMainToMargin(asset: string, amount: number) {
        let parameters = Object.assign({ asset: asset, amount: amount, type: 1 });
        return await this.signedRequest(this.sapi + 'v1/margin/transfer', parameters, 'POST');
    }

    /**
     * Transfer from margin account to main account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @return {undefined}
     */
    async mgTransferMarginToMain(asset: string, amount: number) {
        let parameters = Object.assign({ asset: asset, amount: amount, type: 2 });
        return await this.signedRequest(this.sapi + 'v1/margin/transfer', parameters, 'POST');
    }
    // /**
    // * Universal Transfer requires API permissions enabled
    // * @param {string} type - ENUM , example MAIN_UMFUTURE for SPOT to USDT futures, see https://binance-docs.github.io/apidocs/spot/en/#user-universal-transfer
    // * @param {string} asset - the asset - example :USDT
    // * @param {number} amount - the callback function
    // * @param {function} callback - the callback function (optionnal)
    // * @return {promise}
    // */
    // universalTransfer: (type, asset, amount, callback) =>
    //     universalTransfer(type, asset, amount, callback),

    /**
    * Get trades for a given symbol - margin account
    * @param {string} symbol - the symbol
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async mgTrades(symbol: string, options = {}) {
        let parameters = Object.assign({ symbol: symbol }, options);
        return await this.signedRequest(this.sapi + 'v1/margin/myTrades', parameters);
    }

    /**
    * Transfer from main account to delivery account
    * @param {string} asset - the asset
    * @param {number} amount - the asset
    * @param {object} options - additional options
    * @return {undefined}
    */
    async transferMainToFutures(asset: string, amount: number) {
        return await this.transferBetweenMainAndFutures(asset, amount, 1);
    }

    /**
 * Transfer from delivery account to main account
 * @param {string} asset - the asset
 * @param {number} amount - the asset
 * @param {function} callback - the callback function (optionnal)
 * @return {undefined}
 */
    async transferFuturesToMain(asset: string, amount: number) {
        return await this.transferBetweenMainAndFutures(asset, amount, 2)
    }

    /**
     * Transfer from main account to delivery account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {function} callback - the callback function (optionnal)
     * @param {object} options - additional options
     * @return {undefined}
     */
    async transferMainToDelivery(asset: string, amount: number) {
        return await this.transferBetweenMainAndFutures(asset, amount, 3)
    }

    /**
 * Transfer from delivery account to main account
 * @param {string} asset - the asset
 * @param {number} amount - the asset
 * @return {undefined}
 */
    async transferDeliveryToMain(asset: string, amount: number) {
        return await this.transferBetweenMainAndFutures(asset, amount, 4)
    }

    /**
     * Get maximum transfer-out amount of an asset
     * @param {string} asset - the asset
     * @return {undefined}
     */
    async maxTransferable(asset: string) {
        return await this.signedRequest(this.sapi + 'v1/margin/maxTransferable', { asset: asset });
    }

    /**
     * Margin account borrow/loan
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {string} isIsolated - the isolated option
     * @param {string} symbol - symbol for isolated margin
     * @return {undefined}
     */
    async mgBorrow(asset: string, amount: number, isIsolated = 'FALSE', symbol?: string = undefined) {
        let parameters = Object.assign({ asset: asset, amount: amount });
        if (isIsolated === 'TRUE' && !symbol) throw new Error('If "isIsolated" = "TRUE", "symbol" must be sent')
        const isolatedObj = isIsolated === 'TRUE' ? {
            isIsolated,
            symbol
        } : {}
        return await this.signedRequest(this.sapi + 'v1/margin/loan', { ...parameters, ...isolatedObj }, 'POST');
    }

    /**
     * Margin account borrow/loan
     * @param {string} asset - the asset
     * @param {object} options - additional options
     * @return {undefined}
     */
    async mgQueryLoan(asset: string, options) {
        let parameters = Object.assign({ asset: asset }, options);
        return await this.signedRequest(this.sapi + 'v1/margin/loan', { ...parameters }, 'GET');
    }

    /**
     * Margin account repay
     * @param {string} asset - the asset
     * @param {object} options - additional options
     * @return {undefined}
     */
    async mgQueryRepay(asset: string, options) {
        let parameters = Object.assign({ asset: asset }, options);
        return await this.signedRequest(this.sapi + 'v1/margin/repay', { ...parameters }, 'GET');
    }

    /**
     * Margin account repay
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {string} isIsolated - the isolated option
     * @param {string} symbol - symbol for isolated margin
     * @return {undefined}
     */
    async mgRepay(asset: string, amount: number, isIsolated = 'FALSE', symbol = null) {
        let parameters = Object.assign({ asset: asset, amount: amount });
        if (isIsolated === 'TRUE' && !symbol) throw new Error('If "isIsolated" = "TRUE", "symbol" must be sent')
        const isolatedObj = isIsolated === 'TRUE' ? {
            isIsolated,
            symbol
        } : {}
        return await this.signedRequest(this.sapi + 'v1/margin/repay', { ...parameters, ...isolatedObj }, 'POST');
    }

    /**
     * Margin account details
     * @param {boolean} isIsolated - the callback function
     * @return {undefined}
     */
    async mgAccount(isIsolated = false) {
        let endpoint = 'v1/margin';
        endpoint += (isIsolated) ? '/isolated' : '' + '/account';
        return await this.signedRequest(this.sapi + endpoint, {});
    }
    /**
     * Get maximum borrow amount of an asset
     * @param {string} asset - the asset
     * @return {undefined}
     */
    async maxBorrowable(asset: string) {
        return await this.signedRequest(this.sapi + 'v1/margin/maxBorrowable', { asset: asset });
    }

    // // Futures WebSocket Functions:
    // /**
    //  * Subscribe to a single futures websocket
    //  * @param {string} url - the futures websocket endpoint
    //  * @param {function} callback - optional execution callback
    //  * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
    //  * @return {WebSocket} the websocket reference
    //  */
    // async this.futuresSubscribeSingle(url, callback, params = {}) {
    //     return this.futuresSubscribeSingle(url, callback, params);
    // }

    // /**
    //  * Subscribe to a combined futures websocket
    //  * @param {string} streams - the list of websocket endpoints to connect to
    //  * @param {function} callback - optional execution callback
    //  * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
    //  * @return {WebSocket} the websocket reference
    //  */
    // futuresSubscribe(streams, callback, params = {}) {
    //     return futuresSubscribe(streams, callback, params);
    // }

    /**
     * Returns the known futures websockets subscriptions
     * @return {array} array of futures websocket subscriptions
     */
    getFuturesSubscriptions() {
        return this.futuresSubscriptions
    }

    // /**
    //  * Terminates a futures websocket
    //  * @param {string} endpoint - the string associated with the endpoint
    //  * @return {undefined}
    //  */
    // // futuresTerminate(endpoint) {
    // //     if (this.options.verbose) this.options.log('Futures WebSocket terminating:', endpoint);
    // //     return futuresTerminate(endpoint);
    // // }

    /**
     * Futures WebSocket aggregated trades
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresAggTradeStream(symbols: string[], callback) {
        let reconnect = () => {
            if (this.options.reconnect) this.futuresAggTradeStream(symbols, callback);
        };
        let subscription, cleanCallback = data => callback(fAggTradeConvertData(data));
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('futuresAggTradeStream: "symbols" cannot contain duplicate elements.');
            let streams = symbols.map(symbol => symbol.toLowerCase() + '@aggTrade');
            subscription = futuresSubscribe(streams, cleanCallback, { reconnect });
        } else {
            let symbol = symbols;
            subscription = this.futuresSubscribeSingle(symbol.toLowerCase() + '@aggTrade', cleanCallback, { reconnect });
        }
        return subscription.endpoint;
    }

    /**
     * Futures WebSocket mark price
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @param {string} speed - 1 second updates. leave blank for default 3 seconds
     * @return {string} the websocket endpoint
     */
    futuresMarkPriceStream(symbol: string? = false, callback = console.log, speed = '@1s') {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.futuresMarkPriceStream(symbol, callback, speed);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@markPrice` : '!markPrice@arr'
        let subscription = this.futuresSubscribeSingle(endpoint + speed, data => callback(this.fMarkPriceConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Futures WebSocket liquidations stream
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresLiquidationStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.futuresLiquidationStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@forceOrder` : '!forceOrder@arr'
        let subscription = this.futuresSubscribeSingle(endpoint, data => callback(this.fLiquidationConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Futures WebSocket prevDay ticker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresTickerStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.futuresTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@ticker` : '!ticker@arr'
        let subscription = this.futuresSubscribeSingle(endpoint, data => callback(fTickerConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Futures WebSocket miniTicker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresMiniTickerStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.futuresMiniTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@miniTicker` : '!miniTicker@arr'
        let subscription = this.futuresSubscribeSingle(endpoint, data => callback(fMiniTickerConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Futures WebSocket bookTicker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresBookTickerStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) fBookTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@bookTicker` : '!bookTicker'
        let subscription = this.futuresSubscribeSingle(endpoint, data => callback(fBookTickerConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Websocket futures klines
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @param {int} limit - maximum results, no more than 1000
     * @return {string} the websocket endpoint
     */
    futuresChart(symbols, interval, callback, limit = 500) {
        let reconnect = () => {
            if (this.options.reconnect) futuresChart(symbols, interval, callback, limit);
        };

        let futuresChartInit = symbol => {
            if (typeof this.futuresMeta[symbol] === 'undefined') this.futuresMeta[symbol] = {};
            if (typeof this.futuresMeta[symbol][interval] === 'undefined') this.futuresMeta[symbol][interval] = {};
            if (typeof this.futuresTicks[symbol] === 'undefined') this.futuresTicks[symbol] = {};
            if (typeof this.futuresTicks[symbol][interval] === 'undefined') this.futuresTicks[symbol][interval] = {};
            if (typeof this.futuresRealtime[symbol] === 'undefined') this.futuresRealtime[symbol] = {};
            if (typeof this.futuresRealtime[symbol][interval] === 'undefined') this.futuresRealtime[symbol][interval] = {};
            if (typeof this.futuresKlineQueue[symbol] === 'undefined') this.futuresKlineQueue[symbol] = {};
            if (typeof this.futuresKlineQueue[symbol][interval] === 'undefined') this.futuresKlineQueue[symbol][interval] = [];
            this.futuresMeta[symbol][interval].timestamp = 0;
        }

        let handleFuturesKlineStream = kline => {
            let symbol = kline.s, interval = kline.k.i;
            if (!this.futuresMeta[symbol][interval].timestamp) {
                if (typeof (this.futuresKlineQueue[symbol][interval]) !== 'undefined' && kline !== null) {
                    this.futuresKlineQueue[symbol][interval].push(kline);
                }
            } else {
                //this.options.log('futures klines at ' + kline.k.t);
                this.futuresKlineHandler(symbol, kline);
                if (callback) callback(symbol, interval, this.futuresKlineConcat(symbol, interval));
            }
        };

        let getFuturesKlineSnapshot = async (symbol: string, limit = 500) => {
            let data = await this.promiseRequest('v1/klines', { symbol, interval, limit }, { base: this.fapi });
            this.futuresKlineData(symbol, interval, data);
            //this.options.log('/futures klines at ' + this.futuresMeta[symbol][interval].timestamp);
            if (typeof this.futuresKlineQueue[symbol][interval] !== 'undefined') {
                for (let kline of this.futuresKlineQueue[symbol][interval]) this.futuresKlineHandler(symbol, kline, this.futuresMeta[symbol][interval].timestamp);
                delete this.futuresKlineQueue[symbol][interval];
            }
            if (callback) callback(symbol, interval, this.futuresKlineConcat(symbol, interval));
        };

        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('futuresChart: "symbols" array cannot contain duplicate elements.');
            symbols.forEach(futuresChartInit);
            let streams = symbols.map(symbol => `${symbol.toLowerCase()}@kline_${interval}`);
            subscription = this.futuresSubscribe(streams, handleFuturesKlineStream, reconnect);
            symbols.forEach(element => getFuturesKlineSnapshot(element, limit));
        } else {
            let symbol = symbols;
            futuresChartInit(symbol);
            subscription = this.futuresSubscribeSingle(symbol.toLowerCase() + '@kline_' + interval, handleFuturesKlineStream, { reconnect });
            getFuturesKlineSnapshot(symbol, limit);
        }
        return subscription.endpoint;
    }

    /**
     * Websocket futures candlesticks
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresCandlesticks(symbols: string[] | string, interval: string, callback) {
        let reconnect = () => {
            if (this.options.reconnect) this.futuresCandlesticks(symbols, interval, callback);
        };
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('futuresCandlesticks: "symbols" array cannot contain duplicate elements.');
            let streams = symbols.map(symbol => symbol.toLowerCase() + '@kline_' + interval);
            subscription = this.futuresSubscribe(streams, callback, { reconnect });
        } else {
            let symbol = symbols.toLowerCase();
            subscription = this.futuresSubscribeSingle(symbol + '@kline_' + interval, callback, { reconnect });
        }
        return subscription.endpoint;
    }

    // Delivery WebSocket Functions:
    /**
     * Subscribe to a single delivery websocket
     * @param {string} url - the delivery websocket endpoint
     * @param {function} callback - optional execution callback
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} the websocket reference
     */
    // deliverySubscribeSingle(url, callback, params = {}) {
    //     return deliverySubscribeSingle(url, callback, params);
    // }

    // /**
    //  * Subscribe to a combined delivery websocket
    //  * @param {string} streams - the list of websocket endpoints to connect to
    //  * @param {function} callback - optional execution callback
    //  * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
    //  * @return {WebSocket} the websocket reference
    //  */
    // deliverySubscribe(streams, callback, params = {}) {
    //     return deliverySubscribe(streams, callback, params);
    // }

    /**
     * Returns the known delivery websockets subscriptions
     * @return {array} array of delivery websocket subscriptions
     */
    getDeliverySubscriptions() {
        return this.deliverySubscriptions;
    }

    // /**
    //  * Terminates a delivery websocket
    //  * @param {string} endpoint - the string associated with the endpoint
    //  * @return {undefined}
    //  */
    // deliveryTerminate(endpoint) {
    //     if (this.options.verbose) this.options.log('Delivery WebSocket terminating:', endpoint);
    //     return deliveryTerminate(endpoint);
    // }

    /**
     * Delivery WebSocket aggregated trades
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryAggTradeStream(symbols: string[] | string, callback) {
        let reconnect = () => {
            if (this.options.reconnect) this.deliveryAggTradeStream(symbols, callback);
        };
        let subscription, cleanCallback = data => callback(this.dAggTradeConvertData(data));
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('deliveryAggTradeStream: "symbols" cannot contain duplicate elements.');
            let streams = symbols.map(symbol => symbol.toLowerCase() + '@aggTrade');
            subscription = this.deliverySubscribe(streams, cleanCallback, { reconnect });
        } else {
            let symbol = symbols;
            subscription = this.deliverySubscribeSingle(symbol.toLowerCase() + '@aggTrade', cleanCallback, { reconnect });
        }
        return subscription.endpoint;
    }

    /**
     * Delivery WebSocket mark price
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @param {string} speed - 1 second updates. leave blank for default 3 seconds
     * @return {string} the websocket endpoint
     */
    deliveryMarkPriceStream(symbol = false, callback = console.log, speed = '@1s') {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.deliveryMarkPriceStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@markPrice` : '!markPrice@arr'
        let subscription = this.deliverySubscribeSingle(endpoint + speed, data => callback(this.dMarkPriceConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Delivery WebSocket liquidations stream
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryLiquidationStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.deliveryLiquidationStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@forceOrder` : '!forceOrder@arr'
        let subscription = this.deliverySubscribeSingle(endpoint, data => callback(this.dLiquidationConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Delivery WebSocket prevDay ticker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryTickerStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.deliveryTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@ticker` : '!ticker@arr'
        let subscription = this.deliverySubscribeSingle(endpoint, data => callback(this.dTickerConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Delivery WebSocket miniTicker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryMiniTickerStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.deliveryMiniTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@miniTicker` : '!miniTicker@arr'
        let subscription = this.deliverySubscribeSingle(endpoint, data => callback(this.dMiniTickerConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Delivery WebSocket bookTicker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryBookTickerStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect) this.deliveryBookTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@bookTicker` : '!bookTicker'
        let subscription = this.deliverySubscribeSingle(endpoint, data => callback(this.dBookTickerConvertData(data)), { reconnect });
        return subscription.endpoint;
    }

    /**
     * Websocket delivery klines
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @param {int} limit - maximum results, no more than 1000
     * @return {string} the websocket endpoint
     */
    deliveryChart(symbols, interval, callback, limit = 500) {
        let reconnect = () => {
            if (this.options.reconnect) this.deliveryChart(symbols, interval, callback, limit);
        };

        let deliveryChartInit = symbol => {
            if (typeof this.deliveryMeta[symbol] === 'undefined') this.deliveryMeta[symbol] = {};
            if (typeof this.deliveryMeta[symbol][interval] === 'undefined') this.deliveryMeta[symbol][interval] = {};
            if (typeof this.deliveryTicks[symbol] === 'undefined') this.deliveryTicks[symbol] = {};
            if (typeof this.deliveryTicks[symbol][interval] === 'undefined') this.deliveryTicks[symbol][interval] = {};
            if (typeof this.deliveryRealtime[symbol] === 'undefined') this.deliveryRealtime[symbol] = {};
            if (typeof this.deliveryRealtime[symbol][interval] === 'undefined') this.deliveryRealtime[symbol][interval] = {};
            if (typeof this.deliveryKlineQueue[symbol] === 'undefined') this.deliveryKlineQueue[symbol] = {};
            if (typeof this.deliveryKlineQueue[symbol][interval] === 'undefined') this.deliveryKlineQueue[symbol][interval] = [];
            this.deliveryMeta[symbol][interval].timestamp = 0;
        }

        let handleDeliveryKlineStream = kline => {
            let symbol = kline.s, interval = kline.k.i;
            if (!this.deliveryMeta[symbol][interval].timestamp) {
                if (typeof (this.deliveryKlineQueue[symbol][interval]) !== 'undefined' && kline !== null) {
                    this.deliveryKlineQueue[symbol][interval].push(kline);
                }
            } else {
                //this.options.log('futures klines at ' + kline.k.t);
                this.deliveryKlineHandler(symbol, kline);
                if (callback) callback(symbol, interval, this.deliveryKlineConcat(symbol, interval));
            }
        };

        let getDeliveryKlineSnapshot = async (symbol, limit = 500) => {
            let data = await this.promiseRequest('v1/klines', { symbol, interval, limit }, { base: this.fapi });
            deliveryKlineData(symbol, interval, data);
            //this.options.log('/delivery klines at ' + this.deliveryMeta[symbol][interval].timestamp);
            if (typeof this.deliveryKlineQueue[symbol][interval] !== 'undefined') {
                for (let kline of this.deliveryKlineQueue[symbol][interval]) this.deliveryKlineHandler(symbol, kline, this.deliveryMeta[symbol][interval].timestamp);
                delete this.deliveryKlineQueue[symbol][interval];
            }
            if (callback) callback(symbol, interval, this.deliveryKlineConcat(symbol, interval));
        };

        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('deliveryChart: "symbols" array cannot contain duplicate elements.');
            symbols.forEach(deliveryChartInit);
            let streams = symbols.map(symbol => `${symbol.toLowerCase()}@kline_${interval}`);
            subscription = this.deliverySubscribe(streams, handleDeliveryKlineStream, reconnect);
            symbols.forEach(element => getDeliveryKlineSnapshot(element, limit));
        } else {
            let symbol = symbols;
            deliveryChartInit(symbol);
            subscription =  this.deliverySubscribeSingle(symbol.toLowerCase() + '@kline_' + interval, handleDeliveryKlineStream, reconnect);
            getDeliveryKlineSnapshot(symbol, limit);
        }
        return subscription.endpoint;
    }

    /**
     * Websocket delivery candlesticks
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryCandlesticks(symbols, interval, callback) {
        let reconnect = () => {
            if (this.options.reconnect)  this.deliveryCandlesticks(symbols, interval, callback);
        };
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('deliveryCandlesticks: "symbols" array cannot contain duplicate elements.');
            let streams = symbols.map(symbol => symbol.toLowerCase() + '@kline_' + interval);
            subscription =  this.deliverySubscribe(streams, callback, { reconnect });
        } else {
            let symbol = symbols.toLowerCase();
            subscription =  this.deliverySubscribeSingle(symbol + '@kline_' + interval, callback, { reconnect });
        }
        return subscription.endpoint;
    }

    /**
     * Userdata websockets function
     * @param {function} callback - the callback function
     * @param {function} execution_callback - optional execution callback
     * @param {function} subscribed_callback - subscription callback
     * @param {function} list_status_callback - status callback
     * @return {undefined}
     */
    userData(callback, execution_callback = false, subscribed_callback = false, list_status_callback = false) {
        let reconnect = () => {
            if (this.options.reconnect) this.userData(callback, execution_callback, subscribed_callback);
        };
        apiRequest(this.getSpotUrl() + 'v3/userDataStream', {}, function (error, response) {
            this.options.listenKey = response.listenKey;
            setTimeout(function userDataKeepAlive() { // keepalive
                try {
                    apiRequest(this.getSpotUrl() + 'v3/userDataStream?listenKey=' + this.options.listenKey, {}, function (err) {
                        if (err) setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                        else setTimeout(userDataKeepAlive, 60 * 30 * 1000); // 30 minute keepalive
                    }, 'PUT');
                } catch (error) {
                    setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                }
            }, 60 * 30 * 1000); // 30 minute keepalive
            this.options.balance_callback = callback;
            this.options.execution_callback = execution_callback ? execution_callback : callback;//This change is required to listen for Orders
            this.options.list_status_callback = list_status_callback;
            const subscription = this.subscribe(this.options.listenKey, userDataHandler, reconnect);
            if (subscribed_callback) subscribed_callback(subscription.endpoint);
        }, 'POST');
    }

    /**
     * Margin Userdata websockets function
     * @param {function} callback - the callback function
     * @param {function} execution_callback - optional execution callback
     * @param {function} subscribed_callback - subscription callback
     * @param {function} list_status_callback - status callback
     * @return {undefined}
     */
    userMarginData(callback, execution_callback = false, subscribed_callback = false, list_status_callback = false) {
        let reconnect = () => {
            if (this.options.reconnect) this.userMarginData(callback, execution_callback, subscribed_callback);
        };
        apiRequest(this.sapi + 'v1/userDataStream', {}, function (error, response) {
            this.options.listenMarginKey = response.listenKey;
            setTimeout(function userDataKeepAlive() { // keepalive
                try {
                    apiRequest(this.sapi + 'v1/userDataStream?listenKey=' + this.options.listenMarginKey, {}, function (err) {
                        if (err) setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                        else setTimeout(userDataKeepAlive, 60 * 30 * 1000); // 30 minute keepalive
                    }, 'PUT');
                } catch (error) {
                    setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                }
            }, 60 * 30 * 1000); // 30 minute keepalive
            this.options.margin_balance_callback = callback;
            this.options.margin_execution_callback = execution_callback;
            this.options.margin_list_status_callback = list_status_callback;
            const subscription = this.subscribe(this.options.listenMarginKey, userMarginDataHandler, reconnect);
            if (subscribed_callback) subscribed_callback(subscription.endpoint);
        }, 'POST');
    }

    /**
     * Future Userdata websockets function
     * @param {function} margin_call_callback
     * @param {function} account_update_callback
     * @param {function} order_update_callback
     * @param {Function} subscribed_callback - subscription callback
     */
    userFutureData(margin_call_callback, account_update_callback = undefined, order_update_callback = undefined, subscribed_callback = undefined, account_config_update_callback = undefined) {
        const url = (this.options.test) ? fapiTest : fapi;

        let reconnect = () => {
            if (this.options.reconnect) this.userFutureData(margin_call_callback, account_update_callback, order_update_callback, subscribed_callback)
        }

        apiRequest(url + 'v1/listenKey', {}, function (error, response) {
            this.options.listenFutureKey = response.listenKey;
            setTimeout(function userDataKeepAlive() { // keepalive
                try {
                    apiRequest(url + 'v1/listenKey?listenKey=' + this.options.listenFutureKey, {}, function (err) {
                        if (err) setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                        else setTimeout(userDataKeepAlive, 60 * 30 * 1000); // 30 minute keepalive
                    }, 'PUT');
                } catch (error) {
                    setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                }
            }, 60 * 30 * 1000); // 30 minute keepalive
            this.options.future_margin_call_callback = margin_call_callback;
            this.options.future_account_update_callback = account_update_callback;
            this.options.future_account_config_update_callback = account_config_update_callback;
            this.options.future_order_update_callback = order_update_callback;
            const subscription = futuresSubscribe(this.options.listenFutureKey, userFutureDataHandler, { reconnect });
            if (subscribed_callback) subscribed_callback(subscription.endpoint);
        }, 'POST');
    }

    /**
   * Delivery Userdata websockets function
   * @param {function} margin_call_callback
   * @param {function} account_update_callback
   * @param {function} order_update_callback
   * @param {Function} subscribed_callback - subscription callback
   */
    userDeliveryData(
        margin_call_callback,
        account_update_callback = undefined,
        order_update_callback = undefined,
        subscribed_callback = undefined
    ) {
        const url = this.options.test ? this.dapiTest : this.dapi;

        let reconnect = () => {
            if (this.options.reconnect)
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
            function (error, response) {
                this.options.listenDeliveryKey = response.listenKey;
                setTimeout(function userDataKeepAlive() {
                    // keepalive
                    try {
                        apiRequest(
                            url +
                            "v1/listenKey?listenKey=" +
                            this.options.listenDeliveryKey,
                            {},
                            function (err) {
                                if (err) setTimeout(userDataKeepAlive, 60000);
                                // retry in 1 minute
                                else setTimeout(userDataKeepAlive, 60 * 30 * 1000); // 30 minute keepalive
                            },
                            "PUT"
                        );
                    } catch (error) {
                        setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                    }
                }, 60 * 30 * 1000); // 30 minute keepalive
                this.options.delivery_margin_call_callback = margin_call_callback;
                this.options.delivery_account_update_callback = account_update_callback;
                this.options.delivery_order_update_callback = order_update_callback;
                const subscription = deliverySubscribe(
                    this.options.listenDeliveryKey,
                    userDeliveryDataHandler,
                    { reconnect }
                );
                if (subscribed_callback) subscribed_callback(subscription.endpoint);
            },
            "POST"
        );
    }

    // /**
    //  * Subscribe to a generic websocket
    //  * @param {string} url - the websocket endpoint
    //  * @param {function} callback - optional execution callback
    //  * @param {boolean} reconnect - subscription callback
    //  * @return {WebSocket} the websocket reference
    //  */
    // // subscribe(url, callback, reconnect = false) {
    // //     return subscribe(url, callback, reconnect);
    // // }

    // /**
    //  * Subscribe to a generic combined websocket
    //  * @param {string} url - the websocket endpoint
    //  * @param {function} callback - optional execution callback
    //  * @param {boolean} reconnect - subscription callback
    //  * @return {WebSocket} the websocket reference
    //  */
    // // subscribeCombined(url, callback, reconnect = false) {
    // //     return subscribeCombined(url, callback, reconnect);
    // // }

    // /**
    //  * Returns the known websockets subscriptions
    //  * @return {array} array of web socket subscriptions
    //  */
    getSubscriptions() {
        return this.subscriptions;
    }

    // /**
    //  * Terminates a web socket
    //  * @param {string} endpoint - the string associated with the endpoint
    //  * @return {undefined}
    //  */
    // terminate(endpoint) {
    //     if (this.options.verbose) this.options.log('WebSocket terminating:', endpoint);
    //     return this.terminate(endpoint);
    // }

    /**
     * Websocket depth chart
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    depthStream(symbols, callback) {
        let reconnect = () => {
            if (this.options.reconnect) this.depthStream(symbols, callback);
        };
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('depth: "symbols" cannot contain duplicate elements.');
            let streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@depth@100ms';
            });
            subscription = this.subscribeCombined(streams, callback, reconnect);
        } else {
            let symbol = symbols;
            subscription = this.subscribe(symbol.toLowerCase() + '@depth@100ms', callback, reconnect);
        }
        return subscription.endpoint;
    }

    /**
     * Websocket depth cache
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {function} callback - callback function
     * @param {int} limit - the number of entries
     * @return {string} the websocket endpoint
     */
    depthCacheStream(symbols, callback, limit = 500) {
        let reconnect = () => {
            if (this.options.reconnect)  this.depthCacheStream(symbols, limit);
        };

        let symbolDepthInit = symbol => {
            if (typeof this.depthCacheContext[symbol] === 'undefined') this.depthCacheContext[symbol] = {};
            let context = this.depthCacheContext[symbol];
            context.snapshotUpdateId = null;
            context.lastEventUpdateId = null;
            context.messageQueue = [];
            this.depthCache[symbol] = { bids: {}, asks: {} };
        };

        let assignEndpointIdToContext = (symbol, endpointId) => {
            if (this.depthCacheContext[symbol]) {
                let context = this.depthCacheContext[symbol];
                context.endpointId = endpointId;
            }
        };

        let handleDepthStreamData = depth => {
            let symbol = depth.s;
            let context = this.depthCacheContext[symbol];
            if (context.messageQueue && !context.snapshotUpdateId) {
                context.messageQueue.push(depth);
            } else {
                try {
                    this.depthHandler(depth);
                } catch (err) {
                    return this.terminate(context.endpointId, true);
                }
                if (callback) callback(symbol, this.depthCache[symbol], context);
            }
        };

        let getSymbolDepthSnapshot = (symbol, cb) => {
            publicRequest(this.getSpotUrl() + 'v3/depth', { symbol: symbol, limit: limit }, function (error, json) {
                if (error) {
                    return cb(error, null);
                }
                // Store symbol next use
                json.symb = symbol;
                cb(null, json)
            });
        };

        let updateSymbolDepthCache = json => {
            // Get previous store symbol
            let symbol = json.symb;
            // Initialize depth cache from snapshot
            this.depthCache[symbol] = depthData(json);
            // Prepare depth cache context
            let context = this.depthCacheContext[symbol];
            context.snapshotUpdateId = json.lastUpdateId;
            context.messageQueue = context.messageQueue.filter(depth => depth.u > context.snapshotUpdateId);
            // Process any pending depth messages
            for (let depth of context.messageQueue) {
                /* Although sync errors shouldn't ever happen here, we catch and swallow them anyway
                 just in case. The stream handler function above will deal with broken caches. */
                try {
                    this.depthHandler(depth);
                } catch (err) {
                    // Do nothing
                }
            }
            delete context.messageQueue;
            if (callback) callback(symbol, this.depthCache[symbol]);
        };

        /* If an array of symbols are sent we use a combined stream connection rather.
         This is transparent to the developer, and results in a single socket connection.
         This essentially eliminates "unexpected response" errors when subscribing to a lot of data. */
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('depthCache: "symbols" cannot contain duplicate elements.');
            symbols.forEach(symbolDepthInit);
            let streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + `@depth@100ms`;
            });
            subscription = this.subscribeCombined(streams, handleDepthStreamData, reconnect, function () {
                async.mapLimit(symbols, 50, getSymbolDepthSnapshot, (err, results) => {
                    if (err) throw err;
                    results.forEach(updateSymbolDepthCache);
                });
            });
            symbols.forEach(s => assignEndpointIdToContext(s, subscription.endpoint));
        } else {
            let symbol = symbols;
            symbolDepthInit(symbol);
            subscription = this.subscribe(symbol.toLowerCase() + `@depth@100ms`, handleDepthStreamData, reconnect, function () {
                async.mapLimit([symbol], 1, getSymbolDepthSnapshot, (err, results) => {
                    if (err) throw err;
                    results.forEach(updateSymbolDepthCache);
                });
            });
            assignEndpointIdToContext(symbol, subscription.endpoint);
        }
        return subscription.endpoint;
    }

    /**
     * Clear Websocket depth cache
     * @param {String|Array} symbols   - a single symbol, or an array of symbols, to clear the cache of
     * @returns {void}
     */
    clearDepthCache(symbols) {
        const symbolsArr = Array.isArray(symbols) ? symbols : [symbols];
        symbolsArr.forEach(thisSymbol => {
            delete this.depthCache[thisSymbol];
        });
    }

    /**
     * Websocket staggered depth cache
     * @param {array/string} symbols - an array of symbols to query
     * @param {function} callback - callback function
     * @param {int} limit - the number of entries
     * @param {int} stagger - ms between each depth cache
     * @return {Promise} the websocket endpoint
     */
    depthCacheStaggered(symbols, callback, limit = 100, stagger = 200) {
        if (!Array.isArray(symbols)) symbols = [symbols];
        let chain = null;

        symbols.forEach(symbol => {
            let promise = () => new Promise(resolve => {
                this.depthCache(symbol, callback, limit);
                setTimeout(resolve, stagger);
            });
            chain = chain ? chain.then(promise) : promise();
        });

        return chain;
    }

    /**
     * Websocket aggregated trades
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    aggTradesStream(symbols, callback) {
        let reconnect = () => {
            if (this.options.reconnect) this.aggTradesStream(symbols, callback);
        };
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('trades: "symbols" cannot contain duplicate elements.');
            let streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@aggTrade';
            });
            subscription = this.subscribeCombined(streams, callback, reconnect);
        } else {
            let symbol = symbols;
            subscription = this.subscribe(symbol.toLowerCase() + '@aggTrade', callback, reconnect);
        }
        return subscription.endpoint;
    }

    /**
    * Websocket raw trades
    * @param {array/string} symbols - an array or string of symbols to query
    * @param {function} callback - callback function
    * @return {string} the websocket endpoint
    */
    tradesStream(symbols: string[], callback) {
        let reconnect = () => {
            if (this.options.reconnect) this.tradesStream(symbols, callback);
        };

        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('trades: "symbols" cannot contain duplicate elements.');
            let streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@trade';
            });
            subscription = this.subscribeCombined(streams, callback, reconnect);
        } else {
            let symbol = symbols;
            subscription = this.subscribe(symbol.toLowerCase() + '@trade', callback, reconnect);
        }
        return subscription.endpoint;
    }

    /**
     * Websocket klines
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @param {int} limit - maximum results, no more than 1000
     * @return {string} the websocket endpoint
     */
    chart(symbols, interval, callback, limit = 500) {
        let reconnect = () => {
            if (this.options.reconnect) this.chart(symbols, interval, callback, limit);
        };

        let symbolChartInit = symbol => {
            if (typeofthis.info[symbol] === 'undefined') this.info[symbol] = {};
            if (typeofthis.info[symbol][interval] === 'undefined') this.info[symbol][interval] = {};
            if (typeof this.ohlc[symbol] === 'undefined') this.ohlc[symbol] = {};
            if (typeof this.ohlc[symbol][interval] === 'undefined') this.ohlc[symbol][interval] = {};
            if (typeof this.ohlcLatest[symbol] === 'undefined') this.ohlcLatest[symbol] = {};
            if (typeof this.ohlcLatest[symbol][interval] === 'undefined') this.ohlcLatest[symbol][interval] = {};
            if (typeof this.klineQueue[symbol] === 'undefined') this.klineQueue[symbol] = {};
            if (typeof this.klineQueue[symbol][interval] === 'undefined') this.klineQueue[symbol][interval] = [];
            this.info[symbol][interval].timestamp = 0;
        }

        let handleKlineStreamData = kline => {
            let symbol = kline.s, interval = kline.k.i;
            if (!this.info[symbol][interval].timestamp) {
                if (typeof (this.klineQueue[symbol][interval]) !== 'undefined' && kline !== null) {
                    this.klineQueue[symbol][interval].push(kline);
                }
            } else {
                //this.options.log('@klines at ' + kline.k.t);
                klineHandler(symbol, kline);
                if (callback) callback(symbol, interval, klineConcat(symbol, interval));
            }
        };

        let getSymbolKlineSnapshot = (symbol, limit = 500) => {
            publicRequest(this.getSpotUrl() + 'v3/klines', { symbol: symbol, interval: interval, limit: limit }, function (error, data) {
                klineData(symbol, interval, data);
                //this.options.log('/klines at ' +this.info[symbol][interval].timestamp);
                if (typeof this.klineQueue[symbol][interval] !== 'undefined') {
                    for (let kline of this.klineQueue[symbol][interval]) klineHandler(symbol, kline, this.info[symbol][interval].timestamp);
                    delete this.klineQueue[symbol][interval];
                }
                if (callback) callback(symbol, interval, klineConcat(symbol, interval));
            });
        };

        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('chart: "symbols" cannot contain duplicate elements.');
            symbols.forEach(symbolChartInit);
            let streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@kline_' + interval;
            });
            subscription = this.subscribeCombined(streams, handleKlineStreamData, reconnect);
            symbols.forEach(element => getSymbolKlineSnapshot(element, limit));
        } else {
            let symbol = symbols;
            symbolChartInit(symbol);
            subscription = this.subscribe(symbol.toLowerCase() + '@kline_' + interval, handleKlineStreamData, reconnect);
            getSymbolKlineSnapshot(symbol, limit);
        }
        return subscription.endpoint;
    }

    /**
     * Websocket candle sticks
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    candlesticksStream(symbols, interval, callback) {
        let reconnect = () => {
            if (this.options.reconnect) this.candlesticksStream(symbols, interval, callback);
        };

        /* If an array of symbols are sent we use a combined stream connection rather.
         This is transparent to the developer, and results in a single socket connection.
         This essentially eliminates "unexpected response" errors when subscribing to a lot of data. */
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('candlesticks: "symbols" cannot contain duplicate elements.');
            let streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@kline_' + interval;
            });
            subscription = this.subscribeCombined(streams, callback, reconnect);
        } else {
            let symbol = symbols.toLowerCase();
            subscription = this.subscribe(symbol + '@kline_' + interval, callback, reconnect);
        }
        return subscription.endpoint;
    }

    /**
     * Websocket mini ticker
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    miniTicker(callback) {
        let reconnect = () => {
            if (this.options.reconnect) miniTicker(callback);
        };
        let subscription = this.subscribe('!miniTicker@arr', function (data) {
            let markets = {};
            for (let obj of data) {
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
            callback(markets);
        }, reconnect);
        return subscription.endpoint;
    }

    /**
     * Spot WebSocket bookTicker (bid/ask quotes including price & amount)
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    bookTickersStream(symbol = false, callback = console.log) {
        if (typeof symbol == 'function') {
            callback = symbol;
            symbol = false;
        }
        let reconnect = () => {
            if (this.options.reconnect)  this.bookTickersStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@bookTicker` : '!bookTicker'
        let subscription = this.subscribe(endpoint, data => callback(this.fBookTickerConvertData(data)), reconnect);
        return subscription.endpoint;
    }

    /**
     * Websocket prevday percentage
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {function} callback - callback function
     * @param {boolean} singleCallback - avoid call one callback for each symbol in data array
     * @return {string} the websocket endpoint
     */
    prevDayStream(symbols, callback, singleCallback) {
        let reconnect = () => {
            if (this.options.reconnect) this.prevDayStream(symbols, callback, singleCallback);
        };

        let subscription;
        // Combine stream for array of symbols
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('prevDay: "symbols" cannot contain duplicate elements.');
            let streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@ticker';
            });
            subscription = this.subscribeCombined(streams, function (data) {
                this.prevDayStreamHandler(data, callback);
            }, reconnect);
            // Raw stream for  a single symbol
        } else if (symbols) {
            let symbol = symbols;
            subscription = this.subscribe(symbol.toLowerCase() + '@ticker', function (data) {
                this.prevDayStreamHandler(data, callback);
            }, reconnect);
            // Raw stream of all listed symbols
        } else {
            subscription = this.subscribe('!ticker@arr', function (data) {
                if (singleCallback) {
                    this.prevDayStreamHandler(data, callback);
                } else {
                    for (let line of data) {
                        this.prevDayStreamHandler(line, callback);
                    }
                }
            }, reconnect);
        }
        return subscription.endpoint;
    }

}