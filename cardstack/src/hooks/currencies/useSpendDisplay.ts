import { useEffect, useState } from 'react';

import { convertSpendForBalanceDisplay, useWorker } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

export const useSpendToNativeDisplay = ({
  spendAmount,
}: {
  spendAmount: string | number;
}) => {
  const [nativeDisplay, setNativeDisplay] = useState({
    nativeBalanceDisplay: '',
  });

  const { nativeCurrency } = useAccountSettings();

  const { callback: getSpendDisplay } = useWorker(async () => {
    const response = await convertSpendForBalanceDisplay(
      spendAmount,
      nativeCurrency
    );

    setNativeDisplay(response);
  }, [spendAmount, nativeCurrency]);

  console.log({ nativeDisplay });
  useEffect(() => {
    getSpendDisplay();
  }, [getSpendDisplay]);

  return nativeDisplay;
};
