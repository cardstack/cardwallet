import { useSelector } from 'react-redux';
import { sortAssetsByNativeAmountSelector } from '@rainbow-me/helpers/assetSelectors';

export default function useAccountAssets() {
  const assets = useSelector(sortAssetsByNativeAmountSelector);
  const { depots, prepaidCards } = useSelector(state => ({
    depots: state.data.depots,
    prepaidCards: state.data.depots,
  }));

  const collectibles = useSelector(
    ({ uniqueTokens: { uniqueTokens } }) => uniqueTokens
  );

  return {
    ...assets,
    collectibles,
    depots,
    prepaidCards,
  };
}
