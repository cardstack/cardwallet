import { networkTypes } from './networkTypes';

export const networkInfo = {
  [networkTypes.xdai]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'xDai Chain',
    layer: 2,
    value: networkTypes.xdai,
    default: true,
    isTestnet: false,
  },
  [networkTypes.sokol]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: 'https://faucet.poa.network',
    name: 'Sokol',
    layer: 2,
    value: networkTypes.sokol,
    default: false,
    isTestnet: true,
  },
  [`${networkTypes.mainnet}`]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'Ethereum Mainnet',
    layer: 1,
    value: networkTypes.mainnet,
    default: false,
    isTestnet: false,
  },
  [`${networkTypes.kovan}`]: {
    disabled: false,
    exchange_enabled: false,
    faucet_url: `https://faucet.kovan.network/`,
    name: 'Kovan',
    layer: 1,
    value: networkTypes.kovan,
    default: false,
    isTestnet: true,
  },
};

export default networkInfo;
