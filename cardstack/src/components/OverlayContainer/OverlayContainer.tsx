import React, { ReactNode, memo } from 'react';
import { StyleSheet } from 'react-native';

import { CenteredContainer } from '@cardstack/components';

const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
    // Note: Workaround for android gesture transparency issue.
    backgroundColor: '#00000001',
  },
});

const OverlayContainer = ({ children }: { children: ReactNode }) => (
  <CenteredContainer flex={1} style={styles.overlayWrapper}>
    <CenteredContainer
      backgroundColor="white"
      borderColor="whiteOverlay"
      borderWidth={1}
      width="90%"
      padding={5}
      borderRadius={20}
      elevation={20}
      shadowColor="overlay"
      shadowOffset={{
        width: 0,
        height: 15,
      }}
      shadowRadius={30}
      shadowOpacity={1}
    >
      {children}
    </CenteredContainer>
  </CenteredContainer>
);

export default memo(OverlayContainer);
