import { useSelector } from 'react-redux';
import { sortAssetsByNativeAmountSelector } from '@rainbow-me/helpers/assetSelectors';

export default function useAccountAssets() {
  const assets = useSelector(sortAssetsByNativeAmountSelector);
  const { collectibles, depots, prepaidCards } = useSelector(state => ({
    collectibles: state.data.collectibles,
    depots: state.data.depots || [],
    prepaidCards: state.data.prepaidCards,
  }));

  console.log('useAccountAssets', JSON.stringify(useAccountAssets));

  return {
    ...assets,
    collectibles,
    depots,
    prepaidCards,
  };
}
