import {
  generateMerchantPaymentUrl,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import React, { useCallback, useMemo, useState } from 'react';
import {
  CopyToast,
  ToastPositionContainerHeight,
} from '@rainbow-me/components/toasts';
import { Icon } from '@rainbow-me/components/icons';
import { useAccountSettings, useClipboard } from '@rainbow-me/hooks';
import { Button, Container, StyledQRCode, Text } from '@cardstack/components';
import { shareRequestPaymentLink } from '@cardstack/utils';
import logger from 'logger';

export const PaymentRequestConfirmation = ({
  address,
  amountInNum,
  nativeCurrency,
}: {
  address: string;
  amountInNum: number;
  nativeCurrency?: string;
}) => {
  const [copyCount, setCopyCount] = useState(0);

  const { network } = useAccountSettings();
  const { setClipboard } = useClipboard();

  const paymentRequestWebLink = useMemo(
    () =>
      generateMerchantPaymentUrl({
        domain: getConstantByNetwork('merchantUniLinkDomain', network),
        merchantSafeID: address,
        amount: amountInNum,
        network,
        currency: nativeCurrency,
      }),
    [address, amountInNum, nativeCurrency, network]
  );

  const paymentRequestDeepLink = useMemo(
    () =>
      generateMerchantPaymentUrl({
        merchantSafeID: address,
        amount: amountInNum,
        network,
        currency: nativeCurrency,
      }),
    [address, amountInNum, nativeCurrency, network]
  );

  const copyToClipboard = useCallback(() => {
    setClipboard(paymentRequestWebLink);
    setCopyCount(count => count + 1);
  }, [paymentRequestWebLink, setClipboard]);

  const handleShareLink = useCallback(async () => {
    try {
      await shareRequestPaymentLink(address, paymentRequestWebLink);
    } catch (e) {
      logger.sentry('Payment Request Link share failed', e);
    }
  }, [address, paymentRequestWebLink]);

  return (
    <>
      <Container paddingHorizontal={5} width="100%">
        <StyledQRCode value={paymentRequestDeepLink} />
        <Container
          backgroundColor="grayCardBackground"
          borderRadius={10}
          marginTop={8}
          paddingVertical={5}
        >
          <Container padding={1}>
            <Container
              alignItems="center"
              alignSelf="center"
              flexDirection="row"
            >
              <Icon name="link" />
              <Text
                fontSize={15}
                weight="bold"
                letterSpacing={0.15}
                lineHeight={20}
                paddingLeft={3}
              >
                Or send your recipient{'\n'}the link to pay
              </Text>
            </Container>
          </Container>
          <Container
            flex={1}
            flexDirection="row"
            flexWrap="wrap"
            marginTop={6}
            paddingHorizontal={5}
            width="100%"
          >
            <Container flex={1} paddingRight={2}>
              <Button onPress={handleShareLink} variant="small" width="100%">
                Share Request
              </Button>
            </Container>
            <Container flex={1} paddingLeft={2}>
              <Button onPress={copyToClipboard} variant="small" width="100%">
                Copy Link
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>
      {copyCount > 0 ? (
        <Container
          zIndex={10}
          position="absolute"
          height={ToastPositionContainerHeight}
          width="100%"
          bottom={ToastPositionContainerHeight + 20}
        >
          <CopyToast copiedText="Payment Request Link" copyCount={copyCount} />
        </Container>
      ) : null}
    </>
  );
};
