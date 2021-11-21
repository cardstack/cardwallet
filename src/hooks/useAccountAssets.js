import { useSelector } from 'react-redux';
import { sortAssetsByNativeAmountSelector } from '@rainbow-me/helpers/assetSelectors';

export default function useAccountAssets() {
  const assets = useSelector(sortAssetsByNativeAmountSelector);
  const { depots, prepaidCards } = useSelector(state => ({
    depots: state.data.depots || [],
    prepaidCards: state.data.prepaidCards,
  }));

  const collectibles = useSelector(
    ({ collectibles: { collectibles } }) => collectibles
  );

  return {
    ...assets,
    collectibles,
    depots,
    prepaidCards,
  };
}
