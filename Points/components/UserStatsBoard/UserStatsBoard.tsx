import React, { useEffect, useState } from 'react';

import {
  Typography,
  useMediaBrakepoint,
  useMediaValue,
  useTheme,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import classes from './UserStatsBoard.module.scss';
import { MintsBackground, MINTSIcon } from 'assets/svg';
import ConnectWallet from 'containers/ConnectWallet/ConnectWallet';
import { selectUserAddress } from 'features';
import { useAppSelector } from 'features/store';
import { useGetPointsLeaderboardQuery } from 'features/thirdPartyApi';
import { displayTruncated, getColorFromHash, pickBy } from 'utils';

type UserStatsBoard = {
  rank: number;
  totalMints: string;
  mintsGain: string;
  backgroundStartColor: string;
  backgroundEndColor: string;
};

export const UserStats: React.FC = () => {
  const { isTablet, isDesktop, isMobile } = useMediaBrakepoint();
  const useStatsPadding = useMediaValue(16, 24, 32);
  const accountAddress = useAppSelector(selectUserAddress);
  const [userStats, setUserStats] = useState<UserStatsBoard | undefined>();

  const containerClass = classNames(classes.userStats, {
    [classes.tablet]: isTablet,
    [classes.desktop]: isDesktop,
    [classes.mobile]: isMobile,
  });
  const [t] = useTranslation();
  const theme = useTheme();

  const now = DateTime.now();
  const from = now.set({ hour: 5, minute: 0, second: 0, millisecond: 0 });
  const to = from.plus({ days: 1 });

  const { data: allData } = useGetPointsLeaderboardQuery(
    {
      user_address: accountAddress,
    },
    { skip: !accountAddress }
  );

  const { data } = useGetPointsLeaderboardQuery(
    {
      user_address: accountAddress,
      from: from.toJSDate(),
      to: to.toJSDate(),
    },
    { skip: !accountAddress }
  );

  useEffect(() => {
    if (!data || !allData) return;

    setUserStats({
      ...userStats,
      rank: allData.results[0]?.rank,
      totalMints: allData.results[0]?.total_amount,
      mintsGain: data.results[0]?.total_amount,
    });
  }, [data, allData]);

  useEffect(() => {
    if (!accountAddress) return;
    const backgroundStartColor = getColorFromHash(
      accountAddress + '1',
      'rgb(255, 110, 127)',
      'rgb(230, 100, 101)'
    );
    const backgroundEndColor = getColorFromHash(
      accountAddress + '2',
      'rgb(145, 152, 229)',
      'rgb(247, 187, 151)'
    );
    setUserStats({
      ...userStats,
      backgroundStartColor,
      backgroundEndColor,
    });
  }, [accountAddress]);

  return (
    <div
      className={containerClass}
      style={{
        padding: `${useStatsPadding}px`,
        background: pickBy(theme.palette.customTheme, {
          taiko: '#E91898',
          ethereum: '#04797F',
        }),
      }}
    >
      <div
        className={classes.background}
        style={{
          backgroundImage: `url(${MintsBackground})`,
        }}
      ></div>
      <div className={classes.user}>
        {accountAddress &&
        userStats?.backgroundStartColor &&
        userStats?.backgroundEndColor ? (
          <div className={classes.infoValue}>
            <div
              className={classes.userIcon}
              style={{
                background: `linear-gradient(90deg, ${userStats.backgroundStartColor}, ${userStats.backgroundEndColor})`,
              }}
            ></div>
            <Typography variant={'copyLBold'}>
              {displayTruncated(accountAddress, 6, 4)}
            </Typography>
          </div>
        ) : (
          <>
            <Typography variant={'copyM'}>
              {t('points.userStats.connectUser')}
            </Typography>
            <ConnectWallet />
          </>
        )}
      </div>
      <div className={classes.rank}>
        <Typography variant={'copyM'}>{t('points.userStats.rank')}</Typography>
        <div className={classes.infoValue}>
          <Typography variant={'copyLBold'}>
            {accountAddress && userStats?.rank ? (
              <># {userStats.rank}</>
            ) : (
              <>-</>
            )}
          </Typography>
        </div>
      </div>
      <div className={classes.totalMints}>
        <Typography variant={'copyM'}>
          {t('points.userStats.totalMints')}
        </Typography>
        <div className={classes.infoValue}>
          {accountAddress && userStats?.totalMints ? (
            <>
              <MINTSIcon width={16} height={16} />
              <Typography variant={'copyLBold'}>
                {userStats.totalMints}
              </Typography>
            </>
          ) : (
            <Typography variant={'copyLBold'}>-</Typography>
          )}
        </div>
      </div>
      <div className={classes.mintsGain}>
        <Typography variant={'copyM'}>
          {t('points.userStats.mintsGain')}
        </Typography>
        <div className={classes.infoValue}>
          {accountAddress && userStats?.mintsGain ? (
            <>
              <MINTSIcon width={16} height={16} />
              <Typography variant={'copyLBold'}>
                {userStats.mintsGain}
              </Typography>
            </>
          ) : (
            <Typography variant={'copyLBold'}>-</Typography>
          )}
        </div>
      </div>
    </div>
  );
};
