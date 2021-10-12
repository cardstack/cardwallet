import React, { useEffect } from 'react';
import LoadingOverlay from './LoadingOverlay';
// import { LoadingOverlay } from '@rainbow-me/components/modal';
import { useWallets } from '@rainbow-me/hooks';
import { usePortal } from 'react-native-cool-modals/Portal';
import usePayment from '@cardstack/redux/hooks/usePayment';

function PortalConsumer() {
  const { isWalletLoading } = useWallets();
  const { inProcess, processTitle, processSubTitle } = usePayment();
  const { setComponent, hide } = usePortal();

  useEffect(() => {
    if (isWalletLoading || inProcess) {
      setComponent(
        <LoadingOverlay title={processTitle} subTitle={processSubTitle} />,
        true
      );
    } else {
      setComponent(null, false);
    }

    return hide;
  }, [
    hide,
    isWalletLoading,
    setComponent,
    inProcess,
    processTitle,
    processSubTitle,
  ]);

  return null;
}

export default PortalConsumer;
