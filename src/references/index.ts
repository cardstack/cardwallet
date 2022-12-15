import { DAI_ADDRESS, WBTC_ADDRESS } from './addresses';
import savingAssets from './compound/saving-assets.json';

export {
  PAIR_GET_RESERVES_CALL_DATA,
  PAIR_GET_RESERVES_FRAGMENT,
  PAIR_INTERFACE,
  RAINBOW_TOKEN_LIST,
} from './uniswap';
export { default as compoundCERC20ABI } from './compound/compound-cerc20-abi.json';
export { default as compoundCETHABI } from './compound/compound-ceth-abi.json';
export { default as emojis } from './emojis.json';
export { default as erc20ABI } from './erc20-abi.json';
export { default as erc721ABI } from './erc721-abi.json';
export { default as ethUnits } from './ethereum-units.json';
export { default as shitcoins } from './shitcoins.json';

export const ETH_ICON_URL = 'https://s3.amazonaws.com/token-icons/eth.png';

export const TRANSFER_EVENT_TOPIC_LENGTH = 3;
export const TRANSFER_EVENT_KECCAK =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export const DefaultUniswapFavorites = {
  mainnet: ['eth', DAI_ADDRESS, WBTC_ADDRESS],
  rinkeby: [
    // Ethereum
    'eth',
    // DAI
    '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
  ],
};

export const savingsAssetsList = savingAssets;
