import { useCallback, useState } from 'react';
import { ethereumUtils } from '../utils';

export default function useMaxInputBalance({ selectedFee }) {
  const [maxInputBalance, setMaxInputBalance] = useState(0);

  const updateMaxInputBalance = useCallback(
    async inputCurrency => {
      // Update current balance
      const newInputBalance = await ethereumUtils.getBalanceAmount(
        selectedFee,
        inputCurrency
      );
      setMaxInputBalance(newInputBalance);
      return newInputBalance;
    },
    [selectedFee]
  );

  return {
    maxInputBalance,
    updateMaxInputBalance,
  };
}
