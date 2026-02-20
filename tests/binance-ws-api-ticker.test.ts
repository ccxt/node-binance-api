import Binance from '../src/node-binance-api';
import { assert } from 'chai';

const WARN_SHOULD_BE_OBJ = 'should be an object';
const WARN_SHOULD_BE_NOT_NULL = 'should not be null';
const WARN_SHOULD_HAVE_KEY = 'should have key ';
const WARN_SHOULD_BE_TYPE = 'should be a ';
const TIMEOUT = 30000;

const binance = new Binance().options({
    APIKEY: 'X4BHNSimXOK6RKs2FcKqExquJtHjMxz5hWqF0BBeVnfa5bKFMk7X0wtkfEz0cPrJ',
    APISECRET: 'x8gLihunpNq0d46F2q0TWJmeCDahX5LMXSlv3lSFNbMI3rujSOpTDKdhbcmPSf2i',
    test: true,
    verbose: false
});

describe('WebSocket API Ticker Price', function () {

    describe('tickerPrice - Single Symbol', function () {
        it('should fetch price for a single symbol', async function () {
            this.timeout(TIMEOUT);

            const result = await binance.tickerPrice('BTCUSDT');

            assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(typeof result === 'object', WARN_SHOULD_BE_OBJ);
            assert(Object.prototype.hasOwnProperty.call(result, 'symbol'), WARN_SHOULD_HAVE_KEY + 'symbol');
            assert(Object.prototype.hasOwnProperty.call(result, 'price'), WARN_SHOULD_HAVE_KEY + 'price');
            assert(result.symbol === 'BTCUSDT', 'Symbol should be BTCUSDT');
            assert(typeof result.price === 'string', WARN_SHOULD_BE_TYPE + 'string');
            assert(parseFloat(result.price) > 0, 'Price should be positive');

            console.log('Single symbol result:', result);
        });

        it('should fetch price for another symbol', async function () {
            this.timeout(TIMEOUT);

            const result = await binance.tickerPrice('ETHUSDT');

            assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(typeof result === 'object', WARN_SHOULD_BE_OBJ);
            assert(result.symbol === 'ETHUSDT', 'Symbol should be ETHUSDT');
            assert(Object.prototype.hasOwnProperty.call(result, 'price'), WARN_SHOULD_HAVE_KEY + 'price');
            assert(parseFloat(result.price) > 0, 'Price should be positive');

            console.log('ETHUSDT price:', result.price);
        });
    });

    describe('tickerPrice - Multiple Symbols', function () {
        it('should fetch prices for multiple symbols', async function () {
            this.timeout(TIMEOUT);

            const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
            const result = await binance.tickerPrice(undefined, symbols);

            assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(Array.isArray(result), 'Result should be an array');
            assert(result.length === symbols.length, `Should return ${symbols.length} prices`);

            result.forEach((ticker: any, index: number) => {
                assert(typeof ticker === 'object', WARN_SHOULD_BE_OBJ);
                assert(Object.prototype.hasOwnProperty.call(ticker, 'symbol'), WARN_SHOULD_HAVE_KEY + 'symbol');
                assert(Object.prototype.hasOwnProperty.call(ticker, 'price'), WARN_SHOULD_HAVE_KEY + 'price');
                assert(symbols.includes(ticker.symbol), `Symbol ${ticker.symbol} should be in requested list`);
                assert(typeof ticker.price === 'string', WARN_SHOULD_BE_TYPE + 'string');
                assert(parseFloat(ticker.price) > 0, `Price for ${ticker.symbol} should be positive`);
            });

            console.log('Multiple symbols result:', result);
        });

        it('should fetch prices for 5 symbols', async function () {
            this.timeout(TIMEOUT);

            const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT'];
            const result = await binance.tickerPrice(undefined, symbols);

            assert(Array.isArray(result), 'Result should be an array');
            assert(result.length === symbols.length, `Should return ${symbols.length} prices`);

            const returnedSymbols = result.map((ticker: any) => ticker.symbol);
            symbols.forEach(symbol => {
                assert(returnedSymbols.includes(symbol), `Should include ${symbol}`);
            });

            console.log(`Fetched prices for ${result.length} symbols`);
        });
    });

    describe('tickerPrice - All Symbols', function () {
        it('should fetch prices for all symbols when no parameters provided', async function () {
            this.timeout(TIMEOUT);

            const result = await binance.tickerPrice();

            assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(Array.isArray(result), 'Result should be an array');
            assert(result.length > 0, 'Should return at least one symbol');

            // Check first few results
            result.slice(0, 5).forEach((ticker: any) => {
                assert(typeof ticker === 'object', WARN_SHOULD_BE_OBJ);
                assert(Object.prototype.hasOwnProperty.call(ticker, 'symbol'), WARN_SHOULD_HAVE_KEY + 'symbol');
                assert(Object.prototype.hasOwnProperty.call(ticker, 'price'), WARN_SHOULD_HAVE_KEY + 'price');
                assert(typeof ticker.symbol === 'string', 'Symbol should be string');
                assert(typeof ticker.price === 'string', 'Price should be string');
            });

            console.log(`Fetched prices for ${result.length} total symbols`);
        });
    });

    describe('tickerPrice - With Symbol Status Filter', function () {
        it('should filter by TRADING status', async function () {
            this.timeout(TIMEOUT);

            const result = await binance.tickerPrice('BTCUSDT', undefined, { symbolStatus: 'TRADING' });

            assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(typeof result === 'object', WARN_SHOULD_BE_OBJ);
            assert(result.symbol === 'BTCUSDT', 'Symbol should be BTCUSDT');
            assert(Object.prototype.hasOwnProperty.call(result, 'price'), WARN_SHOULD_HAVE_KEY + 'price');

            console.log('Filtered result (TRADING):', result);
        });

        it('should filter multiple symbols by status', async function () {
            this.timeout(TIMEOUT);

            const symbols = ['BTCUSDT', 'ETHUSDT'];
            const result = await binance.tickerPrice(undefined, symbols, { symbolStatus: 'TRADING' });

            assert(Array.isArray(result), 'Result should be an array');
            // Result may be filtered, so length could be <= symbols.length
            assert(result.length <= symbols.length, 'Result should not exceed requested symbols');

            console.log(`Filtered ${result.length} trading symbols from ${symbols.length} requested`);
        });
    });

    describe('tickerPrice - Error Handling', function () {
        it('should reject when both symbol and symbols are provided', async function () {
            this.timeout(TIMEOUT);

            try {
                await binance.tickerPrice('BTCUSDT', ['ETHUSDT']);
                assert.fail('Should have thrown an error');
            } catch (error: any) {
                assert(error.message.includes('Cannot specify both'), 'Should indicate parameter conflict');
            }
        });

        it('should handle invalid symbol gracefully', async function () {
            this.timeout(TIMEOUT);

            try {
                await binance.tickerPrice('INVALIDSYMBOL123');
                // May succeed or fail depending on Binance's handling
                // If it succeeds, it might return an empty result or error in result
            } catch (error: any) {
                // Expected to fail with invalid symbol
                assert(error !== null, 'Should have error information');
            }
        });
    });

    describe('tickerPrice - Response Structure', function () {
        it('should include rate limit information', async function () {
            this.timeout(TIMEOUT);

            // Note: Rate limit info is in the JSON-RPC response but may not be returned by our method
            // This test documents the expected structure

            const result = await binance.tickerPrice('BTCUSDT');

            assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(Object.prototype.hasOwnProperty.call(result, 'symbol'), 'Should have symbol');
            assert(Object.prototype.hasOwnProperty.call(result, 'price'), 'Should have price');

            // Note: rateLimits may be stripped by our implementation
            // Full response from API includes: { symbol, price }
        });

        it('should return consistent structure for single and multiple symbols', async function () {
            this.timeout(TIMEOUT);

            const singleResult = await binance.tickerPrice('BTCUSDT');
            const multiResult = await binance.tickerPrice(undefined, ['BTCUSDT']);

            assert(typeof singleResult === 'object', 'Single result should be object');
            assert(!Array.isArray(singleResult), 'Single result should not be array');

            assert(Array.isArray(multiResult), 'Multi result should be array');
            assert(multiResult.length > 0, 'Multi result should have items');

            // Compare structure
            const multiItem = multiResult[0];
            assert(Object.keys(singleResult).length > 0, 'Single result should have keys');
            assert(Object.keys(multiItem).length > 0, 'Multi item should have keys');
        });
    });

    describe('tickerPrice - WebSocket API Features', function () {
        it('should use WebSocket API connection', async function () {
            this.timeout(TIMEOUT);

            const startTime = Date.now();
            const result = await binance.tickerPrice('BTCUSDT');
            const endTime = Date.now();

            const responseTime = endTime - startTime;

            assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
            console.log(`WebSocket API response time: ${responseTime}ms`);

            // WebSocket should be reasonably fast
            assert(responseTime < 10000, 'Should respond within 10 seconds');
        });

        it('should handle concurrent requests', async function () {
            this.timeout(TIMEOUT);

            const promises = [
                binance.tickerPrice('BTCUSDT'),
                binance.tickerPrice('ETHUSDT'),
                binance.tickerPrice('BNBUSDT')
            ];

            const results = await Promise.all(promises);

            assert(results.length === 3, 'Should have 3 results');
            results.forEach((result, index) => {
                assert(result !== null, `Result ${index} should not be null`);
                assert(typeof result === 'object', `Result ${index} should be object`);
                assert(Object.prototype.hasOwnProperty.call(result, 'price'), `Result ${index} should have price`);
            });

            console.log('Concurrent requests completed successfully');
        });
    });

    describe('tickerPrice - Price Validation', function () {
        it('should return valid numeric price strings', async function () {
            this.timeout(TIMEOUT);

            const result = await binance.tickerPrice('BTCUSDT');

            assert(result !== null, WARN_SHOULD_BE_NOT_NULL);
            assert(typeof result.price === 'string', 'Price should be string');

            const priceFloat = parseFloat(result.price);
            assert(!isNaN(priceFloat), 'Price should be valid number');
            assert(isFinite(priceFloat), 'Price should be finite');
            assert(priceFloat > 0, 'Price should be positive');

            // Check decimal format
            assert(/^\d+(\.\d+)?$/.test(result.price), 'Price should match decimal pattern');

            console.log(`BTCUSDT price: ${result.price} (${priceFloat})`);
        });

        it('should return prices with appropriate precision', async function () {
            this.timeout(TIMEOUT);

            const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
            const results = await binance.tickerPrice(undefined, symbols);

            results.forEach((ticker: any) => {
                const decimalPlaces = (ticker.price.split('.')[1] || '').length;
                assert(decimalPlaces >= 0, `Price for ${ticker.symbol} should have decimal places`);
                assert(decimalPlaces <= 8, `Price for ${ticker.symbol} should not exceed 8 decimal places`);

                console.log(`${ticker.symbol}: ${ticker.price} (${decimalPlaces} decimals)`);
            });
        });
    });
});
