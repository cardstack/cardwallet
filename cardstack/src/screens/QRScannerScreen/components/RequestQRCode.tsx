import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet } from 'react-native';
import { crosshair } from '../pages/QRCodeScanner/components';
import { useDimensions } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  StyledQRCode,
  Text,
} from '@cardstack/components';

import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';
import usePrimarySafe from '@cardstack/redux/hooks/usePrimarySafe';
import { usePaymentLinks } from '@cardstack/hooks/merchant/usePaymentLinks';

const styles = StyleSheet.create({
  container: { paddingTop: crosshair.position.y * 0.4 },
});

const strings = {
  requestViaText: 'Or request via flow:',
  requestAmountBtn: 'Request Amount',
};

export const useRequestCodePage = () => {
  const { navigate } = useNavigation();

  const { primarySafe } = usePrimarySafe();

  const { address: safeAddress, merchantInfo } = primarySafe || {};

  const { handleShareLink, paymentRequestDeepLink } = usePaymentLinks({
    address: safeAddress || '',
    merchantInfo,
  });

  const goToMerchantPaymentRequest = useCallback(() => {
    if (primarySafe?.address) {
      navigate(Routes.MERCHANT_PAYMENT_REQUEST_SHEET, {
        address: primarySafe?.address,
        merchantInfo,
      });
    }
  }, [primarySafe, navigate, merchantInfo]);

  return {
    handleShareLink,
    safeAddress,
    paymentRequestDeepLink,
    merchantInfo,
    goToMerchantPaymentRequest,
  };
};

export const RequestQRCode = () => {
  const {
    merchantInfo,
    goToMerchantPaymentRequest,
    paymentRequestDeepLink,
    safeAddress,
  } = useRequestCodePage();

  const { isSmallPhone } = useDimensions();

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
            paddingHorizontal={6}
            textAlign="center"
          >
            {isTabBarEnabled
              ? `You don't have a profile yet.\n\nCreate one to start requesting payments`
              : `Create an account at app.cardstack.com/cardpay to
            request payments`}
          </Text>
          {isTabBarEnabled && (
            <Button>
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
              size={isSmallPhone ? 'large' : 'xxlarge'}
              value={merchantInfo?.name}
              textColor="white"
            />
          ) : (
            <Icon name="user-with-background" size={isSmallPhone ? 60 : 100} />
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
            onPress={goToMerchantPaymentRequest}
          >
            {strings.requestAmountBtn}
          </Button>
        </CenteredContainer>
      </Container>
    </CenteredContainer>
  );
};
