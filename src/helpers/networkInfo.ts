import { networkTypes } from './networkTypes';

export const networkInfo = {
  [networkTypes.xdai]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'xDai Chain',
    layer: 2,
    value: networkTypes.xdai,
    isTestnet: false,
  },
  [networkTypes.sokol]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: 'https://faucet.poa.network',
    name: 'Sokol',
    layer: 2,
    value: networkTypes.sokol,
    isTestnet: true,
  },
  [`${networkTypes.mainnet}`]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'Ethereum Mainnet',
    layer: 1,
    value: networkTypes.mainnet,
    isTestnet: false,
  },
  [`${networkTypes.kovan}`]: {
    disabled: false,
    exchange_enabled: false,
    faucet_url: `https://faucet.kovan.network/`,
    name: 'Kovan',
    layer: 1,
    value: networkTypes.kovan,
    isTestnet: true,
  },
};

export default networkInfo;
