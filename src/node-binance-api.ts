
import WebSocket from 'ws';
// import request from 'request';
import crypto from 'crypto';
import file from 'fs';
import url from 'url';
import JSONbig from 'json-bigint';
// @ts-ignore
import { HttpsProxyAgent } from 'https-proxy-agent';
// @ts-ignore
import { SocksProxyAgent } from 'socks-proxy-agent';
// @ts-ignore
import nodeFetch from 'node-fetch';

// @ts-ignore
import zip from 'lodash.zipobject';
import stringHash from 'string-hash';
// eslint-disable-next-line
import { Interval, PositionRisk, Order, FuturesOrder, PositionSide, WorkingType, OrderType, OrderStatus, TimeInForce, Callback, IConstructorArgs, OrderSide, FundingRate, CancelOrder, AggregatedTrade, Trade, MyTrade, WithdrawHistoryResponse, DepositHistoryResponse, DepositAddress, WithdrawResponse, Candle, FuturesCancelAllOpenOrder, OrderBook, Ticker, FuturesUserTrade, Account, FuturesAccountInfo, FuturesBalance, QueryOrder, HttpMethod, BookTicker, DailyStats, PremiumIndex, OpenInterest, IWebsocketsMethods, SymbolConfig, OCOOrder, FuturesAlgoOrder, CancelAlgoOrder } from './types.js';
// export { Interval, PositionRisk, Order, FuturesOrder, PositionSide, WorkingType, OrderType, OrderStatus, TimeInForce, Callback, IConstructorArgs, OrderSide, FundingRate, CancelOrder, AggregatedTrade, Trade, MyTrade, WithdrawHistoryResponse, DepositHistoryResponse, DepositAddress, WithdrawResponse, Candle, FuturesCancelAllOpenOrder, OrderBook, Ticker, FuturesUserTrade, FuturesAccountInfo, FuturesBalance, QueryOrder } from './types';

export interface Dictionary<T> {
    [key: string]: T;
}

export type Dict = Dictionary<any>;

export default class Binance {

    domain = 'com';
    base = `https://api.binance.${this.domain}/api/`;
    baseTest = `https://testnet.binance.vision/api/`;
    baseDemo = `https://demo-api.binance.com/api/`;
    wapi = `https://api.binance.${this.domain}/wapi/`;
    sapi = `https://api.binance.${this.domain}/sapi/`;
    fapi = `https://fapi.binance.${this.domain}/fapi/`;
    dapi = `https://dapi.binance.${this.domain}/dapi/`;
    fapiTest = `https://testnet.binancefuture.com/fapi/`;
    fapiDemo = `https://demo-fapi.binance.com/fapi/`;
    dapiTest = `https://testnet.binancefuture.com/dapi/`;
    dapiDemo = `https://demo-dapi.binance.com/dapi/`;
    fstream = `wss://fstream.binance.${this.domain}/stream?streams=`;
    fstreamSingle = `wss://fstream.binance.${this.domain}/ws/`;
    fstreamSingleTest = `wss://stream.binancefuture.${this.domain}/ws/`;
    fstreamSingleDemo = `wss://fstream.binancefuture.com/ws/`;
    fstreamTest = `wss://stream.binancefuture.${this.domain}/stream?streams=`;
    fstreamDemo = `wss://fstream.binancefuture.com/stream?streams=`;
    dstream = `wss://dstream.binance.${this.domain}/stream?streams=`;
    dstreamSingle = `wss://dstream.binance.${this.domain}/ws/`;
    dstreamSingleTest = `wss://dstream.binancefuture.${this.domain}/ws/`;
    dstreamSingleDemo = `wss://dstream.binancefuture.com/ws/`;
    dstreamTest = `wss://dstream.binancefuture.${this.domain}/stream?streams=`;
    dstreamDemo = `wss://dstream.binancefuture.com/stream?streams=`;
    stream = `wss://stream.binance.${this.domain}:9443/ws/`;
    streamTest = `wss://stream.testnet.binance.vision/ws/`;
    streamDemo = `wss://demo-stream.binance.com/ws/`;
    combineStream = `wss://stream.binance.${this.domain}:9443/stream?streams=`;
    combineStreamTest = `wss://stream.testnet.binance.vision/stream?streams=`;
    combineStreamDemo = `wss://demo-stream.binance.com/stream?streams=`;

    verbose = false;

    futuresListenKeyKeepAlive: number = 60 * 30 * 1000; // 30 minutes
    spotListenKeyKeepAlive: number = 60 * 30 * 1000; // 30 minutes
    heartBeatInterval: number = 30000; // 30 seconds

    // proxy variables
    urlProxy: string = undefined;
    httpsProxy: string = undefined;
    socksProxy: string = undefined;
    nodeFetch: any = undefined;

    APIKEY: string = undefined;
    APISECRET: string = undefined;
    PRIVATEKEY: string = undefined;
    PRIVATEKEYPASSWORD: string = undefined;
    test = false; // sandbox mode
    demo = false; // demo mode

    timeOffset: number = 0;

    userAgent = 'Mozilla/4.0 (compatible; Node Binance API)';
    contentType = 'application/x-www-form-urlencoded';
    SPOT_PREFIX = "x-B3AUXNYV";
    CONTRACT_PREFIX = "x-ftGmvgAN";

    // Websockets Options
    isAlive = false;
    socketHeartbeatInterval: any = null;
    // endpoint: string = ""; // endpoint for WS?
    reconnect = true;

    headers: Dict = {};
    subscriptions: Dict = {};
    futuresSubscriptions: Dict = {};
    futuresInfo: Dict = {};
    futuresMeta: Dict = {};
    futuresTicks: Dict = {};
    futuresRealtime: Dict = {};
    futuresKlineQueue: Dict = {};
    deliverySubscriptions: Dict = {};
    deliveryInfo: Dict = {};
    deliveryMeta: Dict = {};
    deliveryTicks: Dict = {};
    deliveryRealtime: Dict = {};
    deliveryKlineQueue: Dict = {};
    depthCache: Dict = {};
    depthCacheContext: Dict = {};
    ohlcLatest: Dict = {};
    klineQueue: Dict = {};
    ohlc: Dict = {};
    info: Dict = {};

    websockets: IWebsocketsMethods = { // deprecated structure, keeping it for backwards compatibility
        userData: this.userData.bind(this),
        userMarginData: this.userMarginData.bind(this),
        depthCacheStaggered: this.depthCacheStaggered.bind(this),
        userFutureData: this.userFutureData.bind(this),
        userDeliveryData: this.userDeliveryData.bind(this),
        subscribeCombined: this.subscribeCombined.bind(this),
        subscribe: this.subscribe.bind(this),
        subscriptions: () => this.getSubscriptions.bind(this),
        terminate: this.terminate.bind(this),
        depth: this.depthStream.bind(this),
        depthCache: this.depthCacheStream.bind(this),
        clearDepthCache: this.clearDepthCache.bind(this),
        aggTrades: this.aggTradesStream.bind(this),
        trades: this.tradesStream.bind(this),
        chart: this.chart.bind(this),
        candlesticks: this.candlesticksStream.bind(this),
        miniTicker: this.miniTicker.bind(this),
        bookTickers: this.bookTickersStream.bind(this),
        prevDay: this.prevDayStream.bind(this),
        futuresCandlesticks: this.futuresCandlesticksStream.bind(this),
        futuresTicker: this.futuresTickerStream.bind(this),
        futuresMiniTicker: this.futuresMiniTickerStream.bind(this),
        futuresAggTrades: this.futuresAggTradeStream.bind(this),
        futuresMarkPrice: this.futuresMarkPriceStream.bind(this),
        futuresLiquidation: this.futuresLiquidationStream.bind(this),
        futuresBookTicker: this.futuresBookTickerStream.bind(this),
        futuresChart: this.futuresChart.bind(this),
        deliveryAggTrade: this.deliveryAggTradeStream.bind(this),
        deliveryCandlesticks: this.deliveryCandlesticks.bind(this),
        deliveryTicker: this.deliveryTickerStream.bind(this),
        deliveryMiniTicker: this.deliveryMiniTickerStream.bind(this),
        deliveryMarkPrice: this.deliveryMarkPriceStream.bind(this),
        deliveryBookTicker: this.deliveryBookTickerStream.bind(this),
        deliveryChart: this.deliveryChart.bind(this),
        deliveryLiquidation: this.deliveryLiquidationStream.bind(this),
        futuresSubcriptions: () => this.getFuturesSubscriptions.bind(this),
        deliverySubcriptions: () => this.getDeliverySubscriptions.bind(this),
        futuresTerminate: this.futuresTerminate.bind(this),
        deliveryTerminate: this.deliveryTerminate.bind(this),
    };

    default_options = {
        recvWindow: 5000,
        useServerTime: false,
        reconnect: true,
        keepAlive: true,
        verbose: false,
        test: false,
        demo: false,
        hedgeMode: false,
        localAddress: false,
        family: 4,
        log(...args) {
            console.log(Array.prototype.slice.call(args));
        }
    };

    Options: any = {
    };

    constructor(userOptions: Partial<IConstructorArgs> | string = {}) {

        if (userOptions) {
            this.setOptions(userOptions);
        }

    }

    options(opt = {}): Binance {
        // // return await this.setOptions(opt, callback); // keep this method for backwards compatibility
        // this.assignOptions(opt, callback);
        this.setOptions(opt);
        return this;
    }

    assignOptions(opt = {}) {
        if (typeof opt === 'string') { // Pass json config filename
            this.Options = JSON.parse(file.readFileSync(opt) as any);
        } else this.Options = opt;
        if (!this.Options.recvWindow) this.Options.recvWindow = this.default_options.recvWindow;
        if (!this.Options.useServerTime) this.Options.useServerTime = this.default_options.useServerTime;
        if (!this.Options.reconnect) this.Options.reconnect = this.default_options.reconnect;
        if (!this.Options.test) this.Options.test = this.default_options.test;
        if (!this.Options.hedgeMode) this.Options.hedgeMode = this.default_options.hedgeMode;
        if (!this.Options.log) this.Options.log = this.default_options.log;
        if (!this.Options.verbose) this.Options.verbose = this.default_options.verbose;
        if (!this.Options.keepAlive) this.Options.keepAlive = this.default_options.keepAlive;
        if (!this.Options.localAddress) this.Options.localAddress = this.default_options.localAddress;
        if (!this.Options.family) this.Options.family = this.default_options.family;
        if (this.Options.urls !== undefined) {
            const { urls } = this.Options;
            if (urls.base) this.base = urls.base;
            if (urls.wapi) this.wapi = urls.wapi;
            if (urls.sapi) this.sapi = urls.sapi;
            if (urls.fapi) this.fapi = urls.fapi;
            if (urls.fapiTest) this.fapiTest = urls.fapiTest;
            if (urls.stream) this.stream = urls.stream;
            if (urls.combineStream) this.combineStream = urls.combineStream;
            if (urls.fstream) this.fstream = urls.fstream;
            if (urls.fstreamSingle) this.fstreamSingle = urls.fstreamSingle;
            if (urls.fstreamTest) this.fstreamTest = urls.fstreamTest;
            if (urls.fstreamSingleTest) this.fstreamSingleTest = urls.fstreamSingleTest;
            if (urls.dstream) this.dstream = urls.dstream;
            if (urls.dstreamSingle) this.dstreamSingle = urls.dstreamSingle;
            if (urls.dstreamTest) this.dstreamTest = urls.dstreamTest;
            if (urls.dstreamSingleTest) this.dstreamSingleTest = urls.dstreamSingleTest;
        }

        if (this.Options.APIKEY) this.APIKEY = this.Options.APIKEY;
        if (this.Options.APISECRET) this.APISECRET = this.Options.APISECRET;
        if (this.Options.PRIVATEKEY) this.PRIVATEKEY = this.Options.PRIVATEKEY;
        if (this.Options.PRIVATEKEYPASSWORD) this.PRIVATEKEYPASSWORD = this.Options.PRIVATEKEYPASSWORD;
        if (this.Options.test) this.test = true;
        if (this.Options.demo) this.demo = true;
        if (this.Options.headers) this.headers = this.Options.Headers;
        if (this.Options.domain) this.domain = this.Options.domain;
        if (this.Options.httpsProxy) this.httpsProxy = this.Options.httpsProxy;
    }

    async setOptions(opt = {}): Promise<Binance> {

        this.assignOptions(opt);
        if (this.Options.useServerTime) {
            const res = await this.publicSpotRequest('v3/time');
            this.timeOffset = res.serverTime - new Date().getTime();
        }
        return this;
    }

    // ---- HELPER FUNCTIONS ---- //

    extend = (...args: any[]) => Object.assign({}, ...args);

    getSpotUrl() {
        if (this.Options.demo) return this.baseDemo;
        if (this.Options.test) return this.baseTest;
        return this.base;
    }

    getSapiUrl() {
        return this.sapi;
    }

    getFapiUrl() {
        if (this.Options.demo) return this.fapiDemo;
        if (this.Options.test) return this.fapiTest;
        return this.fapi;
    }

    getDapiUrl() {
        if (this.Options.demo) return this.dapiDemo;
        if (this.Options.test) return this.dapiTest;
        return this.dapi;
    }

    getCombineStreamUrl() {
        if (this.Options.demo) return this.combineStreamDemo;
        if (this.Options.test) return this.combineStreamTest;
        return this.combineStream;
    }

    getStreamUrl() {
        if (this.Options.demo) return this.streamDemo;
        if (this.Options.test) return this.streamTest;
        return this.stream;
    }

    getDStreamSingleUrl() {
        if (this.Options.demo) return this.dstreamSingleDemo;
        if (this.Options.test) return this.dstreamSingleTest;
        return this.dstreamSingle;
    }

    getFStreamSingleUrl() {
        if (this.Options.demo) return this.fstreamSingleDemo;
        if (this.Options.test) return this.fstreamSingleTest;
        return this.fstreamSingle;
    }

    getFStreamUrl() {
        if (this.Options.demo) return this.fstreamDemo;
        if (this.Options.test) return this.fstreamTest;
        return this.fstream;
    }

    getDStreamUrl() {
        if (this.Options.demo) return this.dstreamDemo;
        if (this.Options.test) return this.dstreamTest;
        return this.dstream;
    }

    uuid22(a?: any) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : (([1e7] as any) + 1e3 + 4e3 + 8e5).replace(/[018]/g, this.uuid22);
    }

    getUrlProxy() {
        if (this.urlProxy) {
            return this.urlProxy;
        }
        return undefined;
    }

    getHttpsProxy() {
        if (this.httpsProxy) {
            return this.httpsProxy;
        }
        if (process.env.https_proxy) {
            return process.env.https_proxy;
        }
        return undefined;
    }

    getSocksProxy() {
        if (this.socksProxy) {
            return this.socksProxy;
        }
        if (process.env.socks_proxy) {
            return process.env.socks_proxy;
        }
        return undefined;
    }

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
        const arr = connString.split('/');
        const host = arr[2].split(':')[0];
        const port = arr[2].split(':')[1];
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
        if (this.Options.proxy) {
            const proxyauth = this.Options.proxy.auth ? `${this.Options.proxy.auth.username}:${this.Options.proxy.auth.password}@` : '';
            opt.proxy = `http://${proxyauth}${this.Options.proxy.host}:${this.Options.proxy.port}`;
        }
        return opt;
    }

    async reqHandler(response) {
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

        if (response && response.status !== 200) {
            // let parsedResponse = '';
            // try {
            //     parsedResponse = await response.json();
            // } catch (e) {
            //     parsedResponse = await response.text();
            // }
            const error = new Error(await response.text());
            // error.code = response.status;
            // error.url = response.url;
            throw error;
        }
    }

    async proxyRequest(opt: any) {
        // const req = request(this.addProxy(opt), this.reqHandler(cb)).on('error', (err) => { cb(err, {}) });
        // family: opt.family,
        // timeout: opt.timeout,

        const urlBody = new URLSearchParams(opt.form);
        const reqOptions: Dict = {
            method: opt.method,
            headers: opt.headers,
            // body: urlBody
            // body: (opt.form)
        };
        if (opt.method !== 'GET') {
            reqOptions.body = urlBody;
        } else {
            if (opt.qs) {
                // opt.url += '?' + this.makeQueryString(opt.qs);
            }
        }
        if (this.Options.verbose) {
            this.Options.log('HTTP Request:', opt.method, opt.url, reqOptions);
        }

        // https-proxy
        const httpsproxy = this.getHttpsProxy();
        const socksproxy = this.getSocksProxy();
        const urlProxy = this.getUrlProxy();
        if (httpsproxy) {
            if (this.Options.verbose) this.Options.log('using https proxy: ' + httpsproxy);
            reqOptions.agent = new HttpsProxyAgent(httpsproxy);
        } else if (socksproxy) {
            if (this.Options.verbose) this.Options.log('using socks proxy: ' + socksproxy);
            reqOptions.agent = new SocksProxyAgent(socksproxy);
        }

        if (urlProxy) {
            opt.url = urlProxy + opt.url;
        }

        let fetchImplementation = fetch;
        // require node-fetch
        if (reqOptions.agent) {
            fetchImplementation = nodeFetch;
        }

        const response = await fetchImplementation(opt.url, reqOptions);

        await this.reqHandler(response);
        const json = await response.json();

        if (this.Options.verbose) {
            this.Options.log('HTTP Response:', json);
        }
        return json;
    }

    reqObj(url: string, data: Dict = {}, method: HttpMethod = 'GET', key?: string) {
        return {
            url: url,
            qs: data,
            method: method,
            family: this.Options.family,
            localAddress: this.Options.localAddress,
            timeout: this.Options.recvWindow,
            forever: this.Options.keepAlive,
            headers: {
                'User-Agent': this.userAgent,
                'Content-type': this.contentType,
                'X-MBX-APIKEY': key || ''
            }
        };
    }

    reqObjPOST(url: string, data: Dict = {}, method = 'POST', key: string) {
        return {
            url: url,
            form: data,
            method: method,
            family: this.Options.family,
            localAddress: this.Options.localAddress,
            timeout: this.Options.recvWindow,
            forever: this.Options.keepAlive,
            qsStringifyOptions: {
                arrayFormat: 'repeat'
            },
            headers: {
                'User-Agent': this.userAgent,
                'Content-type': this.contentType,
                'X-MBX-APIKEY': key || ''
            }
        };
    }

    async publicRequest(url: string, data: Dict = {}, method: HttpMethod = 'GET') {
        const query = this.makeQueryString(data);
        const opt = this.reqObj(url + (query ? '?' + query : ''), data, method);
        const res = await this.proxyRequest(opt);
        return res;
    }

    /**
     * Used to make public requests to the futures (FAPI) API
     * @param path
     * @param data
     * @param method
     * @returns
     */
    async publicFuturesRequest(path: string, data: Dict = {}, method: HttpMethod = 'GET') {
        return await this.publicRequest(this.getFapiUrl() + path, data, method);
    }

    /**
     * Used to make public requests to the delivery (DAPI) API
     * @param path
     * @param data
     * @param method
     * @returns
     */
    async publicDeliveryRequest(path: string, data: Dict = {}, method: HttpMethod = 'GET') {
        return await this.publicRequest(this.getDapiUrl() + path, data, method);
    }

    /**
     * Used to make private requests to the futures (FAPI) API
     * @param path
     * @param data
     * @param method
     * @returns
     */
    async privateFuturesRequest(path: string, data: Dict = {}, method: HttpMethod = 'GET'): Promise<any> {
        return await this.futuresRequest(this.getFapiUrl() + path, data, method, true);
    }

    /**
     * Used to make private requests to the delivery (DAPI) API
     * @param path
     * @param data
     * @param method
     * @returns
     */
    async privateDeliveryRequest(path: string, data: Dict = {}, method: HttpMethod = 'GET'): Promise<any> {
        return await this.futuresRequest(this.getDapiUrl() + path, data, method, true);
    }

    /**
     * Used to make a request to the futures API, this is a generic function that can be used to make any request to the futures API
     * @param url
     * @param data
     * @param method
     * @param isPrivate
     * @returns
     */
    async futuresRequest(url: string, data: Dict = {}, method: HttpMethod = 'GET', isPrivate = false) {
        let query = '';
        const headers = {
            'User-Agent': this.userAgent,
            'Content-type': 'application/x-www-form-urlencoded'
        } as Dict;

        if (isPrivate) {
            if (!data.recvWindow) data.recvWindow = this.Options.recvWindow;
            this.requireApiKey('promiseRequest');
            headers['X-MBX-APIKEY'] = this.APIKEY;
        }

        const opt = {
            headers: this.extend(headers, this.headers),
            url: url,
            method: method,
            timeout: this.Options.recvWindow,
            followAllRedirects: true
        };
        query = this.makeQueryString(data);
        if (method === 'GET') {
            opt.url = `${url}?${query}`;
        }
        if (isPrivate) {
            data.timestamp = new Date().getTime();
            if (this.timeOffset) {
                data.timestamp += this.timeOffset;
            }
            query = this.makeQueryString(data);
            data.signature = this.generateSignature(query);
            opt.url = `${url}?${query}&signature=${data.signature}`;
        }
        (opt as any).qs = data;
        const response = await this.proxyRequest(opt);
        return response;

    }

    // ------ Request Related Functions ------ //

    // XXX: This one works with array (e.g. for dust.transfer)
    // XXX: I _guess_ we could use replace this function with the `qs` module
    makeQueryString(q) {

        const res = Object.keys(q)
            .reduce((a, k) => {
                if (Array.isArray(q[k])) {
                    q[k].forEach(v => {
                        a.push(k + "=" + encodeURIComponent(v));
                    });
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
    async apiRequest(url: string, data: Dict = {}, method: HttpMethod = 'GET') {
        this.requireApiKey('apiRequest');
        const opt = this.reqObj(
            url,
            data,
            method,
            this.APIKEY
        );
        const res = await this.proxyRequest(opt);
        return res;
    }

    requireApiKey(source = 'requireApiKey', fatalError = true) {
        if (!this.APIKEY) {
            if (fatalError) throw Error(`${source}: Invalid API Key!`);
            return false;
        }
        return true;
    }

    // Check if API secret is present
    requireApiSecret(source = 'requireApiSecret', fatalError = true) {
        if (!this.APIKEY) {
            if (fatalError) throw Error(`${source}: Invalid API Key!`);
            return false;
        }
        if (!this.APISECRET && !this.PRIVATEKEY) {
            if (fatalError) throw Error(`${source}: Invalid API Secret or Private Key!`);
            return false;
        }
        return true;
    }

    /**
     * Create a public spot/margin request
     * @param {string} path - url path
     * @param {object} data - The data to send
     * @param {string} method - the http method
     * @param {boolean} noDataInSignature - Prevents data from being added to signature
     * @return {undefined}
     */
    async publicSpotRequest(path: string, data: Dict = {}, method: HttpMethod = 'GET') {
        return await this.publicRequest/**/(this.getSpotUrl() + path, data, method);
    }

    /**
     * Create a signed spot request
     * @param {string} path - url path
     * @param {object} data - The data to send
     * @param {string} method - the http method
     * @param {boolean} noDataInSignature - Prevents data from being added to signature
     * @return {undefined}
     */
    async privateSpotRequest(path: string, data: Dict = {}, method: HttpMethod = 'GET', noDataInSignature = false) {
        return await this.signedRequest/**/(this.getSpotUrl() + path, data, method, noDataInSignature);
    }

    /**
     * Create a signed SAPI request
     */
    async privateSapiRequest(path: string, data: Dict = {}, method: HttpMethod = 'GET', noDataInSignature = false) {
        return await this.signedRequest/**/(this.getSapiUrl() + path, data, method, noDataInSignature);
    }

    /**
     * Create a signed http request
     * @param {string} url - The http endpoint
     * @param {object} data - The data to send
     * @param {function} callback - The callback method to call
     * @param {string} method - the http method
     * @param {boolean} noDataInSignature - Prevents data from being added to signature
     * @return {undefined}
     */
    async signedRequest(url: string, data: Dict = {}, method: HttpMethod = 'GET', noDataInSignature = false) {
        this.requireApiSecret('signedRequest');
        const isListenKeyEndpoint = url.includes('v3/userDataStream');

        let query = method === 'POST' && noDataInSignature ? '' : this.makeQueryString(data);

        let signature = undefined;
        if (!noDataInSignature && !isListenKeyEndpoint) {
            data.timestamp = new Date().getTime();

            if (this.timeOffset) data.timestamp += this.timeOffset;

            if (!data.recvWindow) data.recvWindow = this.Options.recvWindow;
            query = this.makeQueryString(data);
            signature = this.generateSignature(query);
        }

        if (method === 'POST') {
            const opt = this.reqObjPOST(
                url,
                data,
                method,
                this.APIKEY
            );
            if (signature) {
                opt.form.signature = signature;
            }
            const reqPost = await this.proxyRequest(opt);
            return reqPost;
        } else {
            let encodedUrl = url;
            if (query) encodedUrl += '?' + query;
            if (signature) encodedUrl += '&signature=' + signature;
            const opt = this.reqObj(
                encodedUrl,
                data,
                method,
                this.APIKEY
            );
            const reqGet = await this.proxyRequest(opt);
            return reqGet;
        }
    }

    generateSignature(query: string, encode = true) {
        const secret = this.APISECRET || this.PRIVATEKEY;
        let signature = '';
        if (secret.includes('PRIVATE KEY')) {
            // if less than the below length, then it can't be RSA key
            let keyObject: crypto.KeyObject;
            try {
                const privateKeyObj: crypto.PrivateKeyInput = { key: secret };

                if (this.PRIVATEKEYPASSWORD) {
                    privateKeyObj.passphrase = this.PRIVATEKEYPASSWORD;
                }

                keyObject = crypto.createPrivateKey(privateKeyObj);

            } catch (e) {
                throw new Error(
                    'Invalid private key. Please provide a valid RSA or ED25519 private key. ' + e.toString()
                );
            }

            if (secret.length > 120) {
                // RSA key
                signature = crypto
                    .sign('RSA-SHA256', Buffer.from(query), keyObject)
                    .toString('base64');
                if (encode) signature = encodeURIComponent(signature);
                return signature;
            } else {
                // Ed25519 key
                signature = crypto.sign(null, Buffer.from(query), keyObject).toString('base64');
            }
        } else {
            signature = crypto.createHmac('sha256', this.Options.APISECRET).update(query).digest('hex'); // set the HMAC hash header
        }
        return signature;
    }

    // --- ENDPOINTS --- //

    /**
     * Create a signed spot order
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-trade
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints#test-new-order-trade
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-list---oco-trade
     * @param {OrderType} type - LIMIT, MARKET, STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT, LIMIT_MAKER, OCO
     * @param {OrderSide} side - BUY or SELL
     * @param {string} symbol - The symbol to buy or sell
     * @param {string} quantity - The quantity to buy or sell
     * @param {string} price - The price per unit to transact each unit at
     * @param {object} params - additional order settings
     * @param {number} [params.quoteOrderQty] - The quote order quantity, used for MARKET orders
     * @param {number} [params.stopPrice] - The stop price, used for STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT orders
     * @param {number} [params.trailingDelta] - Delta price
     * @return {undefined}
     */
    async order(type: OrderType, side: OrderSide, symbol: string, quantity: number, price?: number, params: Dict = {}): Promise<Order> {
        const isOCO = type === 'OCO' || params.type === 'OCO';
        let endpoint = isOCO ? 'v3/orderList/oco' : 'v3/order';
        if (params.test) {
            delete params.test;
            endpoint += '/test';
        }
        const request = {
            symbol: symbol,
            side: side,
            // type: type
        } as Dict;
        if (!isOCO) request.type = type;
        if (params.quoteOrderQty && params.quoteOrderQty > 0)
            request.quoteOrderQty = params.quoteOrderQty;
        else
            request.quantity = quantity;

        if (!isOCO && request.type.includes('LIMIT')) {
            request.price = price;
            if (request.type !== 'LIMIT_MAKER') {
                request.timeInForce = 'GTC';
            }
        }
        if (!isOCO && request.type == 'MARKET' && typeof params.quoteOrderQty !== 'undefined') {
            request.quoteOrderQty = params.quoteOrderQty;
            delete request.quantity;
        }
        // if (typeof params.timeInForce !== 'undefined') opt.timeInForce = params.timeInForce;
        // if (typeof params.newOrderRespType !== 'undefined') opt.newOrderRespType = params.newOrderRespType;
        if (!params.newClientOrderId && !params.listClientOrderId) {
            const id = this.SPOT_PREFIX + this.uuid22();
            if (!isOCO) {
                request.newClientOrderId = id;
            } else {
                request.listClientOrderId = id;
            }
        }

        const allowedTypesForStopAndTrailing = ['STOP_LOSS', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT', 'OCO'];
        if (params.trailingDelta) {
            request.trailingDelta = params.trailingDelta;

            if (!isOCO && !allowedTypesForStopAndTrailing.includes(request.type)) {
                throw Error('trailingDelta: Must set "type" to one of the following: STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT, OCO');
            }
        }

        /*
         * STOP_LOSS
         * STOP_LOSS_LIMIT
         * TAKE_PROFIT
         * TAKE_PROFIT_LIMIT
         * LIMIT_MAKER
         */
        // if (typeof params.icebergQty !== 'undefined') request.icebergQty = params.icebergQty;
        if (params.stopPrice) {
            request.stopPrice = params.stopPrice;
            if (!isOCO && !allowedTypesForStopAndTrailing.includes(request.type)) {
                throw Error('stopPrice: Must set "type" to one of the following: STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT, OCO');
            }
        }
        const response = await this.privateSpotRequest(endpoint, this.extend(request, params), 'POST');
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
        return response;
    }

    /**
     * Create an OCO spot order
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-list---oco-trade
     * @param {OrderSide} side - BUY or SELL
     * @param {string} symbol - The symbol to buy or sell
     * @param {string} quantity - The quantity to buy or sell
     * @param {string} price - The price per unit to transact each unit at
     * @param {object} params - additional order settings
     * @param {string} params.aboveType - The type of the above order
     * @param {string} params.belowType - The type of the below order
     * @param {string} params.abovePrice - The price of the above order
     * @param {string} params.aboveStopPrice - The stop price of the above order
     * @param {string} params.aboveTrailingDelta - The trailing delta of the above order
     * @param {string} params.aboveTimeInForce - The time in force of the above order
     * @param {string} params.belowPrice - The price of the below order
     * @param {string} params.belowStopPrice - The stop price of the below order
     * @param {string} params.belowTrailingDelta - The trailing delta of the below order
     * @param {string} params.belowTimeInForce - The time in force of the below order
     * @return {undefined}
     */
    async ocoOrder(side: OrderSide, symbol: string, quantity: number, params: Dict = {}): Promise<OCOOrder> {
        const request = {
            symbol: symbol,
            side: side,
            quantity: quantity,
        } as Dict;

        if (!params.listClientOrderId) {
            const id = this.SPOT_PREFIX + this.uuid22();
            request.listClientOrderId = id;
        }

        const endpoint = 'v3/orderList/oco';
        const response = await this.privateSpotRequest(endpoint, this.extend(request, params), 'POST');
        return response;
    }

    /**
    * Creates a buy order
    * @param {string} symbol - the symbol to buy
    * @param {numeric} quantity - the quantity required
    * @param {numeric} price - the price to pay for each unit
    * @param {object} flags - additional buy order flags
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async buy(symbol: string, quantity: number, price: number, flags = {}) {
        return await this.order('LIMIT', 'BUY', symbol, quantity, price, flags);
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
        return await this.order('LIMIT', 'SELL', symbol, quantity, price, flags);
    }

    /**
* Creates a market buy order
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-trade
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints#test-new-order-trade
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-list---oco-trade
* @param {string} symbol - the symbol to buy
* @param {numeric} quantity - the quantity required
* @param {object} params - additional buy order flags
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async marketBuy(symbol: string, quantity: number, params: Dict = {}) {
        return await this.order('MARKET', 'BUY', symbol, quantity, 0, params);
    }

    /**
* Creates a spot limit order
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-trade
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints#test-new-order-trade
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-list---oco-trade
* @param {string} side - the side of the order (BUY or SELL)
* @param {string} symbol - the symbol to buy
* @param {numeric} quantity - the quantity required
* @param {numeric} price - the price to pay for each unit
* @param {object} params - additional buy order flags
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async limitOrder(side: OrderSide, symbol: string, quantity: number, price: number, params: Dict = {}) {
        return await this.order('LIMIT', side, symbol, quantity, price, params);
    }

    /**
* Creates a market buy order using the cost instead of the quantity (eg: 100usd instead of 0.01btc)
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-trade
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints#test-new-order-trade
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-list---oco-trade
* @param {string} symbol - the symbol to buy
* @param {numeric} quantity - the quantity required
* @param {object} params - additional buy order flags
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async marketBuyWithCost(symbol: string, cost: number, params: Dict = {}) {
        params.quoteOrderQty = cost;
        return await this.order('MARKET', 'BUY', symbol, 0, 0, params);
    }

    /**
    * Creates a market sell order
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-trade
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints#test-new-order-trade
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-list---oco-trade
    * @param {string} symbol - the symbol to sell
    * @param {numeric} quantity - the quantity required
    * @param {object} flags - additional buy order flags
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async marketSell(symbol: string, quantity: number, params: Dict = {}) {
        return await this.order('MARKET', 'SELL', symbol, quantity, 0, params);
    }

    /**
    * Creates a market sell order using the cost instead of the quantity (eg: 100usd instead of 0.01btc)
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-trade
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints#test-new-order-trade
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-list---oco-trade
    * @param {string} symbol - the symbol to sell
    * @param {numeric} quantity - the quantity required
    * @param {object} flags - additional buy order flags
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async marketSellWithCost(symbol: string, cost: number, params: Dict = {}) {
        params.quoteOrderQty = cost;
        return await this.order('MARKET', 'SELL', symbol, 0, 0, params);
    }

    /**
    * Cancels an order
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#cancel-order-trade
    * @param {string} symbol - the symbol to cancel
    * @param {string} orderid - the orderid to cancel
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async cancel(symbol: string, orderid: number | string, params: Dict = {}): Promise<CancelOrder> {
        return await this.privateSpotRequest('v3/order', this.extend({ symbol: symbol, orderId: orderid }, params), 'DELETE');
    }

    /**
    * Cancels all orders
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#cancel-all-open-orders-on-a-symbol-trade
    * @param {string} symbol - the symbol to cancel
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async cancelAll(symbol: string, params: Dict = {}): Promise<CancelOrder> {
        return await this.privateSpotRequest('v3/openOrders', this.extend({ symbol: symbol }, params), 'DELETE');
    }

    /**
* Gets the status of an order
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#query-order-user_data
* @param {string} symbol - the symbol to check
* @param {string} orderid - the orderid to check if !orderid then  use flags to search
* @param {object} flags - any additional flags
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async orderStatus(symbol: string, orderid?: number | string, flags = {}) {
        let parameters = Object.assign({ symbol: symbol }, flags);
        if (orderid) {
            parameters = Object.assign({ orderId: orderid }, parameters);
        }
        return await this.privateSpotRequest('v3/order', parameters);
    }

    /**
* Gets open orders
* @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#current-open-orders-user_data
* @param {string} symbol - the symbol to get
* @return {promise or undefined} - omitting the callback returns a promise
*/
    async openOrders(symbol?: string, params: Dict = {}): Promise<QueryOrder[]> {
        const parameters = symbol ? { symbol: symbol } : {};
        return await this.privateSpotRequest('v3/openOrders', this.extend(parameters, params));
    }

    /**
    * Cancels all orders of a given symbol
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#cancel-all-open-orders-on-a-symbol-trade
    * @param {string} symbol - the symbol to cancel all orders for
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async cancelAllOrders(symbol: string, params: Dict = {}) {
        return await this.privateSpotRequest('v3/openOrders', this.extend({ symbol }, params), 'DELETE');
    }

    // /**
    // * Cancels all orders of a given symbol
    // * @param {string} symbol - the symbol to cancel all orders for
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // async cancelOrders(symbol: string, params: Dict = {}) {
    //     const json = await this.privateSpotRequest('v3/openOrders', this.extend({ symbol: symbol }, params), 'DELETE');
    //     // if (json.length === 0) {
    //     //     return callback.call(this, 'No orders present for this symbol', {}, symbol);
    //     // }
    //     // if (Object.keys(json).length === 0) {
    //     //     return callback.call(this, 'No orders present for this symbol', {}, symbol);
    //     // }
    //     // for (let obj of json) {
    //     //     let quantity = obj.origQty - obj.executedQty;
    //     //     this.options.log('cancel order: ' + obj.side + ' ' + symbol + ' ' + quantity + ' @ ' + obj.price + ' #' + obj.orderId);
    //     //     signedRequest(this.getSpotUrl() + 'v3/order', { symbol: symbol, orderId: obj.orderId }, function (error, data) {
    //     //         return callback.call(this, error, data, symbol);
    //     //     }, 'DELETE');
    //     // }
    //     return json; // to do: check this logic of cancelling remaining orders manually

    // }

    /**
    * Gets all order of a given symbol
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#all-orders-user_data
    * @param {string} symbol - the symbol
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async allOrders(symbol: string, params: Dict = {}): Promise<QueryOrder[]> {
        const parameters = this.extend({ symbol }, params);
        return await this.privateSpotRequest('v3/allOrders', parameters);
    }

    /**
     * Create a signed margin order
     * @see https://developers.binance.com/docs/margin_trading/trade/Margin-Account-New-Order
     * @param {string} side - BUY or SELL
     * @param {string} symbol - The symbol to buy or sell
     * @param {string} quantity - The quantity to buy or sell
     * @param {string} price - The price per unit to transact each unit at
     * @param {object} params - additional order settings
     * @return {undefined}
     */
    async marginOrder(type: OrderType, side: string, symbol: string, quantity: number, price?: number, params: Dict = {}) {
        let endpoint = 'v1/margin/order';
        if (this.Options.test || params.test) endpoint += '/test';
        const request = {
            symbol: symbol,
            side: side,
            type: type,
            quantity: quantity
        } as Dict;
        if (typeof params.type !== 'undefined') request.type = params.type;
        if ('isIsolated' in params) request.isIsolated = params.isIsolated;
        if (request.type.includes('LIMIT')) {
            request.price = price;
            if (request.type !== 'LIMIT_MAKER') {
                request.timeInForce = 'GTC';
            }
        }

        if (typeof params.timeInForce !== 'undefined') request.timeInForce = params.timeInForce;
        if (typeof params.newOrderRespType !== 'undefined') request.newOrderRespType = params.newOrderRespType;
        // if ( typeof flags.newClientOrderId !== 'undefined' ) opt.newClientOrderId = flags.newClientOrderId;
        if (typeof params.newClientOrderId !== 'undefined') {
            request.newClientOrderId = params.newClientOrderId;
        } else {
            request.newClientOrderId = this.SPOT_PREFIX + this.uuid22();
        }
        if (typeof params.sideEffectType !== 'undefined') request.sideEffectType = params.sideEffectType;

        /*
         * STOP_LOSS
         * STOP_LOSS_LIMIT
         * TAKE_PROFIT
         * TAKE_PROFIT_LIMIT
         */
        if (typeof params.icebergQty !== 'undefined') request.icebergQty = params.icebergQty;
        if (typeof params.stopPrice !== 'undefined') {
            request.stopPrice = params.stopPrice;
            if (request.type === 'LIMIT') throw Error('stopPrice: Must set "type" to one of the following: STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT');
        }
        return await this.privateSapiRequest(endpoint, this.extend(request, params), 'POST');
    }

    // Futures internal functions
    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Algo-Order
     * @param type
     * @param side
     * @param symbol symbol if the market
     * @param quantity
     * @param price
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresOrder(type: OrderType, side: string, symbol: string, quantity: number, price?: number, params: Dict = {}): Promise<FuturesOrder> {
        params.symbol = symbol;
        params.side = side;
        params.type = type;
        if (quantity) params.quantity = quantity;
        // if in the binance futures setting Hedged mode is active, positionSide parameter is mandatory
        if (!params.positionSide && this.Options.hedgeMode) {
            params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT';
        }
        // LIMIT STOP MARKET STOP_MARKET TAKE_PROFIT TAKE_PROFIT_MARKET
        // reduceOnly stopPrice
        if (price) {
            params.price = price;
        }
        if (!params.timeInForce && (params.type.includes('LIMIT') || params.type === 'STOP' || params.type === 'TAKE_PROFIT')) {
            params.timeInForce = 'GTX'; // Post only by default. Use GTC for limit orders.
        }

        if (!params.newClientOrderId) {
            params.newClientOrderId = this.CONTRACT_PREFIX + this.uuid22();
        }
        // check if it is algoOrder
        const conditionalTypes = [
            'STOP',
            'STOP_MARKET',
            'TAKE_PROFIT',
            'TAKE_PROFIT_MARKET',
            'TRAILING_STOP_MARKET',
        ];
        const typeUpperCase = type.toUpperCase();
        if (typeUpperCase && conditionalTypes.includes(typeUpperCase)) {
            const algoPayload = { ...params };
            if (!algoPayload.clientAlgoId) {
                algoPayload.clientAlgoId = this.CONTRACT_PREFIX + this.uuid22();
            }
            delete algoPayload.newClientOrderId;
            algoPayload.algoType = 'CONDITIONAL';
            if (algoPayload.stopPrice && !algoPayload.triggerPrice) {
                algoPayload.triggerPrice = algoPayload.stopPrice;
                delete algoPayload.stopPrice;
            }
            return await this.privateFuturesRequest('v1/algoOrder', algoPayload, 'POST');
        }
        return await this.privateFuturesRequest('v1/order', params, 'POST');
    }

    // Futures internal functions
    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Algo-Order
     * @param type
     * @param side
     * @param symbol symbol if the market
     * @param quantity
     * @param price
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresAlgoOrder(type: OrderType, side: string, symbol: string, quantity: number, price?: number, params: Dict = {}): Promise<FuturesAlgoOrder> {
        params.symbol = symbol;
        params.side = side;
        params.type = type;
        if (quantity) params.quantity = quantity;
        // if in the binance futures setting Hedged mode is active, positionSide parameter is mandatory
        if (!params.positionSide && this.Options.hedgeMode) {
            params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT';
        }
        // LIMIT STOP MARKET STOP_MARKET TAKE_PROFIT TAKE_PROFIT_MARKET
        // reduceOnly stopPrice
        if (price) {
            params.price = price;
        }
        if (!params.timeInForce && (params.type.includes('LIMIT') || params.type === 'STOP' || params.type === 'TAKE_PROFIT')) {
            params.timeInForce = 'GTX'; // Post only by default. Use GTC for limit orders.
        }

        if (!params.clientAlgoId) {
            params.clientAlgoId = this.CONTRACT_PREFIX + this.uuid22();
        }

        if (!params.algoType) {
            params.algoType = 'CONDITIONAL';
        }
        return await this.privateFuturesRequest('v1/algoOrder', params, 'POST');
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/option/trade/New-Order
     * @param type type of order to create
     * @param side side of the order (BUY or SELL)
     * @param symbol symbol of the market to trade
     * @param quantity quantity of the order to create
     * @param price price of the order to create
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async deliveryOrder(type: OrderType, side: string, symbol: string, quantity: number, price?: number, params: Dict = {}): Promise<FuturesOrder> {
        params.symbol = symbol;
        params.side = side;
        params.quantity = quantity;
        params.type = type;
        // if in the binance futures setting Hedged mode is active, positionSide parameter is mandatory
        if (this.Options.hedgeMode) {
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
        return await this.privateDeliveryRequest('v1/order', params, 'POST');
    }

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
        for (const endpointId in this.subscriptions) {
            const ws = this.subscriptions[endpointId];
            if (ws.isAlive) {
                ws.isAlive = false;
                if (ws.readyState === WebSocket.OPEN) ws.ping(this.noop);
            } else {
                if (this.Options.verbose) this.Options.log('Terminating inactive/broken WebSocket: ' + ws.endpoint);
                if (ws.readyState === WebSocket.OPEN) ws.terminate();
            }
        }
    }

    /**
     * Called when socket is opened, subscriptions are registered for later reference
     * @param {function} opened_callback - a callback function
     * @return {undefined}
     */
    handleSocketOpen(wsBind, opened_callback: Callback) {
        wsBind.isAlive = true;
        if (Object.keys(this.subscriptions).length === 0) {
            this.socketHeartbeatInterval = setInterval(this.socketHeartbeat, this.heartBeatInterval);
        }
        this.subscriptions[wsBind.url] = wsBind;
        if (typeof opened_callback === 'function') opened_callback(wsBind.url);
    }

    /**
     * Called when socket is closed, subscriptions are de-registered for later reference
     * @param {Function} reconnect - reconnect callback
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    handleSocketClose(wsBind, reconnect: Function, code, reason: string) {
        delete this.subscriptions[wsBind.url];
        if (this.subscriptions && Object.keys(this.subscriptions).length === 0) {
            clearInterval(this.socketHeartbeatInterval);
        }
        this.Options.log('WebSocket closed: ' + wsBind.url +
            (code ? ' (' + code + ')' : '') +
            (reason ? ' ' + reason : ''));
        if (this.Options.reconnect && wsBind.reconnect && reconnect) {
            if (wsBind.url && wsBind.url.length === 60) this.Options.log('Account data WebSocket reconnecting...');
            else this.Options.log('WebSocket reconnecting: ' + wsBind.url + '...');
            try {
                reconnect();
            } catch (error) {
                this.Options.log('WebSocket reconnect error: ' + error.message);
            }
        }
    }

    /**
 * Called when socket errors
 * @param {object} error - error object message
 * @return {undefined}
 */
    handleSocketError(wsBind, error) {
        /* Errors ultimately result in a `close` event.
         see: https://github.com/websockets/ws/blob/828194044bf247af852b31c49e2800d557fedeff/lib/websocket.js#L126 */
        this.Options.log('WebSocket error: ' + wsBind.url +
            (error.code ? ' (' + error.code + ')' : '') +
            (error.message ? ' ' + error.message : ''));
    }

    /**
     * Called on each socket heartbeat
     * @return {undefined}
     */
    handleSocketHeartbeat(wsBind) {
        wsBind.isAlive = true;
    }

    // ----- WS ENDPOINTS ----- //

    /**
    * Get Binance server time
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async time() {
        const res = await this.publicSpotRequest('v3/time', {});
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
    subscribe(endpoint: string, callback: Callback, reconnect?: Callback, opened_callback?: Callback) {
        const httpsproxy = this.getHttpsProxy();
        let socksproxy = this.getSocksProxy();
        let ws: WebSocket = undefined;

        if (socksproxy) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.Options.verbose) this.Options.log('using socks proxy server ' + socksproxy);
            const agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket(this.getStreamUrl() + endpoint, { agent: agent });
        } else if (httpsproxy) {
            const config = url.parse(httpsproxy);
            const agent = new HttpsProxyAgent(config);
            if (this.Options.verbose) this.Options.log('using proxy server ' + agent);
            ws = new WebSocket(this.getStreamUrl() + endpoint, { agent: agent });
        } else {
            ws = new WebSocket(this.getStreamUrl() + endpoint);
        }

        if (this.Options.verbose) this.Options.log('Subscribed to ' + endpoint);
        (ws as any).reconnect = this.Options.reconnect;
        (ws as any).endpoint = endpoint;
        (ws as any).isAlive = false;
        ws.on('open', this.handleSocketOpen.bind(this, ws, opened_callback));
        ws.on('pong', this.handleSocketHeartbeat.bind(this, ws));
        ws.on('error', this.handleSocketError.bind(this, ws));
        ws.on('close', this.handleSocketClose.bind(this, ws, reconnect));
        ws.on('message', data => {
            try {
                if (this.Options.verbose) this.Options.log('WebSocket data:', data);
                callback(JSONbig.parse(data as any));
            } catch (error) {
                this.Options.log('Parse error: ' + error.message);
            }
        });
        return ws;
    }

    /**
     * Used to subscribe to a combined websocket endpoint
     * @param {string} streams - streams to connect to
     * @param {function} callback - the function to call when information is received
     * @param {boolean} reconnect - whether to reconnect on disconnect
     * @param {object} opened_callback - the function to call when opened
     * @return {WebSocket} - websocket reference
     */
    subscribeCombined(streams: any, callback: Callback, reconnect?: Callback, opened_callback?: Callback) {
        const httpsproxy = this.getHttpsProxy();
        let socksproxy = this.getSocksProxy();
        const queryParams = streams.join('/');
        let ws: any = undefined;
        if (socksproxy) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.Options.verbose) this.Options.log('using socks proxy server ' + socksproxy);
            const agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket(this.getCombineStreamUrl() + queryParams, { agent: agent });
        } else if (httpsproxy) {
            if (this.Options.verbose) this.Options.log('using proxy server ' + httpsproxy);
            const config = url.parse(httpsproxy);
            const agent = new HttpsProxyAgent(config);
            ws = new WebSocket(this.getCombineStreamUrl() + queryParams, { agent: agent });
        } else {
            ws = new WebSocket(this.getCombineStreamUrl() + queryParams);
        }

        ws.reconnect = this.Options.reconnect;
        ws.endpoint = stringHash(queryParams);
        ws.isAlive = false;
        if (this.Options.verbose) {
            this.Options.log('CombinedStream: Subscribed to [' + ws.endpoint + '] ' + queryParams);
        }
        ws.on('open', this.handleSocketOpen.bind(this, ws, opened_callback));
        ws.on('pong', this.handleSocketHeartbeat.bind(this, ws));
        ws.on('error', this.handleSocketError.bind(this, ws));
        ws.on('close', this.handleSocketClose.bind(this, ws, reconnect));
        ws.on('message', data => {
            try {
                if (this.Options.verbose) this.Options.log('CombinedStream: WebSocket data:', data
                );
                callback(JSONbig.parse(data).data);
            } catch (error) {
                this.Options.log('CombinedStream: Parse error: ' + error.message);
            }
        });
        return ws;
    }

    /**
     * Used to terminate a web socket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    terminate(endpoint: string, reconnect = false) {
        if (this.Options.verbose) this.Options.log('WebSocket terminating:', endpoint);
        const ws = this.subscriptions[endpoint];
        if (!ws) return;
        ws.removeAllListeners('message');
        ws.reconnect = reconnect;
        ws.terminate();
    }

    /**
     * Futures heartbeat code with a shared single interval tick
     * @return {undefined}
     */
    futuresSocketHeartbeat() {
        /* Sockets removed from subscriptions during a manual terminate()
         will no longer be at risk of having functions called on them */
        for (const endpointId in this.futuresSubscriptions) {
            const ws = this.futuresSubscriptions[endpointId];
            if (ws.isAlive) {
                ws.isAlive = false;
                if (ws.readyState === WebSocket.OPEN) ws.ping(this.noop);
            } else {
                if (this.Options.verbose) this.Options.log(`Terminating zombie futures WebSocket: ${ws.endpoint}`);
                if (ws.readyState === WebSocket.OPEN) ws.terminate();
            }
        }
    }

    /**
     * Called when a futures socket is opened, subscriptions are registered for later reference
     * @param {function} openCallback - a callback function
     * @return {undefined}
     */
    handleFuturesSocketOpen(wsBind: any, openCallback: Callback) {
        wsBind.isAlive = true;
        if (Object.keys(this.futuresSubscriptions).length === 0) {
            this.socketHeartbeatInterval = setInterval(this.futuresSocketHeartbeat, this.heartBeatInterval);
        }
        this.futuresSubscriptions[wsBind.url] = wsBind;
        if (typeof openCallback === 'function') openCallback(wsBind.url);
    }

    /**
     * Called when futures websocket is closed, subscriptions are de-registered for later reference
     * @param {boolean} reconnect - true or false to reconnect the socket
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    handleFuturesSocketClose(wsBind, reconnect, code, reason) {
        delete this.futuresSubscriptions[wsBind.url];
        if (this.futuresSubscriptions && Object.keys(this.futuresSubscriptions).length === 0) {
            clearInterval(this.socketHeartbeatInterval);
        }
        this.Options.log('Futures WebSocket closed: ' + wsBind.url +
            (code ? ' (' + code + ')' : '') +
            (reason ? ' ' + reason : ''));
        if (this.Options.reconnect && wsBind.reconnect && reconnect) {
            if (wsBind.url && wsBind.url.length === 60) this.Options.log('Futures account data WebSocket reconnecting...');
            else this.Options.log('Futures WebSocket reconnecting: ' + wsBind.url + '...');
            try {
                reconnect();
            } catch (error) {
                this.Options.log('Futures WebSocket reconnect error: ' + error.message);
            }
        }
    }

    /**
     * Called when a futures websocket errors
     * @param {object} error - error object message
     * @return {undefined}
     */
    handleFuturesSocketError(wsBind, error) {
        this.Options.log('Futures WebSocket error: ' + wsBind.url +
            (error.code ? ' (' + error.code + ')' : '') +
            (error.message ? ' ' + error.message : ''));
    }

    /**
     * Called on each futures socket heartbeat
     * @return {undefined}
     */
    handleFuturesSocketHeartbeat(wsBind) {
        wsBind.isAlive = true;
    }

    /**
     * Used to subscribe to a single futures websocket endpoint
     * @param {string} endpoint - endpoint to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    futuresSubscribeSingle(endpoint: string, callback: Callback, params: Dict = {}) {
        if (typeof params === 'boolean') params = { reconnect: params };
        if (!params.reconnect) params.reconnect = false;
        if (!params.openCallback) params.openCallback = false;
        if (!params.id) params.id = false;
        const httpsproxy = this.getHttpsProxy();
        let socksproxy = this.getSocksProxy();
        let ws: any = undefined;

        if (socksproxy) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.Options.verbose) this.Options.log(`futuresSubscribeSingle: using socks proxy server: ${socksproxy}`);
            const agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket((this.getFStreamSingleUrl()) + endpoint, { agent });
        } else if (httpsproxy) {
            const config = url.parse(httpsproxy);
            const agent = new HttpsProxyAgent(config);
            if (this.Options.verbose) this.Options.log(`futuresSubscribeSingle: using proxy server: ${agent}`);
            ws = new WebSocket((this.getFStreamSingleUrl()) + endpoint, { agent });
        } else {
            ws = new WebSocket((this.getFStreamSingleUrl()) + endpoint);
        }

        if (this.Options.verbose) this.Options.log('futuresSubscribeSingle: Subscribed to ' + endpoint);
        callback = callback.bind(this);
        ws.reconnect = this.Options.reconnect;
        ws.endpoint = endpoint;
        ws.isAlive = false;
        ws.on('open', this.handleFuturesSocketOpen.bind(this, ws, params.openCallback));
        ws.on('pong', this.handleFuturesSocketHeartbeat.bind(this, ws));
        ws.on('error', this.handleFuturesSocketError.bind(this, ws));
        ws.on('close', this.handleFuturesSocketClose.bind(this, ws, params.reconnect));
        ws.on('message', data => {
            try {
                if (this.Options.verbose) this.Options.log('futuresSubscribeSingle: Received data:', data);
                callback(JSONbig.parse(data));
            } catch (error) {
                this.Options.log('Parse error: ' + error.message);
            }
        });
        return ws;
    }

    /**
     * Used to subscribe to a combined futures websocket endpoint
     * @param {string} streams - streams to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    futuresSubscribe(streams, callback: Callback, params: Dict = {}) {
        if (typeof streams === 'string') return this.futuresSubscribeSingle(streams, callback, params);
        if (typeof params === 'boolean') params = { reconnect: params };
        if (!params.reconnect) params.reconnect = false;
        if (!params.openCallback) params.openCallback = false;
        if (!params.id) params.id = false;
        const httpsproxy = this.getHttpsProxy();
        let socksproxy = this.getSocksProxy();
        const queryParams = streams.join('/');
        let ws: any = undefined;
        if (socksproxy) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.Options.verbose) this.Options.log(`futuresSubscribe: using socks proxy server ${socksproxy}`);
            const agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket(this.getFStreamUrl() + queryParams, { agent });
        } else if (httpsproxy) {
            if (this.Options.verbose) this.Options.log(`futuresSubscribe: using proxy server ${httpsproxy}`);
            const config = url.parse(httpsproxy);
            const agent = new HttpsProxyAgent(config);
            ws = new WebSocket(this.getFStreamUrl() + queryParams, { agent });
        } else {
            ws = new WebSocket(this.getFStreamUrl() + queryParams);
        }

        ws.reconnect = this.Options.reconnect;
        ws.endpoint = stringHash(queryParams);
        ws.isAlive = false;
        if (this.Options.verbose) {
            this.Options.log(`futuresSubscribe: Subscribed to [${ws.endpoint}] ${queryParams}`);
        }
        ws.on('open', this.handleFuturesSocketOpen.bind(this, ws, params.openCallback));
        ws.on('pong', this.handleFuturesSocketHeartbeat.bind(this, ws));
        ws.on('error', this.handleFuturesSocketError.bind(this, ws));
        ws.on('close', this.handleFuturesSocketClose.bind(this, ws, params.reconnect));
        ws.on('message', data => {
            try {
                if (this.Options.verbose) this.Options.log('futuresSubscribe: Received data:', data);
                callback(JSONbig.parse(data).data);
            } catch (error) {
                this.Options.log(`futuresSubscribe: Parse error: ${error.message}`);
            }
        });
        return ws;
    }

    /**
     * Used to terminate a futures websocket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    futuresTerminate(endpoint: string, reconnect = false) {
        if (this.Options.verbose) this.Options.log('Futures WebSocket terminating:', endpoint);
        const ws = this.futuresSubscriptions[endpoint];
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
    futuresKlineConcat(symbol: string, interval: Interval) {
        const output = this.futuresTicks[symbol][interval];
        if (!this.futuresRealtime[symbol][interval].time) return output;
        const time = this.futuresRealtime[symbol][interval].time;
        const last_updated = Object.keys(this.futuresTicks[symbol][interval]).pop();
        if (time >= last_updated) {
            output[time] = this.futuresRealtime[symbol][interval];
            //delete output[time].time;
            output[last_updated].isFinal = true;
            output[time].isFinal = false;
        }
        return output;
    }

    /**
     * Used for websocket futures @kline
     * @param {string} symbol - the symbol
     * @param {object} kline - object with kline info
     * @param {string} firstTime - time filter
     * @return {undefined}
     */
    futuresKlineHandler(symbol: string, kline: any, firstTime = 0) {
        // eslint-disable-next-line no-unused-vars
        const { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        const { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, V: takerBuyBaseVolume, Q: takerBuyQuoteVolume, n: trades, t: time, T: closeTime } = ticks;
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
    }

    /**
     * Converts the futures liquidation stream data into a friendly object
     * @param {object} data - liquidation data callback data type
     * @return {object} - user friendly data type
     */
    fLiquidationConvertData(data: any) {
        const eventType = data.e, eventTime = data.E;
        const {
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
    }

    /**
     * Converts the futures ticker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    fTickerConvertData(data: any) {
        const friendlyData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
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
    fMiniTickerConvertData(data: any) {
        const friendlyData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
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
    fBookTickerConvertData(data: any) {
        const {
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
     * Converts the futures UserData stream MARGIN_CALL data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    fUserDataMarginConvertData(data: any) {
        const {
            e: eventType,
            E: eventTime,
            cw: crossWalletBalance, // only pushed with crossed position margin call
            // p: positions
        } = data;
        let { positions } = data;
        const positionConverter = position => {
            const {
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
            };
        };
        const convertedPositions = [];
        for (const position of positions) {
            convertedPositions.push(positionConverter(position));
        }
        positions = convertedPositions;
        return {
            eventType,
            eventTime,
            crossWalletBalance,
            positions
        };
    }

    /**
     * Converts the futures UserData stream ACCOUNT_CONFIG_UPDATE into a friendly object
     * @param {object} data - user config callback data type
     * @return {object} - user friendly data type
     */
    fUserConfigDataAccountUpdateConvertData(data: any) {
        return {
            eventType: data.e,
            eventTime: data.E,
            transactionTime: data.T,
            ac: {
                symbol: data.ac.s,
                leverage: data.ac.l
            }
        };
    }

    /**
     * Converts the futures UserData stream ACCOUNT_UPDATE data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    fUserDataAccountUpdateConvertData(data: any) {
        const {
            e: eventType,
            E: eventTime,
            T: transaction,
        } = data;
        let { a: updateData } = data;
        const updateConverter = updateData => {
            const {
                m: eventReasonType
            } = data;
            let {
                // m: eventReasonType,
                B: balances,
                P: positions
            } = updateData;
            const positionConverter = position => {
                const {
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
            const balanceConverter = (balance: any) => {
                const {
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

            for (const balance of balances) {
                balanceResult.push(balanceConverter(balance));
            }
            for (const position of positions) {
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
    }

    /**
     * Converts the futures UserData stream ORDER_TRADE_UPDATE data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    fUserDataOrderUpdateConvertData(data: any) {
        const {
            e: eventType,
            E: eventTime,
            T: transaction, // transaction time
        } = data;

        let { o: order } = data;

        const orderConverter = (order: any) => {
            const {
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
    }

    /**
     * Converts the futures markPrice stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    fMarkPriceConvertData(data: any) {
        const friendlyData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
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
    fAggTradeConvertData(data: any) {
        const friendlyData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
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
    deliverySocketHeartbeat() {
        /* Sockets removed from subscriptions during a manual terminate()
         will no longer be at risk of having functions called on them */
        for (const endpointId in this.deliverySubscriptions) {
            const ws = this.deliverySubscriptions[endpointId];
            if (ws.isAlive) {
                ws.isAlive = false;
                if (ws.readyState === WebSocket.OPEN) ws.ping(this.noop);
            } else {
                if (this.Options.verbose) this.Options.log(`Terminating zombie delivery WebSocket: ${ws.endpoint}`);
                if (ws.readyState === WebSocket.OPEN) ws.terminate();
            }
        }
    }

    /**
     * Called when a delivery socket is opened, subscriptions are registered for later reference
     * @param {function} openCallback - a callback function
     * @return {undefined}
     */
    handleDeliverySocketOpen(wsBind, openCallback: Callback) {
        this.isAlive = true;
        if (Object.keys(this.deliverySubscriptions).length === 0) {
            this.socketHeartbeatInterval = setInterval(this.deliverySocketHeartbeat, 30000);
        }
        this.deliverySubscriptions[wsBind.url] = this;
        if (typeof openCallback === 'function') openCallback(wsBind.url);
    }

    /**
     * Called when delivery websocket is closed, subscriptions are de-registered for later reference
     * @param {boolean} reconnect - true or false to reconnect the socket
     * @param {string} code - code associated with the socket
     * @param {string} reason - string with the response
     * @return {undefined}
     */
    handleDeliverySocketClose(wsBind, reconnect, code, reason) {
        delete this.deliverySubscriptions[wsBind.url];
        if (this.deliverySubscriptions && Object.keys(this.deliverySubscriptions).length === 0) {
            clearInterval(this.socketHeartbeatInterval);
        }
        this.Options.log('Delivery WebSocket closed: ' + wsBind.url +
            (code ? ' (' + code + ')' : '') +
            (reason ? ' ' + reason : ''));
        if (this.Options.reconnect && wsBind.reconnect && reconnect) {
            if (wsBind.url && wsBind.url.length === 60) this.Options.log('Delivery account data WebSocket reconnecting...');
            else this.Options.log('Delivery WebSocket reconnecting: ' + wsBind.url + '...');
            try {
                reconnect();
            } catch (error) {
                this.Options.log('Delivery WebSocket reconnect error: ' + error.message);
            }
        }
    }

    /**
     * Called when a delivery websocket errors
     * @param {object} error - error object message
     * @return {undefined}
     */
    handleDeliverySocketError(wsBind, error) {
        this.Options.log('Delivery WebSocket error: ' + wsBind.url +
            (error.code ? ' (' + error.code + ')' : '') +
            (error.message ? ' ' + error.message : ''));
    }

    /**
     * Called on each delivery socket heartbeat
     * @return {undefined}
     */
    handleDeliverySocketHeartbeat() {
        this.isAlive = true;
    }

    /**
     * Used to subscribe to a single delivery websocket endpoint
     * @param {string} endpoint - endpoint to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    deliverySubscribeSingle(endpoint: string, callback: Callback, params: Dict = {}) {
        if (typeof params === 'boolean') params = { reconnect: params };
        if (!params.reconnect) params.reconnect = false;
        if (!params.openCallback) params.openCallback = false;
        if (!params.id) params.id = false;
        const httpsproxy = this.getHttpsProxy();
        let socksproxy = this.getSocksProxy();
        let ws: any = undefined;
        if (socksproxy) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.Options.verbose) this.Options.log(`deliverySubscribeSingle: using socks proxy server: ${socksproxy}`);
            const agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket((this.getDStreamSingleUrl()) + endpoint, { agent });
        } else if (httpsproxy) {
            const config = url.parse(httpsproxy);
            const agent = new HttpsProxyAgent(config);
            if (this.Options.verbose) this.Options.log(`deliverySubscribeSingle: using proxy server: ${agent}`);
            ws = new WebSocket((this.getDStreamSingleUrl()) + endpoint, { agent });
        } else {
            ws = new WebSocket((this.getDStreamSingleUrl()) + endpoint);
        }

        if (this.Options.verbose) this.Options.log('deliverySubscribeSingle: Subscribed to ' + endpoint);
        ws.reconnect = this.Options.reconnect;
        ws.endpoint = endpoint;
        ws.isAlive = false;
        ws.on('open', this.handleDeliverySocketOpen.bind(this, ws, params.openCallback));
        ws.on('pong', this.handleDeliverySocketHeartbeat.bind(this, ws));
        ws.on('error', this.handleDeliverySocketError.bind(this, ws));
        ws.on('close', this.handleDeliverySocketClose.bind(this, ws, params.reconnect));
        ws.on('message', data => {
            try {
                if (this.Options.verbose) this.Options.log('deliverySubscribeSingle: Received data:', data);
                callback(JSONbig.parse(data));
            } catch (error) {
                this.Options.log('Parse error: ' + error.message);
            }
        });
        return ws;
    }

    /**
     * Used to subscribe to a combined delivery websocket endpoint
     * @param {string} streams - streams to connect to
     * @param {function} callback - the function to call when information is received
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} - websocket reference
     */
    deliverySubscribe(streams, callback: Callback, params: Dict = {}) {
        if (typeof streams === 'string') return this.deliverySubscribeSingle(streams, callback, params);
        if (typeof params === 'boolean') params = { reconnect: params };
        if (!params.reconnect) params.reconnect = false;
        if (!params.openCallback) params.openCallback = false;
        if (!params.id) params.id = false;
        const httpsproxy = this.getHttpsProxy();
        let socksproxy = this.getSocksProxy();
        const queryParams = streams.join('/');
        let ws: any = undefined;
        if (socksproxy) {
            socksproxy = this.proxyReplacewithIp(socksproxy);
            if (this.Options.verbose) this.Options.log(`deliverySubscribe: using socks proxy server ${socksproxy}`);
            const agent = new SocksProxyAgent({
                protocol: this.parseProxy(socksproxy)[0],
                host: this.parseProxy(socksproxy)[1],
                port: this.parseProxy(socksproxy)[2]
            });
            ws = new WebSocket((this.getDStreamUrl()) + queryParams, { agent });
        } else if (httpsproxy) {
            if (this.Options.verbose) this.Options.log(`deliverySubscribe: using proxy server ${httpsproxy}`);
            const config = url.parse(httpsproxy);
            const agent = new HttpsProxyAgent(config);
            ws = new WebSocket((this.getDStreamUrl()) + queryParams, { agent });
        } else {
            ws = new WebSocket((this.getDStreamUrl()) + queryParams);
        }

        ws.reconnect = this.Options.reconnect;
        ws.endpoint = stringHash(queryParams);
        ws.isAlive = false;
        if (this.Options.verbose) {
            this.Options.log(`deliverySubscribe: Subscribed to [${ws.endpoint}] ${queryParams}`);
        }
        ws.on('open', this.handleDeliverySocketOpen.bind(this, ws, params.openCallback));
        ws.on('pong', this.handleDeliverySocketHeartbeat.bind(this, ws));
        ws.on('error', this.handleDeliverySocketError.bind(this, ws));
        ws.on('close', this.handleDeliverySocketClose.bind(this, ws, params.reconnect));
        ws.on('message', data => {
            try {
                if (this.Options.verbose) this.Options.log('deliverySubscribe: Received data:', data);
                callback(JSONbig.parse(data).data);
            } catch (error) {
                this.Options.log(`deliverySubscribe: Parse error: ${error.message}`);
            }
        });
        return ws;
    }

    /**
     * Used to terminate a delivery websocket
     * @param {string} endpoint - endpoint identifier associated with the web socket
     * @param {boolean} reconnect - auto reconnect after termination
     * @return {undefined}
     */
    deliveryTerminate(endpoint: string, reconnect = false) {
        if (this.Options.verbose) this.Options.log('Delivery WebSocket terminating:', endpoint);
        const ws = this.deliverySubscriptions[endpoint];
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
    deliveryKlineConcat(symbol: string, interval: Interval) {
        const output = this.deliveryTicks[symbol][interval];
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
    }

    /**
     * Used for websocket delivery @kline
     * @param {string} symbol - the symbol
     * @param {object} kline - object with kline info
     * @param {string} firstTime - time filter
     * @return {undefined}
     */
    deliveryKlineHandler(symbol: string, kline: any, firstTime = 0) {
        // eslint-disable-next-line no-unused-vars
        const { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        const { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, V: takerBuyBaseVolume, Q: takerBuyQuoteVolume, n: trades, t: time, T: closeTime } = ticks;
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
    }

    /**
     * Converts the delivery liquidation stream data into a friendly object
     * @param {object} data - liquidation data callback data type
     * @return {object} - user friendly data type
     */
    dLiquidationConvertData(data: any) {
        const eventType = data.e, eventTime = data.E;
        const {
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
    }

    /**
     * Converts the delivery ticker stream data into a friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    dTickerConvertData(data: any) {
        const friendlyData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
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
    dMiniTickerConvertData(data: any) {
        const friendlyData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
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
    dBookTickerConvertData(data: any) {
        const {
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
    dMarkPriceConvertData(data: any) {
        const friendlyData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
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
    dAggTradeConvertData(data: any) {
        const friendlyData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
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
    dUserDataOrderUpdateConvertData(data: any) {
        const {
            e: eventType,
            E: eventTime,
            T: transaction, // transaction time
        } = data;

        let { o: order } = data;

        const orderConverter = (order) => {
            const {
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
    }

    /**
     * Used as part of the user data websockets callback
     * @param {object} data - user data callback data type
     * @return {undefined}
     */
    userDataHandler(data: any) {
        const type = data.e;
        this.Options.all_updates_callback(data);
        if (type === 'outboundAccountInfo') {
            // XXX: Deprecated in 2020-09-08
        } else if (type === 'executionReport') {
            if (this.Options.execution_callback) this.Options.execution_callback(data);
        } else if (type === 'listStatus') {
            if (this.Options.list_status_callback) this.Options.list_status_callback(data);
        } else if (type === 'outboundAccountPosition' || type === 'balanceUpdate') {
            if (this.Options.balance_callback) this.Options.balance_callback(data);
        } else {
            this.Options.log('Unexpected userData: ' + type);
        }
    }

    /**
     * Used as part of the user data websockets callback
     * @param {object} data - user data callback data type
     * @return {undefined}
     */
    userMarginDataHandler(data: any) {
        const type = data.e;

        if (this.Options.margin_all_updates_callback) this.Options.all_updates_callback(data);

        if (type === 'outboundAccountInfo') {
            // XXX: Deprecated in 2020-09-08
        } else if (type === 'executionReport') {
            if (this.Options.margin_execution_callback) this.Options.margin_execution_callback(data);
        } else if (type === 'listStatus') {
            if (this.Options.margin_list_status_callback) this.Options.margin_list_status_callback(data);
        } else if (type === 'outboundAccountPosition' || type === 'balanceUpdate') {
            this.Options.margin_balance_callback(data);
        }
    }

    /**
     * Used as part of the user data websockets callback
     * @param {object} data - user data callback data type
     * @return {undefined}
     */
    userFutureDataHandler(data: any) {
        const type = data.e;

        if (this.Options.futures_all_updates_callback) this.Options.futures_all_updates_callback(data);

        if (type === 'MARGIN_CALL') {
            this.Options.future_margin_call_callback(this.fUserDataMarginConvertData(data));
        } else if (type === 'ACCOUNT_UPDATE') {
            if (this.Options.future_account_update_callback) {
                this.Options.future_account_update_callback(this.fUserDataAccountUpdateConvertData(data));
            }
        } else if (type === 'ORDER_TRADE_UPDATE' || type === 'TRADE_LITE') {
            if (this.Options.future_order_update_callback) {
                this.Options.future_order_update_callback(this.fUserDataOrderUpdateConvertData(data));
            }
        } else if (type === 'ACCOUNT_CONFIG_UPDATE') {
            if (this.Options.future_account_config_update_callback) {
                this.Options.future_account_config_update_callback(this.fUserConfigDataAccountUpdateConvertData(data));
            }
        }
    }

    /**
   * Used as part of the user data websockets callback
   * @param {object} data - user data callback data type
   * @return {undefined}
   */
    userDeliveryDataHandler(data: any) {
        const type = data.e;
        if (type === "MARGIN_CALL") {
            this.Options.delivery_margin_call_callback(
                this.fUserDataMarginConvertData(data)
            );
        } else if (type === "ACCOUNT_UPDATE") {
            if (this.Options.delivery_account_update_callback) {
                this.Options.delivery_account_update_callback(
                    this.fUserDataAccountUpdateConvertData(data)
                );
            }
        } else if (type === "ORDER_TRADE_UPDATE") {
            if (this.Options.delivery_order_update_callback) {
                this.Options.delivery_order_update_callback(
                    this.dUserDataOrderUpdateConvertData(data)
                );
            }
        } else {
            this.Options.log("Unexpected userDeliveryData: " + type);
        }
    }

    /**
    * Universal Transfer requires API permissions enabled
    * @param {string} type - ENUM , example MAIN_UMFUTURE for SPOT to USDT futures, see https://binance-docs.github.io/apidocs/spot/en/#user-universal-transfer
    * @param {string} asset - the asset - example :USDT    *
    * @param {number} amount - the callback function
    * @return {promise}
    */
    async universalTransfer(type: string, asset: string, amount: number) {
        const parameters = Object.assign({
            asset,
            amount,
            type,
        });
        return await this.privateSpotRequest("v1/asset/transfer",
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
        const parameters = Object.assign({
            asset,
            amount,
            type,
        });
        return await this.privateSpotRequest("v1/futures/transfer",
            parameters,
            "POST"
        );
    }

    /**
     * Converts the previous day stream into friendly object
     * @param {object} data - user data callback data type
     * @return {object} - user friendly data type
     */
    prevDayConvertData(data: any) {
        const convertData = (data: any) => {
            const {
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
        };
        if (Array.isArray(data)) {
            const result = [];
            for (const obj of data) {
                const converted = convertData(obj);
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
    prevDayStreamHandler(data, callback: Callback) {
        const converted = this.prevDayConvertData(data);
        callback(null, converted);
    }

    /**
     * Gets the price of a given symbol or symbols
     * @param {array} data - array of symbols
     * @return {array} - symbols with their current prices
     */
    priceData(data: any): { [key: string]: number } {
        const prices = {};
        if (Array.isArray(data)) {
            for (const obj of data) {
                prices[obj.symbol] = obj.price;
            }
        } else { // Single price returned
            prices[data.symbol] = parseFloat(data.price);
        }
        return prices;
    }

    /**
     * Used by bookTickers to format the bids and asks given given symbols
     * @param {array} data - array of symbols
     * @return {object} - symbols with their bids and asks data
     */
    bookPriceData(data: any): { [key: string]: BookTicker } {
        if (!Array.isArray(data)) {
            data = [data];
        }
        const prices = {};
        for (const obj of data) {
            prices[obj.symbol] = obj;
        }
        return prices;
    }

    /**
     * Used by balance to get the balance data
     * @param {array} data - account info object
     * @return {object} - balances hel with available, onorder amounts
     */
    balanceData(data: any) {
        const balances = {};
        if (typeof data === 'undefined') return {};
        if (typeof data.balances === 'undefined') {
            this.Options.log('balanceData error', data);
            return {};
        }
        for (const obj of data.balances) {
            balances[obj.asset] = { available: obj.free, onOrder: obj.locked };
        }
        return balances;
    }

    /**
     * Used by web sockets depth and populates OHLC and info
     * @param {string} symbol - symbol to get candlestick info
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @param {array} ticks - tick array
     * @return {undefined}
     */
    klineData(symbol, interval, ticks) { // Used for /depth
        let last_time = 0;
        if (this.isIterable(ticks)) {
            for (const tick of ticks) {
                // eslint-disable-next-line no-unused-vars
                const [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
                this.ohlc[symbol][interval][time] = { open: open, high: high, low: low, close: close, volume: volume };
                last_time = time;
            }

            this.info[symbol][interval].timestamp = last_time;
        }
    }

    /**
     * Combines all OHLC data with latest update
     * @param {string} symbol - the symbol
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @return {array} - interval data for given symbol
     */
    klineConcat(symbol: string, interval: Interval) {
        const output = this.ohlc[symbol][interval];
        if (typeof this.ohlcLatest[symbol][interval].time === 'undefined') return output;
        const time = this.ohlcLatest[symbol][interval].time;
        const last_updated = Object.keys(this.ohlc[symbol][interval]).pop();
        if (time >= last_updated) {
            output[time] = this.ohlcLatest[symbol][interval];
            delete output[time].time;
            output[time].isFinal = false;
        }
        return output;
    }

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
        const { e: eventType, E: eventTime, k: ticks } = kline;
        // eslint-disable-next-line no-unused-vars
        const { o: open, h: high, l: low, c: close, v: volume, i: interval, x: isFinal, q: quoteVolume, t: time } = ticks; //n:trades, V:buyVolume, Q:quoteBuyVolume
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
    }

    /**
     * Used by futures websockets chart cache
     * @param {string} symbol - symbol to get candlestick info
     * @param {string} interval - time interval, 1m, 3m, 5m ....
     * @param {array} ticks - tick array
     * @return {undefined}
     */
    futuresKlineData(symbol: string, interval: Interval, ticks: any[]) {
        let last_time = 0;
        if (this.isIterable(ticks)) {
            for (const tick of ticks) {
                // eslint-disable-next-line no-unused-vars
                const [time, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBaseVolume, takerBuyQuoteVolume, ignored] = tick;
                this.futuresTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades };
                last_time = time;
            }
            this.futuresMeta[symbol][interval].timestamp = last_time;
        }
    }

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
            for (const tick of ticks) {
                // eslint-disable-next-line no-unused-vars
                const [time, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBaseVolume, takerBuyQuoteVolume, ignored] = tick;
                this.deliveryTicks[symbol][interval][time] = { time, closeTime, open, high, low, close, volume, quoteVolume, takerBuyBaseVolume, takerBuyQuoteVolume, trades };
                last_time = time;
            }
            this.deliveryMeta[symbol][interval].timestamp = last_time;
        }
    }

    /**
     * Used for /depth endpoint
     * @param {object} data - containing the bids and asks
     * @return {undefined}
     */
    depthData(data: any) {
        if (!data) return { bids: [], asks: [] };
        const bids = {}, asks = {};
        let obj;
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

    parseOrderBook(data, symbol: string): OrderBook {
        const { lastUpdateId, bids, asks } = data;
        if (!bids || !asks) {
            return data;
        }
        const orderBook: OrderBook = {
            symbol,
            lastUpdateId,
            bids: bids.map(b => zip(['price', 'quantity'], b)),
            asks: asks.map(a => zip(['price', 'quantity'], a))
        };
        return orderBook;
    }

    /**
     * Used for /depth endpoint
     * @param {object} depth - information
     * @return {undefined}
     */
    depthHandler(depth) {
        const symbol = depth.s;
        let obj;
        const context = this.depthCacheContext[symbol];
        const updateDepthCache = () => {
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
                if (this.Options.verbose) this.Options.log(msg);
                throw new Error(msg);
            }
        } else if (depth.U > context.snapshotUpdateId + 1) {
            /* In this case we have a gap between the data of the stream and the snapshot.
             This is an out of sync error, and the connection must be torn down and reconnected. */
            let msg = 'depthHandler: [' + symbol + '] The depth cache is out of sync.';
            msg += ' Symptom: Gap between snapshot and first stream data.';
            if (this.Options.verbose) this.Options.log(msg);
            throw new Error(msg);
        } else if (depth.u < context.snapshotUpdateId + 1) {
            /* In this case we've received data that we've already had since the snapshot.
             This isn't really an issue, and we can just update the cache again, or ignore it entirely. */

            // do nothing
        } else {
            // This is our first legal update from the stream data
            updateDepthCache();
        }
    }

    /**
     * Gets depth cache for given symbol
     * @param {string} symbol - the symbol to fetch
     * @return {object} - the depth cache object
     */
    getDepthCache(symbol: string) {
        if (typeof this.depthCache[symbol] === 'undefined') return { bids: {}, asks: {}};
        return this.depthCache[symbol];
    }

    /**
     * Calculate Buy/Sell volume from DepthCache
     * @param {string} symbol - the symbol to fetch
     * @return {object} - the depth volume cache object
     */
    depthVolume(symbol: string) {
        const cache = this.getDepthCache(symbol);
        let quantity, price;
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
    }

    /**
     * Checks whether or not an array contains any duplicate elements
     * @param {array} array - the array to check
     * @return {boolean} - true or false
     */
    isArrayUnique(array: any[]) {
        return new Set(array).size === array.length;
    }

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
        const range = Object.keys(object).reverse(), output = {};
        for (const price of range) {
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
    sortBids(symbol: string, max = Infinity, baseValue?: string) {
        const object = {};
        let count = 0, cache;
        if (typeof symbol === 'object') cache = symbol;
        else cache = this.getDepthCache(symbol).bids;
        const sorted = Object.keys(cache).sort((a, b) => parseFloat(b) - parseFloat(a));
        let cumulative = 0;
        for (const price of sorted) {
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
    sortAsks(symbol: string, max = Infinity, baseValue?: string) {
        let count = 0, cache;
        const object = {};
        if (typeof symbol === 'object') cache = symbol;
        else cache = this.getDepthCache(symbol).asks;
        const sorted = Object.keys(cache).sort((a, b) => parseFloat(a) - parseFloat(b));
        let cumulative = 0;
        for (const price of sorted) {
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
        // eslint-disable-next-line prefer-spread
        return Math.min.apply(Math, Object.keys(object));
    }

    /**
    * Gets the maximum key form object
    * @param {object} object - the object to get the properties form
    * @return {string} - the minimum key
    */
    max(object) {
        // eslint-disable-next-line prefer-spread
        return Math.max.apply(Math, Object.keys(object));
    }

    /**
    * Sets an option given a key and value
    * @param {string} key - the key to set
    * @param {object} value - the value of the key
    * @return {undefined}
    */
    setOption(key, value) {
        this.Options[key] = value;
    }

    /**
    * Gets an option given a key
    * @param {string} key - the key to set
    * @return {undefined}
    */
    getOption(key: string) { return this.Options[key]; }

    /**
    * Returns the entire info object
    * @return {object} - the info object
    */
    getInfo() { return this.info; }

    /**
    * Returns the used weight from the last request
    * @return {object} - 1m weight used
    */
    usedWeight() { return this.info.usedWeight; }

    /**
    * Returns the status code from the last http response
    * @return {object} - status code
    */
    statusCode() { return this.info.statusCode; }

    /**
    * Returns the ping time from the last futures request
    * @return {object} - latency/ping (2ms)
    */
    futuresLatency() { return this.info.futuresLatency; }

    /**
    * Returns the complete URL from the last request
    * @return {object} - http address including query string
    */
    lastURL() { return this.info.lastURL; }

    /**
    * Returns the order count from the last request
    * @return {object} - orders allowed per 1m
    */
    orderCount() { return this.info.orderCount1m; }

    /**
    * Returns the entire options object
    * @return {object} - the options object
    */
    getOptions() { return this.Options; }

    // /**
    // * Gets an option given a key
    // * @param {object} opt - the object with the class configuration
    //
    // * @return {undefined}
    // */
    // options() {this.setOptions()}

    // /**
    // * Creates a buy order
    // * @param {string} symbol - the symbol to buy
    // * @param {numeric} quantity - the quantity required
    // * @param {numeric} price - the price to pay for each unit
    // * @param {object} flags - additional buy order flags
    //
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // buy(symbol, quantity, price, flags: Dict = {}, callback = false) {
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
    //
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // sell(symbol, quantity, price, flags: Dict = {}, callback = false) {
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
    //
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
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#order-book
    * @param {string} symbol - the symbol
    * @param {int} limit - limit the number of returned orders
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async depth(symbol: string, limit = 100): Promise<OrderBook> {
        const data = await this.publicSpotRequest('v3/depth', { symbol: symbol, limit: limit });
        return this.parseOrderBook(data, symbol);
    }

    /**
    * Gets the average prices of a given symbol
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#current-average-price
    * @param {string} symbol - the symbol
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async avgPrice(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        return await this.publicSpotRequest('v3/avgPrice', params);
    }

    /**
    * Gets the prices of a given symbol(s)
    * @param {string} symbol - the symbol
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#symbol-price-ticker
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async prices(symbol?: string, params: Dict = {}): Promise<{ [key: string]: number }> {
        if (symbol) params.symbol = symbol;
        const data = await this.publicSpotRequest('v3/ticker/price', params);
        return this.priceData(data);
    }

    /**
    * Gets the book tickers of given symbol(s)
    * @see https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/market-data-endpoints#symbol-order-book-ticker
    * @param {string} symbol - the symbol
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async bookTickers(symbol?: string, params: Dict = {}): Promise<{ [key: string]: BookTicker }> {
        if (symbol) params.symbol = symbol;
        const data = await this.publicSpotRequest('v3/ticker/bookTicker', params);
        return this.bookPriceData(data);
    }

    /**
    * Gets the prevday percentage change
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#24hr-ticker-price-change-statistics
    * @param {string} symbol - the symbol or symbols
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async prevDay(symbol?: string, params: Dict = {}): Promise<DailyStats[] | DailyStats> {
        if (symbol) params.symbol = symbol;
        return await this.publicSpotRequest('v3/ticker/24hr', params);
    }

    /**
    * Gets the prevday percentage change
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#24hr-ticker-price-change-statistics
    * @param {string} symbol - the symbol or symbols
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async ticker24h(symbol?: string, params: Dict = {}): Promise<DailyStats[] | DailyStats> {
        if (symbol) params.symbol = symbol;
        return await this.publicSpotRequest('v3/ticker/24hr', params);
    }

    /**
    * Gets the prevday percentage change
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#24hr-ticker-price-change-statistics
    * @param {string} symbol - the symbol or symbols
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async dailyStats(symbol?: string, params: Dict = {}): Promise<DailyStats[] | DailyStats> {
        if (symbol) params.symbol = symbol;
        return await this.publicSpotRequest('v3/ticker/24hr', params);
    }

    /**
    * Gets the the exchange info
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints#exchange-information
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async exchangeInfo() {
        return await this.publicSpotRequest('v3/exchangeInfo', {});
    }

    /**
    * Gets the dust log for user
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async dustLog() {
        return await this.privateSpotRequest('v1/asset/dribblet', {});
    }

    async dustTransfer(assets) {
        return await this.privateSpotRequest('v1/asset/dust', { asset: assets }, 'POST');
    }

    async assetDividendRecord(params: Dict = {}) {
        return await this.privateSpotRequest('v1/asset/assetDividend', params);
    }

    /**
    * Gets the the system status
    * @see https://developers.binance.com/docs/wallet/others/system-status
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async systemStatus(params: Dict = {}) {
        return await this.publicRequest(this.sapi + 'v1/system/status', params);
    }

    /**
    * Withdraws asset to given wallet id
    * @see https://developers.binance.com/docs/wallet/capital/withdraw
    * @param {string} coin - the coin symbol
    * @param {string} address - the wallet to transfer it to
    * @param {number} amount - the amount to transfer
    * @param {string} addressTag - and addtional address tag
    * @param {string} name - the name to save the address as. Set falsy to prevent Binance saving to address book
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async withdraw(coin: string, address: string, amount: number, addressTag?: string, name?: string, params: Dict = {}): Promise<WithdrawResponse> {
        // const params = { asset, address, amount };
        params.coin = coin;
        params.address = address;
        params.amount = amount;
        if (name) params.name = name;
        if (addressTag) params.addressTag = addressTag;

        return await this.privateSapiRequest('v1/capital/withdraw/apply', params, 'POST');
    }

    /**
    * Get the Withdraws history for a given asset
    * @see https://developers.binance.com/docs/wallet/capital/withdraw-history
    * @param {object} params - supports limit and fromId parameters
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async withdrawHistory(params: Dict = {}): Promise<WithdrawHistoryResponse> {
        if (typeof params === 'string') params = { asset: params };
        return await this.privateSpotRequest('v1/capital/withdraw/history', params);
    }

    /**
    * Get the deposit history
    * @see https://developers.binance.com/docs/wallet/capital/deposite-history#http-request
    * @param {object} params - additional params
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async depositHistory(asset?: string, params: Dict = {}): Promise<DepositHistoryResponse> {
        if (asset) params = { asset: asset };
        return await this.privateSpotRequest('v1/capital/deposit/hisrec', params);
    }

    /**
    * Get the deposit address for given asset
    * @see https://developers.binance.com/docs/wallet/capital/deposite-address
    * @param {string} coin - the asset
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async depositAddress(asset: string, params: Dict = {}): Promise<DepositAddress> {
        return await this.privateSpotRequest('v1/capital/deposit/address', this.extend({ coin: asset }, params));
    }

    /**
    * Get the deposit address list for given asset
    * @see https://developers.binance.com/docs/wallet/capital/fetch-deposit-address-list-with-network
    * @param {string} coin - the asset
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async depositAddressList(asset: string, params: Dict = {}) {
        return await this.privateSpotRequest('v1/capital/deposit/address/list', this.extend({ coin: asset }, params));
    }

    /**
    * Get the account status
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/account-endpoints#account-information-user_data
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async accountStatus(params: Dict = {}) {
        return await this.privateSpotRequest('v3/account', params);
    }

    /**
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async apiPermission(params: Dict = {}) {
        return await this.privateSpotRequest('v1/account/apiRestrictions', params);
    }

    /**
    * Get the trade fee
    * @see https://developers.binance.com/docs/wallet/asset/trade-fee
    * @param {string} symbol (optional)
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async tradeFee(symbol?: string) {
        const params = symbol ? { symbol: symbol } : {};
        return await this.privateSapiRequest('v1/asset/tradeFee', params);
    }

    /**
    * Fetch asset detail (minWithdrawAmount, depositStatus, withdrawFee, withdrawStatus, depositTip)
    * @see https://developers.binance.com/docs/wallet/asset
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async assetDetail(params: Dict = {}) {
        return await this.privateSpotRequest('asset/assetDetail', params);
    }

    /**
    * Get the account
    * @see https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints#account-information-user_data
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async account(params: Dict = {}): Promise<Account> {
        return await this.privateSpotRequest('v3/account', params);
    }

    /**
    * Get the balance data
    * @see https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints#account-information-user_data
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async balance(params: Dict = {}) {
        const data = await this.privateSpotRequest('v3/account', params);
        return this.balanceData(data);
    }

    /**
    * Get private trades for a given symbol
    * @see https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints#account-trade-list-user_data
    * @param {string} symbol - the symbol
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async trades(symbol: string, params: Dict = {}): Promise<MyTrade[]> {
        const parameters = this.extend({ symbol: symbol }, params);
        return await this.privateSpotRequest('v3/myTrades', parameters);
    }

    /**
    * Get private trades for a given symbol
    * @see https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/account-endpoints#account-trade-list-user_data
    * @param {string} symbol - the symbol
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async myTrades(symbol: string, params: Dict = {}): Promise<MyTrade[]> {
        const parameters = this.extend({ symbol: symbol }, params);
        return await this.privateSpotRequest('v3/myTrades', parameters);
    }

    /**
    * Tell api to use the server time to offset time indexes
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints#check-server-time
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async useServerTime() {
        const response = await this.publicSpotRequest('v3/time', {});
        this.timeOffset = response.serverTime - new Date().getTime();
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
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints#test-connectivity
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async ping() {
        return await this.publicSpotRequest('v3/ping', {});
    }

    parseAggTrades(symbol: string, trades: any[]): AggregatedTrade[] {
        const parsedTrades: AggregatedTrade[] = [];
        for (const trade of trades) {
            const aggT: AggregatedTrade = {
                aggId: trade.a,
                symbol: symbol,
                price: trade.p,
                quantity: trade.q,
                firstId: trade.f,
                lastId: trade.l,
                timestamp: trade.T,
                isBuyerMaker: trade.m,
            };
            if (trade.M) aggT.wasBestPrice = trade.M;
            parsedTrades.push(aggT);
        }
        return parsedTrades;
    }

    /**
    * Get agg trades for given symbol
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#compressedaggregate-trades-list
    * @param {string} symbol - the symbol
    * @param {object} options - additional optoins
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async aggTrades(symbol: string, params: Dict = {}): Promise<AggregatedTrade[]> { //fromId startTime endTime limit
        const parameters = Object.assign({ symbol }, params);
        const res = await this.publicSpotRequest('v3/aggTrades', parameters);
        return this.parseAggTrades(symbol, res);
    }

    /**
    * Get the recent trades
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#old-trade-lookup
    * @param {string} symbol - the symbol
    * @param {int} limit - limit the number of items returned
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async recentTrades(symbol: string, limit = 500, params: Dict = {}): Promise<Trade[]> {
        return await this.publicSpotRequest('v3/trades', this.extend({ symbol: symbol, limit: limit }, params));
    }

    /**
    * Get the historical trade info
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#old-trade-lookup
    * @param {string} symbol - the symbol
    * @param {int} limit - limit the number of items returned
    * @param {int} fromId - from this id
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async historicalTrades(symbol: string, limit = 500, fromId?: number, params: Dict = {}): Promise<Trade[]> {
        params.symbol = symbol;
        params.limit = limit;
        if (fromId) params.fromId = fromId;
        return await this.publicSpotRequest('v3/historicalTrades', params);
    }

    /**
    * Convert chart data to highstock array [timestamp,open,high,low,close]
    * @param {object} chart - the chart
    * @param {boolean} include_volume - to include the volume or not
    * @return {array} - an array
    */
    highstock(chart, include_volume = false) {
        const array = [];
        for (const timestamp in chart) {
            const obj = chart[timestamp];
            const line = [
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
        const open = [], high = [], low = [], close = [], volume = [];
        for (const timestamp in chart) { //this.ohlc[symbol][interval]
            const obj = chart[timestamp];
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
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#klinecandlestick-data
    * intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    * @param {string} symbol - the symbol
    * @param {function} interval - the callback function
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async candlesticks(symbol: string, interval: Interval = '5m', params: Dict = {}): Promise<Candle[]> {
        if (!params.limit) params.limit = 500;
        params = Object.assign({ symbol: symbol, interval: interval }, params);
        const res = await this.publicSpotRequest('v3/klines', params);
        return this.parseCandles(res);
    }

    /**
    * Gets the candles information for a given symbol
    * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#klinecandlestick-data
    * intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    * @param {string} symbol - the symbol
    * @param {function} interval - the callback function
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async candles(symbol: string, interval: Interval = '5m', params: Dict = {}): Promise<Candle[]> {
        return await this.candlesticks(symbol, interval, params); // make name consistent with futures
    }

    parseCandles(candles: any[]): Candle[] {
        const res: Candle[] = [];
        // spot
        // [
        //     [
        //       1499040000000,      // Open time
        //       "0.01634790",       // Open
        //       "0.80000000",       // High
        //       "0.01575800",       // Low
        //       "0.01577100",       // Close
        //       "148976.11427815",  // Volume
        //       1499644799999,      // Close time
        //       "2434.19055334",    // Quote asset volume
        //       308,                // Number of trades
        //       "1756.87402397",    // Taker buy base asset volume
        //       "28.46694368",      // Taker buy quote asset volume
        //       "17928899.62484339" // Ignore.
        //     ]
        // ]
        for (const rawCandle of candles) {
            const candle: Candle = {
                openTime: rawCandle[0],
                open: rawCandle[1],
                high: rawCandle[2],
                low: rawCandle[3],
                close: rawCandle[4],
                volume: rawCandle[5],
                closeTime: rawCandle[6],
                quoteAssetVolume: rawCandle[7],
                trades: rawCandle[8],
            };
            res.push(candle);
        }
        return res;
    }

    async spotGetDataStream(params: Dict = {}) {
        return await this.privateSpotRequest('v3/userDataStream', params, 'POST', true);
    }

    async spotKeepDataStream(listenKey: string | undefined = undefined, params: Dict = {}) {
        listenKey = listenKey || this.Options.listenKey;
        if (!listenKey) throw new Error('A listenKey is required, either as an argument or in this.Options.listenKey');
        return await this.privateSpotRequest('v3/userDataStream', { listenKey, ...params }, 'PUT');
    }

    async spotCloseDataStream(listenKey: string | undefined = undefined, params: Dict = {}) {
        listenKey = listenKey || this.Options.listenKey;
        if (!listenKey) throw new Error('A listenKey is required, either as an argument or in this.Options.listenKey');
        return await this.privateSpotRequest('v3/userDataStream', { listenKey, ...params }, 'DELETE');
    }

    // /**
    // * Queries the public api
    // * @param {string} url - the public api endpoint
    // * @param {object} data - the data to send
    // * @param {string} method - the http method
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // publicRequest(url: string, data, method: HttpMethod = 'Get') {
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
    //
    // * @param {string} method - the http method
    // * @param {boolean} noDataInSignature - Prevents data from being added to signature
    // * @return {promise or undefined} - omitting the callback returns a promise
    // */
    // signedRequest(url, data, callback, method: HttpMethod = 'GET', noDataInSignature = false) {
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
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async lending(params: Dict = {}) {
        return await this.privateSpotRequest('v1/lending/union/account', params);
    }

    //** Futures methods */
    async futuresPing(params: Dict = {}) {
        return await this.publicFuturesRequest('v1/ping', params);
    }

    async futuresTime(params: Dict = {}) {
        return await this.publicFuturesRequest('v1/time', params).then(r => r.serverTime);
    }
    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information
     * @returns
     */
    async futuresExchangeInfo(params: Dict = {}) {
        return await this.publicFuturesRequest('v1/exchangeInfo', params);
    }

    /**
     * Get the symbol configuration
     * @See https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Symbol-Config
     * @param params
     * @returns
     */
    async futuresSymbolConfig(params: Dict = {}): Promise<SymbolConfig[]> {
        return await this.privateFuturesRequest('v1/symbolConfig', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2
     *
     */
    async futuresPrices(symbol?: string, params: Dict = {}): Promise<{ [key: string]: number }> {
        if (symbol) params.symbol = symbol;
        const data = await this.publicFuturesRequest('v2/ticker/price', params);
        return this.priceData(data);
    }

    /**
    * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics
    */
    async futuresDaily(symbol?: string, params: Dict = {}): Promise<DailyStats | DailyStats[]> {
        if (symbol) params.symbol = symbol;
        return await this.publicFuturesRequest('v1/ticker/24hr', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Open-Interest
     */
    async futuresOpenInterest(symbol: string, params: Dict = {}): Promise<OpenInterest> {
        params.symbol = symbol;
        return await this.publicFuturesRequest('v1/openInterest', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Kline-Candlestick-Data
    */
    async futuresCandles(symbol: string, interval: Interval = "30m", params: Dict = {}): Promise<Candle[]> {
        params.symbol = symbol;
        params.interval = interval;
        const res = await this.publicFuturesRequest('v1/klines', params);
        return this.parseCandles(res);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Kline-Candlestick-Data
    */
    async futuresCandlesticks(symbol: string, interval: Interval = "30m", params: Dict = {}): Promise<Candle[]> {
        return await this.futuresCandles(symbol, interval, params); // make name consistent with spot
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price
     */
    async futuresMarkPrice(symbol?: string, params: Dict = {}): Promise<PremiumIndex | PremiumIndex[]> {
        if (symbol) params.symbol = symbol;
        return await this.publicFuturesRequest('v1/premiumIndex', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Recent-Trades-List
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresTrades(symbol: string, params: Dict = {}): Promise<Trade[]> {
        params.symbol = symbol;
        return await this.publicFuturesRequest('v1/trades', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Old-Trades-Lookup
     * @param symbol symbol if the market
     * @param param
     * @returns
     */
    async futuresHistoricalTrades(symbol: string, params: Dict = {}): Promise<Trade[]> {
        params.symbol = symbol;
        return await this.publicFuturesRequest('v1/historicalTrades', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List
    */
    async futuresAggTrades(symbol: string, params: Dict = {}): Promise<AggregatedTrade[]> {
        params.symbol = symbol;
        return await this.publicFuturesRequest('v1/aggTrades', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresForceOrders(params: Dict = {}): Promise<Order[]> {
        return await this.privateFuturesRequest('v1/forceOrders', params);
    }
    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-ADL-Quantile-Estimation
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresDeleverageQuantile(params: Dict = {}) {
        return await this.privateFuturesRequest('v1/adlQuantile', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresUserTrades(symbol: string, params: Dict = {}): Promise<FuturesUserTrade[]> {
        params.symbol = symbol;
        return await this.privateFuturesRequest('v1/userTrades', params);
    }

    async futuresGetDataStream(params: Dict = {}) {
        //A User Data Stream listenKey is valid for 60 minutes after creation. setInterval
        return await this.privateFuturesRequest('v1/listenKey', params, 'POST');
    }

    async futuresKeepDataStream(params: Dict = {}) {
        return await this.privateFuturesRequest('v1/listenKey', params, 'PUT');
    }

    async futuresCloseDataStream(params: Dict = {}) {
        return await this.privateFuturesRequest('v1/listenKey', params, 'DELETE');
    }

    /**
    * Get the account position risk (v3)
    * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3
    * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async futuresPositionRisk(params: Dict = {}, useV2 = false): Promise<PositionRisk[]> {
        const endpoint = useV2 ? 'v2/positionRisk' : 'v3/positionRisk';
        return await this.privateFuturesRequest(endpoint, params);
    }

    /**
    * Get the account position risk (v2)
    * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3
    * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async futuresPositionRiskV2(params: Dict = {}): Promise<PositionRisk[]> {
        return this.futuresPositionRisk(params, true);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-Info
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresFundingRate(symbol: string, params: Dict = {}): Promise<FundingRate[]> {
        params.symbol = symbol;
        return await this.publicFuturesRequest('v1/fundingRate', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets#http-request
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresLeverageBracket(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.privateFuturesRequest('v1/leverageBracket', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators#http-request
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresTradingStatus(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.privateFuturesRequest('v1/apiTradingStatus', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/User-Commission-Rate#http-request
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresCommissionRate(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.privateFuturesRequest('v1/commissionRate', params);
    }

    // leverage 1 to 125
    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Initial-Leverage
     */
    async futuresLeverage(symbol: string, leverage: number, params: Dict = {}) {
        params.symbol = symbol;
        params.leverage = leverage;
        return await this.privateFuturesRequest('v1/leverage', params, 'POST');
    }

    // ISOLATED, CROSSED
    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type
     * @param symbol symbol if the market
     * @param marginType
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresMarginType(symbol: string, marginType: string, params: Dict = {}) {
        params.symbol = symbol;
        params.marginType = marginType;
        return await this.privateFuturesRequest('v1/marginType', params, 'POST');
    }

    // type: 1: Add postion margin，2: Reduce postion margin
    async futuresPositionMargin(symbol: string, amount: number, type = 1, params: Dict = {}) {
        params.symbol = symbol;
        params.amount = amount;
        params.type = type;
        return await this.privateFuturesRequest('v1/positionMargin', params, 'POST');
    }

    async futuresPositionMarginHistory(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        return await this.privateFuturesRequest('v1/positionMargin/history', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-Income-History
     */
    async futuresIncome(params: Dict = {}) {
        return await this.privateFuturesRequest('v1/income', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V2
    */
    async futuresBalance(params: Dict = {}): Promise<FuturesBalance[]> {
        return await this.privateFuturesRequest('v2/balance', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresAccount(params: Dict = {}): Promise<FuturesAccountInfo> {
        return await this.privateFuturesRequest('v3/account', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresDepth(symbol: string, params: Dict = {}): Promise<OrderBook> {
        params.symbol = symbol;
        const res = await this.publicFuturesRequest('v1/depth', params);
        return this.parseOrderBook(res, symbol);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker
     */
    async futuresQuote(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        const data = await this.publicFuturesRequest('v1/ticker/bookTicker', params);
        return this.bookPriceData(data);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker
     */
    async futuresBookTicker(symbol?: string, params: Dict = {}) {
        return await this.futuresQuote(symbol, params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order
     * @param symbol symbol if the market
     * @param quantity
     * @param price
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresBuy(symbol: string, quantity: number, price: number, params: Dict = {}) {
        return await this.futuresOrder('LIMIT', 'BUY', symbol, quantity, price, params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order
     * @param symbol symbol if the market
     * @param quantity
     * @param price
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresSell(symbol: string, quantity: number, price: number, params: Dict = {}) {
        return await this.futuresOrder('LIMIT', 'SELL', symbol, quantity, price, params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order
     * @param symbol symbol if the market
     * @param quantity
     * @param price
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresMarketBuy(symbol: string, quantity: number, params: Dict = {}) {
        return await this.futuresOrder('MARKET', 'BUY', symbol, quantity, undefined, params);
    }

    /**
     * @description futures limit order
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order
     * @param side
     * @param symbol
     * @param quantity
     * @param price
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresLimitOrder(side: OrderSide, symbol: string, quantity: number, price: number, params: Dict = {}) {
        return await this.futuresOrder('LIMIT', side, symbol, quantity, price, params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order
     * @param symbol symbol if the market
     * @param quantity
     * @param price
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresMarketSell(symbol: string, quantity: number, params: Dict = {}) {
        return await this.futuresOrder('MARKET', 'SELL', symbol, quantity, undefined, params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders
     */
    async futuresMultipleOrders(orders: Dict[] = []): Promise<FuturesOrder[]> {
        for (let i = 0; i < orders.length; i++) {
            if (!orders[i].newClientOrderId) {
                orders[i].newClientOrderId = this.CONTRACT_PREFIX + this.uuid22();
            }
        }
        const params = { batchOrders: JSON.stringify(orders) };
        return await this.privateFuturesRequest('v1/batchOrders', params, 'POST');
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders
     */
    async futuresCancelMultipleOrders(symbol: string, params: Dict = {}): Promise<(FuturesOrder | Response)[]> {
        return await this.privateFuturesRequest('v1/batchOrders', this.extend({ 'symbol': symbol }, params), 'DELETE');
    }

    // futuresOrder, // side symbol quantity [price] [params]

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Order
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Algo-Order
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @param params.conditional set to true to query algo order
     * @returns
     */
    async futuresOrderStatus(symbol: string, params: Dict = {}): Promise<FuturesOrder> { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        if ('conditional' in params) {
            delete params.conditional;
            return await this.privateFuturesRequest('v1/algoOrder', params);
        }
        return await this.privateFuturesRequest('v1/order', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Algo-Order
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresAlgoOrderStatus(symbol: string, params: Dict = {}): Promise<FuturesAlgoOrder> { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        return await this.privateFuturesRequest('v1/algoOrder', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Algo-Order
     * @param symbol symbol if the market
     * @param orderId
     * @param params.conditional set to true to cancel algo order
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresCancel(symbol: string, orderId?: number | string, params: Dict = {}): Promise<CancelOrder> { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        if ('conditional' in params) {
            delete params.conditional;
            if (orderId) params.algoid = orderId;
            return await this.privateFuturesRequest('v1/algoOrder', params, 'DELETE');
        }
        if (orderId) params.orderId = orderId;
        return await this.privateFuturesRequest('v1/order', params, 'DELETE');
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Algo-Order
     * @param symbol symbol if the market
     * @param orderId
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresCancelAlgoOrder(symbol: string, orderId?: number | string, params: Dict = {}): Promise<CancelAlgoOrder> { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        if (orderId) params.algoid = orderId;
        return await this.privateFuturesRequest('v1/algoOrder', params, 'DELETE');
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-All-Open-Orders
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @param params.conditional set to true to cancel algo order
     * @returns
     */
    async futuresCancelAll(symbol: string, params: Dict = {}): Promise<Response> {
        params.symbol = symbol;
        if ('conditional' in params) {
            delete params.conditional;
            return await this.privateFuturesRequest('v1/algoOpenOrders', params, 'DELETE');
        }
        return await this.privateFuturesRequest('v1/allOpenOrders', params, 'DELETE');
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-All-Algo-Open-Orders
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresCancelAllAlgo(symbol: string, params: Dict = {}): Promise<Response> {
        params.symbol = symbol;
        return await this.privateFuturesRequest('v1/algoOpenOrders', params, 'DELETE');
    }

    /**
     *
     * @param symbol symbol if the market
     * @param countdownTime
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresCountdownCancelAll(symbol, countdownTime = 0, params: Dict = {}) {
        params.symbol = symbol;
        params.countdownTime = countdownTime;
        return await this.privateFuturesRequest('v1/countdownCancelAll', params, 'POST');
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @param params.conditional set to true to query algo open orders
     * @returns
     */
    async futuresOpenOrders(symbol?: string, params: Dict = {}): Promise<FuturesOrder[]> {
        if (symbol) params.symbol = symbol;
        if ('conditional' in params) {
            delete params.conditional;
            return await this.privateFuturesRequest('v1/algoOpenOrders', params);
        }
        return await this.privateFuturesRequest('v1/openOrders', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresOpenAlgoOrders(symbol?: string, params: Dict = {}): Promise<FuturesOrder[]> {
        if (symbol) params.symbol = symbol;
        return await this.privateFuturesRequest('v1/openAlgoOrders', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/All-Orders
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresAllOrders(symbol?: string, params: Dict = {}): Promise<FuturesOrder[]> { // Get all account orders; active, canceled, or filled.
        if (symbol) params.symbol = symbol;
        return await this.privateFuturesRequest('v1/allOrders', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresAllAlgoOrders(symbol?: string, params: Dict = {}): Promise<FuturesAlgoOrder[]> { // Get all account orders; active, canceled, or filled.
        if (symbol) params.symbol = symbol;
        return await this.privateFuturesRequest('v1/allAlgoOrders', params);
    }

    /**
     *
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresPositionSideDual(params: Dict = {}) {
        return await this.privateFuturesRequest('v1/positionSide/dual', params);
    }

    /**
     *
     * @param dualSidePosition
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresChangePositionSideDual(dualSidePosition, params: Dict = {}) {
        params.dualSidePosition = dualSidePosition;
        return await this.privateFuturesRequest('v1/positionSide/dual', params, 'POST');
    }

    /**
     *
     * @param symbol symbol if the market
     * @param params extra parameters to be sent in the request
     * @returns
     */
    async futuresTransferAsset(asset: string, amount: number, type: string, params: Dict = {}) {
        params = Object.assign({ asset, amount, type });
        return await this.privateSpotRequest('v1/futures/transfer', params, 'POST');
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/futures-data/market-data
     * @param symbol
     * @param params
     * @returns
     */
    async futuresHistDataLink(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.privateSpotRequest('v1/futuresHistDataId', params);
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id
     * @param downloadId
     * @returns
     */
    async futuresTradeDownloadLink(downloadId) {
        return await this.privateFuturesRequest('v1/trade/asyn/id', { downloadId });
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
    const futuresOrder = (side, symbol, quantity, price = 0, flags: Dict = {}, callback = false) => {
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

    async deliveryPing(params: Dict = {}) {
        return await this.publicDeliveryRequest('v1/ping', params);
    }

    async deliveryTime(params: Dict = {}) {
        return await this.publicDeliveryRequest('v1/time', params);
    }

    async deliveryExchangeInfo(params: Dict = {}) {
        return await this.publicDeliveryRequest('v1/exchangeInfo', params);
    }

    async deliveryPrices(params: Dict = {}) {
        const data = await this.publicDeliveryRequest('v1/ticker/price', params);
        return data.reduce((out, i) => ((out[i.symbol] = i.price), out), {});
    }

    async deliveryDaily(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        const data = await this.publicDeliveryRequest('v1/ticker/24hr', params);
        return symbol ? data : data.reduce((out, i) => ((out[i.symbol] = i), out), {});
    }

    async deliveryOpenInterest(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        const res = await this.publicDeliveryRequest('v1/openInterest', params);
        return res;
    }

    /**
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Kline-Candlestick-Data
     * @param symbol 
     * @param interval
     * @param params
     * @returns
     */
    async deliveryCandles(symbol: string, interval: Interval = "30m", params: Dict = {}): Promise<Candle[]> {
        params.symbol = symbol;
        params.interval = interval;
        const res = await this.publicDeliveryRequest('v1/klines', params);
        return this.parseCandles(res);
    }

    async deliveryContinuousKlines(pair: string, contractType = "CURRENT_QUARTER", interval: Interval = "30m", params: Dict = {}) {
        params.pair = pair;
        params.interval = interval;
        params.contractType = contractType;
        return await this.publicDeliveryRequest('v1/continuousKlines', params);
    }

    async deliveryIndexKlines(pair: string, interval: Interval = "30m", params: Dict = {}) {
        params.pair = pair;
        params.interval = interval;
        return await this.publicDeliveryRequest('v1/indexPriceKlines', params);
    }

    async deliveryMarkPriceKlines(symbol: string, interval: Interval = "30m", params: Dict = {}) {
        params.symbol = symbol;
        params.interval = interval;
        return await this.publicDeliveryRequest('v1/markPriceKlines', params);
    }

    async deliveryMarkPrice(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.publicDeliveryRequest('v1/premiumIndex', params);
    }

    async deliveryTrades(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        return await this.publicDeliveryRequest('v1/trades', params);
    }

    async deliveryHistoricalTrades(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        return await this.publicDeliveryRequest('v1/historicalTrades', params);
    }

    async deliveryAggTrades(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        return await this.publicDeliveryRequest('v1/aggTrades', params);
    }

    async deliveryUserTrades(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/userTrades', params);
    }

    async deliveryCommissionRate(symbol: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/commissionRate', params);
    }

    async deliveryGetDataStream(params: Dict = {}) {
        //A User Data Stream listenKey is valid for 60 minutes after creation. setInterval
        return await this.privateDeliveryRequest('v1/listenKey', params, 'POST');
    }

    async deliveryKeepDataStream(params: Dict = {}) {
        return await this.privateDeliveryRequest('v1/listenKey', params, 'PUT');
    }

    async deliveryCloseDataStream(params: Dict = {}) {
        return await this.privateDeliveryRequest('v1/listenKey', params, 'DELETE');
    }

    async deliveryLiquidationOrders(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.publicDeliveryRequest('v1/allForceOrders', params);
    }

    async deliveryPositionRisk(params: Dict = {}) {
        return await this.privateDeliveryRequest('v1/positionRisk', params);
    }

    async deliveryLeverageBracket(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/leverageBracket', params);
    }

    async deliveryLeverageBracketSymbols(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.privateDeliveryRequest('v2/leverageBracket', params);
    }

    // leverage 1 to 125
    async deliveryLeverage(symbol: string, leverage: number, params: Dict = {}) {
        params.symbol = symbol;
        params.leverage = leverage;
        return await this.privateDeliveryRequest('v1/leverage', params, 'POST');
    }

    // ISOLATED, CROSSED
    async deliveryMarginType(symbol: string, marginType: string, params: Dict = {}) {
        params.symbol = symbol;
        params.marginType = marginType;
        return await this.privateDeliveryRequest('v1/marginType', params, 'POST');
    }

    // type: 1: Add postion margin，2: Reduce postion margin
    async deliveryPositionMargin(symbol: string, amount: number, type = 1, params: Dict = {}) {
        params.symbol = symbol;
        params.amount = amount;
        params.type = type;
        return await this.privateDeliveryRequest('v1/positionMargin', params, 'POST');
    }

    async deliveryPositionMarginHistory(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/positionMargin/history', params);
    }

    async deliveryIncome(params: Dict = {}) {
        return await this.privateDeliveryRequest('v1/income', params);
    }

    async deliveryBalance(params: Dict = {}) {
        return await this.privateDeliveryRequest('v1/balance', params);
    }

    async deliveryAccount(params: Dict = {}) {
        return await this.privateDeliveryRequest('v1/account', params);
    }

    async deliveryDepth(symbol: string, params: Dict = {}): Promise<OrderBook> {
        params.symbol = symbol;
        const res = await this.publicDeliveryRequest('v1/depth', params);
        return this.parseOrderBook(res, symbol);
    }

    async deliveryQuote(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        //let data = await this.promiseRequest( 'v1/ticker/bookTicker', params, {base:dapi} );
        //return data.reduce((out, i) => ((out[i.symbol] = i), out), {}),
        const data = await this.publicDeliveryRequest('v1/ticker/bookTicker', params);
        return symbol ? data : data.reduce((out, i) => ((out[i.symbol] = i), out), {});
    }

    async deliveryBuy(symbol: string, quantity: number, price: number, params: Dict = {}) {
        return await this.deliveryOrder('LIMIT', 'BUY', symbol, quantity, price, params);
    }

    async deliverySell(symbol: string, quantity: number, price: number, params: Dict = {}) {
        return await this.deliveryOrder('LIMIT', 'SELL', symbol, quantity, price, params);
    }

    async deliveryMarketBuy(symbol: string, quantity: number, params: Dict = {}) {
        return await this.deliveryOrder('MARKET', 'BUY', symbol, quantity, undefined, params);
    }

    async deliveryMarketSell(symbol: string, quantity: number, params: Dict = {}) {
        return await this.deliveryOrder('MARKET', 'SELL', symbol, quantity, undefined, params);
    }

    // deliveryOrder, // side symbol quantity [price] [params]

    async deliveryOrderStatus(symbol: string, params: Dict = {}) { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/order', params);
    }

    async deliveryCancel(symbol: string, params: Dict = {}) { // Either orderId or origClientOrderId must be sent
        params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/order', params, 'DELETE');
    }

    async deliveryCancelAll(symbol: string, params: Dict = {}) {
        params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/allOpenOrders', params, 'DELETE');
    }

    async deliveryCountdownCancelAll(symbol: string, countdownTime = 0, params: Dict = {}) {
        params.symbol = symbol;
        params.countdownTime = countdownTime;
        return await this.privateDeliveryRequest('v1/countdownCancelAll', params, 'POST');
    }

    async deliveryOpenOrders(symbol?: string, params: Dict = {}) {
        if (symbol) params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/openOrders', params);
    }

    async deliveryAllOrders(symbol?: string, params: Dict = {}) { // Get all account orders; active, canceled, or filled.
        if (symbol) params.symbol = symbol;
        return await this.privateDeliveryRequest('v1/allOrders', params);
    }

    async deliveryPositionSideDual(params: Dict = {}) {
        return await this.privateDeliveryRequest('v1/positionSide/dual', params);
    }

    async deliveryChangePositionSideDual(dualSidePosition, params: Dict = {}) {
        params.dualSidePosition = dualSidePosition;
        return await this.privateDeliveryRequest('v1/positionSide/dual', params, 'POST');
    }

    //** Margin methods */

    /**
     * Creates an order
     * @see https://developers.binance.com/docs/margin_trading/trade/Margin-Account-New-Order
     * @param {string} side - BUY or SELL
     * @param {string} symbol - the symbol to buy
     * @param {numeric} quantity - the quantity required
     * @param {numeric} price - the price to pay for each unit
     * @param {object} params - additional buy order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgOrder(type: OrderType, side: string, symbol: string, quantity: number, price: number, params: Dict = {}, isIsolated = 'FALSE') {
        return await this.marginOrder(type, side, symbol, quantity, price, { ...params, isIsolated });
    }

    /**
     * Creates a buy order
     * @see https://developers.binance.com/docs/margin_trading/trade/Margin-Account-New-Order
     * @param {string} symbol - the symbol to buy
     * @param {numeric} quantity - the quantity required
     * @param {numeric} price - the price to pay for each unit
     * @param {object} params - additional buy order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgBuy(symbol: string, quantity: number, price: number, params: Dict = {}, isIsolated = 'FALSE') {
        return await this.marginOrder('LIMIT', 'BUY', symbol, quantity, price, { ...params, isIsolated });
    }

    /**
     * Creates a sell order
     * @see https://developers.binance.com/docs/margin_trading/trade/Margin-Account-New-Order
     * @param {string} symbol - the symbol to sell
     * @param {numeric} quantity - the quantity required
     * @param {numeric} price - the price to sell each unit for
     * @param {object} flags - additional order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgSell(symbol: string, quantity: number, price: number, flags: Dict = {}, isIsolated = 'FALSE') {
        return await this.marginOrder('LIMIT', 'SELL', symbol, quantity, price, { ...flags, isIsolated });
    }

    /**
     * Creates a market buy order
     * @see https://developers.binance.com/docs/margin_trading/trade/Margin-Account-New-Order
     * @param {string} symbol - the symbol to buy
     * @param {numeric} quantity - the quantity required
     * @param {object} flags - additional buy order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgMarketBuy(symbol: string, quantity: number, params: Dict = {}, isIsolated = 'FALSE') {
        return await this.marginOrder('MARKET', 'BUY', symbol, quantity, 0, { ...params, isIsolated });
    }

    /**
     * Creates a market sell order
     * @see https://developers.binance.com/docs/margin_trading/trade/Margin-Account-New-Order
     * @param {string} symbol - the symbol to sell
     * @param {numeric} quantity - the quantity required
     * @param {object} flags - additional sell order flags
     * @param {string} isIsolated - the isolate margin option
     * @return {undefined}
     */
    async mgMarketSell(symbol: string, quantity: number, params: Dict = {}, isIsolated = 'FALSE') {
        return await this.marginOrder('MARKET', 'SELL', symbol, quantity, 0, { ...params, isIsolated });
    }

    /**
     * Cancels an order
     * @param {string} symbol - the symbol to cancel
     * @param {string} orderid - the orderid to cancel
     * @return {undefined}
     */
    async mgCancel(symbol: string, orderid: number | string, isIsolated = 'FALSE'): Promise<CancelOrder> {
        return await this.privateSapiRequest('v1/margin/order', { symbol: symbol, orderId: orderid, isIsolated }, 'DELETE');
    }

    /**
    * Gets all order of a given symbol
    * @param {string} symbol - the symbol
    * @param {object} options - additional options
    * @return {promise or undefined} - omitting the callback returns a promise
    */
    async mgAllOrders(symbol: string, params: Dict = {}): Promise<Order[]> {
        const parameters = Object.assign({ symbol: symbol }, params);
        return await this.privateSapiRequest('v1/margin/allOrders', parameters);
    }

    /**
     * Gets the status of an order
     * @param {string} symbol - the symbol to check
     * @param {string} orderid - the orderid to check
     * @param {object} flags - any additional flags
     * @return {undefined}
     */
    async mgOrderStatus(symbol: string, orderid: number | string, flags = {}): Promise<Order> {
        const parameters = Object.assign({ symbol: symbol, orderId: orderid }, flags);
        return await this.privateSapiRequest('v1/margin/order', parameters);
    }

    /**
     * Gets open orders
     * @param {string} symbol - the symbol to get
     * @return {undefined}
     */
    async mgOpenOrders(symbol?: string, params: Dict = {}): Promise<Order[]> {
        if (symbol) params.symbol = symbol;
        return await this.privateSapiRequest('v1/margin/openOrders', params);
    }

    /**
     * Cancels all order of a given symbol
     * @param {string} symbol - the symbol to cancel all orders for
     * @return {undefined}
     */
    async mgCancelOrders(symbol: string, params: Dict = {}) {
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
        return await this.privateSapiRequest('v1/margin/openOrders', this.extend({ symbol: symbol }, params), 'DELETE');
    }

    /**
     * Transfer from main account to margin account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {object} options - additional options
     * @return {undefined}
     */
    async mgTransferMainToMargin(asset: string, amount: number, params: Dict = {}) {
        params = this.extend({ asset: asset, amount: amount, type: 1 }, params);
        return await this.privateSapiRequest('v1/margin/transfer', params, 'POST');
    }

    /**
     * Transfer from margin account to main account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @return {undefined}
     */
    async mgTransferMarginToMain(asset: string, amount: number, params: Dict = {}) {
        const parameters = Object.assign({ asset: asset, amount: amount, type: 2 });
        return await this.privateSapiRequest('v1/margin/transfer', this.extend(parameters, params), 'POST');
    }
    // /**
    // * Universal Transfer requires API permissions enabled
    // * @param {string} type - ENUM , example MAIN_UMFUTURE for SPOT to USDT futures, see https://binance-docs.github.io/apidocs/spot/en/#user-universal-transfer
    // * @param {string} asset - the asset - example :USDT
    // * @param {number} amount - the callback function
    // (optionnal)
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
    async mgTrades(symbol: string, params: Dict = {}): Promise<MyTrade[]> {
        const parameters = Object.assign({ symbol: symbol }, params);
        return await this.privateSapiRequest('v1/margin/myTrades', parameters);
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
 (optionnal)
 * @return {undefined}
 */
    async transferFuturesToMain(asset: string, amount: number) {
        return await this.transferBetweenMainAndFutures(asset, amount, 2);
    }

    /**
     * Transfer from main account to delivery account
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     (optionnal)
     * @param {object} options - additional options
     * @return {undefined}
     */
    async transferMainToDelivery(asset: string, amount: number) {
        return await this.transferBetweenMainAndFutures(asset, amount, 3);
    }

    /**
 * Transfer from delivery account to main account
 * @param {string} asset - the asset
 * @param {number} amount - the asset
 * @return {undefined}
 */
    async transferDeliveryToMain(asset: string, amount: number) {
        return await this.transferBetweenMainAndFutures(asset, amount, 4);
    }

    /**
     * Get maximum transfer-out amount of an asset
     * @param {string} asset - the asset
     * @return {undefined}
     */
    async maxTransferable(asset: string) {
        return await this.privateSpotRequest('v1/margin/maxTransferable', { asset: asset });
    }

    /**
     * Margin account borrow/loan
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {string} isIsolated - the isolated option
     * @param {string} symbol - symbol for isolated margin
     * @return {undefined}
     */
    async mgBorrow(asset: string, amount: number, isIsolated = 'FALSE', symbol?: string, params: Dict = {}) {
        const parameters = Object.assign({ asset: asset, amount: amount });
        if (isIsolated === 'TRUE' && !symbol) throw new Error('If "isIsolated" = "TRUE", "symbol" must be sent');
        const isolatedObj = isIsolated === 'TRUE' ? {
            isIsolated,
            symbol
        } : {};
        return await this.privateSapiRequest('v1/margin/loan', this.extend({ ...parameters, ...isolatedObj }, params), 'POST');
    }

    /**
     * Margin account borrow/loan
     * @param {string} asset - the asset
     * @param {object} options - additional options
     * @return {undefined}
     */
    async mgQueryLoan(asset: string, options) {
        const parameters = Object.assign({ asset: asset }, options);
        return await this.privateSapiRequest('v1/margin/loan', { ...parameters }, 'GET');
    }

    /**
     * Margin account repay
     * @param {string} asset - the asset
     * @param {object} params - additional options
     * @return {undefined}
     */
    async mgQueryRepay(asset: string, params: Dict = {}) {
        const parameters = Object.assign({ asset: asset }, params);
        return await this.privateSapiRequest('v1/margin/repay', { ...parameters }, 'GET');
    }

    /**
     * Margin account repay
     * @param {string} asset - the asset
     * @param {number} amount - the asset
     * @param {string} isIsolated - the isolated option
     * @param {string} symbol - symbol for isolated margin
     * @return {undefined}
     */
    async mgRepay(asset: string, amount: number, isIsolated = 'FALSE', symbol?: string, params: Dict = {}) {
        const parameters = Object.assign({ asset: asset, amount: amount });
        if (isIsolated === 'TRUE' && !symbol) throw new Error('If "isIsolated" = "TRUE", "symbol" must be sent');
        const isolatedObj = isIsolated === 'TRUE' ? {
            isIsolated,
            symbol
        } : {};
        return await this.privateSapiRequest('v1/margin/repay', this.extend({ ...parameters, ...isolatedObj }, params), 'POST');
    }

    /**
     * Margin account details
     * @param {boolean} isIsolated - the callback function
     * @return {undefined}
     */
    async mgAccount(isIsolated = false, params: Dict = {}) {
        let endpoint = 'v1/margin';
        endpoint += (isIsolated) ? '/isolated' : '' + '/account';
        return await this.privateSapiRequest(endpoint, params);
    }
    /**
     * Get maximum borrow amount of an asset
     * @param {string} asset - the asset
     * @return {undefined}
     */
    async maxBorrowable(asset: string, params: Dict = {}) {
        params.asset = asset;
        return await this.privateSapiRequest('v1/margin/maxBorrowable', params);
    }

    // // Futures WebSocket Functions:
    // /**
    //  * Subscribe to a single futures websocket
    //  * @param {string} url - the futures websocket endpoint
    //  * @param {function} callback - optional execution callback
    //  * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
    //  * @return {WebSocket} the websocket reference
    //  */
    // async this.futuresSubscribeSingle(url, callback: Callback, params: Dict = {}) {
    //     return this.futuresSubscribeSingle(url, callback, params);
    // }

    // /**
    //  * Subscribe to a combined futures websocket
    //  * @param {string} streams - the list of websocket endpoints to connect to
    //  * @param {function} callback - optional execution callback
    //  * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
    //  * @return {WebSocket} the websocket reference
    //  */
    // futuresSubscribe(streams, callback: Callback, params: Dict = {}) {
    //     return futuresSubscribe(streams, callback, params);
    // }

    /**
     * Returns the known futures websockets subscriptions
     * @return {array} array of futures websocket subscriptions
     */
    getFuturesSubscriptions() {
        return this.futuresSubscriptions;
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
    futuresAggTradeStream(symbols: string[] | string, callback: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.futuresAggTradeStream(symbols, callback);
        };
        let subscription;
        const cleanCallback = data => callback(this.fAggTradeConvertData(data));
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('futuresAggTradeStream: "symbols" cannot contain duplicate elements.');
            const streams = symbols.map(symbol => symbol.toLowerCase() + '@aggTrade');
            subscription = this.futuresSubscribe(streams, cleanCallback, { reconnect });
        } else {
            const symbol = symbols as string;
            subscription = this.futuresSubscribeSingle(symbol.toLowerCase() + '@aggTrade', cleanCallback, { reconnect });
        }
        return (subscription as any).url;
    }

    /**
     * Futures WebSocket mark price
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @param {string} speed - 1 second updates. leave blank for default 3 seconds
     * @return {string} the websocket endpoint
     */
    futuresMarkPriceStream(symbol?: string, callback = console.log, speed = '@1s') {
        const reconnect = () => {
            if (this.Options.reconnect) this.futuresMarkPriceStream(symbol, callback, speed);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@markPrice` : '!markPrice@arr';
        const subscription = this.futuresSubscribeSingle(endpoint + speed, data => callback(this.fMarkPriceConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Futures WebSocket liquidations stream
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresLiquidationStream(symbol?: string, callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.futuresLiquidationStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@forceOrder` : '!forceOrder@arr';
        const subscription = this.futuresSubscribeSingle(endpoint, data => callback(this.fLiquidationConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Futures WebSocket prevDay ticker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresTickerStream(symbol?: string, callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.futuresTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@ticker` : '!ticker@arr';
        const subscription = this.futuresSubscribeSingle(endpoint, data => callback(this.fTickerConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Futures WebSocket miniTicker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresMiniTickerStream(symbol?: string, callback: Callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.futuresMiniTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@miniTicker` : '!miniTicker@arr';
        const subscription = this.futuresSubscribeSingle(endpoint, data => callback(this.fMiniTickerConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Futures WebSocket bookTicker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresBookTickerStream(symbol?: string, callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.futuresBookTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@bookTicker` : '!bookTicker';
        const subscription = this.futuresSubscribeSingle(endpoint, data => callback(this.fBookTickerConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Websocket futures klines
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @param {int} limit - maximum results, no more than 1000
     * @return {string} the websocket endpoint
     */
    futuresChart(symbols: string[] | string, interval: Interval, callback: Callback, limit = 500) {
        const reconnect = () => {
            if (this.Options.reconnect) this.futuresChart(symbols, interval, callback, limit);
        };

        const futuresChartInit = (symbol: string) => {
            if (typeof this.futuresMeta[symbol] === 'undefined') this.futuresMeta[symbol] = {};
            if (typeof this.futuresMeta[symbol][interval] === 'undefined') this.futuresMeta[symbol][interval] = {};
            if (typeof this.futuresTicks[symbol] === 'undefined') this.futuresTicks[symbol] = {};
            if (typeof this.futuresTicks[symbol][interval] === 'undefined') this.futuresTicks[symbol][interval] = {};
            if (typeof this.futuresRealtime[symbol] === 'undefined') this.futuresRealtime[symbol] = {};
            if (typeof this.futuresRealtime[symbol][interval] === 'undefined') this.futuresRealtime[symbol][interval] = {};
            if (typeof this.futuresKlineQueue[symbol] === 'undefined') this.futuresKlineQueue[symbol] = {};
            if (typeof this.futuresKlineQueue[symbol][interval] === 'undefined') this.futuresKlineQueue[symbol][interval] = [];
            this.futuresMeta[symbol][interval].timestamp = 0;
        };

        const handleFuturesKlineStream = kline => {
            const symbol = kline.s, interval: Interval = kline.k.i;
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

        const getFuturesKlineSnapshot = async (symbol: string, limit = 500) => {
            const data = await this.publicFuturesRequest('v1/klines', { symbol, interval, limit });
            this.futuresKlineData(symbol, interval, data);
            //this.options.log('/futures klines at ' + this.futuresMeta[symbol][interval].timestamp);
            if (typeof this.futuresKlineQueue[symbol][interval] !== 'undefined') {
                for (const kline of this.futuresKlineQueue[symbol][interval]) this.futuresKlineHandler(symbol, kline, this.futuresMeta[symbol][interval].timestamp);
                delete this.futuresKlineQueue[symbol][interval];
            }
            if (callback) callback(symbol, interval, this.futuresKlineConcat(symbol, interval));
        };

        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('futuresChart: "symbols" array cannot contain duplicate elements.');
            symbols.forEach(futuresChartInit);
            const streams = symbols.map(symbol => `${symbol.toLowerCase()}@kline_${interval}`);
            subscription = this.futuresSubscribe(streams, handleFuturesKlineStream, reconnect);
            symbols.forEach(element => getFuturesKlineSnapshot(element, limit));
        } else {
            const symbol = symbols;
            futuresChartInit(symbol);
            subscription = this.futuresSubscribeSingle(symbol.toLowerCase() + '@kline_' + interval, handleFuturesKlineStream, { reconnect });
            getFuturesKlineSnapshot(symbol, limit);
        }
        return (subscription as any).url;
    }

    /**
     * Websocket futures candlesticks
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    futuresCandlesticksStream(symbols: string[] | string, interval: Interval, callback: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.futuresCandlesticksStream(symbols, interval, callback);
        };
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('futuresCandlesticks: "symbols" array cannot contain duplicate elements.');
            const streams = symbols.map(symbol => symbol.toLowerCase() + '@kline_' + interval);
            subscription = this.futuresSubscribe(streams, callback, { reconnect });
        } else {
            const symbol = symbols.toLowerCase();
            subscription = this.futuresSubscribeSingle(symbol + '@kline_' + interval, callback, { reconnect });
        }
        return (subscription as any).url;
    }

    // Delivery WebSocket Functions:
    /**
     * Subscribe to a single delivery websocket
     * @param {string} url - the delivery websocket endpoint
     * @param {function} callback - optional execution callback
     * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
     * @return {WebSocket} the websocket reference
     */
    // deliverySubscribeSingle(url, callback: Callback, params: Dict = {}) {
    //     return deliverySubscribeSingle(url, callback, params);
    // }

    // /**
    //  * Subscribe to a combined delivery websocket
    //  * @param {string} streams - the list of websocket endpoints to connect to
    //  * @param {function} callback - optional execution callback
    //  * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
    //  * @return {WebSocket} the websocket reference
    //  */
    // deliverySubscribe(streams, callback: Callback, params: Dict = {}) {
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
    deliveryAggTradeStream(symbols: string[] | string, callback: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.deliveryAggTradeStream(symbols, callback);
        };
        let subscription;
        const cleanCallback = data => callback(this.dAggTradeConvertData(data));
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('deliveryAggTradeStream: "symbols" cannot contain duplicate elements.');
            const streams = symbols.map(symbol => symbol.toLowerCase() + '@aggTrade');
            subscription = this.deliverySubscribe(streams, cleanCallback, { reconnect });
        } else {
            const symbol = symbols;
            subscription = this.deliverySubscribeSingle(symbol.toLowerCase() + '@aggTrade', cleanCallback, { reconnect });
        }
        return (subscription as any).url;
    }

    /**
     * Delivery WebSocket mark price
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @param {string} speed - 1 second updates. leave blank for default 3 seconds
     * @return {string} the websocket endpoint
     */
    deliveryMarkPriceStream(symbol?: string, callback = console.log, speed = '@1s') {
        const reconnect = () => {
            if (this.Options.reconnect) this.deliveryMarkPriceStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@markPrice` : '!markPrice@arr';
        const subscription = this.deliverySubscribeSingle(endpoint + speed, data => callback(this.dMarkPriceConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Delivery WebSocket liquidations stream
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryLiquidationStream(symbol?: string, callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.deliveryLiquidationStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@forceOrder` : '!forceOrder@arr';
        const subscription = this.deliverySubscribeSingle(endpoint, data => callback(this.dLiquidationConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Delivery WebSocket prevDay ticker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryTickerStream(symbol?: string, callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.deliveryTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@ticker` : '!ticker@arr';
        const subscription = this.deliverySubscribeSingle(endpoint, data => callback(this.dTickerConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Delivery WebSocket miniTicker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryMiniTickerStream(symbol?: string, callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.deliveryMiniTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@miniTicker` : '!miniTicker@arr';
        const subscription = this.deliverySubscribeSingle(endpoint, data => callback(this.dMiniTickerConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Delivery WebSocket bookTicker
     * @param {symbol} symbol name or false. can also be a callback
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryBookTickerStream(symbol?: string, callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.deliveryBookTickerStream(symbol, callback);
        };
        const endpoint = symbol ? `${symbol.toLowerCase()}@bookTicker` : '!bookTicker';
        const subscription = this.deliverySubscribeSingle(endpoint, data => callback(this.dBookTickerConvertData(data)), { reconnect });
        return (subscription as any).url;
    }

    /**
     * Websocket delivery klines
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @param {int} limit - maximum results, no more than 1000
     * @return {string} the websocket endpoint
     */
    deliveryChart(symbols: string[] | string, interval: Interval, callback: Callback, limit = 500) {
        const reconnect = () => {
            if (this.Options.reconnect) this.deliveryChart(symbols, interval, callback, limit);
        };

        const deliveryChartInit = symbol => {
            if (typeof this.deliveryMeta[symbol] === 'undefined') this.deliveryMeta[symbol] = {};
            if (typeof this.deliveryMeta[symbol][interval] === 'undefined') this.deliveryMeta[symbol][interval] = {};
            if (typeof this.deliveryTicks[symbol] === 'undefined') this.deliveryTicks[symbol] = {};
            if (typeof this.deliveryTicks[symbol][interval] === 'undefined') this.deliveryTicks[symbol][interval] = {};
            if (typeof this.deliveryRealtime[symbol] === 'undefined') this.deliveryRealtime[symbol] = {};
            if (typeof this.deliveryRealtime[symbol][interval] === 'undefined') this.deliveryRealtime[symbol][interval] = {};
            if (typeof this.deliveryKlineQueue[symbol] === 'undefined') this.deliveryKlineQueue[symbol] = {};
            if (typeof this.deliveryKlineQueue[symbol][interval] === 'undefined') this.deliveryKlineQueue[symbol][interval] = [];
            this.deliveryMeta[symbol][interval].timestamp = 0;
        };

        const handleDeliveryKlineStream = kline => {
            const symbol = kline.s, interval: Interval = kline.k.i;
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

        const getDeliveryKlineSnapshot = async (symbol: string, limit = 500) => {
            const data = await this.publicDeliveryRequest('v1/klines', { symbol, interval, limit });
            this.deliveryKlineData(symbol, interval, data);
            //this.options.log('/delivery klines at ' + this.deliveryMeta[symbol][interval].timestamp);
            if (typeof this.deliveryKlineQueue[symbol][interval] !== 'undefined') {
                for (const kline of this.deliveryKlineQueue[symbol][interval]) this.deliveryKlineHandler(symbol, kline, this.deliveryMeta[symbol][interval].timestamp);
                delete this.deliveryKlineQueue[symbol][interval];
            }
            if (callback) callback(symbol, interval, this.deliveryKlineConcat(symbol, interval));
        };

        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('deliveryChart: "symbols" array cannot contain duplicate elements.');
            symbols.forEach(deliveryChartInit);
            const streams = symbols.map(symbol => `${symbol.toLowerCase()}@kline_${interval}`);
            subscription = this.deliverySubscribe(streams, handleDeliveryKlineStream, reconnect);
            symbols.forEach(element => getDeliveryKlineSnapshot(element, limit));
        } else {
            const symbol = symbols;
            deliveryChartInit(symbol);
            subscription = this.deliverySubscribeSingle(symbol.toLowerCase() + '@kline_' + interval, handleDeliveryKlineStream, reconnect);
            getDeliveryKlineSnapshot(symbol, limit);
        }
        return (subscription as any).url;
    }

    /**
     * Websocket delivery candlesticks
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    deliveryCandlesticks(symbols: string[] | string, interval: Interval, callback: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.deliveryCandlesticks(symbols, interval, callback);
        };
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('deliveryCandlesticks: "symbols" array cannot contain duplicate elements.');
            const streams = symbols.map(symbol => symbol.toLowerCase() + '@kline_' + interval);
            subscription = this.deliverySubscribe(streams, callback, { reconnect });
        } else {
            const symbol = symbols.toLowerCase();
            subscription = this.deliverySubscribeSingle(symbol + '@kline_' + interval, callback, { reconnect });
        }
        return (subscription as any).url;
    }

    /**
     * Userdata websockets function
     * @param {function} all_updates_callback
     * @param {function} execution_callback - optional execution callback
     * @param {function} subscribed_callback - subscription callback
     * @param {function} list_status_callback - status callback
     * @return {undefined}
     */
    userData(all_updates_callback?: Callback, balance_callback?: Callback, execution_callback?: Callback, subscribed_callback?: Callback, list_status_callback?: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.userData(all_updates_callback, balance_callback, execution_callback, subscribed_callback);
        };
        this.apiRequest(this.getSpotUrl() + 'v3/userDataStream', {}, 'POST').then((response: any) => {
            this.Options.listenKey = response.listenKey;
            const keepAlive = this.spotListenKeyKeepAlive;
            const self = this;
            setTimeout(async function userDataKeepAlive() { // keepalive
                try {
                    await self.apiRequest(self.getSpotUrl() + 'v3/userDataStream?listenKey=' + self.Options.listenKey, {}, 'PUT');
                    setTimeout(userDataKeepAlive, keepAlive); // 30 minute keepalive
                } catch (error) {
                    setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                }
            }, keepAlive); // 30 minute keepalive
            this.Options.all_updates_callback = all_updates_callback;
            this.Options.balance_callback = balance_callback;
            this.Options.execution_callback = execution_callback ? execution_callback : balance_callback;//This change is required to listen for Orders
            this.Options.list_status_callback = list_status_callback;
            const subscription = this.subscribe(this.Options.listenKey, this.userDataHandler.bind(this), reconnect) as any;
            if (subscribed_callback) subscribed_callback(subscription.endpoint);
        });
    }

    /**
     * Margin Userdata websockets function
     * @param {function} all_updates_callback
     * @param {function} execution_callback - optional execution callback
     * @param {function} subscribed_callback - subscription callback
     * @param {function} list_status_callback - status callback
     * @return {undefined}
     */
    userMarginData(all_updates_callback?: Callback, balance_callback?: Callback, execution_callback?: Callback, subscribed_callback?: Callback, list_status_callback?: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.userMarginData(balance_callback, execution_callback, subscribed_callback);
        };
        this.apiRequest(this.sapi + 'v1/userDataStream', {}, 'POST').then((response: any) => {
            this.Options.listenMarginKey = response.listenKey;

            const url = this.sapi + 'v1/userDataStream?listenKey=' + this.Options.listenMarginKey;
            const apiRequest = this.apiRequest;
            const keepAlive = this.spotListenKeyKeepAlive;
            setTimeout(async function userDataKeepAlive() { // keepalive
                try {
                    await apiRequest(url, {}, 'PUT');
                    // if (err) setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                    setTimeout(userDataKeepAlive, keepAlive); // 30 minute keepalive
                } catch (error) {
                    setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                }
            }, keepAlive); // 30 minute keepalive
            this.Options.margin_all_updates_callback = all_updates_callback;
            this.Options.margin_balance_callback = balance_callback;
            this.Options.margin_execution_callback = execution_callback;
            this.Options.margin_list_status_callback = list_status_callback;
            const subscription = this.subscribe(this.Options.listenMarginKey, this.userMarginDataHandler.bind(this), reconnect) as any;
            if (subscribed_callback) subscribed_callback(subscription.endpoint);
        });
    }

    /**
     * Future Userdata websockets function
     * @param {function} all_updates_callback
     * @param {function} margin_call_callback
     * @param {function} account_update_callback
     * @param {function} order_update_callback
     * @param {Function} subscribed_callback - subscription callback
     */
    userFutureData(all_updates_callback?: Callback, margin_call_callback?: Callback, account_update_callback?: Callback, order_update_callback?: Callback, subscribed_callback?: Callback, account_config_update_callback?: Callback) {
        // const url = (this.Options.test) ? this.fapiTest : this.fapi;
        const url = this.getFapiUrl();

        const reconnect = () => {
            if (this.Options.reconnect) this.userFutureData(all_updates_callback, margin_call_callback, account_update_callback, order_update_callback, subscribed_callback);
        };

        // const response = await this.apiRequest(url + 'v1/listenKey', {}, 'POST');
        this.apiRequest(url + 'v1/listenKey', {}, 'POST').then((response: any) => {
            this.Options.listenFutureKey = response.listenKey;
            const self = this;
            const keepAlive = this.futuresListenKeyKeepAlive;
            setTimeout(async function userDataKeepAlive() { // keepalive
                try {
                    await self.apiRequest(url + 'v1/listenKey?listenKey=' + self.Options.listenFutureKey, {}, 'PUT');
                    setTimeout(userDataKeepAlive, keepAlive); // 30 minute keepalive
                } catch (error) {
                    setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                }
            }, keepAlive); // 30 minute keepalive
            this.Options.futures_all_updates_callback = all_updates_callback;
            this.Options.future_margin_call_callback = margin_call_callback;
            this.Options.future_account_update_callback = account_update_callback;
            this.Options.future_account_config_update_callback = account_config_update_callback;
            this.Options.future_order_update_callback = order_update_callback;
            const subscription = this.futuresSubscribe(this.Options.listenFutureKey, this.userFutureDataHandler.bind(this), { reconnect });
            if (subscribed_callback) subscribed_callback(subscription.endpoint);

        });
        // const response = await this.apiRequest(url + 'v1/listenKey', {}, 'POST');

    }

    /**
   * Delivery Userdata websockets function
   * @param {function} margin_call_callback
   * @param {function} account_update_callback
   * @param {function} order_update_callback
   * @param {Function} subscribed_callback - subscription callback
   */
    userDeliveryData(
        margin_call_callback: Callback,
        account_update_callback?: Callback,
        order_update_callback?: Callback,
        subscribed_callback?: Callback
    ) {
        const url = this.getDapiUrl();

        const reconnect = async () => {
            if (this.Options.reconnect)
                await this.userDeliveryData(
                    margin_call_callback,
                    account_update_callback,
                    order_update_callback,
                    subscribed_callback
                );
        };

        this.apiRequest(url + "v1/listenKey", {}, "POST").then((response: any) => {
            this.Options.listenDeliveryKey = response.listenKey;
            const getDeliveryKey = () => this.Options.listenDeliveryKey;
            const self = this;
            const keepAlive = this.futuresListenKeyKeepAlive;
            setTimeout(async function userDataKeepAlive() {
                // keepalive
                try {
                    await self.apiRequest(
                        url +
                        "v1/listenKey?listenKey=" +
                        getDeliveryKey(),
                        {},
                        "PUT"
                    );
                    // function (err: any) {
                    //     if (err) setTimeout(userDataKeepAlive, 60000);
                    //     // retry in 1 minute
                    setTimeout(userDataKeepAlive, keepAlive); // 30 minute keepalive
                } catch (error) {
                    setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                }
            }, keepAlive); // 30 minute keepalive
            this.Options.delivery_margin_call_callback = margin_call_callback;
            this.Options.delivery_account_update_callback = account_update_callback;
            this.Options.delivery_order_update_callback = order_update_callback;
            const subscription = this.deliverySubscribe(
                this.Options.listenDeliveryKey,
                this.userDeliveryDataHandler.bind(this),
                { reconnect }
            );
            if (subscribed_callback) subscribed_callback(subscription.endpoint);

        });

        // }
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
    depthStream(symbols: string[] | string, callback: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.depthStream(symbols, callback);
        };
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('depth: "symbols" cannot contain duplicate elements.');
            const streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@depth@100ms';
            });
            subscription = this.subscribeCombined(streams, callback, reconnect);
        } else {
            const symbol = symbols;
            subscription = this.subscribe(symbol.toLowerCase() + '@depth@100ms', callback, reconnect);
        }
        return (subscription as any).url;
    }

    async mapLimit(array, limit, asyncFn) {
        const results = [];
        let i = 0;

        const workers = new Array(limit).fill(0).map(async () => {
            while (i < array.length) {
                const currentIndex = i++;
                const result = await asyncFn(array[currentIndex]);
                results[currentIndex] = result;
            }
        });
        await Promise.all(workers);
        return results;
    }

    /**
     * Websocket depth cache
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {function} callback - callback function
     * @param {int} limit - the number of entries
     * @return {string} the websocket endpoint
     */
    depthCacheStream(symbols: string[] | string, callback: Callback, limit = 500) {
        const reconnect = () => {
            if (this.Options.reconnect) this.depthCacheStream(symbols, callback, limit);
        };

        const symbolDepthInit = symbol => {
            if (typeof this.depthCacheContext[symbol] === 'undefined') this.depthCacheContext[symbol] = {};
            const context = this.depthCacheContext[symbol];
            context.snapshotUpdateId = null;
            context.lastEventUpdateId = null;
            context.messageQueue = [];
            this.depthCache[symbol] = { bids: {}, asks: {}};
        };

        const assignEndpointIdToContext = (symbol, endpointId) => {
            if (this.depthCacheContext[symbol]) {
                const context = this.depthCacheContext[symbol];
                context.endpointId = endpointId;
            }
        };

        const handleDepthStreamData = depth => {
            const symbol = depth.s;
            const context = this.depthCacheContext[symbol];
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

        const getSymbolDepthSnapshot = async (symbol: string) => {
            const json = await this.publicSpotRequest('v3/depth', { symbol: symbol, limit: limit });
            json.symbol = symbol;
            // cb(null, json);
            return json;
        };

        const updateSymbolDepthCache = json => {
            // Get previous store symbol
            const symbol = json.symbol;
            // Initialize depth cache from snapshot
            this.depthCache[symbol] = this.depthData(json);
            // Prepare depth cache context
            const context = this.depthCacheContext[symbol];
            context.snapshotUpdateId = json.lastUpdateId;
            context.messageQueue = context.messageQueue.filter(depth => depth.u > context.snapshotUpdateId);
            // Process any pending depth messages
            for (const depth of context.messageQueue) {
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
            const streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + `@depth@100ms`;
            });
            const mapLimit = this.mapLimit.bind(this);
            subscription = this.subscribeCombined(streams, handleDepthStreamData, reconnect, function () {
                // async.mapLimit(symbols, 50, getSymbolDepthSnapshot, (err, results) => {
                //     if (err) throw err;
                //     results.forEach(updateSymbolDepthCache);
                // });
                mapLimit(symbols, 50, getSymbolDepthSnapshot)
                    .then(results => {
                        results.forEach(updateSymbolDepthCache);
                    })
                    .catch(err => {
                        throw err;
                    });
            });
            symbols.forEach(s => assignEndpointIdToContext(s, subscription.endpoint));
        } else {
            const symbol = symbols;
            symbolDepthInit(symbol);
            const mapLimit = this.mapLimit.bind(this);
            subscription = this.subscribe(symbol.toLowerCase() + `@depth@100ms`, handleDepthStreamData, reconnect, function () {
                // async.mapLimit([symbol], 1, getSymbolDepthSnapshot, (err, results) => {
                //     if (err) throw err;
                //     results.forEach(updateSymbolDepthCache);
                // });
                mapLimit([symbol], 1, getSymbolDepthSnapshot)
                    .then(results => {
                        results.forEach(updateSymbolDepthCache);
                    })
                    .catch(err => {
                        throw err;
                    });

            });
            assignEndpointIdToContext(symbol, subscription.endpoint);
        }
        return (subscription as any).url;
    }

    /**
     * Clear Websocket depth cache
     * @param {String|Array} symbols   - a single symbol, or an array of symbols, to clear the cache of
     * @returns {void}
     */
    clearDepthCache(symbols: string[] | string) {
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
    depthCacheStaggered(symbols: string[] | string, callback: Callback, limit = 100, stagger = 200) {
        if (!Array.isArray(symbols)) symbols = [symbols];
        let chain = null;

        symbols.forEach(symbol => {
            const promise = () => new Promise(resolve => {
                this.depthCacheStream(symbol, callback, limit);
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
    aggTradesStream(symbols: string[] | string, callback: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.aggTradesStream(symbols, callback);
        };
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('trades: "symbols" cannot contain duplicate elements.');
            const streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@aggTrade';
            });
            subscription = this.subscribeCombined(streams, callback, reconnect);
        } else {
            const symbol = symbols;
            subscription = this.subscribe(symbol.toLowerCase() + '@aggTrade', callback, reconnect);
        }
        return (subscription as any).url;
    }

    /**
    * Websocket raw trades
    * @param {array/string} symbols - an array or string of symbols to query
    * @param {function} callback - callback function
    * @return {string} the websocket endpoint
    */
    tradesStream(symbols: string[] | string, callback: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.tradesStream(symbols, callback);
        };

        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('trades: "symbols" cannot contain duplicate elements.');
            const streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@trade';
            });
            subscription = this.subscribeCombined(streams, callback, reconnect);
        } else {
            const symbol = symbols as string;
            subscription = this.subscribe(symbol.toLowerCase() + '@trade', callback, reconnect);
        }
        return (subscription as any).url;
    }

    /**
     * Websocket klines
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @param {int} limit - maximum results, no more than 1000
     * @return {string} the websocket endpoint
     */
    chart(symbols: string[] | string, interval: Interval, callback: Callback, limit = 500) {
        const reconnect = () => {
            if (this.Options.reconnect) this.chart(symbols, interval, callback, limit);
        };

        const symbolChartInit = symbol => {
            if (typeof this.info[symbol] === 'undefined') this.info[symbol] = {};
            if (typeof this.info[symbol][interval] === 'undefined') this.info[symbol][interval] = {};
            if (typeof this.ohlc[symbol] === 'undefined') this.ohlc[symbol] = {};
            if (typeof this.ohlc[symbol][interval] === 'undefined') this.ohlc[symbol][interval] = {};
            if (typeof this.ohlcLatest[symbol] === 'undefined') this.ohlcLatest[symbol] = {};
            if (typeof this.ohlcLatest[symbol][interval] === 'undefined') this.ohlcLatest[symbol][interval] = {};
            if (typeof this.klineQueue[symbol] === 'undefined') this.klineQueue[symbol] = {};
            if (typeof this.klineQueue[symbol][interval] === 'undefined') this.klineQueue[symbol][interval] = [];
            this.info[symbol][interval].timestamp = 0;
        };

        const handleKlineStreamData = kline => {
            const symbol = kline.s, interval: Interval = kline.k.i;
            if (!this.info[symbol][interval].timestamp) {
                if (typeof (this.klineQueue[symbol][interval]) !== 'undefined' && kline !== null) {
                    this.klineQueue[symbol][interval].push(kline);
                }
            } else {
                //this.options.log('@klines at ' + kline.k.t);
                this.klineHandler(symbol, kline);
                if (callback) callback(symbol, interval, this.klineConcat(symbol, interval));
            }
        };

        const getSymbolKlineSnapshot = async (symbol: string, limit = 500) => {
            const data = await this.publicSpotRequest('v3/klines', { symbol: symbol, interval: interval, limit: limit });
            // function (error, data) {
            //     klineData(symbol, interval, data);
            //     //this.options.log('/klines at ' +this.info[symbol][interval].timestamp);
            //     if (typeof this.klineQueue[symbol][interval] !== 'undefined') {
            //         for (let kline of this.klineQueue[symbol][interval]) klineHandler(symbol, kline, this.info[symbol][interval].timestamp);
            //         delete this.klineQueue[symbol][interval];
            //     }
            //     if (callback) callback(symbol, interval, this.klineConcat(symbol, interval));
            // }
            this.klineData(symbol, interval, data);
            if (typeof this.klineQueue[symbol][interval] !== 'undefined') {
                for (const kline of this.klineQueue[symbol][interval]) this.klineHandler(symbol, kline, this.info[symbol][interval].timestamp);
                delete this.klineQueue[symbol][interval];
            }
            if (callback) callback(symbol, interval, this.klineConcat(symbol, interval));
        };

        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('chart: "symbols" cannot contain duplicate elements.');
            symbols.forEach(symbolChartInit);
            const streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@kline_' + interval;
            });
            subscription = this.subscribeCombined(streams, handleKlineStreamData, reconnect);
            symbols.forEach(element => getSymbolKlineSnapshot(element, limit));
        } else {
            const symbol = symbols;
            symbolChartInit(symbol);
            subscription = this.subscribe(symbol.toLowerCase() + '@kline_' + interval, handleKlineStreamData, reconnect);
            getSymbolKlineSnapshot(symbol, limit);
        }
        return (subscription as any).url;
    }

    /**
     * Websocket candle sticks
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {string} interval - the time interval
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    candlesticksStream(symbols: string[] | string, interval: Interval, callback: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.candlesticksStream(symbols, interval, callback);
        };

        /* If an array of symbols are sent we use a combined stream connection rather.
         This is transparent to the developer, and results in a single socket connection.
         This essentially eliminates "unexpected response" errors when subscribing to a lot of data. */
        let subscription;
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('candlesticks: "symbols" cannot contain duplicate elements.');
            const streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@kline_' + interval;
            });
            subscription = this.subscribeCombined(streams, callback, reconnect);
        } else {
            const symbol = symbols.toLowerCase();
            subscription = this.subscribe(symbol + '@kline_' + interval, callback, reconnect);
        }
        return (subscription as any).url;
    }

    /**
     * Websocket mini ticker
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    miniTicker(callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.miniTicker(callback);
        };
        const subscription = this.subscribe('!miniTicker@arr', function (data: any) {
            const markets = {};
            for (const obj of data) {
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
        return (subscription as any).url;
    }

    /**
     * Spot WebSocket bookTicker (bid/ask quotes including price & amount)
     * @param {string | string[]} symbol symbol or array of symbols
     * @param {function} callback - callback function
     * @return {string} the websocket endpoint
     */
    bookTickersStream(symbol: string | string[], callback = console.log) {
        const reconnect = () => {
            if (this.Options.reconnect) this.bookTickersStream(symbol, callback);
        };
        let subscription: any;
        if (Array.isArray(symbol)) {
            const streams = symbol.map(function (symbol) {
                return symbol.toLowerCase() + '@bookTicker';
            });
            subscription = this.subscribeCombined(streams, data => callback(this.fBookTickerConvertData(data)), reconnect);
        } else {
            const endpoint = `${(symbol as string).toLowerCase()}@bookTicker`;
            subscription = this.subscribe(endpoint, data => callback(this.fBookTickerConvertData(data)), reconnect);
        }
        return (subscription as any).url;
    }

    /**
     * Websocket prevday percentage
     * @param {array/string} symbols - an array or string of symbols to query
     * @param {function} callback - callback function
     * @param {boolean} singleCallback - avoid call one callback for each symbol in data array
     * @return {string} the websocket endpoint
     */
    prevDayStream(symbols: string[] | string | undefined, callback?: Callback, singleCallback?: Callback) {
        const reconnect = () => {
            if (this.Options.reconnect) this.prevDayStream(symbols, callback, singleCallback);
        };

        let subscription;
        const prevDayStreamHandler = this.prevDayStreamHandler.bind(this);
        // Combine stream for array of symbols
        if (Array.isArray(symbols)) {
            if (!this.isArrayUnique(symbols)) throw Error('prevDay: "symbols" cannot contain duplicate elements.');
            const streams = symbols.map(function (symbol) {
                return symbol.toLowerCase() + '@ticker';
            });
            subscription = this.subscribeCombined(streams, function (data: any) {
                prevDayStreamHandler(data, callback);
            }, reconnect);
            // Raw stream for  a single symbol
        } else if (symbols) {
            const symbol = symbols;
            subscription = this.subscribe(symbol.toLowerCase() + '@ticker', function (data: any) {
                prevDayStreamHandler(data, callback);
            }, reconnect);
            // Raw stream of all listed symbols
        } else {
            subscription = this.subscribe('!ticker@arr', function (data: any) {
                if (singleCallback) {
                    prevDayStreamHandler(data, callback);
                } else {
                    for (const line of data) {
                        prevDayStreamHandler(line, callback);
                    }
                }
            }, reconnect);
        }
        return (subscription as any).url;
    }
}
