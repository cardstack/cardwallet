export enum Network {
  kovan = 'kovan',
  mainnet = 'mainnet',
  sokol = 'sokol',
  gnosis = 'gnosis',
}

// We need to keep this one until
// we have typescript everywhere
export const networkTypes: Record<Network, keyof typeof Network> = {
  kovan: 'kovan',
  mainnet: 'mainnet',
  sokol: 'sokol',
  gnosis: 'gnosis',
};

export default networkTypes;
