import {
  delay,
  getConstantByNetwork,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import { toLower, uniqBy } from 'lodash';
import Web3 from 'web3';

import { collectiblesRefreshState } from '@cardstack/redux/collectibles';
import { Asset, AssetTypes } from '@cardstack/types';

import {
  getAssets,
  saveAssets,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import store from '@rainbow-me/redux/store';
import { spammyTokens } from '@rainbow-me/references';
import migratedTokens from '@rainbow-me/references/migratedTokens.json';
import logger from 'logger';

import { getOnChainAssetBalance } from '../assets';
import { getNativeBalanceFromOracle } from '../exchange-rate-service';

import { Price } from './coingecko/coingecko-types';
import {
  EOABaseParams,
  EOATxListResponse,
  GetTokensBalanceParams,
  GetTokensBalanceResult,
} from './eoa-assets-types';

// Some contracts like SNX / SUSD use an ERC20 proxy
// some of those tokens have been migrated to a new address
// We need to use the current address to fetch the correct price
const getCurrentAddress = (contractAddress: string) => {
  const address = toLower(contractAddress) as keyof typeof migratedTokens;

  return migratedTokens[address] || address;
};

const getTokenType = (
  tokenSymbol: string,
  tokenName: string,
  tokenID?: string
) => {
  if (tokenSymbol === 'UNI-V1') return AssetTypes.uniswap;
  if (tokenSymbol === 'UNI-V2') return AssetTypes.uniswapV2;
  if (tokenID) return AssetTypes.nft;

  if (toLower(tokenName).indexOf('compound') !== -1 && tokenSymbol !== 'COMP') {
    return AssetTypes.compound;
  }

  return AssetTypes.token;
};

/**
 *  Based on all tokenTxs information it maps
 *  all tokens an account has interacted with
 *  usually it doesn't include the native token
 */
const discoverTokens = async (baseParams: EOABaseParams) => {
  const { network, accountAddress } = baseParams;

  const { latestTxBlockNumber, assets: localStoredAssets } = await getAssets(
    accountAddress,
    network
  );

  const allTokensTxs = await getTxsTokenData(baseParams, latestTxBlockNumber);

  if (!allTokensTxs.length) {
    return { tokens: localStoredAssets, latestTxBlockNumber };
  }

  // It can exist multiple txs with the same token, so we filter to get unique assets
  const uniqueTokensTxs = uniqBy(
    allTokensTxs,
    // unique key takes tokenID into account so that we retain all instances of NFTs
    // since NFTS can have the same contractAddress but a diff tokenID
    // while tokens don't have this field its enough to filter by contract address
    token => [token.contractAddress, token.tokenID].filter(Boolean).join('-')
  ).filter(Boolean);

  const newTokens = uniqueTokensTxs.reduce((tokens, token) => {
    const {
      contractAddress,
      tokenID,
      tokenDecimal,
      tokenSymbol,
      tokenName: name,
    } = token;

    const symbol = tokenSymbol?.toUpperCase();
    const address = getCurrentAddress(contractAddress);
    const type = getTokenType(symbol, name, tokenID);

    // Remove spammy tokens
    if (spammyTokens.includes(address) || type === AssetTypes.compound) {
      return tokens;
    }

    const newToken = {
      address,
      name,
      type,
      symbol,
      tokenID,
      decimals: Number(tokenDecimal),
      id: tokenID || address || name,
    };

    return [...tokens, newToken];
  }, [] as Asset[]);

  return {
    // Merge local assets with possible new ones
    tokens: uniqBy([...localStoredAssets, ...newTokens], 'id'),
    latestTxBlockNumber: Number(allTokensTxs[0].blockNumber) + 1, // Stores next block to start discovering tokens from
  };
};

/**
 * Fetches all tokens transactions information
 * It's recursive so it fetches all available pages
 */
const getTxsTokenData = async (
  params: EOABaseParams,
  latestTxBlockNumber?: number,
  page = 1,
  previousTx: EOATxListResponse = []
): Promise<EOATxListResponse> => {
  try {
    const { accountAddress, network } = params;

    const offset = 1000;

    const baseUrl = getConstantByNetwork('apiBaseUrl', network);

    const url = `${baseUrl}?module=account&action=tokentx&address=${accountAddress}&page=${page}&offset=${offset}&sort=desc`;

    const request = await fetch(
      `${url}${latestTxBlockNumber ? `&startBlock=${latestTxBlockNumber}` : ''}`
    );

    const { status, result: newTxs, message } = await request.json();

    const allTxs = [...previousTx, ...newTxs];

    if (status === '1' && newTxs.length === offset) {
      // Some apis might have rate limit, if so we wait before trying again
      if (message?.includes('rate limit')) {
        await delay(5000);
      }

      page++;

      return getTxsTokenData(params, latestTxBlockNumber, page, allTxs);
    }

    return allTxs;
  } catch (e) {
    logger.sentry('[eoa-assets]: getTxsTokenData failed', e);

    return [];
  }
};

export const getAccountAssets = async ({
  network,
  nativeCurrency,
  accountAddress,
}: EOABaseParams) => {
  // Discover the list of tokens for the address
  const { tokens, latestTxBlockNumber } = await discoverTokens({
    network,
    nativeCurrency,
    accountAddress,
  });

  // discoverTokens might not include the native token, so we add it manually
  const nativeToken: Asset = {
    address: getConstantByNetwork('nativeTokenAddress', network),
    name: getConstantByNetwork('nativeTokenName', network),
    symbol: getConstantByNetwork('nativeTokenSymbol', network),
    decimals: getConstantByNetwork('nativeTokenDecimals', network),
    id: getConstantByNetwork('nativeTokenAddress', network),
    type: AssetTypes.token,
  };

  const tokensInWallet = uniqBy([...tokens, nativeToken], token => token.id);

  // Store assets and block to just fetch newest tx on refresh
  await saveAssets(
    tokensInWallet,
    accountAddress,
    network,
    latestTxBlockNumber
  );

  store.dispatch(collectiblesRefreshState());

  return tokensInWallet;
};

export const getCardPayTokensPrice = async ({
  nativeCurrency,
}: {
  nativeCurrency: NativeCurrency;
}) => {
  const cardpayTokens = ['DAI', 'DAI.CPXD', 'CARD', 'CARD.CPXD'];

  const params = {
    nativeCurrency,
    balance: Web3.utils.toWei('1'),
  };

  const tokensPrices = await cardpayTokens.reduce(async (prices, symbol) => {
    const price = await getNativeBalanceFromOracle({
      symbol,
      ...params,
    });

    return { ...(await prices), [symbol]: price };
  }, Promise.resolve({} as Price));

  return tokensPrices;
};

export const getTokensBalances = async ({
  assets,
  accountAddress,
  network,
}: GetTokensBalanceParams) => {
  const tokensBalance = await Object.keys(assets).reduce(
    async (balances, key) => {
      const { symbol = 'ETH', address = 'eth', decimals = 18 } =
        assets[key] || {};

      const tokenBalance = await getOnChainAssetBalance({
        asset: { symbol, address, decimals },
        accountAddress,
        network,
      });

      return { ...(await balances), [address]: tokenBalance };
    },
    Promise.resolve({} as GetTokensBalanceResult)
  );

  return tokensBalance;
};
