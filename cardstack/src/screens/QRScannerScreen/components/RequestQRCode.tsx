import {
  generateMerchantPaymentUrl,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/core';
import { strings, SWITCH_SELECTOR_TOP } from './';
import { useAccountSettings, useDimensions } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import {
  Button,
  Container,
  Icon,
  StyledQRCode,
  Text,
} from '@cardstack/components';
import { shareRequestPaymentLink } from '@cardstack/utils';
import usePrimarySafe from '@cardstack/redux/hooks/usePrimarySafe';

import logger from 'logger';

export const RequestQRCode = () => {
  const { network } = useAccountSettings();
  const { isSmallPhone } = useDimensions();
  const { navigate } = useNavigation();

  const { primarySafe } = usePrimarySafe();

  const { address: primaryMerchantAddress, merchantInfo: primaryMerchantInfo } =
    primarySafe || {};

  const paymentRequestWebLink = useMemo(
    () =>
      primaryMerchantAddress
        ? generateMerchantPaymentUrl({
            domain: getConstantByNetwork('merchantUniLinkDomain', network),
            merchantSafeID: primaryMerchantAddress,
            network,
          })
        : '',
    [network, primaryMerchantAddress]
  );

  const paymentRequestDeepLink = useMemo(
    () =>
      primaryMerchantAddress
        ? generateMerchantPaymentUrl({
            merchantSafeID: primaryMerchantAddress,
            network,
          })
        : '',
    [network, primaryMerchantAddress]
  );

  const handleShareLink = useCallback(async () => {
    try {
      await shareRequestPaymentLink(
        paymentRequestWebLink,
        primarySafe?.merchantInfo?.name || ''
      );
    } catch (e) {
      logger.sentry('Payment Request Link share failed', e);
    }
  }, [paymentRequestWebLink, primarySafe]);

  const goToMerchantPaymentRequest = useCallback(() => {
    if (primaryMerchantAddress) {
      navigate(Routes.MERCHANT_PAYMENT_REQUEST_SHEET, {
        address: primaryMerchantAddress,
        merchantInfo: primaryMerchantInfo,
      });
    }
  }, [primaryMerchantAddress, navigate, primaryMerchantInfo]);

  if (!primarySafe) {
    logger.log('No primary merchant!');

    return null;
  }

  return (
    <Container
      paddingHorizontal={10}
      paddingTop={isSmallPhone ? 22 : 30}
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="buttonDisabledBackground"
    >
      <StyledQRCode value={paymentRequestDeepLink} />
      <Container
        flex={1}
        justifyContent="space-between"
        flexDirection="column"
        paddingTop={5}
      >
        <Container justifyContent="center" alignItems="center">
          {primaryMerchantInfo?.name ? (
            <Container marginBottom={4}>
              <ContactAvatar
                color={primaryMerchantInfo?.color}
                size="xlarge"
                value={primaryMerchantInfo?.name}
                textColor="white"
              />
            </Container>
          ) : (
            <Icon name="user-with-background" size={80} />
          )}
          <Text
            fontWeight="bold"
            ellipsizeMode="tail"
            numberOfLines={1}
            fontSize={20}
            color="white"
          >
            {primaryMerchantInfo?.name || ''}
          </Text>
        </Container>
        <Container paddingBottom={isSmallPhone ? 10 : 20}>
          <Text
            fontSize={20}
            numberOfLines={1}
            color="white"
            textAlign="center"
          >
            {strings.requestViaText}
          </Text>
          <Button
            variant="primaryWhite"
            borderColor="teal"
            marginTop={3}
            onPress={goToMerchantPaymentRequest}
          >
            {strings.requestAmountBtn}
          </Button>
        </Container>
      </Container>
      <Container
        position="absolute"
        right={40}
        top={SWITCH_SELECTOR_TOP + 9}
        zIndex={2}
      >
        <Icon name="share" size={20} onPress={handleShareLink} />
      </Container>
    </Container>
  );
};
