import { DateTime } from 'luxon';

export const getYearsLabel = (
  years: number,
  t: (string: string) => string
): string => {
  if (years > 1) return t('dashboard.mntVestingBlock.years');
  return t('dashboard.mntVestingBlock.year');
};

export const getDaysLabel = (
  days: number,
  t: (string: string) => string
): string => {
  if (days > 1) return t('dashboard.mntVestingBlock.days');
  return t('dashboard.mntVestingBlock.day');
};

export const getRemainingPeriodLabel = (
  timestamp: number,
  t: (string: string) => string,
  startTimestamp?: number
): string => {
  const endDT = DateTime.fromSeconds(timestamp);
  if (timestamp * 1000 < Date.now())
    return `0 ${t('dashboard.mntVestingBlock.days')}`;
  let years, days;
  if (!startTimestamp) {
    const diff = endDT.diffNow(['days', 'year']);
    years = diff.years;
    days = diff.days;
  } else {
    const diff = endDT.diff(DateTime.fromSeconds(startTimestamp), [
      'days',
      'year',
    ]);
    years = diff.years;
    days = diff.days;
  }

  let period = '';

  if (years) {
    period = `${years} ${getYearsLabel(years, t)}`;
  }
  if (days) {
    period = `${period}${period.length ? ', ' : ''}${Math.ceil(
      days
    )} ${getDaysLabel(days, t)}`;
  }
  return period;
};
