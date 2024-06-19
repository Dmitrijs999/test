import React from 'react';

import {
  Typography,
  InnerCard,
  useMediaValue,
} from '@minterest-finance/ui-kit';

type Props = {
  text: string;
  title: string;
  isFullScreen?: boolean;
};

const NFTDetailCard = ({
  title,
  text,
  isFullScreen,
}: Props): React.ReactElement => {
  const nftDetailPadding = useMediaValue(
    '17.5px !important',
    '15 !important',
    '24px'
  );
  const titleSize = useMediaValue('16px', '16px', '20px');
  const nftDetailHeight = useMediaValue(87, 126, 149);

  const cardFlexBasic = isFullScreen ? `calc(100%)` : `calc(50% - 12px)`;

  return (
    <InnerCard
      key={title}
      sx={{
        flexShrink: 1,
        flexBasis: cardFlexBasic,
        textAlign: 'center',
        padding: nftDetailPadding,
        height: nftDetailHeight,
        justifyContent: 'center',
      }}
    >
      <Typography
        text={title}
        variant={'copyMBold'}
        style={{
          color: '#595D6C',
        }}
      />
      <Typography
        text={text}
        variant={'copyLBold'}
        style={{ color: '#222A34', fontSize: titleSize }}
      />
    </InnerCard>
  );
};

export default NFTDetailCard;
