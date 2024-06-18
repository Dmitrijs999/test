import React, { SVGProps } from 'react';

import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

export type SkeletonRectProps = IContentLoaderProps & {
  rectProps?: SVGProps<SVGRectElement>;
};

const SkeletonRect: React.FC<SkeletonRectProps> = ({
  width = 120,
  height = 32,
  rectProps = {},
  ...rest
}) => (
  <ContentLoader width={width} height={height} {...rest}>
    <rect width={width} rx='4' ry='4' height={height} {...rectProps} />
  </ContentLoader>
);

export default SkeletonRect;
