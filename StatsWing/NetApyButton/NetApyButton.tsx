import React, { FC } from 'react';

import { useMediaBrakepoint } from '@minterest-finance/ui-kit';

import { NetApyButtonActive } from './NetApyButtonActive';
import { NetApyButtonActiveMobile } from './NetApyButtonActiveMobile';
import { NetApyButtonLoading } from './NetApyButtonLoading';
import { NetApyButtonLoadingMobile } from './NetApyButtonLoadingMobile';
import { NetApyButtonNotActive } from './NetApyButtonNotActive';
import { NetApyButtonNotActiveMobile } from './NetApyButtonNotActiveMobile';
import { NetApyButtonOff } from './NetApyButtonOff';
import { NetApyButtonOffMobile } from './NetApyButtonOffMobile';

export const NetApyButton: FC<{
  netApyValue: string;
  connected: boolean;
  onConnectClick?: () => void;
  isLoading?: boolean;
  isActive?: boolean;
}> = ({ connected, onConnectClick, netApyValue, isLoading, isActive }) => {
  const { isMobile } = useMediaBrakepoint();
  const ActiveButton = isMobile ? NetApyButtonActiveMobile : NetApyButtonActive;
  const OffButton = isMobile ? NetApyButtonOffMobile : NetApyButtonOff;
  const NotActiveButton = isMobile
    ? NetApyButtonNotActiveMobile
    : NetApyButtonNotActive;
  const LoadingButton = isMobile
    ? NetApyButtonLoadingMobile
    : NetApyButtonLoading;
  if (isLoading) return <LoadingButton />;
  if (connected && isActive) return <ActiveButton netApyValue={netApyValue} />;
  if (connected) return <NotActiveButton />;
  return <OffButton onConnectClick={onConnectClick} />;
};
