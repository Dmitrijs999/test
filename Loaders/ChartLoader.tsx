import React from 'react';

import { SkeletonRect } from 'common';

type CartLoaderProps = {
  width: string | number;
  height: number;
  className?: string;
};

const ChartLoader: React.FC<CartLoaderProps> = ({
  width,
  height,
  className,
}) => {
  return (
    <SkeletonRect
      className={className}
      width={width}
      height={height}
      rectProps={{ rx: 4, ry: 4 }}
    />
  );
};

export default ChartLoader;
