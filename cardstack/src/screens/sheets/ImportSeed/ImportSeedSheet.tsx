import React, { memo } from 'react';

import { useImportSeedSheet } from './useImportSeedSheet';
import {
  Button,
  CenteredContainer,
  Container,
  Input,
  Sheet,
  Text,
} from '@cardstack/components';
import { Device } from '@cardstack/utils';
import { useKeyboardHeight, useMagicAutofocus } from '@rainbow-me/hooks';
import {
  ToastPositionContainer,
  InvalidPasteToast,
} from '@rainbow-me/components/toasts';
import { colors } from '@cardstack/theme';

const ImportSeedSheet = () => {
  const {
    handleSetSeedPhrase,
    handlePressImportButton,
    seedPhrase,
    inputRef,
    busy,
    isSecretValid,
    handlePressPasteButton,
    isClipboardValidSecret,
  } = useImportSeedSheet();

  const { handleFocus } = useMagicAutofocus(inputRef);
  const keyboardHeight = useKeyboardHeight();

  return (
    <>
      <Sheet isFullScreen>
        <Text fontSize={18} fontWeight="bold" textAlign="center">
          Add account
        </Text>
        <Container flex={1} paddingHorizontal={4}>
          <CenteredContainer flex={1}>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              enablesReturnKeyAutomatically
              fontSize={18}
              fontWeight="600"
              keyboardType={Device.isAndroid ? 'visible-password' : 'default'}
              multiline
              numberOfLines={3}
              onChangeText={handleSetSeedPhrase}
              onFocus={handleFocus}
              onSubmitEditing={handlePressImportButton}
              placeholder="Enter seed phrase or secret recovery phrase"
              placeholderTextColor={colors.backgroundLightGray}
              ref={inputRef}
              returnKeyType="done"
              spellCheck={false}
              testID="import-sheet-input"
              textAlign="center"
              value={seedPhrase}
            />
          </CenteredContainer>
          <Container alignSelf="flex-end">
            {seedPhrase ? (
              <Button
                disabled={!isSecretValid}
                loading={busy}
                onPress={handlePressImportButton}
                variant="extraSmall"
              >
                Import
              </Button>
            ) : (
              <Button
                disabled={!isClipboardValidSecret}
                onPress={handlePressPasteButton}
                variant="extraSmallDark"
              >
                Paste
              </Button>
            )}
          </Container>
        </Container>
      </Sheet>
      <ToastPositionContainer bottom={keyboardHeight}>
        <InvalidPasteToast />
      </ToastPositionContainer>
    </>
  );
};

export default memo(ImportSeedSheet);
