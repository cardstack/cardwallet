import React, { memo, useState, useEffect, useCallback } from 'react';
import ChoosePrepaidCard from './ChoosePrepaidCard';
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
import {
  MerchantInformation,
  PayMerchantDecodedData,
  PrepaidCardType,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  localCurrencyToAbsNum,
  nativeCurrencyToSpend,
} from '@cardstack/utils';
import {
  useNativeCurrencyAndConversionRates,
  usePaymentCurrencyAndConversionRates,
} from '@rainbow-me/redux/hooks';

const PAY_STEP = {
  EDIT_AMOUNT: 'EDIT_AMOUNT',
  CHOOSE_PREPAID_CARD: 'CHOOSE_PREPAID_CARD',
  CONFIRMATION: 'CONFIRMATION',
};

const PayMerchant = () => {
  const {
    prepaidCards,
    goBack,
    onConfirm,
    isLoadingTx: onConfirmLoading,
    isLoading,
    data,
  } = usePaymentMerchantUniversalLink();

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="black">
      <PayMerchantBody
        prepaidCards={prepaidCards}
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
  prepaidCards: PrepaidCardType[];
  onCancel: () => void;
  onConfirm: (spendAmount: number, prepaidCardAddress: string) => void;
  onConfirmLoading: boolean;
  loading: boolean;
  data: PayMerchantDecodedData;
};

const PayMerchantBody = memo(
  ({
    data,
    prepaidCards,
    onConfirm,
    onConfirmLoading,
    loading,
  }: PayMerchantBodyProps) => {
    const { infoDID = '', spendAmount: initialSpendAmount, currency } = data;

    const { merchantInfoDID } = useMerchantInfoFromDID(infoDID);
    const { paymentChangeCurrency } = usePayment();

    const [
      nativeCurrency,
      currencyConversionRates,
    ] = usePaymentCurrencyAndConversionRates();

    const [selectedPrepaidCardAddress, selectPrepaidCard] = useState<string>(
      prepaidCards[0]?.address
    );

    const [payStep, setPayStep] = useState<string>(
      PAY_STEP.CHOOSE_PREPAID_CARD
    );

    const [inputValue, setInputValue] = useState<string | undefined>(
      `${initialSpendAmount ? initialSpendAmount.toLocaleString() : 0}`
    );

    useEffect(() => {
      if (currency) {
        paymentChangeCurrency(currency);
      }
    }, [currency, paymentChangeCurrency]);

    const spendAmount =
      nativeCurrency === 'SPD'
        ? localCurrencyToAbsNum(`${inputValue || 0}`)
        : nativeCurrencyToSpend(
            inputValue,
            currencyConversionRates[nativeCurrency],
            true
          ).spendAmount;

    const onCustomConfirm = useCallback(() => {
      onConfirm(spendAmount, selectedPrepaidCardAddress);
    }, [onConfirm, spendAmount, selectedPrepaidCardAddress]);

    const onSelectPrepaidCard = (prepaidAddress: string) => {
      selectPrepaidCard(prepaidAddress);
      setPayStep(PAY_STEP.CONFIRMATION);
    };

    if (payStep === PAY_STEP.EDIT_AMOUNT) {
      return (
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
            onNextPress={() => setPayStep(PAY_STEP.CHOOSE_PREPAID_CARD)}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={loading}
            nativeCurrency={nativeCurrency || 'SPD'}
          />
        </Container>
      );
    }

    if (payStep === PAY_STEP.CONFIRMATION && prepaidCards.length > 0) {
      return (
        <TransactionConfirmationSheet
          loading={loading}
          onConfirmLoading={onConfirmLoading}
          data={{
            ...data,
            spendAmount,
            currency: nativeCurrency === 'SPD' ? currency : nativeCurrency,
          }}
          onCancel={() => setPayStep(PAY_STEP.CHOOSE_PREPAID_CARD)}
          onConfirm={onCustomConfirm}
        />
      );
    }

    return (
      <ChoosePrepaidCard
        prepaidCards={prepaidCards}
        onSelectPrepaidCard={onSelectPrepaidCard}
        spendAmount={spendAmount}
      />
    );
  }
);

interface CustomAmountBodyProps {
  merchantInfoDID: MerchantInformation | undefined;
  onNextPress: () => void;
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  isLoading: boolean;
  nativeCurrency: string;
}

const CustomAmountBody = memo(
  ({
    merchantInfoDID,
    onNextPress,
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
          <Button onPress={onNextPress}>
            <Text>Next</Text>
          </Button>
        </Container>
      </Container>
    );
  }
);

interface AmountInputSectionProps {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: string;
}

const AmountInputSection = memo(
  ({ inputValue, setInputValue, nativeCurrency }: AmountInputSectionProps) => {
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
  }
);

export default memo(PayMerchant);
