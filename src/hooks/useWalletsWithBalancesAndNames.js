import { map, mapValues } from 'lodash';
import { useMemo } from 'react';

import useWallets from './useWallets';

export const useWalletsWithBalancesAndNames = () => {
  const { walletNames, wallets } = useWallets();

  const walletsWithBalancesAndNames = useMemo(
    () =>
      mapValues(wallets, wallet => {
        const updatedAccounts = map(wallet.addresses, account => ({
          ...account,
          ens: walletNames[account.address],
        }));
        return { ...wallet, addresses: updatedAccounts };
      }),
    [walletNames, wallets]
  );

  return walletsWithBalancesAndNames;
};
