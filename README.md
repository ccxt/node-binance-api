
<!-- [![Binance Community API](https://cdn.discordapp.com/attachments/569865969120575519/718166995354255370/binance-api-black.png)](https://dev.binance.vision/) -->

<!-- ![Last Commit](https://badgen.net/github/last-commit/jaggedsoft/node-binance-api?scale=2&label=🟣%20Updated&labelColor=black&color=448AFF&cache=9999) -->
<!-- [![npm downloads](https://img.shields.io/npm/dt/node-binance-api.svg?maxAge=7200)](https://www.npmjs.com/package/node-binance-api) [![Build Status](https://travis-ci.org/jaggedsoft/node-binance-api.svg?branch=master&style=flat-square)](https://travis-ci.org/jaggedsoft/node-binance-api) [![Coverage Status](https://coveralls.io/repos/github/jaggedsoft/node-binance-api/badge.svg?branch=master&style=flat-square)](https://coveralls.io/github/jaggedsoft/node-binance-api) [![CodeCov](https://codecov.io/gh/jaggedsoft/node-binance-api/branch/master/graph/badge.svg?style=flat-square)](https://codecov.io/github/jaggedsoft/node-binance-api/) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/996757cec66542c0a64fca2b4cf8a936)](https://www.codacy.com/app/jaggedsoft/node-binance-api?utm_source=github.com&utm_medium=referral&utm_content=jaggedsoft/node-binance-api&utm_campaign=Badge_Coverage) [![Codacy Grade](https://api.codacy.com/project/badge/Grade/996757cec66542c0a64fca2b4cf8a936)](https://www.codacy.com/app/jaggedsoft/node-binance-api) https://img.shields.io/npm/dm/node-binance-api.svg?labelColor=blueviolet)
https://badgen.net/npm/dm/node-binance-api?labelColor=7C4DFF&color=green&scale=2&label=Downloads&icon=bitcoin
🟣 Used by 727 https://badgen.net/github/dependents-repo/jaggedsoft/node-binance-api?labelColor=blue&color=purple&label=Used%20by&icon=github
🧪 Releases 87 https://badgen.net/github/releases/jaggedsoft/node-binance-api?scale=2&icon=github&labelColor=purple&color=green&label=%F0%9F%A7%AA%20Release
🎈💡 Merged PRs 79 https://badgen.net/github/merged-prs/jaggedsoft/node-binance-api
⭐ Stars 630 https://badgen.net/github/stars/jaggedsoft/node-binance-api?scale=2&label=%E2%AD%90Stars&labelColor=black&color=purple
✅ship Commits 568 https://badgen.net/github/commits/micromatch/micromatch?label=%E2%9C%A8Commits&labelColor=black&color=red
⚡ Updated about 16 hours ago https://badgen.net/github/last-commit/jaggedsoft/node-binance-api?scale=2&icon=bitcoin-lightning&label=Updated&labelColor=black&color=448AFF
👀👁 Watchers 48 https://badgen.net/github/watchers/jaggedsoft/node-binance-api
color=blueviolet 🔵q
-->
<!-- [![Latest Version](https://img.shields.io/github/release/jaggedsoft/node-binance-api.svg?style=flat-square&labelColor=blueviolet&label=release)](https://github.com/jaggedsoft/node-binance-api/releases) [![GitHub last commit](https://img.shields.io/github/last-commit/jaggedsoft/node-binance-api.svg?maxAge=2400&labelColor=333&label=🟣%20updated)](#) [![Monthly Downloads](https://img.shields.io/npm/dm/node-binance-api.svg?labelColor=29B6F6&color=3D5AFE&label=downloads&logo=bitcoin-lightning)](https://npm-stat.com/charts.html?package=node-binance-api&from=2017-07-01&to=2020-07-01)  -->



# Node Binance API

[![telegram](https://patrolavia.github.io/telegram-badge/chat.png)](https://t.me/nodebinanceapi) [![Yearly Downloads](https://img.shields.io/npm/dy/node-binance-api.svg)](https://www.npmjs.com/package/node-binance-api)  [![CCXT on X](https://img.shields.io/twitter/follow/ccxt_official.svg?style=social)](https://x.com/ccxt_official)

This project is designed to help you make your own projects that interact with the [Binance API](https://github.com/binance-exchange/binance-official-api-docs). You can stream candlestick chart data, market depth, or use other advanced features such as setting stop losses and iceberg orders. This project seeks to have complete API coverage including WebSockets.



<b><p align="center">
  <a href="#binance-futures-api" style="color:#f9c513">Futures API</a> &amp;
  <a href="#futures-websocket-streams" style="color:#f9c513">Streams</a> •
  <a href="#binance-api-spot-trading" style="color:#282828">Spot Trading API</a> &amp;
  <a href="#websockets-implementation" style="color:#282828">Streams</a> •
  <a href="#binance-margin-api">Margin API</a> •
  <a href="#binance-lending-api">Lending API</a><br/>
  <a href="https://github.com/jaggedsoft/node-binance-api/tree/master/examples">Examples</a> •
  <a href="#troubleshooting">Troubleshooting</a> •
  <a href="https://github.com/jaggedsoft/node-binance-api/releases">Changelog</a> •
  <a href="https://t.me/binance_api_english">Support</a>
</p></b>

#### Installation

```
npm install node-binance-api
```
[![NPM](https://nodei.co/npm/node-binance-api.png?compact=false)](https://npmjs.org/package/node-binance-api)
<!-- [![npm install node-binance-api](https://nodei.co/npm/node-binance-api.png?mini=true)](https://npmjs.org/package/node-binance-api) -->

#### Community Telegram Chat

https://t.me/nodebinanceapi


**This project is powered by** <a href="https://github.com/ccxt/ccxt"><img src="https://avatars.githubusercontent.com/u/31901609" width=4% height=4%></a>

Actively maintained, typed, and safe SDK for the Binance REST APIs and Websockets. Supports ESM and CJS out of the box.

### Features
- Spot, Margin, Futures and Delivery API (including the new algoOrder service)
- Demo trading support
- Testnet support (deprecated)
- Proxy support (REST and WS)
- Customizable HTTP headers
- Customizable request parameters
- RSA/ECDSA support
- Portfolio Margin API *\*soon*\*
- Websocket handling with automatic reconnection
- RecvWindow and automatic timestamps generation
- Ability to call any endpoint, even if not supported directly by the library
- Overridable hostnames (.us, .jp, etc)
- Verbose mode to debug http requests/responses

### Upgrading to v1.0.0+

**We highly advise you to update from 0.0.X but minor adjustments might be needed.**

The library was fully refactored to use a modern and typed JavaScript/Typescript version, using the built-in await/async syntax and unifying some methods' signatures.
Some important changes include the removal of callbacks as parameters of REST methods, adaptation of signatures to directly receive some important request values (symbol, orderId, ...), among others.


#### Getting started (ESM)
```javascript
import Binance from 'node-binance-api';
async function run() {
    const exchange = new Binance();
    const res = await exchange.futuresTime();
    console.log( res );
}
```

#### Getting started (CJS)
```javascript
const Binance = require('node-binance-api');
const binance = new Binance({
  APIKEY: '<key>',
  APISECRET: '<secret>',
  test: true, // if you want to use the sandbox/testnet
});
```

# Binance Futures API

#### Futures Prices
```js
console.info( await binance.futuresPrices() );
```

#### Futures Account Balances & Positions
```js
console.info( await binance.futuresAccount() );
```

#### Futures Balances
```js
console.info( await binance.futuresBalance() );
```

#### Futures Limit Buy
```js
console.info( await binance.futuresBuy( 'LIMIT', 'BTCUSDT', 0.1, 8222 ) );
```

#### Futures Limit Sell
```js
console.info( await binance.futuresSell( 'LIMIT', 'BTCUSDT', 0.5, 11111 ) );
```

#### Futures Market Buy
```js
console.info( await binance.futuresMarketBuy( 'BNBUSDT', 5 ) );
```

#### Futures Market Sell
```js
console.info( await binance.futuresMarketSell( 'TRXUSDT', 1 ) );
```

#### Futures Place Multiple Orders
```js
let orders = [
  {
  symbol:"BTCUSDT",
  side: "BUY",
  type: "MARKET",
  quantity: "0.01",
  },
  {
  symbol:"BNBUSDT",
  side: "SELL",
  type: "MARKET",
  quantity: "0.5",
  }
]
console.info( await binance.futuresMultipleOrders(orders) );
```

#### Futures Market Orders: Get the fill price using newOrderRespType
```js
console.info( await binance.futuresMarketBuy( 'BNBUSDT', amount, { newOrderRespType: 'RESULT' } ) );
```

#### Futures reduceOnly Order Example
```js
if ( side == 'LONG' ) order = await binance.futuresMarketSell( obj.symbol, amount, {reduceOnly: true} )
else order = await binance.futuresMarketBuy( obj.symbol, amount, {reduceOnly: true} )
```

#### Get Futures Positions
```js
console.info( await binance.futuresPositionRisk() );
```
<details>
 <summary>View Example</summary>

```js
let position_data = await binance.futuresPositionRisk(), markets = Object.keys( position_data );
for ( let market of markets ) {
  let obj = position_data[market], size = Number( obj.positionAmt );
  if ( size == 0 ) continue;
  console.info( `${leverage}x\t${market}\t${obj.unRealizedProfit}` );
  //console.info( obj ); //positionAmt entryPrice markPrice unRealizedProfit liquidationPrice leverage marginType isolatedMargin isAutoAddMargin maxNotionalValue
}
```
</details>

#### Adjust Leverage (1-125x)
```js
console.info( await binance.futuresLeverage( 'ETHUSDT', 50 ) );
```

#### Adjust Margin Type (ISOLATED, CROSSED)
```js
console.info( await binance.futuresMarginType( 'BTCUSDT', 'ISOLATED' ) );
```

#### Adjust Position Margin
```js
// Type: 1: Add postion margin，2: Reduce postion margin
console.info( await binance.futuresPositionMargin( "TRXUSDT", amount, type ) );
```

```js
console.info( await binance.futuresTime() );
console.info( await binance.futuresExchangeInfo() );
console.info( await binance.futuresCandles( "TRXUSDT", "1m" ) );
console.info( await binance.futuresDepth( "ADAUSDT" ) );
console.info( await binance.futuresQuote() );
console.info( await binance.futuresQuote( "BCHUSDT" ) );
console.info( await binance.futuresDaily() );
console.info( await binance.futuresOpenInterest( "BTCUSDT" ) );
console.info( await binance.futuresMarkPrice() );
console.info( await binance.futuresMarkPrice( "ETHUSDT" ) );
console.info( await binance.futuresTrades( "LTCUSDT" ) );
console.info( await binance.futuresAggTrades( "XTZUSDT" ) );
console.info( await binance.futuresLiquidationOrders() );
console.info( await binance.futuresFundingRate() );
console.info( await binance.futuresHistoricalTrades( "XMRUSDT" ) );
console.info( await binance.futuresLeverageBracket( "LINKUSDT" ) );
console.info( await binance.futuresIncome() );
console.info( await binance.futuresCancelAll( "BTCUSDT" ) );
console.info( await binance.futuresCancel( "BTCUSDT", "1025137386" ) );
console.info( await binance.futuresCountdownCancelAll( "BTCUSDT", 45000 ) );
console.info( await binance.futuresOrderStatus( "BTCUSDT", "1025137386") );
console.info( await binance.futuresOpenOrders() );
console.info( await binance.futuresOpenOrders( "BTCUSDT" ) );
console.info( await binance.futuresAllOrders() );
console.info( await binance.futuresAllOrders( "BTCUSDT" ) );
console.info( await binance.futuresUserTrades( "BTCUSDT" ) );
console.info( await binance.futuresGetDataStream() );
console.info( await binance.futuresPositionMarginHistory( "TRXUSDT" ) );
console.info( await binance.futuresPublicRequest( 'v1/time' ) );
console.info( await binance.spotPublicRequest( 'v1/time')); // call any method by providing the path
console.info( await binance.privateFuturesRequest('v3/account')); // custom futures private call
// Batch orders, remaining WebSocket streams, and better documentation will be come later
```

### Proxy support

In some specific cases using a proxy is required, for example:
- Exchange is not available in your location
- You need to make a large amount of requests without getting blocked
- ...

This package supports the following proxy types, `httpsProxy`, `proxyUrl` and `socksProxy`

#### httpsProxy

To set a real http(s) proxy for your scripts, you need to have an access to a remote http or https proxy, so calls will be made directly to the target exchange, tunneled through your proxy server:

```Js
client.httpsProxy = 'http://1.2.3.4:8080/';
```

#### proxyUrl

This property prepends an url to API requests. It might be useful for simple redirection or bypassing CORS browser restriction.

```Js
client.proxyUrl = 'YOUR_PROXY_URL';
```

#### socksProxy

Tou can also use socks proxy with the following format:

```Js
client.socksProxy = 'socks5://1.2.3.4:8080/';
```

#### Futures Historical Bulk Data Download API

##### Get Download ID

```js
console.info( await binance.futuresHistDataId(
  "BTCUSDT", {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    dataType: 'T_TRADE'
  } )
)
```

##### Get Download Link

```js
console.info( await binance.futuresDownloadLink(7343) )
```

# Futures WebSocket Streams

#### Futures miniTicker stream for all symbols
```js
binance.futuresMiniTickerStream( miniTicker => {
    console.info( miniTicker );
} );
```
#### Futures miniTicker stream for a symbol
```js
binance.futuresMiniTickerStream( 'BTCUSDT', console.log );
```
#### Futures bookTicker stream for all symbols
```js
binance.futuresBookTickerStream( console.log );
```
#### Futures bookTicker stream for a symbol
```js
binance.futuresBookTickerStream( 'BTCUSDT', console.log );
```
#### Futures prevDay ticker stream for all symbols
```js
binance.futuresTickerStream( console.log );
```
#### Futures prevDay ticker stream for a symbol
```js
binance.futuresTickerStream( 'BTCUSDT', console.log );
```
#### Futures mark price stream for all symbols
```js
binance.futuresMarkPriceStream( console.log );
```
#### Futures mark price stream for a symbol
```js
binance.futuresMarkPriceStream( 'BTCUSDT', console.log );
```
#### Futures aggregate trade stream for a symbol
```js
binance.futuresAggTradeStream( 'BTCUSDT', console.log );
```
#### Futures complete chart cache
```js
binance.futuresChart( 'BTCUSDT', '1m', console.log );
```
#### Futures Liquidation Stream for all symbols
```js
binance.futuresLiquidationStream( console.log );
```
#### Futures Liquidation Stream for a symbol
```js
binance.futuresLiquidationStream( 'BTCUSDT', console.log );
```
#### Connect to a custom endpoint. Easier shortcut functions will come later
```js
binance.futuresSubscribe( 'btcusdt@kline_4h', console.log );
```
#### Terminate an existing socket
```js
binance.futuresTerminate( 'btcusdt@kline_4h' );
```
#### Return active sockets and subscriptions
```js
console.log( binance.futuresSubscriptions() );
```



# Delivery API (Futures w/Expiration Date)
```
deliveryBuy
deliverySell
deliveryMarketBuy
deliveryMarketSell
deliveryPrices
deliveryDaily
deliveryOpenInterest
deliveryExchangeInfo
deliveryOpenOrders
deliveryAllOrders
deliveryCandles
deliveryIndexKlines
deliveryContinuousKlines
deliveryMarkPriceKlines
deliveryMarkPrice
deliveryHistoricalTrades
deliveryTrades
deliveryAggTrades
deliveryUserTrades
deliveryLiquidationOrders
deliveryPositionRisk
deliveryLeverage
deliveryMarginType
deliveryPositionMargin
deliveryPositionMarginHistory
deliveryIncome
deliveryBalance
deliveryAccount
deliveryDepth
deliveryQuote
deliveryLeverageBracket
deliveryOrderStatus
deliveryCancel
deliveryCancelAll
deliveryCountdownCancelAll
deliveryOrder
deliveryGetDataStream
deliveryCloseDataStream
deliveryKeepDataStream
deliveryPing
deliveryTime
deliveryOrder
```

# Binance API (Spot Trading)

#### Getting latest price of all symbols
```javascript
let ticker = await binance.prices();
console.info(`Price of BNB: ${ticker.BNBUSDT}`);
```

#### Getting latest price of a symbol
```js
binance.prices('BNBBTC', (error, ticker) => {
  console.info("Price of BNB: ", ticker.BNBBTC);
});
```
<details>
 <summary>View Response</summary>

```js
{ ETHBTC: '0.07003500',
  LTCBTC: '0.01176700',
  BNBBTC: '0.00035735',
  NEOBTC: '0.00809500',
  QTUMETH: '0.03851200',
  EOSETH: '0.00189600',
  SNTETH: '0.00008595',
  BNTETH: '0.00738800',
  BCCBTC: '0.08104000',
  GASBTC: '0.00629800',
  BNBETH: '0.00509495',
  BTMETH: '0.00018900',
  HCCBTC: '0.00000180',
  BTCUSDT: '4464.44000000',
  ETHUSDT: '312.89000000',
  HSRBTC: '0.00289000',
  OAXETH: '0.00180000',
  DNTETH: '0.00014190',
  MCOETH: '0.02358300',
  ICNETH: '0.00557000',
  ELCBTC: '0.00000053',
  MCOBTC: '0.00166900',
  WTCBTC: '0.00184138',
  WTCETH: '0.02601700',
  LLTBTC: '0.00001669',
  LRCBTC: '0.00001100',
  LRCETH: '0.00016311',
  QTUMBTC: '0.00271600',
  YOYOBTC: '0.00000481',
  OMGBTC: '0.00187800',
  OMGETH: '0.02677400',
  ZRXBTC: '0.00004319',
  ZRXETH: '0.00060800',
  STRATBTC: '0.00087800',
  STRATETH: '0.01218800',
  SNGLSBTC: '0.00003649',
  SNGLSETH: '0.00051280',
  BQXBTC: '0.00013150',
  BQXETH: '0.00184240',
  KNCBTC: '0.00038969',
  KNCETH: '0.00550320',
  FUNBTC: '0.00000573',
  FUNETH: '0.00008433',
  SNMBTC: '0.00003176',
  SNMETH: '0.00047119',
  NEOETH: '0.11500200',
  IOTABTC: '0.00012136',
  IOTAETH: '0.00171001',
  LINKBTC: '0.00010646',
  LINKETH: '0.00150999',
  XVGBTC: '0.00000145',
  XVGETH: '0.00002059',
  CTRBTC: '0.00025532',
  CTRETH: '0.00375180',
  SALTBTC: '0.00080100',
  SALTETH: '0.01140000',
  MDABTC: '0.00057002',
  MDAETH: '0.00819490' }
//Price of BNB: 0.00035735
```
</details>


#### Getting list of current balances
```javascript
binance.balance((error, balances) => {
  if ( error ) return console.error(error);
  console.info("balances()", balances);
  console.info("ETH balance: ", balances.ETH.available);
});
// If you have problems with this function,
// see Troubleshooting at the bottom of this page.
```
<details>
 <summary>View Response</summary>

```js
{ BTC: { available: '0.77206464', onOrder: '0.00177975' },
  LTC: { available: '0.00000000', onOrder: '0.00000000' },
  ETH: { available: '1.14109900', onOrder: '0.00000000' },
  BNC: { available: '0.00000000', onOrder: '0.00000000' },
  ICO: { available: '0.00000000', onOrder: '0.00000000' },
  NEO: { available: '0.00000000', onOrder: '0.00000000' },
  BNB: { available: '41.33761879', onOrder: '0.00000000' },
  QTUM: { available: '0.00000000', onOrder: '0.00000000' },
  EOS: { available: '0.00000000', onOrder: '0.00000000' },
  SNT: { available: '0.00000000', onOrder: '0.00000000' },
  BNT: { available: '0.00000000', onOrder: '0.00000000' },
  GAS: { available: '0.00000000', onOrder: '0.00000000' },
  BCC: { available: '0.00000000', onOrder: '0.00000000' },
  BTM: { available: '0.00000000', onOrder: '0.00000000' },
  USDT: { available: '0.00000000', onOrder: '0.00000000' },
  HCC: { available: '0.00000000', onOrder: '0.00000000' },
  HSR: { available: '0.00000000', onOrder: '0.00000000' },
  OAX: { available: '0.00000000', onOrder: '0.00000000' },
  DNT: { available: '0.00000000', onOrder: '0.00000000' },
  MCO: { available: '0.00000000', onOrder: '0.00000000' },
  ICN: { available: '0.00000000', onOrder: '0.00000000' },
  ELC: { available: '0.00000000', onOrder: '0.00000000' },
  PAY: { available: '0.00000000', onOrder: '0.00000000' },
  ZRX: { available: '0.00000000', onOrder: '0.00000000' },
  OMG: { available: '0.00000000', onOrder: '0.00000000' },
  WTC: { available: '0.00000000', onOrder: '0.00000000' },
  LRX: { available: '0.00000000', onOrder: '0.00000000' },
  YOYO: { available: '0.00000000', onOrder: '0.00000000' },
  LRC: { available: '0.00000000', onOrder: '0.00000000' },
  LLT: { available: '0.00000000', onOrder: '0.00000000' },
  TRX: { available: '0.00000000', onOrder: '0.00000000' },
  FID: { available: '0.00000000', onOrder: '0.00000000' },
  SNGLS: { available: '0.00000000', onOrder: '0.00000000' },
  STRAT: { available: '0.00000000', onOrder: '0.00000000' },
  BQX: { available: '0.00000000', onOrder: '0.00000000' },
  FUN: { available: '0.00000000', onOrder: '0.00000000' },
  KNC: { available: '0.00000000', onOrder: '0.00000000' },
  CDT: { available: '0.00000000', onOrder: '0.00000000' },
  XVG: { available: '0.00000000', onOrder: '0.00000000' },
  IOTA: { available: '0.00000000', onOrder: '0.00000000' },
  SNM: { available: '0.76352833', onOrder: '0.00000000' },
  LINK: { available: '0.00000000', onOrder: '0.00000000' },
  CVC: { available: '0.00000000', onOrder: '0.00000000' },
  TNT: { available: '0.00000000', onOrder: '0.00000000' },
  REP: { available: '0.00000000', onOrder: '0.00000000' },
  CTR: { available: '0.00000000', onOrder: '0.00000000' },
  MDA: { available: '0.00000000', onOrder: '0.00000000' },
  MTL: { available: '0.00000000', onOrder: '0.00000000' },
  SALT: { available: '0.00000000', onOrder: '0.00000000' },
  NULS: { available: '0.00000000', onOrder: '0.00000000' } }
//ETH balance:  1.14109900
```
</details>

#### Getting bid/ask prices for a symbol
```js
binance.bookTickers('BNBBTC', (error, ticker) => {
  console.info("bookTickers", ticker);
});
```

 <details>
  <summary>View Response</summary>

```js 		 
{
  "symbol": "BNBBTC",
  "bidPrice": "4.00000000",
  "bidQty": "431.00000000",
  "askPrice": "4.00000200",
  "askQty": "9.00000000"
}

// from: https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#symbol-order-book-ticker
```
</details>

#### Getting bid/ask prices for all symbols
```js
binance.bookTickers((error, ticker) => {
  console.info("bookTickers()", ticker);
  console.info("Price of BNB: ", ticker.BNBBTC);
});
```

<details>
 <summary>View Response</summary>

```js
 { ETHBTC:
   { bid: '0.06201000',
     bids: '1.28200000',
     ask: '0.06201300',
     asks: '0.34200000' },
  LTCBTC:
   { bid: '0.01042000',
     bids: '41.45000000',
     ask: '0.01048700',
     asks: '16.81000000' },
  BNBBTC:
   { bid: '0.00028754',
     bids: '727.00000000',
     ask: '0.00028755',
     asks: '400.00000000' },
  NEOBTC:
   { bid: '0.00601800',
     bids: '16.82000000',
     ask: '0.00603700',
     asks: '73.43000000' },
  QTUMETH:
   { bid: '0.04062900',
     bids: '1.30000000',
     ask: '0.04075300',
     asks: '0.58000000' },
  EOSETH:
   { bid: '0.00191400',
     bids: '202.53000000',
     ask: '0.00192500',
     asks: '26.08000000' },
  SNTETH:
   { bid: '0.00007610',
     bids: '403.00000000',
     ask: '0.00007638',
     asks: '19850.00000000' },
  BNTETH:
   { bid: '0.00736800',
     bids: '7.82000000',
     ask: '0.00745900',
     asks: '177.32000000' },
  BCCBTC:
   { bid: '0.06862000',
     bids: '1.56100000',
     ask: '0.06893600',
     asks: '0.81100000' },
  GASBTC:
   { bid: '0.00451700',
     bids: '44.00000000',
     ask: '0.00489700',
     asks: '44.95000000' },
  BNBETH:
   { bid: '0.00462592',
     bids: '32.00000000',
     ask: '0.00467982',
     asks: '57.00000000' },
  BTMETH:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  HCCBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  BTCUSDT:
   { bid: '4786.01000000',
     bids: '0.58627700',
     ask: '4796.10000000',
     asks: '0.28486400' },
  ETHUSDT:
   { bid: '297.01000000',
     bids: '7.17846000',
     ask: '297.90000000',
     asks: '0.30742000' },
  HSRBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  OAXETH:
   { bid: '0.00156200',
     bids: '96.00000000',
     ask: '0.00169900',
     asks: '552.90000000' },
  DNTETH:
   { bid: '0.00011782',
     bids: '1273.00000000',
     ask: '0.00012045',
     asks: '238.00000000' },
  MCOETH:
   { bid: '0.02651200',
     bids: '0.94000000',
     ask: '0.02681200',
     asks: '8.59000000' },
  ICNETH:
   { bid: '0.00484600',
     bids: '448.76000000',
     ask: '0.00490000',
     asks: '0.01000000' },
  ELCBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  MCOBTC:
   { bid: '0.00164600',
     bids: '1.00000000',
     ask: '0.00164700',
     asks: '12.11000000' },
  WTCBTC:
   { bid: '0.00132101',
     bids: '124.00000000',
     ask: '0.00133200',
     asks: '98.00000000' },
  WTCETH:
   { bid: '0.02130000',
     bids: '784.35000000',
     ask: '0.02140800',
     asks: '10.70000000' },
  LLTBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  LRCBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  LRCETH:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  QTUMBTC:
   { bid: '0.00252800',
     bids: '123.48000000',
     ask: '0.00253200',
     asks: '10.50000000' },
  YOYOBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  OMGBTC:
   { bid: '0.00164900',
     bids: '25.94000000',
     ask: '0.00166400',
     asks: '0.90000000' },
  OMGETH:
   { bid: '0.02660000',
     bids: '9.86000000',
     ask: '0.02698200',
     asks: '43.21000000' },
  ZRXBTC:
   { bid: '0.00003936',
     bids: '117.00000000',
     ask: '0.00003982',
     asks: '8596.00000000' },
  ZRXETH:
   { bid: '0.00062801',
     bids: '239.00000000',
     ask: '0.00063595',
     asks: '2446.00000000' },
  STRATBTC:
   { bid: '0.00070600',
     bids: '43.43000000',
     ask: '0.00070900',
     asks: '15.00000000' },
  STRATETH:
   { bid: '0.01092100',
     bids: '9.00000000',
     ask: '0.01162700',
     asks: '47.90000000' },
  SNGLSBTC:
   { bid: '0.00003162',
     bids: '366.00000000',
     ask: '0.00003183',
     asks: '308.00000000' },
  SNGLSETH:
   { bid: '0.00050064',
     bids: '300.00000000',
     ask: '0.00051543',
     asks: '64.00000000' },
  BQXBTC:
   { bid: '0.00013334',
     bids: '13.00000000',
     ask: '0.00013889',
     asks: '1224.00000000' },
  BQXETH:
   { bid: '0.00200740',
     bids: '990.00000000',
     ask: '0.00228890',
     asks: '80.00000000' },
  KNCBTC:
   { bid: '0.00029509',
     bids: '300.00000000',
     ask: '0.00029842',
     asks: '4.00000000' },
  KNCETH:
   { bid: '0.00481840',
     bids: '411.00000000',
     ask: '0.00484440',
     asks: '10.00000000' },
  FUNBTC:
   { bid: '0.00000461',
     bids: '217.00000000',
     ask: '0.00000465',
     asks: '16668.00000000' },
  FUNETH:
   { bid: '0.00007486',
     bids: '2004.00000000',
     ask: '0.00007617',
     asks: '1419.00000000' },
  SNMBTC:
   { bid: '0.00002462',
     bids: '6922.00000000',
     ask: '0.00002495',
     asks: '404.00000000' },
  SNMETH:
   { bid: '0.00040181',
     bids: '373.00000000',
     ask: '0.00043404',
     asks: '9281.00000000' },
  NEOETH:
   { bid: '0.09610400',
     bids: '8.02000000',
     ask: '0.09891100',
     asks: '5.00000000' },
  IOTABTC:
   { bid: '0.00009674',
     bids: '206.00000000',
     ask: '0.00009721',
     asks: '269.00000000' },
  IOTAETH:
   { bid: '0.00155061',
     bids: '1231.00000000',
     ask: '0.00158100',
     asks: '22.00000000' },
  LINKBTC:
   { bid: '0.00007670',
     bids: '2278.00000000',
     ask: '0.00007697',
     asks: '8000.00000000' },
  LINKETH:
   { bid: '0.00123000',
     bids: '3492.00000000',
     ask: '0.00123999',
     asks: '4000.00000000' },
  XVGBTC:
   { bid: '0.00000111',
     bids: '47758.00000000',
     ask: '0.00000113',
     asks: '215443.00000000' },
  XVGETH:
   { bid: '0.00001801',
     bids: '8329.00000000',
     ask: '0.00001842',
     asks: '85146.00000000' },
  CTRBTC:
   { bid: '0.00019801',
     bids: '650.00000000',
     ask: '0.00021103',
     asks: '49.00000000' },
  CTRETH:
   { bid: '0.00320200',
     bids: '538.00000000',
     ask: '0.00351990',
     asks: '2081.00000000' },
  SALTBTC:
   { bid: '0.00063900',
     bids: '57.13000000',
     ask: '0.00064000',
     asks: '96.48000000' },
  SALTETH:
   { bid: '0.01030200',
     bids: '728.27000000',
     ask: '0.01038900',
     asks: '0.04000000' },
  MDABTC:
   { bid: '0.00039031',
     bids: '282.00000000',
     ask: '0.00039994',
     asks: '540.00000000' },
  MDAETH:
   { bid: '0.00635500',
     bids: '432.00000000',
     ask: '0.00641990',
     asks: '185.00000000' },
  MTLBTC:
   { bid: '0.00145500',
     bids: '45.00000000',
     ask: '0.00145600',
     asks: '42.12000000' },
  MTLETH:
   { bid: '0.02300100',
     bids: '96.10000000',
     ask: '0.02477400',
     asks: '131.90000000' },
  SUBBTC:
   { bid: '0.00003250',
     bids: '4474.00000000',
     ask: '0.00003380',
     asks: '3878.00000000' },
  SUBETH:
   { bid: '0.00053000',
     bids: '740.00000000',
     ask: '0.00053501',
     asks: '580.00000000' } }
/* Price of BNB:  { bid: '0.00028754',
  bids: '727.00000000',
  ask: '0.00028755',
  asks: '400.00000000' } */
```
</details>

#### Get all bid/ask prices
```javascript
binance.bookTickers((error, ticker) => {
  console.info("bookTickers", ticker);
});
```
<details>
 <summary>View Response</summary>

```js
{ ETHBTC:
   { bid: '0.06187700',
     bids: '0.64000000',
     ask: '0.06188300',
     asks: '6.79700000' },
  LTCBTC:
   { bid: '0.01036000',
     bids: '14.96000000',
     ask: '0.01037000',
     asks: '0.60000000' },
  BNBBTC:
   { bid: '0.00028226',
     bids: '802.00000000',
     ask: '0.00028268',
     asks: '584.00000000' },
  NEOBTC:
   { bid: '0.00595600',
     bids: '33.00000000',
     ask: '0.00595900',
     asks: '37.00000000' },
  QTUMETH:
   { bid: '0.03958000',
     bids: '1.42000000',
     ask: '0.04024300',
     asks: '7.46000000' },
  EOSETH:
   { bid: '0.00192600',
     bids: '29.31000000',
     ask: '0.00193500',
     asks: '418.91000000' },
  SNTETH:
   { bid: '0.00007607',
     bids: '8864.00000000',
     ask: '0.00007682',
     asks: '1311.00000000' },
  BNTETH:
   { bid: '0.00740200',
     bids: '1.36000000',
     ask: '0.00746800',
     asks: '419.86000000' },
  BCCBTC:
   { bid: '0.06786500',
     bids: '0.18600000',
     ask: '0.06835400',
     asks: '0.72600000' },
  GASBTC:
   { bid: '0.00435500',
     bids: '332.73000000',
     ask: '0.00435600',
     asks: '18.31000000' },
  BNBETH:
   { bid: '0.00456443',
     bids: '4.00000000',
     ask: '0.00461795',
     asks: '192.00000000' },
  BTMETH:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  HCCBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  BTCUSDT:
   { bid: '4801.05000000',
     bids: '0.82289400',
     ask: '4812.00000000',
     asks: '1.04753200' },
  ETHUSDT:
   { bid: '296.32000000',
     bids: '3.24294000',
     ask: '297.81000000',
     asks: '17.69901000' },
  HSRBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  OAXETH:
   { bid: '0.00154500',
     bids: '422.64000000',
     ask: '0.00169200',
     asks: '159.94000000' },
  DNTETH:
   { bid: '0.00012059',
     bids: '434.00000000',
     ask: '0.00012100',
     asks: '8311.00000000' },
  MCOETH:
   { bid: '0.02566000',
     bids: '5.85000000',
     ask: '0.02651200',
     asks: '4.37000000' },
  ICNETH:
   { bid: '0.00489000',
     bids: '232.97000000',
     ask: '0.00500000',
     asks: '0.01000000' },
  ELCBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  MCOBTC:
   { bid: '0.00162700',
     bids: '2.87000000',
     ask: '0.00163800',
     asks: '0.70000000' },
  WTCBTC:
   { bid: '0.00129604',
     bids: '600.00000000',
     ask: '0.00131600',
     asks: '1.00000000' },
  WTCETH:
   { bid: '0.02080000',
     bids: '30.00000000',
     ask: '0.02097600',
     asks: '24.00000000' },
  LLTBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  LRCBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  LRCETH:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  QTUMBTC:
   { bid: '0.00245100',
     bids: '43.11000000',
     ask: '0.00248500',
     asks: '74.96000000' },
  YOYOBTC:
   { bid: '0.00000000',
     bids: '0.00000000',
     ask: '0.00000000',
     asks: '0.00000000' },
  OMGBTC:
   { bid: '0.00160700',
     bids: '300.00000000',
     ask: '0.00161300',
     asks: '36.05000000' },
  OMGETH:
   { bid: '0.02597100',
     bids: '4.92000000',
     ask: '0.02633200',
     asks: '19.00000000' },
  ZRXBTC:
   { bid: '0.00003852',
     bids: '9.00000000',
     ask: '0.00003912',
     asks: '103.00000000' },
  ZRXETH:
   { bid: '0.00062997',
     bids: '645.00000000',
     ask: '0.00062998',
     asks: '5376.00000000' },
  STRATBTC:
   { bid: '0.00069200',
     bids: '50.50000000',
     ask: '0.00070000',
     asks: '6.54000000' },
  STRATETH:
   { bid: '0.01080400',
     bids: '5.00000000',
     ask: '0.01200000',
     asks: '5.88000000' },
  SNGLSBTC:
   { bid: '0.00003121',
     bids: '726.00000000',
     ask: '0.00003161',
     asks: '153.00000000' },
  SNGLSETH:
   { bid: '0.00046686',
     bids: '4782.00000000',
     ask: '0.00051906',
     asks: '32.00000000' },
  BQXBTC:
   { bid: '0.00011512',
     bids: '87.00000000',
     ask: '0.00011840',
     asks: '133.00000000' },
  BQXETH:
   { bid: '0.00183080',
     bids: '1051.00000000',
     ask: '0.00195000',
     asks: '626.00000000' },
  KNCBTC:
   { bid: '0.00027859',
     bids: '7.00000000',
     ask: '0.00028462',
     asks: '35.00000000' },
  KNCETH:
   { bid: '0.00452830',
     bids: '13.00000000',
     ask: '0.00454970',
     asks: '35.00000000' },
  FUNBTC:
   { bid: '0.00000464',
     bids: '753.00000000',
     ask: '0.00000465',
     asks: '13924.00000000' },
  FUNETH:
   { bid: '0.00007126',
     bids: '44131.00000000',
     ask: '0.00007617',
     asks: '1419.00000000' },
  SNMBTC:
   { bid: '0.00002489',
     bids: '564.00000000',
     ask: '0.00002559',
     asks: '2553.00000000' },
  SNMETH:
   { bid: '0.00040060',
     bids: '374.00000000',
     ask: '0.00041494',
     asks: '7624.00000000' },
  NEOETH:
   { bid: '0.09604700',
     bids: '22.05000000',
     ask: '0.09800000',
     asks: '0.31000000' },
  IOTABTC:
   { bid: '0.00009515',
     bids: '3.00000000',
     ask: '0.00009529',
     asks: '147.00000000' },
  IOTAETH:
   { bid: '0.00150002',
     bids: '4311.00000000',
     ask: '0.00155216',
     asks: '7.00000000' },
  LINKBTC:
   { bid: '0.00007601',
     bids: '4337.00000000',
     ask: '0.00007630',
     asks: '525.00000000' },
  LINKETH:
   { bid: '0.00121903',
     bids: '3784.00000000',
     ask: '0.00122965',
     asks: '200.00000000' },
  XVGBTC:
   { bid: '0.00000113',
     bids: '470101.00000000',
     ask: '0.00000114',
     asks: '147728.00000000' },
  XVGETH:
   { bid: '0.00001813',
     bids: '8274.00000000',
     ask: '0.00001843',
     asks: '8320.00000000' },
  CTRBTC:
   { bid: '0.00020202',
     bids: '625.00000000',
     ask: '0.00020649',
     asks: '1143.00000000' },
  CTRETH:
   { bid: '0.00330510',
     bids: '387.00000000',
     ask: '0.00339330',
     asks: '436.00000000' },
  SALTBTC:
   { bid: '0.00063500',
     bids: '76.00000000',
     ask: '0.00064300',
     asks: '437.54000000' },
  SALTETH:
   { bid: '0.01014200',
     bids: '202.79000000',
     ask: '0.01122600',
     asks: '1.36000000' },
  MDABTC:
   { bid: '0.00038061',
     bids: '8.00000000',
     ask: '0.00041300',
     asks: '1772.00000000' },
  MDAETH:
   { bid: '0.00655000',
     bids: '547.00000000',
     ask: '0.00660830',
     asks: '8814.00000000' },
  MTLBTC:
   { bid: '0.00140600',
     bids: '0.11000000',
     ask: '0.00143800',
     asks: '12.00000000' },
  MTLETH:
   { bid: '0.02300000',
     bids: '1166.86000000',
     ask: '0.02489500',
     asks: '13.98000000' },
  SUBBTC:
   { bid: '0.00003580',
     bids: '7617.00000000',
     ask: '0.00003619',
     asks: '1052.00000000' },
  SUBETH:
   { bid: '0.00056500',
     bids: '3649.00000000',
     ask: '0.00059988',
     asks: '3649.00000000' } }
```
</details>

#### Get market depth for a symbol
```javascript
binance.depth("BNBBTC", (error, depth, symbol) => {
  console.info(symbol+" market depth", depth);
});
```
<details>
 <summary>View Response</summary>

```js
market depth for BNBBTC
{ bids:
   { '0.00022997': '49.00000000',
     '0.00022867': '11.00000000',
     '0.00022865': '1149.00000000',
     '0.00022810': '20.00000000',
     '0.00022800': '1000.00000000',
     '0.00022777': '1350.00000000',
     '0.00022774': '96.00000000',
     '0.00022765': '5.00000000',
     '0.00022741': '12.00000000',
     '0.00022705': '1372.00000000',
     '0.00022700': '402.00000000',
     '0.00022514': '756.00000000',
     '0.00022513': '761.00000000',
     '0.00022502': '2244.00000000',
     '0.00022501': '2190.00000000',
     '0.00022500': '5069.00000000',
     '0.00022419': '1871.00000000',
     '0.00022418': '1667.00000000',
     '0.00022167': '1889.00000000',
     '0.00022162': '1014.00000000',
     '0.00022112': '13563.00000000',
     '0.00022078': '4056.00000000',
     '0.00022000': '8060.00000000',
     '0.00021963': '13563.00000000',
     '0.00021850': '52.00000000',
     '0.00021800': '1282.00000000',
     '0.00021710': '102.00000000',
     '0.00021680': '100.00000000',
     '0.00021652': '29.00000000',
     '0.00021641': '154.00000000',
     '0.00021500': '1491.00000000',
     '0.00021471': '977.00000000',
     '0.00021405': '478.00000000',
     '0.00021400': '11.00000000',
     '0.00021314': '686.00000000',
     '0.00021219': '1089.00000000',
     '0.00021200': '767.00000000',
     '0.00021100': '5000.00000000',
     '0.00021011': '50.00000000',
     '0.00021000': '3468.00000000',
     '0.00020900': '169.00000000',
     '0.00020843': '90.00000000',
     '0.00020811': '200.00000000',
     '0.00020702': '50.00000000',
     '0.00020691': '283.00000000',
     '0.00020600': '3703.00000000',
     '0.00020500': '107.00000000',
     '0.00020450': '6363.00000000',
     '0.00020250': '301.00000000',
     '0.00020222': '200.00000000',
     '0.00020200': '123.00000000',
     '0.00020137': '50.00000000',
     '0.00020122': '727.00000000',
     '0.00020100': '6400.00000000',
     '0.00020088': '10.00000000',
     '0.00020020': '793.00000000',
     '0.00020010': '500.00000000',
     '0.00020009': '44.00000000',
     '0.00020001': '20020.00000000',
     '0.00020000': '45269.00000000',
     '0.00019990': '270.00000000',
     '0.00019880': '2117.00000000',
     '0.00019800': '1200.00000000',
     '0.00019783': '50.00000000',
     '0.00019702': '300.00000000',
     '0.00019686': '10.00000000',
     '0.00019600': '1025.00000000',
     '0.00019595': '139.00000000',
     '0.00019501': '3227.00000000',
     '0.00019500': '3832.00000000',
     '0.00019488': '82.00000000',
     '0.00019400': '1853.00000000',
     '0.00019293': '10.00000000',
     '0.00019289': '30.00000000',
     '0.00019234': '1999.00000000',
     '0.00019200': '4765.00000000',
     '0.00019190': '6.00000000',
     '0.00019100': '4353.00000000',
     '0.00019073': '12.00000000',
     '0.00019058': '28.00000000',
     '0.00019050': '718.00000000',
     '0.00019001': '20.00000000',
     '0.00019000': '39478.00000000',
     '0.00018907': '10.00000000',
     '0.00018888': '10045.00000000',
     '0.00018880': '15.00000000',
     '0.00018800': '3528.00000000',
     '0.00018700': '328.00000000',
     '0.00018600': '1000.00000000',
     '0.00018598': '2187.00000000',
     '0.00018538': '1383.00000000',
     '0.00018529': '10.00000000',
     '0.00018500': '1512.00000000',
     '0.00018253': '30.00000000',
     '0.00018200': '3000.00000000',
     '0.00018158': '10.00000000',
     '0.00018106': '250.00000000',
     '0.00018100': '4577.00000000',
     '0.00018011': '500.00000000',
     '0.00018000': '29832.00000000' },
  asks:
   { '0.00022999': '32.00000000',
     '0.00023086': '583.00000000',
     '0.00023095': '1154.00000000',
     '0.00023119': '781.00000000',
     '0.00023120': '3401.00000000',
     '0.00023180': '4889.00000000',
     '0.00023185': '83.00000000',
     '0.00023211': '750.00000000',
     '0.00023339': '9273.00000000',
     '0.00023340': '474.00000000',
     '0.00023440': '500.00000000',
     '0.00023450': '1433.00000000',
     '0.00023500': '1480.00000000',
     '0.00023573': '87.00000000',
     '0.00023580': '518.00000000',
     '0.00023999': '863.00000000',
     '0.00024000': '275.00000000',
     '0.00024100': '60.00000000',
     '0.00024119': '3736.00000000',
     '0.00024180': '989.00000000',
     '0.00024350': '1285.00000000',
     '0.00024399': '500.00000000',
     '0.00024400': '2964.00000000',
     '0.00024419': '500.00000000',
     '0.00024500': '4499.00000000',
     '0.00024580': '542.00000000',
     '0.00024584': '6.00000000',
     '0.00024700': '250.00000000',
     '0.00024789': '2938.00000000',
     '0.00024790': '5535.00000000',
     '0.00024800': '499.00000000',
     '0.00024892': '2000.00000000',
     '0.00024920': '652.00000000',
     '0.00024972': '9242.00000000',
     '0.00024999': '1262.00000000',
     '0.00025000': '3739.00000000',
     '0.00025078': '250.00000000',
     '0.00025348': '1000.00000000',
     '0.00025499': '220.00000000',
     '0.00025500': '6029.00000000',
     '0.00025518': '10.00000000',
     '0.00025698': '17.00000000',
     '0.00025700': '250.00000000',
     '0.00025800': '265.00000000',
     '0.00025925': '20.00000000',
     '0.00025984': '1048.00000000',
     '0.00025985': '1048.00000000',
     '0.00025987': '1165.00000000',
     '0.00025990': '465.00000000',
     '0.00025994': '571.00000000',
     '0.00025995': '390.00000000',
     '0.00026000': '5033.00000000',
     '0.00026028': '10.00000000',
     '0.00026280': '40.00000000',
     '0.00026300': '13.00000000',
     '0.00026348': '50.00000000',
     '0.00026500': '38.00000000',
     '0.00026548': '10.00000000',
     '0.00026594': '51.00000000',
     '0.00026666': '15000.00000000',
     '0.00026700': '500.00000000',
     '0.00026800': '27.00000000',
     '0.00026900': '1000.00000000',
     '0.00026929': '50.00000000',
     '0.00026990': '270.00000000',
     '0.00027000': '8750.00000000',
     '0.00027199': '50.00000000',
     '0.00027300': '351.00000000',
     '0.00027429': '50.00000000',
     '0.00027480': '270.00000000',
     '0.00027500': '38.00000000',
     '0.00027690': '242.00000000',
     '0.00027700': '500.00000000',
     '0.00027789': '1317.00000000',
     '0.00027906': '1457.00000000',
     '0.00027912': '98.00000000',
     '0.00027949': '50.00000000',
     '0.00027950': '2000.00000000',
     '0.00027977': '96.00000000',
     '0.00027980': '1031.00000000',
     '0.00028000': '782.00000000',
     '0.00028300': '25.00000000',
     '0.00028500': '48.00000000',
     '0.00028590': '364.00000000',
     '0.00028680': '50.00000000',
     '0.00028699': '50.00000000',
     '0.00028700': '1600.00000000',
     '0.00028800': '3509.00000000',
     '0.00028890': '175.00000000',
     '0.00028900': '11474.00000000',
     '0.00028999': '10000.00000000',
     '0.00029000': '623.00000000',
     '0.00029100': '303.00000000',
     '0.00029141': '456.00000000',
     '0.00029200': '9999.00000000',
     '0.00029234': '104.00000000',
     '0.00029300': '200.00000000',
     '0.00029358': '325.00000000',
     '0.00029399': '153.00000000',
     '0.00029428': '100.00000000' } }
```
</details>

#### Placing a LIMIT order
```javascript
let quantity = 1, price = 0.069;
binance.buy("ETHBTC", quantity, price);
binance.sell("ETHBTC", quantity, price);
```

#### Placing a MARKET order
```javascript
// These orders will be executed at current market price.
let quantity = 1;
binance.marketBuy("BNBBTC", quantity);
binance.marketSell("ETHBTC", quantity);
```

#### LIMIT order with callback
```javascript
let quantity = 5, price = 0.00402030;
binance.buy("BNBETH", quantity, price, {type:'LIMIT'}, (error, response) => {
  console.info("Limit Buy response", response);
  console.info("order id: " + response.orderId);
});
```

<details>
 <summary>View Response</summary>

```
Limit Buy response {
  symbol: 'BNBETH',
  orderId: 4480717,
  clientOrderId: 'te38xGILZUXrPZHnTQPH6h',
  transactTime: 1509049732437,
  price: '0.00402030',
  origQty: '5.00000000',
  executedQty: '5.00000000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'BUY' }
//order id: 4480717
```

</details>

#### Chaining orders together
```js
let quantity = 1;
binance.marketBuy("BNBBTC", quantity, (error, response) => {
  console.info("Market Buy response", response);
  console.info("order id: " + response.orderId);
  // Now you can limit sell with a stop loss, etc.
});
```

<details>
 <summary>View Response</summary>

```
Market Buy response {
  symbol: 'BNBETH',
  orderId: 4480553,
  clientOrderId: 'rCGiCG08PGy7AwvbrG5d83',
  transactTime: 1509049376261,
  price: '0.00000000',
  origQty: '1.00000000',
  executedQty: '1.00000000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY' }
//order id: 4480553
```

</details>

#### Placing a STOP LOSS order
```javascript
// When the stop is reached, a stop order becomes a market order
// Note: You must also pass one of these type parameters:
// STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT
let type = "STOP_LOSS";
let quantity = 1;
let price = 0.069;
let stopPrice = 0.068;
binance.sell("ETHBTC", quantity, price, {stopPrice: stopPrice, type: type});
```

#### Placing an ICEBERG order
```javascript
// Iceberg orders are intended to conceal the order quantity.
let quantity = 1;
let price = 0.069;
binance.sell("ETHBTC", quantity, price, {icebergQty: 10});
```

#### Cancel an order
```javascript
binance.cancel("ETHBTC", orderid, (error, response, symbol) => {
  console.info(symbol+" cancel response:", response);
});
```

#### Cancel all open orders
```js
console.info( await binance.cancelAll("XMRBTC") );
```

#### Get open orders for a symbol
```javascript
binance.openOrders("ETHBTC", (error, openOrders, symbol) => {
  console.info("openOrders("+symbol+")", openOrders);
});
```

#### Get list of all open orders
```javascript
binance.openOrders(false, (error, openOrders) => {
  console.info("openOrders()", openOrders);
});
```

#### Check an order's status
```javascript
let orderid = "7610385";
binance.orderStatus("ETHBTC", orderid, (error, orderStatus, symbol) => {
  console.info(symbol+" order status:", orderStatus);
});
```

#### Get your Trade History
```javascript
binance.trades("SNMBTC", (error, trades, symbol) => {
  console.info(symbol+" trade history", trades);
});
```
<details>
 <summary>View Response</summary>

```js
[ { id: 9572,
    orderId: 47884,
    price: '0.00003701',
    qty: '1467.00000000',
    commission: '0.06774660',
    commissionAsset: 'BNB',
    time: 1507062500456,
    isBuyer: true,
    isMaker: true,
    isBestMatch: true },
  { id: 9575,
    orderId: 47884,
    price: '0.00003701',
    qty: '735.00000000',
    commission: '0.03394257',
    commissionAsset: 'BNB',
    time: 1507062502528,
    isBuyer: true,
    isMaker: true,
    isBestMatch: true } } ]
```
</details>

#### Get all account orders; active, canceled, or filled.
```javascript
binance.allOrders("ETHBTC", (error, orders, symbol) => {
  console.info(symbol+" orders:", orders);
});
```

#### Get dust log
```javascript
binance.dustLog((error, dustlog) => {
  console.info(dustlog);
})
```

#### Get 24hr ticker price change statistics for all symbols
```javascript
binance.prevDay(false, (error, prevDay) => {
  // console.info(prevDay); // view all data
  for ( let obj of prevDay ) {
    let symbol = obj.symbol;
    console.info(symbol+" volume:"+obj.volume+" change: "+obj.priceChangePercent+"%");
  }
});
```

#### Get 24hr ticker price change statistics for a symbol
```javascript
binance.prevDay("BNBBTC", (error, prevDay, symbol) => {
  console.info(symbol+" previous day:", prevDay);
  console.info("BNB change since yesterday: "+prevDay.priceChangePercent+"%")
});
```

#### Get Kline/candlestick data for a symbol
You can use the optional API parameters for getting historical candlesticks, these are useful if you want to import data from earlier back in time.
Optional parameters: limit (max/default 500), startTime, endTime.

```javascript
// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks("BNBBTC", "5m", (error, ticks, symbol) => {
  console.info("candlesticks()", ticks);
  let last_tick = ticks[ticks.length - 1];
  let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
  console.info(symbol+" last close: "+close);
}, {limit: 500, endTime: 1514764800000});
```

# WebSockets Implementation

#### Get Complete WebSocket Chart Cache
This function pulls existing chart data before connecting to the WebSocket, and provides you realtime synchronized chart information including the most recent 500 candles.

```javascript
binance.websockets.chart("BNBBTC", "1m", (symbol, interval, chart) => {
  let tick = binance.last(chart);
  const last = chart[tick].close;
  console.info(chart);
  // Optionally convert 'chart' object to array:
  // let ohlc = binance.ohlc(chart);
  // console.info(symbol, ohlc);
  console.info(symbol+" last price: "+last)
});
```

<details>
 <summary>View Response</summary>

```
{
  '1517557800000':
   { open: '0.00100090',
     high: '0.00100650',
     low: '0.00099810',
     close: '0.00100370',
     volume: '1161.52000000' },
  '1517557860000':
   { open: '0.00100360',
     high: '0.00101010',
     low: '0.00100000',
     close: '0.00100310',
     volume: '1977.68000000' },
  '1517557920000':
   { open: '0.00100100',
     high: '0.00101130',
     low: '0.00100080',
     close: '0.00100670',
     volume: '2002.00000000' },
  '1517557980000':
   { open: '0.00100660',
     high: '0.00101400',
     low: '0.00100200',
     close: '0.00100640',
     volume: '3896.40000000' },
  '1517558040000':
   { open: '0.00100630',
     high: '0.00101390',
     low: '0.00100350',
     close: '0.00100470',
     volume: '1675.48000000' },
  '1517558100000':
   { open: '0.00100860',
     high: '0.00101450',
     low: '0.00100100',
     close: '0.00100270',
     volume: '1918.46000000' },
  '1517558160000':
   { open: '0.00100460',
     high: '0.00101480',
     low: '0.00100310',
     close: '0.00100670',
     volume: '2464.12000000' },
  '1517558220000':
   { open: '0.00100510',
     high: '0.00100660',
     low: '0.00100110',
     close: '0.00100250',
     volume: '1484.59000000' } }
// (..many more entries not shown)
///BNBBTC last price: 0.00100250
```
</details>


#### Get Candlestick Updates via WebSocket
```javascript
// Periods: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.websockets.candlesticks(['BNBBTC'], "1m", (candlesticks) => {
  let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
  let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
  console.info(symbol+" "+interval+" candlestick update");
  console.info("open: "+open);
  console.info("high: "+high);
  console.info("low: "+low);
  console.info("close: "+close);
  console.info("volume: "+volume);
  console.info("isFinal: "+isFinal);
});
```

#### Get Trade Updates via WebSocket
```javascript
binance.websockets.trades(['BNBBTC', 'ETHBTC'], (trades) => {
  let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
  console.info(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
});
```

#### Get miniTicker via WebSocket
```js
binance.websockets.miniTicker(markets => {
  console.info(markets);
});
```

<details>
 <summary>View Response</summary>

```
  ICXBNB:
   { close: '0.34803000',
     open: '0.34249000',
     high: '0.35000000',
     low: '0.31001000',
     volume: '134681.88000000',
     quoteVolume: '44351.78363150',
     eventTime: 1520501508957 },
  ELFETH:
   { close: '0.00120820',
     open: '0.00132816',
     high: '0.00132926',
     low: '0.00115888',
     volume: '852919.00000000',
     quoteVolume: '1045.37831133',
     eventTime: 1520501508735 },
  PIVXBTC:
   { close: '0.00049510',
     open: '0.00051000',
     high: '0.00056290',
     low: '0.00049200',
     volume: '215530.27000000',
     quoteVolume: '111.50245426',
     eventTime: 1520501508367 }
```
</details>

#### Get 24hr Price Change Statistics via WebSocket
```js
// For all symbols:
binance.websockets.prevDay(false, (error, response) => {
  console.info(response);
});

// For a specific symbol:
binance.websockets.prevDay('BNBBTC', (error, response) => {
  console.info(response);
});
```

<details>
 <summary>View Response</summary>

```
{ eventType: '24hrTicker',
  eventTime: 1512629577435,
  symbol: 'BNBBTC',
  priceChange: '-0.00002671',
  percentChange: '-12.844',
  averagePrice: '0.00019282',
  prevClose: '0.00020796',
  close: '0.00018125',
  closeQty: '55.00000000',
  bestBid: '0.00018038',
  bestBidQty: '580.00000000',
  bestAsk: '0.00018125',
  bestAskQty: '144.00000000',
  open: '0.00020796',
  high: '0.00021300',
  low: '0.00017555',
  volume: '3731915.00000000',
  quoteVolume: '719.59011818',
  openTime: 1512543177433,
  closeTime: 1512629577433,
  firstTradeId: 2248079,
  lastTradeId: 2284725,
  numTrades: 36647 }
```
</details>

#### Get Market Depth via WebSocket
```javascript
binance.websockets.depth(['BNBBTC'], (depth) => {
  let {e:eventType, E:eventTime, s:symbol, u:updateId, b:bidDepth, a:askDepth} = depth;
  console.info(symbol+" market depth update");
  console.info(bidDepth, askDepth);
});
```

#### Maintain Market Depth Cache Locally via WebSocket
```javascript
binance.websockets.depthCache(['BNBBTC'], (symbol, depth) => {
  let bids = binance.sortBids(depth.bids);
  let asks = binance.sortAsks(depth.asks);
  console.info(symbol+" depth cache update");
  console.info("bids", bids);
  console.info("asks", asks);
  console.info("best bid: "+binance.first(bids));
  console.info("best ask: "+binance.first(asks));
  console.info("last updated: " + new Date(depth.eventTime));
});
```

<details>
 <summary>View Response</summary>

```javascript
BNBBTC depth cache update
asks { '0.00025400': 0.531114,
  '0.00025440': 0.2602512,
  '0.00025469': 0.01400795,
  '0.00025500': 0.0051,
  '0.00025555': 0.0245328,
  '0.00025629': 0.05100171,
  '0.00025630': 0.0146091,
  '0.00025642': 0.02230854,
  '0.00025825': 0.00180775,
  '0.00025896': 0.21856224,
  '0.00025927': 0.025927 }
bids { '0.00025203': 0.201624,
  '0.00025202': 0.04838784,
  '0.00025200': 0.13482,
  '0.00025195': 0.01385725,
  '0.00025187': 0.25539618,
  '0.00025138': 0.012569,
  '0.00025136': 0.04247984,
  '0.00025135': 0.0085459,
  '0.00025100': 0.02259,
  '0.00025072': 0.012536,
  '0.00025071': 0.00401136 }
//best ask: 0.00025400
//best bid: 0.00025203
//last updated: Thu Apr 18 2019 00:52:49 GMT-0400 (Eastern Daylight Time)
```
</details>

#### bookTickers stream includes the bid/ask price & amount, for all symbols
```js
binance.websockets.bookTickers( console.log );
```
#### bookTickers stream includes the bid/ask price & amount, for a symbol
```js
binance.websockets.bookTickers( 'BTCUSDT', console.log );
```

### Deposit & Withdraw

#### Get Deposit Address
```js
binance.depositAddress("XMR", (error, response) => {
  console.info(response);
});
```

#### Get All Deposit History
```js
binance.depositHistory((error, response) => {
  console.info(response);
});
```

#### Get Deposit History for a specific symbol
```js
binance.depositHistory((error, response) => {
  console.info(response);
}, "VEN");
```

#### Get All Withdraw History
```js
binance.withdrawHistory((error, response) => {
  console.info(response);
});
```

#### Get Withdraw History for a specific symbol
```js
binance.withdrawHistory((error, response) => {
  console.info(response);
}, "BTC");
```

#### Withdraw with AddressTag
```js
// Required for coins like XMR, XRP, etc.
let address = "44tLjmXrQNrWJ5NBsEj2R77ZBEgDa3fEe9GLpSf2FRmhexPvfYDUAB7EXX1Hdb3aMQ9FLqdJ56yaAhiXoRsceGJCRS3Jxkn";
let addressTag = "0e5e38a01058dbf64e53a4333a5acf98e0d5feb8e523d32e3186c664a9c762c1";
let amount = 0.1;
binance.withdraw("XMR", address, amount, addressTag);
```

#### Withdraw
```js
binance.withdraw("BTC", "1C5gqLRs96Xq4V2ZZAR1347yUCpHie7sa", 0.2);
```

### Universal Transfer / Internal Wallet Transfer
Example Spot account transfer to USDⓈ-M Futures account , use ENUM -> "MAIN_UMFUTURE"
```js
console.info( await binance.universalTransfer("MAIN_UMFUTURE","USDT",10) );
```
for more account transfers (ENUMs) see [docs](https://binance-docs.github.io/apidocs/spot/en/#user-universal-transfer)

# Binance Margin API

#### Transfer from Main account to Margin account
```js
binance.mgTransferMainToMargin(asset, amount, (error, response) => {
    if ( error ) return console.warn(error);
    // Success! Transaction ID: response.tranId
});

```
#### Transfer from Margin account to Main account
```js
binance.mgTransferMarginToMain(asset, amount, (error, response) => {
    if ( error ) return console.warn(error);
    // Success! Transaction ID: response.tranId
});
```

#### Get maximum transfer-out amount from Margin account to Main account
```js
binance.maxTransferable(asset, (error, response) => {
    if ( error ) return console.warn(error);
    console.info(`Maximum transfer-out amount: ${response.amount}`);
});
```

#### Get maximum borrow amount
```js
binance.maxBorrowable(asset, (error, response) => {
    if ( error ) return console.warn(error);
    console.info(`Maximum borrow amount: ${response.amount}`);
});
```

#### Borrow from margin account
```js
binance.mgBorrow(asset, amount, (error, response) => {
    if ( error ) return console.warn(error);
    // Success! Transaction ID: response.tranId
});
```

#### Repay margin account
```js
binance.mgRepay(asset, amount, (error, response) => {
    if ( error ) return console.warn(error);
    // Success! Transaction ID: response.tranId
});
```

#### Margin BUY and SELL orders
Instead of `binance.buy()` use `binance.mgBuy()` and instead of `binance.sell()` use `binance.mgSell()`.

For market orders use `binance.mgMarketBuy()` and `binance.mgMarketSell()`.

For order operations, use `binance.mgCancel()`, `binance.mgCancelOrders()`, `binance.mgAllOrders()`, `binance.openOrders()`, `binance.mgOrderStatus()`.

Usage and callbacks are the same as the 'regular account' counterparts.

#### Get your Trade History for the Margin account
Use `binance.mgTrades()` instead of `binance.trades()`. 

```javascript
binance.mgTrades("ETHUSDT", (error, trades, symbol) => {
  console.info(symbol+" trade history", trades);
});
```
<details>
 <summary>View Response</summary>

```js
[ { symbol: 'ETHUSDT',
    id: 9572,
    orderId: 47884,
    price: '2063.07',
    qty: '1.44877',
    commission: '2.98891392',
    commissionAsset: 'USDT',
    time: 1617900638521,
    isBuyer: false,
    isMaker: false,
    isBestMatch: true,
    isIsolated: true }]
```
</details>

#### Margin account details
```javascript
binance.mgAccount((error, response) => {
   if ( error ) return console.warn(error);
   console.info("Account details response:", response)
})
```
<details>
  <summary>View response</summary>

  ```javascript
    {
      borrowEnabled: true,
      marginLevel: '999.00000000',
      totalAssetOfBtc: '0.00000003',
      totalLiabilityOfBtc: '0.00000000',
      totalNetAssetOfBtc: '0.00000003',
      tradeEnabled: true,
      transferEnabled: true,
      userAssets: [
        {
          asset: 'MATIC',
          borrowed: '0.00000000',
          free: '0.00000000',
          interest: '0.00000000',
          locked: '0.00000000',
          netAsset: '0.00000000'
        }
      ]
    }
  ```
</details>

# Binance Lending API

#### Lending Account Details
```javascript
let lendingData = await binance.lending();
```

<details>
  <summary>View response</summary>
  
  ```javascript
    lendingData {
      positionAmountVos: [
        {
          amount: '952983.20208997',
          amountInBTC: '129.54853649',
          amountInUSDT: '952983.20208997',
          asset: 'USDT'
        }
      ],
      totalAmountInBTC: '129.54853649',
      totalAmountInUSDT: '952983.20208997',
      totalFixedAmountInBTC: '13.59400000',
      totalFixedAmountInUSDT: '100000.00000000',
      totalFlexibleInBTC: '115.95453649',
      totalFlexibleInUSDT: '852983.20208997'
    }
    {
      positionAmountVos: [],
      totalAmountInBTC: '0.00000000',
      totalAmountInUSDT: '0.00000000',
      totalFixedAmountInBTC: '0.00000000',
      totalFixedAmountInUSDT: '0.00000000',
      totalFlexibleInBTC: '0.00000000',
      totalFlexibleInUSDT: '0.00000000'
    }
    {
      positionAmountVos: [],
      totalAmountInBTC: '0.00000000',
      totalAmountInUSDT: '0.00000000',
      totalFixedAmountInBTC: '0.00000000',
      totalFixedAmountInUSDT: '0.00000000',
      totalFlexibleInBTC: '0.00000000',
      totalFlexibleInUSDT: '0.00000000'
    }
  ```
</details>

#### [Advanced Examples](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md)
> [exchangeInfo: Pull minimum order size, quantity, etc](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#exchangeinfo-pull-minimum-order-size-quantity-etc)\
[Clamp order quantities to required amounts via minQty, minNotional, stepSize when placing orders](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#clamp-order-quantities-to-required-amounts-via-minqty-minnotional-stepsize-when-placing-orders)\
[Show API Rate limits](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#show-api-rate-limits)\
[Connect to all WebSockets at once](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#connect-to-all-websockets-at-once-thanks-keith1024)\
[Get last order for a symbol](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#get-last-order-for-a-symbol)\
[newOrderRespType example](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#neworderresptype-example-when-placing-orders)\
[Recent Trades (historicalTrades, recentTrades, aggTrades functions)](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#recent-trades-historicaltrades-recenttrades-aggtrades-functions)\
[Terminate WebSocket connections](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#terminate-websocket-connections)\
[User Data: Account Balance Updates, Trade Updates, New Orders, Filled Orders, Cancelled Orders via WebSocket](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#user-data-account-balance-updates-trade-updates-new-orders-filled-orders-cancelled-orders-via-websocket)
[Margin User Data: Account Balance Updates, Trade Updates, New Orders, Filled Orders, Cancelled Orders via WebSocket](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#margin-user-data-account-balance-updates-trade-updates-new-orders-filled-orders-cancelled-orders-via-websocket)
[Asynchronous Syntax Options](https://github.com/jaggedsoft/node-binance-api/blob/master/examples/advanced.md#asynchronous-syntax-options)

### Troubleshooting
Verify that your system time is correct. If you have any suggestions don't hesitate to file an issue.

Having problems? Try adding `useServerTime` to your options or setting `recvWindow`:
```js
binance.options({
  APIKEY: 'xxx',
  APISECRET: 'xxx',
  useServerTime: true,
  recvWindow: 60000, // Set a higher recvWindow to increase response timeout
  verbose: true, // Add extra output when subscribing to WebSockets, etc
  log: log => {
    console.log(log); // You can create your own logger here, or disable console output
  }
});
```

Problems getting your balance? Wrap the entry point of your application in useServerTime:
```js
await binance.useServerTime();
binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    console.info("balances()", balances);
    console.info("BNB balance: ", balances.BNB.available);
});
```

You can enable verbose mode to help with debugging WebSocket streams:
```js
binance.setOption( 'verbose', true );
```

### Sponsors


[![Vitality](https://github.com/user-attachments/assets/0981aae2-3e12-4b57-8d2f-c5ae2b3b8b1c)](https://vitalitycrypto.com/)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jaggedsoft/node-binance-api&type=Timeline)](https://star-history.com/#jaggedsoft/node-binance-api&Timeline)

## Contribution
- Give us a star :star:
- Fork and Clone! Awesome
- Select existing [issues](https://github.com/jaggedsoft/node-binance-api/issues) or create a [new issue](https://github.com/jaggedsoft/node-binance-api/issues/new) and give us a PR with your bugfix or improvement after. We love it ❤️

![Downloads](https://img.shields.io/npm/dt/node-binance-api.svg?style=for-the-badge&maxAge=86400) ![Stars](https://img.shields.io/github/stars/jaggedsoft/node-binance-api.svg?style=for-the-badge&label=Stars) ![Contributors](https://img.shields.io/github/contributors/jaggedsoft/node-binance-api.svg?style=for-the-badge&maxAge=86400)
[![CCXT on X](https://img.shields.io/twitter/follow/ccxt_official.svg?style=social)](https://x.com/ccxt_official)
