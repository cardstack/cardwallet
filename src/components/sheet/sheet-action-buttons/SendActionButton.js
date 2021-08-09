import React, { useCallback } from 'react';

import isNativeStackAvailable from '../../../helpers/isNativeStackAvailable';
import { useExpandedStateNavigation } from '../../../hooks';
import { Button } from '@cardstack/components';
import Routes from '@rainbow-me/routes';

export default function SendActionButton({ small, asset }) {
  const navigate = useExpandedStateNavigation();
  const handlePress = useCallback(
    () =>
      navigate(Routes.SEND_FLOW, params =>
        isNativeStackAvailable
          ? {
              params: { ...params, asset },
              screen: Routes.SEND_SHEET,
            }
          : { ...params, asset }
      ),
    [navigate, asset]
  );

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
