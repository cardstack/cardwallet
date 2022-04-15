import React, { memo, useMemo } from 'react';

import {
  Container,
  Icon,
  MainHeader,
  SwitchSelector,
} from '@cardstack/components';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';

import { EmulatorPasteUriButton } from './components/EmulatorPasteUriButton';
import { QRCodeScannerPage, RequestQRCodePage } from './pages';
import { useRequestCodePage } from './pages/RequestQRCode/useRequestCodePage';
import { useQRScannerScreen } from './useQRScannerScreen';

const QRScannerScreen = () => {
  const {
    togglePage,
    isScanSelected,
    isEmulator,
    pages,
  } = useQRScannerScreen();

  const { handleShareLink, safeAddress } = useRequestCodePage();

  const { isTabBarEnabled } = useTabBarFlag();

  const renderRightIcon = useMemo(
    () =>
      isEmulator && isScanSelected ? (
        <EmulatorPasteUriButton />
      ) : safeAddress ? (
        <Icon name="share" size={24} onPress={handleShareLink} />
      ) : undefined,
    [handleShareLink, isEmulator, isScanSelected, safeAddress]
  );

  return (
    <Container flex={1} backgroundColor="backgroundDarkPurple">
      <MainHeader
        backgroundColor={!isTabBarEnabled ? 'transparent' : undefined}
        rightIcon={renderRightIcon}
      >
        <SwitchSelector options={pages} flex={0.7} onPress={togglePage} />
      </MainHeader>
      {isScanSelected ? <QRCodeScannerPage /> : <RequestQRCodePage />}
    </Container>
  );
};

export default memo(QRScannerScreen);
