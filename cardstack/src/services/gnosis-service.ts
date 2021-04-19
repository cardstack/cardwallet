import axios from 'axios';
import { useQuery } from 'react-query';
import Web3 from 'web3';
import prepaidCardManagerContract from '../../../src/references/prepaid-card-manager-contract';
import logger from 'logger';
import { web3Provider } from '@rainbow-me/handlers/web3';

const baseUrl = 'https://safe-transaction.xdai.gnosis.io/api/v1';

const gnosisApi = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secs
});

const fetchOwnersByAddress = async (address: string) => {
  try {
    const response = await gnosisApi.get(`${baseUrl}/owners/${address}`);
    const data = response?.data;

    return data;
  } catch (error) {
    logger.log('gnosis-service', error);
  }
};

export const usePrepaidCards = (address: string) => {
  const web3 = new Web3();

  const contract = new web3.eth.Contract(
    prepaidCardManagerContract as any,
    '0xeBDb1731dA9a5FC972DeD53E34AB2daC3B2565F7'
  );

  const { data } = useQuery('owners', () => fetchOwnersByAddress(address));

  return (
    data?.safes.filter(async (safeAddress: string) => {
      const cardDetail = await contract.methods.cardDetails(safeAddress).call();

      return cardDetail;
    }) || []
  );
};
