import { Routes, Route, Link } from 'react-router-dom';
import StockPage from './StockPage.jsx';
import CorrelationPage from './CorrelationPage.jsx';
import { Container, Button, Typography } from './styles/theme.css';

function App() {
  return (
    <Container>
      <Typography variant="h4">Stock Price Aggregation Dashboard</Typography>
      <nav>
        <Button as={Link} to="/stock/NVDA">View Stock Page</Button>
        <Button as={Link} to="/correlation">View Correlation Heatmap</Button>
      </nav>
      <Routes>
        <Route path="/stock/:ticker" element={<StockPage />} />
        <Route path="/correlation" element={<CorrelationPage />} />
        <Route path="/" element={<Typography>Welcome to the Dashboard</Typography>} />
      </Routes>
    </Container>
  );
}

export default App;