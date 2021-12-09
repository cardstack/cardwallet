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
import { InteractionManager } from 'react-native';

import {
  InvalidPasteToast,
  ToastPositionContainer,
} from '../components/toasts';
import { useTheme } from '../context/ThemeContext';
import NetworkTypes, { networkTypes } from '../helpers/networkTypes';
import {
  Button,
  CenteredContainer,
  Container,
  Input,
  Sheet,
  Text,
} from '@cardstack/components';
import {
  isValidSeedPhrase,
  isValidWallet,
} from '@rainbow-me/helpers/validators';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import {
  useAccountSettings,
  useClipboard,
  useInitializeWallet,
  useInvalidPaste,
  useKeyboardHeight,
  useMagicAutofocus,
  usePrevious,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import {
  deviceUtils,
  ethereumUtils,
  sanitizeSeedPhrase,
} from '@rainbow-me/utils';
import logger from 'logger';

export default function ImportSeedPhraseSheet() {
  const { accountAddress } = useAccountSettings();
  const { setIsWalletLoading, wallets } = useWallets();
  const { getClipboard, hasClipboardData, clipboard } = useClipboard();
  const { onInvalidPaste } = useInvalidPaste();
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
              keyboardType={android ? 'visible-password' : 'default'}
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
}
