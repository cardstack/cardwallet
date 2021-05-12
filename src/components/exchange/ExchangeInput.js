import React, { Fragment, useCallback, useState } from 'react';
import { InteractionManager } from 'react-native';
import styled from 'styled-components';

import { InputMask, Text } from '@cardstack/components';
import { magicMemo } from '@rainbow-me/utils';

const AndroidMaskWrapper = styled.View`
  background-color: ${({ theme: { colors } }) => colors.white};
  bottom: 0;
  left: 68.7;
  position: absolute;
  right: 0;
  top: 11.5;
`;

const ExchangeInput = (
  {
    androidMaskMaxLength = 8,
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
    useCustomAndroidMask = false,
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

  let valueToRender = value;
  if (value?.length > androidMaskMaxLength) {
    valueToRender = value.substring(0, androidMaskMaxLength) + '...';
  }

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
      {useCustomAndroidMask && !ref.current?.isFocused() && (
        <AndroidMaskWrapper>
          <Text
            color="black"
            size={size}
            testID={testID}
            weight={weight}
            {...props}
          >
            {valueToRender}
          </Text>
        </AndroidMaskWrapper>
      )}
    </Fragment>
  );
};

export default magicMemo(React.forwardRef(ExchangeInput), [
  'color',
  'editable',
  'placeholder',
  'placeholderTextColor',
  'onChangeText',
  'onFocus',
  'value',
]);
