import React from 'react';

import { Typography } from '@minterest-finance/ui-kit';

import classes from './DetailsLink.module.scss';

type Props = {
  linkLabel: string;
  link: string;
};

export const Link: React.FC<Props> = ({ linkLabel, link }) => {
  return (
    <div>
      <a href={link} target='_blank' rel='noreferrer'>
        <Typography
          text={linkLabel}
          variant='copyLBold'
          className={classes.link}
        />
      </a>
    </div>
  );
};
