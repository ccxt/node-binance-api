// CommonJS consumer using `import = require` (compiles to `require('node-binance-api')`).
import Binance = require('node-binance-api');

const client: Binance = new Binance({ APIKEY: 'key', APISECRET: 'secret' });
const prices: Promise<any> = client.prices('BTCUSDT');
client.options({ test: true });

// Named types must be reachable through the `export =` namespace.
const interval: Binance.Interval = '1m';
const side: Binance.OrderSide = 'BUY';
const dict: Binance.Dictionary<number> = { a: 1 };
let order: Binance.Order | undefined;

// Guards against the module silently resolving to `any`.
// @ts-expect-error - method does not exist on Binance
client.thisMethodDoesNotExist();
// @ts-expect-error - invalid interval literal
const badInterval: Binance.Interval = 'not-an-interval';

export { prices, interval, side, dict, order, badInterval };
