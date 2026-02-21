import Binance from '../src/node-binance-api';
import { assert } from 'chai';

/**
 * Live test for margin websocket API (ws-api branch).
 *
 * This test:
 *   1. Connects to the margin user data stream via WebSocket API
 *   2. Creates a LIMIT BUY order at a low price (won't fill)
 *   3. Asserts an executionReport event is received via the websocket
 *   4. Cancels the order and asserts a second executionReport (CANCELED)
 *   5. Cleans up all connections
 *
 * Requirements:
 *   - APIKEY / APISECRET env vars with margin-enabled Binance account
 *   - Sufficient USDT balance in cross-margin account
 *
 * Run:
 *   APIKEY=xxx APISECRET=xxx npx ts-mocha tests/margin-ws-api-live.test.ts --timeout 120000
 */

const APIKEY = '';
const APISECRET = '';

if (!APIKEY || !APISECRET) {
    console.error('APIKEY and APISECRET env vars are required');
    process.exit(1);
}

// Use a cheap pair to minimize balance requirements.
// XRPUSDT: ~$2.50, qty 5 => ~$10 notional at 80% price
const SYMBOL = process.env.SYMBOL || 'XRPUSDT';
const TIMEOUT = 90000;

const binance = new Binance().options({
    APIKEY,
    APISECRET,
    test: false,
    verbose: true,
});

const stopWsApiConnections = function () {
    const connections = (binance as any).wsApiConnections;
    for (const connectionId in connections) {
        console.log('Terminated WebSocket API connection:', connectionId);
        (binance as any).terminateWsApi(connectionId);
    }
};

describe('Margin WebSocket API – Live Order Test', function () {

    after(function () {
        stopWsApiConnections();
    });

    it('should receive executionReport events when placing and canceling a margin limit order', function (done) {
        this.timeout(TIMEOUT);

        const events: any[] = [];
        let orderId: number | string | null = null;
        let newReceived = false;
        let canceledReceived = false;
        let finished = false;

        const finish = (err?: Error) => {
            if (finished) return;
            finished = true;
            stopWsApiConnections();
            if (err) return done(err);
            done();
        };

        binance.websockets.userMarginData(
            // all_updates_callback
            (data: any) => {
                console.log('  [all_updates]', data.e, data.s || '');
            },
            // balance_callback
            (balance: any) => {
                console.log('  [balance]', balance.e, balance.a || '');
            },
            // execution_callback
            (execution: any) => {
                console.log('  [execution]', execution.e, execution.x, execution.X, execution.s);
                events.push(execution);

                assert(execution.e === 'executionReport', 'event type should be executionReport');
                assert(execution.s === SYMBOL, `symbol should be ${SYMBOL}`);
                assert(execution.S !== undefined, 'should have side (S)');
                assert(execution.o !== undefined, 'should have order type (o)');
                assert(execution.X !== undefined, 'should have order status (X)');
                assert(execution.x !== undefined, 'should have execution type (x)');

                // Step 3: We got the NEW event – now cancel the order
                if (execution.x === 'NEW' && execution.X === 'NEW' && !newReceived) {
                    newReceived = true;
                    console.log('Received NEW executionReport – canceling order...');

                    // Use orderId from the event if not yet set
                    const cancelId = orderId || execution.i;

                    binance.mgCancel(SYMBOL, cancelId).then((result: any) => {
                        console.log('Cancel result:', result.status || result);
                    }).catch((err: any) => {
                        console.error('Cancel error:', err.message);
                        finish(err);
                    });
                }

                // Step 4: We got the CANCELED event – assert and finish
                if (execution.x === 'CANCELED' && execution.X === 'CANCELED' && !canceledReceived) {
                    canceledReceived = true;
                    console.log('Received CANCELED executionReport');

                    assert(events.length >= 2, 'should have received at least 2 execution events');

                    const newEvent = events.find(e => e.x === 'NEW');
                    const cancelEvent = events.find(e => e.x === 'CANCELED');

                    assert(newEvent, 'should have a NEW execution event');
                    assert(cancelEvent, 'should have a CANCELED execution event');
                    assert(newEvent.o === 'LIMIT', 'NEW event order type should be LIMIT');
                    assert(cancelEvent.o === 'LIMIT', 'CANCELED event order type should be LIMIT');

                    console.log('All assertions passed!');
                    finish();
                }
            },
            // subscribed_callback
            async (endpoint: string) => {
                console.log('Subscribed to margin data stream:', endpoint);
                assert(endpoint !== null, 'endpoint should not be null');

                const subscriptionId = (binance as any).Options.marginDataSubscriptionId;
                assert(subscriptionId !== undefined, 'should have a subscription ID');
                console.log('Subscription ID:', subscriptionId);

                // Wait for WebSocket to stabilize
                await new Promise(resolve => setTimeout(resolve, 2000));

                try {
                    // Step 2: Fetch current price and place a limit buy well below market
                    const prices: any = await binance.prices(SYMBOL);
                    const currentPrice = parseFloat(prices[SYMBOL]);
                    // Set price 5% below market – passes PERCENT_PRICE_BY_SIDE but won't fill
                    const limitPrice = (currentPrice * 0.95).toFixed(4);

                    // Use whole-number quantity that meets minimum notional
                    const minNotional = 10;
                    const quantity = Math.ceil(minNotional / parseFloat(limitPrice));
                    const notional = quantity * parseFloat(limitPrice);

                    console.log(`Current ${SYMBOL} price: ${currentPrice}`);
                    console.log(`Placing margin LIMIT BUY: ${quantity} @ ${limitPrice} (notional: ${notional.toFixed(2)} USDT)`);

                    const orderResult = await binance.mgBuy(SYMBOL, quantity, parseFloat(limitPrice), {
                        sideEffectType: 'MARGIN_BUY'
                    });
                    console.log('Order placed:', orderResult.orderId, orderResult.status);

                    orderId = orderResult.orderId;

                    assert(orderResult.symbol === SYMBOL, 'order symbol should match');
                    assert(orderResult.side === 'BUY', 'order side should be BUY');
                    assert(orderResult.type === 'LIMIT', 'order type should be LIMIT');

                    console.log('Waiting for executionReport events via WebSocket...');
                } catch (err: any) {
                    console.error('Error placing order:', err.body || err.message);
                    finish(err);
                }
            },
            // list_status_callback
            (listStatus: any) => {
                console.log('  [listStatus]', listStatus);
            }
        );

        // Safety timeout – fail if we don't get all events in time
        setTimeout(() => {
            if (!finished) {
                console.error('Timeout reached. Events received:', events.length);
                events.forEach((e, i) => console.error(`  event[${i}]:`, e.x, e.X));

                // Best-effort cancel if order was placed but never canceled
                if (orderId && !canceledReceived) {
                    binance.mgCancel(SYMBOL, orderId).catch(() => {});
                }
                finish(new Error(`Timeout: newReceived=${newReceived}, canceledReceived=${canceledReceived}`));
            }
        }, TIMEOUT - 10000);
    });
});
