import React, { memo } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

import { CenteredContainer, Text } from '@cardstack/components';
import { colors } from '@cardstack/theme';

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
  paddingTop: 7,
  paddingBottom: 5,
  borderRadius: 20,
};

const LoadingOverlay = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string;
}) => (
  <CenteredContainer style={styles.overlayWrapper}>
    <CenteredContainer
      backgroundColor="white"
      borderColor="whiteOverlay"
      shadowColor="overlay"
      {...overlayStyle}
    >
      <ActivityIndicator color={colors.blueText} />
      <Text color="black" marginTop={5} fontSize={18} weight="bold">
        {title}
      </Text>
      {!!subTitle && (
        <Text color="blueText" marginTop={1} size="body" textAlign="center">
          {subTitle}
        </Text>
      )}
    </CenteredContainer>
  </CenteredContainer>
);

export default memo(LoadingOverlay);
