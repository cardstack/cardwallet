import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { dataUpdateAssets } from '../redux/data';
import useAccountAssets from './useAccountAssets';
import useAccountSettings from './useAccountSettings';
import { getOnChainAssetBalance } from '@cardstack/services/assets';
import { logger } from '@rainbow-me/utils';

export default function useUpdateAssetOnchainBalance() {
  const { allAssets } = useAccountAssets();
  const dispatch = useDispatch();
  const { network } = useAccountSettings();

  const useUpdateAssetOnchainBalance = useCallback(
    async (assetToUpdate, accountAddress, successCallback) => {
      const balance = await getOnChainAssetBalance({
        asset: assetToUpdate,
        accountAddress,
        network,
      });
      if (balance && balance?.amount !== assetToUpdate?.balance?.amount) {
        // Now we need to update the asset
        // First in the state
        successCallback({ ...assetToUpdate, balance });
        // Then in redux
        const allAssetsUpdated = allAssets.map(asset => {
          if (asset.address === assetToUpdate.address) {
            asset.balance = balance;
          }
          return asset;
        });
        await dispatch(dataUpdateAssets(allAssetsUpdated));
        logger.log(
          `balance updated with onchain data for asset ${assetToUpdate.symbol}`,
          balance
        );
      }
    },
    [allAssets, dispatch, network]
  );
  return useUpdateAssetOnchainBalance;
}
