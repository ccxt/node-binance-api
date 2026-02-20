import Binance from '../src/node-binance-api';
import { assert } from 'chai';
import WebSocket from 'ws';

const WARN_SHOULD_BE_OBJ = 'should be an object';
const WARN_SHOULD_BE_NOT_NULL = 'should not be null';
const WARN_SHOULD_HAVE_KEY = 'should have key ';
const WARN_SHOULD_BE_TYPE = 'should be a ';
const TIMEOUT = 60000;

const binance = new Binance().options({
    APIKEY: 'X4BHNSimXOK6RKs2FcKqExquJtHjMxz5hWqF0BBeVnfa5bKFMk7X0wtkfEz0cPrJ',
    APISECRET: 'x8gLihunpNq0d46F2q0TWJmeCDahX5LMXSlv3lSFNbMI3rujSOpTDKdhbcmPSf2i',
    test: true,
    verbose: false,
    httpsProxy: 'http://188.245.226.105:8911'
});

const stopWsApiConnections = function (log = false) {
    const connections = (binance as any).wsApiConnections;
    for (let connectionId in connections) {
        if (log) console.log('Terminated WebSocket API connection: ' + connectionId);
        (binance as any).terminateWsApi(connectionId);
    }
}

describe('WebSocket API Infrastructure', function () {

    describe('generateRequestId', function () {
        it('should generate unique request IDs', function () {
            const id1 = (binance as any).generateRequestId();
            const id2 = (binance as any).generateRequestId();

            assert(typeof id1 === 'string', WARN_SHOULD_BE_TYPE + 'string');
            assert(typeof id2 === 'string', WARN_SHOULD_BE_TYPE + 'string');
            assert(id1 !== id2, 'IDs should be unique');
            assert(id1.length > 0, 'ID should not be empty');
        });
    });

    describe('getWsApiUrl', function () {
        it('should return testnet URL when test mode is enabled', function () {
            const url = (binance as any).getWsApiUrl();
            assert(typeof url === 'string', WARN_SHOULD_BE_TYPE + 'string');
            assert(url.includes('testnet'), 'should include testnet');
            assert(url.includes('ws-api'), 'should include ws-api');
            assert(url.includes('/ws-api/v3'), 'should include API version');
        });

        it('should return production URL when test mode is disabled', function () {
            const prodBinance = new Binance().options({
                APIKEY: 'test',
                APISECRET: 'test',
                test: false
            });
            const url = (prodBinance as any).getWsApiUrl();
            assert(typeof url === 'string', WARN_SHOULD_BE_TYPE + 'string');
            assert(!url.includes('testnet'), 'should not include testnet');
            assert(url.includes('ws-api.binance.com'), 'should be production URL');
        });
    });

    describe('connectWsApi', function () {
        it('should create WebSocket API connection', function (done) {
            this.timeout(TIMEOUT);

            const connectionId = 'test-connection';
            const ws = (binance as any).connectWsApi(connectionId, (data: any) => {
                // Message handler
            }, () => {
                // Reconnect handler
            });

            ws.on('open', () => {
                assert(ws !== null, WARN_SHOULD_BE_NOT_NULL);
                assert(ws.readyState === WebSocket.OPEN, 'WebSocket should be open');
                assert((ws as any).connectionId === connectionId, 'Connection ID should match');

                stopWsApiConnections(true);
                done();
            });

            ws.on('error', (error: Error) => {
                stopWsApiConnections();
                done(error);
            });
        });
    });
});

describe('User Data Handler - Event Format Support', function () {

    describe('userDataHandler - Old Event Format', function () {
        it('should handle old format outboundAccountPosition event', function () {
            let capturedEvent: any = null;

            (binance as any).Options.all_updates_callback = (data: any) => {
                capturedEvent = data;
            };

            const oldFormatEvent = {
                e: 'outboundAccountPosition',
                E: 1564034571105,
                u: 1564034571073,
                B: [
                    { a: 'ETH', f: '10000.000000', l: '0.000000' }
                ]
            };

            (binance as any).userDataHandler(oldFormatEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'outboundAccountPosition', 'Event type should match');
            assert(capturedEvent.E === 1564034571105, 'Event time should match');
            assert(Array.isArray(capturedEvent.B), 'Balances should be an array');
        });

        it('should handle old format executionReport event', function () {
            let capturedEvent: any = null;

            (binance as any).Options.execution_callback = (data: any) => {
                capturedEvent = data;
            };

            const oldFormatEvent = {
                e: 'executionReport',
                E: 1499405658658,
                s: 'ETHBTC',
                c: 'mUvoqJxFIILMdfAW5iGSOW',
                S: 'BUY',
                o: 'LIMIT',
                x: 'NEW',
                X: 'NEW'
            };

            (binance as any).userDataHandler(oldFormatEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'executionReport', 'Event type should match');
            assert(capturedEvent.s === 'ETHBTC', 'Symbol should match');
        });
    });

    describe('userDataHandler - New Event Format', function () {
        it('should handle new format outboundAccountPosition event', function () {
            let capturedEvent: any = null;

            (binance as any).Options.all_updates_callback = (data: any) => {
                capturedEvent = data;
            };

            const newFormatEvent = {
                subscriptionId: 0,
                event: {
                    e: 'outboundAccountPosition',
                    E: 1564034571105,
                    u: 1564034571073,
                    B: [
                        { a: 'ETH', f: '10000.000000', l: '0.000000' }
                    ]
                }
            };

            (binance as any).userDataHandler(newFormatEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'outboundAccountPosition', 'Event type should match');
            assert(capturedEvent.E === 1564034571105, 'Event time should match');
            assert(Array.isArray(capturedEvent.B), 'Balances should be an array');
        });

        it('should handle new format executionReport event', function () {
            let capturedEvent: any = null;

            (binance as any).Options.execution_callback = (data: any) => {
                capturedEvent = data;
            };

            const newFormatEvent = {
                subscriptionId: 1,
                event: {
                    e: 'executionReport',
                    E: 1499405658658,
                    s: 'ETHBTC',
                    c: 'mUvoqJxFIILMdfAW5iGSOW',
                    S: 'BUY',
                    o: 'LIMIT',
                    x: 'NEW',
                    X: 'NEW'
                }
            };

            (binance as any).userDataHandler(newFormatEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'executionReport', 'Event type should match');
            assert(capturedEvent.s === 'ETHBTC', 'Symbol should match');
        });

        it('should handle eventStreamTerminated event', function () {
            let capturedEvent: any = null;
            let loggedMessage = '';

            (binance as any).Options.all_updates_callback = (data: any) => {
                capturedEvent = data;
            };

            const originalLog = (binance as any).Options.log;
            (binance as any).Options.log = (msg: string) => {
                loggedMessage = msg;
            };

            const terminatedEvent = {
                subscriptionId: 0,
                event: {
                    e: 'eventStreamTerminated',
                    E: 1728973001334
                }
            };

            (binance as any).userDataHandler(terminatedEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'eventStreamTerminated', 'Event type should match');
            assert(loggedMessage.includes('terminated'), 'Should log termination');

            (binance as any).Options.log = originalLog;
        });

        it('should handle externalLockUpdate event', function () {
            let capturedEvent: any = null;

            (binance as any).Options.balance_callback = (data: any) => {
                capturedEvent = data;
            };

            const lockUpdateEvent = {
                subscriptionId: 0,
                event: {
                    e: 'externalLockUpdate',
                    E: 1581557507324,
                    a: 'NEO',
                    d: '10.00000000',
                    T: 1581557507268
                }
            };

            (binance as any).userDataHandler(lockUpdateEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'externalLockUpdate', 'Event type should match');
            assert(capturedEvent.a === 'NEO', 'Asset should match');
            assert(capturedEvent.d === '10.00000000', 'Delta should match');
        });

        it('should handle balanceUpdate event', function () {
            let capturedEvent: any = null;

            (binance as any).Options.balance_callback = (data: any) => {
                capturedEvent = data;
            };

            const balanceUpdateEvent = {
                subscriptionId: 0,
                event: {
                    e: 'balanceUpdate',
                    E: 1573200697110,
                    a: 'BTC',
                    d: '100.00000000',
                    T: 1573200697068
                }
            };

            (binance as any).userDataHandler(balanceUpdateEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'balanceUpdate', 'Event type should match');
            assert(capturedEvent.a === 'BTC', 'Asset should match');
        });

        it('should handle listStatus event', function () {
            let capturedEvent: any = null;

            (binance as any).Options.list_status_callback = (data: any) => {
                capturedEvent = data;
            };

            const listStatusEvent = {
                subscriptionId: 0,
                event: {
                    e: 'listStatus',
                    E: 1564035303637,
                    s: 'ETHBTC',
                    g: 2,
                    c: 'OCO',
                    l: 'EXEC_STARTED',
                    L: 'EXECUTING'
                }
            };

            (binance as any).userDataHandler(listStatusEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'listStatus', 'Event type should match');
            assert(capturedEvent.s === 'ETHBTC', 'Symbol should match');
        });
    });
});

/* Skip margin in CI as does not support testnet
describe('Margin Data Handler - Event Format Support', function () {

    describe('userMarginDataHandler - Old Event Format', function () {
        it('should handle old format margin events', function () {
            let capturedEvent: any = null;

            (binance as any).Options.margin_all_updates_callback = (data: any) => {
                capturedEvent = data;
            };

            const oldFormatEvent = {
                e: 'outboundAccountPosition',
                E: 1564034571105,
                u: 1564034571073,
                B: [
                    { a: 'BTC', f: '1.00000000', l: '0.50000000' }
                ]
            };

            (binance as any).userMarginDataHandler(oldFormatEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'outboundAccountPosition', 'Event type should match');
        });
    });

    describe('userMarginDataHandler - New Event Format', function () {
        it('should handle new format margin events', function () {
            let capturedEvent: any = null;

            (binance as any).Options.margin_all_updates_callback = (data: any) => {
                capturedEvent = data;
            };

            const newFormatEvent = {
                subscriptionId: 1,
                event: {
                    e: 'outboundAccountPosition',
                    E: 1564034571105,
                    u: 1564034571073,
                    B: [
                        { a: 'BTC', f: '1.00000000', l: '0.50000000' }
                    ]
                }
            };

            (binance as any).userMarginDataHandler(newFormatEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'outboundAccountPosition', 'Event type should match');
        });

        it('should handle margin eventStreamTerminated', function () {
            let capturedEvent: any = null;
            let loggedMessage = '';

            (binance as any).Options.margin_all_updates_callback = (data: any) => {
                capturedEvent = data;
            };

            const originalLog = (binance as any).Options.log;
            (binance as any).Options.log = (msg: string) => {
                loggedMessage = msg;
            };

            const terminatedEvent = {
                subscriptionId: 1,
                event: {
                    e: 'eventStreamTerminated',
                    E: 1728973001334
                }
            };

            (binance as any).userMarginDataHandler(terminatedEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'eventStreamTerminated', 'Event type should match');
            assert(loggedMessage.includes('Margin'), 'Should log margin termination');

            (binance as any).Options.log = originalLog;
        });

        it('should handle margin executionReport', function () {
            let capturedEvent: any = null;

            (binance as any).Options.margin_execution_callback = (data: any) => {
                capturedEvent = data;
            };

            const executionEvent = {
                subscriptionId: 1,
                event: {
                    e: 'executionReport',
                    E: 1499405658658,
                    s: 'BTCUSDT',
                    c: 'marginOrder123',
                    S: 'SELL',
                    o: 'MARKET',
                    x: 'TRADE',
                    X: 'FILLED'
                }
            };

            (binance as any).userMarginDataHandler(executionEvent);

            assert(capturedEvent !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(capturedEvent.e === 'executionReport', 'Event type should match');
            assert(capturedEvent.s === 'BTCUSDT', 'Symbol should match');
        });
    });
});
*/

describe('WebSocket API JSON-RPC', function () {

    describe('sendWsApiRequest', function () {
        it('should reject when connection is not open', async function () {
            try {
                await (binance as any).sendWsApiRequest('non-existent', 'test.method', {});
                assert.fail('Should have thrown an error');
            } catch (error: any) {
                assert(error.message.includes('not open'), 'Should indicate connection is not open');
            }
        });

        it('should timeout after 30 seconds', async function () {
            this.timeout(35000);

            const connectionId = 'timeout-test';
            const ws = (binance as any).connectWsApi(connectionId, () => {}, () => {});

            await new Promise((resolve) => {
                ws.on('open', resolve);
            });

            // Override send to prevent actual sending
            const originalSend = ws.send;
            ws.send = (data: any, callback: any) => {
                if (callback) callback(); // Call callback without error
            };

            try {
                await (binance as any).sendWsApiRequest(connectionId, 'test.method', {});
                assert.fail('Should have timed out');
            } catch (error: any) {
                assert(error.message.includes('timeout'), 'Should indicate timeout');
            } finally {
                ws.send = originalSend;
                stopWsApiConnections();
            }
        }).timeout(35000);
    });
});

describe('WebSocket API Live Tests', function () {

    describe('userData WebSocket API Connection', function () {
        it('should connect and subscribe to user data stream', function (done) {
            this.timeout(TIMEOUT);

            let subscriptionReceived = false;

            binance.websockets.userData(
                (data) => {
                    // All updates callback
                    console.log('User data event:', data);
                },
                (balance) => {
                    // Balance callback
                    console.log('Balance update:', balance);
                },
                (execution) => {
                    // Execution callback
                    console.log('Execution report:', execution);
                },
                (endpoint) => {
                    // Subscribed callback
                    console.log('Subscribed to:', endpoint);
                    subscriptionReceived = true;

                    assert(endpoint !== null, WARN_SHOULD_BE_NOT_NULL);
                    assert(typeof endpoint === 'string', WARN_SHOULD_BE_TYPE + 'string');

                    // Wait a bit then cleanup
                    setTimeout(() => {
                        stopWsApiConnections(true);
                        done();
                    }, 5000);
                },
                (listStatus) => {
                    // List status callback
                    console.log('List status:', listStatus);
                }
            );
        });

        it('should receive execution and balance events when creating a market order', function (done) {
            this.timeout(TIMEOUT);

            let executionReceived = false;
            let balanceReceived = false;
            let subscriptionReady = false;
            let finished = false;

            const finish = (err?: Error) => {
                if (finished) return;
                finished = true;
                stopWsApiConnections(true);
                if (err) return done(err);
                done();
            };

            const checkCompletion = () => {
                if (executionReceived && balanceReceived && subscriptionReady) {
                    console.log('Both execution and balance events received!');
                    setTimeout(() => finish(), 2000);
                }
            };

            binance.websockets.userData(
                (data) => {
                    // All updates callback
                    console.log('Event received:', data.e, data);
                    checkCompletion();
                },
                (balance) => {
                    // Balance callback
                    console.log('Balance update received:', balance);
                    balanceReceived = true;

                    assert(balance !== null, WARN_SHOULD_BE_NOT_NULL);
                    assert(typeof balance === 'object', WARN_SHOULD_BE_OBJ);

                    // Verify it's a balance-related event
                    const eventType = balance.e;
                    assert(
                        eventType === 'balanceUpdate' || eventType === 'outboundAccountPosition',
                        'Should be a balance event type'
                    );

                    if (eventType === 'balanceUpdate') {
                        assert(Object.prototype.hasOwnProperty.call(balance, 'a'), 'Should have asset');
                        assert(Object.prototype.hasOwnProperty.call(balance, 'd'), 'Should have delta');
                    } else if (eventType === 'outboundAccountPosition') {
                        assert(Object.prototype.hasOwnProperty.call(balance, 'B'), 'Should have balances array');
                        assert(Array.isArray(balance.B), 'Balances should be an array');
                    }

                    checkCompletion();
                },
                (execution) => {
                    // Execution callback
                    console.log('Execution report received:', execution);
                    executionReceived = true;

                    assert(execution !== null, WARN_SHOULD_BE_NOT_NULL);
                    assert(typeof execution === 'object', WARN_SHOULD_BE_OBJ);
                    assert(execution.e === 'executionReport', 'Should be execution report');

                    // Verify execution report structure
                    assert(Object.prototype.hasOwnProperty.call(execution, 's'), WARN_SHOULD_HAVE_KEY + 'symbol');
                    assert(Object.prototype.hasOwnProperty.call(execution, 'S'), WARN_SHOULD_HAVE_KEY + 'side');
                    assert(Object.prototype.hasOwnProperty.call(execution, 'o'), WARN_SHOULD_HAVE_KEY + 'order type');
                    assert(Object.prototype.hasOwnProperty.call(execution, 'X'), WARN_SHOULD_HAVE_KEY + 'order status');
                    assert(Object.prototype.hasOwnProperty.call(execution, 'x'), WARN_SHOULD_HAVE_KEY + 'execution type');

                    console.log(`  Symbol: ${execution.s}`);
                    console.log(`  Side: ${execution.S}`);
                    console.log(`  Order Type: ${execution.o}`);
                    console.log(`  Execution Type: ${execution.x}`);
                    console.log(`  Order Status: ${execution.X}`);

                    checkCompletion();
                },
                async (endpoint) => {
                    // Subscribed callback
                    console.log('Connected to user data stream:', endpoint);
                    subscriptionReady = true;

                    assert(endpoint !== null, WARN_SHOULD_BE_NOT_NULL);

                    // Wait a moment for WebSocket to be fully ready
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    try {
                        // Create a small market buy order for BNBUSDT (typically has low price)
                        console.log('Creating test market order...');

                        const orderResult = await binance.marketBuy('BNBUSDT', 0.01);

                        console.log('Order created:', orderResult);
                        assert(orderResult !== null, 'Order should be created');
                        assert(orderResult.symbol === 'BNBUSDT', 'Order symbol should match');
                        assert(orderResult.side === 'BUY', 'Order side should be BUY');
                        assert(orderResult.type === 'MARKET', 'Order type should be MARKET');

                        // Events should be received automatically through WebSocket
                        // If events are not received within timeout, test will fail
                        console.log('Waiting for execution and balance events...');

                        // Set a backup timeout in case events are not received
                        setTimeout(() => {
                            if (!executionReceived || !balanceReceived) {
                                console.error('Timeout: Not all events received');
                                console.error(`  Execution received: ${executionReceived}`);
                                console.error(`  Balance received: ${balanceReceived}`);
                                finish(new Error('Did not receive all expected events within timeout'));
                            }
                        }, 25000); // 25 second timeout

                    } catch (error: any) {
                        console.error('Error creating order:', error.message);
                        finish(error);
                    }
                },
                (listStatus) => {
                    // List status callback
                    console.log('List status:', listStatus);
                }
            );
        });
    });

    /* Skip margin in CI as does not support testnet
    describe('userMarginData WebSocket API Connection', function () {
        it('should connect and subscribe to margin data stream', function (done) {
            this.timeout(TIMEOUT);

            binance.websockets.userMarginData(
                (data) => {
                    // All updates callback
                    console.log('Margin data event:', data);
                },
                (balance) => {
                    // Balance callback
                    console.log('Margin balance update:', balance);
                },
                (execution) => {
                    // Execution callback
                    console.log('Margin execution report:', execution);
                },
                (endpoint) => {
                    // Subscribed callback
                    console.log('Subscribed to margin stream:', endpoint);

                    assert(endpoint !== null, WARN_SHOULD_BE_NOT_NULL);
                    assert(typeof endpoint === 'string', WARN_SHOULD_BE_TYPE + 'string');

                    // Verify subscription tracking
                    const subscriptionId = (binance as any).Options.marginDataSubscriptionId;
                    assert(subscriptionId !== undefined, 'Should have subscription ID');

                    // Wait a bit then cleanup
                    setTimeout(() => {
                        stopWsApiConnections(true);
                        done();
                    }, 5000);
                },
                (listStatus) => {
                    // List status callback
                    console.log('Margin list status:', listStatus);
                }
            );
        });
    });
    */
});
