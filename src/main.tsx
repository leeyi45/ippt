import range from 'lodash/range';
import { useState } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const MIN_RUN_MINUTES = 8;
const MAX_RUN_MINUTES = 17;

interface NumericalSelectorProps {
  onChange?: (newValue: number) => void;
  value: number;
  max: number;
  min?: number;
}

function NumericalSelector({ min, max, value, onChange }: NumericalSelectorProps) {
  function changeCount(newValue: number) {
    if (onChange) {
      onChange(newValue);
    }
  }

  const minVal = min ?? 0;

  return <Stack direction='row'>
    <Button
      onClick={() => changeCount(value + 1)}
      disabled={value === max}
    >
      + 1
    </Button>
    <Select
      value={value}
      onChange={event => {
        changeCount(event.target.value);
      }}
    >
      {range(minVal, max+1).map(i => <MenuItem value={i}>{i}</MenuItem>)}
    </Select>
    <Button
      onClick={() => changeCount(value - 1)}
      disabled={value === minVal}
    >
      - 1
    </Button>
  </Stack>;
}

export default function MainComponent() {
  const [age, setAge] = useState(18);
  const [pushups, setPushups] = useState(30);
  const [situps, setSitups] = useState(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [runMinutes, setRunMinutes] = useState(12);
  const [runSeconds, setRunSeconds] = useState(10);
  const [isEnhanced, setEnhanced] = useState(false);

  const genderSelector = <Paper>
    <Stack
      alignItems='center'
      direction='column'
      justifyContent='center'
    >
      Gender
      <Stack
        direction='row'
        alignItems='center'
      >
        Male
        <Switch
          checked={gender === 'female'}
          onChange={() => {
            if (gender === 'male') setGender('female');
            else setGender('male');
          }}
        />
        Female
      </Stack>
    </Stack>
  </Paper>;

  const enhancedSelector = <Badge
    badgeContent={
      <IconButton>
        <HelpOutlineIcon />
      </IconButton>
    }
  >
    <Paper>
      <Stack
        direction='column'
        alignItems='center'
      >
        Enhanced Mode
        <Switch
          checked={isEnhanced}
          onChange={() => setEnhanced(v => !v)}
        />
      </Stack>
    </Paper>
  </Badge>;

  const ageSelector = <Paper>
    <Stack
      direction='column'
      alignItems='center'
      justifyContent='center'
    >
      Age
      <NumericalSelector
        value={age}
        max={60}
        min={18}
        onChange={setAge}
      />
    </Stack>
  </Paper>;

  const runSelector = <Stack
    direction='row'
  >
    <Button
      onClick={() => {
        if (runSeconds === 50) {
          setRunSeconds(0);
          setRunMinutes(v => v + 1);
        } else {
          setRunSeconds(v => v + 10);
        }
      }}
      disabled={runMinutes===MAX_RUN_MINUTES && runSeconds === 50}
    >
      +10s
    </Button>
    <Select
      value={runMinutes}
      onChange={event => setRunMinutes(event.target.value)}
    >
      {range(MIN_RUN_MINUTES, MAX_RUN_MINUTES + 1).map(i => <MenuItem value={i}>{i} Mins</MenuItem>)}
    </Select>
    <Select
      value={runSeconds}
      onChange={event => setRunSeconds(event.target.value)}
    >
      {range(0, 60, 10).map(i => <MenuItem value={i}>{i} Seconds</MenuItem>)}
    </Select>
    <Button
      disabled={runMinutes === MIN_RUN_MINUTES && runSeconds === 0}
      onClick={() => {
        if (runSeconds === 0) {
          setRunMinutes(v => v - 1);
          setRunSeconds(50);
        } else {
          setRunSeconds(v => v - 10);
        }
      }}
    >
      -10s
    </Button>
  </Stack>;

  return <div>
    <Stack direction='column'>
      <Stack direction='row'>
        {ageSelector}
        {genderSelector}
        {enhancedSelector}
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Station</TableCell>
            <TableCell>You can do</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>To Next Point</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Push-Ups</TableCell>
            <TableCell>
              <NumericalSelector
                max={60}
                value={pushups}
                onChange={setPushups}
              />
            </TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sit-Ups</TableCell>
            <TableCell>
              <NumericalSelector
                max={60}
                value={situps}
                onChange={setSitups}
              />
            </TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2.4km Run</TableCell>
            <TableCell>{runSelector}</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  </div>;
}
