import { NativeCurrency } from '@cardstack/cardpay-sdk';
import React, { memo } from 'react';
import { ActivityIndicator } from 'react-native';

import {
  SafeAreaView,
  Container,
  CURRENCY_DISPLAY_MODE,
  InputAmount,
  SheetHandle,
  Text,
  Button,
  TransactionConfirmationSheet,
  CenteredContainer,
  ChoosePrepaidCard,
} from '@cardstack/components';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import {
  MinInvalidAmountText,
  useAmountConvertHelper,
} from '@cardstack/screens/PaymentRequest/helper';
import { MerchantInformation } from '@cardstack/types';

import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';

import { AmountInNativeCurrency } from './components/AmountInNativeCurrency';
import { usePayMerchant, PAY_STEP } from './usePayMerchant';

const PayMerchant = memo(() => {
  const {
    merchantInfoDID,
    inputValue,
    nativeCurrency,
    spendAmount,
    selectedPrepaidCard,
    payStep,
    prepaidCards,
    isLoading,
    onConfirmLoading,
    txSheetData,
    onConfirm,
    onStepChange,
    onSelectPrepaidCard,
    setInputValue,
    onAmountNext,
    onCancelConfirmation,
    isLoadingMerchantInfo,
  } = usePayMerchant();

  if (isLoading) {
    return (
      <CenteredContainer flex={1}>
        <ActivityIndicator size="large" />
      </CenteredContainer>
    );
  }

  // Checking cards length to avoid keyboard flickring case user has no cards
  if (payStep === PAY_STEP.EDIT_AMOUNT && !!prepaidCards.length) {
    return (
      <CustomAmountBody
        merchantInfoDID={merchantInfoDID}
        onNextPress={onAmountNext}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoadingMerchantInfo}
        nativeCurrency={nativeCurrency}
      />
    );
  }

  if (payStep === PAY_STEP.CONFIRMATION) {
    return (
      <TransactionConfirmationSheet
        loading={isLoadingMerchantInfo}
        onConfirmLoading={onConfirmLoading}
        data={txSheetData}
        onCancel={onCancelConfirmation}
        onConfirm={onConfirm}
      />
    );
  }

  return (
    <ChoosePrepaidCard
      selectedCard={selectedPrepaidCard}
      onConfirmSelectedCard={onStepChange(PAY_STEP.CONFIRMATION)}
      prepaidCards={prepaidCards}
      onSelectPrepaidCard={onSelectPrepaidCard}
      spendAmount={spendAmount}
      onPressEditAmount={onStepChange(PAY_STEP.EDIT_AMOUNT)}
    />
  );
});

interface AmountProps {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: NativeCurrency;
  isInvalid?: boolean;
  amountInAnotherCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
}
interface CustomAmountBodyProps {
  merchantInfoDID: MerchantInformation | undefined;
  onNextPress: () => void;
  isLoading: boolean;
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: NativeCurrency;
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
    const [
      accountCurrency,
      currencyConversionRates,
    ] = useNativeCurrencyAndConversionRates();

    const { amountWithSymbol, isInvalid, canSubmit } = useAmountConvertHelper(
      inputValue,
      nativeCurrency,
      accountCurrency,
      currencyConversionRates
    );

    return (
      <Container
        flex={1}
        alignItems="center"
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        backgroundColor="white"
        paddingTop={3}
      >
        <SheetHandle />
        <Container flex={1} flexDirection="column" width="100%">
          <Container padding={5} flex={1}>
            <MerchantSectionCard
              merchantInfoDID={merchantInfoDID}
              flex={1}
              justifyContent="space-between"
              isLoading={isLoading}
            >
              <AmountInputSection
                inputValue={inputValue}
                setInputValue={setInputValue}
                amountInAnotherCurrency={amountWithSymbol}
                nativeCurrency={nativeCurrency}
                isInvalid={isInvalid}
                currencyConversionRates={currencyConversionRates}
              />
            </MerchantSectionCard>
          </Container>
          <Container alignItems="center" flex={1} paddingHorizontal={5}>
            <Button onPress={onNextPress} disabled={!canSubmit}>
              <Text>Next</Text>
            </Button>
          </Container>
        </Container>
      </Container>
    );
  }
);

const AmountInputSection = memo(
  ({
    inputValue,
    setInputValue,
    nativeCurrency,
    amountInAnotherCurrency,
    isInvalid,
    currencyConversionRates,
  }: AmountProps) => {
    return (
      <Container alignItems="center" width="100%" justifyContent="center">
        <InputAmount
          flexGrow={1}
          borderBottomWidth={1}
          borderBottomColor="borderBlue"
          paddingBottom={1}
          currencyDisplayMode={CURRENCY_DISPLAY_MODE.NO_DISPLAY}
          nativeCurrency={nativeCurrency}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isInvalid={isInvalid}
        />
        <AmountInNativeCurrency
          amountWithSymbol={amountInAnotherCurrency}
          textCenter
          marginTop={2}
        />
        {isInvalid ? (
          <MinInvalidAmountText
            nativeCurrency={nativeCurrency}
            currencyConversionRates={currencyConversionRates}
          />
        ) : null}
      </Container>
    );
  }
);

const PayMerchantScreen = () => (
  <SafeAreaView flex={1} width="100%" backgroundColor="black">
    <PayMerchant />
  </SafeAreaView>
);

export default memo(PayMerchantScreen);
