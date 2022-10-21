import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';

import {
  ensFromWalletAddress,
  deriveWalletFromSeed,
} from '@cardstack/models/ethers-wallet';
import { Routes } from '@cardstack/navigation';

import { isValidSeedPhrase } from '@rainbow-me/helpers/validators';
import { useWalletManager } from '@rainbow-me/hooks';
import { EthereumWalletFromSeed } from '@rainbow-me/model/wallet';
import { sanitizeSeedPhrase } from '@rainbow-me/utils';
import logger from 'logger';

export const useWalletSeedPhraseImport = (
  seedPhrase: string,
  ethWallet?: EthereumWalletFromSeed
) => {
  const { navigate } = useNavigation<StackNavigationProp<ParamListBase>>();

  const { importWallet } = useWalletManager();

  const [checkedWallet, setCheckedWallet] = useState<
    EthereumWalletFromSeed | undefined
  >(ethWallet);

  const deriveWalletAndEns = useCallback(async (): Promise<
    string | undefined
  > => {
    if (!isValidSeedPhrase(seedPhrase)) return;

    const wallet = await deriveWalletFromSeed(seedPhrase);
    setCheckedWallet(wallet);

    if (wallet) {
      const ens = await ensFromWalletAddress(wallet.address);

      return ens;
    }
  }, [seedPhrase]);

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
    (name?: string) => {
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

  return { showWalletProfileModal, deriveWalletAndEns };
};
