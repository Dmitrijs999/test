import React from 'react';

import classes from './ProgressBar.module.scss';
import { ProgressPoint, ProgressPointActive } from 'assets/svg';

interface Props {
  ProgressPoints: ProgressPoints[];
}
type ProgressPoints = {
  text: string;
  isActive: boolean;
};

const ProgressBar = ({ ProgressPoints }: Props): React.ReactElement => {
  const prePoint = 100 / ProgressPoints.length + 2;
  const count = ProgressPoints.filter((value) => value.isActive).length - 1;
  const completed = prePoint * count;
  const elements = ProgressPoints.map((item, index) => {
    return (
      <div key={index}>
        {item.isActive ? <ProgressPointActive /> : <ProgressPoint />}
        <div className={classes.item}>{item.text}</div>
      </div>
    );
  });
  return (
    <div className={classes.barContainer}>
      <div
        style={{ width: `${completed}%` }}
        className={classes.barFiller}
      ></div>
      {elements}
    </div>
  );
};
export default ProgressBar;
