import { describe, expect, it, test } from 'vitest';
import * as points from '../points.ts';

describe('Test point tables', () => {
  const pointTables = Object.entries(points.pointsTables).flatMap(([tableType, { male, female }]) => [
    [`${tableType} (Male)`, male],
    [`${tableType} (Female)`, female],
  ] as [
    [string, number[][]],
    [string, number[][]]
  ]);

  test.for(pointTables)('%s', ([tableName, table]) => {
    const isRunTable = tableName.startsWith(`${points.TableType.RUN} `);
    for (let i = 0; i < table.length; i++) {
      expect(table[i].length).toEqual(points.AGE_GROUPS);

      for (let j = 0; j < points.AGE_GROUPS; j++) {
        if (i >= 1) {
          if (isRunTable) {
            // Faster run times appear before slower run times.
            expect(table[i-1][j]).toBeGreaterThanOrEqual(table[i][j]);
          } else {
            // Each entry in a row should be ≥ the one above it
            expect(table[i-1][j]).toBeLessThanOrEqual(table[i][j]);
          }
        }

        if (j >= 1) {
          // Each entry in a row should be ≥ the one before it
          expect(table[i][j-1]).toBeLessThanOrEqual(table[i][j]);
        }
      }
    }
  });
});

describe(points.getScore, () => {
  it('returns max score if reps ≥ max', () => {
    expect(points.getScore(points.pointsTables[points.TableType.PUSHUPS].male, 0, 1000)).toEqual(25);
  });
});

describe(points.runGroupToString, () => {
  it.each([
    [0, 'male', '8:20'],
    [1, 'male', '8:30'],
    [6, 'male', '9:20'],
    [59, 'male', '18:10'],
    [0, 'female', '10:00'],
    [1, 'female', '10:10'],
    [6, 'female', '11:00'],
    [70, 'female', '21:40']
  ] as [number, points.Gender, string][])('%s (%s) formats as %s', (runGroup, gender, expected) => {
    expect(points.runGroupToString(runGroup, gender)).toEqual(expected);
  });
});

describe(points.findNextPoint, () => {
  it('finds the next point for repetition tables', () => {
    const table = points.pointsTables[points.TableType.PUSHUPS].female;
    expect(points.findNextPoint(table, 0, 14)).toEqual(1);
  });

  it('returns undefined at the maximum push-up score', () => {
    expect(points.findNextPoint(points.pointsTables[points.TableType.PUSHUPS].male, 0, 60)).toBeUndefined();
    expect(points.findNextPoint(points.pointsTables[points.TableType.PUSHUPS].female, 0, 50)).toBeUndefined();
  });

  it('finds the next point by moving to a faster run time', () => {
    const table = points.pointsTables[points.TableType.RUN].male;
    expect(points.findNextPoint(table, 0, 44, true)).toEqual(1);
  });

  it('returns undefined at the maximum run score', () => {
    const table = points.pointsTables[points.TableType.RUN].male;
    expect(points.findNextPoint(table, 0, 0, true)).toBeUndefined();
  });
});
