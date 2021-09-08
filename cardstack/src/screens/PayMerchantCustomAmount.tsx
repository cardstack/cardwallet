import React, { memo, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { SlackSheet } from '@rainbow-me/components/sheet';
import {
  SafeAreaView,
  Container,
  InputAmount,
  HorizontalDivider,
  Text,
} from '@cardstack/components';
import { Network } from '@rainbow-me/helpers/networkTypes';
import {
  useDimensions,
  useNativeCurrencyAndConversionRates,
} from '@rainbow-me/hooks';

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
  const { height: deviceHeight } = useDimensions();
  const [inputValue, setInputValue] = useState<string>();

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  return (
    <SafeAreaView flex={1} width="100%" height={deviceHeight}>
      <StatusBar barStyle="light-content" />
      {/* {Device.isIOS && <TouchableBackdrop onPress={goBack} />} */}
      <SlackSheet hasKeyboard={true} height="100%" scrollEnabled>
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
      </SlackSheet>
    </SafeAreaView>
  );
};

export default memo(PayMerchantCustomAmount);
