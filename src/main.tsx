import Typography from '@mui/material/Typography';
import CalculatorDisplay from './CalculatorDisplay.tsx';

export default function MainComponent() {
  return <div style={{
    height: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }}>
    <Typography
      component='h1'
      fontSize={40}
      color='white'
    >
      IPPT Calculator
    </Typography>
    <div style={{ padding: '20px' }}>
      <CalculatorDisplay />
    </div>
  </div>;
}
