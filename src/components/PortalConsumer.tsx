// We will need to get rid of this OLD PortalConsumer at some point, hopfully in near future
import React, { useEffect } from 'react';
import { LoadingOverlay } from '@cardstack/components';
import { useWallets } from '@rainbow-me/hooks';
import { usePortal } from 'react-native-cool-modals/Portal';

function PortalConsumer() {
  const { isWalletLoading } = useWallets();
  const { setComponent, hide } = usePortal();

  useEffect(() => {
    if (isWalletLoading) {
      setComponent(
        <LoadingOverlay title={isWalletLoading ? isWalletLoading : ''} />,
        true
      );
    } else {
      setComponent(null, false);
    }

    return hide;
  }, [hide, isWalletLoading, setComponent]);

  return null;
}

export default PortalConsumer;
