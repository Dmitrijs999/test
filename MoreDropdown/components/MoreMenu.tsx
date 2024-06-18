import React, { FC, useRef } from 'react';

import { Card, Row, Typography } from '@minterest-finance/ui-kit';

import classes from './MoreMenu.module.scss';
import { DropdownLink } from 'types';
import { useOnClickOutside } from 'utils';

type Props = {
  onClose: () => void;
  links: DropdownLink[];
};

export const MoreMenu: FC<Props> = ({ onClose, links }: Props) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    onClose();
  });

  return (
    <div ref={ref}>
      <Card mode={'dark'} className={classes.wrapper}>
        {links.map((link) => (
          <Row key={link.name}>
            <a href={link.route} target='_blank' rel='noreferrer'>
              <Row className={classes.listItem}>
                <link.Icon />
                <Typography variant={'navlink'} text={link.name} />
              </Row>
            </a>
          </Row>
        ))}
      </Card>
    </div>
  );
};
