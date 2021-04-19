export enum Network {
  goerli = 'goerli',
  kovan = 'kovan',
  mainnet = 'mainnet',
  rinkeby = 'rinkeby',
  sokol = 'sokol',
  ropsten = 'ropsten',
}

// We need to keep this one until
// we have typescript everywhere
export default {
  goerli: 'goerli' as Network,
  kovan: 'kovan' as Network,
  mainnet: 'mainnet' as Network,
  rinkeby: 'rinkeby' as Network,
  sokol: 'sokol' as Network,
  ropsten: 'ropsten' as Network,
};
