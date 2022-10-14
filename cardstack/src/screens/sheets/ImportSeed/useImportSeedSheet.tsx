import { getConstantByNetwork, HubConfig } from '@cardstack/cardpay-sdk';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { providers } from 'ethers';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { useToast } from '@cardstack/components';
import { dismissKeyboardOnAndroid, Routes } from '@cardstack/navigation';

import { Network } from '@rainbow-me/helpers/networkTypes';
import {
  isValidSeedPhrase,
  isValidWallet,
} from '@rainbow-me/helpers/validators';
import {
  useAccountSettings,
  useClipboard,
  useWalletManager,
} from '@rainbow-me/hooks';
import { EthereumWalletFromSeed } from '@rainbow-me/model/wallet';
import {
  deviceUtils,
  ethereumUtils,
  sanitizeSeedPhrase,
} from '@rainbow-me/utils';
import logger from 'logger';

const useImportSeedSheet = () => {
  const { accountAddress } = useAccountSettings();

  const { getClipboard, hasClipboardData, clipboard } = useClipboard();
  const { showToast } = useToast();

  const [busy, setBusy] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');

  const [checkedWallet, setCheckedWallet] = useState<
    EthereumWalletFromSeed | undefined
  >();

  const inputRef = useRef<TextInput>(null);

  const { showWalletProfileModal } = useImportFromProfileModal(
    seedPhrase,
    checkedWallet
  );

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

    const hubConfig = new HubConfig(
      getConstantByNetwork('hubUrl', Network.mainnet)
    );

    const hubConfigResponse = await hubConfig.getConfig();

    // Just use mainnet provider for lookup
    const mainnetProvider = new providers.JsonRpcProvider(
      hubConfigResponse.web3.layer1RpcNodeHttpsUrl,
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

      showToast({
        message: 'Not a valid wallet address',
      });
    });
  }, [
    accountAddress,
    getClipboard,
    handleSetSeedPhrase,
    hasClipboardData,
    showToast,
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
  checkedWallet?: EthereumWalletFromSeed
) => {
  const { navigate } = useNavigation<StackNavigationProp<ParamListBase>>();

  const { importWallet } = useWalletManager();

  const handleImportAccountOnCloseModal = useCallback(
    async ({ name = null, color = null }) => {
      const seed = sanitizeSeedPhrase(seedPhrase);

      try {
        await importWallet({
          seed,
          color,
          name: name || '',
          checkedWallet,
        });
      } catch (error) {
        logger.error('error importing seed phrase: ', error);
      }
    },
    [checkedWallet, importWallet, seedPhrase]
  );

  const showWalletProfileModal = useCallback(
    name => {
      navigate(Routes.MODAL_SCREEN, {
        actionType: 'Import',
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
