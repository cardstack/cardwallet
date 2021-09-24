import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CardWalletLogo from '../../../cardstack/src/assets/cardstackLogo.png';
import {
  CopyToast,
  ToastPositionContainer,
} from '../../../src/components/toasts';
import { useAccountSettings, useClipboard, useDimensions } from '../../hooks';
import { Icon } from '../icons';
import { SlackSheet } from '../sheet';
import {
  Button,
  Container,
  CURRENCY_DISPLAY_MODE,
  HorizontalDivider,
  Image,
  InputAmount,
  Text,
  Touchable,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import {
  generateMerchantPaymentUrl,
  getAddressPreview,
  nativeCurrencyToSpend,
  shareRequestPaymentLink,
} from '@cardstack/utils';
import { hitSlop } from '@cardstack/utils/layouts';
import { useNavigation } from '@rainbow-me/navigation';

import { usePaymentCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import Routes from '@rainbow-me/routes';
import { shadow } from '@rainbow-me/styles';
import logger from 'logger';

const TOP_POSITION = 150;

const PaymentRequestExpandedState = (props: { asset: MerchantSafeType }) => {
  const {
    asset: { address, merchantInfo },
  } = props;
  const { setOptions } = useNavigation();
  const { height: deviceHeight, isTallPhone } = useDimensions();
  const [inputValue, setInputValue] = useState<string>();
  const [editMode, setEditMode] = useState<boolean>(true);
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = usePaymentCurrencyAndConversionRates();

  useEffect(() => {
    setOptions({
      longFormHeight: isTallPhone ? deviceHeight - TOP_POSITION : deviceHeight,
    });
  }, [setOptions, deviceHeight, isTallPhone]);

  const EditFooter = () => (
    <Container paddingHorizontal={5}>
      <Button
        disabled={!inputValue}
        onPress={() => setEditMode(false)}
        variant={!inputValue ? 'disabledBlack' : undefined}
      >{`${!inputValue ? 'Enter' : 'Confirm'} Amount`}</Button>
      <Container alignItems="center" justifyContent="center" marginTop={4}>
        <Touchable hitSlop={hitSlop.small} onPress={() => setEditMode(false)}>
          <Text color="blackEerie" fontWeight="600" size="xs">
            Skip Amount
          </Text>
        </Touchable>
      </Container>
    </Container>
  );

  const currencyConversionRate =
    nativeCurrency === 'SPD' ? 100 : currencyConversionRates[nativeCurrency];

  return (
    <SlackSheet
      bottomInset={editMode ? 50 : 110}
      hasKeyboard={editMode}
      height="100%"
      renderFooter={() => (editMode ? <EditFooter /> : <QRCodeFooter />)}
      renderHeader={() => (
        <MerchantInfo address={address} name={merchantInfo?.name} />
      )}
      scrollEnabled
    >
      <Container
        flex={1}
        flexDirection="row"
        justifyContent="flex-end"
        marginTop={!editMode ? 9 : 15}
        paddingHorizontal={5}
        width="100%"
      >
        {!editMode && (
          <Text
            fontSize={12}
            fontWeight="600"
            marginTop={2}
            onPress={() => setEditMode(true)}
          >
            Edit amount
          </Text>
        )}
      </Container>
      {editMode ? (
        <Container paddingHorizontal={5}>
          <InputAmount
            borderBottomColor="black"
            borderBottomWidth={1}
            currencyDisplayMode={CURRENCY_DISPLAY_MODE.LABEL}
            flex={1}
            inputValue={inputValue}
            marginBottom={2}
            marginTop={8}
            nativeCurrency={nativeCurrency}
            paddingBottom={1}
            setInputValue={setInputValue}
          />
          <SpendAmount
            formattedAmount={inputValue}
            nativeCurrencyRate={currencyConversionRate}
            textCenter
          />
        </Container>
      ) : (
        <AmountAndQRCodeButtons
          address={address}
          amountInSpend={
            nativeCurrencyToSpend(inputValue, currencyConversionRate)
              .spendAmount
          }
          formattedAmount={inputValue}
          merchantName={merchantInfo?.name}
          nativeCurrency={nativeCurrency}
          nativeCurrencyRate={currencyConversionRate}
        />
      )}
    </SlackSheet>
  );
};

const MerchantInfo = ({
  address,
  name,
}: {
  address: string;
  name: string | undefined;
}) => (
  <Container
    alignItems="center"
    flexDirection="column"
    paddingTop={5}
    width="100%"
  >
    <Text size="body" weight="extraBold">
      Request Payment
    </Text>
    <Text
      color="blueText"
      marginTop={3}
      size="smallest"
      textTransform="uppercase"
      weight="regular"
    >
      {name || ''}
    </Text>
    <Text size="xs" weight="regular">
      {getAddressPreview(address)}
    </Text>
  </Container>
);

const SpendAmount = ({
  formattedAmount,
  nativeCurrencyRate,
  textCenter = false,
}: {
  formattedAmount: string | undefined;
  nativeCurrencyRate: number;
  textCenter?: boolean;
}) => (
  <Text
    color="blueText"
    fontFamily="OpenSans-Regular"
    fontSize={12}
    textAlign={textCenter ? 'center' : undefined}
  >
    {
      nativeCurrencyToSpend(formattedAmount, nativeCurrencyRate, true)
        .tokenBalanceDisplay
    }
  </Text>
);

const AmountAndQRCodeButtons = ({
  formattedAmount,
  address,
  nativeCurrency,
  nativeCurrencyRate,
  amountInSpend,
  merchantName,
}: {
  formattedAmount: string | undefined;
  address: string;
  nativeCurrency: string;
  nativeCurrencyRate: number;
  amountInSpend: number;
  merchantName: string | undefined;
}) => {
  const [copyCount, setCopyCount] = useState(0);

  const { network, nativeCurrencySymbol } = useAccountSettings();
  const { navigate } = useNavigation();
  const { setClipboard } = useClipboard();

  // for now the amount is in spend, but once we get
  // the currency selector we should pass the amount with currency
  const paymentRequestLink = useMemo(
    () =>
      generateMerchantPaymentUrl({
        merchantSafeID: address,
        amount: amountInSpend,
        network,
        currency: 'SPD',
      }),
    [address, amountInSpend, network]
  );

  const copyToClipboard = useCallback(() => {
    setClipboard(paymentRequestLink);
    setCopyCount(count => count + 1);
  }, [paymentRequestLink, setClipboard]);

  const handleShareLink = useCallback(async () => {
    try {
      await shareRequestPaymentLink(address, paymentRequestLink);
    } catch (e) {
      logger.sentry('Payment Request Link share failed', e);
    }
  }, [address, paymentRequestLink]);

  // assuming we are using the global native currency,
  // once it needs to change we probably should receive this as prop
  const amountWithSymbol = `${nativeCurrencySymbol}${formattedAmount} ${nativeCurrency}`;

  const showQRCode = useCallback(() => {
    navigate(Routes.SHOW_QRCODE_MODAL, {
      value: paymentRequestLink,
      amountInSpend,
      amountWithSymbol,
      name: merchantName,
    });
  }, [
    amountInSpend,
    amountWithSymbol,
    merchantName,
    navigate,
    paymentRequestLink,
  ]);

  return (
    <>
      <Container paddingHorizontal={5} width="100%">
        <Container flexDirection="row" marginTop={8}>
          <Text color="blueText" fontWeight="bold" paddingTop={1} size="xxs">
            PAY:
          </Text>
          <Container paddingLeft={6}>
            <Text fontSize={15} fontWeight="bold">
              {amountWithSymbol}
            </Text>
            <SpendAmount
              formattedAmount={formattedAmount}
              nativeCurrencyRate={nativeCurrencyRate}
            />
          </Container>
        </Container>
        <Container flexDirection="row" marginTop={3}>
          <Text color="blueText" fontWeight="bold" paddingTop={1} size="xxs">
            TO:
          </Text>
          <Container paddingLeft={7} width={205}>
            <Text color="blueText" size="small">
              {address}
            </Text>
          </Container>
        </Container>
        <Container marginTop={1}>
          <HorizontalDivider />
          <Container
            alignItems="center"
            alignSelf="center"
            flexDirection="row"
            marginTop={4}
            width={200}
          >
            <Icon name="qrCodeBig" />
            <Text
              fontSize={15}
              fontWeight="600"
              letterSpacing={0.15}
              lineHeight={20}
              paddingLeft={3}
            >
              Let your customer scan a QR code to pay
            </Text>
          </Container>
        </Container>
        <Container marginTop={6}>
          <Button onPress={showQRCode}>Show QR code</Button>
          <Container
            alignItems="center"
            alignSelf="center"
            flexDirection="row"
            marginTop={7}
            width={200}
          >
            <Icon name="link" />
            <Text
              fontSize={15}
              fontWeight="600"
              letterSpacing={0.15}
              lineHeight={20}
              paddingLeft={2}
            >
              Or send your customer the link to pay
            </Text>
          </Container>
        </Container>
        <Container
          flex={1}
          flexDirection="row"
          flexWrap="wrap"
          marginTop={6}
          width="100%"
        >
          <Container flex={1} paddingRight={2}>
            <Button onPress={copyToClipboard} variant="small">
              Copy Link
            </Button>
          </Container>
          <Container flex={1} paddingLeft={2}>
            <Button onPress={handleShareLink} variant="small">
              Share Link
            </Button>
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

const QRCodeFooter = () => {
  const { isTallPhone } = useDimensions();

  return (
    <Container
      alignSelf="flex-end"
      backgroundColor="white"
      bottom={isTallPhone ? 70 : 0}
      paddingHorizontal={5}
      paddingVertical={4}
      style={shadow.buildAsObject(0, -1, 2, 'rgba(0, 0, 0, 0.25)', 1)}
      width="100%"
    >
      <Container
        alignItems="center"
        backgroundColor="backgroundGray"
        borderRadius={10}
        flexDirection="row"
        paddingBottom={2}
        paddingHorizontal={4}
        paddingTop={4}
      >
        <Image height={30} source={CardWalletLogo} width={30} />
        <Text paddingLeft={4} paddingRight={6} size="xs">
          Your customer must have the
          <Text fontWeight="bold" size="xs">
            {' '}
            Card Wallet mobile app
          </Text>{' '}
          installed.
        </Text>
      </Container>
    </Container>
  );
};

export default PaymentRequestExpandedState;
