import { useState, useEffect } from 'react';
import { getCorrelation, getAllStocks } from '../services/api.js';
import { Select, MenuItem, FormControl, InputLabel, Box, Typography } from '../styles/theme.css';

function CorrelationHeatmap({ minutes, setMinutes }) {
  const [heatmapData, setHeatmapData] = useState([]);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const stockList = await getAllStocks();
        setStocks(stockList);

        const data = [];
        for (let i = 0; i < stockList.length; i++) {
          for (let j = i + 1; j < stockList.length; j++) {
            const result = await getCorrelation(stockList[i], stockList[j], minutes);
            data.push({
              ticker1: stockList[i],
              ticker2: stockList[j],
              correlation: result.correlation,
              average1: result.stocks[stockList[i]].averagePrice,
              average2: result.stocks[stockList[j]].averagePrice,
            });
          }
        }
        setHeatmapData(data);
      } catch (error) {
        console.error('Error fetching correlation data:', error);
      }
    }
    fetchData();
  }, [minutes]);

  const getColor = (correlation) => {
    const intensity = Math.abs(correlation);
    return correlation > 0
      ? `rgba(0, 128, 0, ${intensity})`
      : `rgba(255, 0, 0, ${intensity})`;
  };

  return (
    <Box>
      <FormControl>
        <InputLabel>Time Interval</InputLabel>
        <Select value={minutes} onChange={(e) => setMinutes(e.target.value)}>
          <MenuItem value={10}>10 Minutes</MenuItem>
          <MenuItem value={30}>30 Minutes</MenuItem>
          <MenuItem value={50}>50 Minutes</MenuItem>
        </Select>
      </FormControl>
      <Box display="grid" gridTemplateColumns={`repeat(${stocks.length + 1}, 50px)`} gap="1px">
        <Box />
        {stocks.map((stock) => (
          <Typography key={stock} textAlign="center">{stock}</Typography>
        ))}
        {stocks.map((stock1) => (
          <Box key={stock1} display="contents">
            <Typography textAlign="center" alignSelf="center">{stock1}</Typography>
            {stocks.map((stock2) => {
              const data = heatmapData.find(
                (d) => (d.ticker1 === stock1 && d.ticker2 === stock2) || (d.ticker1 === stock2 && d.ticker2 === stock1)
              );
              const correlation = data?.correlation || 0;
              return (
                <Box
                  key={stock2}
                  width="50px"
                  height="50px"
                  backgroundColor={getColor(correlation)}
                  border="1px solid #ccc"
                  title={data ? `Correlation: ${correlation.toFixed(4)}` : ''}
                />
              );
            })}
          </Box>
        ))}
      </Box>
      <Typography mt={2}>Legend: Red (Negative) to Green (Positive)</Typography>
    </Box>
  );
}

export default CorrelationHeatmap;