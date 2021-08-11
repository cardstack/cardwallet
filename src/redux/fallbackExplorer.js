import {
  convertAmountToNativeDisplay,
  delay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { toLower, uniqBy } from 'lodash';

import { web3Provider } from '../handlers/web3';
import AssetTypes from '../helpers/assetTypes';
import networkTypes from '../helpers/networkTypes';
import balanceCheckerContractAbi from '../references/balances-checker-abi.json';
import migratedTokens from '../references/migratedTokens.json';
import testnetAssets from '../references/testnet-assets.json';
import { addressAssetsReceived } from './data';
import store from './store';
import { addGnosisTokenPrices, fetchGnosisSafes } from '@cardstack/services';
import { isLayer1, isMainnet, isNativeToken } from '@cardstack/utils';
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

const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
const COINGECKO_IDS_ENDPOINT =
  'https://api.coingecko.com/api/v3/coins/list?include_platform=true&asset_platform_id=ethereum';
const HONEYSWAP_ENDPOINT = 'https://tokens.honeyswap.org';
const UPDATE_BALANCE_AND_PRICE_FREQUENCY = 10000;
const DISCOVER_NEW_ASSETS_FREQUENCY = 13000;

// Some contracts like SNX / SUSD use an ERC20 proxy
// some of those tokens have been migrated to a new address
// We need to use the current address to fetch the correct price
const getCurrentAddress = address => {
  return migratedTokens[address] || address;
};

const findNewAssetsToWatch = () => async (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  const {
    xdaiChainAssets,
    mainnetAssets,
    latestTxBlockNumber,
  } = getState().fallbackExplorer;

  const newAssets = await findAssetsToWatch(
    accountAddress,
    latestTxBlockNumber,
    dispatch
  );
  if (newAssets.length > 0) {
    logger.log('😬 Found new assets!', newAssets);

    const assets =
      network === networkTypes.xdai
        ? {
            xdaiChainAssets: uniqBy(
              [...xdaiChainAssets, ...newAssets],
              token => token.asset.asset_code
            ),
          }
        : {
            mainnetAssets: uniqBy(
              [...mainnetAssets, ...newAssets],
              token => token.asset.asset_code
            ),
          };

    dispatch({
      payload: {
        ...assets,
      },
      type: FALLBACK_EXPLORER_SET_ASSETS,
    });
  }
};

const isValidAddress = address => address && address.substr(0, 2) === '0x';

const fetchCoingeckoIds = async (network, coingeckoCoins) => {
  const idsMap = {};
  if (isLayer1(network)) {
    coingeckoCoins.forEach(({ id, platforms: { ethereum: tokenAddress } }) => {
      const address = tokenAddress && toLower(tokenAddress);
      if (address && isValidAddress(address)) {
        idsMap[address] = id;
      }
    });
  } else if (network === networkTypes.sokol) {
    testnetAssets['sokol'].forEach(({ asset }) => {
      idsMap[asset.asset_code] = asset.coingecko_id;
    });
  } else {
    const honeyswapRequest = await fetch(HONEYSWAP_ENDPOINT);
    const data = await honeyswapRequest.json();
    const honeyswapTokens = data.tokens;

    honeyswapTokens.forEach(({ address: tokenAddress, symbol }) => {
      const coingeckoToken = coingeckoCoins.find(
        token => toLower(token.symbol) === toLower(symbol)
      );
      const address = tokenAddress && toLower(tokenAddress);

      if (coingeckoToken && isValidAddress(address)) {
        idsMap[address] = coingeckoToken.id;
      }
    });
  }

  return idsMap;
};

const findAssetsToWatch = async (
  address,
  latestTxBlockNumber,
  dispatch,
  coingeckoCoins
) => {
  // 1 - Discover the list of tokens for the address
  const network = store.getState().settings.network;
  const coingeckoIds = await fetchCoingeckoIds(network, coingeckoCoins);

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
            coingecko_id: coingeckoId || null,
            decimals: Number(tx.tokenDecimal),
            name: tx.tokenName,
            symbol: tx.tokenSymbol,
            type,
          },
        };
      }),
      token => token.asset.asset_code
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

const fetchAssetBalances = async (tokens, address, network) => {
  try {
    const balanceCheckerContractAddress = getConstantByNetwork(
      'balanceCheckerContractAddress',
      network
    );
    const balanceCheckerContract = new Contract(
      balanceCheckerContractAddress,
      balanceCheckerContractAbi,
      web3Provider
    );

    const values = await balanceCheckerContract.balances([address], tokens);

    const balances = {};
    [address].forEach((addr, addrIdx) => {
      balances[addr] = {};
      tokens.forEach((tokenAddr, tokenIdx) => {
        const balance = values[addrIdx * tokens.length + tokenIdx];
        balances[addr][tokenAddr] = balance.toString();
      });
    });
    return balances[address];
  } catch (e) {
    logger.log(
      'Error fetching balances from balanceCheckerContract',
      network,
      e
    );
    return null;
  }
};

export const fetchAssetsBalancesAndPrices = async () => {
  logger.log('😬 FallbackExplorer fetchAssetsBalancesAndPrices');
  const { accountAddress, nativeCurrency, network } = store.getState().settings;
  const coingeckoCoins = store.getState().coingecko.coins;
  const formattedNativeCurrency = toLower(nativeCurrency);
  const currencyConversionRates = store.getState().currencyConversion.rates;
  const { xdaiChainAssets, mainnetAssets } = store.getState().fallbackExplorer;
  const actualMainnetAssets =
    network === networkTypes.xdai ? xdaiChainAssets : mainnetAssets;
  const assets = isMainnet(network)
    ? actualMainnetAssets
    : testnetAssets[network];
  let depots = null,
    prepaidCards = null,
    merchantSafes = null;

  // not functional on xdai chain yet
  if (network === networkTypes.sokol) {
    try {
      const gnosisSafeData = await fetchGnosisSafes(accountAddress);
      const coingeckoIds = await fetchCoingeckoIds(network, coingeckoCoins);
      const depotsWithIds = gnosisSafeData.depots.map(depot => ({
        ...depot,
        tokens: depot.tokens.map(token => ({
          ...token,
          coingecko_id: coingeckoIds[token.tokenAddress] || null,
        })),
      }));
      const prepaidCardsWithIds = gnosisSafeData.prepaidCards.map(
        prepaidCard => ({
          ...prepaidCard,
          tokens: prepaidCard.tokens.map(token => ({
            ...token,
            coingecko_id: coingeckoIds[token.tokenAddress] || null,
          })),
        })
      );
      const merchantSafesWithIds = gnosisSafeData.merchantSafes.map(
        merchantSafe => ({
          ...merchantSafe,
          tokens: merchantSafe.tokens.map(token => ({
            ...token,
            coingecko_id: coingeckoIds[token.tokenAddress] || null,
          })),
        })
      );

      const gnosisDataWithPrices = await addGnosisTokenPrices(
        {
          depots: depotsWithIds,
          prepaidCards: prepaidCardsWithIds,
          merchantSafes: merchantSafesWithIds,
        },
        network,
        accountAddress,
        nativeCurrency,
        currencyConversionRates
      );

      depots = gnosisDataWithPrices.depots;
      prepaidCards = gnosisDataWithPrices.prepaidCards;
      merchantSafes = gnosisDataWithPrices.merchantSafes;
    } catch (error) {
      logger.error('Error getting Gnosis data', error);
    }
  }

  if (!assets || !assets.length) {
    const fallbackExplorerBalancesHandle = setTimeout(
      fetchAssetsBalancesAndPrices,
      10000
    );
    store.dispatch({
      payload: {
        fallbackExplorerBalancesHandle,
      },
      type: FALLBACK_EXPLORER_SET_BALANCE_HANDLER,
    });
    return;
  }

  const coingeckoIds = assets.reduce((ids, { asset: { coingecko_id } }) => {
    if (coingecko_id) {
      return [...ids, coingecko_id];
    }

    return ids;
  }, []);

  const prices = await fetchAssetPrices(coingeckoIds, formattedNativeCurrency);
  const chartData = await fetchAssetCharts(
    coingeckoIds,
    formattedNativeCurrency
  );

  if (prices) {
    Object.keys(prices).forEach(key => {
      for (let i = 0; i < assets.length; i++) {
        if (toLower(assets[i].asset.coingecko_id) === toLower(key)) {
          assets[i].asset.price = {
            changed_at: prices[key].last_updated_at,
            relative_change_24h:
              prices[key][`${formattedNativeCurrency}_24h_change`],
            value: prices[key][`${formattedNativeCurrency}`],
          };
        } else if (assets[i].asset.coingecko_id === null) {
          assets[i].asset.price = {
            changed_at: null,
            relative_change_24h: 0,
            value: 0,
          };
        }
      }

      if (depots) {
        for (let i = 0; i < depots.length; i++) {
          const depot = depots[i];

          for (let j = 0; j < depot.tokens.length; j++) {
            const token = depot.tokens[j];

            if (toLower(token.coingecko_id) === toLower(key)) {
              const price = prices[key][`${formattedNativeCurrency}`];

              depots[i].tokens[j].price = {
                changed_at: prices[key].last_updated_at,
                relative_change_24h:
                  prices[key][`${formattedNativeCurrency}_24h_change`],
                value: prices[key][`${formattedNativeCurrency}`],
              };

              depots[i].tokens[j].native.price = {
                amount: price,
                display: convertAmountToNativeDisplay(price, nativeCurrency),
              };
            } else if (token.coingecko_id === null) {
              depots[i].tokens[j].price = {
                changed_at: null,
                relative_change_24h: 0,
                value: 0,
              };
              depots[i].tokens[j].native.price = {
                amount: 0,
                display: convertAmountToNativeDisplay(0, nativeCurrency),
              };
            }
          }
        }
      }

      if (prepaidCards) {
        for (let i = 0; i < prepaidCards.length; i++) {
          const prepaidCard = prepaidCards[i];

          for (let j = 0; j < prepaidCard.tokens.length; j++) {
            const token = prepaidCard.tokens[j];

            if (toLower(token.coingecko_id) === toLower(key)) {
              prepaidCards[i].tokens[j].price = {
                changed_at: prices[key].last_updated_at,
                relative_change_24h:
                  prices[key][`${formattedNativeCurrency}_24h_change`],
                value: prices[key][`${formattedNativeCurrency}`],
              };
            } else if (token.coingecko_id === null) {
              prepaidCards[i].tokens[j].price = {
                changed_at: null,
                relative_change_24h: 0,
                value: 0,
              };
            }
          }
        }
      }
    });
  }

  if (chartData) {
    Object.keys(chartData).forEach(coingeckoId => {
      for (let i = 0; i < assets.length; i++) {
        if (toLower(assets[i].asset.coingecko_id) === toLower(coingeckoId)) {
          assets[i].asset.chartPrices = chartData[coingeckoId];
        } else if (assets[i].asset.coingecko_id === null) {
          assets[i].asset.chartPrices = null;
        }

        if (depots) {
          for (let i = 0; i < depots.length; i++) {
            const depot = depots[i];

            for (let j = 0; j < depot.tokens.length; j++) {
              const token = depot.tokens[j];

              if (toLower(token.coingecko_id) === toLower(coingeckoId)) {
                depots[i].tokens[j].chartPrices = chartData[coingeckoId];
              } else if (token.coingecko_id === null) {
                depots[i].tokens[j].chartPrices = null;
              }
            }
          }
        }
      }
    });
  }

  const balances = await fetchAssetBalances(
    assets.map(({ asset: { asset_code, symbol } }) =>
      isNativeToken(symbol, network) ? ETH_ADDRESS : asset_code
    ),
    accountAddress,
    network
  );

  let total = BigNumber.from(0);

  if (balances) {
    Object.keys(balances).forEach(key => {
      for (let i = 0; i < assets.length; i++) {
        if (
          assets[i].asset.asset_code.toLowerCase() === key.toLowerCase() ||
          (isNativeToken(assets[i].asset.symbol, network) &&
            key === ETH_ADDRESS)
        ) {
          assets[i].quantity = balances[key];
          break;
        }
      }
      total = total.add(balances[key]);
    });
  }

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
        assets,
        depots,
        merchantSafes,
        prepaidCards,
      },
    })
  );
  const fallbackExplorerBalancesHandle = setTimeout(
    fetchAssetsBalancesAndPrices,
    UPDATE_BALANCE_AND_PRICE_FREQUENCY
  );
  let fallbackExplorerAssetsHandle = null;
  if (isMainnet(network)) {
    fallbackExplorerAssetsHandle = setTimeout(
      () => store.AssetTypes.dispatch(findNewAssetsToWatch(accountAddress)),
      DISCOVER_NEW_ASSETS_FREQUENCY
    );
  }

  store.dispatch({
    payload: {
      fallbackExplorerAssetsHandle,
      fallbackExplorerBalancesHandle,
    },
    type: FALLBACK_EXPLORER_SET_HANDLERS,
  });
};

export const fallbackExplorerInit = () => async (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  const {
    latestTxBlockNumber,
    mainnetAssets,
    xdaiChainAssets,
  } = getState().fallbackExplorer;
  const coingeckoCoins = getState().coingecko.coins;
  // If mainnet, we need to get all the info
  // 1 - Coingecko ids
  // 2 - All tokens list
  // 3 - Etherscan token transfer transactions
  if (isMainnet(network)) {
    const newMainnetAssets = await findAssetsToWatch(
      accountAddress,
      latestTxBlockNumber,
      dispatch,
      coingeckoCoins
    );
    const assets =
      network === networkTypes.xdai
        ? {
            xdaiChainAssets: xdaiChainAssets.concat(newMainnetAssets),
          }
        : {
            mainnetAssets: mainnetAssets.concat(newMainnetAssets),
          };

    await dispatch({
      payload: {
        ...assets,
      },
      type: FALLBACK_EXPLORER_SET_ASSETS,
    });
  }

  fetchAssetsBalancesAndPrices();
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
  xdaiChainAssets: [],
  mainnetAssets: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FALLBACK_EXPLORER_SET_ASSETS:
      // eslint-disable-next-line no-case-declarations
      const { mainnetAssets, xdaiChainAssets } = action.payload;

      return {
        ...state,
        mainnetAssets: mainnetAssets ? mainnetAssets : state.mainnetAssets,
        xdaiChainAssets: xdaiChainAssets
          ? xdaiChainAssets
          : state.xdaiChainAssets,
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
