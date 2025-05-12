import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getAverageStockPrice } from '../services/api.js';
import { Select, MenuItem, FormControl, InputLabel } from '../styles/theme.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StockChart({ ticker, minutes, setMinutes }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAverageStockPrice(ticker, minutes);
        setData(result);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    }
    fetchData();
  }, [ticker, minutes]);

  if (!data) return <div>Loading...</div>;

  const chartData = {
    labels: data.priceHistory.map((p) => new Date(p.lastUpdatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: `${ticker} Price`,
        data: data.priceHistory.map((p) => p.price),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Average Price',
        data: data.priceHistory.map(() => data.averagePrice),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  return (
    <div>
      <FormControl>
        <InputLabel>Time Interval</InputLabel>
        <Select value={minutes} onChange={(e) => setMinutes(e.target.value)}>
          <MenuItem value={10}>10 Minutes</MenuItem>
          <MenuItem value={30}>30 Minutes</MenuItem>
          <MenuItem value={50}>50 Minutes</MenuItem>
        </Select>
      </FormControl>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
}

export default StockChart;