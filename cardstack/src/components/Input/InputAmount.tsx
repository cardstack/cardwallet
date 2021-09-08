import React, { useCallback } from 'react';
import { Container, Input, Text } from './../index';
import { formatNative } from '@cardstack/utils';
import { supportedNativeCurrencies } from '@rainbow-me/references';

type InputAmountProps = {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: string;
};

export const InputAmount = ({
  inputValue,
  setInputValue,
  nativeCurrency,
}: InputAmountProps) => {
  const onChangeText = useCallback(
    text => {
      setInputValue(formatNative(text, nativeCurrency));
    },
    [setInputValue, nativeCurrency]
  );

  return (
    <Container
      flex={1}
      flexDirection="row"
      marginTop={8}
      paddingHorizontal={5}
      width="100%"
    >
      <Text
        color={inputValue ? 'black' : 'underlineGray'}
        fontWeight="bold"
        paddingRight={1}
        paddingTop={1}
        size="largeBalance"
      >
        {(supportedNativeCurrencies as any)[nativeCurrency].symbol}
      </Text>
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
  );
};
