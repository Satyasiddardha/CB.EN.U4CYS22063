import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getAverageStockPrice = async (ticker, minutes) => {
  const response = await api.get(`/stocks/${ticker}?minutes=${minutes}&aggregation=average`);
  return response.data;
};

export const getCorrelation = async (ticker1, ticker2, minutes) => {
  const response = await api.get(`/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`);
  return response.data;
};

export const getAllStocks = async () => {
  const response = await api.get('/stocks');
  return response.data.stocks || ['NVDA', 'PYPL', 'AMD', 'GOOGL', 'AMZN', 'AAPL', 'MSFT', 'TSLA'];
};