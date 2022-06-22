import React, { memo } from 'react';
import { ActivityIndicator } from 'react-native';

import {
  SafeAreaView,
  Container,
  CURRENCY_DISPLAY_MODE,
  InputAmount,
  Text,
  Button,
  TransactionConfirmationSheet,
  CenteredContainer,
  ChoosePrepaidCard,
  InputAmountProps,
} from '@cardstack/components';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import { MerchantInformation } from '@cardstack/types';

import { usePayMerchant, PAY_STEP } from './usePayMerchant';

const PayMerchant = memo(() => {
  const {
    merchantInfoDID,
    inputValue,
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
    isInvalid,
    canSubmit,
    paymentCurrency,
    setPaymentCurrency,
  } = usePayMerchant();

  if (isLoading || !payStep) {
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
        isInvalid={isInvalid}
        canSubmit={canSubmit}
        paymentCurrency={paymentCurrency}
        setPaymentCurrency={setPaymentCurrency}
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

interface CustomAmountBodyProps
  extends Pick<InputAmountProps, 'isInvalid' | 'inputValue' | 'setInputValue'> {
  merchantInfoDID: MerchantInformation | undefined;
  onNextPress: () => void;
  isLoading: boolean;
  canSubmit: boolean;
  paymentCurrency: InputAmountProps['selectedCurrency'];
  setPaymentCurrency: InputAmountProps['onCurrencyChange'];
}

const CustomAmountBody = memo(
  ({
    merchantInfoDID,
    onNextPress,
    inputValue,
    canSubmit,
    isInvalid,
    paymentCurrency,
    setPaymentCurrency,
    setInputValue,
    isLoading,
  }: CustomAmountBodyProps) => (
    <Container
      flex={1}
      alignItems="center"
      borderTopRightRadius={20}
      borderTopLeftRadius={20}
      backgroundColor="white"
      paddingTop={3}
    >
      <Container flex={1} flexDirection="column" width="100%">
        <Container padding={5} flex={1}>
          <MerchantSectionCard
            merchantInfoDID={merchantInfoDID}
            flex={1}
            justifyContent="space-between"
            isLoading={isLoading}
          >
            <InputAmount
              flexGrow={1}
              borderBottomWidth={1}
              borderBottomColor="borderBlue"
              paddingBottom={1}
              currencyDisplayMode={CURRENCY_DISPLAY_MODE.NO_DISPLAY}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isInvalid={isInvalid}
              selectedCurrency={paymentCurrency}
              onCurrencyChange={setPaymentCurrency}
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
  )
);

const PayMerchantScreen = () => (
  <SafeAreaView flex={1} width="100%">
    <PayMerchant />
  </SafeAreaView>
);

export default memo(PayMerchantScreen);
