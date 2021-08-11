import Web3 from 'web3';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';
import logger from 'logger';

export const safeDecodeParameters = <T>(
  params: object[],
  data: string
): T | null => {
  const web3 = new Web3(web3ProviderSdk as any);

  try {
    const result = web3.eth.abi.decodeParameters(params, data) as T;

    return result;
  } catch (error) {
    return null;
  }
};

export const decodeParameters = <T>(params: object[], data: string): T => {
  const result = safeDecodeParameters<T>(params, data);

  if (!result) {
    logger.sentry('Could not decode data', {
      data,
      params,
    });

    throw new Error('Could not decode data');
  }

  return result;
};
