// ES module consumer.
import Binance from 'node-binance-api';
import type { Interval, Order, Dictionary } from 'node-binance-api';

const client = new Binance({ APIKEY: 'key', APISECRET: 'secret' });
const interval: Interval = '1d';
const dict: Dictionary<string> = { a: 'b' };
let order: Order | undefined;
client.prices('BTCUSDT');

// @ts-expect-error - method does not exist on Binance
client.thisMethodDoesNotExist();

export { interval, dict, order };
