import React, { useMemo } from 'react';

import { Col, Row, useMediaValue } from '@minterest-finance/ui-kit';
import { Redirect, useParams } from 'react-router-dom';

import { UserStatsWing } from './components/UserStatsWing/UserStatsWing';
import YieldChart from './components/YieldChart';
import { HelmetMeta, Container, Content, CommonLoader } from 'common';
import { GaugeWrapper } from 'common/Gauges/Wrapper/Wrapper';
import {
  getActiveMarketList,
  getMarketData,
  selectMarketTransaction,
  selectUserAddress,
  useExtendedMarketMeta,
  useGetMarketsDataQuery,
} from 'features';
import { useAppSelector } from 'features/store';
import DetailsPanel from 'screens/MarketDetail/components/DetailsPanel';
import DetailsTable from 'screens/MarketDetail/components/DetailsTable';
import Header from 'screens/MarketDetail/components/Header';
import MarketHistoryChart from 'screens/MarketDetail/components/HistoryYieldChart';
import InterestRateModelChart from 'screens/MarketDetail/components/InterestRateModelChart';
import SupplyBorrowChart from 'screens/MarketDetail/components/SupplyBorrowChart';
import TransactionHistory from 'screens/MarketDetail/components/TransactionHistory/TransactionHistory';
import { ROUTES } from 'utils/constants';

const MarketDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { data: marketsData, isLoading } = useGetMarketsDataQuery();
  const marketData = getMarketData(marketsData, symbol);
  const extMarketMeta = useExtendedMarketMeta(marketData?.meta);
  const userAddress = useAppSelector(selectUserAddress);

  const spacing = useMediaValue('32px', '32px', '40px');
  const mtBetweenCircleAndPanel = useMediaValue('32px', '16px', '23px');
  const Footer = useMediaValue(Col, Col, Row);

  const transaction = useAppSelector(selectMarketTransaction);

  const isOpen = useMemo(() => {
    return transaction?.opened;
  }, [transaction]);

  if (isLoading) {
    return <CommonLoader />;
  }
  // Redirect in case marketsData is fetched but symbol is not included in active markets list
  if (
    marketsData &&
    !getActiveMarketList(marketsData).some((md) => md.meta.symbol === symbol)
  ) {
    return <Redirect to={ROUTES.main} />;
  }

  return (
    <Container>
      <GaugeWrapper isOpen={isOpen} isMarketDetail marketMeta={extMarketMeta} />
      <HelmetMeta
        title={`${extMarketMeta?.name} Market | Minterest`}
        description={`Detailed ${extMarketMeta?.name} market overview, brought to you by Minterest.`}
        canonical='https://minterest.com/market/detail'
      />
      <Content style={{ maxWidth: 'auto', alignItems: 'initial' }}>
        <Header marketMeta={extMarketMeta} />
        <UserStatsWing
          accountAddress={userAddress}
          marketMeta={extMarketMeta}
        />
        <DetailsPanel
          mt={mtBetweenCircleAndPanel}
          mb={'40px'}
          marketMeta={extMarketMeta}
        />

        {userAddress && (
          <YieldChart
            marketMeta={extMarketMeta}
            accountAddress={userAddress}
            mb={spacing}
          />
        )}
        {userAddress && (
          <TransactionHistory
            marketMeta={extMarketMeta}
            accountAddress={userAddress}
            mb={spacing}
          />
        )}
        <SupplyBorrowChart mb={spacing} marketMeta={extMarketMeta} />
        <MarketHistoryChart mb={spacing} marketMeta={extMarketMeta} />
        <Footer
          style={{
            width: '100%',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <InterestRateModelChart
            spacing={spacing}
            marketMeta={extMarketMeta}
          />
          <DetailsTable marketMeta={extMarketMeta} />
        </Footer>
      </Content>
    </Container>
  );
};

export default MarketDetail;
