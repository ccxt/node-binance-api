// CommonJS consumer using a default import (esModuleInterop, on by default under nodenext).
import Binance from 'node-binance-api';
import type { Interval } from 'node-binance-api';

const client = new Binance();
const interval: Interval = '1h';
client.prices('BTCUSDT');

// @ts-expect-error - method does not exist on Binance
client.thisMethodDoesNotExist();

export { interval };
