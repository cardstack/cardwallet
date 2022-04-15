import { nativeCurrencies, NativeCurrency } from '@cardstack/cardpay-sdk';
import React, { useCallback, memo } from 'react';
import { Keyboard } from 'react-native';

import { palette } from '@cardstack/theme/colors';

import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { removeLeadingZeros } from '@rainbow-me/utils';

import {
  CenteredContainer,
  Container,
  ContainerProps,
  InputMask,
  Text,
  Icon,
  Touchable,
} from './../index';

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

type InputAmountProps = {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: NativeCurrency;
  currencyDisplayMode?: CURRENCY_DISPLAY_MODE;
  isInvalid?: boolean;
  testID?: string;
} & ContainerProps;

export const InputAmount = memo(
  ({
    inputValue,
    setInputValue,
    nativeCurrency,
    currencyDisplayMode = CURRENCY_DISPLAY_MODE.SYMBOL,
    isInvalid,
    testID,
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
        defaultCurrency: nativeCurrency,
      });
    }, [nativeCurrency, navigate]);

    const selectedCurrency = nativeCurrencies[nativeCurrency];

    return (
      <Container width="100%" {...containerProps}>
        {currencyDisplayMode === CURRENCY_DISPLAY_MODE.LABEL ? (
          <Text
            size="xxs"
            textAlign="center"
            weight="bold"
            marginBottom={2}
            textTransform="uppercase"
            textShadowOffset={textShadowOffset}
          >
            {`${selectedCurrency.label} (${selectedCurrency.currency})`}
          </Text>
        ) : null}
        <CenteredContainer flexDirection="row" width="100%">
          {currencyDisplayMode === CURRENCY_DISPLAY_MODE.SYMBOL ? (
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
                {selectedCurrency.symbol}
              </Text>
            </Container>
          ) : null}
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
        </CenteredContainer>
      </Container>
    );
  }
);
