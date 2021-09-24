import { generateMerchantPaymentUrl } from '@cardstack/cardpay-sdk';
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
  Image,
  InputAmount,
  Text,
  Touchable,
} from '@cardstack/components';
import { MerchantInformation, MerchantSafeType } from '@cardstack/types';
import {
  getAddressPreview,
  nativeCurrencyToSpend,
  shareRequestPaymentLink,
  splitAddress,
} from '@cardstack/utils';
import { hitSlop } from '@cardstack/utils/layouts';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useNavigation } from '@rainbow-me/navigation';
import { usePaymentCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { supportedNativeCurrencies } from '@rainbow-me/references';
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
  const amountWithSymbol = `${
    nativeCurrency === 'SPD'
      ? '§'
      : (supportedNativeCurrencies as any)[nativeCurrency]?.symbol
  }${inputValue} ${nativeCurrency}`;
  const amountInSpend = nativeCurrencyToSpend(
    inputValue,
    currencyConversionRate
  ).spendAmount;

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
        <>
          {amountInSpend && amountInSpend > 0 ? (
            <>
              <Container
                flex={1}
                flexDirection="row"
                justifyContent="space-between"
                marginTop={!editMode ? 9 : 15}
                paddingHorizontal={5}
              >
                <Text
                  color="blueText"
                  fontWeight="bold"
                  lineHeight={30}
                  size="xxs"
                >
                  PAY THIS AMOUNT
                </Text>
                <Touchable
                  borderColor="grayText"
                  borderRadius={15}
                  borderWidth={1}
                  height={30}
                  hitSlop={hitSlop.small}
                  onPress={() => setEditMode(true)}
                  paddingHorizontal={4}
                >
                  <Text fontSize={11} fontWeight="600" lineHeight={26}>
                    Edit amount
                  </Text>
                </Touchable>
              </Container>
              <Container
                borderBottomColor="backgroundLightGray"
                borderBottomWidth={1}
                marginHorizontal={5}
                paddingBottom={4}
              >
                <Container paddingLeft={10}>
                  <Text fontSize={25} fontWeight="bold">
                    {amountWithSymbol}
                  </Text>
                  <SpendAmount
                    formattedAmount={inputValue}
                    nativeCurrencyRate={currencyConversionRate}
                  />
                </Container>
              </Container>
            </>
          ) : null}
          <AmountAndQRCodeButtons
            address={address}
            amountInSpend={amountInSpend}
            amountWithSymbol={amountWithSymbol}
            merchantInfo={merchantInfo}
          />
        </>
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
      fontWeight="600"
      marginTop={3}
      size="smallest"
      textTransform="uppercase"
    >
      {name || ''}
    </Text>
    <Text fontFamily="RobotoMono-Regular" size="xs" weight="regular">
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
  amountWithSymbol,
  address,
  amountInSpend,
  merchantInfo,
}: {
  amountWithSymbol: string | undefined;
  address: string;
  amountInSpend: number;
  merchantInfo?: MerchantInformation;
}) => {
  const [copyCount, setCopyCount] = useState(0);

  const { network } = useAccountSettings();
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

  const showQRCode = useCallback(() => {
    navigate(Routes.SHOW_QRCODE_MODAL, {
      value: paymentRequestLink,
      amountInSpend,
      amountWithSymbol,
      name: merchantInfo?.name,
    });
  }, [
    amountInSpend,
    amountWithSymbol,
    merchantInfo,
    navigate,
    paymentRequestLink,
  ]);

  return (
    <>
      <Container paddingHorizontal={5} width="100%">
        <Container flexDirection="row" marginTop={8}>
          <Text color="blueText" fontWeight="bold" paddingTop={1} size="xxs">
            TO:
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
                Merchant
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
                Share Link
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

const QRCodeFooter = () => {
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

export default PaymentRequestExpandedState;
