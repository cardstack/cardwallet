import React, { useCallback, useEffect, useState } from 'react';

import { Button, Container } from '@cardstack/components';

import { checkIsValidAddressOrDomain } from '@rainbow-me/helpers/validators';
import { useClipboard } from '@rainbow-me/hooks';
import { deviceUtils } from '@rainbow-me/utils';

export default function PasteAddressButton({ onPress, onInvalidPaste }) {
  const [isValid, setIsValid] = useState(false);
  const {
    clipboard,
    enablePaste,
    getClipboard,
    hasClipboardData,
  } = useClipboard();

  useEffect(() => {
    async function validate() {
      const isValidAddress = await checkIsValidAddressOrDomain(clipboard);
      setIsValid(isValidAddress);
    }

    if (!deviceUtils.isIOS14) {
      validate();
    }
  }, [clipboard]);

  const handlePress = useCallback(() => {
    if (!enablePaste) return;

    getClipboard(async clipboardData => {
      const isValidAddress = await checkIsValidAddressOrDomain(clipboardData);

      if (isValidAddress) {
        return onPress?.(clipboardData);
      }

      return onInvalidPaste();
    });
  }, [enablePaste, getClipboard, onInvalidPaste, onPress]);

  return (
    <Container overflow="hidden">
      <Button
        disabled={
          deviceUtils.isIOS14 ? !hasClipboardData : clipboard && !isValid
        }
        onPress={handlePress}
        testID="paste-address-button"
        variant="extraSmall"
      >
        Paste
      </Button>
    </Container>
  );
}
