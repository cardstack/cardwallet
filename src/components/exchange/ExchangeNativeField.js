import { nativeCurrencies } from '@cardstack/cardpay-sdk';
import React, { useCallback, useMemo } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Row } from '../layout';
import ExchangeInput from './ExchangeInput';
import { Text } from '@cardstack/components';
import { useColorForAsset } from '@rainbow-me/hooks';

const ExchangeNativeField = (
  {
    address,
    editable,
    height,
    nativeAmount,
    nativeCurrency,
    setNativeAmount,
    testID,
  },
  ref
) => {
  const colorForAsset = useColorForAsset({ address });
  const { mask, placeholder, symbol } = nativeCurrencies[nativeCurrency];

  const handleFocusNativeField = useCallback(() => ref?.current?.focus(), [
    ref,
  ]);

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
        <Text fontSize={22} height={height} weight="regular" {...setTextStyle}>
          {symbol}
        </Text>
        <ExchangeInput
          editable={editable}
          height={android ? height : 58}
          mask={mask}
          onChangeText={setNativeAmount}
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
