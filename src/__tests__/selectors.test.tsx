import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';

import * as points from '../points.ts';
import { RunSelector } from '../selectors.tsx';

afterEach(() => {
  cleanup();
});

describe(RunSelector, () => {
  it('displays the male run time and score details', async () => {
    const rendered = await render(
      <RunSelector
        reps={1}
        score={2}
        nextScore={1}
        setReps={vi.fn()}
        gender='male'
      />
    );

    await expect.element(rendered.getByText('18:00')).toBeVisible();
    await expect.element(rendered.getByText('(2 Points)')).toBeVisible();
    await expect.element(rendered.getByText('-10s to next point')).toBeVisible();
  });

  it('displays the female run time', async () => {
    const rendered = await render(
      <RunSelector
        reps={0}
        score={0}
        nextScore={undefined}
        setReps={vi.fn()}
        gender='female'
      />
    );

    await expect.element(rendered.getByText(points.runGroupToString(0, 'female'))).toBeVisible();
    await expect.element(rendered.getByText('Max Score')).toBeVisible();
  });

  it('translates faster and slower controls to run score groups', async () => {
    const setReps = vi.fn();
    const rendered = await render(
      <RunSelector
        reps={2}
        score={3}
        nextScore={1}
        setReps={setReps}
        gender='male'
      />
    );

    await rendered.getByRole('button', { name: '-10s' }).click();
    expect(setReps).toHaveBeenCalledWith(1);

    await rendered.getByRole('button', { name: '+10s' }).click();
    expect(setReps).toHaveBeenCalledWith(3);
  });
});
