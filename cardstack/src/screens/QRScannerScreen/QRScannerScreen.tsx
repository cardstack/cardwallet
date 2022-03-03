import React, { useState } from 'react';
import {
  QRCodeScanner,
  RequestQRCode,
  SWITCH_OPTIONS,
  SWITCH_SELECTOR_TOP,
  SWITCH_SELECTOR_HEIGHT,
  ScannerScreenMode,
} from './components';

import {
  CenteredContainer,
  Container,
  SwitchSelector,
} from '@cardstack/components';

interface QRScannerContainerProps {
  selectedScreen: string;
  onSwitchScreen: (selectedScreen: string) => void;
  children: React.ReactNode;
}

const QRScannerContainer = ({
  children,
  onSwitchScreen,
  selectedScreen,
}: QRScannerContainerProps) => {
  return (
    <Container flex={1}>
      <SwitchSelector
        options={SWITCH_OPTIONS}
        width="60%"
        left="20%"
        height={SWITCH_SELECTOR_HEIGHT}
        onPress={onSwitchScreen}
        value={selectedScreen}
        position="absolute"
        top={SWITCH_SELECTOR_TOP}
        zIndex={1}
      />
      <CenteredContainer
        flexDirection="column"
        height="100%"
        overflow="hidden"
        backgroundColor="transparent"
      >
        {children}
      </CenteredContainer>
    </Container>
  );
};

const QRScannerScreen = () => {
  const [selectedScreen, selectScreen] = useState<string>(
    ScannerScreenMode.SCAN
  );

  return (
    <QRScannerContainer
      selectedScreen={selectedScreen}
      onSwitchScreen={selectScreen}
    >
      {selectedScreen === ScannerScreenMode.SCAN && <QRCodeScanner />}
      {selectedScreen === ScannerScreenMode.REQUEST && <RequestQRCode />}
    </QRScannerContainer>
  );
};

export default QRScannerScreen;
