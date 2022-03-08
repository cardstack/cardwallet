import { BlockNumber } from 'web3-core';
import Web3Instance from '@cardstack/models/web3-instance';

import logger from 'logger';

export const getBlockTimestamp = async (blockNumber: BlockNumber) => {
  try {
    const web3 = await Web3Instance.get();
    const block = await web3.eth.getBlock(blockNumber);
    return block?.timestamp.toString();
  } catch (error) {
    logger.log(error);
  }

  return Date.now().toString();
};
