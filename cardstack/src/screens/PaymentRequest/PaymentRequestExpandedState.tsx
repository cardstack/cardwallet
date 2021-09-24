import React, { useEffect, useState } from 'react';
import {
  RequestPaymentConfirmation,
  RequestPaymentConfirmationFooter,
} from './RequestPaymentConfirmation';
import { SpendAmount, RequestPaymentMerchantInfo } from './helper';
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
import { nativeCurrencyToSpend } from '@cardstack/utils';
import { hitSlop } from '@cardstack/utils/layouts';
import { useNavigation } from '@rainbow-me/navigation';
import { usePaymentCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { supportedNativeCurrencies } from '@rainbow-me/references';

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
          <RequestPaymentConfirmation
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

export default PaymentRequestExpandedState;
