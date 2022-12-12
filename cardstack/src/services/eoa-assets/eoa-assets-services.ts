import {
  delay,
  getConstantByNetwork,
  NativeCurrency,
  supportedChains,
} from '@cardstack/cardpay-sdk';
import { toLower, uniqBy } from 'lodash';

import { getPriceAndBalanceInfo } from '@cardstack/helpers';
import { AssetTypes, NetworkType } from '@cardstack/types';

import { parseAssetName, parseAssetSymbol } from '@rainbow-me/parsers';
import { shitcoins } from '@rainbow-me/references';
import migratedTokens from '@rainbow-me/references/migratedTokens.json';
import { getTokenMetadata } from '@rainbow-me/utils';
import logger from 'logger';

import { EOABaseParams, EOATxListResponse } from './eoa-assets-types';

// TODO: store lastestTXBlock on storage with assets
let latestTxBlockNumber: number | null = null;

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
 *  Based on all txs information it maps
 *  all tokens an account has interacted with
 *  usually it doesn't include the native token
 */
const discoverTokens = async (baseParams: EOABaseParams) => {
  const { network, nativeCurrency, accountAddress } = baseParams;

  const allTxs = await getTxsTokenData(baseParams);

  if (!allTxs.length) return [];

  // Handle latestBlock
  // const nextlatestTxBlockNumber = Number(allTxs[0].blockNumber) + 1;

  // latestTxBlockNumber = nextlatestTxBlockNumber;

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

  const prices = await fetchPricesByContractAddress(tokenAddresses, {
    network,
    nativeCurrency,
  });

  const tokensWithBalance = await Promise.all(
    uniqueTokensTxs.map(
      async ({
        contractAddress,
        tokenID,
        tokenDecimal,
        tokenSymbol: symbol,
        tokenName: name,
      }) => {
        const asset = {
          address: getCurrentAddress(contractAddress),
          decimals: Number(tokenDecimal),
          type: getTokenType(symbol, name, tokenID),
          symbol,
        };

        // Remove spammy tokens
        if (
          shitcoins.includes(asset.address) ||
          asset.type === AssetTypes.compound
        ) {
          return;
        }

        const { balance, ...priceAndNative } = await getPriceAndBalanceInfo({
          prices,
          nativeCurrency,
          accountAddress,
          network,
          asset,
        });

        // No balance means the user doesn't own the asset anymore.
        if (!balance.amount) {
          return;
        }

        // TODO: verify if we should continue to use rainbow token list
        const metadata = getTokenMetadata(asset.address);
        const nameFromList = parseAssetName(metadata, name);
        const symbolFromList = parseAssetSymbol(metadata, symbol);

        return {
          ...metadata,
          ...asset,
          asset_code: asset.address,
          name: nameFromList,
          symbol: symbolFromList,
          tokenID,
          balance,
          uniqueId: tokenID || asset.address || name,
          ...priceAndNative,
        };
      }
    )
  );

  return tokensWithBalance.filter(Boolean);
};

/**
 * Fetches all tokens transactions information
 * It's recursive so it fetches all available pages
 */
const getTxsTokenData = async (
  params: EOABaseParams,
  page = 1,
  previousTx: EOATxListResponse = []
): Promise<EOATxListResponse> => {
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

    return getTxsTokenData(params, page, allTxs);
  }

  return allTxs;
};

const fetchHelper = async (url: string) => {
  try {
    const priceRequest = await fetch(url);
    return priceRequest.json();
  } catch (e) {
    logger.log(`Error trying to fetch ${url}`, e);
  }
};

// Maybe add to constants sdk ?
const getCoingeckoPlatformName = (network: NetworkType) => {
  const { ethereum, polygon, gnosis } = supportedChains;
  if (ethereum.includes(network)) return 'ethereum';
  if (polygon.includes(network)) return 'polygon-pos';
  if (gnosis.includes(network)) return 'xdai';
};

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3/simple';

const fetchPricesByContractAddress = async (
  addresses: string[],
  { network, nativeCurrency }: Omit<EOABaseParams, 'accountAddress'>
) => {
  const platform = getCoingeckoPlatformName(network);
  const contratAddressQuery = addresses.filter(Boolean).join(',');

  const url = `${COINGECKO_BASE_URL}/token_price/${platform}?contract_addresses=${contratAddressQuery}&vs_currencies=${nativeCurrency}`;

  return fetchHelper(url);
};

const fetchPricesByCoingeckoId = async (
  id: string,
  nativeCurrency: NativeCurrency
) => {
  const url = `${COINGECKO_BASE_URL}/price?ids=${id}&vs_currencies=${nativeCurrency}&include_24hr_change=true&include_last_updated_at=true`;

  return fetchHelper(url);
};

export const getAccountAssets = async ({
  network,
  nativeCurrency,
  accountAddress,
}: EOABaseParams) => {
  // Discover the list of tokens for the address
  const tokensInWallet = await discoverTokens({
    network,
    nativeCurrency,
    accountAddress,
  });

  // discoverTokens might not include the native token, so we add it manually
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const nativeTokenIsMissing = !tokensInWallet.some(
    token => token?.symbol === nativeTokenSymbol
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
      ...nativeTokenInfo,
      ...balanceInfo,
    };

    return [...tokensInWallet, nativeToken];
  }

  return tokensInWallet;
};
