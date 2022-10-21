import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useRef } from 'react';

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

  const checkedWallet = useRef<EthereumWalletFromSeed | undefined>(ethWallet);
  const checkedEns = useRef<string | undefined>();

  const deriveWalletAndEns = useCallback(async (): Promise<
    string | undefined
  > => {
    if (!isValidSeedPhrase(seedPhrase)) return;

    checkedWallet.current = await deriveWalletFromSeed(seedPhrase);

    if (checkedWallet.current) {
      checkedEns.current = await ensFromWalletAddress(
        checkedWallet.current.address
      );
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
          checkedWallet: checkedWallet.current,
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
        profile: { name: name || checkedEns.current },
        type: 'wallet_profile',
        withoutStatusBar: true,
      });
    },
    [handleImportAccountOnCloseModal, navigate]
  );

  return { showWalletProfileModal, deriveWalletAndEns };
};
