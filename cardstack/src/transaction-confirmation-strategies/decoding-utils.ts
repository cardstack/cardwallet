import Web3 from 'web3';

import logger from 'logger';

export const safeDecodeParameters = <T>(
  params: Record<string, unknown>[],
  data: string
): T | null => {
  const web3 = new Web3();

  try {
    const result = web3.eth.abi.decodeParameters(params, data) as T;

    return result;
  } catch (error) {
    return null;
  }
};

export const decodeParameters = <T>(
  params: Record<string, unknown>[],
  data: string
): T => {
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
