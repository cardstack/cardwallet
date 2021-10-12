import React from 'react';
import { Container, CenteredContainer, Text } from '@cardstack/components';
import { Device } from '@cardstack/utils';
import { colors } from '@cardstack/theme';
import ActivityIndicator from '@rainbow-me/components/ActivityIndicator';
import Spinner from '@rainbow-me/components/Spinner';
import { neverRerender } from '@rainbow-me/utils';

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

const LoadingOverlay = ({
  title,
  subTitle,
  ...props
}: {
  title?: string;
  subTitle?: string;
}) => {
  return (
    <Container flex={1} justifyContent="center" alignItems="center" {...props}>
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
    </Container>
  );
};

export default neverRerender(LoadingOverlay);
