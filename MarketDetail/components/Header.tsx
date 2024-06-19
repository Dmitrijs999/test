import React, { FC, useCallback, useMemo } from 'react';

import {
  TransactionButton,
  Row,
  Col,
  Typography,
  useMediaBrakepoint,
  useMediaValue,
  TooltipWrapper,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import WalletBalance from './WalletBalance';
import { DefaultTokenIcon } from 'assets/svg';
import config from 'config';
import {
  selectUserAddress,
  useGetUserDataQuery,
  usePausedOperationDetector,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import { createMarketTransaction } from 'features/transactions';
import { ExtMarketMeta, MarketTransactionType } from 'types';

const Header: FC<{
  marketMeta?: ExtMarketMeta;
}> = ({ marketMeta }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isMobile } = useMediaBrakepoint();
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: userData } = useGetUserDataQuery(
    { accountAddress },
    { skip: !accountAddress }
  );
  const { isMarketOperationPaused } = usePausedOperationDetector();
  const openTransaction = useCallback(
    (type: MarketTransactionType) => {
      dispatch(createMarketTransaction({ type, symbol: marketMeta?.symbol }));
    },
    [marketMeta]
  );

  const isLendDisabled = useMemo(() => {
    return (
      !userData?.isWhitelisted ||
      isMarketOperationPaused(marketMeta, 'supply') ||
      !config.FEATURE.LEND.includes(marketMeta?.symbol)
    );
  }, [userData, isMarketOperationPaused]);

  const isBorrowDisabled = useMemo(() => {
    return (
      !userData?.isWhitelisted ||
      isMarketOperationPaused(marketMeta, 'borrow') ||
      !config.FEATURE.BORROW.includes(marketMeta?.symbol)
    );
  }, [userData, isMarketOperationPaused]);

  // todo delete after public release
  const tooltipAvailable = useMemo(() => {
    if (!userData) return false;
    return !userData.isWhitelisted;
  }, [userData]);

  const onLendClick = useCallback(() => {
    if (isLendDisabled) return;
    openTransaction('supply');
  }, [isLendDisabled, openTransaction]);

  const onBorrowClick = useCallback(() => {
    if (isBorrowDisabled) return;
    openTransaction('borrow');
  }, [isBorrowDisabled, openTransaction]);

  const paddingBottom = useMediaValue('36px', '25px', '43px');
  const iconSize = useMediaValue('56px', '56px', '64px');
  const Container = useMediaValue(Col, Row, Row);

  const Icon = marketMeta?.icon || DefaultTokenIcon;

  return (
    <Container
      style={{
        paddingBottom,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'unset' : 'center',
      }}
    >
      {/*FIXME MANTLE: FIX STYLES BY FE DEV*/}
      <Row
        style={
          isMobile
            ? { alignItems: 'center', flex: 1, order: 2, marginTop: '3rem' }
            : { alignItems: 'center', flex: 1 }
        }
      >
        <Icon
          style={{ width: iconSize, height: iconSize, marginRight: '16px' }}
        />
        <Col>
          <Typography
            variant={'h2'}
            style={{ color: '#FCFDFF' }}
            text={marketMeta?.name}
          />
          {accountAddress && (
            <WalletBalance
              marketMeta={marketMeta}
              accountAddress={accountAddress}
            />
          )}
        </Col>
      </Row>
      <Row
        style={
          isMobile
            ? {
                order: 3,
                justifyContent: 'space-between',
                marginTop: '38px',
                flex: 1,
              }
            : { flex: 1, justifyContent: 'flex-end' }
        }
      >
        <div
          style={
            isMobile
              ? { display: 'flex', justifyContent: 'space-between', flex: 1 }
              : {}
          }
        >
          {' '}
          <TooltipWrapper
            title={t('tooltips.nftHoldersCanUse')}
            withoutIcon
            disableTouchListener={!tooltipAvailable}
            disableFocusListener={!tooltipAvailable}
            disableHoverListener={!tooltipAvailable}
            style={{
              flex: 1,
              width: isMobile ? '100% !important' : 'unset',
            }}
          >
            <TransactionButton
              disabled={isLendDisabled}
              vr='primary'
              size='medium'
              onClick={onLendClick}
              aria-hidden='true'
              key={`basic_operation_button_lend`}
              sx={{
                mr: '16px',
                flex: 1,
              }}
            >
              {t('basicOperations.lend.buttonTitle')}
            </TransactionButton>
          </TooltipWrapper>
          <TooltipWrapper
            title={t('tooltips.nftHoldersCanUse')}
            withoutIcon
            disableTouchListener={!tooltipAvailable}
            disableFocusListener={!tooltipAvailable}
            disableHoverListener={!tooltipAvailable}
            style={{
              flex: 1,
              width: isMobile ? '100% !important' : 'unset',
            }}
          >
            <TransactionButton
              disabled={isBorrowDisabled}
              onClick={onBorrowClick}
              size='medium'
              vr='secondary'
              aria-hidden='true'
              key={`basic_operation_button_borrow`}
              sx={{ flex: 1 }}
            >
              {t('basicOperations.borrow.buttonTitle')}
            </TransactionButton>
          </TooltipWrapper>
        </div>
      </Row>
    </Container>
  );
};

export default Header;

// <div class="css-1xhj18k" style="padding-bottom: 25px; width: 100%; display: flex; justify-content: space-between; align-items: center;"><div class="css-1xhj18k" style="align-items: center;flex: 1;"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 56px; height: 56px; margin-right: 16px;"><path d="M16 32C24.8667 32 32 24.8667 32 16C32 7.13328 24.8667 0 16 0C7.13328 0 0 7.13328 0 16C0 24.8667 7.13328 32 16 32Z" fill="#2775CA"></path><path d="M20.4 18.5333C20.4 16.2 19 15.4 16.2 15.0667C14.2 14.8 13.8 14.2667 13.8 13.3333C13.8 12.3998 14.4667 11.8 15.8 11.8C17 11.8 17.6667 12.2 18 13.2C18.0667 13.4 18.2667 13.5333 18.4667 13.5333H19.5333C19.8 13.5333 20 13.3333 20 13.0667V13C19.7333 11.5333 18.5333 10.4 17 10.2667V8.66672C17 8.4 16.8 8.2 16.4667 8.13328H15.4667C15.2 8.13328 15 8.33328 14.9333 8.66672V10.2C12.9333 10.4667 11.6667 11.8 11.6667 13.4667C11.6667 15.6667 13 16.5333 15.8 16.8667C17.6667 17.2 18.2667 17.6 18.2667 18.6667C18.2667 19.7335 17.3333 20.4667 16.0667 20.4667C14.3333 20.4667 13.7333 19.7333 13.5333 18.7333C13.4667 18.4667 13.2667 18.3333 13.0667 18.3333H11.9333C11.6667 18.3333 11.4667 18.5333 11.4667 18.8V18.8667C11.7333 20.5333 12.8 21.7333 15 22.0667V23.6667C15 23.9333 15.2 24.1333 15.5333 24.2H16.5333C16.8 24.2 17 24 17.0667 23.6667V22.0667C19.0667 21.7333 20.4 20.3333 20.4 18.5333Z" fill="white"></path><path d="M12.6 25.5332C7.39999 23.6667 4.73327 17.8667 6.66671 12.7332C7.66671 9.93325 9.86672 7.79997 12.6 6.79997C12.8667 6.66669 13 6.46669 13 6.13325V5.19997C13 4.93325 12.8667 4.73325 12.6 4.66669C12.5333 4.66669 12.4 4.66669 12.3333 4.73325C5.99999 6.73325 2.53326 13.4667 4.53327 19.8C5.73327 23.5332 8.6 26.4 12.3333 27.6C12.6 27.7332 12.8667 27.6 12.9333 27.3332C13 27.2667 13 27.2 13 27.0667V26.1332C13 25.9332 12.8 25.6667 12.6 25.5332ZM19.6667 4.73325C19.4 4.59997 19.1333 4.73325 19.0667 4.99997C19 5.06669 19 5.13325 19 5.26669V6.19997C19 6.46669 19.2 6.73325 19.4 6.86669C24.6 8.73325 27.2668 14.5332 25.3333 19.6667C24.3333 22.4667 22.1333 24.6 19.4 25.6C19.1333 25.7332 19 25.9332 19 26.2667V27.2C19 27.4667 19.1333 27.6667 19.4 27.7332C19.4667 27.7332 19.6 27.7332 19.6667 27.6667C26 25.6667 29.4668 18.9332 27.4668 12.6C26.2668 8.79997 23.3333 5.93325 19.6667 4.73325Z" fill="white"></path></svg><div class="css-j7qwjs"><h2 class="Typography-module_h2__CV8Oo" style="color: rgb(252, 253, 255);">USDC </h2><div class="css-u4p24i"><div class="css-1h5ny02"><svg width="24" height="24" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="16.9521" cy="16.5293" r="16" fill="#FCFDFF"></circle><circle cx="16.9521" cy="16.5293" r="15.5" stroke="#536E87" stroke-opacity="0.08"></circle><rect x="6.95215" y="6.5293" width="20" height="20" fill="url(#pattern0)"></rect><defs><pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="#image0_13719_167529" transform="translate(-0.1 -0.1) scale(0.00376176)"></use></pattern><image id="image0_13719_167529" width="319" height="319" xlink:href="data:image/png;base64,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"></image></defs></svg></div><span class="Typography-module_copyM__jnesG" style="color: rgb(163, 167, 182); margin-right: 5px;">1,200 USDC in your wallet </span><div class="MuiBox-root css-1vben6a" data-mui-internal-clone-element="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#FEFEFE" stroke-opacity="0.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.5 7.5H8V11H8.5" stroke="#FEFEFE" stroke-opacity="0.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.875 6C8.28921 6 8.625 5.66421 8.625 5.25C8.625 4.83579 8.28921 4.5 7.875 4.5C7.46079 4.5 7.125 4.83579 7.125 5.25C7.125 5.66421 7.46079 6 7.875 6Z" fill="#FEFEFE" fill-opacity="0.5"></path><path d="M8.5625 5.25C8.5625 5.6297 8.2547 5.9375 7.875 5.9375C7.4953 5.9375 7.1875 5.6297 7.1875 5.25C7.1875 4.8703 7.4953 4.5625 7.875 4.5625C8.2547 4.5625 8.5625 4.8703 8.5625 5.25Z" stroke="#FEFEFE" stroke-opacity="0.5" stroke-width="0.125"></path></g></svg></div></div></div></div><div class="_wrapper_19lrg_1" style="
// "><button class="_wrapper_ts9m2_1 _active_ts9m2_10"><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.8318 6.39973L14.3089 3.32889C13.8374 3.25588 13.3547 3.21875 12.874 3.21875H12.8666V9.48359H12.874C13.1382 9.48359 13.3993 9.51762 13.6511 9.58442L14.4617 6.53155C14.2544 6.47647 14.044 6.43316 13.8324 6.39973H13.8318ZM11.3636 9.88827L9.80437 7.20223H9.80376C9.61996 7.3093 9.44052 7.42498 9.26915 7.55L7.40732 4.99888C7.79901 4.71303 8.21605 4.45625 8.6467 4.23535L10.0636 7.00114C10.3514 6.85452 10.6496 6.73016 10.9565 6.62989L9.99248 3.67538C10.4534 3.52503 10.9299 3.40994 11.4094 3.33383L11.905 6.45294C11.6953 6.48636 11.4868 6.53216 11.2813 6.58723L12.0882 9.5863C11.8351 9.65436 11.5913 9.75645 11.3636 9.88827ZM4.59826 8.29442L7.41295 9.72744C7.26815 10.0121 7.14505 10.3103 7.04666 10.6141L4.04139 9.64208C4.1905 9.1805 4.37799 8.72694 4.59826 8.29442ZM18.1699 9.42725L15.4845 10.9878C15.617 11.2154 15.7184 11.4592 15.7865 11.7123L18.7856 10.9042C18.8406 11.1096 18.8864 11.3182 18.9198 11.5273L22.039 11.0305C21.9629 10.5509 21.8478 10.0745 21.6968 9.61353L18.7429 10.5794C18.6426 10.2725 18.5183 9.97423 18.371 9.68652L21.1362 8.26775C20.9153 7.83706 20.6585 7.42067 20.3721 7.02898L17.8216 8.89203C17.9466 9.06345 18.0629 9.24289 18.1693 9.42664L18.1699 9.42725ZM17.0744 4.22163L17.0747 4.22176V4.22114L17.0744 4.22163ZM15.7265 3.6655C16.1879 3.81459 16.6414 4.00141 17.0744 4.22163L15.6435 7.03705C15.3583 6.8923 15.06 6.76916 14.7562 6.67138L15.7265 3.6655ZM15.9535 7.14725L14.3763 9.884C14.6046 10.0158 14.815 10.1766 15.0025 10.3635L19.4253 5.92583C19.0825 5.58369 18.7094 5.26625 18.3177 4.98224L16.4937 7.49745C16.3198 7.37122 16.1397 7.25431 15.9535 7.14725ZM10.2592 10.9959L7.52305 9.41741H7.52244C7.63012 9.23178 7.74707 9.05173 7.8733 8.87787L5.35869 7.05256C5.64332 6.66087 5.96071 6.28841 6.3029 5.94561L10.7393 10.3697C10.5525 10.5572 10.391 10.7675 10.2592 10.9959ZM6.90679 10.9092L9.9591 11.7217H9.95845C9.89165 11.9735 9.85762 12.2353 9.85762 12.5001H3.59277C3.59277 12.0181 3.63052 11.5336 3.70415 11.0602L6.77502 11.5385C6.80779 11.327 6.85171 11.1165 6.90679 10.9092ZM18.3351 15.2726L21.1498 16.7056C21.3701 16.2731 21.5575 15.8195 21.7066 15.3579L18.7014 14.3859C18.603 14.6897 18.4799 14.9879 18.3351 15.2726ZM14.3843 15.1117L15.9436 17.7978L15.9442 17.7984C16.128 17.6913 16.3074 17.5756 16.4788 17.4506L18.3406 20.0017C17.9489 20.2876 17.5319 20.5444 17.1013 20.7653L15.6843 17.9995C15.3966 18.1461 15.0984 18.2705 14.7915 18.3707L15.7555 21.3253C15.2945 21.4756 14.8181 21.5907 14.3385 21.6668L13.8429 18.5471C14.0527 18.5136 14.2612 18.4678 14.4666 18.4128L13.6598 15.4137C13.9129 15.3456 14.1566 15.2435 14.3843 15.1117ZM7.57813 15.5727L10.2635 14.0122C10.1311 13.7845 10.0296 13.5407 9.96159 13.2876L6.96248 14.0958C6.9074 13.8903 6.86165 13.6818 6.82823 13.4727L3.70849 13.9695C3.7846 14.4491 3.89968 14.9255 4.05065 15.3865L7.00457 14.4206C7.10479 14.7275 7.22915 15.0257 7.37643 15.3134L4.61124 16.7323C4.83213 17.1629 5.08892 17.5793 5.3754 17.971L7.9259 16.1079C7.80088 15.9365 7.68459 15.7571 7.57813 15.5733V15.5727ZM8.67351 20.7784L8.67327 20.7782V20.7788L8.67351 20.7784ZM8.67351 20.7784C9.10659 20.9986 9.56001 21.1854 10.0215 21.3345L10.9917 18.3286C10.6879 18.2308 10.3897 18.1077 10.1044 17.9629L8.67351 20.7784ZM9.79448 17.8527L9.79462 17.8525L9.79509 17.8527H9.79448ZM9.79462 17.8525L11.3717 15.116C11.1434 14.9842 10.933 14.8234 10.7455 14.6365L6.32329 19.0742C6.66609 19.4164 7.03916 19.7337 7.43085 20.0178L9.2549 17.5025C9.42866 17.6287 9.60852 17.7455 9.79462 17.8525ZM15.4895 14.0041L18.2256 15.5825V15.5832C18.1179 15.7688 18.001 15.9489 17.8747 16.1227L20.3894 17.948C20.1047 18.3397 19.7873 18.7122 19.4451 19.055L15.0093 14.6303C15.1962 14.4428 15.3576 14.2325 15.4895 14.0041ZM12.0968 15.4155V15.4157L12.0962 15.4155H12.0968ZM12.0968 15.4157L11.2863 18.4685C11.4936 18.5235 11.7039 18.5668 11.9156 18.6003L11.4385 21.6711C11.91 21.7441 12.3926 21.7812 12.8734 21.7812H12.8808V15.5164H12.8734C12.6094 15.5164 12.3485 15.4824 12.0968 15.4157ZM15.7896 13.2784C15.8563 13.0267 15.8903 12.7652 15.8904 12.5006H22.1552C22.1552 12.9826 22.1175 13.4671 22.0438 13.9404L18.9736 13.4615C18.9408 13.6731 18.8969 13.8835 18.8418 14.0908L15.7896 13.2784Z" fill="#FCFDFF"></path></svg><span class="Typography-module_copyMBold__oMWpp" style="color: rgb(252, 253, 255);">Mantle </span></button><button class="_wrapper_ts9m2_1"><svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.43555 0.802734V7.23289L10.8704 9.66141L5.43555 0.802734Z" fill="#0F161B" fill-opacity="0.602"></path><path d="M5.43554 0.802734L0 9.66141L5.43554 7.23289V0.802734Z" fill="#0E141A"></path><path d="M5.43555 13.8282V18.1974L10.874 10.6733L5.43555 13.8282Z" fill="#0F161B" fill-opacity="0.602"></path><path d="M5.43554 18.1974V13.8275L0 10.6733L5.43554 18.1974Z" fill="#0E141A"></path><path d="M5.43555 12.8161L10.8704 9.66047L5.43555 7.2334V12.8161Z" fill="#0F161B" fill-opacity="0.2"></path><path d="M0 9.66047L5.43554 12.8161V7.2334L0 9.66047Z" fill="#0F161B" fill-opacity="0.602"></path></svg><span class="Typography-module_copyMBold__oMWpp" style="color: rgb(89, 93, 108);">Ethereum </span></button></div><div class="css-1xhj18k" style="
//     flex: 1;
//     justify-content: flex-end;
//     align-items: flex-end;
// "><div><div class="MuiBox-root css-1vben6a" data-mui-internal-clone-element="true" style="flex: 1 1 0%; width: unset;"><button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium css-xs0y28-MuiButtonBase-root-MuiButton-root" tabindex="0" type="button" vr="primary" aria-hidden="true"><span class="Typography-module_copyLBold__fuksD">Supply </span><span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span></button></div><div class="MuiBox-root css-1vben6a" data-mui-internal-clone-element="true" style="flex: 1 1 0%; width: unset;"><button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium css-hqydfw-MuiButtonBase-root-MuiButton-root" tabindex="0" type="button" vr="secondary" aria-hidden="true"><span class="Typography-module_copyLBold__fuksD">Borrow </span><span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span></button></div>
// </div></div></div>
