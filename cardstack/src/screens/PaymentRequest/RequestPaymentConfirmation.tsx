import {
  generateMerchantPaymentUrl,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import React, { useCallback, useMemo, useState } from 'react';
import CardWalletLogo from '../../assets/cardstackLogo.png';
import {
  CopyToast,
  ToastPositionContainer,
} from '@rainbow-me/components/toasts';
import { Icon } from '@rainbow-me/components/icons';
import {
  useAccountSettings,
  useClipboard,
  useDimensions,
} from '@rainbow-me/hooks';
import { Button, Container, Image, Text } from '@cardstack/components';
import { MerchantInformation } from '@cardstack/types';
import { shareRequestPaymentLink, splitAddress } from '@cardstack/utils';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useNavigation } from '@rainbow-me/navigation';
import { shadow } from '@rainbow-me/styles';
import Routes from '@rainbow-me/routes';
import logger from 'logger';

export const RequestPaymentConfirmation = ({
  amountWithSymbol,
  address,
  amountInNum,
  merchantInfo,
  nativeCurrency,
  amountInAnotherCurrency,
  backToEditMode,
}: {
  amountWithSymbol: string | undefined;
  address: string;
  amountInNum: number;
  merchantInfo?: MerchantInformation;
  nativeCurrency?: string;
  amountInAnotherCurrency: string;
  backToEditMode: () => void;
}) => {
  const [copyCount, setCopyCount] = useState(0);

  const { network } = useAccountSettings();
  const { navigate } = useNavigation();
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

  const showQRCode = useCallback(() => {
    navigate(Routes.SHOW_QRCODE_MODAL, {
      value: paymentRequestDeepLink,
      amountWithSymbol,
      amountInAnotherCurrency,
      merchantInfo: merchantInfo,
      hasAmount: amountInNum > 0,
      backToEditMode,
    });
  }, [
    navigate,
    paymentRequestDeepLink,
    amountInNum,
    amountWithSymbol,
    amountInAnotherCurrency,
    merchantInfo,
    backToEditMode,
  ]);

  return (
    <>
      <Container paddingHorizontal={5} width="100%" paddingBottom={20}>
        <Container flexDirection="row" marginTop={8}>
          <Text color="blueText" fontWeight="bold" paddingTop={1} size="xxs">
            TO
          </Text>
          <Container flexDirection="row" marginTop={4}>
            <Container paddingHorizontal={1} paddingTop={4}>
              <ContactAvatar
                color={merchantInfo?.color}
                size="smaller"
                textColor={merchantInfo?.textColor}
                value={merchantInfo?.name}
              />
            </Container>
            <Container paddingLeft={2}>
              <Text color="blueText" size="smallest" textTransform="uppercase">
                Business
              </Text>
              <Text fontSize={15} fontWeight="bold">
                {merchantInfo?.name}
              </Text>
              <Text
                color="blueText"
                fontFamily="RobotoMono-Regular"
                marginTop={2}
                size="small"
              >
                {splitAddress(address).twoLinesAddress}
              </Text>
            </Container>
          </Container>
        </Container>
        <Container
          backgroundColor="grayCardBackground"
          borderRadius={10}
          marginTop={8}
          paddingVertical={5}
        >
          <Container>
            <Container
              alignItems="center"
              alignSelf="center"
              flexDirection="row"
              paddingLeft={4}
            >
              <Icon name="qrCodeBig" />
              <Text
                fontSize={15}
                fontWeight="600"
                letterSpacing={0.15}
                lineHeight={20}
                paddingLeft={3}
              >
                Let your customer scan a {'\n'}QR code to pay
              </Text>
            </Container>
          </Container>
          <Container marginTop={6} paddingHorizontal={5}>
            <Button onPress={showQRCode} width="100%">
              Show QR code
            </Button>
            <Container
              alignItems="center"
              alignSelf="center"
              flexDirection="row"
              marginTop={7}
            >
              <Icon name="link" />
              <Text
                fontSize={15}
                fontWeight="600"
                letterSpacing={0.15}
                lineHeight={20}
                paddingLeft={3}
              >
                Or send your customer {'\n'}the link to pay
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
              <Button onPress={copyToClipboard} variant="small" width="100%">
                Copy Link
              </Button>
            </Container>
            <Container flex={1} paddingLeft={2}>
              <Button onPress={handleShareLink} variant="small" width="100%">
                Share Request
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>
      {copyCount > 0 ? (
        <ToastPositionContainer>
          <CopyToast copiedText="Payment Request Link" copyCount={copyCount} />
        </ToastPositionContainer>
      ) : null}
    </>
  );
};

export const RequestPaymentConfirmationFooter = () => {
  const { isTallPhone } = useDimensions();

  return (
    <Container
      alignSelf="flex-end"
      backgroundColor="white"
      bottom={isTallPhone ? 70 : 0}
      paddingBottom={5}
      paddingTop={3}
      style={shadow.buildAsObject(0, -1, 2, 'rgba(0, 0, 0, 0.25)', 1)}
      width="100%"
    >
      <Container alignItems="center" justifyContent="center">
        <Image height={30} source={CardWalletLogo} width={30} />
        <Text marginTop={1} size="xs" textAlign="center">
          Your customer must have the {'\n'}
          <Text fontWeight="bold" size="xs">
            Card Wallet mobile app
          </Text>{' '}
          installed.
        </Text>
      </Container>
    </Container>
  );
};
