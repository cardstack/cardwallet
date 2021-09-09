import React, { memo, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { usePaymentMerchantUniversalLink } from './PayMerchantUniversalLink';
import {
  SafeAreaView,
  Container,
  Input,
  HorizontalDivider,
  SheetHandle,
  Text,
  Button,
} from '@cardstack/components';
import { useMerchantInfoDID } from '@cardstack/hooks';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { formatNative } from '@cardstack/utils';
import { supportedNativeCurrencies } from '@rainbow-me/references';

const PayMerchantCustomAmount = () => {
  const [
    nativeCurrency,
    // currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const { isLoading, data } = usePaymentMerchantUniversalLink();

  const { infoDID = '', spendAmount, prepaidCard, merchantSafe } = data;
  const { merchantInfoDID } = useMerchantInfoDID(infoDID);
  console.log('data----', data, isLoading, merchantInfoDID);
  const [inputValue, setInputValue] = useState<string>(`${spendAmount}`);

  const onChangeText = useCallback(
    text => {
      setInputValue(formatNative(text, nativeCurrency));
    },
    [setInputValue, nativeCurrency]
  );

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
          <Container flexDirection="column" flex={1}>
            <Container flex={1} padding={5} paddingTop={3} width="100%">
              <Container
                borderRadius={10}
                backgroundColor="grayCardBackground"
                flex={1}
                width="100%"
                padding={5}
                flexDirection="column"
              >
                <Container flex={1} alignItems="center" width="100%">
                  <ContactAvatar
                    color={merchantInfoDID?.color}
                    size="xlarge"
                    value={merchantInfoDID?.name}
                    textColor={merchantInfoDID?.textColor}
                  />
                  <Text
                    weight="bold"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    fontSize={20}
                    marginTop={3}
                  >
                    {merchantInfoDID?.name}
                  </Text>
                </Container>
                <Container
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                >
                  <Text weight="bold" numberOfLines={1} fontSize={11}>
                    SPEND (§1 = 0.01 USD)
                  </Text>
                  <Container flex={1} flexDirection="row" width="100%">
                    <Container flex={1} flexGrow={1}>
                      <Input
                        alignSelf="stretch"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus
                        color="black"
                        fontSize={30}
                        fontWeight="bold"
                        keyboardType="numeric"
                        maxLength={(inputValue || '').length + 2} // just to avoid possible flicker issue
                        multiline
                        onChangeText={onChangeText}
                        placeholder="0.00"
                        placeholderTextColor="grayMediumLight"
                        spellCheck={false}
                        testID="RequestPaymentInput"
                        value={inputValue}
                        zIndex={1}
                      />
                    </Container>
                    <Text paddingLeft={1} paddingTop={1} size="largeBalance">
                      {nativeCurrency}
                    </Text>
                  </Container>
                </Container>
              </Container>
            </Container>
            <Container flex={1}>
              <Button onPress={() => {}}>Next</Button>
            </Container>
          </Container>
        )}
      </Container>
    </SafeAreaView>
  );
};

export default memo(PayMerchantCustomAmount);
