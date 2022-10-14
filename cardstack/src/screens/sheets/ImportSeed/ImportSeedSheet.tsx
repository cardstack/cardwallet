import React, { memo } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  Input,
  Sheet,
  Text,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { Device } from '@cardstack/utils';

import { useImportSeedSheet } from './useImportSeedSheet';

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

  return (
    <>
      <Sheet isFullScreen>
        <Text fontSize={18} weight="bold" textAlign="center">
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
              onSubmitEditing={handlePressImportButton}
              placeholder="Enter seed phrase or secret recovery phrase"
              placeholderTextColor={colors.grayText}
              ref={inputRef}
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
    </>
  );
};

export default memo(ImportSeedSheet);
