import {
  delay,
  getConstantByNetwork,
  NativeCurrency,
  supportedChains,
} from '@cardstack/cardpay-sdk';
import { toLower, uniqBy } from 'lodash';

import { getPriceAndBalanceInfo } from '@cardstack/helpers';
import { NetworkType } from '@cardstack/types';

import assetTypes from '@rainbow-me/helpers/assetTypes';
import migratedTokens from '@rainbow-me/references/migratedTokens.json';
import logger from 'logger';

import { EOABaseParams, EOATxListResponse } from './eoa-assets-types';

let latestTxBlockNumber: number | null = null;

// Some contracts like SNX / SUSD use an ERC20 proxy
// some of those tokens have been migrated to a new address
// We need to use the current address to fetch the correct price
const getCurrentAddress = (contractAddress: string) => {
  const address = toLower(contractAddress) as keyof typeof migratedTokens;

  return migratedTokens[address] || address;
};

export const fetchAssets = () => {};

const getTokenType = (tokenSymbol: string, tokenName: string) => {
  if (tokenSymbol === 'UNI-V1') return assetTypes.uniswap;
  if (tokenSymbol === 'UNI-V2') return assetTypes.uniswapV2;

  if (toLower(tokenName).indexOf('compound') !== -1 && tokenSymbol !== 'COMP') {
    return assetTypes.compound;
  }

  return undefined;
};

/**
 *  Based on all txs information it maps
 *  all tokens an account has interacted with
 *  usually it doesn't include the native token
 */
export const discoverTokens = async (baseParams: EOABaseParams) => {
  const { network, nativeCurrency, accountAddress } = baseParams;

  const allTxs = await getTxsTokenData(baseParams);

  if (!allTxs.length) return [];

  const nextlatestTxBlockNumber = Number(allTxs[0].blockNumber) + 1;

  latestTxBlockNumber = nextlatestTxBlockNumber;

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

  const tokensInWalletWithPriceAndBalance = await Promise.all(
    uniqueTokensTxs.map(
      async ({
        contractAddress,
        tokenID,
        tokenDecimal,
        tokenSymbol: symbol,
        tokenName: name,
      }) => {
        const address = getCurrentAddress(contractAddress);
        const decimals = Number(tokenDecimal);

        const priceAndBalance = await getPriceAndBalanceInfo({
          prices,
          nativeCurrency,
          accountAddress,
          network,
          asset: {
            name,
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

export const fetchPricesByContractAddress = async (
  addresses: string[],
  { network, nativeCurrency }: Omit<EOABaseParams, 'accountAddress'>
) => {
  const platform = getCoingeckoPlatformName(network);
  const contratAddressQuery = addresses.filter(Boolean).join(',');

  const url = `${COINGECKO_BASE_URL}/token_price/${platform}?contract_addresses=${contratAddressQuery}&vs_currencies=${nativeCurrency}`;

  return fetchHelper(url);
};

export const fetchPricesByCoingeckoId = async (
  id: string,
  nativeCurrency: NativeCurrency
) => {
  const url = `${COINGECKO_BASE_URL}/price?ids=${id}&vs_currencies=${nativeCurrency}&include_24hr_change=true&include_last_updated_at=true`;

  return fetchHelper(url);
};
