import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { toLower } from 'lodash';

import store from '@rainbow-me/redux/store';

export default function isETH(address: string): boolean {
  const network = store.getState().settings.network;
  const nativeTokenAddress = getConstantByNetwork(
    'nativeTokenAddress',
    network
  );

  return toLower(address) === nativeTokenAddress;
}
