import React, { Fragment, memo, useCallback, useState } from 'react';
import { InteractionManager } from 'react-native';

import { InputMask } from '@cardstack/components';

const ExchangeInput = (
  {
    editable,
    keyboardAppearance = 'dark',
    mask = '[099999999999999999].[999999999999999999]',
    onBlur,
    onChange,
    onChangeText,
    onFocus,
    placeholder = '0',
    placeholderTextColor = 'settingsGrayDark',
    size = 35,
    testID,
    value = '',
    weight = '700',
    ...props
  },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleBlur = useCallback(
    event => {
      if (typeof value === 'string') {
        const parts = value.split('.');
        if (parts[0].length > 1 && !Number(parts[0])) {
          onChangeText(`0.${parts[1]}`);
        }
      }
      setIsFocused(false);
      setIsTouched(false);
      onBlur?.(event);
    },
    [onBlur, onChangeText, value]
  );

  const handleChange = useCallback(
    event => {
      if (isFocused && !isTouched) {
        InteractionManager.runAfterInteractions(() => setIsTouched(true));
      }

      onChange?.(event);
    },
    [isFocused, isTouched, onChange]
  );

  const handleChangeText = useCallback(
    formatted => {
      let text = formatted;
      if (isTouched && !text.length && !value) {
        text = '0.';
      }

      onChangeText?.(text);
    },
    [isTouched, onChangeText, value]
  );

  const handleFocus = useCallback(
    event => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus]
  );

  return (
    <Fragment>
      <InputMask
        {...props}
        allowFontScaling={false}
        color="black"
        editable={editable}
        flex={1}
        fontFamily="OpenSans-Regular"
        fontSize={size}
        fontWeight={weight}
        keyboardAppearance={keyboardAppearance}
        keyboardType="decimal-pad"
        mask={mask}
        onBlur={handleBlur}
        onChange={handleChange}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        ref={ref}
        testID={testID}
        value={value}
      />
    </Fragment>
  );
};

export default memo(React.forwardRef(ExchangeInput));
