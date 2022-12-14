import {
  delay,
  getConstantByNetwork,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import { BN } from 'ethereumjs-util';
import { toLower, uniqBy } from 'lodash';
import Web3 from 'web3';

import { AssetTypes } from '@cardstack/types';

import {
  getAssets,
  saveAssets,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import { assetsVersion } from '@rainbow-me/handlers/localstorage/common';
import { shitcoins } from '@rainbow-me/references';
import migratedTokens from '@rainbow-me/references/migratedTokens.json';
import logger from 'logger';

import { getNativeBalanceFromOracle } from '..';
import { getOnChainAssetBalance } from '../assets';

import {
  Asset,
  EOABaseParams,
  EOATxListResponse,
  GetTokensBalanceParams,
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

  const { latestTxBlockNumber, assets: localStoredAssets } = (await getAssets(
    accountAddress,
    network,
    assetsVersion
  )) as { assets: Asset[]; latestTxBlockNumber?: number };

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
  );

  const newTokens = uniqueTokensTxs.reduce((tokens, token) => {
    const {
      contractAddress,
      tokenID,
      tokenDecimal,
      tokenSymbol: symbol,
      tokenName: name,
    } = token;

    const address = getCurrentAddress(contractAddress);
    const type = getTokenType(symbol, name, tokenID);

    // Remove spammy tokens
    if (shitcoins.includes(address) || type === AssetTypes.compound) {
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
      if (message.contains('rate limit')) {
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

  const tokensWithBalance = await Promise.all(
    tokens.filter(async asset => {
      const balance = await getOnChainAssetBalance({
        asset,
        accountAddress,
        network,
      });

      return !new BN(balance.amount).isZero();
    })
  );

  // discoverTokens might not include the native token, so we add it manually
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const nativeTokenIsMissing = !tokens.some(
    token => token?.symbol === nativeTokenSymbol
  );

  if (nativeTokenIsMissing) {
    const nativeToken = {
      address: getConstantByNetwork('nativeTokenAddress', network),
      name: getConstantByNetwork('nativeTokenName', network),
      symbol: nativeTokenSymbol,
      decimals: 18, // TODO: use decimals from sdk on next sdk release,
      id: getConstantByNetwork('nativeTokenAddress', network),
      type: AssetTypes.token,
    };

    // Native token should always appear even if it has no balance
    tokensWithBalance.concat(nativeToken); // Modifying array to avoid undefined values
  }

  // Store assets and block to just fetch newest tx on refresh
  await saveAssets(
    { assets: tokensWithBalance, latestTxBlockNumber },
    network,
    assetsVersion
  );

  return tokensWithBalance;
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
  }, Promise.resolve({}));

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
    Promise.resolve({})
  );

  return tokensBalance;
};
