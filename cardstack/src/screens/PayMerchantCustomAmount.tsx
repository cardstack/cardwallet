import React, { memo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { usePaymentMerchantUniversalLink } from './PayMerchantUniversalLink';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import {
  SafeAreaView,
  Container,
  InputAmount,
  SheetHandle,
  Text,
  Button,
} from '@cardstack/components';
import { useMerchantInfoDID } from '@cardstack/hooks';
import { MerchantInformation } from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';

// import { supportedNativeCurrencies } from '@rainbow-me/references';

const PayMerchantCustomAmount = () => {
  const { isLoading, data } = usePaymentMerchantUniversalLink();
  const { infoDID = '', spendAmount, prepaidCard, merchantSafe } = data;
  const { merchantInfoDID } = useMerchantInfoDID(infoDID);

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="black">
      <Container
        flex={1}
        alignItems="center"
        marginTop={4}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        backgroundColor="white"
        width="100%"
        paddingTop={3}
      >
        <SheetHandle />
        {isLoading ? (
          <Container flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator />
          </Container>
        ) : (
          <CustomAmountBody
            merchantInfoDID={merchantInfoDID}
            spendAmount={spendAmount}
          />
        )}
      </Container>
    </SafeAreaView>
  );
};

interface CustomAmountBodyProps {
  merchantInfoDID: MerchantInformation | undefined;
  spendAmount: number | undefined;
}

const CustomAmountBody = memo(
  ({ merchantInfoDID, spendAmount }: CustomAmountBodyProps) => {
    const [selectedCurrency, setCurrency] = useState<string>('SPEND');

    const [inputValue, setInputValue] = useState<string | undefined>(
      `${spendAmount || 0}`
    );

    return (
      <Container flex={1} flexDirection="column" width="100%">
        <Container padding={5} paddingTop={3} flex={1}>
          <MerchantSectionCard
            merchantInfoDID={merchantInfoDID}
            flex={1}
            justifyContent="space-between"
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
          <Button>
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
      {inputValue && (
        <Text marginTop={2} numberOfLines={1} fontSize={12} color="blueText">
          {
            convertSpendForBalanceDisplay(
              inputValue,
              nativeCurrency,
              currencyConversionRates,
              true
            ).nativeBalanceDisplay
          }
        </Text>
      )}
    </Container>
  );
};

export default memo(PayMerchantCustomAmount);
