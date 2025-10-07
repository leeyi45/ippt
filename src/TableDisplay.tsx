import range from 'lodash/range';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid/DataGrid';

import * as points from './points.ts';
import type { Gender } from './types.ts';

export interface TableDisplayProps {
  values: number[][];
}

/**
 * React component for displaying a single score table
 */
function TableDisplay({ values }: TableDisplayProps) {
  const columns: GridColDef[] = [
    {
      field: 'reps',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Reps',
      disableColumnMenu: true,
    },
    ...range(0, 14).map((ageGroup): GridColDef => {
      let ageStr: string;

      if (ageGroup === 0) {
        ageStr = ' <22';
      } else {
        const ageStrMin = 22 + (ageGroup - 1) * 3;
        const ageStrMax = ageStrMin + 2;
        ageStr = `${ageStrMin}-${ageStrMax}`;
      }

      return {
        field: `group${ageGroup}`,
        renderHeader: (...params) => <Tooltip
          title={`Age Group ${ageGroup + 1}`}
          placement='top'
        >
          <Typography {...params} component='p'>
            {ageStr}
          </Typography>
        </Tooltip>,
        align: 'center',
        headerAlign: 'center',
        disableColumnMenu: true,
        sortable: false,
      };
    })
  ];

  return <DataGrid
    density='compact'
    hideFooter
    disableColumnResize
    columns={columns}
    rows={values.map((row, i) => {
      const rowObj: Record<string, number> = {
        id: i,
        reps: i
      };

      row.forEach((value, i) => {
        rowObj[`group${i}`] = value;
      });

      return rowObj;
    })}
  />;
}

enum TableType {
  PUSHUPS = 'pushups',
  SITUPS = 'situps',
  RUN = 'run'
}

export default function TablesDisplay() {
  const [tableType, setTableType] = useState<TableType>(TableType.PUSHUPS);
  const [gender, setGender] = useState<Gender>('male');

  let values: number[][];
  switch (tableType) {
    case TableType.PUSHUPS: {
      values = gender === 'male' ? points.pushupsMale : points.pushupsFemale;
      break;
    }
    case TableType.SITUPS: {
      values = gender === 'male' ? points.situpsMale : points.situpsFemale;
      break;
    }
    case TableType.RUN: {
      values = gender === 'male' ? points.runMale : points.runFemale;
      break;
    }
  }

  return <Stack direction='column' alignItems='center'>
    <Stack direction='row' alignItems='center'>
      <Typography>Male</Typography>
      <Switch
        checked={gender === 'female'}
        onChange={() => setGender(gender === 'male' ? 'female' : 'male')}
      />
      <Typography>Female</Typography>
    </Stack>
    <Tabs onChange={(_, value) => setTableType(value)} value={tableType}>
      <Tab value={TableType.PUSHUPS} label="Push Ups"/>
      <Tab value={TableType.SITUPS} label="Sit Ups"/>
      <Tab value={TableType.RUN} label="2.4 Run"/>
    </Tabs>
    {<TableDisplay values={values} />}
  </Stack>;
}
