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
  SwitchSelectorOption,
} from '@cardstack/components';

interface QRScannerContainerProps {
  onSwitchScreen: (selectedScreen: SwitchSelectorOption) => void;
  children: React.ReactNode;
}

export const QRScannerContainer = ({
  children,
  onSwitchScreen,
}: QRScannerContainerProps) => {
  return (
    <Container flex={1}>
      <SwitchSelector
        options={SWITCH_OPTIONS}
        width="60%"
        left="20%"
        height={SWITCH_SELECTOR_HEIGHT}
        onPress={onSwitchScreen}
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
