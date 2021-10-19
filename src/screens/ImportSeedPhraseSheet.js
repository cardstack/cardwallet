import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
import { keys } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import { KeyboardArea } from 'react-native-keyboard-area';
import styled from 'styled-components';

import { Centered, Column, Row } from '../components/layout';
import { SheetHandle } from '../components/sheet';
import {
  InvalidPasteToast,
  ToastPositionContainer,
} from '../components/toasts';
import { useTheme } from '../context/ThemeContext';
import NetworkTypes, { networkTypes } from '../helpers/networkTypes';
import { Button, Input, Text } from '@cardstack/components';
import isNativeStackAvailable from '@rainbow-me/helpers/isNativeStackAvailable';
import {
  isValidSeedPhrase,
  isValidWallet,
} from '@rainbow-me/helpers/validators';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import {
  useAccountSettings,
  useClipboard,
  useDimensions,
  useInitializeWallet,
  useInvalidPaste,
  useKeyboardHeight,
  useMagicAutofocus,
  usePrevious,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { sheetVerticalOffset } from '@rainbow-me/navigation/effects';
import Routes from '@rainbow-me/routes';
import { borders, padding } from '@rainbow-me/styles';
import {
  deviceUtils,
  ethereumUtils,
  sanitizeSeedPhrase,
} from '@rainbow-me/utils';
import logger from 'logger';

const sheetBottomPadding = 19;

const Container = styled.View`
  flex: 1;
  padding-top: ${android
    ? 0
    : isNativeStackAvailable
    ? 0
    : sheetVerticalOffset};
  ${android ? `margin-top: ${sheetVerticalOffset};` : ''}
  ${android
    ? `background-color: ${({ theme: { colors } }) => colors.transparent};`
    : ''}
`;

const Footer = styled(Row).attrs({
  align: 'start',
  justify: 'end',
})`
  bottom: ${android ? 15 : 0};
  position: ${android ? 'absolute' : 'relative'};
  right: 0;
  width: 100%;
  ${android
    ? `top: ${({ isSmallPhone }) =>
        isSmallPhone ? sheetBottomPadding * 2 : 0};`
    : ``}
  ${android ? 'margin-right: 18;' : ''}
`;

const KeyboardSizeView = styled(KeyboardArea)`
  background-color: ${({ theme: { colors } }) => colors.white};
`;

const SecretTextAreaContainer = styled(Centered)`
  ${padding(0, 42)};
  flex: 1;
`;

const Sheet = styled(Column).attrs({
  align: 'center',
  flex: 1,
})`
  ${borders.buildRadius('top', isNativeStackAvailable ? 0 : 16)};
  ${padding(0, 15, sheetBottomPadding)};
  background-color: ${({ theme: { colors } }) => colors.white};
  z-index: 1;
`;

export default function ImportSeedPhraseSheet() {
  const { accountAddress } = useAccountSettings();
  const { setIsWalletLoading, wallets } = useWallets();
  const { getClipboard, hasClipboardData, clipboard } = useClipboard();
  const { onInvalidPaste } = useInvalidPaste();
  const { isSmallPhone } = useDimensions();
  const keyboardHeight = useKeyboardHeight();
  const { goBack, navigate, replace, setParams } = useNavigation();
  const initializeWallet = useInitializeWallet();
  const [isImporting, setImporting] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [busy, setBusy] = useState(false);
  const [checkedWallet, setCheckedWallet] = useState(null);
  const wasImporting = usePrevious(isImporting);

  const inputRef = useRef(null);

  useEffect(() => {
    android &&
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
  }, []);
  const { handleFocus } = useMagicAutofocus(inputRef);

  const isClipboardValidSecret = useMemo(
    () =>
      deviceUtils.isIOS14
        ? hasClipboardData
        : clipboard !== accountAddress && isValidWallet(clipboard),
    [accountAddress, clipboard, hasClipboardData]
  );

  const isSecretValid = useMemo(() => isValidSeedPhrase(seedPhrase), [
    seedPhrase,
  ]);

  const handleSetImporting = useCallback(
    newImportingState => {
      setImporting(newImportingState);
      setParams({ gesturesEnabled: !newImportingState });
    },
    [setParams]
  );

  const handleSetSeedPhrase = useCallback(
    text => {
      if (isImporting) return null;
      return setSeedPhrase(text);
    },
    [isImporting]
  );

  const handleImportAccount = useCallback(
    async ({ name = null, color = null }) => {
      handleSetImporting(true);

      if (!wasImporting) {
        const input = sanitizeSeedPhrase(seedPhrase);

        const previousWalletCount = keys(wallets).length;
        const isFreshWallet = previousWalletCount === 0;

        try {
          const wallet = await initializeWallet({
            seedPhrase: input,
            color,
            name: name || '',
            checkedWallet,
          });

          handleSetImporting(false);
          // Early return to not dismiss the sheet on error
          if (!wallet) return;

          InteractionManager.runAfterInteractions(async () => {
            // Fresh imported wallet
            if (isFreshWallet) {
              // Dismisses ImportSeedPhraseSheet
              goBack();
              // Replaces bc no route exist yet
              replace(Routes.SWIPE_LAYOUT, {
                params: { initialized: true },
                screen: Routes.WALLET_SCREEN,
              });
            } else {
              navigate(Routes.WALLET_SCREEN, {
                initialized: true,
              });
            }
          });
        } catch (error) {
          handleSetImporting(false);
          logger.error('error importing seed phrase: ', error);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
      }
    },
    [
      checkedWallet,
      goBack,
      handleSetImporting,
      initializeWallet,
      navigate,
      replace,
      seedPhrase,
      wallets,
      wasImporting,
    ]
  );

  const showWalletProfileModal = useCallback(
    name => {
      navigate(Routes.MODAL_SCREEN, {
        actionType: 'Import',
        additionalPadding: true,
        asset: [],
        isNewProfile: true,
        onCloseModal: handleImportAccount,
        profile: { name },
        type: 'wallet_profile',
        withoutStatusBar: true,
      });
    },
    [handleImportAccount, navigate]
  );

  const handlePressImportButton = useCallback(async () => {
    if (!isSecretValid || !seedPhrase) return null;
    const input = sanitizeSeedPhrase(seedPhrase);
    // Just use mainnet provider for lookup
    const mainnetProvider = new JsonRpcProvider(
      getConstantByNetwork('rpcNode', networkTypes.mainnet),
      NetworkTypes.mainnet
    );

    try {
      setBusy(true);
      const walletResult = await ethereumUtils.deriveAccountFromWalletInput(
        input
      );

      setCheckedWallet(walletResult);

      const ens =
        (await mainnetProvider.lookupAddress?.(walletResult.address)) || null;

      setBusy(false);
      showWalletProfileModal(ens);
    } catch (error) {
      logger.log('Error looking up ENS for imported HD type wallet', error);
      setBusy(false);
    }
  }, [isSecretValid, seedPhrase, showWalletProfileModal]);

  const handlePressPasteButton = useCallback(() => {
    if (deviceUtils.isIOS14 && !hasClipboardData) return;
    getClipboard(result => {
      if (result !== accountAddress && isValidWallet(result)) {
        return handleSetSeedPhrase(result);
      }
      return onInvalidPaste();
    });
  }, [
    accountAddress,
    getClipboard,
    handleSetSeedPhrase,
    hasClipboardData,
    onInvalidPaste,
  ]);

  useEffect(() => {
    setIsWalletLoading(
      isImporting ? walletLoadingStates.IMPORTING_WALLET : null
    );
  }, [isImporting, setIsWalletLoading]);

  const { colors } = useTheme();

  return (
    <Container testID="import-sheet">
      <StatusBar barStyle="dark-content" />
      <Sheet>
        <SheetHandle marginBottom={7} marginTop={6} />
        <Text fontSize={18} fontWeight="700">
          Add account
        </Text>
        <SecretTextAreaContainer>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            enablesReturnKeyAutomatically
            fontSize={18}
            fontWeight="600"
            keyboardType={android ? 'visible-password' : 'default'}
            marginBottom={android ? 14 : 0}
            minHeight={android ? 100 : 50}
            multiline
            numberOfLines={3}
            onChangeText={handleSetSeedPhrase}
            onFocus={handleFocus}
            onSubmitEditing={handlePressImportButton}
            placeholder="Enter seed phrase or secret recovery phrase"
            placeholderTextColor={colors.alpha(colors.blueGreyDark, 0.3)}
            ref={inputRef}
            returnKeyType="done"
            size="large"
            spellCheck={false}
            testID="import-sheet-input"
            textAlign="center"
            value={seedPhrase}
          />
        </SecretTextAreaContainer>
        <Footer isSmallPhone={isSmallPhone}>
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
              variant="tinyDark"
            >
              Paste
            </Button>
          )}
        </Footer>
      </Sheet>
      <ToastPositionContainer bottom={keyboardHeight}>
        <InvalidPasteToast />
      </ToastPositionContainer>
      {ios ? <KeyboardSizeView isOpen /> : null}
    </Container>
  );
}
