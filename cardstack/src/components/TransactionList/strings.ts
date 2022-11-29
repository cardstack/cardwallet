import { getConstantByNetwork } from '@cardstack/cardpay-sdk';

import { NetworkType } from '@cardstack/types';

export const strings = {
  nonCardPayNetwork: (network: NetworkType) =>
    `We currently don't show\ntransactions in ${getConstantByNetwork(
      'name',
      network
    )}.`,
  emptyComponent: `You don't have any\ntransactions yet`,
};
