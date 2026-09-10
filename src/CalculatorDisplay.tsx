import { range } from 'es-toolkit';
import { useEffect, useState } from 'react';

import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import TablesDisplay from './TableDisplay.tsx';
import { isIntegerWithinRange, useLocalStorage, usePoints } from './hooks.ts';
import { passTypeToReward, passTypeToString, pointsToNextTier, pointsToPassType } from './passType.ts';
import * as points from './points.ts';
import { BaseSelector, RunSelector } from './selectors.tsx';

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

export default function CalculatorDisplay() {
  const [age, setAge] = useLocalStorage<number>(18, 'age', value => isIntegerWithinRange(value - 18, 43));
  const ageGroup = points.getAgeGroup(age);

  const [isEnhanced, setEnhanced] = useState(false);
  const [gender, setGender] = useLocalStorage<points.Gender>('male', 'gender', points.isGender);
  const pushupsTable = points.pointsTables[points.TableType.PUSHUPS][gender];
  const situpsTable = points.pointsTables[points.TableType.SITUPS][gender];
  const runTable = points.pointsTables[points.TableType.RUN][gender];

  const pushups = usePoints(30, points.TableType.PUSHUPS, ageGroup, pushupsTable);
  const situps = usePoints(30, points.TableType.SITUPS, ageGroup, situpsTable);
  const run = usePoints(Math.floor(runTable.length / 2), points.TableType.RUN, ageGroup, runTable);

  useEffect(() => {
    console.log(run.reps);
  }, [run.reps]);

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
                disabled={age === 18}
                onClick={() => setAge(age - 1)}
              >
                -1
              </Button>
              <Select
                value={age}
                onChange={event => setAge(event.target.value)}
              >
                {range(18, 61).map(i => <MenuItem value={i}>{i}</MenuItem>)}
              </Select>
              <Button
                disabled={age === 60}
                onClick={() => setAge(age + 1)}
              >
                +1
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
            /* re-enable when enhanced mode is released */
            disabled
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
      <Grid size={4}>
        <BaseSelector
          {...pushups}
          label="Push-Ups"
          maxReps={60}
          mainIcon={<FitnessCenterIcon />}
          incrementMessage='+1 Rep'
          decrementMessage='-1 Rep'
          nextScoreMessage={score => `${score} rep${score > 1 ? 's' : ''} to next point`}
        />
      </Grid>
      <Grid size={4}>
        <BaseSelector
          {...situps}
          label="Sit-Ups"
          maxReps={60}
          mainIcon={<AirlineSeatReclineExtraIcon />}
          incrementMessage='+1 Rep'
          decrementMessage='-1 Rep'
          nextScoreMessage={score => `${score} rep${score > 1 ? 's' : ''} to next point`}
        />
      </Grid>
      <Grid size={4}>
        <RunSelector
          {...run}
          gender={gender}
        />
      </Grid>
      {/* Row 3 */}
      <Grid size={12}>
        <IncentiveDisplay
          pushups={pushups.score}
          situps={situps.score}
          run={run.score}
        />
      </Grid>
      <Grid size={12}>
        <TablesDisplay
          runScoreGroup={run.reps}
          pushupReps={pushups.reps}
          situpReps={situps.reps}
          ageGroup={ageGroup}
          gender={gender}
        />
      </Grid>
    </Grid>
  </div>;
}
