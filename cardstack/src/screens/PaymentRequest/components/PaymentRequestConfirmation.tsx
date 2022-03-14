import React, { useCallback, useState } from 'react';
import {
  CopyToast,
  ToastPositionContainerHeight,
} from '@rainbow-me/components/toasts';
import { Icon } from '@rainbow-me/components/icons';
import { useClipboard } from '@rainbow-me/hooks';
import { Button, Container, StyledQRCode, Text } from '@cardstack/components';
import {
  usePaymentLinkParams,
  usePaymentLinks,
} from '@cardstack/hooks/merchant/usePaymentLinks';

type PaymentRequestConfirmationProps = usePaymentLinkParams;

export const PaymentRequestConfirmation = (
  props: PaymentRequestConfirmationProps
) => {
  const [copyCount, setCopyCount] = useState(0);

  const { setClipboard } = useClipboard();

  const {
    paymentRequestWebLink,
    paymentRequestDeepLink,
    handleShareLink,
  } = usePaymentLinks(props);

  const copyToClipboard = useCallback(() => {
    setClipboard(paymentRequestWebLink);
    setCopyCount(count => count + 1);
  }, [paymentRequestWebLink, setClipboard]);

  return (
    <>
      <Container paddingHorizontal={5} width="100%">
        <Container alignItems="center" paddingTop={5}>
          <StyledQRCode value={paymentRequestDeepLink} />
        </Container>
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
