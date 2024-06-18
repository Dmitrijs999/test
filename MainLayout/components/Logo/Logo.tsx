import React, { FC } from 'react';

import classNames from 'classnames';
import { Link } from 'react-router-dom';

import classes from './Logo.module.scss';
import { LogoSvg } from 'assets/svg';
import { ROUTES } from 'utils/constants';
import { trackerControls } from 'utils/trackers';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className }) => {
  const onLogoClick = () => {
    trackerControls.trackMinterestLogoClick();
  };

  const logoClass = classNames(classes.logo, className);

  return (
    <Link
      onClick={onLogoClick}
      className={logoClass}
      to={ROUTES.main}
      data-testid='logo'
    >
      <LogoSvg />
    </Link>
  );
};

export default Logo;
