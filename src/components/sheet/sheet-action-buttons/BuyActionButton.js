import React, { useCallback } from 'react';

import SheetActionButton from './SheetActionButton';
import { Routes } from '@cardstack/navigation';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import { useExpandedStateNavigation, useWallets } from '@rainbow-me/hooks';

export default function BuyActionButton({ color: givenColor, ...props }) {
  const { colors } = useTheme();
  const color = givenColor || colors.paleBlue;
  const navigate = useExpandedStateNavigation();
  const { isDamaged } = useWallets();

  const handlePress = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }

    if (ios) {
      navigate(Routes.ADD_CASH_FLOW, params => params);
    } else {
      navigate(Routes.WYRE_WEBVIEW, params => params);
    }
  }, [navigate, isDamaged]);

  return (
    <SheetActionButton
      {...props}
      color={color}
      label="􀍰 Buy more ETH"
      onPress={handlePress}
      weight="bold"
    />
  );
}
