import React from 'react';
import { useAccountSettings, useInternetStatus } from '../../hooks';
import Toast from './Toast';
import networkInfo from '@rainbow-me/helpers/networkInfo';

const OfflineToast = () => {
  const isConnected = useInternetStatus();
  const { network } = useAccountSettings();

  const networkName = networkInfo[network].shortName;

  return (
    <Toast
      icon="offline"
      isVisible={!isConnected}
      text={`${networkName} (offline)`}
    />
  );
};

const neverRerender = () => true;
export default React.memo(OfflineToast, neverRerender);
