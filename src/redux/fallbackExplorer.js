import { delay, getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { toLower, uniqBy } from 'lodash';

import AssetTypes from '../helpers/assetTypes';
import migratedTokens from '../references/migratedTokens.json';
import testnetAssets from '../references/testnet-assets.json';
import { addressAssetsReceived } from './data';
import store from './store';
import {
  DISCOVER_NEW_ASSETS_FREQUENCY,
  UPDATE_BALANCE_AND_PRICE_FREQUENCY,
} from '@cardstack/constants';
import { getPriceAndBalanceInfo } from '@cardstack/helpers/fallbackExplorerHelper';

import { NetworkType } from '@cardstack/types';
import logger from 'logger';

// -- Constants --------------------------------------- //
const FALLBACK_EXPLORER_CLEAR_STATE = 'explorer/FALLBACK_EXPLORER_CLEAR_STATE';
const FALLBACK_EXPLORER_SET_ASSETS = 'explorer/FALLBACK_EXPLORER_SET_ASSETS';
const FALLBACK_EXPLORER_SET_BALANCE_HANDLER =
  'explorer/FALLBACK_EXPLORER_SET_BALANCE_HANDLER';
const FALLBACK_EXPLORER_SET_HANDLERS =
  'explorer/FALLBACK_EXPLORER_SET_HANDLERS';
const FALLBACK_EXPLORER_SET_LATEST_TX_BLOCK_NUMBER =
  'explorer/FALLBACK_EXPLORER_SET_LATEST_TX_BLOCK_NUMBER';

// Some contracts like SNX / SUSD use an ERC20 proxy
// some of those tokens have been migrated to a new address
// We need to use the current address to fetch the correct price
const getCurrentAddress = contractAddress => {
  const address = toLower(contractAddress);

  return migratedTokens[address] || address;
};

const findNewAssetsToWatch = () => async (dispatch, getState) => {
  const { accountAddress } = getState().settings;
  const { assets, latestTxBlockNumber } = getState().fallbackExplorer;

  const newAssets = await getAccountAssets(
    accountAddress,
    latestTxBlockNumber,
    dispatch
  );
  if (newAssets.length > 0) {
    logger.log('😬 Found new assets!');

    const updateAssets = uniqBy(
      [...assets, ...newAssets],
      token => token.asset.asset_code
    );

    dispatch({
      payload: {
        assets: updateAssets,
      },
      type: FALLBACK_EXPLORER_SET_ASSETS,
    });
  }
};

//TODO: verify why nft on gnosis are missing

const getAccountAssets = async (address, latestTxBlockNumber, dispatch) => {
  // 1 - Discover the list of tokens for the address
  const { network, nativeCurrency, accountAddress } = store.getState().settings;

  const tokensInWallet = await discoverTokens(
    { address, latestTxBlockNumber, network, nativeCurrency, accountAddress },
    dispatch
  );

  if (latestTxBlockNumber && tokensInWallet.length === 0) {
    return [];
  }

  // discoverTokens might not include the native token, so we add it manually
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const nativeTokenIsMissing = !tokensInWallet.some(
    token => token.asset.symbol === nativeTokenSymbol
  );

  if (nativeTokenIsMissing) {
    const coingeckoId = getConstantByNetwork('nativeTokenCoingeckoId', network);

    const nativeTokenPrices = await fetchPricesByCoingeckoId(
      coingeckoId,
      nativeCurrency
    );

    const nativeTokenInfo = {
      asset_code: getConstantByNetwork('nativeTokenAddress', network),
      name: getConstantByNetwork('nativeTokenName', network),
      symbol: nativeTokenSymbol,
      decimals: 18, // TODO: use decimals from sdk on next sdk release
    };

    const { asset_code: address, ...tokenInfo } = nativeTokenInfo;

    const balanceInfo = await getPriceAndBalanceInfo({
      prices: nativeTokenPrices,
      nativeCurrency,
      accountAddress,
      network,
      coingeckoId,
      asset: { address, ...tokenInfo },
    });

    const nativeToken = {
      asset: {
        ...nativeTokenInfo,
        ...balanceInfo,
      },
    };

    return [...tokensInWallet, nativeToken];
  }

  return tokensInWallet;
};

const getTokenType = (tokenSymbol, tokenName) => {
  if (tokenSymbol === 'UNI-V1') return AssetTypes.uniswap;
  if (tokenSymbol === 'UNI-V2') return AssetTypes.uniswapV2;
  if (toLower(tokenName).indexOf('compound') !== -1 && tokenSymbol !== 'COMP')
    return AssetTypes.compound;
  return undefined;
};

/**
 *  Based on all txs information it maps
 *  all tokens an account has interacted with
 *  usually it doesn't include the native token
 */
const discoverTokens = async (baseParams, dispatch) => {
  const { network, nativeCurrency, accountAddress } = baseParams;

  const allTxs = await getTxsTokenData(baseParams);

  if (!allTxs.length) return [];

  const nextlatestTxBlockNumber = Number(allTxs[0].blockNumber) + 1;

  dispatch({
    payload: {
      latestTxBlockNumber: nextlatestTxBlockNumber,
    },
    type: FALLBACK_EXPLORER_SET_LATEST_TX_BLOCK_NUMBER,
  });

  // It can exist multiple txs with the same token, so we filter to get unique assets
  const uniqueTokensTxs = uniqBy(
    allTxs,
    // unique key takes tokenID into account so that we retain all instances of NFTs
    // since NFTS can have the same contractAddress but a diff tokenID
    // while tokens don't have this field it enough to filter by contract address
    token => [token.contractAddress, token.tokenID].filter(Boolean).join('-')
  );

  // Create array of addresses to fetch the prices
  const tokenAddresses = uniqueTokensTxs.map(({ contractAddress }) =>
    getCurrentAddress(contractAddress)
  );

  const prices = await fetchPricesByContractAddress(
    tokenAddresses,
    network,
    nativeCurrency
  );

  const tokensInWalletWithPriceAndBalance = await Promise.all(
    uniqueTokensTxs.map(
      async ({
        contractAddress,
        tokenID,
        tokenDecimal: decimals,
        tokenSymbol: symbol,
        tokenName: name,
      }) => {
        const address = getCurrentAddress(contractAddress);

        const priceAndBalance = await getPriceAndBalanceInfo({
          prices,
          nativeCurrency,
          accountAddress,
          network,
          asset: {
            address,
            decimals,
            symbol,
            tokenID,
          },
        });

        return {
          asset: {
            asset_code: address,
            name,
            tokenID,
            decimals,
            symbol,
            type: getTokenType(symbol, name),
            ...priceAndBalance,
          },
        };
      }
    )
  );

  return tokensInWalletWithPriceAndBalance;
};

/**
 * Fetches all tokens transactions information
 * It's recursive so it fetches all available pages
 */
const getTxsTokenData = async (params, page = 1, previousTx = []) => {
  const { address, latestTxBlockNumber, network } = params;

  const offset = 1000;

  const baseUrl = getConstantByNetwork('apiBaseUrl', network);

  const url = `${baseUrl}?module=account&action=tokentx&address=${address}&page=${page}&offset=${offset}&sort=desc`;

  const request = await fetch(
    `${url}${latestTxBlockNumber ? `&startBlock=${latestTxBlockNumber}` : ''}`
  );

  const { status, result: newTxs, message } = await request.json();

  const allTxs = [...previousTx, ...newTxs];

  if (status === '1' && newTxs.length === offset) {
    if (message.contains('rate limit')) {
      await delay(5000);
    }

    page++;
    return getTxsTokenData(params, page, allTxs);
  }

  return allTxs;
};

const fetchPricesByCoingeckoId = async (id, nativeCurrency) => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${nativeCurrency}&include_24hr_change=true&include_last_updated_at=true`;
    const priceRequest = await fetch(url);
    return priceRequest.json();
  } catch (e) {
    logger.log(`Error trying to fetch ${id} prices`, e);
  }
};

const coingekoPlatform = {
  polygon: 'polygon-pos',
  mumbai: 'polygon-pos',
  mainnet: 'ethereum',
  goerli: 'ethereum',
  gnosis: 'xdai',
  sokol: 'xdai',
};

const fetchPricesByContractAddress = async (
  addresses,
  network,
  nativeCurrency
) => {
  const platform = coingekoPlatform[network];
  const contratAddressQuery = addresses.filter(Boolean).join(',');

  try {
    const url = `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${contratAddressQuery}&vs_currencies=${nativeCurrency}&include_24hr_change=true&include_last_updated_at=true`;
    const priceRequest = await fetch(url);
    return priceRequest.json();
  } catch (e) {
    logger.log(`Error trying to fetch  prices`, e);
  }
};

const skipPoller = true;

export const fetchAssetsBalancesAndPrices = async () => {
  logger.log('😬 FallbackExplorer fetchAssetsBalancesAndPrices');

  const { accountAddress, nativeCurrency, network } = store.getState().settings;

  const {
    assets: currentAssets,
    fallbackExplorerBalancesHandle: currentBalancesTimeout,
  } = store.getState().fallbackExplorer;

  const assets =
    network !== NetworkType.sokol ? currentAssets : testnetAssets.sokol;

  if (!assets || !assets.length) {
    const fallbackExplorerBalancesHandle = setTimeout(
      fetchAssetsBalancesAndPrices,
      UPDATE_BALANCE_AND_PRICE_FREQUENCY
    );

    store.dispatch({
      payload: {
        fallbackExplorerBalancesHandle,
      },
      type: FALLBACK_EXPLORER_SET_BALANCE_HANDLER,
    });
    return;
  }

  try {
    store.dispatch(
      addressAssetsReceived({
        meta: {
          address: accountAddress,
          currency: nativeCurrency,
          status: 'ok',
          network,
        },
        payload: {
          assets: currentAssets,
        },
      })
    );
    logger.log('😬 FallbackExplorer updating success');
  } catch (e) {
    logger.log('😬 FallbackExplorer updating assets error', e);
  }

  if (skipPoller) return;

  let fallbackExplorerAssetsHandle = null;

  fallbackExplorerAssetsHandle = setTimeout(
    () => store.dispatch(findNewAssetsToWatch(accountAddress)),
    DISCOVER_NEW_ASSETS_FREQUENCY
  );

  if (!currentBalancesTimeout) {
    const fallbackExplorerBalancesHandle = setTimeout(
      fetchAssetsBalancesAndPrices,
      UPDATE_BALANCE_AND_PRICE_FREQUENCY
    );

    store.dispatch({
      payload: {
        fallbackExplorerAssetsHandle,
        fallbackExplorerBalancesHandle,
      },
      type: FALLBACK_EXPLORER_SET_HANDLERS,
    });
  }
};

export const fallbackExplorerInit = () => async (dispatch, getState) => {
  const { accountAddress } = getState().settings;
  const { latestTxBlockNumber, assets } = getState().fallbackExplorer;

  const newAssets = await getAccountAssets(
    accountAddress,
    latestTxBlockNumber,
    dispatch
  );

  await dispatch({
    payload: {
      assets: [...assets, ...newAssets],
    },
    type: FALLBACK_EXPLORER_SET_ASSETS,
  });

  return fetchAssetsBalancesAndPrices();
};

export const fallbackExplorerClearState = () => (dispatch, getState) => {
  const {
    fallbackExplorerBalancesHandle,
    fallbackExplorerAssetsHandle,
  } = getState().fallbackExplorer;

  fallbackExplorerBalancesHandle &&
    clearTimeout(fallbackExplorerBalancesHandle);
  fallbackExplorerAssetsHandle && clearTimeout(fallbackExplorerAssetsHandle);
  dispatch({ type: FALLBACK_EXPLORER_CLEAR_STATE });
};

// -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  fallbackExplorerAssetsHandle: null,
  fallbackExplorerBalancesHandle: null,
  latestTxBlockNumber: null,
  assets: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FALLBACK_EXPLORER_SET_ASSETS:
      // eslint-disable-next-line no-case-declarations
      const { assets } = action.payload;

      return {
        ...state,
        assets: assets || state.assets,
      };
    case FALLBACK_EXPLORER_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    case FALLBACK_EXPLORER_SET_LATEST_TX_BLOCK_NUMBER:
      return {
        ...state,
        latestTxBlockNumber: action.payload.latestTxBlockNumber,
      };
    case FALLBACK_EXPLORER_SET_HANDLERS:
      return {
        ...state,
        fallbackExplorerAssetsHandle:
          action.payload.fallbackExplorerAssetsHandle,
        fallbackExplorerBalancesHandle:
          action.payload.fallbackExplorerBalancesHandle,
      };
    case FALLBACK_EXPLORER_SET_BALANCE_HANDLER:
      return {
        ...state,
        fallbackExplorerBalancesHandle:
          action.payload.fallbackExplorerBalancesHandle,
      };
    default:
      return state;
  }
};
