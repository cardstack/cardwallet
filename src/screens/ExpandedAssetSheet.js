import { useRoute } from '@react-navigation/native';
import { createElement } from 'react';

import {
  AvailableBalancesExpandedState,
  ChartExpandedState,
} from '../components/expanded-state';
import { useAsset } from '../hooks';
import { ExpandedMerchantRoutes } from '@cardstack/components';

const ScreenTypes = {
  token: ChartExpandedState,
  [ExpandedMerchantRoutes.availableBalances]: AvailableBalancesExpandedState,
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
