import { nativeCurrencies, NativeCurrency } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/native';
import React, {
  useCallback,
  memo,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react';
import { Keyboard } from 'react-native';

import { useSpendToNativeDisplay } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import { palette } from '@cardstack/theme/colors';

import { removeLeadingZeros } from '@rainbow-me/utils';

import {
  CenteredContainer,
  Container,
  ContainerProps,
  InputMask,
  Text,
  Icon,
  Touchable,
} from '../../index';

import { MIN_SPEND_AMOUNT } from './useInputAmountHelper';

export enum CURRENCY_DISPLAY_MODE {
  NO_DISPLAY = 'NO_DISPLAY',
  SYMBOL = 'SYMBOL',
  LABEL = 'LABEL',
}

const textShadowOffset = {
  width: 0,
  height: 1,
};

const INPUT_MASK = '[099999999999999999].[999999999999999999]';

export type InputAmountProps = {
  inputValue: string | undefined;
  setInputValue: Dispatch<SetStateAction<string | undefined>>;
  onCurrencyChange: (currency: NativeCurrency) => void;
  selectedCurrency: NativeCurrency;
  currencyDisplayMode?: CURRENCY_DISPLAY_MODE;
  isInvalid?: boolean;
  testID?: string;
} & ContainerProps;

export const InputAmount = memo(
  ({
    inputValue,
    setInputValue,
    currencyDisplayMode = CURRENCY_DISPLAY_MODE.SYMBOL,
    isInvalid,
    testID,
    selectedCurrency,
    onCurrencyChange,
    ...containerProps
  }: InputAmountProps) => {
    const { navigate } = useNavigation();

    const onChangeText = useCallback(
      formatted => {
        const formattedValue = removeLeadingZeros(formatted);

        if (inputValue !== formattedValue) {
          setInputValue(formattedValue);
        }
      },
      [inputValue, setInputValue]
    );

    const openCurrencySelectionModal = useCallback(() => {
      Keyboard.dismiss();

      navigate(Routes.CURRENCY_SELECTION_MODAL, {
        onCurrencyChange,
        selectedCurrency,
      });
    }, [navigate, onCurrencyChange, selectedCurrency]);

    const selectedCurrencyInfo = useMemo(
      () => nativeCurrencies[selectedCurrency],
      [selectedCurrency]
    );

    const {
      nativeBalanceDisplay: minimumAmountDisplay,
    } = useSpendToNativeDisplay({
      spendAmount: MIN_SPEND_AMOUNT,
      customNativeCurrency: selectedCurrency,
    });

    return (
      <Container>
        <Container width="100%" {...containerProps}>
          {currencyDisplayMode === CURRENCY_DISPLAY_MODE.LABEL && (
            <Text
              size="xxs"
              textAlign="center"
              weight="bold"
              marginBottom={2}
              textTransform="uppercase"
              textShadowOffset={textShadowOffset}
            >
              {`${selectedCurrencyInfo.label} (${selectedCurrencyInfo.currency})`}
            </Text>
          )}
          <CenteredContainer flexDirection="row" width="100%">
            {currencyDisplayMode === CURRENCY_DISPLAY_MODE.SYMBOL && (
              <Container
                justifyContent="flex-start"
                alignItems="center"
                height="100%"
              >
                <Text
                  color={inputValue ? 'black' : 'underlineGray'}
                  weight="bold"
                  paddingRight={1}
                  paddingTop={1}
                  size="largeBalance"
                >
                  {selectedCurrencyInfo.symbol}
                </Text>
              </Container>
            )}
            <Container flex={1} flexGrow={1}>
              <InputMask
                alignSelf="stretch"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                color={isInvalid ? 'red' : 'black'}
                fontSize={30}
                fontWeight="bold"
                keyboardType="decimal-pad"
                mask={INPUT_MASK}
                multiline
                onChangeText={onChangeText}
                placeholder="0"
                placeholderTextColor={palette.grayMediumLight}
                spellCheck={false}
                testID={testID || 'RequestPaymentInput'}
                value={inputValue}
                zIndex={1}
              />
            </Container>
            <Touchable
              onPress={openCurrencySelectionModal}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              marginTop={2}
              paddingLeft={1}
            >
              <Text size="body" weight="bold">
                {selectedCurrency}
              </Text>
              <Icon
                name="doubleCaret"
                iconSize="medium"
                paddingLeft={1}
                marginTop={1}
                width={14}
              />
            </Touchable>
          </CenteredContainer>
        </Container>
        <Container height={20}>
          <Text
            textAlign="center"
            textTransform="uppercase"
            fontSize={12}
            weight="bold"
            color="red"
            marginTop={1}
          >
            {isInvalid ? `minimum ${minimumAmountDisplay}` : ''}
          </Text>
        </Container>
      </Container>
    );
  }
);
