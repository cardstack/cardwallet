import { isEmpty } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { setIsWalletLoading as rawSetIsWalletLoading } from '../redux/wallets';
import { useAccountSettings } from '.';
import { findLatestBackUp } from '@cardstack/models/backup';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import { Account } from '@rainbow-me/model/wallet';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { AppState } from '@rainbow-me/redux/store';
import logger from 'logger';

const walletSelector = createSelector(
  ({
    wallets: { isWalletLoading, selected = {}, walletNames, wallets },
  }: AppState) => ({
    isWalletLoading,
    selectedWallet: selected,
    walletNames,
    wallets,
  }),
  ({ isWalletLoading, selectedWallet, walletNames, wallets }) => ({
    isWalletLoading,
    latestBackup: findLatestBackUp(wallets) || false,
    selectedWallet,
    walletNames,
    wallets,
  })
);

export default function useWallets() {
  const dispatch = useDispatch();
  const {
    isWalletLoading,
    latestBackup,
    selectedWallet,
    walletNames,
    wallets,
  } = useSelector(walletSelector);

  const walletReady = useRainbowSelector(state => state.appState.walletReady);

  const { accountAddress } = useAccountSettings();

  const setIsWalletLoading = useCallback(
    isLoading => dispatch(rawSetIsWalletLoading(isLoading)),
    [dispatch]
  );

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
    isWalletLoading,
    latestBackup,
    setIsWalletLoading,
    walletNames,
    wallets,
    selectedAccount,
    selectedWallet,
    accountAddress,
    walletReady,
  };
}
