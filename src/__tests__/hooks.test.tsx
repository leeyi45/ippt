import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook } from 'vitest-browser-react';

import { isIntegerWithinRange, useLocalStorage, usePoints } from '../hooks.ts';
import * as points from '../points.ts';

afterEach(() => {
  localStorage.clear();
  cleanup();
});

describe(useLocalStorage, () => {
  it('loads a valid stored value', async () => {
    localStorage.setItem('value', JSON.stringify(12));

    const { result } = await renderHook(() => useLocalStorage(5, 'value', value => isIntegerWithinRange(value, 20)));

    expect(result.current[0]).toBe(12);
  });

  it('uses the initial value for an invalid stored value', async () => {
    localStorage.setItem('value', JSON.stringify(20));

    const { result } = await renderHook(() => useLocalStorage(5, 'value', value => isIntegerWithinRange(value, 20)));

    expect(result.current[0]).toBe(5);
  });
});

describe(usePoints, () => {
  it('returns the score and next-point distance', async () => {
    const table = points.pointsTables.pushups.female;
    const { result } = await renderHook(() => usePoints(14, 'pushups', 0, table));

    expect(result.current.score).toBe(0);
    expect(result.current.nextScore).toBe(1);
  });

  it('clamps values set outside the table range', async () => {
    const table = points.pointsTables.pushups.female;
    const { result } = await renderHook(() => usePoints(14, 'pushups', 0, table));

    result.current.setReps(1000);

    await expect.poll(() => result.current.reps).toBe(50);
  });
});
