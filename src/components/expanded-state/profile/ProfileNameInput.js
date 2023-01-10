import React, { Fragment, useCallback, useEffect, useRef } from 'react';

import { Input } from '@cardstack/components';

import { PlaceholderText } from '../../text';

function ProfileNameInput(
  { onChange, placeholder, testID, value, ...props },
  ref
) {
  const placeholderRef = useRef(null);

  const handleChange = useCallback(
    ({ nativeEvent: { text } }) => {
      const newValue = text.charCodeAt(0) === 32 ? text.substring(1) : text;
      if (newValue.length > 0) {
        placeholderRef.current.updateValue(' ');
      } else {
        placeholderRef.current.updateValue(placeholder);
      }
      onChange(newValue);
    },
    [onChange, placeholder]
  );

  useEffect(() => {
    if (!value || value.length === 0) {
      placeholderRef.current.updateValue(placeholder);
    }
  }, [placeholder, value]);

  return (
    <Fragment>
      <PlaceholderText ref={placeholderRef} />
      <Input
        {...props}
        autoCapitalize="words"
        autoFocus
        fontSize={20}
        onChange={handleChange}
        ref={ref}
        spellCheck={false}
        testID={testID}
        textAlign="center"
        value={value}
        weight="bold"
      />
    </Fragment>
  );
}

export default React.forwardRef(ProfileNameInput);
