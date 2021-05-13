export enum Network {
  kovan = 'kovan',
  mainnet = 'mainnet',
  sokol = 'sokol',
  xdai = 'xdai',
}

// We need to keep this one until
// we have typescript everywhere
export const networkTypes = {
  kovan: 'kovan' as Network,
  mainnet: 'mainnet' as Network,
  sokol: 'sokol' as Network,
  xdai: 'xdai' as Network,
};

export default networkTypes;
