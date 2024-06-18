import React, { FC } from 'react';

import { Row, Typography, Col } from '@minterest-finance/ui-kit';

import classes from './DeviceMenu.module.scss';
import { DropdownLink } from 'types';

export const DeviceMenu: FC<{
  links: DropdownLink[];
}> = ({ links }) => (
  <Col className={classes.wrapper}>
    {links.map((link) => (
      <Row key={link.name}>
        <a href={link.route} target='_blank' rel='noreferrer'>
          <Row className={classes.listItem}>
            <Typography variant={'navlink'} text={link.name} />
          </Row>
        </a>
      </Row>
    ))}
  </Col>
);
