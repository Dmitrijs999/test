import React, { useMemo } from 'react';

import { pct, TooltipWrapper, Typography } from '@minterest-finance/ui-kit';
import { utils } from 'ethers';
import { useTranslation } from 'react-i18next';

import classes from './MarketTransactionFooter.module.scss';
import { MinterestSmallIcon } from 'assets/svg';
import { Footer, Percentage } from 'common/PopupBuilder';
import {
  getMarketData,
  getUserMarketData,
  useGetMarketsDataQuery,
  useGetUserDataQuery,
} from 'features';
import { ExtMarketMeta, MarketTransactionType } from 'types';

import {
  isBorrowingMethod,
  getInterestRate,
  getMarketMntRewardsAPY,
} from '../helpers';

const MarketTransactionFooter = React.memo<{
  type: MarketTransactionType;
  marketMeta: ExtMarketMeta;
  accountAddress: string;
}>(function MarketTransactionFooterComponent({
  marketMeta,
  type,
  accountAddress,
}) {
  const { t } = useTranslation();
  const { data: userData, isFetching: isUserDataFetching } =
    useGetUserDataQuery({ accountAddress }, { skip: !accountAddress });
  const userMarketData = getUserMarketData(userData, marketMeta.symbol);
  const { data: marketsData, isFetching: isMarketsDataFetching } =
    useGetMarketsDataQuery();
  const marketData = getMarketData(marketsData, marketMeta.symbol);
  const isFetching = isMarketsDataFetching || isUserDataFetching;
  const isBorrowMethod = isBorrowingMethod(type);

  const marketMntRewardsAPY = useMemo(
    () => getMarketMntRewardsAPY(type, userMarketData),
    [userMarketData, type]
  );
  const interestRate = useMemo(
    () => getInterestRate(type, marketData),
    [marketData, type]
  );
  const marketTotalNetAPY = useMemo(() => {
    return isBorrowMethod
      ? marketMntRewardsAPY.sub(interestRate)
      : marketMntRewardsAPY.add(interestRate);
  }, [isBorrowMethod, interestRate, marketMntRewardsAPY]);

  return (
    <Footer
      className={classes.footer}
      title={
        isBorrowMethod
          ? t('basicOperations.footer.borrowingRates')
          : t('basicOperations.footer.lendingRates')
      }
    >
      <Percentage
        isLoading={isFetching}
        Icon={marketMeta.icon}
        title={`${marketMeta.name} ${
          isBorrowMethod
            ? t('basicOperations.footer.borrowingApr')
            : t('basicOperations.footer.lendingApy')
        }`}
        percent={pct(utils.formatUnits(interestRate))}
      />
      <Percentage
        isLoading={isFetching}
        Icon={MinterestSmallIcon}
        LeftComponent={
          <TooltipWrapper
            title={t('basicOperations.footer.mntRewardsApyTooltip')}
          >
            <Typography
              className={classes.title}
              variant='copyS'
              text={t('basicOperations.footer.mntRewardsApy')}
            />
          </TooltipWrapper>
        }
        percent={pct(utils.formatUnits(marketMntRewardsAPY))}
      />
      <Percentage
        isLoading={isFetching}
        LeftComponent={
          <Typography
            className={classes.title}
            variant='copySBold'
            text={t('basicOperations.footer.totalNetApywithRewards')}
          />
        }
        RightComponent={
          <Typography
            variant='copySBold'
            text={pct(utils.formatUnits(marketTotalNetAPY))}
          />
        }
      />
    </Footer>
  );
});

export default MarketTransactionFooter;
