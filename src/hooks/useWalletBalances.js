import {
  fromWei,
  getConstantByNetwork,
  handleSignificantDecimals,
} from '@cardstack/cardpay-sdk';
import { Contract } from '@ethersproject/contracts';
import { forEach, isEmpty, keys, values } from 'lodash';
import { useCallback } from 'react';
import { queryCache, useQuery } from 'react-query';
import {
  saveWalletBalances,
  WALLET_BALANCES_FROM_STORAGE,
} from '../handlers/localstorage/walletBalances';
import { getEtherWeb3Provider } from '../handlers/web3';
import { ETH_ADDRESS } from '../references/addresses';

import balanceCheckerContractAbi from '../references/balances-checker-abi.json';
import useAccountSettings from './useAccountSettings';
import logger from 'logger';

const DEFAULT_WALLETBALANCE = { hex: '0x00', type: 'BigNumber' };

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

    // TODO: check if this can be replaced by SDK
    try {
      // Check all the ETH balances at once
      const balanceCheckerContractAddress = getConstantByNetwork(
        'balanceCheckerContractAddress',
        network
      );
      const web3Provider = await getEtherWeb3Provider(network, true);
      const balanceCheckerContract = new Contract(
        balanceCheckerContractAddress,
        balanceCheckerContractAbi,
        web3Provider
      );

      let balances = [];
      try {
        balances = await balanceCheckerContract.balances(keys(walletBalances), [
          ETH_ADDRESS,
        ]);
      } catch (e) {
        logger.log('error getting balances', e);
      }

      forEach(keys(walletBalances), (address, index) => {
        if (balances[index]) {
          const amountInETH = fromWei(balances[index].toString());
          const formattedBalance = handleSignificantDecimals(amountInETH, 4);
          walletBalances[address] = formattedBalance;
        } else {
          walletBalances[address] = DEFAULT_WALLETBALANCE;
        }
      });
      saveWalletBalances(walletBalances);
    } catch (e) {
      logger.log('Error fetching ETH balances in batch', e);
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
