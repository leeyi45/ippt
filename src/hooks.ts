import { clamp, debounce } from 'es-toolkit';
import { useCallback, useState } from 'react';
import * as points from './points.ts';

/**
 * Returns a stateful React value and setter that also loads from `localStorage`.
 * If the `isValid` predicate returns `false` when loading from `localStorage` the
 * `initial` value is used.
 */
export function useLocalStorage<T extends number | boolean | string>(
  initial: T,
  key: string,
  isValid: (value: T) => boolean
) {
  const rawValue = localStorage.getItem(key);
  const storedValue = rawValue === null ? null : JSON.parse(rawValue);

  const [value, setValue] = useState(storedValue === null || !isValid(storedValue) ? initial : storedValue);
  const localSetter = useCallback(debounce(v => localStorage.setItem(key, JSON.stringify(v)), 200), [key]);

  return [value, v => {
    setValue(v);
    localSetter(v);
  }] as [T, (v: T) => void];
}

/**
 * Checks if the given value is an integer within the range [0, max)
 * @param rawValue Value to validate
 * @param max Maximum value, exclusive
 */
export function isIntegerWithinRange(rawValue: unknown, max: number): rawValue is number {
  if (typeof rawValue !== 'number' || !Number.isInteger(rawValue)) return false;
  return 0 <= rawValue && rawValue < max;
}

export interface PointsHookResult {
  reps: number;
  setReps: (newValue: number) => void;
  score: number;
  nextScore: number | undefined;
}

export function usePoints(initial: number, key: points.TableType, ageGroup: number, table: points.AgeGroupRange[]): PointsHookResult {
  const [storedValue, storeValue] = useLocalStorage(initial, key, value => isIntegerWithinRange(value, table.length));
  const score = points.getScore(table, ageGroup, storedValue);
  const nextScore = points.findNextPoint(
    table,
    ageGroup,
    storedValue
  );

  return {
    reps: storedValue,
    setReps: nextValue => storeValue(clamp(nextValue, 0, table.length - 1)),
    score,
    nextScore
  };
}
