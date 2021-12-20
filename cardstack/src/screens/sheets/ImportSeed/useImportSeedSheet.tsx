import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import Wallet, { hdkey } from 'ethereumjs-wallet';
import { keys } from 'lodash';
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InteractionManager, TextInput } from 'react-native';

import { Device } from '@cardstack/utils';
import {
  isValidSeedPhrase,
  isValidWallet,
} from '@rainbow-me/helpers/validators';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import { EthereumWalletType } from '@rainbow-me/helpers/walletTypes';
import {
  useAccountSettings,
  useClipboard,
  useInitializeWallet,
  useInvalidPaste,
  usePrevious,
  useWallets,
} from '@rainbow-me/hooks';

import { WalletLibraryType } from '@rainbow-me/model/wallet';
import Routes from '@rainbow-me/routes';
import {
  deviceUtils,
  ethereumUtils,
  sanitizeSeedPhrase,
} from '@rainbow-me/utils';
import logger from 'logger';
import { Network } from '@rainbow-me/helpers/networkTypes';

interface CheckedWallet {
  address: string;
  isHDWallet: boolean;
  root: hdkey;
  type: EthereumWalletType;
  wallet: Wallet;
  walletType: WalletLibraryType;
}

const useImportSeedSheet = () => {
  const { accountAddress } = useAccountSettings();

  const { getClipboard, hasClipboardData, clipboard } = useClipboard();
  const { onInvalidPaste } = useInvalidPaste();

  const [busy, setBusy] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');

  const [checkedWallet, setCheckedWallet] = useState<CheckedWallet | null>(
    null
  );

  const inputRef = useRef<TextInput>(null);

  const { showWalletProfileModal, isImporting } = useImportFromProfileModal(
    checkedWallet,
    seedPhrase,
    inputRef
  );

  useEffect(() => {
    Device.isAndroid &&
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
  }, []);

  const handleSetSeedPhrase = useCallback(
    text => {
      if (isImporting) return null;

      return setSeedPhrase(text);
    },
    [isImporting]
  );

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

  const handlePressImportButton = useCallback(async () => {
    if (!isSecretValid || !seedPhrase) return null;
    const input = sanitizeSeedPhrase(seedPhrase);

    // Just use mainnet provider for lookup
    const mainnetProvider = new JsonRpcProvider(
      getConstantByNetwork('rpcNode', Network.mainnet),
      Network.mainnet
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
    getClipboard((result: string) => {
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

  return {
    handleSetSeedPhrase,
    handlePressImportButton,
    seedPhrase,
    inputRef,
    busy,
    isSecretValid,
    handlePressPasteButton,
    isClipboardValidSecret,
  };
};

export { useImportSeedSheet };

// Scoped helper hook
const useImportFromProfileModal = (
  checkedWallet: CheckedWallet | null,
  seedPhrase: string,
  inputRef: RefObject<TextInput>
) => {
  const { goBack, navigate, replace, setParams } = useNavigation<
    StackNavigationProp<ParamListBase>
  >();

  const [isImporting, setImporting] = useState(false);
  const wasImporting = usePrevious(isImporting);

  const { setIsWalletLoading, wallets } = useWallets();
  const initializeWallet = useInitializeWallet();

  useEffect(() => {
    setIsWalletLoading(
      isImporting ? walletLoadingStates.IMPORTING_WALLET : null
    );
  }, [isImporting, setIsWalletLoading]);

  const handleSetImporting = useCallback(
    newImportingState => {
      setImporting(newImportingState);
      setParams({ gesturesEnabled: !newImportingState });
    },
    [setParams]
  );

  const handleImportAccountOnCloseModal = useCallback(
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
              // Dismisses ImportSeedSheet
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
      inputRef,
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
        onCloseModal: handleImportAccountOnCloseModal,
        profile: { name },
        type: 'wallet_profile',
        withoutStatusBar: true,
      });
    },
    [handleImportAccountOnCloseModal, navigate]
  );

  return { showWalletProfileModal, isImporting };
};
