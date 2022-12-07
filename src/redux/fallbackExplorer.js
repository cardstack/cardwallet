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
import { reduceAssetsWithPriceChartAndBalances } from '@cardstack/helpers/fallbackExplorerHelper';
import { NetworkType } from '@cardstack/types';
import coingeckoIdsFallback from '@rainbow-me/references/coingecko/ids.json';
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
const getCurrentAddress = address => {
  return migratedTokens[address] || address;
};

const findNewAssetsToWatch = () => async (dispatch, getState) => {
  const { accountAddress } = getState().settings;
  const { assets, latestTxBlockNumber } = getState().fallbackExplorer;

  const newAssets = await findAssetsToWatch(
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

const coingeckoCoinsCache = { current: null };

const fetchCoingeckoCoins = async () => {
  try {
    const request = await fetch(
      'https://api.coingecko.com/api/v3/coins/list?include_platform=true&asset_platform_id=ethereum'
    );
    const coingeckoCoins = await request.json();

    return coingeckoCoins;
  } catch (error) {
    return coingeckoIdsFallback;
  }
};
const findAssetsToWatch = async (address, latestTxBlockNumber, dispatch) => {
  // 1 - Discover the list of tokens for the address
  const network = store.getState().settings.network;

  coingeckoCoinsCache.current =
    coingeckoCoinsCache.current || (await fetchCoingeckoCoins());

  const tokensInWallet = await discoverTokens(
    { address, latestTxBlockNumber, network },
    dispatch
  );

  if (latestTxBlockNumber && tokensInWallet.length === 0) {
    return [];
  }

  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const nativeTokenIsMissing = !tokensInWallet.some(
    token => token.asset.symbol === nativeTokenSymbol
  );

  if (nativeTokenIsMissing) {
    const nativeToken = {
      asset: {
        asset_code: getConstantByNetwork('nativeTokenAddress', network),
        coingecko_id: getConstantByNetwork('nativeTokenCoingeckoId', network),
        name: getConstantByNetwork('nativeTokenName', network),
        symbol: nativeTokenSymbol,
        decimals: 18,
      },
    };

    return [...tokensInWallet, nativeToken];
  }

  return tokensInWallet;
};

const getTokenType = tx => {
  if (tx.tokenSymbol === 'UNI-V1') return AssetTypes.uniswap;
  if (tx.tokenSymbol === 'UNI-V2') return AssetTypes.uniswapV2;
  if (
    toLower(tx.tokenName).indexOf('compound') !== -1 &&
    tx.tokenSymbol !== 'COMP'
  )
    return AssetTypes.compound;
  return undefined;
};

/**
 *  Based on all tx information it maps
 *  all tokens an account has interacted with
 */
const discoverTokens = async (baseParams, dispatch) => {
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

  return uniqueTokensTxs.map(tx => ({
    asset: {
      asset_code: getCurrentAddress(tx.contractAddress.toLowerCase()),
      token_id: tx.tokenID,
      decimals: Number(tx.tokenDecimal),
      name: tx.tokenName,
      symbol: tx.tokenSymbol,
      type: getTokenType(tx),
    },
  }));
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

const fetchAssetPrices = async (coingeckoIds, nativeCurrency) => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds
      .filter(val => !!val)
      .sort()
      .join(
        ','
      )}&vs_currencies=${nativeCurrency}&include_24hr_change=true&include_last_updated_at=true`;
    const priceRequest = await fetch(url);
    return priceRequest.json();
  } catch (e) {
    logger.log(`Error trying to fetch ${coingeckoIds} prices`, e);
  }
};

const fetchAssetCharts = async (coingeckoIds, nativeCurrency) => {
  try {
    const chartData = await Promise.all(
      coingeckoIds.map(async coingeckoId => {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=${nativeCurrency}&days=1`
        );
        const data = await response.json();
        return data;
      })
    );

    const payload = coingeckoIds.reduce(
      (accum, id, index) => ({
        ...accum,
        [id]: chartData[index].prices,
      }),
      {}
    );

    return payload;
  } catch (e) {
    logger.log(`Error trying to fetch ${coingeckoIds} charts`, e);
  }
};

const skipPoller = true;

export const fetchAssetsBalancesAndPrices = async () => {
  logger.log('😬 FallbackExplorer fetchAssetsBalancesAndPrices');

  const { accountAddress, nativeCurrency, network } = store.getState().settings;

  const formattedNativeCurrency = toLower(nativeCurrency);

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
    const coingeckoIds = assets.reduce((ids, { asset: { coingecko_id } }) => {
      if (coingecko_id) {
        return [...ids, coingecko_id];
      }

      return ids;
    }, []);

    const fetchPrices = fetchAssetPrices(coingeckoIds, formattedNativeCurrency);

    const fetchChartData = fetchAssetCharts(
      coingeckoIds,
      formattedNativeCurrency
    );

    const [prices, chartData] = await Promise.all([
      fetchPrices,
      fetchChartData,
    ]);

    const updatedAssets = await reduceAssetsWithPriceChartAndBalances({
      assets,
      prices,
      formattedNativeCurrency,
      chartData,
      network,
      nativeCurrency,
      accountAddress,
    });

    logger.log('😬 FallbackExplorer updating assets');

    store.dispatch(
      addressAssetsReceived({
        meta: {
          address: accountAddress,
          currency: nativeCurrency,
          status: 'ok',
          network,
        },
        payload: {
          assets: updatedAssets,
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

  const newAssets = await findAssetsToWatch(
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
