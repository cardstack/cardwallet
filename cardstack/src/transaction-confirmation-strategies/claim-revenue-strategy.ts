import assert from 'assert';

import {
  getAddressByNetwork,
  isCardPaySupportedNetwork,
} from '@cardstack/cardpay-sdk';

import { fetchHistoricalPrice } from '@cardstack/services';
import {
  ClaimRevenueDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';

import { BaseStrategy } from './base-strategy';
import { decodeParameters } from './decoding-utils';

export class ClaimRevenueStrategy extends BaseStrategy {
  isApplicable(): boolean {
    if (isCardPaySupportedNetwork(this.network)) {
      const revenuePool = getAddressByNetwork('revenuePool', this.network);

      return !!this.verifyingContract && this.message.to === revenuePool;
    }

    return false;
  }

  public async decodeRequest(): Promise<ClaimRevenueDecodedData> {
    assert(typeof this.verifyingContract === 'string');

    const data = this.message.data?.slice(10) || '';

    const { amount, tokenAddress } = decodeParameters<{
      amount: string;
      tokenAddress: string;
    }>(
      [
        { type: 'address', name: 'tokenAddress' },
        { type: 'uint256', name: 'amount' },
      ],
      data
    );

    const tokenData = await this.getTokenData(tokenAddress);
    const currentTimestamp = Date.now();

    const price = await fetchHistoricalPrice(
      tokenData.symbol,
      currentTimestamp,
      this.nativeCurrency
    );

    return {
      amount,
      tokenAddress,
      merchantSafe: this.verifyingContract,
      price,
      token: tokenData,
      type: TransactionConfirmationType.CLAIM_REVENUE,
    };
  }
}
