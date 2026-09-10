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
    expect(points.getScore(points.pointsTables.pushups.male, 0, 1000)).toEqual(25);
  });
});

describe(points.runGroupToString, () => {
  function formatRunLimit([min, sec]: [number, number]) {
    const secString = sec.toString().padEnd(2, '0');
    return `${min}:${secString}`;
  }

  it.each([
    [1, 'male', '18:10'],
    [6, 'male', '17:20'],
    [0, 'female', '21:40'],
    [1, 'female', '21:30'],
    [6, 'female', '20:40'],
  ] as [number, points.Gender, string][])('%s (%s) formats as %s', (runGroup, gender, expected) => {
    expect(points.runGroupToString(runGroup, gender)).toEqual(expected);
  });

  test('Correct value for fastest run (male)', () => {
    expect(points.runGroupToString(
      points.pointsTables.run.male.length - 1,
      'male'
    )).toEqual(
      formatRunLimit(points.runMaleLimits.fastest)
    );
  });

  test('Correct value for slowest run (male)', () => {
    expect(points.runGroupToString(0, 'male')).toEqual( formatRunLimit(points.runMaleLimits.slowest));
  });

  test('Correct value for max run (male)', () => {
    expect(points.runGroupToString(
      points.pointsTables.run.male.length - 1,
      'male'
    )).toEqual(
      formatRunLimit(points.runMaleLimits.fastest)
    );
  });

  test('Correct value for slowest run (female)', () => {
    expect(points.runGroupToString(0, 'female')).toEqual(formatRunLimit(points.runFemaleLimits.slowest));
  });
});

describe(points.findNextPoint, () => {
  const table = points.pointsTables.pushups.female;

  it('finds the next point', () => {
    expect(points.findNextPoint(table, 0, 14)).toEqual(1);
  });

  it('returns undefined at the maximum score', () => {
    expect(points.findNextPoint(table, 0, table.length - 1)).toBeUndefined();
  });
});
