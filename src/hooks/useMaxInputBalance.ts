import { fromWei, greaterThan, subtract } from '@cardstack/cardpay-sdk';
import { useCallback, useState } from 'react';
import { isNativeToken } from '@cardstack/utils';

export default function useMaxInputBalance() {
  const [maxInputBalance, setMaxInputBalance] = useState('0');

  const updateMaxInputBalance = useCallback(
    ({ selectedAsset, selectedFee, network }) => {
      const assetAmount = selectedAsset.balance.amount ?? '0';

      if (!isNativeToken(selectedAsset?.symbol, network)) {
        setMaxInputBalance(assetAmount);
        return;
      }

      if (selectedFee) {
        const txFeeAmount = fromWei(selectedFee.value.amount);
        const remaining = subtract(assetAmount, txFeeAmount);
        const updatedBalance = greaterThan(remaining, 0) ? remaining : '0';

        setMaxInputBalance(updatedBalance);
      }
    },
    []
  );

  return {
    maxInputBalance,
    updateMaxInputBalance,
  };
}
