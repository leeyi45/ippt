import type { ReactNode } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RemoveIcon from '@mui/icons-material/Remove';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import type { PointsHookResult } from './hooks';
import * as points from './points.js';

type BaseSelectorProps = {
  mainIcon: ReactNode;
  label: string;
  minLabel?: string;
  maxReps: number | [number, string];
  repsLabel?: ((reps: number) => string) | ReactNode;

  incrementMessage: string;
  decrementMessage: string;
  nextScoreMessage: (nextGroup: number) => string;
} & PointsHookResult;

export function BaseSelector({
  reps,
  score,
  nextScore,
  setReps: onRepsChanged,

  minLabel = '0',
  maxReps,
  repsLabel,
  label,
  mainIcon,

  incrementMessage,
  decrementMessage,
  nextScoreMessage
}: BaseSelectorProps) {
  const maxRepCount = typeof maxReps === 'number' ? maxReps : maxReps[0];
  const maxRepLabel = typeof maxReps === 'number' ? maxReps.toString() : maxReps[1];

  return <Paper elevation={3}>
    <div style={{ padding: '10px' }}>
      <Grid container>
        <Grid size={12}>
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={1}>
            {mainIcon}
            <Typography variant='h3' sx={{ fontSize: 25 }}>{label}</Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Stack direction='row' sx={{ alignItems: 'center' }} spacing={0.5}>
            <Typography sx={{ fontSize: 22 }}>
              {
                typeof repsLabel === 'function'
                  ? repsLabel(reps)
                  : repsLabel !== undefined
                    ? repsLabel
                    : reps
              }
            </Typography>
            <Typography color='gray'>({score} Points)</Typography>
          </Stack>
        </Grid>
        <Grid size={2}>
          <Tooltip title={decrementMessage}>
            <Button
              disabled={reps === 0}
              onClick={() => onRepsChanged?.(reps + 1)}
            >
              <RemoveIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid size={8}>
          <Slider
            step={1}
            min={0}
            max={maxRepCount}
            value={reps}
            onChange={(_, value) => onRepsChanged?.(value)}
            marks={[{ value: 0, label: minLabel }, { value: maxRepCount, label: maxRepLabel }]}
          />
        </Grid>
        <Grid size={2}>
          <Tooltip title={incrementMessage}>
            <Button
              disabled={reps === maxRepCount}
              onClick={() => onRepsChanged?.(reps + 1)}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid size={12}>
          <Typography>
            {nextScore !== undefined ? nextScoreMessage(nextScore) : 'Max Score'}
          </Typography>
        </Grid>
      </Grid>
    </div>
  </Paper>;
}

type RunSelectorProps = { gender: points.Gender } & PointsHookResult;

export function RunSelector({
  reps: runScoreGroup,
  setReps: setRunScoreGroup,
  gender,
  ...props
}: RunSelectorProps) {
  const {
    fastest: [minRunMins, minRunSecs],
    slowest: [maxRunMins, maxRunSecs]
  } = gender === 'male' ? points.runMaleLimits : points.runFemaleLimits;

  const maxRunScoreGroup = points.pointsTables[points.TableType.RUN][gender].length - 1;

  return <BaseSelector
    {...props}
    reps={maxRunScoreGroup - runScoreGroup}
    setReps={newGroup => setRunScoreGroup(maxRunScoreGroup - newGroup)}
    label="2.4km Run"
    mainIcon={<DirectionsRunIcon />}
    maxReps={[
      maxRunScoreGroup,
      `${maxRunMins}:${maxRunSecs}`
    ]}
    minLabel={`${minRunMins}:${minRunSecs}`}
    repsLabel={points.runGroupToString(runScoreGroup, gender)}
    incrementMessage='+10s'
    decrementMessage='-10s'
    nextScoreMessage={nextRunScoreGroup => {
      const runString = nextRunScoreGroup >= 6
        ? `${Math.floor(nextRunScoreGroup / 6)}:${(nextRunScoreGroup % 6).toString()}0`
        : `${(nextRunScoreGroup % 6).toString()}0s`;
      return `-${runString} to next point`;
    }}
  />;
}
