import { capitalize, range } from 'es-toolkit';
import { useState } from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import type { Gender } from './points.ts';
import * as points from './points.ts';

interface AgeGroupCellProps {
  enableIncrement?: boolean;
  enableDecrement?: boolean;

  onIncrement?: () => void;
  onDecrement?: () => void;

  selected?: boolean;
  group: number;
}

function AgeGroupCell({
  enableDecrement,
  enableIncrement,
  onDecrement,
  onIncrement,
  group,
  selected
}: AgeGroupCellProps) {
  let ageStr: string;

  if (group === 0) {
    ageStr = ' <22';
  } else {
    const ageStrMin = 22 + (group - 1) * 3;
    const ageStrMax = ageStrMin + 2;
    ageStr = `${ageStrMin}-${ageStrMax}`;
  }

  return <TableCell
    style={{
      backgroundColor: selected ? '#EEEEFF' : '#FFFFFF',
    }}
  >
    <Tooltip
      title={`Age Group ${group + 1}`}
      placement='top'
    >
      <Stack direction='row' sx={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {selected && <IconButton
          onClick={onDecrement}
          disabled={!enableDecrement}
          size='small'
        >
          <KeyboardArrowLeftIcon />
        </IconButton>}
        <Typography component='p' sx={{ textAlign: 'center' }}>
          {ageStr}
        </Typography>
        {selected && <IconButton
          onClick={onIncrement}
          disabled={!enableIncrement}
          size='small'
        >
          <KeyboardArrowRightIcon />
        </IconButton>}
      </Stack>
    </Tooltip>
  </TableCell>;
}

export interface TablesDisplayProps {
  runScoreGroup: number;
  pushupReps: number;
  situpReps: number;
  ageGroup: number;
  gender: Gender;

  onAgeChange?: (newAge: number) => void;
}

export default function TablesDisplay({
  ageGroup,
  onAgeChange,
  pushupReps,
  situpReps,
  runScoreGroup,
  gender
}: TablesDisplayProps) {
  const [tableType, setTableType] = useState<points.TableType>(points.TableType.PUSHUPS);
  const values = points.pointsTables[tableType][gender];

  return <Paper elevation={3}>
    <div style={{ padding: '10px' }}>
      <Stack direction='column' sx={{ alignItems: 'center' }} spacing={1}>
        <Typography variant='h2' sx={{ fontSize: 22 }}>
          Scoring Table ({capitalize(gender)})
        </Typography>
        <Tabs onChange={(_, value) => setTableType(value)} value={tableType}>
          <Tab value={points.TableType.PUSHUPS} label="Push Ups"/>
          <Tab value={points.TableType.SITUPS} label="Sit Ups"/>
          <Tab value={points.TableType.RUN} label="2.4 Run"/>
        </Tabs>
        <Table style={{
          border: 'solid black 1px'
        }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography component='p'>
                  {tableType === points.TableType.RUN ? 'Timing' : 'Reps'}
                </Typography>
              </TableCell>
              {...range(0, points.AGE_GROUPS).map(group => {
                return <AgeGroupCell
                  enableDecrement={group > 0}
                  enableIncrement={group < points.AGE_GROUPS - 1}
                  group={group}
                  selected={group === ageGroup}
                  onIncrement={() => {
                    const newAge = 22 + group * 3;
                    onAgeChange?.(newAge);
                  }}
                  onDecrement={() => {
                    const newAge = 22 + (group - 2) * 3 + 2;
                    onAgeChange?.(newAge);
                  }}
                />;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {values.map((row, i) => {
              const isCorrectReps =
                (tableType === points.TableType.PUSHUPS && i === pushupReps) ||
                (tableType === points.TableType.SITUPS && i === situpReps) ||
                (tableType === points.TableType.RUN && i === runScoreGroup);

              return <TableRow>
                <TableCell
                  style={{
                    textAlign: 'right',
                    backgroundColor: isCorrectReps ? '#EEEEFF' : '#FFFFFF'
                  }}
                >
                  <strong>
                    {tableType === points.TableType.RUN ? points.runGroupToString(i, gender) : `${i}`}
                  </strong>
                </TableCell>
                {...row.map((value, rowAge) => {
                  let selectValue = 0;
                  if (rowAge === ageGroup) {
                    selectValue++;
                  }

                  if (isCorrectReps) {
                    selectValue++;
                  }

                  let backgroundStr: string;
                  switch (selectValue) {
                    case 1: {
                      backgroundStr = '#EEEEFF';
                      break;
                    }
                    case 2: {
                      backgroundStr = '#DDDDFF';
                      break;
                    }
                    default: {
                      backgroundStr = '#FFFFFF';
                      break;
                    }
                  }

                  return <TableCell
                    style={{
                      textAlign: 'center',
                      background: backgroundStr
                    }}
                  >
                    {value}
                  </TableCell>;
                })}
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </Stack>
    </div>
  </Paper>;
}
