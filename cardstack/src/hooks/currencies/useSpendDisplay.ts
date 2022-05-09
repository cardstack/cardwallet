import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { useEffect, useState } from 'react';

import { convertSpendForBalanceDisplay, useWorker } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

export const useSpendToNativeDisplay = ({
  spendAmount,
  customNativeCurrency,
}: {
  spendAmount: string | number;
  customNativeCurrency?: NativeCurrency;
}) => {
  const [nativeDisplay, setNativeDisplay] = useState({
    nativeBalanceDisplay: '-----',
  });

  const { nativeCurrency } = useAccountSettings();

  const { callback: getSpendDisplay } = useWorker(async () => {
    const response = await convertSpendForBalanceDisplay(
      spendAmount,
      customNativeCurrency || nativeCurrency
    );

    setNativeDisplay(response);
  }, [spendAmount, customNativeCurrency, nativeCurrency]);

  useEffect(() => {
    getSpendDisplay();
  }, [getSpendDisplay]);

  return nativeDisplay;
};
