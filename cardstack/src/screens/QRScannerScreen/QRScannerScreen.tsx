import React, { useCallback } from 'react';
import {
  CameraDimmer,
  EmulatorPasteUriButton,
  QRCodeScanner,
} from './components';
import {
  BackButton,
  Header,
  HeaderHeight,
} from '@rainbow-me/components/header';

import {
  CenteredContainer,
  Container,
  SwitchSelector,
} from '@cardstack/components';

import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
const SHEET_HEIGHT = 240;

const QRScannerScreen = () => {
  const { navigate } = useNavigation();

  const handlePressBackButton = useCallback(
    () => navigate(Routes.WALLET_SCREEN),
    [navigate]
  );

  return (
    <Container>
      <Header
        backgroundColor="transparent"
        position="absolute"
        zIndex={1}
        width="100%"
        justifyContent="center"
      >
        <SwitchSelector
          options={[
            { label: 'Scan', value: 'scan' },
            { label: 'Request', value: 'request' },
          ]}
          width="60%"
          height={38}
        />
        <Container position="absolute" left={0}>
          <BackButton
            color="teal"
            direction="left"
            onPress={handlePressBackButton}
            testID="goToBalancesFromScanner"
            throttle={undefined}
            textChevron={undefined}
          />
        </Container>
        <Container position="absolute" right={0}>
          <EmulatorPasteUriButton />
        </Container>
      </Header>
      <CenteredContainer flexDirection="column" height="100%" overflow="hidden">
        <Container
          backgroundColor="black"
          position="absolute"
          width="100%"
          height="100%"
        />
        <CameraDimmer>
          <QRCodeScanner
            contentPositionBottom={SHEET_HEIGHT + HeaderHeight}
            contentPositionTop={HeaderHeight}
          />
        </CameraDimmer>
      </CenteredContainer>
    </Container>
  );
};

export default QRScannerScreen;
