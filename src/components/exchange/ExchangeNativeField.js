import React, { useCallback, useMemo, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components';
import { Row } from '../layout';
import ExchangeInput from './ExchangeInput';
import { Text } from '@cardstack/components';
import { useColorForAsset } from '@rainbow-me/hooks';
import { supportedNativeCurrencies } from '@rainbow-me/references';
import { fonts } from '@rainbow-me/styles';

const CurrencySymbol = styled(Text).attrs(({ height, color }) => ({
  color: color,
  letterSpacing: 'roundedTight',
  lineHeight: height,
  size: 'larger',
  weight: 'regular',
}))`
  ${android ? 'margin-bottom: 1.5;' : ''};
`;

const NativeInput = styled(ExchangeInput).attrs({
  letterSpacing: fonts.letterSpacing.roundedTight,
  size: fonts.size.larger,
  weight: fonts.weight.regular,
})`
  height: ${({ height }) => height};
`;

const ExchangeNativeField = (
  {
    address,
    editable,
    height,
    nativeAmount,
    nativeCurrency,
    onFocus,
    setNativeAmount,
    testID,
  },
  ref
) => {
  const colorForAsset = useColorForAsset({ address });
  const [isFocused, setIsFocused] = useState(false);
  const { mask, placeholder, symbol } = supportedNativeCurrencies[
    nativeCurrency
  ];

  const handleFocusNativeField = useCallback(() => ref?.current?.focus(), [
    ref,
  ]);

  const handleBlur = useCallback(() => setIsFocused(false), []);
  const handleFocus = useCallback(
    event => {
      setIsFocused(true);
      if (onFocus) onFocus(event);
    },
    [onFocus]
  );

  const color = useMemo(() => {
    return isFocused ? 'black' : 'settingsGrayDark';
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={handleFocusNativeField}>
      <Row align="center" flex={1} height={height}>
        <Text color={color} fontWeight="100" height={height}>
          {symbol}
        </Text>
        <ExchangeInput
          // color={nativeAmountColor}
          editable={editable}
          height={android ? height : 58}
          mask={mask}
          onBlur={handleBlur}
          onChangeText={setNativeAmount}
          onFocus={handleFocus}
          placeholder={placeholder}
          ref={ref}
          selectionColor={colorForAsset}
          size={18}
          testID={nativeAmount ? `${testID}-${nativeAmount}` : testID}
          value={nativeAmount}
          weight="100"
        />
      </Row>
    </TouchableWithoutFeedback>
  );
};

export default React.forwardRef(ExchangeNativeField);
