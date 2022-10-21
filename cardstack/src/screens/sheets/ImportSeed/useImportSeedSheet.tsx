import { getConstantByNetwork, HubConfig } from '@cardstack/cardpay-sdk';
import { providers } from 'ethers';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { useInvalidPaste, useWalletSeedPhraseImport } from '@cardstack/hooks';
import { dismissKeyboardOnAndroid } from '@cardstack/navigation';

import { Network } from '@rainbow-me/helpers/networkTypes';
import {
  isValidSeedPhrase,
  isValidWallet,
} from '@rainbow-me/helpers/validators';
import { useAccountSettings, useClipboard } from '@rainbow-me/hooks';
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
  const { onInvalidPaste, isInvalidPaste } = useInvalidPaste();

  const [busy, setBusy] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');

  const [checkedWallet, setCheckedWallet] = useState<
    EthereumWalletFromSeed | undefined
  >();

  const inputRef = useRef<TextInput>(null);

  const { showWalletProfileModal } = useWalletSeedPhraseImport(
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
        (await mainnetProvider.lookupAddress?.(walletResult.address)) ||
        undefined;

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
    isInvalidPaste,
  };
};

export { useImportSeedSheet };
