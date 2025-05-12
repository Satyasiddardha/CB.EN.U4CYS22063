const axios = require('axios');

const token = process.env.ACCESS_TOKEN;

const apiUrl = 'http://20.244.56.144/evaluation-service/stocks';

async function fetchStockList() {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.stocks;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching stock list');
    }
}

async function fetchStockPrice(ticker) {
    try {
        const response = await axios.get(`${apiUrl}/${ticker}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.stock;
    } catch (error) {
        throw new Error(`Error fetching stock price for ${ticker}:`, error.message);
    }
}

async function fetchStockHistory(ticker, minutes) {
    try {
        const response = await axios.get(`${apiUrl}/${ticker}?minutes=${minutes}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching stock price history for ${ticker}:`, error.message);
    }
}

module.exports = { fetchStockList, fetchStockPrice, fetchStockHistory };