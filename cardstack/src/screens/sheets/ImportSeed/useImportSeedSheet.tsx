import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
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
import {
  useAccountSettings,
  useClipboard,
  useWalletManager,
  useInvalidPaste,
  useWallets,
} from '@rainbow-me/hooks';

import { EthereumWalletFromSeed } from '@rainbow-me/model/wallet';
import Routes from '@rainbow-me/routes';
import {
  deviceUtils,
  ethereumUtils,
  sanitizeSeedPhrase,
} from '@rainbow-me/utils';
import logger from 'logger';
import { Network } from '@rainbow-me/helpers/networkTypes';
import {
  dismissKeyboardOnAndroid,
  navigationStateNewWallet,
  useLoadingOverlay,
} from '@cardstack/navigation';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';

const useImportSeedSheet = () => {
  const { accountAddress } = useAccountSettings();

  const { getClipboard, hasClipboardData, clipboard } = useClipboard();
  const { onInvalidPaste } = useInvalidPaste();

  const [busy, setBusy] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');

  const [checkedWallet, setCheckedWallet] = useState<
    EthereumWalletFromSeed | undefined
  >();

  const inputRef = useRef<TextInput>(null);

  const { showWalletProfileModal } = useImportFromProfileModal(
    seedPhrase,
    inputRef,
    checkedWallet
  );

  useEffect(() => {
    Device.isAndroid &&
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
  }, []);

  const handleSetSeedPhrase = useCallback(
    text => {
      if (busy) return null;

      return setSeedPhrase(text);
    },
    [busy]
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

    dismissKeyboardOnAndroid();

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
  seedPhrase: string,
  inputRef: RefObject<TextInput>,
  checkedWallet?: EthereumWalletFromSeed
) => {
  const { navigate, reset, replace } = useNavigation<
    StackNavigationProp<ParamListBase>
  >();

  const { wallets } = useWallets();
  const { importWallet } = useWalletManager();

  const { isTabBarEnabled } = useTabBarFlag();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const handleImportAccountOnCloseModal = useCallback(
    async ({ name = null, color = null }) => {
      showLoadingOverlay({ title: walletLoadingStates.IMPORTING_WALLET });

      const seed = sanitizeSeedPhrase(seedPhrase);

      const previousWalletCount = keys(wallets).length;
      const isFreshWallet = previousWalletCount === 0;

      try {
        const wallet = await importWallet({
          seed,
          color,
          name: name || '',
          checkedWallet,
        });

        dismissLoadingOverlay();
        // Early return to not dismiss the sheet on error
        if (!wallet) return;

        InteractionManager.runAfterInteractions(async () => {
          // Fresh imported wallet
          if (isFreshWallet) {
            if (!isTabBarEnabled) {
              replace(Routes.SWIPE_LAYOUT, {
                params: { initialized: true },
                screen: Routes.WALLET_SCREEN,
              });
            } else {
              // Resets to remove non-auth-routes
              reset(navigationStateNewWallet);
            }
          } else {
            // inner navigation
            navigate(Routes.WALLET_SCREEN, {
              initialized: true,
            });
          }
        });
      } catch (error) {
        logger.error('error importing seed phrase: ', error);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    },
    [
      checkedWallet,
      dismissLoadingOverlay,
      importWallet,
      inputRef,
      isTabBarEnabled,
      navigate,
      replace,
      reset,
      seedPhrase,
      showLoadingOverlay,
      wallets,
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

  return { showWalletProfileModal };
};
