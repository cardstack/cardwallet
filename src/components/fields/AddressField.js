import React, { useCallback, useEffect, useState } from 'react';

import { isHexString } from '../../handlers/web3';
import { checkIsValidAddressOrDomain } from '../../helpers/validators';
import { Row } from '../layout';
import { Container, Input, Text, Touchable } from '@cardstack/components';
import { useClipboard } from '@rainbow-me/hooks';
import { abbreviations, addressUtils } from '@rainbow-me/utils';

const formatValue = value =>
  isHexString(value) && value.length === addressUtils.maxLength
    ? abbreviations.address(value, 4, 10)
    : value;

const AddressField = (
  { address, autoFocus, name, onChange, onFocus, testID, ...props },
  ref
) => {
  const { clipboard, setClipboard } = useClipboard();
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  const expandAbbreviatedClipboard = useCallback(() => {
    if (clipboard === abbreviations.formatAddressForDisplay(address)) {
      setClipboard(address);
    }
  }, [address, clipboard, setClipboard]);

  const validateAddress = useCallback(async address => {
    const newIsValid = await checkIsValidAddressOrDomain(address);
    return setIsValid(newIsValid);
  }, []);

  const handleChange = useCallback(
    ({ nativeEvent: { text } }) => {
      onChange(text);
      validateAddress(text);
      expandAbbreviatedClipboard();
    },
    [expandAbbreviatedClipboard, onChange, validateAddress]
  );

  useEffect(() => {
    if (address !== inputValue || name !== inputValue) {
      setInputValue(name || address);
      setIsValid(true);
    }
  }, [address, inputValue, name]);

  console.log('isValid', isValid);

  return (
    <Row flex={1}>
      <Input
        {...props}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        color={isValid ? 'settingsGray' : 'invalid'}
        flexGrow={1}
        fontSize={15}
        fontWeight="600"
        keyboardType={android ? 'visible-password' : 'default'}
        maxLength={addressUtils.maxLength}
        onBlur={expandAbbreviatedClipboard}
        onChange={handleChange}
        onChangeText={setInputValue}
        onFocus={onFocus}
        ref={ref}
        selectTextOnFocus
        spellCheck={false}
        testID={testID}
        value={formatValue(inputValue)}
        zIndex={1}
      />
      {!inputValue && (
        <Container position="absolute" top={0} zIndex={1}>
          <Touchable onPress={ref?.current?.focus}>
            <Text color="grayText" fontSize={15} fontWeight="600">
              Enter Address (0x...) or ENS
            </Text>
          </Touchable>
        </Container>
      )}
    </Row>
  );
};

export default React.forwardRef(AddressField);
