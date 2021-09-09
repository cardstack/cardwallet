import React, { memo, useState } from 'react';
import {
  SafeAreaView,
  Container,
  InputAmount,
  HorizontalDivider,
  SheetHandle,
  Text,
  Button,
} from '@cardstack/components';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';

interface RouteType {
  params: {
    merchantAddress: string;
    network: Network;
    amount?: string;
    currency?: string;
  };
  key: string;
  name: string;
}

const PayMerchantCustomAmount = () => {
  const [inputValue, setInputValue] = useState<string>();

  const [
    nativeCurrency,
    // currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="black">
      <Container
        flex={1}
        alignItems="center"
        marginTop={4}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        backgroundColor="white"
        flexDirection="column"
        width="100%"
        paddingTop={3}
      >
        <SheetHandle />
        <Container flex={1} padding={5} paddingTop={3}>
          <Container
            borderRadius={10}
            backgroundColor="grayCardBackground"
            flex={1}
            width="100%"
            padding={7}
          >
            <InputAmount
              inputValue={inputValue}
              nativeCurrency={nativeCurrency}
              setInputValue={setInputValue}
            />
            <Container paddingHorizontal={5}>
              <HorizontalDivider />
              {/* <SpendAmount
                formattedAmount={inputValue}
                nativeCurrencyRate={currencyConversionRates[nativeCurrency]}
              /> */}
            </Container>
          </Container>
        </Container>
        <Container flex={1}>
          <Button onPress={() => {}}>Next</Button>
        </Container>
      </Container>
    </SafeAreaView>
  );
};

export default memo(PayMerchantCustomAmount);
