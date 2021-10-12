import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/core';
import { CenteredContainer, Text } from '@cardstack/components';
import { Device } from '@cardstack/utils';
import { colors } from '@cardstack/theme';
import Spinner from '@rainbow-me/components/Spinner';
import { neverRerender } from '@rainbow-me/utils';

const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const transition = (
  <Transition.Sequence>
    <Transition.Out durationMs={500} interpolation="easeOut" type="fade" />
    <Transition.Change durationMs={500} interpolation="easeOut" />
    <Transition.In durationMs={500} interpolation="easeOut" type="fade" />
  </Transition.Sequence>
);

const OverlyStyle = {
  shadowOffset: {
    width: 0,
    height: 15,
  },
  shadowRadius: 30,
  shadowOpacity: 1,
  borderWidth: 1,
  width: '90%',
  paddingTop: 7,
  paddingBottom: 5,
  borderRadius: 20,
};

const LoadingOverlay = props => {
  const {
    params: { title, subTitle },
  } = useRoute();

  return (
    <Transitioning.View transition={transition} style={styles.overlayWrapper}>
      <CenteredContainer
        backgroundColor="white"
        borderColor="whiteOverlay"
        shadowColor="overlay"
        {...OverlyStyle}
      >
        {Device.isAndroid ? (
          <Spinner
            color={colors.blueText}
            duration={undefined}
            size={undefined}
          />
        ) : (
          <ActivityIndicator color={colors.blueText} />
        )}
        {title ? (
          <Text color="black" marginTop={5} fontSize={18} weight="bold">
            {title}
          </Text>
        ) : null}
        {subTitle ? (
          <Text color="blueText" marginTop={1} size="body" textAlign="center">
            {subTitle}
          </Text>
        ) : null}
      </CenteredContainer>
    </Transitioning.View>
  );
};

export default neverRerender(LoadingOverlay);
