import { INFURA_PROJECT_ID, INFURA_PROJECT_ID_DEV } from 'react-native-dotenv';
import { networkTypes } from './networkTypes';

const infuraProjectId = __DEV__ ? INFURA_PROJECT_ID_DEV : INFURA_PROJECT_ID;
export const getInfuraUrl = (network = 'mainnet'): string =>
  `https://${network}.infura.io/v3/${infuraProjectId}`;

export const networkInfo = {
  [networkTypes.xdai]: {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'xDai Chain',
    layer: 2,
    value: networkTypes.xdai,
    default: true,
    networkUrl: 'https://rpc.xdaichain.com',
    isTestnet: false,
  },
  [networkTypes.sokol]: {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: 'https://faucet.poa.network',
    name: 'Sokol',
    layer: 2,
    value: networkTypes.sokol,
    default: false,
    networkUrl: 'https://sokol.stack.cards/',
    isTestnet: true,
  },
  [`${networkTypes.mainnet}`]: {
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'Ethereum Mainnet',
    layer: 1,
    value: networkTypes.mainnet,
    default: false,
    networkUrl: getInfuraUrl(networkTypes.mainnet),
    isTestnet: false,
  },
  [`${networkTypes.kovan}`]: {
    color: '#7057ff',
    disabled: false,
    exchange_enabled: false,
    faucet_url: `https://faucet.kovan.network/`,
    name: 'Kovan',
    layer: 1,
    value: networkTypes.kovan,
    default: false,
    networkUrl: getInfuraUrl(networkTypes.kovan),
    isTestnet: true,
  },
};

export default networkInfo;
