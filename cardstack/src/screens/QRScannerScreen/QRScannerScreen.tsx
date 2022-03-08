import React, { useState } from 'react';
import {
  QRCodeScanner,
  QRScannerContainer,
  RequestQRCode,
  ScannerScreenMode,
} from './components';

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
