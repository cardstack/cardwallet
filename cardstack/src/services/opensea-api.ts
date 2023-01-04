import { NativeCurrency } from '@cardstack/cardpay-sdk';
import axios, { AxiosResponse } from 'axios';
import { isNil, pick } from 'lodash';
import { OPENSEA_API_KEY } from 'react-native-dotenv';

import { CollectibleType, NetworkType, AssetTypes } from '@cardstack/types';
import { isMainnet } from '@cardstack/utils';

import logger from 'logger';

export const OPENSEA_LIMIT_PER_PAGE = 50;
export const OPENSEA_LIMIT_TOTAL = 2000;

const api = axios.create({
  headers: {
    Accept: 'application/json',
    'X-API-KEY': OPENSEA_API_KEY,
  },
  timeout: 20000, // 20 secs
});

export const apiFetchCollectiblesForOwner = async (
  network: NetworkType,
  nativeCurrency: NativeCurrency,
  ownerAddress: string,
  page: number
): Promise<CollectibleType[]> => {
  try {
    const networkPrefix = isMainnet(network) ? '' : `testnets-`;
    const offset = page * OPENSEA_LIMIT_PER_PAGE;
    const url = `https://${networkPrefix}api.opensea.io/api/v1/assets?owner=${ownerAddress}&limit=${OPENSEA_LIMIT_PER_PAGE}&offset=${offset}`;
    const response = await api.get(url);
    return parseCollectiblesFromOpenSeaResponse(
      response,
      network,
      nativeCurrency
    );
  } catch (error) {
    logger.log('Error getting collectibles from OpenSea', error);
    throw error;
  }
};

const parseCollectiblesFromOpenSeaResponse = (
  response: AxiosResponse<any>,
  network: NetworkType,
  nativeCurrency: NativeCurrency
) => {
  const openSeaAssets = response.data.assets;
  if (isNil(openSeaAssets)) throw new Error('Invalid data from OpenSea');

  return openSeaAssets.map((openSeaAsset: any) => {
    const { tokenID, asset_contract, background_color } = openSeaAsset;

    const collectible: CollectibleType = {
      ...pick(openSeaAsset, [
        'animation_url',
        'current_price',
        'description',
        'external_link',
        'image_original_url',
        'image_preview_url',
        'image_thumbnail_url',
        'image_url',
        'name',
        'permalink',
        'traits',
      ]),
      asset_contract: pick(asset_contract, [
        'address',
        'description',
        'external_link',
        'featured_image_url',
        'hidden',
        'image_url',
        'name',
        'nft_version',
        'schema_name',
        'short_description',
        'symbol',
        'total_supply',
        'wiki_link',
      ]),
      background: background_color ? `#${background_color}` : undefined,
      familyImage: asset_contract.image_url,
      id: tokenID,
      isSendable:
        asset_contract.nft_version === '1.0' ||
        asset_contract.nft_version === '3.0' ||
        asset_contract.schema_name === 'ERC1155',
      lastPrice: openSeaAsset.last_sale
        ? Number(openSeaAsset.last_sale.total_price)
        : null,
      type: AssetTypes.nft,
      nativeCurrency,
      networkName: network,
    };

    return collectible;
  });
};
