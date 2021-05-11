import { INFURA_PROJECT_ID, INFURA_PROJECT_ID_DEV } from 'react-native-dotenv';
import { networkTypes } from './networkTypes';

const infuraProjectId = __DEV__ ? INFURA_PROJECT_ID_DEV : INFURA_PROJECT_ID;
export const getInfuraUrl = (network = 'mainnet'): string =>
  `https://${network}.infura.io/v3/${infuraProjectId}`;

export const networkInfo = {
  [networkTypes.xdai]: {
    balance_checker_contract_address:
      '0x6B78C121bBd10D8ef0dd3623CC1abB077b186F65',
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'xDai Chain',
    layer: 2,
    value: networkTypes.xdai,
    default: true,
    networkUrl: 'https://blockscout.com/xdai/mainnet/api',
    isTestnet: false,
  },
  [networkTypes.sokol]: {
    balance_checker_contract_address:
      '0xaeDFe60b0732924249866E3FeC71835EFb1fc9fF',
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
    balance_checker_contract_address:
      '0x4dcf4562268dd384fe814c00fad239f06c2a0c2b',
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
  [`${networkTypes.ropsten}`]: {
    balance_checker_contract_address:
      '0xf17adbb5094639142ca1c2add4ce0a0ef146c3f9',
    color: '#ff4a8d',
    disabled: false,
    exchange_enabled: false,
    faucet_url: `http://faucet.metamask.io/`,
    name: 'Ropsten',
    layer: 1,
    value: networkTypes.ropsten,
    default: false,
    networkUrl: getInfuraUrl(networkTypes.ropsten),
    isTestnet: true,
  },
  [`${networkTypes.kovan}`]: {
    balance_checker_contract_address:
      '0xf3352813b612a2d198e437691557069316b84ebe',
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
  [`${networkTypes.rinkeby}`]: {
    balance_checker_contract_address:
      '0xc55386617db7b4021d87750daaed485eb3ab0154',
    color: '#f6c343',
    disabled: false,
    exchange_enabled: true,
    faucet_url: 'https://faucet.rinkeby.io/',
    name: 'Rinkeby',
    layer: 1,
    value: networkTypes.rinkeby,
    default: false,
    networkUrl: getInfuraUrl(networkTypes.rinkeby),
    isTestnet: true,
  },
  [`${networkTypes.goerli}`]: {
    balance_checker_contract_address:
      '0xf3352813b612a2d198e437691557069316b84ebe',
    color: '#f6c343',
    disabled: false,
    exchange_enabled: false,
    faucet_url: 'https://goerli-faucet.slock.it/',
    name: 'Goerli',
    layer: 1,
    value: networkTypes.goerli,
    default: false,
    networkUrl: getInfuraUrl(networkTypes.goerli),
    isTestnet: true,
  },
};

export default networkInfo;
