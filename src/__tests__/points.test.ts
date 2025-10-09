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
          // Each entry in a row should be ≥ the one above it
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
