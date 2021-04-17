import networkTypes from './networkTypes';

const networkInfo = {
  [`${networkTypes.mainnet}`]: {
    // balance_checker_contract_address:
    //   '0x4dcf4562268dd384fe814c00fad239f06c2a0c2b',
    color: '#3cc29e',
    disabled: false,
    exchange_enabled: true,
    faucet_url: null,
    name: 'xDai',
    layer: 2,
    value: networkTypes.mainnet,
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
};

export default networkInfo;
