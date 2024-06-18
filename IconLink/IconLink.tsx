import React, { FC } from 'react';

import classNames from 'classnames';

interface IconLinkProps {
  className?: string;
  to: string;
  IconComponent: FC;
  onLinkClick?: () => void;
}

const IconLink: FC<IconLinkProps> = ({
  className,
  to,
  IconComponent,
  onLinkClick,
}) => {
  const linkClass = classNames(className);

  return (
    <a
      href={to}
      onClick={onLinkClick}
      className={linkClass}
      target='_blank'
      rel='noopener noreferrer'
    >
      <IconComponent />
    </a>
  );
};

export default IconLink;
