import React, { useCallback } from 'react';

import { useExpandedStateNavigation } from '../../../hooks';
import { Button } from '@cardstack/components';
import Routes from '@rainbow-me/routes';

export default function SendActionButton({ small, asset, safeAddress }) {
  const navigate = useExpandedStateNavigation();

  const handlePress = useCallback(() => {
    const isDepot = !!asset?.tokenAddress;
    const route = isDepot ? Routes.SEND_FLOW_DEPOT : Routes.SEND_FLOW;

    navigate(route, params => ({ ...params, asset, safeAddress }));
  }, [asset, safeAddress, navigate]);

  const variantProp = small ? { variant: 'small' } : {};

  return (
    <Button
      iconProps={{
        iconSize: 'medium',
        marginRight: 2,
        name: 'send',
        top: 2,
      }}
      onPress={handlePress}
      {...variantProp}
    >
      Send
    </Button>
  );
}
