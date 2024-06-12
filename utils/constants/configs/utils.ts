import { DateTime, Settings } from 'luxon';

const getDayAxisLabels = () => {
  const arr = [];
  const now = DateTime.now();
  for (let i = 0; i < 6; i += 1) {
    const temp = now.minus({ hour: 4 * i });
    arr.unshift(temp.toLocaleString(DateTime.TIME_24_SIMPLE));
  }
  return arr;
};

const getMonthAxisLabels = () => {
  const arr = [];
  const now = DateTime.now();
  const prevMonth = now.minus({ month: 1 });
  for (let i = 0; i < 6; i += 1) {
    let currentDay = now.day - 6 * i;
    if (currentDay < 0) currentDay = prevMonth.daysInMonth + currentDay;
    arr.unshift(currentDay);
  }
  return arr;
};

Settings.defaultLocale = 'en-US';

const getYearAxisLabels = () => {
  const arr = [];
  const now = DateTime.now();
  for (let i = 0; i <= 12; i += 2) {
    if (!i) arr.unshift(now.toLocaleString({ month: 'short', day: 'numeric' }));
    else arr.unshift(now.minus({ months: i }).monthShort);
  }

  return arr;
};

export const getAllAxisLabels = (startDate: number): string[] => {
  const arr = [];
  const now = DateTime.now();
  const divideValue = (now.toSeconds() - startDate) / 5;
  let prevDate;
  for (let i = 0; i < 6; i += 1) {
    const date = now.toSeconds() - divideValue * (5 - i);
    const currentLabel = DateTime.fromSeconds(date).toLocaleString({
      month: 'short',
      day: 'numeric',
    });

    arr.push(
      currentLabel !== prevDate
        ? currentLabel
        : DateTime.fromSeconds(date).toFormat('HH:mm')
    );
    prevDate = currentLabel;
  }

  return arr;
};

export const AXIS_LABELS = {
  day: getDayAxisLabels(),
  month: getMonthAxisLabels(),
  year: getYearAxisLabels(),
};

interface IGetExtremumValues {
  maxValue: number;
  minValue: number;
  divideValue: number;
}

export const getExtremumValues = (
  pointsArr: { x: number; y: number }[][]
): IGetExtremumValues => {
  const resultArr = pointsArr.reduce((accumulator, currentValue) => {
    return [...accumulator, ...currentValue];
  }, []);
  const axisArr = resultArr.map(({ y }) => y);
  if (!axisArr.length) {
    // if no data, can lead to infinite axis and kill browser
    return { minValue: 0, maxValue: 100, divideValue: 25 };
  }

  let max = Math.ceil(Math.max(...axisArr));
  let min = Math.floor(Math.min(...axisArr));
  if (!min && !max) {
    // if no data, can lead to infinite axis and kill browser
    return { minValue: 0, maxValue: 100, divideValue: 25 };
  }
  if (min === max) {
    min = min / 2;
    max = max + min;
  }
  const divideValue = (max - min) / 4;
  const halfDivide = divideValue / 2;
  let minValue = 0;

  if (min < 0 || (min > 0 && min - halfDivide > 0)) minValue = min - halfDivide;

  return {
    minValue: minValue,
    maxValue: max + halfDivide,
    divideValue: (max + halfDivide - minValue) / 4,
  };
};
