import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StockChart from '../components/StockChart.jsx';
import { Container, Typography } from '../styles/theme.css';

function StockPage() {
  const { ticker } = useParams();
  const [minutes, setMinutes] = useState(50);

  return (
    <Container>
      <Typography variant="h5">{ticker} Stock Prices</Typography>
      <StockChart ticker={ticker} minutes={minutes} setMinutes={setMinutes} />
    </Container>
  );
}

export default StockPage;