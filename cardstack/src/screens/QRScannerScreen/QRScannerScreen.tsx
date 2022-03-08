import React, { useCallback, useState } from 'react';
import {
  QRCodeScanner,
  QRScannerContainer,
  RequestQRCode,
  ScannerScreenMode,
} from './components';
import { SwitchSelectorOption } from '@cardstack/components';

const QRScannerScreen = () => {
  const [selectedScreen, selectScreen] = useState<ScannerScreenMode>(
    ScannerScreenMode.SCAN
  );

  const onSwitchScreen = useCallback((option: SwitchSelectorOption) => {
    selectScreen(option.value);
  }, []);

  return (
    <QRScannerContainer onSwitchScreen={onSwitchScreen}>
      {selectedScreen === ScannerScreenMode.SCAN && <QRCodeScanner />}
      {selectedScreen === ScannerScreenMode.REQUEST && <RequestQRCode />}
    </QRScannerContainer>
  );
};

export default QRScannerScreen;
