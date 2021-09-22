import React, { useCallback, memo } from 'react';
import { InteractionManager } from 'react-native';
import {
  CenteredContainer,
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
  hasCurrencySymbol?: boolean;
} & ContainerProps;

export const InputAmount = memo(
  ({
    inputValue,
    setInputValue,
    nativeCurrency,
    hasCurrencySymbol = true,
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

    return (
      <CenteredContainer flexDirection="row" width="100%" {...containerProps}>
        {hasCurrencySymbol ? (
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
              {nativeCurrency === 'SPD'
                ? '§'
                : (supportedNativeCurrencies as any)[nativeCurrency].symbol}
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
    );
  }
);
