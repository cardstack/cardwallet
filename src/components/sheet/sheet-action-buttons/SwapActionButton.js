import React, { useCallback } from 'react';
import { useExpandedStateNavigation } from '../../../hooks';
import { Button } from '@cardstack/components';
import Routes from '@rainbow-me/routes';

export default function SwapActionButton({ inputType }) {
  const navigate = useExpandedStateNavigation(inputType);
  const handlePress = useCallback(
    () =>
      navigate(Routes.EXCHANGE_MODAL, params => ({
        params: {
          params,
          screen: Routes.MAIN_EXCHANGE_SCREEN,
        },
        screen: Routes.MAIN_EXCHANGE_NAVIGATOR,
      })),
    [navigate]
  );

  return (
    <Button
      iconProps={{
        iconSize: 'medium',
        marginRight: 2,
        name: 'swap',
      }}
      onPress={handlePress}
      variant="small"
    >
      Swap
    </Button>
  );
}
