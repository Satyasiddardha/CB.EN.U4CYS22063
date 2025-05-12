import { useState } from 'react';
import CorrelationHeatmap from '../components/CorrelationHeatmap.jsx';
import { Container, Typography } from '../styles/theme.css';

function CorrelationPage() {
  const [minutes, setMinutes] = useState(50);

return (
    <Container>
      <Typography variant="h5">Correlation Heatmap</Typography>
      <CorrelationHeatmap minutes={minutes} setMinutes={setMinutes} />
    </Container>
  );
}

export default CorrelationPage;