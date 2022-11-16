import { NetworkType } from '@cardstack/types';

export const networkInfo = {
  [NetworkType.gnosis]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'Gnosis Chain',
    shortName: 'Gnosis',
    layer: 2,
    value: NetworkType.gnosis,
    hidden: false,
  },
  [NetworkType.sokol]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: 'https://faucet.poa.network',
    name: 'Sokol',
    shortName: 'Sokol',
    layer: 2,
    value: NetworkType.sokol,
    hidden: true,
  },
  [`${NetworkType.mainnet}`]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'Ethereum Mainnet',
    shortName: 'Mainnet',
    layer: 1,
    value: NetworkType.mainnet,
    hidden: true,
  },
};

export default networkInfo;
