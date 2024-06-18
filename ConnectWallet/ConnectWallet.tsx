import React, { FC, useState } from 'react';

import {
  ContainedButton,
  Row,
  Typography,
  ButtonBase,
} from '@minterest-finance/ui-kit';
import { useConnectWallet } from '@web3-onboard/react';
import { useTranslation } from 'react-i18next';

import { WalletMenu } from './components/WalletMenu/WalletMenu';
import { ArrowDownSvg } from 'assets/svg';
import { selectCurrentWallet, selectUserAddress } from 'features';
import { useAppSelector } from 'features/store';
import { useConnect } from 'features/wallet';
import { WalletProviders } from 'types';
import { displayTruncated } from 'utils';

const ConnectWallet: FC = () => {
  const connect = useConnect();
  const [openMenu, setMenuOpened] = useState(false);
  const { t } = useTranslation();
  const [{ wallet }] = useConnectWallet();

  const selectedWallet = useAppSelector(selectCurrentWallet);
  const currentAccountId = useAppSelector(selectUserAddress);

  const onCloseMenu = () => setMenuOpened(false);

  const handleClick = () => connect();

  const onConnectedWalletPress: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    // TODO: need to be fixed, double event on button click till menu opened
    e.stopPropagation();
    setMenuOpened((prev) => !prev);
  };

  if (selectedWallet && currentAccountId) {
    return (
      <>
        {openMenu && <WalletMenu onClose={onCloseMenu} />}
        <ButtonBase
          sx={{
            width: 160,
            height: 36,
            background: 'rgba(83, 110, 135, 0.08)',
            border: '1px solid rgba(83, 110, 135, 0.08)',
            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.06)',
            padding: '8px 16px',
            borderRadius: '2px',
          }}
          onClick={onConnectedWalletPress}
        >
          <Row
            style={{
              width: '100%',
              alignItems: 'center',
            }}
          >
            <selectedWallet.logo
              width={12}
              height={12}
              style={{ marginRight: '11px' }}
            />
            <Typography
              style={{ color: '#FCFDFF', marginRight: '3px' }}
              variant='copyM'
              text={displayTruncated(
                wallet?.label === WalletProviders.UnstoppableDomains
                  ? (wallet.instance as { user: { sub: string } }).user.sub
                  : currentAccountId,
                4,
                4
              )}
            />
            <ArrowDownSvg />
          </Row>
        </ButtonBase>
      </>
    );
  }
  return (
    <ContainedButton
      color='info'
      size='medium'
      title={t('header.button')}
      sx={{ width: 160, height: 36 }}
      onClick={handleClick}
    >
      {t('header.button')}
    </ContainedButton>
  );
};

export default ConnectWallet;
