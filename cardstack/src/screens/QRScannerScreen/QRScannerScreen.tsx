import React, { useCallback, useMemo, useState } from 'react';
import { useIsEmulator } from 'react-native-device-info';
import {
  EmulatorPasteUriButton,
  RequestQRCode,
  useRequestCodePage,
} from './components';
import { QRCodeScannerPage } from './pages';
import {
  Container,
  Icon,
  MainHeader,
  SwitchSelector,
  SwitchSelectorOption,
} from '@cardstack/components';
import { layoutEasingAnimation } from '@cardstack/utils';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';

enum PageMode {
  SCAN,
  REQUEST,
}

const strings = {
  scanLabel: 'Scan',
  requestLabel: 'Request',
};

const Pages = [
  { label: strings.scanLabel, value: PageMode.SCAN },
  { label: strings.requestLabel, value: PageMode.REQUEST },
];

const QRScannerScreen = () => {
  const [selectedScreen, selectScreen] = useState<PageMode>(PageMode.SCAN);

  const isScanSelected = useMemo(() => selectedScreen === PageMode.SCAN, [
    selectedScreen,
  ]);

  const { result: isEmulator } = useIsEmulator();

  const { isTabBarEnabled } = useTabBarFlag();

  const toggleScreenContent = useCallback((option: SwitchSelectorOption) => {
    layoutEasingAnimation();
    selectScreen(option.value);
  }, []);

  const { handleShareLink, safeAddress } = useRequestCodePage();

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
        <SwitchSelector
          options={Pages}
          flex={0.7}
          onPress={toggleScreenContent}
        />
      </MainHeader>
      {isScanSelected ? <QRCodeScannerPage /> : <RequestQRCode />}
    </Container>
  );
};

export default QRScannerScreen;
