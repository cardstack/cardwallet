// We will need to get rid of this OLD PortalConsumer at some point, hopfully in near future
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@cardstack/components';
import usePayment from '@cardstack/redux/hooks/usePayment';
import { useWallets } from '@rainbow-me/hooks';
import { usePortal } from 'react-native-cool-modals/Portal';

function PortalConsumer() {
  const { isWalletLoading } = useWallets();
  const { inProcess, processTitle, processSubTitle } = usePayment();
  const { setComponent, hide } = usePortal();

  useEffect(() => {
    if (isWalletLoading || inProcess) {
      setComponent(
        <LoadingOverlay
          subTitle={processSubTitle}
          title={isWalletLoading ? isWalletLoading : processTitle}
        />,
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
