import React, { memo } from 'react';
import { ActivityIndicator } from 'react-native';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import ChoosePrepaidCard from './ChoosePrepaidCard';
import { usePayMerchant, PAY_STEP } from './usePayMerchant';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
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
} from '@cardstack/components';
import { MerchantInformation } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  formattedCurrencyToAbsNum,
  nativeCurrencyToSpend,
} from '@cardstack/utils';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';

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
        isLoading={isLoading}
        nativeCurrency={nativeCurrency || 'SPD'}
      />
    );
  }

  if (payStep === PAY_STEP.CONFIRMATION) {
    return (
      <TransactionConfirmationSheet
        loading={isLoading}
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
}
interface CustomAmountBodyProps extends AmountProps {
  merchantInfoDID: MerchantInformation | undefined;
  onNextPress: () => void;
  isLoading: boolean;
}

const CustomAmountBody = memo(
  ({
    merchantInfoDID,
    onNextPress,
    inputValue,
    setInputValue,
    isLoading,
    nativeCurrency,
  }: CustomAmountBodyProps) => (
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
    </Container>
  )
);

const AmountInputSection = memo(
  ({ inputValue, setInputValue, nativeCurrency }: AmountProps) => {
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
          currencyDisplayMode={CURRENCY_DISPLAY_MODE.NO_DISPLAY}
          nativeCurrency={nativeCurrency}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <Text marginTop={2} numberOfLines={1} fontSize={12} color="blueText">
          {nativeCurrency === NativeCurrency.SPD
            ? convertSpendForBalanceDisplay(
                inputValue ? formattedCurrencyToAbsNum(inputValue) : 0,
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

const PayMerchantScreen = () => (
  <SafeAreaView flex={1} width="100%" backgroundColor="black">
    <PayMerchant />
  </SafeAreaView>
);

export default memo(PayMerchantScreen);
