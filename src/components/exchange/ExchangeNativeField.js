import React, { useCallback, useMemo, useState } from 'react';
import { Alert, TouchableWithoutFeedback } from 'react-native';
import { Row } from '../layout';
import ExchangeInput from './ExchangeInput';
import { Text } from '@cardstack/components';
import { useColorForAsset } from '@rainbow-me/hooks';
import { supportedNativeCurrencies } from '@rainbow-me/references';

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

  const handleBlur = useCallback(() => setIsFocused(false), [setIsFocused]);
  const handleFocus = useCallback(
    event => {
      setIsFocused(true);
      if (onFocus) onFocus(event);
    },
    [onFocus, setIsFocused]
  );

  const setTextStyle = useMemo(() => {
    const nativeAmountExists =
      typeof nativeAmount === 'string' && nativeAmount.length > 0;

    return {
      color: nativeAmountExists ? 'black' : 'settingsGrayDark',
      opacity: nativeAmountExists ? 1 : 0.5,
    };
  }, [nativeAmount]);

  return (
    <TouchableWithoutFeedback onPress={handleFocusNativeField}>
      <Row align="center" flex={1} height={height}>
        <Text fontSize={22} fontWeight="100" height={height} {...setTextStyle}>
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
          size={22}
          testID={nativeAmount ? `${testID}-${nativeAmount}` : testID}
          value={nativeAmount}
          weight="100"
        />
      </Row>
    </TouchableWithoutFeedback>
  );
};

export default React.forwardRef(ExchangeNativeField);
