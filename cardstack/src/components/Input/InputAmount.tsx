import React, { useCallback, memo } from 'react';
import { InteractionManager } from 'react-native';
import {
  CenteredContainer,
  Container,
  ContainerProps,
  Input,
  Text,
  Icon,
  SPDCurrency,
  Touchable,
} from './../index';
import { formatNative } from '@cardstack/utils';
import Routes from '@rainbow-me/routes';
import { supportedNativeCurrencies } from '@rainbow-me/references';
import { useNavigation } from '@rainbow-me/navigation';

export enum CURRENCY_DISPLAY_MODE {
  NO_DISPLAY = 'NO_DISPLAY',
  SYMBOL = 'SYMBOL',
  LABEL = 'LABEL',
}

const textShadowOffset = {
  width: 0,
  height: 1,
};

type InputAmountProps = {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: string;
  currencyDisplayMode?: CURRENCY_DISPLAY_MODE;
} & ContainerProps;

export const InputAmount = memo(
  ({
    inputValue,
    setInputValue,
    nativeCurrency,
    currencyDisplayMode = CURRENCY_DISPLAY_MODE.SYMBOL,
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
      InteractionManager.runAfterInteractions(() =>
        navigate(Routes.CURRENCY_SELECTION_MODAL, {
          defaultCurrency: nativeCurrency,
        })
      );
    }, [nativeCurrency, navigate]);

    const selectedCurrency =
      nativeCurrency === 'SPD'
        ? SPDCurrency
        : (supportedNativeCurrencies as any)[nativeCurrency];

    return (
      <Container width="100%" {...containerProps}>
        {currencyDisplayMode === CURRENCY_DISPLAY_MODE.LABEL ? (
          <Text
            size="xxs"
            textAlign="center"
            fontWeight="bold"
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
                fontWeight="bold"
                paddingRight={1}
                paddingTop={1}
                size="largeBalance"
              >
                {selectedCurrency.symbol}
              </Text>
            </Container>
          ) : null}
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
              maxLength={(inputValue || '').length + 1} // just to avoid possible flicker issue
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
          <Touchable
            onPress={openCurrencySelectionModal}
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
        </CenteredContainer>
      </Container>
    );
  }
);
