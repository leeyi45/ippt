import { clamp, debounce, range } from 'es-toolkit';
import { useCallback, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RemoveIcon from '@mui/icons-material/Remove';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import TablesDisplay from './TableDisplay.tsx';
import { passTypeToReward, passTypeToString, pointsToNextTier, pointsToPassType } from './passType.ts';
import * as points from './points.ts';

interface IncentiveDisplayProps {
  pushups: number;
  situps: number;
  run: number;
}

function IncentiveDisplay({ pushups, situps, run }: IncentiveDisplayProps) {
  const type = pointsToPassType(pushups, situps, run);
  const points = pushups + situps + run;
  const [extra, nextTier] = pointsToNextTier(points);

  let backgroundStr: string;
  switch (type) {
    case 'fail':
    case 'fail-': {
      backgroundStr = 'radial-gradient(circle,rgba(255, 51, 51, 1) 50%, rgba(250, 253, 255, 1) 100%)';
      break;
    }
    case 'pass+':
    case 'pass': {
      backgroundStr = 'radial-gradient(circle,rgba(51, 122, 255, 1) 50%, rgba(250, 253, 255, 1) 100%)';
      break;
    }
    case 'silver': {
      backgroundStr = 'radial-gradient(circle,rgba(138, 138, 138, 1) 50%, rgba(219, 219, 219, 1) 100%)';
      break;
    }
    case 'gold':
    case 'gold+': {
      backgroundStr = 'radial-gradient(circle,rgba(255, 228, 51, 1) 50%, rgba(255, 255, 250, 1) 100%)';
      break;
    }
  }

  return <Paper elevation={3}>
    <div style={{
      padding: '10px',
      background: backgroundStr,
    }}>
      <Grid container>
        {/* Row 1 */}
        <Grid size={2}>
          <Typography component='h2'>Total Points</Typography>
        </Grid>
        <Grid size={8} />
        <Grid size={2}>
          <Typography component='h2' align='right'>Award</Typography>
        </Grid>
        {/* Row 2 */}
        <Grid size={2}>
          <Typography component='h3'>{points}</Typography>
        </Grid>
        <Grid size={8} />
        <Grid size={2}>
          <Typography align='right'>{passTypeToString(type)}</Typography>
        </Grid>
        {/* Row 3 */}
        <Grid size={12}>
          <Divider />
        </Grid>
        {/* Row 4 */}
        <Grid size={4}>
          <Typography>
            {
              nextTier !== undefined
                ? <>{extra} points to {passTypeToString(nextTier)}</>
                : <></>
            }
          </Typography>
        </Grid>
        <Grid size={6} />
        <Grid size={2}>
          <Typography align='right'>
            {
              type !== 'fail-'
                ? <>Reward: ${passTypeToReward(type)}</>
                : <>You need at least 1 point per station to pass</>
            }
          </Typography>
        </Grid>
      </Grid>
    </div>
  </Paper>;
}

function useLocalStorage<T extends number | boolean | string>(initial: T, key: string) {
  const storedValue = localStorage.getItem(key);
  const [value, setValue] = useState(storedValue !== null ? JSON.parse(storedValue) : initial);
  const localSetter = useCallback(debounce(v => localStorage.setItem(key, JSON.stringify(v)), 200), [key]);

  return [value, v => {
    setValue(v);
    localSetter(v);
  }] as [T, (v: T) => void];
}

function usePoints(initial: number, key: points.TableType, ageGroup: number, table: points.AgeGroupRange[]) {
  const [storedValue, storeValue] = useLocalStorage(initial, key);
  const value = clamp(storedValue, 0, table.length - 1);
  const score = points.getScore(table, ageGroup, value);
  const nextScore = points.findNextPoint(
    table,
    ageGroup,
    value
  );

  return {
    value,
    setValue: (nextValue: number) => storeValue(clamp(nextValue, 0, table.length - 1)),
    score,
    nextScore
  };
}

export default function CalculatorDisplay() {
  const [age, setAge] = useLocalStorage<number>(18, 'age');
  const ageGroup = points.getAgeGroup(age);

  const [isEnhanced, setEnhanced] = useState(false);
  const [gender, setGender] = useLocalStorage<points.Gender>('male', 'gender');
  const pushupsTable = points.pointsTables[points.TableType.PUSHUPS][gender];
  const situpsTable = points.pointsTables[points.TableType.SITUPS][gender];
  const runTable = points.pointsTables[points.TableType.RUN][gender];

  const {
    value: pushups,
    setValue: setPushups,
    score: pushupScore,
    nextScore: nextPushupScore
  } = usePoints(30, points.TableType.PUSHUPS, ageGroup, pushupsTable);

  const {
    value: situps,
    setValue: setSitups,
    score: situpScore,
    nextScore: nextSitupScore
  } = usePoints(30, points.TableType.SITUPS, ageGroup, situpsTable);

  const {
    value: runScoreGroup,
    setValue: setRunScoreGroup,
    score: runScore,
    nextScore: nextRunScoreGroup
  } = usePoints(Math.floor(runTable.length) / 2, points.TableType.RUN, ageGroup, runTable);
  const runGroupStr = points.runGroupToString(runScoreGroup, gender);

  const {
    fastest: [minRunMins, minRunSecs],
    slowest: [maxRunMins, maxRunSecs]
  } = gender === 'male' ? points.runMaleLimits : points.runFemaleLimits;

  const situpsSelector = <Paper elevation={3}>
    <div style={{ padding: '10px' }}>
      <Grid container>
        <Grid size={12}>
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={1}>
            <AirlineSeatReclineExtraIcon />
            <Typography variant='h3' sx={{ fontSize: 25 }}>Sit-Ups</Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={0.5}>
            <Typography sx={{ fontSize: 22 }}>{situps}</Typography>
            <Typography color='gray'>({situpScore} Points)</Typography>
          </Stack>
        </Grid>
        <Grid size={2}>
          <Tooltip title='-1 Rep'>
            <Button
              disabled={situps === 0}
              onClick={() => setSitups(situps + 1)}
            >
              <RemoveIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid size={8}>
          <Slider
            step={1}
            min={0}
            max={60}
            value={situps}
            onChange={(_, value) => setSitups(value)}
            marks={[{ value: 0, label: '0' }, { value: 60, label: '60' }]}
          />
        </Grid>
        <Grid size={2}>
          <Tooltip title='+1 Rep'>
            <Button
              disabled={situps === 60}
              onClick={() => setSitups(situps + 1)}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid size={12}>
          <Typography>
            {
              nextSitupScore !== undefined
                ? <>{nextSitupScore} reps to next point</>
                : <>Max Score</>
            }
          </Typography>
        </Grid>
      </Grid>
    </div>
  </Paper>;

  const pushupsSelector = <Paper elevation={3}>
    <div style={{ padding: '10px' }}>
      <Grid container>
        <Grid size={12}>
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={1}>
            <FitnessCenterIcon />
            <Typography variant='h3' sx={{ fontSize: 25 }}>Push-Ups</Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={0.5}>
            <Typography sx={{ fontSize: 22 }}>{pushups}</Typography>
            <Typography color='gray'>({pushupScore} Points)</Typography>
          </Stack>
        </Grid>
        <Grid size={2}>
          <Tooltip title='-1 Rep'>
            <Button
              disabled={pushups === 0}
              onClick={() => setPushups(pushups - 1)}
            >
              <RemoveIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid size={8}>
          <Slider
            step={1}
            min={0}
            max={60}
            value={pushups}
            onChange={(_, value) => setPushups(value)}
            marks={[{ value: 0, label: '0' }, { value: 60, label: '60' }]}
          />
        </Grid>
        <Grid size={2}>
          <Tooltip title='+1 Rep'>
            <Button
              disabled={pushups === 60}
              onClick={() => setPushups(pushups + 1)}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid size={12}>
          <Typography>
            {
              nextPushupScore !== undefined
                ? <>{nextPushupScore} reps to next point</>
                : <>Max Score</>
            }
          </Typography>
        </Grid>
      </Grid>
    </div>
  </Paper>;

  const runString = nextRunScoreGroup === undefined
    ? undefined
    : nextRunScoreGroup >= 6
      ? `${Math.floor(nextRunScoreGroup / 6)}:${(nextRunScoreGroup % 6).toString()}0`
      : `${(nextRunScoreGroup % 6).toString()}0s`;

  const runSelector = <Paper elevation={3}>
    <div style={{ padding: '10px' }}>
      <Grid container>
        <Grid size={12}>
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={1}>
            <DirectionsRunIcon />
            <Typography variant='h3' sx={{ fontSize: 25 }}>2.4km Run</Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={0.5}>
            <Typography sx={{ fontSize: 22 }}>{runGroupStr}</Typography>
            <Typography color='gray'>({runScore} Points)</Typography>
          </Stack>
        </Grid>
        <Grid size={2}>
          <Tooltip title='-10s'>
            <Button
              disabled={runScoreGroup === runTable.length - 1}
              onClick={() => setRunScoreGroup(runScoreGroup + 1)}
            >
              <RemoveIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid size={8}>
          <Slider
            step={1}
            min={0}
            max={runTable.length - 1}
            value={runTable.length - 1 - runScoreGroup}
            onChange={(_, value) => setRunScoreGroup(runTable.length - 1 - value)}
            marks={[{
              value: runTable.length - 1,
              label: `${maxRunMins}:${maxRunSecs}`
            }, {
              value: 0,
              label: `${minRunMins}:${minRunSecs}`
            }]}
          />
        </Grid>
        <Grid size={2}>
          <Tooltip title='+10s'>
            <Button
              disabled={runScoreGroup === 0}
              onClick={() => setRunScoreGroup(runScoreGroup - 1)}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Typography>
          {
            runString !== undefined
              ? <>-{runString} to next point</>
              : <>Max Score</>
          }
        </Typography>
      </Grid>
    </div>
  </Paper>;

  const settingsGrid = <Paper elevation={3}>
    <div style={{ padding: '15px' }}>
      <Grid
        container
        sx={{ textAlign: 'center' }}
        rowSpacing={1}
      >
        {/* row 1 */}
        <Grid size={4}>
          <Typography sx={{ fontSize: 20 }}>Age (Age Group {ageGroup + 1})</Typography>
        </Grid>
        <Grid size={4}>
          <Typography sx={{ fontSize: 20 }}>Gender</Typography>
        </Grid>
        <Grid size={4}>
          <Typography sx={{ fontSize: 20 }}>Enhanced Mode</Typography>
        </Grid>
        {/* row 2 */}
        <Grid size={4}>
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Stack direction='row'>
              <Button
                disabled={age === 60}
                onClick={() => setAge(age + 1)}
              >
                +1
              </Button>
              <Select
                value={age}
                onChange={event => setAge(event.target.value)}
              >
                {range(18, 61).map(i => <MenuItem value={i}>{i}</MenuItem>)}
              </Select>
              <Button
                disabled={age === 18}
                onClick={() => setAge(age - 1)}
              >
                -1
              </Button>
            </Stack>
          </div>
        </Grid>
        <Grid size={4}>
          <Select value={gender} onChange={event => setGender(event.target.value)}>
            <MenuItem value='male'>Male</MenuItem>
            <MenuItem value='female'>Female</MenuItem>
          </Select>
        </Grid>
        <Grid size={4}>
          <Switch
            value={isEnhanced}
            onChange={() => setEnhanced(!isEnhanced)}
          />
        </Grid>
      </Grid>
    </div>
  </Paper>;

  return <div>
    <Grid container spacing={2}>
      {/* Row 1 */}
      <Grid size={2} />
      <Grid size={8}>{settingsGrid}</Grid>
      <Grid size={2} />
      {/* Row 2 */}
      <Grid size={4}>{pushupsSelector}</Grid>
      <Grid size={4}>{situpsSelector}</Grid>
      <Grid size={4}>{runSelector}</Grid>
      {/* Row 3 */}
      <Grid size={12}>
        <IncentiveDisplay
          pushups={pushupScore}
          situps={situpScore}
          run={runScore}
        />
      </Grid>
      <Grid size={12}>
        <TablesDisplay
          runScoreGroup={runScoreGroup}
          pushupReps={pushups}
          situpReps={situps}
          ageGroup={ageGroup}
          gender={gender}
        />
      </Grid>
    </Grid>
  </div>;
}
