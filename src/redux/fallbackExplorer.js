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
import {
  mapTokenAddressToCoingeckoId,
  reduceAssetsWithPriceChartAndBalances,
} from '@cardstack/helpers/fallbackExplorerHelper';
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

  const coingeckoIds = await mapTokenAddressToCoingeckoId(
    network,
    coingeckoCoinsCache.current
  );

  const tokensInWallet = await discoverTokens(
    coingeckoIds,
    address,
    latestTxBlockNumber,
    network,
    dispatch
  );

  if (latestTxBlockNumber && tokensInWallet.length === 0) {
    return [];
  }

  const nativeTokenAddress = getConstantByNetwork(
    'nativeTokenAddress',
    network
  );
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);
  const nativeTokenName = getConstantByNetwork('nativeTokenName', network);
  const nativeTokenCoingeckoId = getConstantByNetwork(
    'nativeTokenCoingeckoId',
    network
  );
  const nativeToken = {
    asset: {
      asset_code: nativeTokenAddress,
      coingecko_id: nativeTokenCoingeckoId,
      decimals: 18,
      name: nativeTokenName,
      symbol: nativeTokenSymbol,
    },
  };
  const tokensHaveNativeToken = Boolean(
    tokensInWallet.find(token => token.asset.symbol === nativeTokenSymbol)
  );
  const nativeTokenArray = tokensHaveNativeToken ? [] : [nativeToken];

  return [...tokensInWallet, ...nativeTokenArray];
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

const discoverTokens = async (
  coingeckoIds,
  address,
  latestTxBlockNumber,
  network,
  dispatch
) => {
  let page = 1;
  const offset = 1000;
  let allTxs = [];
  let poll = true;
  while (poll) {
    const txs = await getTokenTxData(
      address,
      page,
      offset,
      latestTxBlockNumber,
      network
    );
    if (txs && txs.length > 0) {
      allTxs = allTxs.concat(txs);
      if (txs.length < offset) {
        // Last page
        poll = false;
      } else {
        // Keep polling
        page++;
        await delay(260);
      }
    } else {
      // No txs
      poll = false;
    }
  }

  // Filter txs by contract address
  if (allTxs.length > 0) {
    const nextlatestTxBlockNumber = Number(allTxs[0].blockNumber) + 1;
    dispatch({
      payload: {
        latestTxBlockNumber: nextlatestTxBlockNumber,
      },
      type: FALLBACK_EXPLORER_SET_LATEST_TX_BLOCK_NUMBER,
    });

    return uniqBy(
      allTxs.map(tx => {
        const type = getTokenType(tx);
        const coingeckoId = coingeckoIds[tx.contractAddress.toLowerCase()];

        return {
          asset: {
            asset_code: getCurrentAddress(tx.contractAddress.toLowerCase()),
            token_id: tx.tokenID,
            coingecko_id: coingeckoId || null,
            decimals: Number(tx.tokenDecimal),
            name: tx.tokenName,
            symbol: tx.tokenSymbol,
            type,
          },
        };
      }),
      token =>
        [token.asset.asset_code, token.asset.token_id].filter(Boolean).join('-') // unique key takes token_id into account so that we retain all instances of NFTs
    );
  }
  return [];
};

const getTokenTxData = async (
  address,
  page,
  offset,
  latestTxBlockNumber,
  network
) => {
  const baseUrl = getConstantByNetwork('apiBaseUrl', network);
  let url = `${baseUrl}?module=account&action=tokentx&address=${address}&page=${page}&offset=${offset}&sort=desc`;
  if (latestTxBlockNumber) {
    url += `&startBlock=${latestTxBlockNumber}`;
  }
  const request = await fetch(url);
  const { status, result } = await request.json();

  if (status === '1' && result?.length > 0) {
    return result;
  }
  return null;
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
