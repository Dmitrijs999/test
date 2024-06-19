import React, { useMemo } from 'react';

import { Col, useMediaValue } from '@minterest-finance/ui-kit';

import BDRBoost from './components/BDRBoost/BDRBoost';
import BDRComissions from './components/BDRComissions/BDRCommissions';
import { RowToCol } from './components/Commons';
import MintyRewards from './components/MintyReward/MintyRewards';
import MintyStaking from './components/MintyStaking/MintyStaking';
import MntVesting from './components/MntVesting/MntVesting';
import NFTRewardBoost from './components/NFTRewardBoost/NFTRewardBoost';
import PortfolioDistribution from './components/PortfolioDistribution';
import TotalNetAPYChart from './components/TotalNetAPYChart/TotalNetAPYChart';
import TotalReturnsChart from './components/TotalReturnsChart/TotalReturnsChart';
import TransactionHistory from './components/TransactionHistory/TransactionHistory';
import UserPositionTable from './components/UserPositionTable/Table';
import { Container, Content, HelmetMeta } from 'common';
import { GaugeWrapper } from 'common/Gauges/Wrapper/Wrapper';
import config from 'config';
import AutostakingMntModal from 'containers/AutostakingMntModal/AutostakingMntModal';
import CollateralModal from 'containers/CollateralModal/CollateralModal';
import StakeMntModal from 'containers/StakeMntModal/StakeMntModal';
import WithdrawMntModal from 'containers/WithdrawMntModal/WithdrawMntModal';
import WithdrawMantleModal from 'containers/WithdrawTaikoModal/WithdrawTaikoModal';
import {
  selectMarketTransaction,
  selectUserAddress,
  useGetUserDataQuery,
} from 'features';
import { useAppSelector } from 'features/store';

const TotalReturns = () => {
  const marginBottom = useMediaValue('24px', '32px', '0');
  const marginRight = useMediaValue('0', '0', '23.5px');

  return (
    <Col
      style={{
        flex: 1,
        marginRight,
        marginBottom,
      }}
    >
      <TotalReturnsChart />
    </Col>
  );
};

const DashboardScreen: React.FC = () => {
  const spacing = useMediaValue('32px', '32px', '40px');
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: userData } = useGetUserDataQuery(
    { accountAddress },
    { skip: !accountAddress }
  );

  const transaction = useAppSelector(selectMarketTransaction);

  const isOpen = useMemo(() => {
    return transaction?.opened;
  }, [transaction]);

  const userParticipate = userData?.participating === true;
  const userVesting = !!userData?.vesting?.end;

  const showMNTVesting = useMemo(() => {
    if (userData && userData?.vesting) {
      //TODO: Return this if it will needed
      // const endDate = new Date(userData.vesting.end * 60 * 1000);
      // const expired = endDate.getTime() < new Date().getTime();
      return userVesting && config.FEATURE.MNT_VESTING;
    }
    return false;
  }, [userData, userVesting]);

  // FIXME MANTLE: uncomment when finalize logic of when we show `Rewards` block.
  // const { data: userMntBalance } = useGetMntWithdrawDataQuery(accountAddress, {
  //   skip: !accountAddress,
  // });
  //
  // const userWhitelisted = userData?.isWhitelisted === true;

  // const showMNTRewards = useMemo(() => {
  //   if (userMntBalance) {
  //     const userFunds = BigNumber.from(0)
  //       .add(userMntBalance.userBuyBackStaked)
  //       .add(userMntBalance.userMntAccruedDistribution)
  //       .add(userMntBalance.userVestingRelesable);
  //     return (
  //       (userFunds.gt(0) || userWhitelisted || userVesting) &&
  //       config.FEATURE.MNT_REWARDS
  //     );
  //   }
  //   return false;
  // }, [userWhitelisted, userVesting, userMntBalance]);

  const highlightClaimableMintyTokens = useMemo(() => {
    return !userParticipate;
  }, [userParticipate]);

  const blockSpacing = useMediaValue('24px', '32px', '40px');
  if (!accountAddress) {
    return null;
  }

  return (
    <Container>
      <HelmetMeta
        title='Dashboard | Minterest'
        description='Easy-to-use lending &#38; borrowing dashboard that allows for Minterest protocol function usage.'
        canonical='https://minterest.com/dashboard'
      />
      <Content style={{ alignItems: 'center', overflowX: 'visible' }}>
        <GaugeWrapper isOpen={isOpen} />

        <UserPositionTable />
        <MintyRewards active={highlightClaimableMintyTokens} />
        <MintyStaking />
        <MntVesting active={showMNTVesting} />
        <BDRBoost />
        <BDRComissions />
        {(config.FEATURE.TOTAL_RETURNS_CHART ||
          config.FEATURE.TOTAL_NETAPY_CHART) && (
          <RowToCol
            style={{
              marginTop: blockSpacing,
              overflowX: 'hidden',
            }}
          >
            {config.FEATURE.TOTAL_RETURNS_CHART && <TotalReturns />}
            <Col style={{ flex: 1 }}>
              {config.FEATURE.TOTAL_NETAPY_CHART && <TotalNetAPYChart />}
            </Col>
          </RowToCol>
        )}
        <RowToCol
          style={{
            marginTop: blockSpacing,
          }}
        >
          <NFTRewardBoost />
        </RowToCol>
        {config.FEATURE.PORTFOLIO && (
          <Col
            style={{
              marginTop: blockSpacing,
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            <PortfolioDistribution />
          </Col>
        )}
        <TransactionHistory accountAddress={accountAddress} mb={spacing} />
      </Content>
      <StakeMntModal />
      <WithdrawMntModal />
      <WithdrawMantleModal />
      <AutostakingMntModal />
      <CollateralModal />
    </Container>
  );
};

export default DashboardScreen;
