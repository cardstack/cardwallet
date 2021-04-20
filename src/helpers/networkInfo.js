import networkTypes from './networkTypes';

const networkInfo = {
  [`${networkTypes.xdai}`]: {
    // balance_checker_contract_address:
    //   '0x4dcf4562268dd384fe814c00fad239f06c2a0c2b',
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'xDai Chain',
    layer: 2,
    value: networkTypes.xdai,
    default: true,
  },
  [`${networkTypes.sokol}`]: {
    // balance_checker_contract_address:
    //   '0xf17adbb5094639142ca1c2add4ce0a0ef146c3f9',
    color: '#ff4a8d',
    disabled: false,
    exchange_enabled: false,
    faucet_url: `http://faucet.metamask.io/`,
    name: 'Sokol',
    layer: 2,
    value: networkTypes.sokol,
    default: false,
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
  },
};

export default networkInfo;
