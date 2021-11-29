import { fromWei, greaterThanOrEqualTo } from '@cardstack/cardpay-sdk';
import BigNumber from 'bignumber.js';
import { get } from 'lodash';
import { useState, useEffect } from 'react';
import { useIsMessageRequest } from './use-is-message-request';
import { useRouteParams } from './use-route-params';
import { ethereumUtils } from '@rainbow-me/utils';
import { useAccountAssets, useGas } from '@rainbow-me/hooks';

export const useIsBalanceEnough = () => {
  const { allAssets } = useAccountAssets();
  const isMessageRequest = useIsMessageRequest();
  const [isBalanceEnough, setIsBalanceEnough] = useState(true);
  const { isSufficientGas, selectedGasPrice } = useGas();

  const {
    transactionDetails: {
      payload: { params },
    },
  } = useRouteParams();

  useEffect(() => {
    if (isMessageRequest) {
      setIsBalanceEnough(true);

      return;
    }

    if (!isSufficientGas) {
      setIsBalanceEnough(false);

      return;
    }

    const { txFee } = selectedGasPrice;

    if (!txFee) {
      setIsBalanceEnough(false);

      return;
    }

    // Get the TX fee Amount
    const txFeeAmount = fromWei(get(txFee, 'value.amount', 0));

    // Get the gas token balance
    const nativeAsset = ethereumUtils.getNativeTokenAsset(allAssets);
    const balanceAmount = get(nativeAsset, 'balance.amount', 0);

    // Get the TX value
    const txPayload = get(params, '[0]');
    const value = get(txPayload, 'value', 0);

    // Check that there's enough ETH to pay for everything!
    const totalAmount = new BigNumber(fromWei(value)).plus(txFeeAmount);
    const isEnough = greaterThanOrEqualTo(balanceAmount, totalAmount);

    setIsBalanceEnough(isEnough);
  }, [
    allAssets,
    isBalanceEnough,
    isMessageRequest,
    isSufficientGas,
    params,
    selectedGasPrice,
  ]);

  return isBalanceEnough;
};
