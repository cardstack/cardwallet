import React, { memo } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

import { CenteredContainer, Text } from '@cardstack/components';
import { colors } from '@cardstack/theme';

import { ToastOverlayParams } from './useToast';

const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
    // Note: Workaround for android gesture transparency issue.
    backgroundColor: '#00000001',
  },
});

const overlayStyle = {
  shadowOffset: {
    width: 0,
    height: 15,
  },
  elevation: 20,
  shadowRadius: 30,
  shadowOpacity: 1,
  borderWidth: 1,
  width: '90%',
  paddingTop: 5,
  paddingBottom: 5,
  borderRadius: 20,
};

const ToastOverlay = ({ message, loading = false }: ToastOverlayParams) => (
  <CenteredContainer style={styles.overlayWrapper}>
    <CenteredContainer
      backgroundColor="white"
      borderColor="whiteOverlay"
      shadowColor="overlay"
      {...overlayStyle}
    >
      {loading && (
        <>
          <ActivityIndicator color={colors.blueText} />
          <CenteredContainer paddingBottom={5} />
        </>
      )}

      <Text color="blueText" size="body" textAlign="center">
        {message}
      </Text>
    </CenteredContainer>
  </CenteredContainer>
);

export default memo(ToastOverlay);
