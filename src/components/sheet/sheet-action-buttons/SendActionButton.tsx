import React, { useCallback } from 'react';

import { useExpandedStateNavigation } from '../../../hooks';
import { Button } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';

interface SendActionButtonProps {
  asset?: any;
  safeAddress?: string;
  small?: boolean;
}

export default function SendActionButton({
  asset,
  safeAddress,
  small,
}: SendActionButtonProps) {
  const navigate = useExpandedStateNavigation();

  const handlePress = useCallback(() => {
    const isSafe = !!asset?.tokenAddress;
    const route = isSafe ? Routes.SEND_FLOW_DEPOT : Routes.SEND_FLOW_EOA;

    navigate(route, (params: any) => ({ ...params, asset, safeAddress }));
  }, [asset, safeAddress, navigate]);

  const variantProp = small ? { variant: 'small' } : {};

  return (
    // @ts-expect-error could not figure out how to type variant prop
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
