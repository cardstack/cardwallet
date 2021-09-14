import React, { memo, useState, useEffect } from 'react';
import { usePaymentMerchantUniversalLink } from '@cardstack/hooks/merchant/usePaymentMerchantUniversalLink';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import {
  SafeAreaView,
  Container,
  InputAmount,
  SheetHandle,
  Text,
  Button,
  TransactionConfirmationSheet,
} from '@cardstack/components';
import usePayment from '@cardstack/redux/hooks/usePayment';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import { MerchantInformation, PayMerchantDecodedData } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  localCurrencyToAbsNum,
  nativeCurrencyToSpend,
} from '@cardstack/utils';

import {
  useNativeCurrencyAndConversionRates,
  usePaymentCurrencyAndConversionRates,
} from '@rainbow-me/redux/hooks';

const PayMerchant = () => {
  const {
    noPrepaidCard,
    goBack,
    onConfirm,
    isLoadingTx: onConfirmLoading,
    isLoading,
    data,
  } = usePaymentMerchantUniversalLink();

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="black">
      <PayMerchantBody
        noPrepaidCard={noPrepaidCard}
        onCancel={goBack}
        onConfirm={onConfirm}
        onConfirmLoading={onConfirmLoading}
        loading={isLoading}
        data={data}
      />
    </SafeAreaView>
  );
};

type PayMerchantBodyProps = {
  noPrepaidCard: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onConfirmLoading: boolean;
  loading: boolean;
  data: PayMerchantDecodedData;
};

const PayMerchantBody = memo((props: PayMerchantBodyProps) => {
  const {
    infoDID = '',
    spendAmount: initialSpendAmount,
    currency,
  } = props.data;

  const { merchantInfoDID } = useMerchantInfoFromDID(infoDID);
  const { paymentChangeCurrency } = usePayment();

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = usePaymentCurrencyAndConversionRates();

  useEffect(() => {
    if (currency) {
      paymentChangeCurrency(currency);
    }
  }, [currency, paymentChangeCurrency]);

  const [isConfirmScreen, setConfirmScreen] = useState(false);

  const [inputValue, setInputValue] = useState<string | undefined>(
    `${initialSpendAmount ? initialSpendAmount.toLocaleString() : 0}`
  );

  const spendAmount =
    nativeCurrency === 'SPD'
      ? localCurrencyToAbsNum(`${inputValue || 0}`)
      : nativeCurrencyToSpend(
          inputValue,
          currencyConversionRates[nativeCurrency],
          true
        ).spendAmount;

  return isConfirmScreen && !props.noPrepaidCard ? (
    <TransactionConfirmationSheet
      {...props}
      data={{
        ...props.data,
        spendAmount,
      }}
      onCancel={() => setConfirmScreen(false)}
    />
  ) : (
    <Container
      flex={1}
      alignItems="center"
      marginTop={4}
      borderTopRightRadius={20}
      borderTopLeftRadius={20}
      backgroundColor="white"
      paddingTop={3}
    >
      <SheetHandle />
      <CustomAmountBody
        merchantInfoDID={merchantInfoDID}
        goToConfirm={() => setConfirmScreen(true)}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={props.loading}
        nativeCurrency={nativeCurrency || 'SPD'}
      />
    </Container>
  );
});

interface CustomAmountBodyProps {
  merchantInfoDID: MerchantInformation | undefined;
  goToConfirm: () => void;
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  isLoading: boolean;
  nativeCurrency: string;
}

const CustomAmountBody = ({
  merchantInfoDID,
  goToConfirm,
  inputValue,
  setInputValue,
  isLoading,
  nativeCurrency,
}: CustomAmountBodyProps) => {
  return (
    <Container flex={1} flexDirection="column" width="100%">
      <Container padding={5} paddingTop={3} flex={1}>
        <MerchantSectionCard
          merchantInfoDID={merchantInfoDID}
          flex={1}
          justifyContent="space-between"
          isLoading={isLoading}
        >
          <AmountInputSection
            inputValue={inputValue}
            setInputValue={setInputValue}
            nativeCurrency={nativeCurrency}
          />
        </MerchantSectionCard>
      </Container>
      <Container alignItems="center" flex={1}>
        <Button onPress={goToConfirm}>
          <Text>Next</Text>
        </Button>
      </Container>
    </Container>
  );
};

interface AmountInputSectionProps {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: string;
}

const AmountInputSection = ({
  inputValue,
  setInputValue,
  nativeCurrency,
}: AmountInputSectionProps) => {
  const [
    accountCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  return (
    <Container alignItems="center" width="100%" justifyContent="center">
      <Text weight="bold" numberOfLines={1} fontSize={11}>
        SPEND (§1 = 0.01 USD)
      </Text>
      <InputAmount
        flexGrow={1}
        borderBottomWidth={1}
        borderBottomColor="borderBlue"
        paddingBottom={1}
        hasCurrencySymbol={false}
        nativeCurrency={nativeCurrency}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <Text marginTop={2} numberOfLines={1} fontSize={12} color="blueText">
        {nativeCurrency === 'SPD'
          ? convertSpendForBalanceDisplay(
              inputValue ? localCurrencyToAbsNum(inputValue) : 0,
              accountCurrency,
              currencyConversionRates,
              true
            ).nativeBalanceDisplay
          : nativeCurrencyToSpend(
              inputValue,
              currencyConversionRates[nativeCurrency],
              true
            ).tokenBalanceDisplay}
      </Text>
    </Container>
  );
};

export default memo(PayMerchant);
