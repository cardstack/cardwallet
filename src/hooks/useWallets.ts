import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useAccountSettings } from '.';
import { findLatestBackUp } from '@cardstack/models/backup';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import { Account } from '@rainbow-me/model/wallet';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { AppState } from '@rainbow-me/redux/store';
import logger from 'logger';

const walletSelector = createSelector(
  ({ wallets: { selected = {}, walletNames, wallets } }: AppState) => ({
    selectedWallet: selected,
    walletNames,
    wallets,
  }),
  ({ selectedWallet, walletNames, wallets }) => ({
    latestBackup: findLatestBackUp(wallets)?.backupFile || false,
    selectedWallet,
    walletNames,
    wallets,
  })
);

export default function useWallets() {
  const { latestBackup, selectedWallet, walletNames, wallets } = useSelector(
    walletSelector
  );

  const walletReady = useRainbowSelector(state => state.appState.walletReady);

  const { accountAddress } = useAccountSettings();

  const isDamaged: boolean = useMemo(() => {
    if (!walletReady) return;

    const isInvalidWallet =
      isEmpty(selectedWallet) || !wallets || selectedWallet?.damaged;

    if (isInvalidWallet) {
      logger.sentry('Wallet does not exist yet or is damaged. Check values:', {
        selectedWallet,
        wallets,
        isDamaged: selectedWallet?.damaged,
      });
    }
    return isInvalidWallet;
  }, [selectedWallet, walletReady, wallets]);

  const selectedAccount: Account = useMemo(
    () =>
      selectedWallet?.addresses?.find(
        (account: Account) => account.address === accountAddress
      ),
    [accountAddress, selectedWallet.addresses]
  );

  return {
    isDamaged,
    isReadOnlyWallet: selectedWallet.type === WalletTypes.readOnly,
    latestBackup,
    walletNames,
    wallets,
    selectedAccount,
    selectedWallet,
    accountAddress,
    walletReady,
  };
}
