
// trying to keep them compatible with
// https://github.com/ViewBlock/binance-api-node/blob/master/index.d.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type Interval =
    | '1m'
    | '3m'
    | '5m'
    | '15m'
    | '30m'
    | '1h'
    | '2h'
    | '4h'
    | '6h'
    | '8h'
    | '12h'
    | '1d'
    | '3d'
    | '1w'
    | '1M'

export type OrderType =
    | 'LIMIT'
    | 'MARKET'
    | 'STOP'
    | 'STOP_MARKET'
    | 'TAKE_PROFIT'
    | 'TAKE_PROFIT_MARKET'
    | 'LIMIT_MAKER'
    | 'TRAILING_STOP_MARKET'
    | 'OCO'

export type OrderSide = 'BUY' | 'SELL'

export type OrderStatus =
    | 'CANCELED'
    | 'EXPIRED'
    | 'FILLED'
    | 'NEW'
    | 'PARTIALLY_FILLED'
    | 'PENDING_CANCEL'
    | 'REJECTED'

export type TimeInForce = 'GTC' | 'IOC' | 'FOK' | 'GTE_GTC' | 'GTD'

export interface Response {
    code: number
    msg: string
}

export interface Candle {
    openTime: number
    open: string
    high: string
    low: string
    close: string
    volume: string
    closeTime: number
    quoteVolume?: string
    trades: number
    baseAssetVolume?: string
    quoteAssetVolume: string
  }

export interface OrderFill {
    tradeId: number
    price: string
    qty: string
    commission: string
    commissionAsset: string
}

export interface Order {
    clientOrderId: string
    cummulativeQuoteQty: string
    executedQty: string
    fills?: OrderFill[]
    icebergQty?: string
    isIsolated?: boolean
    isWorking: boolean
    orderId: number
    orderListId: number
    origQty: string
    price: string
    side: OrderSide
    status: OrderStatus
    stopPrice?: string
    symbol: string
    time: number
    timeInForce: TimeInForce
    transactTime?: number
    type: OrderType
    updateTime: number
  }

export interface FuturesOrder {
    clientOrderId: string
    cumQty: string
    cumQuote: string
    executedQty: string
    orderId: number
    avgPrice: string
    origQty: string
    price: string
    reduceOnly: boolean
    side: OrderSide
    positionSide: PositionSide
    status: OrderStatus
    stopPrice: string
    closePosition: boolean
    symbol: string
    timeInForce: TimeInForce
    type: OrderType
    origType: OrderType
    activatePrice: string
    priceRate: string
    updateTime: number
    workingType: WorkingType
    // algo orders fields
    algoId?: number;
    triggerPrice?: string;
    orderStatus?: string;
    clientAlgoId?: string;
    algoStatus?: string;
    actualOrderId?: string;
    actualPrice?: string;
    tpTriggerPrice?: string;
    tpPrice?: string;
    slTriggerPrice?: string;
    slPrice?: string;
    tpOrderType?: string;
    slOrderType?: string;
    algoType?: string;
    orderType?: OrderType;
   quantity?: string;
   icebergQuantity?: string;
   selfTradePreventionMode?: string;
   priceMatch?: string;
   priceProtect?: boolean;
   callbackRate?: string;  //TRAILING_STOP_MARKET order
   createTime?: number;
   triggerTime?: number;
   goodTillDate?: number;
}

export interface FuturesAlgoOrder {
   algoId: number;
   clientOrderId: string;
   clientAlgoId: string;
   algoType: string;
   orderType: OrderType;
   symbol: string;
   side: OrderSide;
   positionSide: PositionSide;
   timeInForce: TimeInForce;
   quantity: string;
   algoStatus: string;
   triggerPrice: string;
   price: string;
   icebergQuantity: string | null;
   selfTradePreventionMode: string;
   workingType: WorkingType;
   priceMatch: string;
   closePosition: boolean;
   priceProtect: boolean;
   reduceOnly: boolean;
   activatePrice: string; //TRAILING_STOP_MARKET order
   callbackRate: string;  //TRAILING_STOP_MARKET order
   createTime: number;
   updateTime: number;
   triggerTime: number;
   goodTillDate: number;
}

export type PositionSide = 'BOTH' | 'SHORT' | 'LONG'

export type WorkingType = 'MARK_PRICE' | 'CONTRACT_PRICE'

// export type symbol = string;
// eslint-disable-next-line
export type Callback = (...args: any) => any;

export interface IConstructorArgs {
    APIKEY: string;
    APISECRET: string;
    PRIVATEKEY: string; // when using RSA/EDCSA keys
    PRIVATEKEYPASSWORD: string; // when using RSA/EDCSA keys
    recvWindow: number;
    useServerTime: boolean;
    reconnect: boolean;
    test: boolean;
    demo: boolean;
    hedgeMode: boolean;
    httpsProxy: string;
    socksProxy: string;
    domain: string;
    headers: Record<string, any>;
    // eslint-disable-next-line
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

export interface IWebsocketsMethods {
  // deprecated, using it for backward compatibility
  /* eslint-disable */
  userData(all_updates_callback?: Callback, balance_callback?: Callback, execution_callback?: Callback, subscribed_callback?: Callback, list_status_callback?: Callback);
  userMarginData(call_updates_callback?: Callback, balance_callback?: Callback, executionCallback?: Callback, subscribedCallback?: Callback, list_statusCallback?: Callback);
  depthCacheStaggered(symbols :string |string[], callback?: Callback, limit?: number, stagger?: number);
  userFutureData(all_updates_callback?: Callback, margin_callCallback?: Callback, account_updateCallback?: Callback, order_updateCallback?: Callback, subscribedCallback?: Callback);
  userDeliveryData(all_updates_callback?: Callback, margin_callCallback?: Callback, account_updateCallback?: Callback, order_updateCallback?: Callback, subscribedCallback?: Callback): any;
  subscribeCombined(url: string, callback: Callback, reconnect?: Callback, opened_callback?: Callback);
  subscribe(endpoint: string, callback: Callback, reconnect?: Callback, opened_callback?: Callback);
  subscriptions(...args: any): any;
  futuresSubcriptions(...args: any): any;
  deliverySubcriptions(...args: any): any;
  terminate(endpoint: string): any;
  futuresTerminate(endpoint: string, reconnect?: boolean)
  deliveryTerminate(endpoint: string, reconnect?: boolean)
  depth(...args: any): any;
  depthCache(symbols: string[] | string, callback?: Callback, limit?: number): any;
  clearDepthCache(symbols: string | string[]): any;
  depthCacheStaggered(symbols: string[] | string, callback: Callback, limit?: number, stagger?: number)
  aggTrades(symbols: string | string[], callback: Callback): any;
  trades(symbols: string | string[], callback: Callback): string;
  chart(symbols: string | string[], interval: Interval, callback?: Callback, limit?: number)
  candlesticks(symbols: string | string[], interval: Interval, callback: Callback)
  miniTicker(callback: Callback): string;
  bookTickers(symbol: string | string[], callback?: Callback): string;
  prevDay(symbols: string | string[] | undefined, callback?: Callback, singleCallback?: Callback)
  futuresCandlesticks(symbols: string[] | string, interval: Interval, callback: Callback)
  futuresTicker(symbol?: string,  callback?: Callback)
  futuresMiniTicker(symbol?: string, callback?: Callback)
  futuresAggTrades(symbols: string[] | string, callback: Callback)
  futuresMarkPrice(symbol?: string, callback?: Callback, speed?: string)
  futuresLiquidation(symbol?: string, callback?: Callback)
  futuresTicker(symbol?: string, callback?: Callback)
  futuresBookTicker(symbol?: string, callback?: Callback)
  futuresChart(symbols: string[] | string, interval: Interval, callback: Callback, limit?: number)
  deliveryAggTrade(symbols: string[] | string, callback: Callback)
  deliveryMarkPrice(symbol?: string, callback?: Callback, speed?: string)
  deliveryLiquidation(symbol?: string, callback?: Callback)
  deliveryTicker(symbol?: string, callback?: Callback)
  deliveryMiniTicker(symbol?: string, callback?: Callback)
  deliveryBookTicker(symbol?: string, callback?: Callback)
  deliveryChart(symbols: string[] | string, interval: Interval, callback: Callback, limit?: number)
  deliveryCandlesticks(symbols: string[] | string, interval: Interval, callback: Callback)
}

export interface FundingRate {
    symbol: string
    fundingRate: string
    fundingTime: number
    time: number
  }

export interface PositionRisk {
    breakEvenPrice: string
    entryPrice: string
    marginType: 'isolated' | 'cross'
    isAutoAddMargin: string
    isolatedMargin: string
    leverage: string
    liquidationPrice: string
    marginAsset: string
    markPrice: string
    maxNotionalValue: string
    positionAmt: string
    symbol: string
    unRealizedProfit: string
    positionSide: PositionSide
    notional: string
    isolatedWallet: string
    updateTime: number
}

export interface CancelOrder{
    symbol: string
    origClientOrderId: string
    orderId: number
    orderListId: number
    clientOrderId: string
    price: string
    origQty: string
    executedQty: string
    cummulativeQuoteQty: string
    status: string
    timeInForce: string
    type: OrderType
    side: OrderSide
}

export interface AggregatedTrade {
    aggId: number
    symbol: string
    price: string
    quantity: string
    firstId: number
    lastId: number
    timestamp: number
    isBuyerMaker: boolean
    wasBestPrice?: boolean
}

export interface Trade {
    id: number
    price: string
    qty: string
    quoteQty: string
    time: number
    isBuyerMaker: boolean
    isBestMatch: boolean
  }

export interface MyTrade {
    id: number
    symbol: string
    orderId: number
    orderListId: number
    price: string
    qty: string
    quoteQty: string
    commission: string
    commissionAsset: string
    time: number
    isBuyer: boolean
    isMaker: boolean
    isBestMatch: boolean
}

export type WithdrawStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface WithdrawHistoryResponse {
    [index: number]: {
      id: string
      amount: string
      transactionFee: string
      address: string
      coin: string
      txId: string
      applyTime: number
      status: WithdrawStatus
      network: string
      transferType?: number
      withdrawOrderId?: string
    }
}

export interface DepositHistoryResponse {
    [index: number]: {
      insertTime: number
      amount: string
      coin: string
      network: string
      address: string
      txId: string
      status: DepositStatus
      addressTag?: string
      transferType?: number
      confirmTimes?: string
    }
}

export interface CancelOrder {
    symbol: string
    origClientOrderId: string
    orderId: number
    orderListId: number
    clientOrderId: string
    price: string
    origQty: string
    executedQty: string
    cummulativeQuoteQty: string
    status: string
    timeInForce: string
    type: OrderType
    side: OrderSide
}

export interface CancelAlgoOrder {
  algoId: number;
  clientAlgoId: string;
}

export interface FuturesUserTrade {
    buyer: boolean
    commission: string
    commissionAsset: string
    id: number
    maker: boolean
    orderId: number
    price: string
    qty: string
    quoteQty: string
    realizedPnl: string
    side: OrderSide
    positionSide: PositionSide
    symbol: string
    time: number
  }

export interface DepositAddress {
    address: string
    tag: string
    coin: string
    url: string
  }

export interface WithdrawResponse {
    id: string
  }

export type DepositStatus = 0 | 1

export interface FuturesCancelAllOpenOrder {
    code: number
    msg: string
}

export interface OrderBook {
    symbol: string
    lastUpdateId: number
    asks: Bid[]
    bids: Bid[]
}

export interface Bid {
    price: string
    quantity: string
}

export interface BookTicker {
    symbol: string
    bidPrice: string
    bidQty: string
    askPrice: string
    askQty: string
}

export interface DailyStats {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number // First tradeId
  lastId: number // Last tradeId
  count: number // Trade count
}

export interface Ticker {
    eventType: string
    eventTime: number
    symbol: string
    priceChange: string
    priceChangePercent: string
    weightedAvg: string
    prevDayClose: string
    curDayClose: string
    closeTradeQuantity: string
    bestBid: string
    bestBidQnt: string
    bestAsk: string
    bestAskQnt: string
    open: string
    high: string
    low: string
    volume: string
    volumeQuote: string
    openTime: number
    closeTime: number
    firstTradeId: number
    lastTradeId: number
    totalTrades: number
  }

// export {
//     Interval as interval,
//    string as symbol,
//     Callback as callback,
//     IConstructorArgs
// }

export type TradingType = 'MARGIN' | 'SPOT'

export interface Account {
    accountType: TradingType
    balances: AssetBalance[]
    buyerCommission: number
    canDeposit: boolean
    canTrade: boolean
    canWithdraw: boolean
    makerCommission: number
    permissions: TradingType[]
    sellerCommission: number
    takerCommission: number
    updateTime: number
}

export interface AssetBalance {
    asset: string
    free: string
    locked: string
}

export interface FuturesAccountInfo {
    feeTier: number
    canTrade: boolean
    canDeposit: boolean
    canWithdraw: boolean
    updateTime: number
    totalInitialMargin: string
    totalMaintMargin: string
    totalWalletBalance: string
    totalUnrealizedProfit: string
    totalMarginBalance: string
    totalPositionInitialMargin: string
    totalOpenOrderInitialMargin: string
    totalCrossWalletBalance: string
    totalCrossUnPnl: string
    availableBalance: string
    maxWithdrawAmount: string
    assets: FuturesAsset[]
    positions: FuturesAccountPosition[]
  }

export interface FuturesAccountPosition {
    symbol: string
    initialMargin: string
    maintMargin: string
    unrealizedProfit: string
    positionInitialMargin: string
    openOrderInitialMargin: string
    leverage: string
    isolated: boolean
    entryPrice: string
    maxNotional: string
    positionSide: PositionSide
    positionAmt: string
    notional: string
    isolatedWallet: string
    updateTime: number
    bidNotional: string
    askNotional: string
  }

export type FuturesAssetType =
  | 'DOT'
  | 'BTC'
  | 'SOL'
  | 'BNB'
  | 'ETH'
  | 'ADA'
  | 'USDT'
  | 'XRP'
  | 'BUSD'

export type FuturesAsset = {
  asset: FuturesAssetType
  walletBalance: string
  unrealizedProfit: string
  marginBalance: string
  maintMargin: string
  initialMargin: string
  positionInitialMargin: string
  openOrderInitialMargin: string
  maxWithdrawAmount: string
  crossWalletBalance: string
  crossUnPnl: string
  availableBalance: string
  marginAvailable: boolean
  updateTime: number
}

export interface FuturesBalance {
    accountAlias: string
    asset: string
    balance: string
    crossWalletBalance: string
    crossUnPnl: string
    availableBalance: string
    maxWithdrawAmount: string
  }

export interface QueryOrder {
    clientOrderId: string
    cummulativeQuoteQty: string
    executedQty: string
    icebergQty: string
    isWorking: boolean
    orderId: number
    orderListId: number
    origQty: string
    origQuoteOrderQty: string
    price: string
    side: OrderSide
    status: OrderStatus
    stopPrice: string
    symbol: string
    time: number
    timeInForce: TimeInForce
    type: OrderType
    updateTime: number
  }

export interface PremiumIndex {
    symbol: string
    markPrice: string
    indexPrice: string
    lastFundingRate: string
    nextFundingTime: number
    estimatedSettlePrice: string
    time: number
}

export interface OpenInterest {
  openInterest: string
  symbol: string
  time: number
}


export interface SymbolConfig  {
  symbol: string
  marginType: string
  isAutoAddMargin: boolean
  leverage: number
  maxNotionalValue: string
}

/**
 * The response structure for an OCO order, based on Binance API documentation.
 * See: https://binance-docs.github.io/apidocs/spot/en/#new-oco-trade
 */
export interface OCOOrder {
        orderListId: number;
        contingencyType: string;
        listStatusType: string;
        listOrderStatus: string;
        listClientOrderId: string;
        transactionTime: number;
        symbol: string;
        orders: Array<{
            symbol: string;
            orderId: number;
            clientOrderId: string;
        }>;
        orderReports: Array<{
            symbol: string;
            orderId: number;
            orderListId: number;
            clientOrderId: string;
            transactTime: number;
            price: string;
            origQty: string;
            executedQty: string;
            cummulativeQuoteQty: string;
            status: string;
            timeInForce: string;
            type: string;
            side: string;
            stopPrice?: string;
            icebergQty?: string;
            workingTime?: number;
            selfTradePreventionMode?: string;
        }>;
    }