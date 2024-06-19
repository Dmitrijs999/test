import React, { FC, useMemo } from 'react';

import {
  Card,
  PieChartComponent,
  Row,
  useMediaValue,
} from '@minterest-finance/ui-kit';
import { utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  getMarketName,
  selectUserAddress,
  useGetUserDataQuery,
} from 'features';
import { useAppSelector } from 'features/store';
import { IBarGraphPoint } from 'types';
import { expScale } from 'utils/constants';
import MarketListWithFill, {
  DefaultColor,
} from 'utils/constants/configs/portfolioDistributionConfig';

const PortfolioDistribution: FC = () => {
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: userData, isFetching } = useGetUserDataQuery(
    { accountAddress },
    { skip: !accountAddress }
  );

  const history = useHistory();

  const userTotalSupplyUSD = userData?.userTotalSupplyUSD || '0';
  const userTotalBorrowUSD = userData?.userTotalBorrowUSD || '0';

  const config = useMemo(() => {
    const initialConfig = [
      { supply: [] as IBarGraphPoint[] },
      { borrow: [] as IBarGraphPoint[] },
    ];

    if (!userData?.userMarkets?.length) return initialConfig;

    return userData.userMarkets.reduce<
      (
        | {
            supply: IBarGraphPoint[];
            borrow?: undefined;
          }
        | {
            borrow: IBarGraphPoint[];
            supply?: undefined;
          }
      )[]
    >((acc, { userSupplyUSD, symbol, userBorrowUSD }) => {
      const marketColor = MarketListWithFill[symbol] ?? DefaultColor;
      const marketName = getMarketName(symbol);

      if (userSupplyUSD && userTotalSupplyUSD) {
        const value = Number(
          utils.parseUnits(userTotalSupplyUSD).gt(0)
            ? utils.formatUnits(
                utils
                  .parseUnits(userSupplyUSD)
                  .mul(expScale)
                  .div(utils.parseUnits(userTotalSupplyUSD))
              )
            : '0.0'
        );
        if (value) {
          acc[0].supply.push({
            color: marketColor,
            label: marketName,
            percent: value * 100,
          });
        }
      }

      if (userBorrowUSD && userTotalBorrowUSD) {
        const value = Number(
          utils.parseUnits(userTotalBorrowUSD).gt(0)
            ? utils.formatUnits(
                utils
                  .parseUnits(userBorrowUSD)
                  .mul(expScale)
                  .div(utils.parseUnits(userTotalBorrowUSD))
              )
            : '0.0'
        );
        if (value) {
          acc[1].borrow.push({
            color: marketColor,
            label: marketName,
            percent: value * 100,
          });
        }
      }

      return [{ supply: acc[0].supply }, { borrow: acc[1].borrow }];
    }, initialConfig);
  }, [userTotalSupplyUSD, userTotalBorrowUSD, userData]);

  return (
    <Card title={t('dashboard.portfolioDistribution')}>
      <Row
        sx={{
          display: 'flex',
          flexDirection: useMediaValue('column', 'row', 'row'),
          justifyContent: useMediaValue(
            'flex-start',
            'space-around',
            'space-around'
          ),
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          '& >div': { width: 'auto' },
        }}
      >
        <PieChartComponent
          title={t('markets.supply')}
          distribution={config[0].supply}
          onButtonClick={() => history.push('/')}
          isLoading={isFetching}
          emptyStateDescription={t('portfolioDistribution.goToSupplyMarket')}
          innerCircleBackground={'#f3f4f5'}
        />

        <PieChartComponent
          title={t('markets.borrow')}
          distribution={config[1].borrow}
          onButtonClick={() => history.push('/')}
          isLoading={isFetching}
          emptyStateDescription={t('portfolioDistribution.goToBorrowMarket')}
          innerCircleBackground={'#f3f4f5'}
        />
      </Row>
    </Card>
  );
};

export default PortfolioDistribution;
