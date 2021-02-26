import { forEach, isEmpty, keys, values } from 'lodash';
import { useCallback } from 'react';
import { queryCache, useQuery } from 'react-query';
import {
  saveWalletBalances,
  WALLET_BALANCES_FROM_STORAGE,
} from '../handlers/localstorage/walletBalances';
import { web3Provider } from '../handlers/web3';
import { fromWei, handleSignificantDecimals } from '../helpers/utilities';
import useAccountSettings from './useAccountSettings';
import logger from 'logger';

const useWalletBalances = wallets => {
  const { network } = useAccountSettings();

  const fetchBalances = useCallback(async () => {
    const walletBalances = {};

    // Get list of addresses to get balances for
    forEach(values(wallets), wallet => {
      forEach(wallet.addresses, account => {
        walletBalances[account.address] = '0.00';
      });
    });

    try {
      // // Check all the ETH balances at once
      // const balanceCheckerContract = new Contract(
      //   get(networkInfo[network], 'balance_checker_contract_address'),
      //   balanceCheckerContractAbi,
      //   web3Provider
      // );
      const balances = [];
      let addresses = keys(walletBalances);
      for (let i = 0; i < addresses.length; i++) {
        balances[i] = await web3Provider.getBalance(addresses[i]);
      }
      forEach(keys(walletBalances), (address, index) => {
        const amountInETH = fromWei(balances[index].toString());
        const formattedBalance = handleSignificantDecimals(amountInETH, 4);
        walletBalances[address] = formattedBalance;
      });
      saveWalletBalances(walletBalances);
    } catch (e) {
      logger.log('Error fetching xDai balances in batch', e);
    }

    return walletBalances;
  }, [network, wallets]);

  const { data } = useQuery(
    !isEmpty(wallets) && ['walletBalances'],
    fetchBalances
  );

  const resultFromStorage = queryCache.getQueryData(
    WALLET_BALANCES_FROM_STORAGE
  );

  if (isEmpty(data) && !isEmpty(resultFromStorage)) {
    return resultFromStorage;
  }

  if (isEmpty(data)) {
    return {};
  }

  return data;
};

export default useWalletBalances;
