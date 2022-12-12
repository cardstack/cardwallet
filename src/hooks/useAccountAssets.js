import { useSelector } from 'react-redux';

export default function useAccountAssets() {
  const data = useSelector(({ data }) => ({
    collectibles: data.collectibles,
    depots: data.depots || [],
    prepaidCards: data.prepaidCards,
    assets: data.assets,
  }));

  return { ...data, allAssets: data.assets };
}
