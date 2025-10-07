export type PassType =
  | 'fail-'
  | 'fail'
  | 'pass'
  | 'pass+'
  | 'silver'
  | 'gold'
  | 'gold+';

export function passTypeToString(type: PassType): string {
  switch (type) {
    case 'fail':
    case 'fail-':
      return 'FAIL';
    case 'pass':
      return 'PASS';
    case 'pass+':
      return 'PASS (Incentive)';
    case 'silver':
      return 'SILVER';
    case 'gold':
      return 'GOLD';
    case 'gold+':
      return 'GOLD (Commando/Diver)';
  }
}

export function pointsToPassType(
  pushupsPoints: number,
  situpPoints: number,
  runPoints: number
): PassType {
  if (
    pushupsPoints < 1 ||
    situpPoints < 1 ||
    runPoints < 1
  ) {
    return 'fail-';
  }

  const points = pushupsPoints + situpPoints + runPoints;
  if (points >= 90) return 'gold+';
  if (points >= 85) return 'gold';
  if (points >= 75) return 'silver';
  if (points >= 61) return 'pass+';
  if (points >= 51) return 'pass';
  return 'fail';
}

export function pointsToNextTier(points: number): [number, PassType | undefined] {
  if (points >= 90) return [100 - points, undefined];
  if (points >= 85) return [90 - points, 'gold+'];
  if (points >= 75) return [85 - points, 'gold'];
  if (points >= 61) return [75 - points, 'silver'];
  if (points >= 51) return [61 - points, 'pass+'];

  return [51 - points, 'pass'];
}

export function passTypeToReward(passType: PassType): number {
  switch (passType) {
    case 'fail':
    case 'fail-':
    case 'pass':
      return 0;
    case 'pass+': return 200;
    case 'silver': return 300;
    case 'gold':
    case 'gold+':
      return 500;
  }
}
