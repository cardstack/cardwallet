import React from 'react';
import ExchangeField from './ExchangeField';
import ExchangeMaxButton from './ExchangeMaxButton';
import ExchangeNativeField from './ExchangeNativeField';
import { Container } from '@cardstack/components';

export default function ExchangeInputField({
  disableInputCurrencySelection,
  inputAmount,
  inputCurrencyAddress,
  inputCurrencySymbol,
  inputFieldRef,
  nativeAmount,
  nativeCurrency,
  nativeFieldRef,
  onFocus,
  onPressMaxBalance,
  onPressSelectInputCurrency,
  setInputAmount,
  setNativeAmount,
  testID,
}) {
  return (
    <Container flex={-1} width="100%" zIndex={1}>
      <ExchangeField
        address={inputCurrencyAddress}
        amount={inputAmount}
        autoFocus={android}
        disableCurrencySelection={disableInputCurrencySelection}
        onFocus={onFocus}
        onPressSelectCurrency={onPressSelectInputCurrency}
        ref={inputFieldRef}
        setAmount={setInputAmount}
        symbol={inputCurrencySymbol}
        testID={testID}
        useCustomAndroidMask={android}
      />
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
      >
        <ExchangeNativeField
          address={inputCurrencyAddress}
          editable
          height={64}
          nativeAmount={nativeAmount}
          nativeCurrency={nativeCurrency}
          onFocus={onFocus}
          ref={nativeFieldRef}
          setNativeAmount={setNativeAmount}
          testID={testID + '-native'}
        />

        <ExchangeMaxButton
          address={inputCurrencyAddress}
          disabled={!inputCurrencySymbol}
          onPress={onPressMaxBalance}
          testID={testID + '-max'}
        />
      </Container>
    </Container>
  );
}
