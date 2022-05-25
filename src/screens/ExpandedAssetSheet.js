import { useRoute } from '@react-navigation/native';
import { createElement } from 'react';

import { ChartExpandedState } from '../components/expanded-state';
import { useAsset } from '../hooks';

const ScreenTypes = {
  token: ChartExpandedState,
};

export default function ExpandedAssetSheet(props) {
  const { params } = useRoute();

  const selectedAsset = useAsset(params.asset);

  return createElement(ScreenTypes[params.type], {
    asset: selectedAsset,
    safeAddress: params?.safeAddress,
    ...props,
  });
}
