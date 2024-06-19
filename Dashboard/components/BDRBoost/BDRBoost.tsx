import React, { FC } from 'react';

import {
  Card,
  InnerCard,
  Col,
  Row,
  Typography,
  useMediaBrakepoint,
  useMediaValue,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { BDRBoostPercent } from './BDRBoostPercent';
import { BDRDescription } from './BDRDescription';
import { BDRTimeRemaining } from './BDRTimeRemaining';
import {
  selectUserAddress,
  useGetLiquidityProviderAgreementQuery,
} from 'features';
import { useAppSelector } from 'features/store';

const BDRBoost: FC = () => {
  const { t } = useTranslation();
  const { isDesktop, isMobile } = useMediaBrakepoint();
  const accountAddress = useAppSelector(selectUserAddress);

  const { data } = useGetLiquidityProviderAgreementQuery(
    accountAddress as string,
    {
      skip: !accountAddress,
    }
  );

  const Content = isDesktop ? Row : Col;
  const paperMarginTop = useMediaValue('24px', '32px', '40px');

  const PaperContent = isMobile ? Col : Row;

  const marginLeft = useMediaValue('0', '0', '16px');
  const marginRight = useMediaValue('0', '16px', '0');
  const innerPaperMarginTop = useMediaValue('16px', '24px', '0');
  const cardHeaderMarginBottom = useMediaValue('28px', '28px', '36px');

  if (!data?.isActive) return null;

  const { endTimestamp, liquidityProviderBoost } = data;

  return (
    <Card
      sx={{
        marginTop: paperMarginTop,
        width: '100%',
      }}
    >
      <Typography
        style={{ marginBottom: cardHeaderMarginBottom }}
        variant='cardHeader'
        text={t('dashboard.BDRBoost.title')}
      />
      <Content style={{ display: 'flex', flex: 1 }}>
        <BDRDescription />
        <PaperContent style={{ display: 'flex', flex: 1 }}>
          <InnerCard
            style={{
              flex: 1,
              marginLeft,
              marginRight,
              textAlign: 'center',
              marginTop: innerPaperMarginTop,
            }}
          >
            <BDRBoostPercent liquidityProviderBoost={liquidityProviderBoost} />
          </InnerCard>
          <InnerCard
            style={{
              flex: 1,
              marginLeft,
              marginTop: innerPaperMarginTop,
              justifyContent: 'space-between',
            }}
          >
            <BDRTimeRemaining endTimestamp={endTimestamp} />
          </InnerCard>
        </PaperContent>
      </Content>
    </Card>
  );
};

export default BDRBoost;
