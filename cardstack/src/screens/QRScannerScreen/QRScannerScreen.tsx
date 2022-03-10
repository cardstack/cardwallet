import React, { useCallback, useState } from 'react';
import {
  QRScannerContainer,
  RequestQRCode,
  ScannerScreenMode,
} from './components';
import { QRCodeScannerPage } from './pages';
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
      {selectedScreen === ScannerScreenMode.SCAN && <QRCodeScannerPage />}
      {selectedScreen === ScannerScreenMode.REQUEST && <RequestQRCode />}
    </QRScannerContainer>
  );
};

export default QRScannerScreen;
