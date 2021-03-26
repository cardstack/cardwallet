import axios from 'axios';
import { useQuery } from 'react-query';
import logger from 'logger';

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
  const { data } = useQuery('owners', () => fetchOwnersByAddress(address));

  return data?.safes || [];
};
