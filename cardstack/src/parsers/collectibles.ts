import { filter, find, get, map, uniq } from 'lodash';
import { AssetType, CollectibleType } from '@cardstack/types';

export const getNFTFamilies = (nfts: CollectibleType[]): string[] =>
  uniq(map(nfts, c => c.asset_contract.address ?? ''));

export const assetsWithoutNFTs = (
  assets: AssetType[],
  nfts: CollectibleType[]
) => {
  if (!assets.length) {
    return assets;
  }

  const nftFamilies = getNFTFamilies(nfts);
  return assetsWithoutNFTsByFamily(assets, nftFamilies);
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
