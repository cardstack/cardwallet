import React, { useCallback, useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components';
import { CoinIcon, CoinIconSize } from '../coin-icon';
import { EnDash } from '../text';
import ExchangeInput from './ExchangeInput';
import { Button, Container } from '@cardstack/components';
import { useColorForAsset } from '@rainbow-me/hooks';
import { borders } from '@rainbow-me/styles';

const CoinIconSkeleton = styled.View`
  ${borders.buildCircle(CoinIconSize)};
  background-color: ${({ theme: { colors } }) =>
    colors.alpha(colors.blueGreyDark, 0.1)};
`;

const ExchangeField = (
  {
    address,
    amount,
    disableCurrencySelection,
    onBlur,
    onFocus,
    onPressSelectCurrency,
    setAmount,
    symbol,
    testID,
    autoFocus,
    useCustomAndroidMask = false,
    ...props
  },
  ref
) => {
  const colorForAsset = useColorForAsset({ address });
  const handleFocusField = useCallback(() => ref?.current?.focus(), [ref]);
  const { colors } = useTheme();
  useEffect(() => {
    autoFocus && handleFocusField();
  }, [autoFocus, handleFocusField]);
  return (
    <Container
      alignItems="center"
      flexDirection="row"
      justifyContent="flex-end"
      width="100%"
      {...props}
    >
      <TouchableWithoutFeedback onPress={handleFocusField}>
        <Container
          alignItems="center"
          disableCurrencySelection={disableCurrencySelection}
          flex={1}
          flexDirection="row"
        >
          {symbol ? (
            <CoinIcon address={address} symbol={symbol} />
          ) : (
            <CoinIconSkeleton />
          )}
          <Container marginLeft={2}>
            <ExchangeInput
              color={colorForAsset}
              editable={!!symbol}
              onBlur={onBlur}
              onChangeText={setAmount}
              onFocus={onFocus}
              placeholder={symbol ? '0' : EnDash.unicode}
              placeholderTextColor={
                symbol ? undefined : colors.alpha(colors.blueGreyDark, 0.1)
              }
              ref={ref}
              testID={amount ? `${testID}-${amount}` : testID}
              useCustomAndroidMask={useCustomAndroidMask}
              value={amount}
            />
          </Container>
        </Container>
      </TouchableWithoutFeedback>
      {!disableCurrencySelection && (
        <>
          <Button
            iconPosition="right"
            iconProps={{
              name: 'chevron-right',
              color: address ? 'white' : 'black',
            }}
            onPress={onPressSelectCurrency}
            testID={testID + '-selection-button'}
            variant={address ? 'extraSmallTertiary' : 'small'}
          >
            {symbol || 'Choose Token'}
          </Button>
        </>
      )}
    </Container>
  );
};

export default React.forwardRef(ExchangeField);
