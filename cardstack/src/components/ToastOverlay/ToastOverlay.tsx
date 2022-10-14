import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import { CenteredContainer, Text } from '@cardstack/components';

import { ToastOverlayParams } from './useToast';

const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
    // Note: Workaround for android gesture transparency issue.
    backgroundColor: '#00000001',
  },
});

const ToastOverlay = ({ message }: ToastOverlayParams) => (
  <CenteredContainer style={styles.overlayWrapper}>
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
      <Text color="blueText" size="body" textAlign="center">
        {message}
      </Text>
    </CenteredContainer>
  </CenteredContainer>
);

export default memo(ToastOverlay);
