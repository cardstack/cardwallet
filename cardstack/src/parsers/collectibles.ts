import { filter, find, get, map, uniq } from 'lodash';

import { AssetType, CollectibleType, AssetTypes } from '@cardstack/types';

export const getNFTFamilies = (nfts: CollectibleType[]): string[] =>
  uniq(map(nfts, c => c.asset_contract.address ?? ''));

export const assetsWithoutNFTs = (assets: AssetType[]) => {
  if (!assets.length) {
    return assets;
  }

  return assets.filter(({ type }) => type !== AssetTypes.nft);
};

export const assetsWithoutNFTsByFamily = (
  assets: AssetType[],
  nftFamilies: string[]
) =>
  filter(
    assets,
    asset =>
      !find(nftFamilies, nftFamily => nftFamily === get(asset, 'address'))
  );
