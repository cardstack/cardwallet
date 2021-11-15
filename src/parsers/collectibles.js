import { filter, find, get, isNil, map, pick, uniq } from 'lodash';
import AssetTypes from '../helpers/assetTypes';

/**
 * @desc parse collectibles from opensea
 * @param  {Object}
 * @return {Array}
 */
export const parseCollectiblesFromOpenSeaResponse = data => {
  const erc721s = get(data, 'data.assets', null);
  if (isNil(erc721s)) throw new Error('Invalid data from OpenSea');
  return erc721s.map(
    ({ asset_contract, background_color, token_id, ...asset }) => ({
      ...pick(asset, [
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
      background: background_color ? `#${background_color}` : null,
      familyImage: asset_contract.image_url,
      id: token_id,
      isSendable:
        asset_contract.nft_version === '1.0' ||
        asset_contract.nft_version === '3.0' ||
        asset_contract.schema_name === 'ERC1155',
      lastPrice: asset.last_sale ? Number(asset.last_sale.total_price) : null,
      type: AssetTypes.nft,
      uniqueId: `${get(asset_contract, 'address')}_${token_id}`,
    })
  );
};

export const getNFTFamilies = nfts =>
  uniq(map(nfts, u => get(u, 'asset_contract.address', '')));

export const assetsWithoutNFTs = (assets, nfts) => {
  if (!assets.length) {
    return assets;
  }
  const nftFamilies = getNFTFamilies(nfts);
  return filter(assets, asset => {
    return !find(
      nftFamilies,
      nftFamily => nftFamily === get(asset, 'asset.asset_code')
    );
  });
};

export const assetsWithoutNFTsByFamily = (assets, nftFamilies) =>
  filter(
    assets,
    asset =>
      !find(nftFamilies, nftFamily => nftFamily === get(asset, 'address'))
  );
