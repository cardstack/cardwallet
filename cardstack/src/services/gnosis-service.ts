import axios from 'axios';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

import { ZERO } from 'uniswap-xdai-sdk/dist/constants';
import prepaidCardManagerContract from '../../../src/references/prepaid-card-manager-contract';
import { useAccountSettings } from '@rainbow-me/hooks';

const baseUrl = 'https://transactions-staging.stack.cards/api';
const sokolNode = 'http://sokol.stack.cards:8545/';

const gnosisApi = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secs
});

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const useSafeData = () => {
  const { accountAddress: address } = useAccountSettings();
  const [prepaidCards, setPrepaidCards] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);

  useEffect(() => {
    const loadPrepaidCards = async () => {
      const response = await gnosisApi.get(`${baseUrl}/v1/owners/${address}`);
      const data = response?.data;
      const { safes } = data as { safes: string[] };

      const provider = new Web3.providers.HttpProvider(sokolNode);
      const web3 = new Web3(provider);

      const prepaidCardContract = new web3.eth.Contract(
        prepaidCardManagerContract as any,
        '0xeBDb1731dA9a5FC972DeD53E34AB2daC3B2565F7'
      );

      const safeData = await Promise.all<{
        isPrepaidCard: boolean;
        balances: any[];
      }>(
        safes.map(async (safeAddress: string) => {
          const cardDetail = await prepaidCardContract.methods
            .cardDetails(safeAddress)
            .call();

          const isPrepaidCard = cardDetail?.issuer !== ZERO_ADDRESS;

          const balanceResponse = await fetch(
            `${baseUrl}/v1/safes/${safeAddress}/balances`
          );

          const balances = await balanceResponse.json();

          return {
            address: safeAddress,
            isPrepaidCard,
            balances: balances.filter(
              (balanceItem: any) => balanceItem.tokenAddress
            ),
          };
        })
      );

      const sortedData = safeData.reduce(
        (accum, safe) => {
          if (safe.isPrepaidCard) {
            return {
              ...accum,
              prepaidCards: [...accum.prepaidCards, safe],
            };
          }

          return {
            ...accum,
            depots: [...accum.depots, safe],
          };
        },
        {
          depots: [] as any[],
          prepaidCards: [] as any[],
        }
      );

      setPrepaidCards(sortedData.prepaidCards);
      setDepots(sortedData.depots);
    };

    loadPrepaidCards();
  }, [address]);

  return {
    depots,
    prepaidCards,
  };
};
