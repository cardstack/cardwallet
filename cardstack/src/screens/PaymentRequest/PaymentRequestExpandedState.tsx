import React, { useEffect, useState } from 'react';
import {
  convertAmountToNativeDisplay,
  convertAmountAndPriceToNativeDisplay,
  spendToUsd,
} from '@cardstack/cardpay-sdk';
import {
  RequestPaymentConfirmation,
  RequestPaymentConfirmationFooter,
} from './RequestPaymentConfirmation';
import { AmountInNativeCurrency, RequestPaymentMerchantInfo } from './helper';
import { SlackSheet } from '@rainbow-me/components/sheet';
import { useDimensions } from '@rainbow-me/hooks';
import {
  Button,
  Container,
  CURRENCY_DISPLAY_MODE,
  InputAmount,
  Text,
  Touchable,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import {
  formattedCurrencyToAbsNum,
  formatNative,
  nativeCurrencyToSpend,
} from '@cardstack/utils';
import { hitSlop } from '@cardstack/utils/layouts';
import { useNavigation } from '@rainbow-me/navigation';
import {
  usePaymentCurrencyAndConversionRates,
  useNativeCurrencyAndConversionRates,
} from '@rainbow-me/redux/hooks';

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

  const [accountNativeCurrency] = useNativeCurrencyAndConversionRates();

  const onSkip = () => {
    setInputValue('');
    setEditMode(false);
  };

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
        <Touchable hitSlop={hitSlop.small} onPress={onSkip}>
          <Text color="blackEerie" fontWeight="600" size="xs">
            Skip Amount
          </Text>
        </Touchable>
      </Container>
    </Container>
  );

  const amountInNum = formattedCurrencyToAbsNum(inputValue);

  const amountWithSymbol =
    nativeCurrency === 'SPD'
      ? `§${formatNative(`${amountInNum}`)} SPD`
      : convertAmountToNativeDisplay(amountInNum, nativeCurrency);

  const amountInAnotherCurrency =
    nativeCurrency === 'SPD'
      ? convertAmountAndPriceToNativeDisplay(
          spendToUsd(amountInNum) || 0,
          currencyConversionRates[accountNativeCurrency],
          accountNativeCurrency
        ).display
      : nativeCurrencyToSpend(
          inputValue,
          currencyConversionRates[nativeCurrency],
          true
        ).tokenBalanceDisplay;

  return (
    <SlackSheet
      bottomInset={editMode ? 50 : 110}
      hasKeyboard={editMode}
      height="100%"
      renderFooter={() =>
        editMode ? <EditFooter /> : <RequestPaymentConfirmationFooter />
      }
      renderHeader={() => (
        <RequestPaymentMerchantInfo
          address={address}
          name={merchantInfo?.name}
        />
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
          <AmountInNativeCurrency
            amountWithSymbol={amountInAnotherCurrency}
            textCenter
          />
        </Container>
      ) : (
        <>
          {amountInNum > 0 ? (
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
                  <AmountInNativeCurrency
                    amountWithSymbol={amountInAnotherCurrency}
                  />
                </Container>
              </Container>
            </>
          ) : null}
          <RequestPaymentConfirmation
            address={address}
            amountInNum={amountInNum}
            amountWithSymbol={amountWithSymbol}
            merchantInfo={merchantInfo}
            nativeCurrency={nativeCurrency}
            amountInAnotherCurrency={amountInAnotherCurrency}
          />
        </>
      )}
    </SlackSheet>
  );
};

export default PaymentRequestExpandedState;
