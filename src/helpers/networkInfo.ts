import { networkTypes } from './networkTypes';

export const networkInfo = {
  [networkTypes.xdai]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'Gnosis Chain',
    shortName: 'Gnosis',
    layer: 2,
    value: networkTypes.xdai,
    isTestnet: false,
  },
  [networkTypes.sokol]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: 'https://faucet.poa.network',
    name: 'Sokol',
    shortName: 'Sokol',
    layer: 2,
    value: networkTypes.sokol,
    isTestnet: true,
  },
  [`${networkTypes.mainnet}`]: {
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'Ethereum Mainnet',
    shortName: 'Mainnet',
    layer: 1,
    value: networkTypes.mainnet,
    isTestnet: true,
  },
  [`${networkTypes.kovan}`]: {
    disabled: false,
    exchange_enabled: false,
    faucet_url: `https://faucet.kovan.network/`,
    name: 'Kovan',
    shortName: 'Kovan',
    layer: 1,
    value: networkTypes.kovan,
    isTestnet: true,
  },
};

export default networkInfo;
