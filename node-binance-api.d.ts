/**
 * @author tripolskypetr
 * @see https://github.com/tripolskypetr
 */
declare module "node-binance-api" {

    type _callback = (...args: any) => any;

    type _symbol = string;

    type _interval = keyof {
        '1m': never;
        '3m': never;
        '5m': never;
        '15m': never;
        '30m': never;
        '1h': never;
        '2h': never;
        '4h': never;
        '6h': never;
        '8h': never;
        '12h': never;
        '1d': never;
        '3d': never;
        '1w': never;
        '1M': never;
    };

    interface IWebsockets {
        /**
         * Userdata websockets function
         * @param {function} callback - the callback function
         * @param {function} execution_callback - optional execution callback
         * @param {function} subscribed_callback - subscription callback
         * @param {function} list_status_callback - status callback
         * @return {undefined}
         */
        userData(callback: _callback, execution_callback: _callback, subscribed_callback: _callback, list_status_callback: _callback): any;
        userData(...args: any): any;

        /**
         * Margin Userdata websockets function
         * @param {function} callback - the callback function
         * @param {function} execution_callback - optional execution callback
         * @param {function} subscribed_callback - subscription callback
         * @param {function} list_status_callback - status callback
         * @return {undefined}
         */
        userMarginData(callback: _callback, execution_callback: _callback, subscribed_callback: _callback, list_status_callback: _callback): any;
        userMarginData(...args: any): any;

        /**
         * Future Userdata websockets function
         * @param {function} margin_call_callback
         * @param {function} account_update_callback
         * @param {function} order_update_callback
         * @param {Function} subscribed_callback - subscription callback
         */
        userFutureData(margin_call_callback: _callback, account_update_callback: _callback, order_update_callback: _callback, subscribed_callback: _callback): any;
        userFutureData(...args: any): any;

        /**
         * Delivery Userdata websockets function
         * @param {function} margin_call_callback
         * @param {function} account_update_callback
         * @param {function} order_update_callback
         * @param {Function} subscribed_callback - subscription callback
         */
        userDeliveryData(margin_call_callback: _callback, account_update_callback: _callback, order_update_callback: _callback, subscribed_callback: _callback): any;
        userDeliveryData(...args: any): any;

        /**
         * Subscribe to a generic websocket
         * @param {string} url - the websocket endpoint
         * @param {function} callback - optional execution callback
         * @param {boolean} reconnect - subscription callback
         * @return {WebSocket} the websocket reference
         */
        subscribe(url: string, callback: _callback, reconnect?: boolean): any;
        subscribe(...args: any): any;

        /**
         * Subscribe to a generic combined websocket
         * @param {string} url - the websocket endpoint
         * @param {function} callback - optional execution callback
         * @param {boolean} reconnect - subscription callback
         * @return {WebSocket} the websocket reference
         */
        subscribeCombined(url: string, callback: _callback, reconnect?: boolean): any;
        subscribeCombined(...args: any): any;

        /**
         * Returns the known websockets subscriptions
         * @return {array} array of web socket subscriptions
         */
        subscriptions(...args: any): any[];
        subscriptions(...args: any): any;

        /**
         * Terminates a web socket
         * @param {string} endpoint - the string associated with the endpoint
         * @return {undefined}
         */
        terminate(endpoint: string): any;
        terminate(...args: any): any;

        depth(...args: any): any;
        depth(...args: any): any;

        /**
         * Websocket depth chart
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        depthCache(symbols: _symbol[] | _symbol, ): any;
        depthCache(...args: any): any;

        /**
         * Clear Websocket depth cache
         * @param {String|Array} symbols   - a single symbol, or an array of symbols, to clear the cache of
         * @returns {void}
         */
        clearDepthCache(symbols: _symbol | _symbol[]): any;
        clearDepthCache(...args: any): any;

        /**
         * Websocket staggered depth cache
         * @param {array/string} symbols - an array of symbols to query
         * @param {function} callback - callback function
         * @param {int} limit - the number of entries
         * @param {int} stagger - ms between each depth cache
         * @return {Promise} the websocket endpoint
         */
        depthCacheStaggered(symbols: _symbol | _symbol[], callback: _callback, limit?: number, stagger?: number): Promise<any>;
        depthCacheStaggered(...args: any): any;

        /**
         * Websocket aggregated trades
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        aggTrades(symbols: _symbol | _symbol[], callback: _callback): any;
        aggTrades(...args: any): any;

        /**
        * Websocket raw trades
        * @param {array/string} symbols - an array or string of symbols to query
        * @param {function} callback - callback function
        * @return {string} the websocket endpoint
        */
        trades(symbols: _symbol | _symbol[], callback: _callback): string;
        trades(...args: any): any;

        /**
         * Websocket klines
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @param {int} limit - maximum results, no more than 1000
         * @return {string} the websocket endpoint
         */
        chart(symbols: _symbol | _symbol[], interval: _interval, callback: _callback, limit?: number): string;
        chart(...args: any): any;

        /**
         * Websocket candle sticks
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        candlesticks(symbols: _symbol | _symbol[], interval: _interval, callback: _callback): string;
        candlesticks(...args: any): any;

        /**
         * Websocket mini ticker
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        miniTicker(callback: _callback): string;
        miniTicker(...args: any): any;

        /**
         * Spot WebSocket bookTicker (bid/ask quotes including price & amount)
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        bookTickers(symbol: _symbol, callback: _callback): string;
        bookTickers(...args: any): any;

        /**
         * Websocket prevday percentage
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {function} callback - callback function
         * @param {boolean} singleCallback - avoid call one callback for each symbol in data array
         * @return {string} the websocket endpoint
         */
        prevDay(symbols: _symbol | _symbol[], callback: _callback, singleCallback: boolean): string;
        prevDay(...args: any): any;
    }

    interface IConstructorArgs {
        recvWindow: number;
        useServerTime: boolean;
        reconnect: boolean;
        test: boolean;
        hedgeMode: boolean;
        log: (...args: any[]) => void;
        verbose: boolean;
        keepAlive: boolean;
        localAddress: boolean;
        family: boolean;
        urls: Partial<{
            base: string;
            wapi: string;
            sapi: string;
            fapi: string;
            fapiTest: string;
            stream: string;
            combineStream: string;
            fstream: string;
            fstreamSingle: string;
            fstreamTest: string;
            fstreamSingleTest: string;
            dstream: string;
            dstreamSingle: string;
            dstreamTest: string;
            dstreamSingleTest: string;
        }>;
        timeOffset: number;
    }

    class Binance {

        constructor(options?: Partial<IConstructorArgs>);
        constructor(pathToFile?: string);
        constructor(...args: any);

        /**
        * Gets depth cache for given symbol
        * @param {symbol} symbol - get depch cache for this symbol
        * @return {object} - object
        */
        depthCache(symbols: _symbol | _symbol[], callback: _callback, limit: number): string;
        depthCache(...args: any): any;

        /**
        * Gets depth volume for given symbol
        * @param {symbol} symbol - get depch volume for this symbol
        * @return {object} - object
        */
        depthVolume(symbol: _symbol): any;
        depthVolume(...args: any): any;

        /**
        * Count decimal places
        * @param {float} float - get the price precision point
        * @return {int} - number of place
        */
        getPrecision(float: number): number;
        getPrecision(...args: any): any;

        /**
        * rounds number with given step
        * @param {float} qty - quantity to round
        * @param {float} stepSize - stepSize as specified by exchangeInfo
        * @return {float} - number
        */
        roundStep(qty: number, stepSize: number): number;
        roundStep(...args: any): any;

        /**
        * rounds price to required precision
        * @param {float} price - price to round
        * @param {float} tickSize - tickSize as specified by exchangeInfo
        * @return {float} - number
        */
        roundTicks(price: number, tickSize: number): any;
        roundTicks(...args: any): any;

        /**
        * Gets percentage of given numbers
        * @param {float} min - the smaller number
        * @param {float} max - the bigger number
        * @param {int} width - percentage width
        * @return {float} - percentage
        */
        percent(min: number, max: number, width?: number): any;
        percent(...args: any): any;

        /**
        * Gets the sum of an array of numbers
        * @param {array} array - the number to add
        * @return {float} - sum
        */
        sum(array: number[]): number;
        sum(...args: any): any;

        /**
        * Reverses the keys of an object
        * @param {object} object - the object
        * @return {object} - the object
        */
        reverse(object: any): any;
        reverse(...args: any): any;

        /**
        * Converts an object to an array
        * @param {object} obj - the object
        * @return {array} - the array
        */
        array(obj: any): any[];
        array(...args: any): any;

        /**
        * Sorts bids
        * @param {string} symbol - the object
        * @param {int} max - the max number of bids
        * @param {string} baseValue - the object
        * @return {object} - the object
        */
        sortBids(symbol: any, max?: number, baseValue?: string): any;
        sortBids(...args: any): any;

        /**
        * Sorts asks
        * @param {string} symbol - the object
        * @param {int} max - the max number of bids
        * @param {string} baseValue - the object
        * @return {object} - the object
        */
        sortAsks(symbol: any, max?: number, baseValue?: string): any;
        sortAsks(...args: any): any;

        /**
        * Returns the first property of an object
        * @param {object} object - the object to get the first member
        * @return {string} - the object key
        */
        first(object: any): string;
        first(...args: any): any;

        /**
        * Returns the last property of an object
        * @param {object} object - the object to get the first member
        * @return {string} - the object key
        */
        last(object: any): string;
        last(...args: any): any;

        /**
        * Returns an array of properties starting at start
        * @param {object} object - the object to get the properties form
        * @param {int} start - the starting index
        * @return {array} - the array of entires
        */
        slice(object: any, start?: number): any[];
        slice(...args: any): any;

        /**
        * Gets the minimum key form object
        * @param {object} object - the object to get the properties form
        * @return {string} - the minimum key
        */
        min(object: any): string;
        min(...args: any): any;

        /**
        * Gets the maximum key form object
        * @param {object} object - the object to get the properties form
        * @return {string} - the minimum key
        */
        max(object: any): string;
        max(...args: any): any;

        /**
        * Sets an option given a key and value
        * @param {string} key - the key to set
        * @param {object} value - the value of the key
        * @return {undefined}
        */
        setOption(key: string, value: any): any;
        setOption(...args: any): any;

        /**
        * Gets an option given a key
        * @param {string} key - the key to set
        * @return {undefined}
        */
        getOption(key: string): any;
        getOption(...args: any): any;

        /**
        * Returns the entire info object
        * @return {object} - the info object
        */
        getInfo(key: string, value: any): any;
        getInfo(...args: any): any;

        /**
        * Returns the used weight from the last request
        * @return {object} - 1m weight used
        */
        usedWeight(): any;
        usedWeight(...args: any): any;

        /**
        * Returns the status code from the last http response
        * @return {object} - status code
        */
        statusCode(): any;
        statusCode(...args: any): any;

        /**
        * Returns the ping time from the last futures request
        * @return {object} - latency/ping (2ms)
        */
        futuresLatency(): any;
        futuresLatency(...args: any): any;

        /**
        * Returns the complete URL from the last request
        * @return {object} - http address including query string
        */
        lastURL(): any;
        lastURL(...args: any): any;

        /**
        * Returns the order count from the last request
        * @return {object} - orders allowed per 1m
        */
        orderCount(...args: any): any;
        orderCount(...args: any): any;

        /**
        * Returns the entire options object
        * @return {object} - the options object
        */
        getOptions(): any;
        getOptions(...args: any): any;


        options(...args: any): any;

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
        order(side: 'BUY' | 'SELL', symbol: _symbol, quantity: number, price: number, flags?: any, callback?: _callback): Promise<any>;
        order(...args: any): any;

        /**
        * Creates a buy order
        * @param {string} symbol - the symbol to buy
        * @param {numeric} quantity - the quantity required
        * @param {numeric} price - the price to pay for each unit
        * @param {object} flags - additional buy order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        buy(symbol: _symbol, quantity: number, price: number, flags?: any, callback?: _callback): Promise<any>;
        buy(...args: any): any;

        /**
        * Creates a sell order
        * @param {string} symbol - the symbol to sell
        * @param {numeric} quantity - the quantity required
        * @param {numeric} price - the price to sell each unit for
        * @param {object} flags - additional order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        sell(symbol: _symbol, quantity: number, price: number, flags?: any, callback?: _callback): Promise<any>;
        sell(...args: any): any;

        /**
        * Creates a market buy order
        * @param {string} symbol - the symbol to buy
        * @param {numeric} quantity - the quantity required
        * @param {object} flags - additional buy order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        marketBuy(symbol: _symbol, quantity: number, flags?: any, callback?: _callback): Promise<any>;
        marketBuy(...args: any): any;

        /**
        * Creates a market sell order
        * @param {string} symbol - the symbol to sell
        * @param {numeric} quantity - the quantity required
        * @param {object} flags - additional sell order flags
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        marketSell(symbol: _symbol, quantity: number, flags?: any, callback?: _callback): Promise<any>;
        marketSell(...args: any): any;

        /**
        * Cancels an order
        * @param {string} symbol - the symbol to cancel
        * @param {string} orderid - the orderid to cancel
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        cancel(symbol: _symbol, orderid: string, callback?: _callback): Promise<any>;
        cancel(...args: any): any;

        /**
        * Gets the status of an order
        * @param {string} symbol - the symbol to check
        * @param {string} orderid - the orderid to check
        * @param {function} callback - the callback function
        * @param {object} flags - any additional flags
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        orderStatus(symbol: _symbol, orderid: string, callback?: _callback, flags?: any): Promise<any>;
        orderStatus(...args: any): any;

        /**
        * Gets open orders
        * @param {string} symbol - the symbol to get
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        openOrders(symbol: _symbol, callback?: _callback): Promise<any>;
        openOrders(...args: any): any;

        /**
        * Cancels all orders of a given symbol
        * @param {string} symbol - the symbol to cancel all orders for
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        cancelAll(symbol: _symbol, callback?: _callback): Promise<any>;
        cancelAll(...args: any): any;

        /**
        * Cancels all orders of a given symbol
        * @param {string} symbol - the symbol to cancel all orders for
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        cancelOrders(symbol: _symbol, callback?: _callback): Promise<any>;
        cancelOrders(...args: any): any;

        /**
        * Gets all order of a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function (can also accept options)
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        allOrders(symbol: _symbol, callback?: _callback, options?: any): Promise<any>;
        allOrders(...args: any): any;

        /**
        * Gets the depth information for a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {int} limit - limit the number of returned orders
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        depth(symbol: _symbol, callback?: _callback, limit?: number): Promise<any>;
        depth(...args: any): any;

        /**
        * Gets the average prices of a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        avgPrice(symbol: _symbol, callback?: _callback): Promise<any>;
        avgPrice(...args: any): any;

        /**
        * Gets the prices of a given symbol(s)
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        prices(symbol?: _symbol, callback?: _callback): Promise<any>;
        prices(...args: any): any;

        /**
        * Gets the book tickers of given symbol(s)
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        bookTickers(symbol: _symbol, callback?: _callback): Promise<any>;
        bookTickers(...args: any): any;

        /**
        * Gets the prevday percentage change
        * @param {string} symbol - the symbol or symbols
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        prevDay(symbol: _symbol, callback?: _callback): Promise<any>;
        prevDay(...args: any): any;

        /**
        * Gets the the exchange info
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        exchangeInfo(callback?: _callback): Promise<any>;
        exchangeInfo(...args: any): any;

        /**
        * Gets the dust log for user
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        dustLog(callback?: _callback): Promise<any>;
        dustLog(...args: any): any;

        dustTransfer(...args: any): any;
        assetDividendRecord(...args: any): any;

        /**
        * Gets the the system status
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        systemStatus(callback?: _callback): Promise<any>;
        systemStatus(...args: any): any;

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
        withdraw(asset: string, address: string, amount: number, addressTag?: string, callback?: _callback, name?: string): Promise<any>;
        withdraw(...args: any): any;

        /**
        * Get the Withdraws history for a given asset
        * @param {function} callback - the callback function
        * @param {object} params - supports limit and fromId parameters
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        withdrawHistory(callback?: _callback, params?: any): any;
        withdrawHistory(...args: any): any;

        /**
        * Get the deposit history
        * @param {function} callback - the callback function
        * @param {object} params - additional params
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        depositHistory(callback?: _callback, params?: any): Promise<any>;
        depositHistory(...args: any): any;

        /**
        * Get the deposit history for given asset
        * @see https://developers.binance.com/docs/wallet/capital/deposite-address
        * @param {string} code - the asset
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        depositAddress(code: string, callback?: _callback): Promise<any>;
        depositAddress(...args: any): any;

        /**
        * Get the account status
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        accountStatus(callback?: _callback): Promise<any>;
        accountStatus(...args: any): any;

        /**
        * Get the trade fee
        * @param {function} callback - the callback function
        * @param {string} symbol (optional)
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        tradeFee(...args: any): any;
        tradeFee(...args: any): any;

        /**
        * Fetch asset detail (minWithdrawAmount, depositStatus, withdrawFee, withdrawStatus, depositTip)
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        assetDetail(callback?: _callback): Promise<any>;
        assetDetail(...args: any): any;

        /**
        * Get the account
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        account(callback?: _callback): Promise<any>;
        account(...args: any): any;

        /**
        * Get the balance data
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        balance(callback?: _callback): Promise<any>;
        balance(...args: any): any;

        /**
        * Get trades for a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        trades(symbol: _symbol, callback: _callback, options?: any): Promise<any>;
        trades(...args: any): any;

        /**
        * Tell api to use the server time to offset time indexes
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        useServerTime(callback?: _callback): Promise<any>;
        useServerTime(...args: any): any;

        /**
        * Get Binance server time
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        time(callback?: _callback): Promise<any>;
        time(...args: any): any;

        /**
        * Get agg trades for given symbol
        * @param {string} symbol - the symbol
        * @param {object} options - additional optoins
        * @param {function} callback - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        aggTrades(symbol: _symbol, options?: any, callback?: _callback): Promise<any>;
        aggTrades(...args: any): any;

        /**
        * Get the recent trades
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {int} limit - limit the number of items returned
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        recentTrades(symbol: _symbol, callback?: _callback, limit?: number): Promise<any>;
        recentTrades(...args: any): any;

        /**
        * Get the historical trade info
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {int} limit - limit the number of items returned
        * @param {int} fromId - from this id
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        historicalTrades(symbol: _symbol, callback?: _callback, limit?: number, fromId?: boolean): Promise<any>;
        historicalTrades(...args: any): any;

        /**
        * Convert chart data to highstock array [timestamp,open,high,low,close]
        * @param {object} chart - the chart
        * @param {boolean} include_volume - to include the volume or not
        * @return {array} - an array
        */
        highstock(chart: any, include_volume?: boolean): any[];
        highstock(...args: any): any;

        /**
        * Populates OHLC information
        * @param {object} chart - the chart
        * @return {object} - object with candle information
        */
        ohlc(chart: any): any;
        ohlc(...args: any): any;

        /**
        * Gets the candles information for a given symbol
        * intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
        * @param {string} symbol - the symbol
        * @param {function} interval - the callback function
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        candlesticks(symbol: _symbol, interval: _interval, callback?: _callback, options?: any): Promise<any>;
        candlesticks(...args: any): any;

        /**
        * Queries the public api
        * @param {string} url - the public api endpoint
        * @param {object} data - the data to send
        * @param {function} callback - the callback function
        * @param {string} method - the http method
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        publicRequest(url: string, data: any, callback?: _callback, method?: string): Promise<any>;
        publicRequest(...args: any): any;

        /**
         * Queries the futures API by default
         * @param {string} url - the signed api endpoint
         * @param {object} data - the data to send
         * @param {object} flags - type of request, authentication method and endpoint url
         */
        promiseRequest(url: string, data?: any, flags?: any): Promise<any>;
        promiseRequest(...args: any): any;

        /**
        * Queries the signed api
        * @param {string} url - the signed api endpoint
        * @param {object} data - the data to send
        * @param {function} callback - the callback function
        * @param {string} method - the http method
        * @param {boolean} noDataInSignature - Prevents data from being added to signature
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        signedRequest(url: string, data: any, callback?: _callback, method?: string, noDataInSignature?: boolean): Promise<any>;
        signedRequest(...args: any): any;

        /**
        * Gets the market asset of given symbol
        * @param {string} symbol - the public api endpoint
        * @return {string or undefined}
        */
        getMarket(symbol: _symbol): string | undefined;
        getMarket(...args: any): any;

        /**
        * Get the account binance lending information
        * @param {object} params - the callback function
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        lending(params?: any): Promise<any>;
        lending(...args: any): any;

        futuresPing(params?: any): Promise<any>;
        futuresPing(...args: any): any;

        futuresTime(params?: any): Promise<any>;
        futuresTime(...args: any): any;

        futuresExchangeInfo(): Promise<any>;
        futuresExchangeInfo(...args: any): any;

        futuresPrices(params?: any): Promise<any>;
        futuresPrices(...args: any): any;

        futuresDaily(symbol?: _symbol, params?: any): Promise<any>;
        futuresDaily(...args: any): any;

        futuresOpenInterest(symbol: _symbol): Promise<any>;
        futuresOpenInterest(...args: any): any;

        futuresCandles(symbol: _symbol, interval?: _interval, params?: any): Promise<any>;
        futuresCandles(...args: any): any;

        futuresMarkPrice(_symbol?: _symbol): Promise<any>;
        futuresMarkPrice(...args: any): any;

        futuresTrades(symbol:  _symbol, params?: any): Promise<any>;
        futuresTrades(...args: any): any;

        futuresHistoricalTrades(symbol: _symbol, params?: any): Promise<any>;
        futuresHistoricalTrades(...args: any): any;

        futuresAggTrades(symbol: _symbol, params?: any): Promise<any>;
        futuresAggTrades(...args: any): any;

        futuresForceOrders(params?: any): Promise<any>;
        futuresForceOrders(...args: any): any;

        futuresDeleverageQuantile(params?: any): Promise<any>;
        futuresDeleverageQuantile(...args: any): any;

        futuresUserTrades(symbol: _symbol, params?: any): Promise<any>;
        futuresUserTrades(...args: any): any;

        futuresGetDataStream(params?: any): Promise<any>;
        futuresGetDataStream(...args: any): any;

        futuresKeepDataStream(params?: any): Promise<any>;
        futuresKeepDataStream(...args: any): any;

        futuresCloseDataStream(params?: any): Promise<any>;
        futuresCloseDataStream(...args: any): any;

        futuresLiquidationOrders(symbol?: _symbol, params?: any): Promise<any>;
        futuresLiquidationOrders(...args: any): any;

        futuresPositionRisk(params?: any, useV2 = false): Promise<any>;
        futuresPositionRisk(...args: any): any;

        futuresPositionRiskV2(params?: any): Promise<any>;
        futuresPositionRiskV2(...args: any): any;

        futuresFundingRate(symbol: _symbol, params?: any): Promise<any>;
        futuresFundingRate(...args: any): any;

        futuresLeverageBracket(symbol?: _symbol, params?: any): Promise<any>;
        futuresLeverageBracket(...args: any): any;

        futuresTradingStatus(symbol?: _symbol, params?: any): Promise<any>;
        futuresTradingStatus(...args: any): any;

        futuresCommissionRate(symbol?: _symbol, params?: any): Promise<any>;
        futuresCommissionRate(...args: any): any;

        /**
         * @see leverage 1 to 125
         */
        futuresLeverage(symbol: _symbol, leverage: number, params?: any): Promise<any>;
        futuresLeverage(...args: any): any;

        futuresMarginType(symbol: _symbol, marginType: 'ISOLATED' | 'CROSSED', params?: any): Promise<any>;
        futuresMarginType(...args: any): any;

        futuresPositionMargin(symbol: _symbol, amount: number, type?: number, params?: any): Promise<any>;
        futuresPositionMargin(...args: any): any;

        futuresPositionMarginHistory(symbol: _symbol, params?: any): Promise<any>;
        futuresPositionMarginHistory(...args: any): any;

        futuresIncome(params?: any): Promise<any>;
        futuresIncome(...args: any): any;

        futuresBalance(params?: any): Promise<any>;
        futuresBalance(...args: any): any;

        futuresAccount(params?: any): Promise<any>;
        futuresAccount(...args: any): any;

        futuresDepth(symbol: _symbol, params?: any): Promise<any>;
        futuresDepth(...args: any): any;

        futuresQuote(symbol?: _symbol, params?: any): Promise<any>;
        futuresQuote(...args: any): any;

        futuresBuy(symbol: _symbol, quantity: number, price: number, params?: any): Promise<any>;
        futuresBuy(...args: any): any;

        futuresSell(symbol: _symbol, quantity: number, price: number, params?: any): Promise<any>;
        futuresSell(...args: any): any;

        futuresMarketBuy(symbol: _symbol, quantity: number, params?: any): Promise<any>;
        futuresMarketBuy(...args: any): any;

        futuresMarketSell(symbol: _symbol, quantity: number, params?: any): Promise<any>;
        futuresMarketSell(...args: any): any;

        futuresOrder(side: 'BUY' | 'SELL', symbol: _symbol, price?: number, params?: any): Promise<any>;
        futuresOrder(...args: any): any;

        futuresOrderStatus(symbol: _symbol, params?: any): Promise<any>;
        futuresOrderStatus(...args: any): any;

        futuresCancel(symbol: _symbol, params?: any): Promise<any>;
        futuresCancel(...args: any): any;

        futuresCancelAll(symbol: _symbol, params?: any): Promise<any>;
        futuresCancelAll(...args: any): any;

        futuresCountdownCancelAll(symbol: _symbol, countdownTime?: number, params?: any): Promise<any>;
        futuresCountdownCancelAll(...args: any): any;

        futuresOpenOrders(symbol?: _symbol, params?: any): Promise<any>;
        futuresOpenOrders(...args: any): any;

        futuresAllOrders(symbol?: _symbol, params?: any): Promise<any>;
        futuresAllOrders(...args: any): any;

        futuresPositionSideDual(params?: any): Promise<any>;
        futuresPositionSideDual(...args: any): any;

        futuresChangePositionSideDual(dualSidePosition: any, params?: any): Promise<any>;
        futuresChangePositionSideDual(...args: any): any;

        futuresTransferAsset(asset: any, amount: any, type: any): Promise<any>;
        futuresTransferAsset(...args: any): any;

        futuresHistDataId(symbol?: _symbol, params?: any): Promise<any>;
        futuresHistDataId(...args: any): any;

        futuresDownloadLink(downloadId: string): Promise<any>;
        futuresDownloadLink(...args: any): any;

        deliveryPing(params?: any): Promise<any>;
        deliveryPing(...args: any): any;

        deliveryTime(params?: any): Promise<any>;
        deliveryTime(...args: any): any;

        deliveryExchangeInfo(): Promise<any>;
        deliveryExchangeInfo(...args: any): any;

        deliveryPrices(params?: any): Promise<any>;
        deliveryPrices(...args: any): any;

        deliveryDaily(symbol?: _symbol, params?: any): Promise<any>;
        deliveryDaily(...args: any): any;

        deliveryOpenInterest(symbol: _symbol): Promise<any>;
        deliveryOpenInterest(...args: any): any;

        deliveryCandles(symbol: _symbol, interval?: _interval, params?: any): Promise<any>;
        deliveryCandles(...args: any): any;

        deliveryContinuousKlines(pair: any, contractType: 'CURRENT_QUARTER' | string, interval: _interval, params?: any): Promise<any>;
        deliveryContinuousKlines(...args: any): any;

        deliveryIndexKlines(pair: any, interval: _interval, params?: any): Promise<any>;
        deliveryIndexKlines(...args: any): any;

        deliveryMarkPriceKlines(symbol: _symbol, interval?: _interval, params?: any): Promise<any>;
        deliveryMarkPriceKlines(...args: any): any;

        deliveryMarkPrice(symbol?: _symbol): Promise<any>;
        deliveryMarkPrice(...args: any): any;

        deliveryTrades(symbol: _symbol, params?: any): Promise<any>;
        deliveryTrades(...args: any): any;

        deliveryHistoricalTrades(symbol: _symbol, params?: any): Promise<any>;
        deliveryHistoricalTrades(...args: any): any;

        deliveryAggTrades(symbol: _symbol, params?: any): Promise<any>;
        deliveryAggTrades(...args: any): any;

        deliveryUserTrades(symbol: _symbol, params?: any): Promise<any>;
        deliveryUserTrades(...args: any): any;

        deliveryGetDataStream(params?: any): Promise<any>;
        deliveryGetDataStream(...args: any): any;

        deliveryKeepDataStream(params?: any): Promise<any>;
        deliveryKeepDataStream(...args: any): any;

        deliveryCloseDataStream(params?: any): Promise<any>;
        deliveryCloseDataStream(...args: any): any;

        deliveryLiquidationOrders(symbol?: _symbol, params?: any): Promise<any>;
        deliveryLiquidationOrders(...args: any): any;

        deliveryPositionRisk(params?: any): Promise<any>;
        deliveryPositionRisk(...args: any): any;

        deliveryLeverageBracket(symbol?: _symbol, params?: any): Promise<any>;
        deliveryLeverageBracket(...args: any): any;

        deliveryLeverageBracketSymbols(symbol?: _symbol, params?: any): Promise<any>;
        deliveryLeverageBracketSymbols(...args: any): any;

        deliveryLeverage(symbol: _symbol, leverage: any, params?: any): Promise<any>;
        deliveryLeverage(...args: any): any;

        deliveryMarginType(symbol: _symbol, marginType: any, params?: any): Promise<any>;
        deliveryMarginType(...args: any): any;

        deliveryPositionMargin(symbol: _symbol, amount: number, type?: number, params?: any): Promise<any>;
        deliveryPositionMargin(...args: any): any;

        deliveryPositionMarginHistory(symbol: _symbol, params?: any): Promise<any>;
        deliveryPositionMarginHistory(...args: any): any;

        deliveryIncome(params?: any): Promise<any>;
        deliveryIncome(...args: any): any;

        deliveryBalance(params?: any): Promise<any>;
        deliveryBalance(...args: any): any;

        deliveryAccount(params?: any): Promise<any>;
        deliveryAccount(...args: any): any;

        deliveryDepth(symbol: _symbol, params?: any): Promise<any>;
        deliveryDepth(...args: any): any;

        deliveryQuote(symbol?: _symbol, params?: any): Promise<any>;
        deliveryQuote(...args: any): any;

        deliveryBuy(symbol: _symbol, quantity: number, price: number, params?: any): Promise<any>;
        deliveryBuy(...args: any): any;

        deliverySell(symbol: _symbol, quantity: number, price: number, params?: any): Promise<any>;
        deliverySell(...args: any): any;

        deliveryMarketBuy(symbol: _symbol, quantity: number, params?: any): Promise<any>;
        deliveryMarketBuy(...args: any): any;

        deliveryMarketSell(symbol: _symbol, quantity: number, params?: any): Promise<any>;
        deliveryMarketSell(...args: any): any;

        deliveryOrder(side: 'BUY' | 'SELL', symbol: _symbol, quantity: number, price?: number, params?: any): Promise<any>;
        deliveryOrder(...args: any): any;

        deliveryOrderStatus(symbol: _symbol, params?: any): Promise<any>;
        deliveryOrderStatus(...args: any): any;

        deliveryCancel(symbol: _symbol, params?: any): Promise<any>;
        deliveryCancel(...args: any): any;

        deliveryCancelAll(symbol: _symbol, params?: any): Promise<any>;
        deliveryCancelAll(...args: any): any;

        deliveryCountdownCancelAll(symbol: _symbol, countdownTime?: number, params?: any): Promise<any>;
        deliveryCountdownCancelAll(...args: any): any;

        deliveryOpenOrders(symbol?: boolean, params?: any): Promise<any>;
        deliveryOpenOrders(...args: any): any;

        deliveryAllOrders(symbol?: _symbol, params?: any): Promise<any>;
        deliveryAllOrders(...args: any): any;

        deliveryPositionSideDual(params?: any): Promise<any>;
        deliveryPositionSideDual(...args: any): any;

        deliveryChangePositionSideDual(dualSidePosition: any, params?: any): Promise<any>;
        deliveryChangePositionSideDual(...args: any): any;

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
        mgOrder(side: 'BUY' | 'SELL', symbol: _symbol, quantity: number, price: number, flags?: any, callback?: _callback, isIsolated?: string): any;
        mgOrder(...args: any): any;

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
        mgBuy(side: 'BUY' | 'SELL', symbol: _symbol, quantity: number, price: number, flags?: any, callback?: _callback, isIsolated?: string): any;
        mgBuy(...args: any): any;

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
        mgSell(side: 'BUY' | 'SELL', symbol: _symbol, quantity: number, price: number, flags?: any, callback?: _callback, isIsolated?: string): any;
        mgSell(...args: any): any;

        /**
         * Creates a market buy order
         * @param {string} symbol - the symbol to buy
         * @param {numeric} quantity - the quantity required
         * @param {object} flags - additional buy order flags
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolate margin option
         * @return {undefined}
         */
        mgMarketBuy(symbol: _symbol, quantity: number, price: number, flags?: any, callback?: _callback, isIsolated?: string): any;
        mgMarketBuy(...args: any): any;

        /**
         * Creates a market sell order
         * @param {string} symbol - the symbol to sell
         * @param {numeric} quantity - the quantity required
         * @param {object} flags - additional sell order flags
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolate margin option
         * @return {undefined}
         */
        mgMarketSell(symbol: _symbol, quantity: number, price: number, flags?: any, callback?: _callback, isIsolated?: string): any;
        mgMarketSell(...args: any): any;

        /**
         * Cancels an order
         * @param {string} symbol - the symbol to cancel
         * @param {string} orderid - the orderid to cancel
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgCancel(symbol: _symbol, orderid: string, callback?: _callback, isIsolated?: string): any;
        mgCancel(...args: any): any;

        /**
        * Gets all order of a given symbol
        * @param {string} symbol - the symbol
        * @param {function} callback - the callback function
        * @param {object} options - additional options
        * @return {promise or undefined} - omitting the callback returns a promise
        */
        mgAllOrders(symbol: _symbol, callback?: _callback, options?: any): Promise<any>;
        mgAllOrders(...args: any): any;

         /**
         * Gets the status of an order
         * @param {string} symbol - the symbol to check
         * @param {string} orderid - the orderid to check
         * @param {function} callback - the callback function
         * @param {object} flags - any additional flags
         * @return {undefined}
         */
        mgOrderStatus(symbol: _symbol, orderid: string, callback?: _callback, flags?: any): Promise<any>;
        mgOrderStatus(...args: any): any;

        /**
         * Gets open orders
         * @param {string} symbol - the symbol to get
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgOpenOrders(symbol: _symbol, callback: _callback): Promise<any>;
        mgOpenOrders(...args: any): any;

        /**
         * Cancels all order of a given symbol
         * @param {string} symbol - the symbol to cancel all orders for
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        mgCancelOrders(symbol: _symbol, callback?: _callback): Promise<any>;
        mgCancelOrders(...args: any): any;

        /**
         * Transfer from main account to margin account
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @param {object} options - additional options
         * @return {undefined}
         */
        mgTransferMainToMargin(asset: string, amount: number, callback?: _callback): any;
        mgTransferMainToMargin(...args: any): any;

        /**
         * Transfer from main account to margin account
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @param {object} options - additional options
         * @return {undefined}
         */
        mgTransferMarginToMain(asset: string, amount: number, callback?: _callback, options?: any): any;
        mgTransferMarginToMain(...args: any): any;

        /**
         * Transfer from margin account to main account
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        transferMainToFutures(asset: string, amount: number, callback?: _callback): any;
        transferMainToFutures(...args: any): any;

        /**
         * Transfer from main account to delivery account
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function (optionnal)
         * @param {object} options - additional options
         * @return {undefined}
         */
        transferFuturesToMain(asset: string, amount: number, callback?: _callback, options?: any): any;
        transferFuturesToMain(...args: any): any;

        /**
         * Transfer from delivery account to main account
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function (optionnal)
         * @return {undefined}
         */
        transferMainToDelivery(asset: string, amount: number, callback?: _callback): any;
        transferMainToDelivery(...args: any): any;

        /**
         * Transfer from main account to delivery account
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function (optionnal)
         * @param {object} options - additional options
         * @return {undefined}
         */
        transferDeliveryToMain(asset: string, amount: number, callback?: _callback): any;
        transferDeliveryToMain(...args: any): any;

        /**
         * Get maximum transfer-out amount of an asset
         * @param {string} asset - the asset
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        maxTransferable(asset: string, callback?: _callback): any;
        maxTransferable(...args: any): any;

        /**
         * Margin account borrow/loan
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolated option
         * @param {string} symbol - symbol for isolated margin
         * @return {undefined}
         */
        mgBorrow(asset: string, amount: number, callback: _callback, isIsolated?: string, symbol?: _symbol): any;
        mgBorrow(...args: any): any;

        /**
         * Margin account repay
         * @param {string} asset - the asset
         * @param {number} amount - the asset
         * @param {function} callback - the callback function
         * @param {string} isIsolated - the isolated option
         * @param {string} symbol - symbol for isolated margin
         * @return {undefined}
         */
        mgRepay(asset: string, amount: number, callback: _callback, isIsolated?: string, symbol?: _symbol): any;
        mgRepay(...args: any): any;

        /**
         * Margin account details
         * @param {function} callback - the callback function
         * @param {boolean} isIsolated - the callback function
         * @return {undefined}
         */
        mgAccount(callback: _callback, isIsolated?: boolean): any;
        mgAccount(...args: any): any;

        /**
         * Get maximum borrow amount of an asset
         * @param {string} asset - the asset
         * @param {function} callback - the callback function
         * @return {undefined}
         */
        maxBorrowable(asset: string, callback: _callback): any;
        maxBorrowable(...args: any): any;

        /**
         * Subscribe to a single futures websocket
         * @param {string} url - the futures websocket endpoint
         * @param {function} callback - optional execution callback
         * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
         * @return {WebSocket} the websocket reference
         */
        futuresSubscribeSingle(url: string, callback: _callback, params?: any): WebSocket;
        futuresSubscribeSingle(...args: any): any;

        /**
         * Subscribe to a combined futures websocket
         * @param {string} streams - the list of websocket endpoints to connect to
         * @param {function} callback - optional execution callback
         * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
         * @return {WebSocket} the websocket reference
         */
        futuresSubscribe(streams: string, callback: _callback, params?: any ): WebSocket;
        futuresSubscribe(...args: any): any;

        /**
         * Returns the known futures websockets subscriptions
         * @return {array} array of futures websocket subscriptions
         */
        futuresSubscriptions(): any[];
        futuresSubscriptions(...args: any): any;

        /**
         * Terminates a futures websocket
         * @param {string} endpoint - the string associated with the endpoint
         * @return {undefined}
         */
        futuresTerminate(endpoint: string): any;
        futuresTerminate(...args: any): any;

        /**
         * Futures WebSocket aggregated trades
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresAggTradeStream(symbols: _symbol | _symbol[], callback: _callback): string;
        futuresAggTradeStream(...args: any): any;

        /**
         * Futures WebSocket mark price
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @param {string} speed - 1 second updates (@1s). leave blank for default 3 seconds
         * @return {string} the websocket endpoint
         */
        futuresMarkPriceStream(symbol?: _symbol, callback?: _callback, speed?: string): string;
        futuresMarkPriceStream(...args: any): any;

        /**
         * Futures WebSocket liquidations stream
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresLiquidationStream(symbol?: _symbol, callback?: _callback): string;
        futuresLiquidationStream(...args: any): any;

        /**
         * Futures WebSocket prevDay ticker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresTickerStream(symbol?: _symbol, callback?: _callback): string;
        futuresTickerStream(...args: any): any;

        /**
         * Futures WebSocket miniTicker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresMiniTickerStream(symbol?: _symbol, callback?: _callback): string;
        futuresMiniTickerStream(...args: any): any;

        /**
         * Futures WebSocket bookTicker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresBookTickerStream(symbol: _symbol, callback?: _callback): string;
        futuresBookTickerStream(...args: any): any;

        /**
         * Websocket futures klines
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @param {int} limit - maximum results, no more than 1000
         * @return {string} the websocket endpoint
         */
        futuresChart(symbols: _symbol | _symbol[], interval: _interval, callback: _callback, limit?: number): string;
        futuresChart(...args: any): any;

        /**
         * Websocket futures candlesticks
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        futuresCandlesticks(symbols?: _symbol | _symbol[], interval?: _interval, callback?: _callback): string;
        futuresCandlesticks(...args: any): any;

        /**
         * Subscribe to a single delivery websocket
         * @param {string} url - the delivery websocket endpoint
         * @param {function} callback - optional execution callback
         * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
         * @return {WebSocket} the websocket reference
         */
        deliverySubscribeSingle(url: string, callback: _callback, params?: any): any;
        deliverySubscribeSingle(...args: any): any;

        /**
         * Subscribe to a combined delivery websocket
         * @param {string} streams - the list of websocket endpoints to connect to
         * @param {function} callback - optional execution callback
         * @param {object} params - Optional reconnect {boolean} (whether to reconnect on disconnect), openCallback {function}, id {string}
         * @return {WebSocket} the websocket reference
         */
        deliverySubscribe(streams: string, callback: _callback, params?: any): WebSocket;
        deliverySubscribe(...args: any): any;

        /**
         * Returns the known delivery websockets subscriptions
         * @return {array} array of delivery websocket subscriptions
         */
        deliverySubscriptions(): any[];
        deliverySubscriptions(...args: any): any;

        /**
         * Terminates a delivery websocket
         * @param {string} endpoint - the string associated with the endpoint
         * @return {undefined}
         */
        deliveryTerminate(endpoint: string): any;
        deliveryTerminate(...args: any): any;

        /**
         * Delivery WebSocket aggregated trades
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryAggTradeStream(symbols: _symbol | _symbol[], callback: _callback): string;
        deliveryAggTradeStream(...args: any): any;

        /**
         * Delivery WebSocket mark price
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @param {string} speed - 1 second updates (@1s). leave blank for default 3 seconds
         * @return {string} the websocket endpoint
         */
        deliveryMarkPriceStream(symbol?: _symbol, callback?: _callback, speed?: string): string;
        deliveryMarkPriceStream(...args: any): any;

        /**
         * Delivery WebSocket liquidations stream
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryLiquidationStream(symbol?: _symbol, callback?: _callback): string;
        deliveryLiquidationStream(...args: any): any;

        /**
         * Delivery WebSocket prevDay ticker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryTickerStream(symbol?: _symbol, callback?: _callback): string;
        deliveryTickerStream(...args: any): any;

        /**
         * Delivery WebSocket miniTicker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryMiniTickerStream(symbol?: _symbol, callback?: _callback): string;
        deliveryMiniTickerStream(...args: any): any;

        /**
         * Delivery WebSocket bookTicker
         * @param {symbol} symbol name or false. can also be a callback
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryBookTickerStream(symbol?: _symbol, callback?: _callback): string;
        deliveryBookTickerStream(...args: any): any;

        /**
         * Websocket delivery klines
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @param {int} limit - maximum results, no more than 1000
         * @return {string} the websocket endpoint
         */
        deliveryChart(symbols?: _symbol | _symbol[], interval?: _interval, callback?: _callback, limit?: number): string;
        deliveryChart(...args: any): any;

        /**
         * Websocket delivery candlesticks
         * @param {array/string} symbols - an array or string of symbols to query
         * @param {string} interval - the time interval
         * @param {function} callback - callback function
         * @return {string} the websocket endpoint
         */
        deliveryCandlesticks(symbols: _symbol | _symbol[], interval: _interval, callback: _callback ): string;
        deliveryCandlesticks(...args: any): any;

        websockets: IWebsockets;

    }

    export default Binance;

}

