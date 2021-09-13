import React, { useCallback, memo } from 'react';
import {
  Container,
  ContainerProps,
  Input,
  Text,
  Icon,
  Touchable,
} from './../index';
import { formatNative } from '@cardstack/utils';
import Routes from '@rainbow-me/routes';
import { supportedNativeCurrencies } from '@rainbow-me/references';
import { useNavigation } from '@rainbow-me/navigation';

type InputAmountProps = {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: string;
  setCurrency?: (_val: string) => void;
  hasCurrencySymbol?: boolean;
} & ContainerProps;

export const InputAmount = memo(
  ({
    inputValue,
    setInputValue,
    nativeCurrency,
    hasCurrencySymbol = true,
    setCurrency,
    ...containerProps
  }: InputAmountProps) => {
    const { navigate } = useNavigation();

    const onChangeText = useCallback(
      text => {
        setInputValue(formatNative(text, nativeCurrency));
      },
      [setInputValue, nativeCurrency]
    );

    const openCurrencySelectionModal = useCallback(() => {
      navigate(Routes.CURRENCY_SELECTION_MODAL);
    }, [navigate]);

    return (
      <Container
        flexDirection="row"
        width="100%"
        alignItems="center"
        justifyContent="center"
        {...containerProps}
      >
        {hasCurrencySymbol && (
          <Text
            color={inputValue ? 'black' : 'underlineGray'}
            fontWeight="bold"
            paddingRight={1}
            paddingTop={1}
            size="largeBalance"
          >
            {(supportedNativeCurrencies as any)[nativeCurrency].symbol}
          </Text>
        )}
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
        {setCurrency ? (
          <Touchable
            onPress={() => {
              openCurrencySelectionModal();
            }}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            marginTop={2}
            paddingLeft={1}
          >
            <Text size="body" fontWeight="bold">
              {nativeCurrency}
            </Text>
            <Icon
              name="doubleCaret"
              iconSize="medium"
              paddingLeft={1}
              marginTop={1}
              width={14}
            />
          </Touchable>
        ) : (
          <Container
            justifyContent="flex-end"
            alignItems="flex-end"
            height="100%"
          >
            <Text size="body" fontWeight="bold">
              {nativeCurrency}
            </Text>
          </Container>
        )}
      </Container>
    );
  }
);
