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

  test.for(pointTables)('%s', ([, table]) => {
    for (let i = 0; i < table.length; i++) {
      expect(table[i].length).toEqual(points.AGE_GROUPS);

      for (let j = 0; j < points.AGE_GROUPS; j++) {
        if (i >= 1) {
          // Each entry in a row should be >= the one above it.
          expect(table[i-1][j]).toBeLessThanOrEqual(table[i][j]);
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
    [0, 'male', '18:20'],
    [1, 'male', '18:10'],
    [6, 'male', '17:20'],
    [59, 'male', '8:30'],
    [0, 'female', '21:40'],
    [1, 'female', '21:30'],
    [6, 'female', '20:40'],
    [70, 'female', '10:00']
  ] as [number, points.Gender, string][])('%s (%s) formats as %s', (runGroup, gender, expected) => {
    expect(points.runGroupToString(runGroup, gender)).toEqual(expected);
  });
});

describe(points.findNextPoint, () => {
  const table = points.pointsTables[points.TableType.PUSHUPS].female;

  it('finds the next point', () => {
    expect(points.findNextPoint(table, 0, 14)).toEqual(1);
  });

  it('returns undefined at the maximum score', () => {
    expect(points.findNextPoint(table, 0, table.length - 1)).toBeUndefined();
  });
});
