import range from 'lodash/range';
import { useRef, useState } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { passTypeToReward, passTypeToString, pointsToNextTier, pointsToPassType } from './passType';
import * as points from './points';

interface IncentiveDisplayProps {
  points: number;
}

function IncentiveDisplay({ points }: IncentiveDisplayProps) {
  const type = pointsToPassType(points);
  const [extra, nextTier] = pointsToNextTier(points);

  return <Paper>
    <div style={{ padding: '10px' }}>
      <Typography>{passTypeToString(type)}</Typography>
      <Typography>
        Reward: ${passTypeToReward(type)}
      </Typography>
      <Typography>
        {nextTier !== undefined && <p>{extra} points to {passTypeToString(nextTier)}</p>}
      </Typography>
    </div>
  </Paper>;
}

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

interface EnhancedSelectorProps {
  onChange: (newValue: boolean) => void;
  value?: boolean;
}

function EnhancedSelector({ value, onChange }: EnhancedSelectorProps) {
  const [hover, setHover] = useState(false);
  const [popover, setPopover] = useState<null | HTMLElement>(null);
  const divRef = useRef(null);

  const mainComponent = <>
    <Popover
      open={popover !== null}
      anchorEl={popover}
      onClose={() => {
        setHover(false);
        setPopover(null);
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
    >
      <div style={{ padding: '10px' }}>
        Test
      </div>
    </Popover>
    <Paper
      ref={divRef}
    >
      <div style={{ padding: '5px' }}>
        <Stack
          direction='column'
          alignItems='center'
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Typography component='h3'>
            Enhanced Mode
          </Typography>
          <Switch
            checked={value}
            onChange={() => onChange(!value)}
          />
        </Stack>
      </div>
    </Paper>
  </>;

  if (hover) {
    return <Badge
      badgeContent={
        <Fade in={hover} >
          <IconButton
            onClick={() => {
              setPopover(divRef.current);
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Fade>
      }
    >
      {mainComponent}
    </Badge>;
  }

  return mainComponent;
}

export default function MainComponent() {
  const [age, setAge] = useState(18);
  const ageGroup = points.getAgeGroup(age);

  const [isEnhanced, setEnhanced] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const pushupsTable = gender === 'male' ? points.pushupsMale : points.pushupsFemale;
  const situpsTable = gender === 'male' ? points.situpsMale : points.situpsFemale;

  const [pushups, setPushups] = useState(30);
  const pushupScore = points.getScore(pushupsTable, ageGroup, pushups);

  const [situps, setSitups] = useState(30);
  const situpScore = points.getScore(situpsTable, ageGroup, situps);

  const [runMinutes, setRunMinutes] = useState(12);
  const [runSeconds, setRunSeconds] = useState(10);
  const runScore = points.getRunScore(runMinutes, runSeconds, ageGroup, gender);
  const nextRunScore = points.findNextRunPoint(runMinutes, runSeconds, ageGroup, gender);
  const {
    fastest: [minRunMins, minRunSecs],
    slowest: [maxRunMins, maxRunSecs]
  } = gender === 'male' ? points.runMaleLimits : points.runFemaleLimits;

  const totalScore = situpScore + pushupScore + runScore;

  const genderSelector = <Paper>
    <div style={{ padding: '5px' }}>
      <Stack
        alignItems='center'
        direction='column'
        justifyContent='center'
      >
        <Typography component='h3'>
          Gender
        </Typography>
        <Stack
          direction='row'
          alignItems='center'
        >
          <Typography component='p'>
            Male
          </Typography>
          <Switch
            checked={gender === 'female'}
            onChange={() => {
              if (gender === 'male') setGender('female');
              else setGender('male');
            }}
          />
          <Typography component='p'>
            Female
          </Typography>
        </Stack>
      </Stack>
    </div>
  </Paper>;

  const enhancedSelector = <EnhancedSelector
    value={isEnhanced}
    onChange={setEnhanced}
  />;

  const ageSelector = <Paper>
    <div style={{ padding: '5px' }}>
      <Stack
        direction='column'
        alignItems='center'
        justifyContent='center'
      >
        <Typography component='h3'>
          Age (Age Group {ageGroup + 1})
        </Typography>
        <NumericalSelector
          value={age}
          max={60}
          min={18}
          onChange={setAge}
        />
      </Stack>
    </div>
  </Paper>;

  const runSelector = <Stack
    direction='row'
    spacing={1}
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
      disabled={runMinutes===maxRunMins && runSeconds === maxRunSecs}
    >
      +10s
    </Button>
    <Select
      value={runMinutes}
      onChange={event => setRunMinutes(event.target.value)}
    >
      {range(minRunMins, maxRunMins + 1).map(i => <MenuItem value={i}>{i} Mins</MenuItem>)}
    </Select>
    <Select
      value={runSeconds}
      onChange={event => setRunSeconds(event.target.value)}
    >
      {range(0, 60, 10).map(i => <MenuItem value={i}>{i} Seconds</MenuItem>)}
    </Select>
    <Button
      disabled={runMinutes === minRunMins && runSeconds === minRunSecs}
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
    <Stack
      direction='column'
      spacing={1}
    >
      <Typography component='h1'>IPPT Calculator</Typography>
      <Stack direction='row' spacing={1}>
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
            <TableCell>{pushupScore}</TableCell>
            <TableCell>{points.findNextPoint(pushupsTable, ageGroup, pushups)}</TableCell>
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
            <TableCell>{situpScore}</TableCell>
            <TableCell>{points.findNextPoint(situpsTable, ageGroup, situps)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2.4km Run</TableCell>
            <TableCell>{runSelector}</TableCell>
            <TableCell>{runScore}</TableCell>
            <TableCell>{nextRunScore && (<p>- {nextRunScore * 10}s</p>)}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total Points</TableCell>
            <TableCell />
            <TableCell>{totalScore}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
      <Grid container>
        <Grid>
          <IncentiveDisplay points={totalScore}/>
        </Grid>
      </Grid>
    </Stack>
  </div>;
}
