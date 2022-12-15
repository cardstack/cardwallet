import { supportedChains } from '@cardstack/cardpay-sdk';

import { NetworkType } from '@cardstack/types';

// Maybe add to constants sdk ?
export const getCoingeckoPlatformName = (network: NetworkType) => {
  const { ethereum, polygon, gnosis } = supportedChains;
  if (ethereum.includes(network)) return 'ethereum';
  if (polygon.includes(network)) return 'polygon-pos';
  if (gnosis.includes(network)) return 'xdai';
};
