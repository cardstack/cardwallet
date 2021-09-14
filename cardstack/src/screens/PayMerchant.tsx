import React, { memo, useState } from 'react';
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
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import { MerchantInformation } from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  localCurrencyToAbsNum,
} from '@cardstack/utils';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';

const PayMerchant = () => {
  const {
    noPrepaidCard,
    goBack,
    onConfirm,
    isLoadingTx,
    isLoading,
    data,
  } = usePaymentMerchantUniversalLink();

  const { infoDID = '', spendAmount } = data;
  const { merchantInfoDID } = useMerchantInfoFromDID(infoDID);

  const [isConfirmScreen, setConfirmScreen] = useState(false);

  const [inputValue, setInputValue] = useState<string | undefined>(
    `${spendAmount || 0}`
  );

  const goToConfirm = () => {
    setConfirmScreen(true);
  };

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="black">
      {isConfirmScreen && !noPrepaidCard ? (
        <TransactionConfirmationSheet
          data={{
            ...data,
            spendAmount: localCurrencyToAbsNum(`${inputValue || 0}`),
          }}
          onCancel={goBack}
          onConfirm={onConfirm}
          onConfirmLoading={isLoadingTx}
          loading={isLoading}
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
            goToConfirm={goToConfirm}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
          />
        </Container>
      )}
    </SafeAreaView>
  );
};

interface CustomAmountBodyProps {
  merchantInfoDID: MerchantInformation | undefined;
  goToConfirm: () => void;
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  isLoading: boolean;
}

const CustomAmountBody = ({
  merchantInfoDID,
  goToConfirm,
  inputValue,
  setInputValue,
  isLoading,
}: CustomAmountBodyProps) => {
  const [selectedCurrency, setCurrency] = useState<string>('SPD');

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
            selectedCurrency={selectedCurrency}
            setCurrency={setCurrency}
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
  selectedCurrency: string;
  setCurrency: (_val: string) => void;
}

const AmountInputSection = ({
  inputValue,
  setInputValue,
  selectedCurrency,
  setCurrency,
}: AmountInputSectionProps) => {
  const [
    nativeCurrency,
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
        nativeCurrency={selectedCurrency}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setCurrency={setCurrency}
      />
      <Text marginTop={2} numberOfLines={1} fontSize={12} color="blueText">
        {
          convertSpendForBalanceDisplay(
            inputValue ? localCurrencyToAbsNum(inputValue) : 0,
            nativeCurrency,
            currencyConversionRates,
            true
          ).nativeBalanceDisplay
        }
      </Text>
    </Container>
  );
};

export default memo(PayMerchant);
