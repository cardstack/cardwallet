import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { PlaceholderText } from '../../text';
import { Input } from '@cardstack/components';
import { useMagicAutofocus } from '@rainbow-me/hooks';

const NameInput = styled(Input).attrs({
  autoCapitalize: 'words',
  autoFocus: true,
  fontSize: 20,
  fontWeight: '600',
  returnKeyType: 'done',
  spellCheck: false,
  textAlign: 'center',
})`
  ${android ? 'height: 70; margin-vertical: -8;' : ''}
  width: 100%;
`;

function ProfileNameInput(
  { onChange, placeholder, testID, value, ...props },
  ref
) {
  const { handleFocus } = useMagicAutofocus(ref);
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
      <NameInput
        {...props}
        onChange={handleChange}
        onFocus={handleFocus}
        ref={ref}
        testID={testID}
        value={value}
      />
    </Fragment>
  );
}

export default React.forwardRef(ProfileNameInput);
