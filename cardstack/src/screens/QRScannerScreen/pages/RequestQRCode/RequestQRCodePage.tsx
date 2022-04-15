import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  StyledQRCode,
  Text,
} from '@cardstack/components';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';

import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useDimensions } from '@rainbow-me/hooks';

import { crosshair } from '../QRCodeScanner/components';

import { strings } from './strings';
import { useRequestCodePage } from './useRequestCodePage';

const styles = StyleSheet.create({
  container: { paddingTop: crosshair.position.y * 0.4 },
});

const RequestQRCodePage = () => {
  const {
    merchantInfo,
    onRequestAmountPress,
    paymentRequestDeepLink,
    safeAddress,
    onCreateProfilePress,
  } = useRequestCodePage();

  const { isSmallPhone } = useDimensions();

  const iconSize = useMemo(
    () => ({
      avatar: isSmallPhone ? 'large' : 'xxlarge',
      defaultIcon: isSmallPhone ? 60 : 100,
    }),
    [isSmallPhone]
  );

  const { isTabBarEnabled } = useTabBarFlag();

  if (!safeAddress) {
    // Temp placeholder for no merchant/profile
    return (
      <CenteredContainer
        flex={1}
        justifyContent="space-around"
        paddingHorizontal={5}
      >
        <Container justifyContent="space-around" flex={0.3}>
          <Text
            fontSize={18}
            color="white"
            paddingHorizontal={4}
            textAlign="center"
          >
            {isTabBarEnabled
              ? `You don't have a profile yet.\n\nCreate one to start requesting payments`
              : `Create an account at app.cardstack.com/cardpay to request payments`}
          </Text>
          {isTabBarEnabled && (
            <Button onPress={onCreateProfilePress}>
              <Text>Create a profile</Text>
            </Button>
          )}
        </Container>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer
      paddingHorizontal={10}
      flex={1}
      backgroundColor="backgroundDarkPurple"
      style={styles.container}
    >
      <Container flexShrink={1} justifyContent="flex-start">
        <StyledQRCode value={paymentRequestDeepLink} />
      </Container>
      <Container flex={1} flexDirection="column">
        <CenteredContainer flex={1}>
          {merchantInfo?.name ? (
            <ContactAvatar
              color={merchantInfo?.color}
              size={iconSize.avatar}
              value={merchantInfo?.name}
              textColor="white"
            />
          ) : (
            <Icon name="user-with-background" size={iconSize.defaultIcon} />
          )}
          <Text
            paddingTop={1}
            fontWeight="bold"
            ellipsizeMode="tail"
            numberOfLines={1}
            fontSize={20}
            color="white"
          >
            {merchantInfo?.name || ''}
          </Text>
        </CenteredContainer>
        <CenteredContainer flex={1}>
          <Text
            fontSize={18}
            numberOfLines={1}
            color="white"
            textAlign="center"
          >
            {strings.requestViaText}
          </Text>
          <Button
            variant="primaryWhite"
            borderColor="teal"
            maxWidth="95%"
            marginTop={3}
            onPress={onRequestAmountPress}
          >
            {strings.requestAmountBtn}
          </Button>
        </CenteredContainer>
      </Container>
    </CenteredContainer>
  );
};

export default memo(RequestQRCodePage);
