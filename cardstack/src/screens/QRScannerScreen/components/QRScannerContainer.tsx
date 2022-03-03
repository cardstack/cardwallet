import React from 'react';
import {
  SWITCH_OPTIONS,
  SWITCH_SELECTOR_TOP,
  SWITCH_SELECTOR_HEIGHT,
} from './';

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

export const QRScannerContainer = ({
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
        backgroundColor="darkGrayOpacity"
      >
        {children}
      </CenteredContainer>
    </Container>
  );
};
