import { utils as ethersUtils } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Container, Input, Text, Touchable } from '@cardstack/components';
import { Device } from '@cardstack/utils';

import { useClipboard } from '@rainbow-me/hooks';
import { abbreviations, addressUtils } from '@rainbow-me/utils';

import { checkIsValidAddressOrDomain } from '../../helpers/validators';
import { Row } from '../layout';

const formatValue = value =>
  ethersUtils.isHexString(value) && value.length === addressUtils.maxLength
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

  const validateAddress = useCallback(async possibleAddress => {
    const newIsValid = await checkIsValidAddressOrDomain(possibleAddress);
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

  const androidProps = useMemo(
    () => ({
      ...(Device.isAndroid && {
        top: '28%',
      }),
    }),
    []
  );

  const onPress = useCallback(() => ref?.current?.focus(), [ref]);

  return (
    <Row flex={1}>
      <Input
        {...props}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        color={isValid ? 'settingsTeal' : 'invalid'}
        flexGrow={1}
        fontSize={15}
        keyboardType={Device.isAndroid ? 'visible-password' : 'default'}
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
        weight="bold"
        zIndex={1}
      />
      {!inputValue && (
        <Container position="absolute" zIndex={1} {...androidProps}>
          <Touchable onPress={onPress}>
            <Text color="grayText" fontSize={15} weight="bold">
              Enter Address (0x...) or ENS
            </Text>
          </Touchable>
        </Container>
      )}
    </Row>
  );
};

export default React.forwardRef(AddressField);
