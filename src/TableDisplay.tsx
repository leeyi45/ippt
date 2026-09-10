import { capitalize, range } from 'es-toolkit';
import { useState } from 'react';

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
  selected?: boolean;
  group: number;
}

function AgeGroupCell({ group, selected }: AgeGroupCellProps) {
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
      <Typography component='p' sx={{ textAlign: 'center' }}>
        {ageStr}
      </Typography>
    </Tooltip>
  </TableCell>;
}

export interface TablesDisplayProps {
  runScoreGroup: number;
  pushupReps: number;
  situpReps: number;
  ageGroup: number;
  gender: Gender;
}

export default function TablesDisplay({
  ageGroup,
  pushupReps,
  situpReps,
  runScoreGroup,
  gender
}: TablesDisplayProps) {
  const [tableType, setTableType] = useState<points.TableType>('pushups');
  const values = points.pointsTables[tableType][gender];

  return <Paper elevation={3}>
    <div style={{ padding: '10px' }}>
      <Stack direction='column' sx={{ alignItems: 'center' }} spacing={1}>
        <Typography variant='h2' sx={{ fontSize: 22 }}>
          Scoring Table ({capitalize(gender)})
        </Typography>
        <Tabs onChange={(_, value) => setTableType(value)} value={tableType}>
          <Tab value='pushups' label="Push Ups"/>
          <Tab value='situps' label="Sit Ups"/>
          <Tab value='run' label="2.4 Run"/>
        </Tabs>
        <Table style={{
          border: 'solid black 1px'
        }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography component='p'>
                  {tableType === 'run' ? 'Timing' : 'Reps'}
                </Typography>
              </TableCell>
              {...range(0, points.AGE_GROUPS).map(group => {
                return <AgeGroupCell
                  group={group}
                  selected={group === ageGroup}
                />;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {values.map((row, i) => {
              const isCorrectReps =
                (tableType === 'pushups' && i === pushupReps) ||
                (tableType === 'situps' && i === situpReps) ||
                (tableType === 'run' && i === runScoreGroup);

              return <TableRow>
                <TableCell
                  style={{
                    textAlign: 'right',
                    backgroundColor: isCorrectReps ? '#EEEEFF' : '#FFFFFF'
                  }}
                >
                  <strong>
                    {tableType === 'run' ? points.runGroupToString(i, gender) : `${i}`}
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
