import GitHubIcon from '@mui/icons-material/GitHub';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import packageJson from '../package.json' with { type: 'json' };
import CalculatorDisplay from './CalculatorDisplay.tsx';

export default function MainComponent() {
  return <>
    <head>
      <title>IPPT Calculator</title>
    </head>
    <div style={{
      height: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }}>
      <Typography
        variant='h1'
        sx={{ fontSize: 40 }}
        color='white'
      >
        IPPT Calculator
      </Typography>
      <div style={{ padding: '20px' }}>
        <Stack direction='column' spacing={1}>
          <CalculatorDisplay />
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Paper>
              <IconButton href={packageJson.repository.url} target='_blank'>
                <GitHubIcon />
              </IconButton>
            </Paper>
          </Stack>
        </Stack>
      </div>
    </div>
  </>;
}
