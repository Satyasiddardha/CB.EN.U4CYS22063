const express = require('express');
const axios = require('axios');
const server = express();
const serverPort = 3000;
require('dotenv').config();

const token = process.env.ACCESS_TOKEN;
const apiEndpoint = 'http://20.244.56.144/evaluation-service/stocks';

const httpClient = axios.create({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

server.get('/stocks', async (req, res) => {
    try {
        const response = await httpClient.get(apiEndpoint);
        res.json(response.data);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Error fetching stock list' });
    }
});

server.get('/stocks/:ticker', async (req, res) => {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    try {
        let url = `${apiEndpoint}/${ticker}`;
        if (minutes) {
            url += `?minutes=${minutes}`;
        }

        const response = await httpClient.get(url);
        const result = response.data;

        if (Array.isArray(result)) {
            if (aggregation === 'average') {
                const prices = result.map(item => item.price);
                const avg = prices.reduce((sum, price) => sum + price, 0) /prices.length;

                return res.json({
                    ticker,
                    aggregation: 'average',
                    minutes: parseInt(minutes),
                    averagePrice: avg
                });
            }

            return res.json({
                ticker,
                priceHistory: result
            });
        }

        return res.json({
            ticker,
            price: result.stock.price,
            lastUpdatedAt: result.stock.lastUpdatedAt
        });

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Error fetching stock data' });
    }
});

server.get('/stockcorrelation', async (req, res) => {
    const { minutes, ticker } = req.query;

    if (!ticker || !Array.isArray(ticker) || ticker.length !== 2) {
        return res.status(400).json({ error: "Provide exactly 2 tickers as query params like ?ticker=NVDA&ticker=PYPL" });
    }

    if (!minutes || isNaN(minutes)) {
        return res.status(400).json({ error: "Provide a valid 'minutes' parameter" });
    }

    const [firstTicker, secondTicker] = ticker;

    try {
        const [data1, data2] = await Promise.all([
            httpClient.get(`${apiEndpoint}/${firstTicker}?minutes=${minutes}`),
            httpClient.get(`${apiEndpoint}/${secondTicker}?minutes=${minutes}`)
        ]);

        console.log('Data for', firstTicker, ':', data1.data);
        console.log('Data for', secondTicker, ':', data2.data);

        const prices1 = data1.data.map(item => item.price);
        const prices2 = data2.data.map(item => item.price);

        if (prices1.length !== prices2.length) {
            const minLength = Math.min(prices1.length, prices2.length);
            prices1.splice(minLength);
            prices2.splice(minLength);
        }

        const mean1 = prices1.reduce((a, b) => a + b, 0) / prices1.length;
        const mean2 = prices2.reduce((a, b) => a + b, 0) / prices2.length;

        const covariance = prices1.reduce((acc, p, i) => acc + (p - mean1) * (prices2[i] - mean2), 0) / (prices1.length - 1);
        const stdDev1 = Math.sqrt(prices1.reduce((acc, p) => acc + (p - mean1) ** 2, 0) / (prices1.length - 1));
        const stdDev2 = Math.sqrt(prices2.reduce((acc, p) => acc + (p - mean2) ** 2, 0) / (prices2.length - 1));

        const correlation = covariance / (stdDev1 * stdDev2);

        return res.json({
            correlation: parseFloat(correlation.toFixed(4)),
            stocks: {
                [firstTicker]: {
                    averagePrice: mean1,
                    priceHistory: data1.data
                },
                [secondTicker]: {
                    averagePrice: mean2,
                    priceHistory: data2.data
                }
            }
        });

    } catch (err) {
        console.error('Correlation error:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else if (err.request) {
            console.error('Request Error:', err.request);
        } else {
            console.error('General Error:', err.message);
        }
        res.status(500).json({ error: "Error computing correlation" });
    }
});

server.listen(serverPort, () => {
    console.log(`Server running on http://localhost:${serverPort}`);
});