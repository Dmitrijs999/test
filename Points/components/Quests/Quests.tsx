import React, { useEffect, useMemo, useState } from 'react';

import {
  Typography,
  IconButton,
  Card,
  useMediaValue,
  useTheme,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './Quests.module.scss';
import { ExplorerIcon, MINTSIcon, WarningIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import { evmType, selectUserAddress, useGetUserNFTQuery } from 'features';
import { useAppSelector } from 'features/store';
import { useGetConversionsQuery } from 'features/thirdPartyApi/apis/fuulApi';
import { ConversionsSlug } from 'features/thirdPartyApi/constants';
import { getQuestTranslation, parseSlug } from 'features/thirdPartyApi/utils';
import { pickBy } from 'utils';
import { LINKS } from 'utils/constants';

const DUMMY_LIST: QuestItem[] = [
  { id: '5414d432-ac22-4c70-5432-43d56683c434' },
  { id: '3214d543-ac22-4c70-5432-23d56683c123' },
  { id: '4324dc33-ac22-4c70-5436-43d56683c564' },
  { id: '6544dc33-ac22-4c70-7655-32345683c543' },
];

type QuestItem = {
  id: string;
  name?: string;
  points?: number;
  tokenSymbol?: string;
};

const LIMIT = 5;

export const Quests: React.FC = () => {
  const [count, setCount] = useState<null | number>(null);

  const theme = useTheme();
  const [t] = useTranslation();
  const [_list, setList] = useState<QuestItem[]>([]);
  const accountAddress = useAppSelector(selectUserAddress);

  const tableTitleMB = useMediaValue(12, 20, 28);
  const tPadding = useMediaValue(16, 24, 32);
  const rowHeight = useMediaValue(53, 56, 58);

  const {
    data,
    isLoading,
    isFetching: isRequestFetching,
  } = useGetConversionsQuery();

  const list = useMemo<QuestItem[]>(
    () => (isLoading ? DUMMY_LIST : _list),
    [_list, isLoading]
  );

  const isFetching = isLoading || isRequestFetching;
  const {
    data: nftDataArr,
    isLoading: isNftLoading,
    isFetching: isNftRequestFetching,
  } = useGetUserNFTQuery(accountAddress as string, {
    skip: !accountAddress,
  });

  const hasNFT = !!nftDataArr?.length;
  const isFetchingNft = isNftLoading || isNftRequestFetching;

  useEffect(() => {
    if (!data || isFetching || isFetchingNft) return;
    const questItems = data
      .filter((conversion) => {
        const slug = conversion.slug as ConversionsSlug;
        const { network } = parseSlug(slug);
        return !!conversion.action_args && network === evmType;
      })
      .map((conversion) => {
        const slug = conversion.slug as ConversionsSlug;
        const { tokenSymbol } = parseSlug(slug);

        const result = {
          id: conversion.id,
          name: getQuestTranslation(slug, t),
          points: 0,
          tokenSymbol,
        };
        if (conversion.action_args.referral_amount) {
          result.points = Number(conversion.action_args.referral_amount) * 100;
        } else if (conversion.action_args.payout_groups.length > 0) {
          //TODO: taiko test tiers when nfts are available
          if (hasNFT) {
            const activeNft = nftDataArr?.find((nft) => nft.isActive);
            if (activeNft) {
              const nftTier = conversion.action_args.payout_groups.find(
                (payoutGroup) =>
                  payoutGroup['name'] === 'Tier ' + activeNft.tier
              );
              if (nftTier) {
                result.points =
                  Number(nftTier.end_user_amount_percentage) * 100;
                return result;
              }
            }
          }
          const defaultTier = conversion.action_args.payout_groups.find(
            (payoutGroup) => payoutGroup['name'] === 'Default'
          );
          if (defaultTier)
            result.points =
              Number(defaultTier.end_user_amount_percentage) * 100;
        }

        return result;
      });
    setList(questItems);
    setCount(questItems?.length ?? 0);
  }, [data, nftDataArr]);

  const handleClick = (tokenSymbol: string) => {
    const newPath = `market/m${tokenSymbol.toLowerCase()}`;
    window.open(newPath, '_blank');
  };

  const shouldHideFooter = (list.length ?? 0) <= 5;
  const listHeight = useMemo(() => {
    const _count = isLoading ? DUMMY_LIST.length : count;

    const paddingTop = 32;
    const paddingBottom = 32;
    const extraHeight = 50;
    if (_count) {
      const c = _count < LIMIT ? _count : LIMIT;
      const allListHeight =
        rowHeight * c +
        tableTitleMB +
        paddingBottom +
        extraHeight +
        paddingBottom;
      return allListHeight;
    }
    return rowHeight + tableTitleMB + paddingBottom + paddingTop;
  }, [isLoading, count, rowHeight, shouldHideFooter]);
  return (
    <Card
      sx={{
        width: '100%',
        mb: '0px',
        overflow: 'hidden', // prevent items border overlow
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
        marginTop: '40px !important',
        height: `${listHeight}px !important`,
      }}
    >
      <div
        style={{
          marginBottom: `${tableTitleMB}px`,
          marginLeft: `${tPadding}px`,

          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Typography
          text={t('points.leaderboard.header')}
          variant='cardHeader'
        />
        <MINTSIcon className={classes.headerIcon} />
        <Typography
          text={t('points.leaderboard.mints')}
          variant='cardHeader'
          style={{
            color: pickBy(theme.palette.customTheme, {
              taiko: '#E91898',
              ethereum: '#04797F',
            }),
          }}
        />
        <IconButton
          onClick={() => window.open(LINKS.minterest.points.howToEarn)}
          disableTouchRipple
          sx={{
            justifyContent: 'flex-end',
            marginLeft: 'auto',
            marginRight: `${tPadding}px`,
            padding: '0px !important',
            '&:hover': { background: 'inherit' },
          }}
          variant='text'
          size='medium'
          endIcon={
            <ExplorerIcon
              width={16}
              height={16}
              className={pickBy(theme.palette.customTheme, {
                taiko: classes.linkIconTaiko,
                ethereum: classes.linkIconEthereum,
              })}
            />
          }
        >
          <Typography
            variant={'copyMBold'}
            text={t('points.quests.learnMore')}
            style={{
              color: pickBy(theme.palette.customTheme, {
                taiko: '#E91898',
                ethereum: '#04797F',
              }),
              textTransform: 'none',
            }}
          />
        </IconButton>
      </div>
      <div className={classes.questsRows}>
        {list.map(({ id, name, tokenSymbol, points }, index) => (
          <div
            key={id}
            className={classes.questRowContainer}
            role='button'
            tabIndex={0}
            onClick={() => handleClick(tokenSymbol)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClick(tokenSymbol);
              }
            }}
          >
            <div
              className={classes.questRow}
              style={{
                height: `${rowHeight}px`,
                margin: `0 ${tPadding}px`,
                borderBottom:
                  index !== list.length - 1
                    ? '1px solid rgba(224, 224, 224, 1)'
                    : 'none',
              }}
            >
              {isFetching && (
                <>
                  <SkeletonRect></SkeletonRect>
                  <SkeletonRect></SkeletonRect>
                </>
              )}
              {!isFetching && (
                <>
                  <div>
                    <Typography variant={'copyMBold'}>{name}</Typography>
                  </div>
                  <div>
                    <Typography variant={'copyMBold'}>
                      {points}
                      {t('points.quests.condition')}
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {!isFetching && list.length === 0 && (
          <div className={classes.questRowContainer}>
            <div
              className={classes.noRowsOverlay}
              style={{
                marginTop: `${tPadding}px`,
                marginLeft: `${tPadding}px`,
                marginRight: `${tPadding}px`,
              }}
            >
              <WarningIcon
                className={classes.warningIcon}
                width={20}
                height={20}
              />
              <Typography
                className={classes.text}
                variant='copyM'
                text={t('points.quests.noRows')}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
