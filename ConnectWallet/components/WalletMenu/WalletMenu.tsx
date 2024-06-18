import React, { useRef, useState, useCallback } from 'react';

import {
  Card,
  Row,
  Typography,
  useMediaValue,
  Col,
  useTheme,
} from '@minterest-finance/ui-kit';
import { useConnectWallet } from '@web3-onboard/react';
import { useTranslation } from 'react-i18next';

import { PaperStack, Copied, Leave } from 'assets/svg';
import { DEFAULT_NETWORK, useLogout } from 'features';
import { SVGIcon } from 'types';
import { useOnClickOutside } from 'utils';

type Props = {
  onClose: () => void;
};

type FooterButtonProps = {
  text: string;
  Icon: SVGIcon;
  clickHandler: () => void;
};

const FooterButton: React.FC<FooterButtonProps> = ({
  text,
  Icon,
  clickHandler,
}) => {
  const theme = useTheme();
  return (
    <button style={{ backgroundColor: 'unset' }} onClick={clickHandler}>
      <Row
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant={'copyMBold'}
          text={text}
          style={{ color: theme.palette.txtDarkMain.main }}
        />
        <Icon />
      </Row>
    </button>
  );
};

export const WalletMenu: React.FC<Props> = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const disconnectRef = useRef(null);
  const [{ wallet }] = useConnectWallet();
  const onLogout = useLogout();
  const theme = useTheme();

  const address = wallet?.accounts[0]?.address;

  useOnClickOutside(disconnectRef, () => {
    onClose();
  });

  const onDisconnect = () => {
    onLogout();
    onClose();
  };

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
  }, [address]);

  const renderSvg = copiedAddress ? Copied : PaperStack;
  const renderCopyText = copiedAddress
    ? t('connectWalletPopUp.copied')
    : t('connectWalletPopUp.copyAddress');

  const width = useMediaValue('200px', '275px', '275px');
  const height = useMediaValue('183px', '194px', '197px');
  const pOverride = useMediaValue('', '', '24px !important');
  const mt = useMediaValue(-229, 64, 64);
  const ml = useMediaValue(0, -20, 0);

  return (
    <div ref={disconnectRef}>
      <Card
        mode={'dark'}
        sx={{
          width,
          height,
          position: 'absolute',
          mt: `${mt}px`,
          ml: `${ml}px`,
          zIndex: 12,
          paddingTop: pOverride,
          paddingBottom: pOverride,
        }}
      >
        <Col style={{ justifyContent: 'space-between', height: '100%' }}>
          <Col style={{ gap: '4px' }}>
            <Typography
              variant={'copySBold'}
              text={t('connectWalletPopUp.network')}
              style={{ color: theme.palette.txtDarkSecondary.main }}
            />
            <Typography
              variant={'copyMBold'}
              text={DEFAULT_NETWORK.publicName}
              style={{ color: theme.palette.txtDarkMain.main }}
            />
          </Col>
          <hr
            style={{
              background: '#CAD0D614', // bg/dark/stroke
              color: '#CAD0D614', // bg/dark/stroke
              height: '2px',
              display: 'block',
            }}
          />
          <Col style={{ gap: '16px' }}>
            <FooterButton
              text={renderCopyText}
              Icon={renderSvg}
              clickHandler={onCopy}
            />
            <FooterButton
              text={t('connectWalletPopUp.disconnectWallet')}
              Icon={Leave}
              clickHandler={onDisconnect}
            />
          </Col>
        </Col>
      </Card>
    </div>
  );
};
